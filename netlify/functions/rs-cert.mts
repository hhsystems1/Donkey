import { orders, json, sign, env } from "../lib/ridesmart.mts";

// GET /api/ridesmart/cert?id=RS-..&t=..  → full certificate data (owner link from the email)
// GET /api/ridesmart/cert?id=RS-..       → verify only: first name + date, for schools and shops
export default async (req: Request) => {
  const u = new URL(req.url);
  const id = String(u.searchParams.get("id") || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16);
  const o = id ? ((await orders().get(id, { type: "json" })) as any) : null;
  const preview = !env("RS_CHECKOUT_URL");
  if (!o || (o.status !== "paid" && !preview)) return json({ error: "We couldn't find that certificate." }, 404);
  const owner = u.searchParams.get("t") === sign("cert:" + id);
  return json(owner
    ? { id: o.id, kid: o.kid, done: o.done, preview: o.status !== "paid" }
    : { id: o.id, first: String(o.kid).split(" ")[0], done: o.done, valid: o.status === "paid" });
};

export const config = { path: "/api/ridesmart/cert" };
