import type { Metadata } from "next";
import Image from "next/image";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";
import { CtaStrip } from "@/components/public/CtaStrip";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Importación directa y concesionario, al detal o al mayor — los servicios de Avan Motors.",
};

const HERO_IMG =
  "https://lm1tc86gllmlsrp3.public.blob.vercel-storage.com/vehiculos/gs8/gac-gs8-uwyndBBlFvm4o42yE0iPceMzB6rh9a.jpg";

const SERVICIOS = [
  {
    numero: "01",
    titulo: "Importación directa",
    texto:
      "Trae tu vehículo directo desde el país de origen. Te acompañamos en cada paso — cotización, aduana y entrega — hasta que lo tengas en tus manos.",
    imagen:
      "https://lm1tc86gllmlsrp3.public.blob.vercel-storage.com/vehiculos/land-cruiser/toyota-landcruiser-Txa8QcheKI6dmv65UklGG36hqAZn2E.jpg",
    alt: "Vehículo importado directamente, disponible en Avan Motors",
  },
  {
    numero: "02",
    titulo: "Compra y venta en concesionario",
    texto:
      "Vehículos disponibles para revisar y comprar de inmediato en nuestro concesionario, sin esperar tiempos de importación.",
    imagen:
      "https://lm1tc86gllmlsrp3.public.blob.vercel-storage.com/vehiculos/cr-v/honda-crv-ZL97Y9nUVLdqDSHqd0aVgrlhYK1wrT.jpg",
    alt: "Vehículo disponible en el concesionario de Avan Motors",
  },
  {
    numero: "03",
    titulo: "Importación al mayor",
    texto:
      "Compras en volumen para flotas, concesionarios y revendedores, con condiciones preferenciales según la cantidad de unidades.",
    imagen:
      "https://lm1tc86gllmlsrp3.public.blob.vercel-storage.com/vehiculos/hilux/toyota-hilux2-D9imfFHyasJoF7NTHPF83MuZwV8h1Z.jpg",
    alt: "Importación de vehículos al mayor para flotas y revendedores",
  },
  {
    numero: "04",
    titulo: "Venta al mayor en concesionario",
    texto:
      "Adquiere varias unidades directo de nuestro inventario en concesionario — ideal para flotas y negocios que necesitan varios vehículos a la vez.",
    imagen:
      "https://lm1tc86gllmlsrp3.public.blob.vercel-storage.com/vehiculos/emkoo/gac-emkoo-Elo2hFJ2Zs4UlEBXoBUFT0nycs5Yji.jpg",
    alt: "Venta al mayor de vehículos en el concesionario de Avan Motors",
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
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden bg-panel">
        <Image
          src={HERO_IMG}
          alt="Vehículo GAC de Avan Motors"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

        <div className="relative h-full mx-auto max-w-[1600px] px-6 flex flex-col justify-end pb-16">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Avan Motors
          </p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide text-ivory leading-none">
            NUESTROS SERVICIOS
          </h1>
          <p className="mt-4 text-lg text-ivory max-w-xl">
            Importación directa y concesionario — al detal o al mayor, como lo
            necesites.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20 space-y-20">
        {SERVICIOS.map((servicio, i) => (
          <div
            key={servicio.numero}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          >
            <div
              className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-panel-raised ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <Image
                src={servicio.imagen}
                alt={servicio.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            <div>
              <p className="font-display text-4xl text-accent mb-3">
                {servicio.numero}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl tracking-wide text-ivory mb-4">
                {servicio.titulo.toUpperCase()}
              </h2>
              <p className="text-muted leading-relaxed max-w-md">
                {servicio.texto}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-panel border-y border-line">
        <div className="mx-auto max-w-[1600px] px-6 py-16">
          <div className="border border-line rounded-lg p-8 flex flex-col sm:flex-row sm:items-center gap-6">
            <span className="shrink-0 inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide w-fit">
              Próximamente
            </span>
            <div>
              <h2 className="font-display text-2xl tracking-wide text-ivory mb-1">
                TALLER DE SERVICIO ESPECIALIZADO
              </h2>
              <p className="text-sm text-muted max-w-xl">
                Muy pronto sumamos nuestro propio taller de servicio
                especializado, para el mantenimiento de tu vehículo con la
                misma atención directa de siempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-20">
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
          Tiempos estimados
        </p>
        <h2 className="font-display text-4xl tracking-wide text-ivory mb-2">
          DE LA COMPRA A LA ENTREGA
        </h2>
        <p className="text-sm text-muted max-w-xl mb-8">
          Aplica a los vehículos que importamos — los que ya están en nuestro
          concesionario están disponibles de inmediato.
        </p>

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
      </section>

      <CtaStrip />
      <Footer />
    </>
  );
}
