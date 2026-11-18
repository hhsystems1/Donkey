import { leads, leadKey, cleanEmail, sign, toCrm, type Lead } from "../lib/ridesmart.mts";

// One-click unsubscribe from the email footer (GET shows a page, POST is the mail-app button).
export default async (req: Request) => {
  const u = new URL(req.url);
  const email = cleanEmail(u.searchParams.get("e"));
  const ok = email && u.searchParams.get("t") === sign("unsub:" + email);
  if (ok) {
    const store = leads(), key = leadKey(email);
    const l = (await store.get(key, { type: "json" })) as Lead | null;
    if (l) { l.unsub = true; await store.setJSON(key, l); }
    await toCrm("unsubscribed", { email });
  }
  if (req.method === "POST") return new Response(null, { status: ok ? 204 : 400 });
  const msg = ok ? "You're unsubscribed. You won't get any more Ride Smart emails." : "That link didn't work. Reply to any Ride Smart email and we'll take you off the list.";
  return new Response(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ride Smart</title><body style="font:17px/1.5 system-ui,sans-serif;background:#f3f1ea;color:#0f1110;padding:40px 20px;max-width:520px;margin:auto"><h1 style="font:800 28px Arial Black,Arial,sans-serif">Ride Smart</h1><p>${msg}</p></body>`, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
};

export const config = { path: "/api/ridesmart/unsub" };
