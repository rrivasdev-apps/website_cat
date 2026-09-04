import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";
import { VehiculoCard } from "@/components/public/VehiculoCard";

export async function DestacadosMasVendidos() {
  const config = await obtenerConfiguracionPublica();

  const vehiculos = await prisma.vehiculo.findMany({
    where: { publicado: true, esMasVendido: true },
    orderBy: { ordenMasVendido: "asc" },
    take: config.maxMasVendidos,
    include: {
      marca: true,
      fotos: { where: { esPortada: true }, take: 1 },
    },
  });

  if (vehiculos.length === 0) return null;

  return (
    <section className="bg-panel border-y border-line">
      <div className="mx-auto max-w-[1600px] px-6 py-20 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
        <div className="relative min-h-[220px] lg:min-h-full rounded-lg overflow-hidden bg-panel-raised">
          {config.bannerDestacadosUrl ? (
            <Image
              src={config.bannerDestacadosUrl}
              alt="Más vendidos"
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center p-6">
              <p className="font-display text-3xl tracking-wide text-ivory text-center">
                MÁS VENDIDOS
              </p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Destacados
          </p>
          <h2 className="font-display text-4xl tracking-wide text-ivory mb-6">
            LOS MÁS VENDIDOS
          </h2>

          <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory">
            {vehiculos.map((v) => (
              <div key={v.id} className="w-64 shrink-0 snap-start">
                <VehiculoCard
                  vehiculo={{
                    slug: v.slug,
                    marca: v.marca.nombre,
                    modelo: v.modelo,
                    version: v.version,
                    anio: v.anio,
                    disponibilidad: v.disponibilidad,
                    precioLlegada: v.precioLlegada.toNumber(),
                    precioFinalOverride:
                      v.precioFinalOverride?.toNumber() ?? null,
                    fotoPortada: v.fotos[0]?.url ?? null,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
