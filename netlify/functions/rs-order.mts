import { orders, leads, leadKey, cleanEmail, clean, json, env, sign, site, toCrm, CERT_PRICE, type Lead } from "../lib/ridesmart.mts";
import { randomBytes } from "node:crypto";

// POST /api/ridesmart/order — parent orders the official certificate.
// Creates a pending order, then sends the parent to the HHS checkout.
// Until checkout is connected (no RS_CHECKOUT_URL), it returns a preview link so the flow can be tested.
export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  let b: Record<string, any>;
  try { b = JSON.parse(await req.text()); } catch { return json({ error: "Bad request" }, 400); }
  if (b.hp) return json({ ok: true });
  const email = cleanEmail(b.email);
  const kid = clean(b.kid, 40);
  if (!email) return json({ error: "Enter a valid email address." }, 400);
  if (!kid) return json({ error: "Enter the name to print on the certificate." }, 400);
  if (b.adult !== true) return json({ error: "Please confirm you're the parent or guardian." }, 400);

  const id = "RS-" + randomBytes(4).toString("hex").toUpperCase();
  const order = { id, email, kid, done: clean(b.done, 20) || new Date().toISOString().slice(0, 10), price: CERT_PRICE, status: "pending", created: new Date().toISOString() };
  await orders().setJSON(id, order);
  await toCrm("certificate_ordered", { email, order: id, price: CERT_PRICE });

  // Also add them to the parent list if they're new (no email 1 resend if they already are).
  const lk = leadKey(email), store = leads();
  if (!(await store.get(lk))) {
    const lead: Lead = { email, kid: kid.split(" ")[0], source: "certificate", created: new Date().toISOString(), step: 1, nextAt: Date.now() + 864e5 };
    await store.setJSON(lk, lead);
  }

  const checkout = env("RS_CHECKOUT_URL");
  if (checkout) return json({ ok: true, redirect: `${checkout}${checkout.includes("?") ? "&" : "?"}order=${id}&email=${encodeURIComponent(email)}` });
  return json({ ok: true, preview: true, redirect: `${site()}/certificate/view/?id=${id}&t=${sign("cert:" + id)}` });
};

export const config = { path: "/api/ridesmart/order" };
