"use client";

import { useActionState } from "react";
import { sendLetter, type FormState } from "@/lib/actions";

type RouteOption = {
  id: string;
  name: string;
  description: string;
  days: number;
  km: number;
  from: string;
  to: string;
};

export default function ComposeForm({ routes }: { routes: RouteOption[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendLetter, {});
  return (
    <form action={action}>
      <h2>Yol</h2>
      <div className="routes">
        {routes.map((r, i) => (
          <label key={r.id} className="route-option">
            <input type="radio" name="route" value={r.id} defaultChecked={i === 0} />
            <div className="card">
              <strong>{r.name}</strong>
              <small>
                {r.from} → {r.to} · {r.days} gün · {r.km.toLocaleString("tr-TR")} km
              </small>
              <p>{r.description}</p>
            </div>
          </label>
        ))}
      </div>

      <h2>Mektup</h2>
      <div className="card">
        <div className="row">
          <label className="field">
            <span>Kime</span>
            <input type="text" name="recipient_name" required maxLength={80} />
          </label>
          <label className="field">
            <span>Onun e-postası</span>
            <input type="email" name="recipient_email" required maxLength={200} />
          </label>
        </div>
        <label className="field">
          <span>Mektubun</span>
          <textarea className="letter" name="body" required minLength={10} maxLength={10000} />
        </label>
        <div className="row">
          <label className="field">
            <span>Kimden</span>
            <input type="text" name="sender_name" required maxLength={80} />
          </label>
          <label className="field">
            <span>Senin e-postan (takip bağlantısı için)</span>
            <input type="email" name="sender_email" required maxLength={200} />
          </label>
        </div>
        {state.error && <p className="error">{state.error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? "Mühürleniyor…" : "Mühürle ve yola çıkar"}
        </button>
      </div>
    </form>
  );
}
