import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const requiredEnvironment = ["SUPABASE_URL", "SUPABASE_SECRET_KEY", "FIREBASE_PROJECT_ID"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);
if (missingEnvironment.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(", ")}`);
}

const port = Number(process.env.PORT || 3001);
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const allowedOrigins = new Set(
  (process.env.FRONTEND_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500,http://localhost:5501,http://127.0.0.1:5501")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});
const firebaseKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);
const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by the backend CORS configuration."));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
}));
app.use(express.json({ limit: "32kb" }));

async function requireFirebaseUser(req, res, next) {
  const authorization = req.get("authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return res.status(401).json({ error: "Firebase ID token is required." });

  try {
    const { payload } = await jwtVerify(tokenMatch[1], firebaseKeys, {
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      audience: firebaseProjectId
    });
    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      return res.status(401).json({ error: "Firebase ID token has no user ID." });
    }

    req.firebaseUser = { uid: payload.sub };
    return next();
  } catch (error) {
    console.warn("Firebase ID token rejected:", error.code || error.message);
    return res.status(401).json({ error: "Firebase ID token is invalid or expired." });
  }
}

function isOptionalText(value, maxLength) {
  return value == null || (typeof value === "string" && value.length <= maxLength);
}

function toLikeRow(record, userId) {
  if (
    !record ||
    typeof record !== "object" ||
    typeof record.video_key !== "string" ||
    record.video_key.length === 0 ||
    record.video_key.length > 1024 ||
    typeof record.video_src !== "string" ||
    record.video_src.length === 0 ||
    record.video_src.length > 2048 ||
    !isOptionalText(record.poster_src, 2048) ||
    !isOptionalText(record.collection_name, 512) ||
    !isOptionalText(record.credit, 1000)
  ) {
    return null;
  }

  return {
    user_id: userId,
    video_key: record.video_key,
    video_src: record.video_src,
    poster_src: record.poster_src || null,
    collection_name: record.collection_name || "",
    credit: record.credit || ""
  };
}

app.get("/health", async (_req, res) => {
  const { error } = await supabase.from("video_likes").select("video_key").limit(1);
  if (error) {
    console.error("Supabase health check failed:", error.message);
    return res.status(503).json({ status: "error", error: "Supabase is not reachable or configured." });
  }
  return res.json({ status: "ok" });
});

app.get("/api/liked-videos", requireFirebaseUser, async (req, res) => {
  const { data, error } = await supabase
    .from("video_likes")
    .select("video_key,video_src,poster_src,collection_name,credit,created_at")
    .eq("user_id", req.firebaseUser.uid)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load liked videos:", error.message);
    return res.status(502).json({ error: "Could not load liked videos from Supabase." });
  }
  return res.json(data);
});

app.post("/api/liked-videos", requireFirebaseUser, async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : [req.body];
  if (records.length === 0 || records.length > 100) {
    return res.status(400).json({ error: "Send between 1 and 100 liked videos." });
  }

  const rows = records.map((record) => toLikeRow(record, req.firebaseUser.uid));
  if (rows.some((row) => row === null)) {
    return res.status(400).json({ error: "A video record is invalid or exceeds the allowed field lengths." });
  }

  const { error } = await supabase
    .from("video_likes")
    .upsert(rows, { onConflict: "user_id,video_key" });
  if (error) {
    console.error("Could not save liked videos:", error.message);
    return res.status(502).json({ error: "Could not save liked videos to Supabase." });
  }
  return res.status(204).end();
});

app.delete("/api/liked-videos", requireFirebaseUser, async (req, res) => {
  const videoKey = req.query.video_key;
  if (typeof videoKey !== "string" || videoKey.length === 0 || videoKey.length > 1024) {
    return res.status(400).json({ error: "A valid video_key query parameter is required." });
  }

  const { error } = await supabase
    .from("video_likes")
    .delete()
    .eq("user_id", req.firebaseUser.uid)
    .eq("video_key", videoKey);
  if (error) {
    console.error("Could not remove liked video:", error.message);
    return res.status(502).json({ error: "Could not remove liked video from Supabase." });
  }
  return res.status(204).end();
});

app.use((error, _req, res, _next) => {
  console.error("Backend request failed:", error.message);
  if (res.headersSent) return;
  const status = error.message.includes("CORS configuration") ? 403 : 500;
  return res.status(status).json({ error: status === 403 ? error.message : "Internal backend error." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Liked-videos backend listening on port ${port}.`);
});
