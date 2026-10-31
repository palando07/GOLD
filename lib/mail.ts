export function siteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends through Resend when RESEND_API_KEY is set, otherwise logs the mail. */
export async function sendMail(to: string, subject: string, lines: string[], link: string) {
  const html = `<div style="font-family:Georgia,serif;background:#f4ead5;padding:32px;color:#3b2f1e">
${lines.map((l) => `<p style="font-size:17px;line-height:1.6">${escape(l)}</p>`).join("\n")}
<p><a href="${escape(link)}" style="display:inline-block;background:#7a2e1d;color:#f4ead5;padding:12px 20px;border-radius:4px;text-decoration:none">Mektubu gör</a></p>
<p style="font-size:13px;color:#7a6a50">Yavaş Mektup</p></div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[posta] ${to} | ${subject}\n  ${lines.join("\n  ")}\n  ${link}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "Yavaş Mektup <onboarding@resend.dev>",
      to,
      subject,
      html,
      text: `${lines.join("\n\n")}\n\n${link}`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
