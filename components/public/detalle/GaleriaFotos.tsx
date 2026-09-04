"use client";

import Image from "next/image";
import { useState } from "react";

export function GaleriaFotos({
  fotos,
  nombre,
}: {
  fotos: string[];
  nombre: string;
}) {
  const [abiertaEn, setAbiertaEn] = useState<number | null>(null);

  if (fotos.length === 0) return null;

  return (
    <section className="border border-line rounded-lg bg-panel px-6 py-4">
      <h2 className="font-display text-xl tracking-wide text-ivory mb-4">
        GALERÍA
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {fotos.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setAbiertaEn(i)}
            className="relative w-64 h-44 shrink-0 snap-start rounded-lg overflow-hidden bg-panel-raised"
          >
            <Image
              src={url}
              alt={`${nombre} — foto ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="256px"
            />
          </button>
        ))}
      </div>

      {abiertaEn !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6"
          onClick={() => setAbiertaEn(null)}
        >
          <button
            type="button"
            onClick={() => setAbiertaEn(null)}
            aria-label="Cerrar"
            className="absolute top-6 right-6 text-ivory text-3xl leading-none"
          >
            ×
          </button>

          {abiertaEn > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAbiertaEn((i) => (i !== null ? i - 1 : i));
              }}
              aria-label="Anterior"
              className="absolute left-6 text-ivory text-4xl"
            >
              ‹
            </button>
          )}
          {abiertaEn < fotos.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAbiertaEn((i) => (i !== null ? i + 1 : i));
              }}
              aria-label="Siguiente"
              className="absolute right-6 text-ivory text-4xl"
            >
              ›
            </button>
          )}

          <div className="relative w-full max-w-3xl h-[70vh]">
            <Image
              src={fotos[abiertaEn]}
              alt={`${nombre} — foto ${abiertaEn + 1}`}
              fill
              className="object-contain"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
