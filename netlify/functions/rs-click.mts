import { getStore } from "@netlify/blobs";

// Counts gear-link clicks on the parent site: one tiny key per click, no personal data.
const OK = /^[a-z0-9-]{2,40}$/;
export default async (req: Request) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const t = await req.text();
  if (t.length > 200) return new Response(null, { status: 413 });
  let k = "";
  try { k = String(JSON.parse(t).k || ""); } catch {}
  if (!OK.test(k)) return new Response(null, { status: 400 });
  const day = new Date().toISOString().slice(0, 10);
  await getStore("rs-clicks").set(`${day}/${k}/${Date.now()}${Math.random().toString(36).slice(2, 6)}`, "1");
  return new Response(null, { status: 204 });
};

export const config = { path: "/api/ridesmart/click" };
