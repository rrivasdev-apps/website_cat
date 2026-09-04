import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AccionesVehiculo } from "@/components/admin/AccionesVehiculo";

export default async function VehiculosPage() {
  const vehiculos = await prisma.vehiculo.findMany({
    orderBy: { createdAt: "desc" },
    include: { marca: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Vehículos</h1>
        <Link
          href="/admin/vehiculos/nuevo"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          + Nuevo vehículo
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Vehículo</th>
              <th className="px-4 py-2">Marca</th>
              <th className="px-4 py-2">Año</th>
              <th className="px-4 py-2">Precio llegada</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehiculos.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/vehiculos/${v.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {v.modelo} {v.version}
                  </Link>
                  {v.esDestacado && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] align-middle">
                      Destacado
                    </span>
                  )}
                  {v.esMasVendido && (
                    <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] align-middle">
                      Más vendido
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{v.marca.nombre}</td>
                <td className="px-4 py-3">{v.anio}</td>
                <td className="px-4 py-3">
                  ${v.precioLlegada.toNumber().toLocaleString("es-VE")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      v.publicado
                        ? "inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs"
                        : "inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
                    }
                  >
                    {v.publicado ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AccionesVehiculo id={v.id} publicado={v.publicado} />
                </td>
              </tr>
            ))}
            {vehiculos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Todavía no hay vehículos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
