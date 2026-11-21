const firebaseKeysUrl = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const textEncoder = new TextEncoder();
const privateJsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8"
};

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: privateJsonHeaders });
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeJsonPart(value) {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value)));
}

async function authenticate(request, env) {
  const projectId = env.FIREBASE_PROJECT_ID;
  if (!projectId) return { response: jsonResponse({ error: "Firebase project is not configured." }, 500) };

  const tokenMatch = (request.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return { response: jsonResponse({ error: "Firebase ID token is required." }, 401) };

  const tokenParts = tokenMatch[1].split(".");
  if (tokenParts.length !== 3) {
    return { response: jsonResponse({ error: "Firebase ID token is invalid." }, 401) };
  }

  let header;
  let payload;
  let signature;
  try {
    header = decodeJsonPart(tokenParts[0]);
    payload = decodeJsonPart(tokenParts[1]);
    signature = decodeBase64Url(tokenParts[2]);
  } catch {
    return { response: jsonResponse({ error: "Firebase ID token is invalid." }, 401) };
  }

  if (
    !header ||
    typeof header !== "object" ||
    header.alg !== "RS256" ||
    typeof header.kid !== "string" ||
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return { response: jsonResponse({ error: "Firebase ID token is invalid." }, 401) };
  }

  let keySetResponse;
  try {
    keySetResponse = await fetch(firebaseKeysUrl, { cf: { cacheTtl: 300 } });
  } catch (error) {
    console.error("Could not retrieve Firebase verification keys:", error.message);
    return { response: jsonResponse({ error: "Could not verify Firebase login right now." }, 503) };
  }
  if (!keySetResponse.ok) {
    console.error("Firebase key service returned:", keySetResponse.status);
    return { response: jsonResponse({ error: "Could not verify Firebase login right now." }, 503) };
  }

  let keySet;
  try {
    keySet = await keySetResponse.json();
  } catch (error) {
    console.error("Firebase key response was invalid:", error.message);
    return { response: jsonResponse({ error: "Could not verify Firebase login right now." }, 503) };
  }
  const jwk = keySet && Array.isArray(keySet.keys)
    ? keySet.keys.find((key) => key.kid === header.kid && key.kty === "RSA")
    : null;
  if (!jwk) return { response: jsonResponse({ error: "Firebase ID token signing key was not found." }, 401) };

  let signatureIsValid = false;
  try {
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    signatureIsValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signature,
      textEncoder.encode(`${tokenParts[0]}.${tokenParts[1]}`)
    );
  } catch (error) {
    console.error("Firebase token signature verification failed:", error.message);
    return { response: jsonResponse({ error: "Could not verify Firebase login right now." }, 503) };
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    !signatureIsValid ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    payload.aud !== projectId ||
    typeof payload.sub !== "string" ||
    payload.sub.length === 0 ||
    payload.sub.length > 128 ||
    !Number.isFinite(payload.exp) ||
    payload.exp <= now ||
    !Number.isFinite(payload.iat) ||
    payload.iat > now + 60
  ) {
    return { response: jsonResponse({ error: "Firebase ID token is invalid or expired." }, 401) };
  }

  return { uid: payload.sub };
}

function getSupabaseTableUrl(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    throw new Error("Supabase environment variables are not configured.");
  }
  const projectUrl = new URL(env.SUPABASE_URL);
  if (projectUrl.protocol !== "https:") throw new Error("Supabase URL must use HTTPS.");
  return `${projectUrl.origin}/rest/v1/video_likes`;
}

function supabaseHeaders(env, extraHeaders = {}) {
  return {
    apikey: env.SUPABASE_SECRET_KEY,
    Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}`,
    ...extraHeaders
  };
}

function optionalText(value, maxLength) {
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
    !optionalText(record.poster_src, 2048) ||
    !optionalText(record.collection_name, 512) ||
    !optionalText(record.credit, 1000)
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

async function reportSupabaseError(response, action) {
  const details = await response.text();
  console.error(`${action} failed in Supabase:`, details);
  return jsonResponse({ error: `${action} failed in Supabase (${response.status}).` }, 502);
}

async function onRequestGet({ request, env }) {
  const auth = await authenticate(request, env);
  if (auth.response) return auth.response;

  try {
    const query = new URLSearchParams({
      select: "video_key,video_src,poster_src,collection_name,credit,created_at",
      user_id: `eq.${auth.uid}`,
      order: "created_at.desc"
    });
    const response = await fetch(`${getSupabaseTableUrl(env)}?${query}`, {
      headers: supabaseHeaders(env)
    });
    if (!response.ok) return reportSupabaseError(response, "Loading liked videos");
    return new Response(await response.text(), { headers: privateJsonHeaders });
  } catch (error) {
    console.error("Could not load liked videos:", error.message);
    return jsonResponse({ error: "Could not connect to Supabase." }, 502);
  }
}

async function onRequestPost({ request, env }) {
  const auth = await authenticate(request, env);
  if (auth.response) return auth.response;

  let records;
  try {
    const body = await request.json();
    records = Array.isArray(body) ? body : [body];
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }
  if (records.length === 0 || records.length > 100) {
    return jsonResponse({ error: "Send between 1 and 100 liked videos." }, 400);
  }

  const rows = records.map((record) => toLikeRow(record, auth.uid));
  if (rows.some((row) => row === null)) {
    return jsonResponse({ error: "A video record is invalid or exceeds the allowed field lengths." }, 400);
  }

  try {
    const query = new URLSearchParams({ on_conflict: "user_id,video_key" });
    const response = await fetch(`${getSupabaseTableUrl(env)}?${query}`, {
      method: "POST",
      headers: supabaseHeaders(env, {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      }),
      body: JSON.stringify(rows)
    });
    if (!response.ok) return reportSupabaseError(response, "Saving liked videos");
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Could not save liked videos:", error.message);
    return jsonResponse({ error: "Could not connect to Supabase." }, 502);
  }
}

async function onRequestDelete({ request, env }) {
  const auth = await authenticate(request, env);
  if (auth.response) return auth.response;

  const videoKey = new URL(request.url).searchParams.get("video_key");
  if (!videoKey || videoKey.length > 1024) {
    return jsonResponse({ error: "A valid video_key query parameter is required." }, 400);
  }

  try {
    const query = new URLSearchParams({
      user_id: `eq.${auth.uid}`,
      video_key: `eq.${videoKey}`
    });
    const response = await fetch(`${getSupabaseTableUrl(env)}?${query}`, {
      method: "DELETE",
      headers: supabaseHeaders(env, { Prefer: "return=minimal" })
    });
    if (!response.ok) return reportSupabaseError(response, "Removing liked video");
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Could not remove liked video:", error.message);
    return jsonResponse({ error: "Could not connect to Supabase." }, 502);
  }
}

export { onRequestDelete, onRequestGet, onRequestPost };
