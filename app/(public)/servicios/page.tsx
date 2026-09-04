import type { Metadata } from "next";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";
import { CtaStrip } from "@/components/public/CtaStrip";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Cómo funciona la importación y venta de vehículos: cotización, tiempos de entrega y recepción de tu vehículo actual como parte de pago.",
};

const PASOS = [
  {
    numero: "01",
    titulo: "Elegí tu vehículo",
    texto: "Recorré el catálogo y filtrá por marca, tipo, condición u origen hasta encontrar el que buscás.",
  },
  {
    numero: "02",
    titulo: "Cotizá por WhatsApp",
    texto: "Escribinos desde la ficha del vehículo. Te confirmamos disponibilidad y el precio final antes de avanzar.",
  },
  {
    numero: "03",
    titulo: "Coordiná el pago",
    texto: "Te enviamos el desglose de costos por escrito. Aceptamos tu vehículo actual como parte de pago.",
  },
  {
    numero: "04",
    titulo: "Recibí tu vehículo",
    texto: "Los tiempos de entrega dependen del origen: en Venezuela, en tránsito o todavía en origen.",
  },
];

export default async function ServiciosPage() {
  const config = await obtenerConfiguracionPublica();
  const totalDias =
    config.tiempoPreparacionDias +
    config.tiempoTransitoDias +
    config.tiempoAduanaDias;

  return (
    <>
      <section className="pt-40 pb-20 border-b border-line">
        <div className="mx-auto max-w-[1600px] px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Servicios
          </p>
          <h1 className="font-display text-5xl sm:text-6xl tracking-wide text-ivory leading-none">
            CÓMO FUNCIONA
          </h1>
          <p className="mt-4 text-muted max-w-xl">
            Importación y venta de vehículos con seguimiento directo por
            WhatsApp, de principio a fin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PASOS.map((paso) => (
          <div
            key={paso.numero}
            className="bg-panel border border-line rounded-lg p-6"
          >
            <p className="font-display text-3xl text-accent mb-3">
              {paso.numero}
            </p>
            <h2 className="font-display text-xl tracking-wide text-ivory mb-2">
              {paso.titulo}
            </h2>
            <p className="text-sm text-muted leading-relaxed">{paso.texto}</p>
          </div>
        ))}
      </section>

      <section className="bg-panel border-y border-line">
        <div className="mx-auto max-w-[1600px] px-6 py-20">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Tiempos estimados
          </p>
          <h2 className="font-display text-4xl tracking-wide text-ivory mb-8">
            DE LA COMPRA A LA ENTREGA
          </h2>

          <dl className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-3xl">
            <div>
              <dt className="text-sm text-muted">Preparación</dt>
              <dd className="font-display text-3xl text-ivory">
                {config.tiempoPreparacionDias} días
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Tránsito</dt>
              <dd className="font-display text-3xl text-ivory">
                {config.tiempoTransitoDias} días
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Aduana</dt>
              <dd className="font-display text-3xl text-ivory">
                {config.tiempoAduanaDias} días
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Total estimado</dt>
              <dd className="font-display text-3xl text-accent">
                {totalDias} días
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted max-w-xl">
            Los tiempos varían según la disponibilidad de cada vehículo — los
            que ya están en Venezuela se entregan de inmediato.
          </p>
        </div>
      </section>

      <CtaStrip />
      <Footer />
    </>
  );
}
