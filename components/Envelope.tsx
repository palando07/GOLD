"use client";

import { useState, useTransition } from "react";
import { openLetter } from "@/lib/actions";

export default function Envelope({
  token,
  body,
  senderName,
  alreadyOpened,
  children,
}: {
  token: string;
  body: string;
  senderName: string;
  alreadyOpened: boolean;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(alreadyOpened);
  const [, startTransition] = useTransition();

  if (!open) {
    return (
      <div className="card envelope">
        <div className="seal" aria-hidden>
          ✉
        </div>
        <p>{senderName} sana yazdı. Mektup yolculuğunu tamamladı.</p>
        <button
          onClick={() => {
            setOpen(true);
            startTransition(() => openLetter(token));
          }}
        >
          Mührü kır
        </button>
      </div>
    );
  }
  return (
    <>
      <div className="card letter-body">
        {body}
        <div className="sign">{senderName}</div>
      </div>
      {children}
    </>
  );
}
