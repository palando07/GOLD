"use server";

import { redirect } from "next/navigation";
import { getRoute } from "./routes";
import { journeyMs } from "./journey";
import { sendMail, siteUrl } from "./mail";
import { store, type Letter } from "./store";

export type FormState = { error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(form: FormData, name: string, max: number): string {
  return String(form.get(name) ?? "").trim().slice(0, max);
}

async function dispatch(letter: Letter) {
  const route = getRoute(letter.route_id)!;
  const days = route.days;
  await Promise.all([
    sendMail(
      letter.sender_email,
      `Mektubun yola çıktı: ${route.name}`,
      [
        `Sevgili ${letter.sender_name},`,
        `${letter.recipient_name} için yazdığın mektup ${route.carrier.toLowerCase()} ile yola çıktı. Yaklaşık ${days} gün sonra varacak.`,
        "Yolculuğunu aşağıdaki bağlantıdan izleyebilirsin.",
      ],
      siteUrl(`/m/${letter.sender_token}`),
    ),
    sendMail(
      letter.recipient_email,
      `${letter.sender_name} sana bir mektup gönderdi`,
      [
        `Sevgili ${letter.recipient_name},`,
        `${letter.sender_name} sana bir mektup yolladı. Mektup ${route.name} üzerinden ${route.carrier.toLowerCase()} ile geliyor ve yaklaşık ${days} gün sonra elinde olacak.`,
        "İçinde ne yazdığını varınca öğreneceksin. O zamana kadar yolculuğunu izleyebilirsin.",
      ],
      siteUrl(`/m/${letter.recipient_token}`),
    ),
  ]);
}

export async function sendLetter(_: FormState, form: FormData): Promise<FormState> {
  const route = getRoute(field(form, "route", 64));
  const letter = {
    sender_name: field(form, "sender_name", 80),
    sender_email: field(form, "sender_email", 200),
    recipient_name: field(form, "recipient_name", 80),
    recipient_email: field(form, "recipient_email", 200),
    body: field(form, "body", 10000),
  };
  if (!route) return { error: "Bir rota seç." };
  if (!letter.sender_name || !letter.recipient_name) return { error: "İki ismi de yaz." };
  if (!EMAIL.test(letter.sender_email) || !EMAIL.test(letter.recipient_email))
    return { error: "E-posta adreslerinden biri geçersiz görünüyor." };
  if (letter.body.length < 10) return { error: "Mektup en az birkaç cümle olmalı." };

  const now = new Date();
  const saved = await store().insert({
    ...letter,
    route_id: route.id,
    reverse: false,
    sent_at: now.toISOString(),
    arrives_at: new Date(now.getTime() + journeyMs(route)).toISOString(),
    reply_to: null,
  });
  await dispatch(saved);
  redirect(`/m/${saved.sender_token}`);
}

export async function replyLetter(_: FormState, form: FormData): Promise<FormState> {
  const found = await store().byToken(field(form, "token", 64));
  if (!found || found.viewer !== "recipient") return { error: "Bu mektuba cevap veremezsin." };
  const original = found.letter;
  if (new Date(original.arrives_at) > new Date()) return { error: "Mektup henüz varmadı." };
  if (await store().replyOf(original.id)) return { error: "Bu mektuba zaten cevap yazdın." };

  const body = field(form, "body", 10000);
  if (body.length < 10) return { error: "Cevap en az birkaç cümle olmalı." };

  const route = getRoute(original.route_id)!;
  const now = new Date();
  const saved = await store().insert({
    sender_name: original.recipient_name,
    sender_email: original.recipient_email,
    recipient_name: original.sender_name,
    recipient_email: original.sender_email,
    body,
    route_id: route.id,
    reverse: !original.reverse,
    sent_at: now.toISOString(),
    arrives_at: new Date(now.getTime() + journeyMs(route)).toISOString(),
    reply_to: original.id,
  });
  await dispatch(saved);
  redirect(`/m/${saved.sender_token}`);
}

export async function openLetter(token: string): Promise<void> {
  const found = await store().byToken(token);
  if (found?.viewer === "recipient" && new Date(found.letter.arrives_at) <= new Date()) {
    await store().markOpened(found.letter.id);
  }
}
