import Image from "next/image";
import { formatoUSD } from "@/lib/formato";

export function ImagenPrincipal({
  fotoUrl,
  marca,
  modelo,
  version,
  precio,
}: {
  fotoUrl: string | null;
  marca: string;
  modelo: string;
  version: string;
  precio: number;
}) {
  return (
    <section className="relative h-[60vh] min-h-[380px] w-full overflow-hidden bg-panel">
      {fotoUrl ? (
        <Image
          src={fotoUrl}
          alt={`${marca} ${modelo} ${version}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-muted">
          Sin foto
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

      <div className="relative h-full mx-auto max-w-[1600px] px-6 flex flex-col justify-end pb-10">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
          {marca}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl tracking-wide text-ivory leading-none">
          {modelo} {version}
        </h1>
        <p className="mt-3 text-2xl text-ivory">{formatoUSD(precio)}</p>
      </div>
    </section>
  );
}
