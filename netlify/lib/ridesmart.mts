// Shared code for the Ride Smart parent funnel: leads, emails, orders.
// Everything here is about PARENTS. Nothing is collected from kids.
//
// Env vars (set in Netlify, never in code):
//   RESEND_API_KEY     Resend key. Without it, emails are skipped and logged.
//   RS_FROM            Sender, e.g. "Ride Smart <hello@ridesmartfamily.com>" (domain must be verified in Resend)
//   RS_POSTAL_ADDRESS  Mailing address for the email footer (required by CAN-SPAM)
//   RS_SECRET          Random string used to sign unsubscribe and certificate links
//   RS_SITE            Public parent-site URL, e.g. https://ridesmartfamily.com (no trailing slash)
//   HHS_CRM_URL        HHS CRM webhook that receives leads and events (optional until it's ready)
//   HHS_CRM_KEY        Bearer token for that webhook
//   RS_CHECKOUT_URL    Payment link for the certificate (HHS payments). Gets ?order=<id> appended.
import { getStore } from "@netlify/blobs";
import { createHmac } from "node:crypto";

export const CERT_PRICE = "$12";
export const env = (k: string) => (globalThis as any).Netlify?.env?.get(k) ?? process.env[k] ?? "";
export const site = () => env("RS_SITE") || "https://bikesafety.netlify.app/family";
export const leads = () => getStore("rs-leads");
export const orders = () => getStore("rs-orders");

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export const cleanEmail = (v: unknown) => {
  const e = String(v ?? "").trim().toLowerCase();
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/.test(e) ? e : "";
};
export const clean = (v: unknown, max = 60) => String(v ?? "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, max);
export const sign = (s: string) => createHmac("sha256", env("RS_SECRET") || "dev-only-secret").update(s).digest("base64url").slice(0, 22);
export const leadKey = (email: string) => sign("lead:" + email);
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type Lead = {
  email: string; parent?: string; kid?: string; age?: string; state?: string; source: string;
  score?: number; gaps?: string[]; created: string; step: number; nextAt: number; unsub?: boolean; bought?: boolean;
};

// Forward to the HHS CRM. Never blocks the visitor: errors are logged and swallowed.
export async function toCrm(event: string, data: Record<string, unknown>) {
  const url = env("HHS_CRM_URL"); if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env("HHS_CRM_KEY")}` },
      body: JSON.stringify({ source: "ridesmart", event, at: new Date().toISOString(), ...data }),
    });
  } catch (e) { console.error("crm", event, e); }
}

export async function send(to: string, mail: { subject: string; html: string; text: string }) {
  const key = env("RESEND_API_KEY");
  if (!key) { console.log("[no RESEND_API_KEY] would send:", to, mail.subject); return false; }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env("RS_FROM") || "Ride Smart <onboarding@resend.dev>", to: [to], subject: mail.subject, html: mail.html, text: mail.text,
      headers: { "List-Unsubscribe": `<${unsubUrl(to)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
  });
  if (!r.ok) console.error("resend", r.status, await r.text());
  return r.ok;
}

export const unsubUrl = (email: string) => `${new URL(site()).origin}/api/ridesmart/unsub?e=${encodeURIComponent(email)}&t=${sign("unsub:" + email)}`;

// ---------- Email templates ----------
// Plain, one-column emails that read well on a phone. Links go to the parent site,
// so affiliate links can change in one place (the gear page) without touching emails.
const shell = (email: string, preheader: string, body: string) => `<!doctype html><html><body style="margin:0;background:#f3f1ea;font-family:Inter,Arial,sans-serif;color:#0f1110">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 14px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:14px" cellpadding="0" cellspacing="0"><tr><td style="padding:28px 26px;font-size:16px;line-height:1.55">
<p style="margin:0 0 18px;font:800 13px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase">⚡ Ride Smart</p>
${body}
</td></tr></table>
<p style="max-width:560px;font-size:12px;line-height:1.5;color:#5f645f;margin:16px auto 0">You're getting this because you signed up at Ride Smart for parents. Some gear links earn us a small commission at no cost to you.<br>${esc(env("RS_POSTAL_ADDRESS") || "[Mailing address goes here]")}<br><a href="${unsubUrl(email)}" style="color:#5f645f">Unsubscribe</a></p>
</td></tr></table></body></html>`;

const btn = (href: string, label: string) =>
  `<p style="margin:22px 0"><a href="${href}" style="display:inline-block;background:#0f1110;color:#f3f1ea;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px">${esc(label)}</a></p>`;
const h = (t: string) => `<h1 style="font:800 26px/1.1 Arial Black,Arial,sans-serif;margin:0 0 14px">${esc(t)}</h1>`;
const p = (t: string) => `<p style="margin:0 0 14px">${t}</p>`;
const li = (items: string[]) => `<ul style="margin:0 0 14px;padding-left:20px">${items.map((i) => `<li style="margin:0 0 6px">${i}</li>`).join("")}</ul>`;
const txt = (html: string) => html.replace(/<br>/g, "\n").replace(/<\/(p|li|h1)>/g, "\n").replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, "$2: $1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim();

const kidName = (l: Lead) => (l.kid ? esc(l.kid) : "your rider");

