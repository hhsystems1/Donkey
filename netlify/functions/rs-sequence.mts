import { leads, send, sequenceMail, SEQUENCE, toCrm, type Lead } from "../lib/ridesmart.mts";

// Runs every hour. Sends each parent the next email in the sequence when it's due.
// Scheduled functions only run on the production deploy, not on previews.
export default async () => {
  const store = leads(), now = Date.now();
  const { blobs } = await store.list();
  let sent = 0;
  for (const { key } of blobs) {
    const l = (await store.get(key, { type: "json" })) as Lead | null;
    if (!l || l.unsub || l.step >= SEQUENCE.length || l.nextAt > now) continue;
    await send(l.email, sequenceMail(l, l.step));
    await toCrm("email_sent", { email: l.email, step: l.step });
    l.step += 1;
    l.nextAt = l.step < SEQUENCE.length ? Date.parse(l.created) + SEQUENCE[l.step].days * 864e5 : Infinity;
    await store.setJSON(key, l);
    if (++sent >= 80) break; // stay well inside Resend's rate limits per run
  }
  console.log("ridesmart sequence sent", sent);
};

export const config = { schedule: "@hourly" };
