"use client";

import { useActionState } from "react";
import { replyLetter, type FormState } from "@/lib/actions";

export default function ReplyForm({ token, to }: { token: string; to: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(replyLetter, {});
  return (
    <form action={action}>
      <h2>{to} için cevap yaz</h2>
      <p className="muted">Cevabın aynı yolu tersinden, aynı hızla gidecek.</p>
      <input type="hidden" name="token" value={token} />
      <div className="card">
        <textarea className="letter" name="body" required minLength={10} maxLength={10000} />
        {state.error && <p className="error">{state.error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? "Mühürleniyor…" : "Cevabı yola çıkar"}
        </button>
      </div>
    </form>
  );
}
