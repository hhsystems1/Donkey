import { orders, leads, leadKey, json, env, sign, site, send, certificateMail, toCrm, type Lead } from "../lib/ridesmart.mts";

// POST /api/ridesmart/paid — called by HHS payments when a certificate order is paid.
// Body: { "order": "RS-XXXXXXXX" }. Header: Authorization: Bearer <RS_SECRET>.
export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  if (!env("RS_SECRET") || req.headers.get("authorization") !== `Bearer ${env("RS_SECRET")}`) return json({ error: "Unauthorized" }, 401);
  const { order: id } = await req.json().catch(() => ({}));
  const store = orders();
  const o = (await store.get(String(id), { type: "json" })) as any;
  if (!o) return json({ error: "No such order" }, 404);
  if (o.status !== "paid") {
    o.status = "paid"; o.paidAt = new Date().toISOString();
    await store.setJSON(o.id, o);
    const link = `${site()}/certificate/view/?id=${o.id}&t=${sign("cert:" + o.id)}`;
    await send(o.email, certificateMail(o.email, o.kid, link));
    const lk = leadKey(o.email), l = (await leads().get(lk, { type: "json" })) as Lead | null;
    if (l) { l.bought = true; await leads().setJSON(lk, l); }
    await toCrm("certificate_paid", { email: o.email, order: o.id, price: o.price });
  }
  return json({ ok: true });
};

export const config = { path: "/api/ridesmart/paid" };
