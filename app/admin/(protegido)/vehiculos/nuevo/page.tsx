import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VehiculoForm } from "@/components/admin/VehiculoForm";

export default async function NuevoVehiculoPage() {
  const marcas = await prisma.marca.findMany({ orderBy: { nombre: "asc" } });

  if (marcas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-600">
          Necesitas crear al menos una marca antes de cargar un vehículo.
        </p>
        <Link
          href="/admin/marcas"
          className="inline-block mt-3 text-sm text-blue-600 hover:underline"
        >
          Ir a Marcas
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-6">Nuevo vehículo</h1>
      <VehiculoForm marcas={marcas} />
    </div>
  );
}
