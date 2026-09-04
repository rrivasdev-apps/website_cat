import type { Metadata } from "next";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos por WhatsApp para cotizar tu próximo vehículo.",
};

export default async function ContactoPage() {
  const config = await obtenerConfiguracionPublica();
  const whatsappHref = config.whatsappNumero
    ? `https://wa.me/${config.whatsappNumero}`
    : null;

  return (
    <>
      <section className="pt-40 pb-24 min-h-[70vh] flex items-center border-b border-line">
        <div className="mx-auto max-w-[1600px] px-6 w-full">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Contacto
          </p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide text-ivory leading-none max-w-3xl">
            ESCRIBINOS Y COTIZAMOS TU VEHÍCULO
          </h1>
          <p className="mt-6 text-muted max-w-xl">
            Contanos qué vehículo te interesa (o mandanos el enlace de la
            ficha) y te respondemos con precio, disponibilidad y tiempos de
            entrega.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-ink px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded hover:bg-accent-dark transition-colors text-center"
              >
                Escribir por WhatsApp
              </a>
            ) : (
              <span className="border border-line px-8 py-4 text-sm font-semibold uppercase tracking-wide rounded text-muted text-center">
                WhatsApp no configurado todavía
              </span>
            )}
          </div>

          {config.whatsappNumero && (
            <p className="mt-4 text-sm text-muted">{config.whatsappNumero}</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
