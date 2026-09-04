import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";
import { precioFinalAproximado } from "@/lib/precio";
import { formatoUSD } from "@/lib/formato";
import { GrupoEspec } from "@/lib/generated/prisma/enums";
import { ImagenPrincipal } from "@/components/public/detalle/ImagenPrincipal";
import { GaleriaFotos } from "@/components/public/detalle/GaleriaFotos";
import { ListaEspecificaciones } from "@/components/public/detalle/ListaEspecificaciones";
import { BloqueCompra } from "@/components/public/detalle/BloqueCompra";
import { PrecioFinal } from "@/components/public/detalle/PrecioFinal";
import { AcordeonSeccion } from "@/components/public/AcordeonSeccion";
import { CtaStrip } from "@/components/public/CtaStrip";
import { Footer } from "@/components/public/Footer";

async function obtenerVehiculo(slug: string) {
  return prisma.vehiculo.findFirst({
    where: { slug, publicado: true },
    include: {
      marca: true,
      especificaciones: { orderBy: { orden: "asc" } },
      fotos: { orderBy: { orden: "asc" } },
    },
  });
}

function esTiemposEntrega(
  valor: unknown,
): valor is { preparacion: number; transito: number; aduana: number } {
  return (
    !!valor &&
    typeof valor === "object" &&
    "preparacion" in valor &&
    "transito" in valor &&
    "aduana" in valor
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehiculo = await obtenerVehiculo(slug);
  if (!vehiculo) return {};

  const precio = precioFinalAproximado(
    vehiculo.precioFinalOverride?.toNumber(),
  );
  const titulo = `${vehiculo.marca.nombre} ${vehiculo.modelo} ${vehiculo.version} ${vehiculo.anio}`;

  return {
    title: titulo,
    description: `${titulo}${precio ? ` — ${formatoUSD(precio)}` : ""}. ${vehiculo.descripcion.slice(0, 140)}`,
  };
}

export default async function DetalleVehiculoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [vehiculo, config] = await Promise.all([
    obtenerVehiculo(slug),
    obtenerConfiguracionPublica(),
  ]);

  if (!vehiculo) notFound();

  const fotoPortada = vehiculo.fotos.find((f) => f.esPortada) ?? vehiculo.fotos[0];
  const caracteristicas = vehiculo.especificaciones.filter(
    (e) => e.grupo === GrupoEspec.CARACTERISTICAS,
  );
  const equipamiento = vehiculo.especificaciones.filter(
    (e) => e.grupo === GrupoEspec.EQUIPAMIENTO || e.grupo === GrupoEspec.EXTRAS,
  );
  const precioFinal = precioFinalAproximado(
    vehiculo.precioFinalOverride?.toNumber(),
  );
  const tiemposEntrega = esTiemposEntrega(vehiculo.tiemposEntregaOverride)
    ? vehiculo.tiemposEntregaOverride
    : {
        preparacion: config.tiempoPreparacionDias,
        transito: config.tiempoTransitoDias,
        aduana: config.tiempoAduanaDias,
      };
  const informacionImportante =
    vehiculo.informacionImportanteOverride ?? config.informacionImportante;

  return (
    <>
      <ImagenPrincipal
        fotoUrl={fotoPortada?.url ?? null}
        marca={vehiculo.marca.nombre}
        modelo={vehiculo.modelo}
        version={vehiculo.version}
        precio={precioFinal ?? vehiculo.precioLlegada.toNumber()}
      />

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        <AcordeonSeccion titulo="CARACTERÍSTICAS" abiertaPorDefecto>
          <ListaEspecificaciones especificaciones={caracteristicas} />
        </AcordeonSeccion>

        <GaleriaFotos
          fotos={vehiculo.fotos.map((f) => f.url)}
          nombre={`${vehiculo.marca.nombre} ${vehiculo.modelo}`}
        />

        <section>
          <h2 className="font-display text-2xl tracking-wide text-ivory mb-4">
            DESCRIPCIÓN
          </h2>
          <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
            {vehiculo.descripcion}
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-wide text-ivory mb-4">
            EQUIPAMIENTO
          </h2>
          <ListaEspecificaciones especificaciones={equipamiento} />
        </section>

        <AcordeonSeccion titulo="COMPRA">
          <BloqueCompra
            precioEmbarque={vehiculo.precioEmbarque.toNumber()}
            precioLlegada={vehiculo.precioLlegada.toNumber()}
            tasaBCVUsada={vehiculo.tasaBCVUsada.toNumber()}
            tiemposEntrega={tiemposEntrega}
          />
        </AcordeonSeccion>

        <PrecioFinal
          precioFinal={precioFinal}
          disponibilidad={vehiculo.disponibilidad}
          modelo={`${vehiculo.marca.nombre} ${vehiculo.modelo} ${vehiculo.version}`}
          anio={vehiculo.anio}
          whatsappNumero={config.whatsappNumero}
          whatsappPlantilla={config.whatsappMensajePlantilla}
        />

        {informacionImportante && (
          <section>
            <h2 className="font-display text-2xl tracking-wide text-ivory mb-4">
              INFORMACIÓN IMPORTANTE
            </h2>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
              {informacionImportante}
            </p>
          </section>
        )}
      </div>

      <CtaStrip />
      <Footer />
    </>
  );
}
