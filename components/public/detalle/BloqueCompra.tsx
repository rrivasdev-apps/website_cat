import { formatoUSD } from "@/lib/formato";

type TiemposEntrega = {
  preparacion: number;
  transito: number;
  aduana: number;
};

export function BloqueCompra({
  precioEmbarque,
  precioLlegada,
  tasaBCVUsada,
  tiemposEntrega,
}: {
  precioEmbarque: number;
  precioLlegada: number;
  tasaBCVUsada: number;
  tiemposEntrega: TiemposEntrega;
}) {
  const totalDias =
    tiemposEntrega.preparacion + tiemposEntrega.transito + tiemposEntrega.aduana;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Costos
        </h3>
        <dl className="space-y-2">
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Precio de embarque</dt>
            <dd className="text-ivory">{formatoUSD(precioEmbarque)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Precio de llegada</dt>
            <dd className="text-ivory">{formatoUSD(precioLlegada)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Tasa BCV usada</dt>
            <dd className="text-ivory">{tasaBCVUsada.toFixed(2)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted leading-relaxed">
          El desglose de impuestos y el cálculo del precio final todavía no
          están confirmados con el negocio — el precio final aproximado (si
          está disponible) se muestra en la sección de arriba.
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
          Tiempos de entrega estimados
        </h3>
        <dl className="space-y-2">
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Preparación</dt>
            <dd className="text-ivory">{tiemposEntrega.preparacion} días</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Tránsito</dt>
            <dd className="text-ivory">{tiemposEntrega.transito} días</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted">Aduana</dt>
            <dd className="text-ivory">{tiemposEntrega.aduana} días</dd>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-line font-semibold">
            <dt className="text-ivory">Total estimado</dt>
            <dd className="text-accent">{totalDias} días</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
