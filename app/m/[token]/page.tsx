import { notFound } from "next/navigation";
import Envelope from "@/components/Envelope";
import Journey from "@/components/Journey";
import ReplyForm from "@/components/ReplyForm";
import { getRoute, legs } from "@/lib/routes";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function LetterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const found = await store().byToken(token);
  if (!found) notFound();
  const { letter, viewer } = found;
  const route = getRoute(letter.route_id)!;
  const stops = legs(route, letter.reverse);
  const now = Date.now();
  const arrived = new Date(letter.arrives_at).getTime() <= now;
  const reply = viewer === "recipient" && arrived ? await store().replyOf(letter.id) : null;
  const from = stops[0].name;
  const to = stops[stops.length - 1].name;

  return (
    <>
      <h1>
        {viewer === "sender" ? `${letter.recipient_name} için mektubun` : `${letter.sender_name} sana yazıyor`}
      </h1>
      <p className="lead">
        {route.name}: {from} → {to}, {route.carrier.toLowerCase()} ile {route.days} gün
      </p>

      {viewer === "recipient" && arrived && (
        <Envelope
          token={token}
          body={letter.body}
          senderName={letter.sender_name}
          alreadyOpened={Boolean(letter.opened_at)}
        >
          {reply ? (
            <p className="muted" style={{ textAlign: "center" }}>
              Cevabın {letter.sender_name} için yolda. Takip bağlantısı e-postanda.
            </p>
          ) : (
            <ReplyForm token={token} to={letter.sender_name} />
          )}
        </Envelope>
      )}

      <Journey
        stops={stops}
        sentAt={letter.sent_at}
        arrivesAt={letter.arrives_at}
        carrier={route.carrier}
        serverNow={now}
      />

      {viewer === "sender" && (
        <details className="card" style={{ marginTop: 32 }}>
          <summary>Yazdığın mektup</summary>
          <div className="letter-body" style={{ marginTop: 16 }}>
            {letter.body}
          </div>
        </details>
      )}
    </>
  );
}
