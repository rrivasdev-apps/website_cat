import { formatoUSD } from "@/lib/formato";
import { DISPONIBILIDAD_LABELS } from "@/lib/validation/vehiculo";
import { construirEnlaceWhatsApp } from "@/lib/whatsapp";
import type { Disponibilidad } from "@/lib/generated/prisma/enums";

export function PrecioFinal({
  precioFinal,
  disponibilidad,
  modelo,
  anio,
  whatsappNumero,
  whatsappPlantilla,
}: {
  precioFinal: number | null;
  disponibilidad: Disponibilidad;
  modelo: string;
  anio: number;
  whatsappNumero: string | null;
  whatsappPlantilla: string | null;
}) {
  const enlaceCompra =
    whatsappNumero && whatsappPlantilla
      ? construirEnlaceWhatsApp(whatsappNumero, whatsappPlantilla, {
          modelo,
          anio: String(anio),
          precio: precioFinal ? formatoUSD(precioFinal) : "a confirmar",
        })
      : null;

  return (
    <div className="bg-panel border border-line rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
          {DISPONIBILIDAD_LABELS[disponibilidad]}
        </p>
        {precioFinal ? (
          <>
            <p className="text-sm text-muted">Precio final aproximado</p>
            <p className="font-display text-4xl tracking-wide text-ivory mt-1">
              {formatoUSD(precioFinal)}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted max-w-sm">
            El precio final aproximado todavía no está definido para este
            vehículo. Escríbenos para cotizarlo.
          </p>
        )}
      </div>

      {enlaceCompra ? (
        <a
          href={enlaceCompra}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-accent text-ink px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded hover:bg-accent-dark transition-colors text-center"
        >
          Comprar por WhatsApp
        </a>
      ) : (
        <span className="shrink-0 border border-line px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded text-muted text-center">
          WhatsApp no configurado
        </span>
      )}
    </div>
  );
}
