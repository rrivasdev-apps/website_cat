import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehiculoForm } from "@/components/admin/VehiculoForm";

export default async function EditarVehiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [vehiculo, marcas] = await Promise.all([
    prisma.vehiculo.findUnique({ where: { id } }),
    prisma.marca.findMany({ orderBy: { nombre: "asc" } }),
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
        }}
      />
    </div>
  );
}
