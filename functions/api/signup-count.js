/**
 * GET /api/signup-count
 * ---------------------
 * Returns the running tally of early-signal signups.
 *
 * Reads from the SIGNUPS KV namespace and counts keys prefixed with
 * "signup:". KV list is paginated; we cap at a reasonable cursor depth
 * since the page only needs a rough number.
 *
 * Cached at the edge for 60s — the badge is decorative, not authoritative.
 */

export async function onRequestGet({ env }) {
  if (!env || !env.SIGNUPS || typeof env.SIGNUPS.list !== "function") {
    return json({ count: 0, source: "no-binding" }, 200, 60);
  }

  let count = 0;
  let cursor;
  // Cap pagination to keep the function snappy. Once the count grows
  // past this, we'll switch to a counter key.
  for (let i = 0; i < 5; i++) {
    const page = await env.SIGNUPS.list({ prefix: "signup:", cursor });
    count += page.keys.length;
    if (page.list_complete || !page.cursor) break;
    cursor = page.cursor;
  }
  return json({ count }, 200, 60);
}

function json(obj, status, cacheSeconds) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*"
  };
  if (cacheSeconds) {
    headers["cache-control"] = `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`;
  } else {
    headers["cache-control"] = "no-store";
  }
  return new Response(JSON.stringify(obj), { status, headers });
}
