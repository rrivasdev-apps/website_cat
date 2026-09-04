"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatoUSD } from "@/lib/formato";

type SlideVehiculo = {
  slideId: string;
  slug: string;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  precioLlegada: number;
  fotoPortada: string | null;
};

export function HeroSlider({
  slides,
  intervaloSegundos = 6,
}: {
  slides: SlideVehiculo[];
  intervaloSegundos?: number;
}) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % slides.length);
    }, intervaloSegundos * 1000);
    return () => clearInterval(id);
  }, [slides.length, intervaloSegundos]);

  if (slides.length === 0) return null;

  const slide = slides[indice];

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-panel">
      {slide.fotoPortada && (
        <Image
          key={slide.slideId}
          src={slide.fotoPortada}
          alt={`${slide.marca} ${slide.modelo}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />

      <div className="relative h-full mx-auto max-w-[1600px] px-6 flex flex-col justify-end pb-16">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
          {slide.marca}
        </p>
        <h1 className="font-display text-5xl sm:text-7xl tracking-wide text-ivory leading-none">
          {slide.modelo} {slide.version}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-ivory">
          <span className="text-lg">{slide.anio}</span>
          <span className="h-1 w-1 rounded-full bg-muted" />
          <span className="text-lg">{formatoUSD(slide.precioLlegada)}</span>
        </div>
        <Link
          href={`/catalogo/${slide.slug}`}
          className="mt-6 inline-block w-fit bg-accent text-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide rounded hover:bg-accent-dark transition-colors"
        >
          Ver detalle
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.slideId}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ver slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === indice ? "w-8 bg-accent" : "w-2 bg-ivory/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
