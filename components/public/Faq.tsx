"use client";

import { useState } from "react";

type PreguntaFrecuente = {
  id: string;
  pregunta: string;
  respuesta: string;
};

export function Faq({ preguntas }: { preguntas: PreguntaFrecuente[] }) {
  const [abiertaId, setAbiertaId] = useState<string | null>(
    preguntas[0]?.id ?? null,
  );

  if (preguntas.length === 0) return null;

  return (
    <section
      id="preguntas-frecuentes"
      className="mx-auto max-w-3xl px-6 py-20"
    >
      <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
        Ayuda
      </p>
      <h2 className="font-display text-4xl tracking-wide text-ivory mb-8">
        PREGUNTAS FRECUENTES
      </h2>

      <div className="divide-y divide-line border-t border-b border-line">
        {preguntas.map((p) => {
          const abierta = abiertaId === p.id;
          return (
            <div key={p.id}>
              <button
                type="button"
                onClick={() => setAbiertaId(abierta ? null : p.id)}
                aria-expanded={abierta}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium text-ivory">{p.pregunta}</span>
                <span
                  className={`shrink-0 text-accent text-xl transition-transform ${abierta ? "rotate-45" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {abierta && (
                <p className="pb-5 text-sm text-muted leading-relaxed">
                  {p.respuesta}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
