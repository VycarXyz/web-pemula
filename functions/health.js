const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8"
};

export async function onRequestGet({ env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    return new Response(JSON.stringify({ status: "error", error: "Supabase is not configured." }), {
      status: 500,
      headers: jsonHeaders
    });
  }

  try {
    const projectUrl = new URL(env.SUPABASE_URL);
    if (projectUrl.protocol !== "https:") throw new Error("Supabase URL must use HTTPS.");
    const response = await fetch(`${projectUrl.origin}/rest/v1/video_likes?select=video_key&limit=1`, {
      headers: {
        apikey: env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}`
      }
    });
    if (!response.ok) {
      console.error("Supabase health check failed:", await response.text());
      return new Response(JSON.stringify({ status: "error", error: "Supabase connection failed." }), {
        status: 503,
        headers: jsonHeaders
      });
    }
    return new Response(JSON.stringify({ status: "ok" }), { headers: jsonHeaders });
  } catch (error) {
    console.error("Supabase health check failed:", error.message);
    return new Response(JSON.stringify({ status: "error", error: "Supabase connection failed." }), {
      status: 503,
      headers: jsonHeaders
    });
  }
}
