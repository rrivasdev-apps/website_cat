"use client";

import { useState } from "react";

export function AcordeonSeccion({
  titulo,
  abiertaPorDefecto = false,
  children,
}: {
  titulo: string;
  abiertaPorDefecto?: boolean;
  children: React.ReactNode;
}) {
  const [abierta, setAbierta] = useState(abiertaPorDefecto);

  return (
    <div className="border border-line rounded-lg bg-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <span className="font-display text-xl tracking-wide text-ivory">
          {titulo}
        </span>
        <span
          className={`shrink-0 text-accent text-xl transition-transform ${abierta ? "rotate-45" : ""}`}
          aria-hidden
        >
          +
        </span>
      </button>
      {abierta && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
