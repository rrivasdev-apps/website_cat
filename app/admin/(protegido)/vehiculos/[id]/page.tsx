import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehiculoForm } from "@/components/admin/VehiculoForm";
import { EspecificacionesSeccion } from "@/components/admin/EspecificacionesSeccion";
import { GaleriaVehiculo } from "@/components/admin/GaleriaVehiculo";
import { GrupoEspec } from "@/lib/generated/prisma/enums";

export default async function EditarVehiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [vehiculo, marcas, especificaciones, fotos] = await Promise.all([
    prisma.vehiculo.findUnique({ where: { id } }),
    prisma.marca.findMany({ orderBy: { nombre: "asc" } }),
    prisma.especificacion.findMany({ where: { vehiculoId: id } }),
    prisma.foto.findMany({ where: { vehiculoId: id } }),
  ]);

  if (!vehiculo) notFound();

  return (
    <div>
      <h1 className="text-lg font-semibold mb-6">
        Editar {vehiculo.modelo} {vehiculo.version}
      </h1>
      <VehiculoForm
        marcas={marcas}
        vehiculo={{
          id: vehiculo.id,
          slug: vehiculo.slug,
          marcaId: vehiculo.marcaId,
          modelo: vehiculo.modelo,
          version: vehiculo.version,
          anio: vehiculo.anio,
          tipoAuto: vehiculo.tipoAuto,
          condicion: vehiculo.condicion,
          origen: vehiculo.origen,
          precioEmbarque: vehiculo.precioEmbarque.toNumber(),
          precioLlegada: vehiculo.precioLlegada.toNumber(),
          tasaBCVUsada: vehiculo.tasaBCVUsada.toNumber(),
          fechaPrecio: vehiculo.fechaPrecio,
          precioFinalOverride: vehiculo.precioFinalOverride?.toNumber(),
          disponibilidad: vehiculo.disponibilidad,
          descripcion: vehiculo.descripcion,
          publicado: vehiculo.publicado,
          esDestacado: vehiculo.esDestacado,
          ordenDestacado: vehiculo.ordenDestacado ?? undefined,
          esMasVendido: vehiculo.esMasVendido,
          ordenMasVendido: vehiculo.ordenMasVendido ?? undefined,
        }}
      />

      <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
        <GaleriaVehiculo vehiculoId={vehiculo.id} fotos={fotos} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200 space-y-8">
        <h2 className="text-base font-semibold">Especificaciones</h2>
        {(
          [
            GrupoEspec.CARACTERISTICAS,
            GrupoEspec.EQUIPAMIENTO,
            GrupoEspec.EXTRAS,
          ] as const
        ).map((grupo) => (
          <EspecificacionesSeccion
            key={grupo}
            vehiculoId={vehiculo.id}
            grupo={grupo}
            especificaciones={especificaciones.filter(
              (e) => e.grupo === grupo,
            )}
          />
        ))}
      </div>
    </div>
  );
}
