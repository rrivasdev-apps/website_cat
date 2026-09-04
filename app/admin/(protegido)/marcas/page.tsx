import { prisma } from "@/lib/prisma";
import { MarcaForm } from "@/components/admin/MarcaForm";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { eliminarMarca } from "@/lib/actions/marcas";

export default async function MarcasPage() {
  const marcas = await prisma.marca.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { vehiculos: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h1 className="text-lg font-semibold mb-4">Marcas</h1>
        <MarcaForm />
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Vehículos</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {marcas.map((marca) => (
              <tr key={marca.id}>
                <td className="px-4 py-3">{marca.nombre}</td>
                <td className="px-4 py-3 text-gray-500">
                  {marca._count.vehiculos}
                </td>
                <td className="px-4 py-3 text-right">
                  <BotonEliminar
                    confirmacion={`¿Eliminar la marca "${marca.nombre}"?`}
                    accion={eliminarMarca.bind(null, marca.id)}
                    className="text-red-600 hover:underline text-xs disabled:opacity-50"
                  >
                    Eliminar
                  </BotonEliminar>
                </td>
              </tr>
            ))}
            {marcas.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  Todavía no hay marcas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
