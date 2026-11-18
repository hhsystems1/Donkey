import { leads, leadKey, cleanEmail, clean, json, send, sequenceMail, toCrm, type Lead } from "../lib/ridesmart.mts";

// POST /api/ridesmart/lead — a PARENT signs up (quiz result, start link, or certificate).
// Sends email 1 right away and queues the rest of the sequence.
export default async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const raw = await req.text();
  if (raw.length > 4000) return json({ error: "Too large" }, 413);
  let b: Record<string, any>;
  try { b = JSON.parse(raw); } catch { return json({ error: "Bad request" }, 400); }
  if (b.hp) return json({ ok: true }); // honeypot: bots fill hidden fields
  const email = cleanEmail(b.email);
  if (!email) return json({ error: "Enter a valid email address." }, 400);
  if (b.adult !== true) return json({ error: "Please confirm you're the parent or guardian." }, 400);

  const store = leads(), key = leadKey(email);
  const old = (await store.get(key, { type: "json" })) as Lead | null;
  const now = Date.now();
  const lead: Lead = {
    ...(old || { created: new Date(now).toISOString(), step: 0, nextAt: now }),
    email,
    parent: clean(b.parent, 40) || old?.parent,
    kid: clean(b.kid, 24) || old?.kid, // first name only, typed by the parent
    age: clean(b.age, 8) || old?.age,
    state: clean(b.state, 30) || old?.state,
    source: clean(b.source, 24) || old?.source || "site",
    score: Number.isFinite(b.score) ? Math.max(0, Math.min(7, Math.round(b.score))) : old?.score,
    gaps: Array.isArray(b.gaps) ? b.gaps.slice(0, 7).map((g: unknown) => clean(g, 40)) : old?.gaps,
    unsub: false,
  };

  // New sign-ups (or ones that never got email 1) get it now.
  if (!old || old.step === 0) {
    await send(email, sequenceMail(lead, 0));
    lead.step = 1;
    lead.nextAt = Date.parse(lead.created) + 864e5;
  }
  await store.setJSON(key, lead);
  await toCrm(old ? "lead_updated" : "lead_created", { email, parent: lead.parent, kid: lead.kid, age: lead.age, state: lead.state, lead_source: lead.source, score: lead.score });
  return json({ ok: true });
};

export const config = { path: "/api/ridesmart/lead" };
