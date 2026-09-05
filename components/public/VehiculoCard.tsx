import Image from "next/image";
import Link from "next/link";
import { formatoUSD } from "@/lib/formato";
import { DISPONIBILIDAD_LABELS } from "@/lib/validation/vehiculo";
import type { Disponibilidad } from "@/lib/generated/prisma/enums";

export type VehiculoTarjeta = {
  slug: string;
  marca: string;
  marcaLogoUrl: string | null;
  modelo: string;
  version: string;
  anio: number;
  disponibilidad: Disponibilidad;
  precioLlegada: number;
  precioFinalOverride: number | null;
  fotoPortada: string | null;
  fotoTarjetaUrl: string | null;
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
  const fotoTarjeta = vehiculo.fotoTarjetaUrl ?? vehiculo.fotoPortada;

  return (
    <Link
      href={`/catalogo/${vehiculo.slug}`}
      className="group block bg-panel border border-line rounded-xl overflow-hidden hover:border-accent/60 transition-colors p-4"
    >
      <div className="relative aspect-[4/3]">
        <div className="absolute inset-x-0 top-0 flex items-center justify-between z-10">
          {vehiculo.marcaLogoUrl ? (
            <Image
              src={vehiculo.marcaLogoUrl}
              alt={vehiculo.marca}
              width={72}
              height={28}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              {vehiculo.marca}
            </span>
          )}
          <span className="text-xs text-muted">{vehiculo.anio}</span>
        </div>

        {fotoTarjeta ? (
          <Image
            src={fotoTarjeta}
            alt={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version}`}
            fill
            priority={prioridad}
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted text-sm">
            Sin foto
          </div>
        )}

        <span
          className={`absolute bottom-0 left-0 px-2 py-1 rounded-full text-[11px] font-medium ${DISPONIBILIDAD_COLOR[vehiculo.disponibilidad]}`}
        >
          {DISPONIBILIDAD_LABELS[vehiculo.disponibilidad]}
        </span>
      </div>

      <div className="pt-2">
        <p className="text-sm text-muted truncate">
          {vehiculo.modelo} {vehiculo.version}
        </p>
        <p className="mt-1 text-accent font-display text-2xl tracking-wide">
          {formatoUSD(precio)}
        </p>
      </div>
    </Link>
  );
}
