import { getRoute } from "@/lib/routes";
import { sendMail, siteUrl } from "@/lib/mail";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Emails recipients whose letters have arrived. Called on a schedule. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Yetkisiz", { status: 401 });
  }
  const due = await store().dueForNotice(new Date());
  let sent = 0;
  for (const letter of due) {
    const route = getRoute(letter.route_id);
    try {
      await sendMail(
        letter.recipient_email,
        `Beklediğin mektup geldi`,
        [
          `Sevgili ${letter.recipient_name},`,
          `${letter.sender_name} tarafından yollanan mektup ${route?.name ?? "uzun bir yol"} boyunca yolculuğunu tamamladı ve kapında.`,
          "Mührü kırmak için bağlantıya tıkla.",
        ],
        siteUrl(`/m/${letter.recipient_token}`),
      );
      await store().markNotified(letter.id);
      sent++;
    } catch (err) {
      console.error(`Varış e-postası gönderilemedi (${letter.id})`, err);
    }
  }
  return Response.json({ due: due.length, sent });
}
