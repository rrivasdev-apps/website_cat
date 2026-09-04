import Image from "next/image";
import Link from "next/link";
import { formatoUSD } from "@/lib/formato";
import { DISPONIBILIDAD_LABELS } from "@/lib/validation/vehiculo";
import type { Disponibilidad } from "@/lib/generated/prisma/enums";

export type VehiculoTarjeta = {
  slug: string;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  disponibilidad: Disponibilidad;
  precioLlegada: number;
  precioFinalOverride: number | null;
  fotoPortada: string | null;
};

const DISPONIBILIDAD_COLOR: Record<Disponibilidad, string> = {
  EN_ORIGEN: "bg-panel-raised text-muted",
  EN_TRANSITO: "bg-accent/20 text-accent",
  DISPONIBLE_VENEZUELA: "bg-emerald-500/20 text-emerald-400",
};

export function VehiculoCard({
  vehiculo,
  prioridad = false,
}: {
  vehiculo: VehiculoTarjeta;
  prioridad?: boolean;
}) {
  const precio = vehiculo.precioFinalOverride ?? vehiculo.precioLlegada;

  return (
    <Link
      href={`/catalogo/${vehiculo.slug}`}
      className="group block bg-panel border border-line rounded-lg overflow-hidden hover:border-accent/60 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-panel-raised">
        {vehiculo.fotoPortada ? (
          <Image
            src={vehiculo.fotoPortada}
            alt={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version}`}
            fill
            priority={prioridad}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted text-sm">
            Sin foto
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[11px] font-medium ${DISPONIBILIDAD_COLOR[vehiculo.disponibilidad]}`}
        >
          {DISPONIBILIDAD_LABELS[vehiculo.disponibilidad]}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-widest text-muted">
          {vehiculo.marca} · {vehiculo.anio}
        </p>
        <h3 className="font-display text-xl tracking-wide text-ivory mt-1">
          {vehiculo.modelo} {vehiculo.version}
        </h3>
        <p className="mt-2 text-accent font-semibold">
          {formatoUSD(precio)}
        </p>
      </div>
    </Link>
  );
}