// Sequence after sign-up. step = index into this list; days = days after sign-up.
export const SEQUENCE: { days: number; build: (l: Lead) => { subject: string; preheader: string; body: string } }[] = [
  {
    days: 0,
    build: (l) => ({
      subject: l.score != null ? `${l.kid || "Your rider"}'s e-bike readiness plan` : "Your Ride Smart start link",
      preheader: "The plan, your state's e-bike rules and a pre-ride check card.",
      body: h(l.score != null ? `Here's ${l.kid ? esc(l.kid) + "'s" : "your"} plan.` : "You're in. Here's where to start.") +
        (l.score != null ? p(`${kidName(l)} has <b>${l.score} of 7</b> covered.${l.gaps?.length ? " Start with these:" : " Do the full course together to lock it in."}`) + (l.gaps?.length ? li(l.gaps.map(esc)) : "") : "") +
        p("The course is six short lessons, read out loud, so younger riders can do it on their own. Hand them the phone or tablet with this link:") +
        btn(`${site()}/go/`, "Open the course") +
        p(`<b>Your state's rules.</b> Age limits, helmet laws and where kids can ride${l.state ? ` in ${esc(l.state)}` : ""}: <a href="${site()}/gear/#laws">look them up here</a>.`) +
        p(`<b>Pre-ride check card.</b> Print it and tape it by the bike: <a href="${site()}/card/">pre-ride card</a>.`),
    }),
  },
  {
    days: 1,
    build: (l) => ({
      subject: "The 3-step helmet check (most kids fail step 2)",
      preheader: "Level, V, snug. Takes 30 seconds.",
      body: h("Does the helmet actually fit?") +
        p(`Most helmets on kids are tipped back like a cap. That leaves the forehead open. Check ${kidName(l)}'s in 30 seconds:`) +
        li(["<b>Level.</b> Two fingers above the eyebrows, not tipped back.", "<b>V.</b> Side straps meet in a V just under each ear.", "<b>Snug.</b> One or two fingers under the chin strap. Shake the head: it shouldn't slide."]) +
        p("If it fails, or it's been in a crash, it's time for a new one. Buy by head size in centimeters, not by age.") +
        btn(`${site()}/gear/#helmet`, "See the helmets we recommend"),
    }),
  },
  {
    days: 3,
    build: (l) => ({
      subject: `Has ${l.kid || "your rider"} done lesson 1 yet?`,
      preheader: "Five minutes. Read out loud. No reading needed.",
      body: h("Five minutes tonight?") +
        p(`Lesson 1 is gear and the pre-ride check. It takes about five minutes and every card is read out loud, so ${kidName(l)} can do it alone.`) +
        p("Sit next to them for the first one. Kids who start with a parent nearby are far more likely to finish.") +
        btn(`${site()}/go/`, "Open lesson 1"),
    }),
  },
  {
    days: 7,
    build: (l) => ({
      subject: "Knees, elbows, wrists: what to buy and what to skip",
      preheader: "The cheapest gear that prevents the most common injuries.",
      body: h("Pads are cheap. Scraped knees aren't.") +
        p("Most falls on a bike are low and slow: hands and knees hit first. A basic pad set costs less than one urgent care copay.") +
        li(["<b>Wrist guards</b> matter most for younger riders. Hands go out first.", "<b>Knee and elbow pads</b> in junior sizes. Hard caps slide instead of grab.", "<b>Gloves</b> for grip and palms."]) +
        btn(`${site()}/gear/#pads`, "See pad sets by size") +
        p(`Also: do the pre-ride check with ${kidName(l)} before every ride this week. <a href="${site()}/card/">Here's the card.</a>`),
    }),
  },
  {
    days: 14,
    build: (l) => ({
      subject: "Is a kids' e-bike a good idea? (an honest guide by age)",
      preheader: "Most e-bikes are built for 12 and up. Here's what fits younger riders.",
      body: h("Picking a first e-bike") +
        p("Most budget e-bikes are rated for riders 12 and up. A bike that's too big or too fast is the most common mistake parents make.") +
        li(["<b>Under 8:</b> a regular pedal bike or an electric balance bike with low speed modes.", "<b>8 to 11:</b> a real kids' e-bike with 20 or 24 inch wheels, a speed limiter and good brakes.", "<b>12 and up:</b> Class 1 e-bikes, if your state allows it."]) +
        btn(`${site()}/gear/#ebikes`, "See bikes by age") +
        (l.bought ? "" : p(`When ${kidName(l)} finishes the six lessons, you can get their official certificate and rider card for ${CERT_PRICE}. <a href="${site()}/certificate/">See the certificate</a>.`)),
    }),
  },
];

export function sequenceMail(l: Lead, step: number) {
  const s = SEQUENCE[step].build(l);
  const html = shell(l.email, s.preheader, s.body);
  return { subject: s.subject, html, text: txt(s.body) + `\n\nUnsubscribe: ${unsubUrl(l.email)}` };
}

export function certificateMail(email: string, kid: string, link: string) {
  const body = h(`${esc(kid)}'s certificate is ready.`) +
    p("Thanks for supporting Ride Smart. Open the link to view, download and print the certificate and the wallet-size rider card.") +
    btn(link, "Open the certificate") +
    p("Schools and bike shops can check it's real with the ID printed on it.") +
    p(`Next step: go over the <a href="${site()}/card/">pre-ride check</a> together before every ride.`);
  return { subject: `${kid}'s Ride Smart certificate`, html: shell(email, "View, download and print it.", body), text: txt(body) };
}
