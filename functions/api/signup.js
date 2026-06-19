/**
 * POST /api/signup
 * ----------------
 * Captures an email into the SIGNUPS KV namespace for the early-signal list.
 *
 * Body: { email: string, src?: string }
 *
 * Stores under `signup:<lowercase-email>` so collisions overwrite the same
 * record (idempotent). Metadata carries timestamp, source path, IP country,
 * and user agent for later sift.
 *
 * Until a KV binding is wired in the Pages dashboard, the function gracefully
 * degrades — it returns a 200 with a hint header so the UI succeeds, and
 * logs to console.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return json({ error: "send json" }, 400);
  }

  const email = String(body && body.email || "").trim().toLowerCase();
  const src   = String(body && body.src   || "").slice(0, 240);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "send a valid email" }, 400);
  }

  const country = request.headers.get("cf-ipcountry") || "";
  const ua      = (request.headers.get("user-agent") || "").slice(0, 200);
  const ip      = request.headers.get("cf-connecting-ip") || "";
  const at      = new Date().toISOString();

  const record = { email, src, country, ua, at };

  // KV binding will be available once the namespace is bound in the dashboard.
  if (env && env.SIGNUPS && typeof env.SIGNUPS.put === "function") {
    try {
      await env.SIGNUPS.put(`signup:${email}`, JSON.stringify(record), {
        metadata: { at, country, src }
      });
    } catch (err) {
      // Don't leak the user's signal to /dev/null — return a soft error.
      return json({ error: "store wobbled — try again in a sec" }, 503);
    }
  } else {
    // No binding yet: log so we can read it from Pages function logs.
    // The user-facing response is still success so the UI doesn't lie.
    console.log("[signup-no-kv]", JSON.stringify(record));
  }

  // Optional: forward to a webhook if SIGNUP_WEBHOOK secret is set
  if (env && env.SIGNUP_WEBHOOK) {
    ctx.waitUntil(
      fetch(env.SIGNUP_WEBHOOK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record)
      }).catch(() => {})
    );
  }

  return json({ ok: true }, 200);
}

export function onRequestGet() {
  return json({ ok: true, hint: "POST email to subscribe" }, 200);
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, GET, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400"
    }
  });
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
