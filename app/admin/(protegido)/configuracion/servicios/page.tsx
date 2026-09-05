import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { obtenerPaginaServicios } from "@/lib/data/paginas";
import { PaginaServiciosForm } from "@/components/admin/PaginaServiciosForm";
import { ServicioItemRow } from "@/components/admin/ServicioItemRow";
import { NuevoServicioItemForm } from "@/components/admin/NuevoServicioItemForm";

export default async function ConfiguracionServiciosPage() {
  const [pagina, servicios] = await Promise.all([
    obtenerPaginaServicios(),
    prisma.servicioItem.findMany({ orderBy: { orden: "asc" } }),
  ]);
  const siguienteOrden =
    servicios.length > 0
      ? Math.max(...servicios.map((s) => s.orden)) + 1
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/configuracion"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Configuración
        </Link>
        <h1 className="text-lg font-semibold mt-2">Página de Servicios</h1>
      </div>

      <PaginaServiciosForm pagina={pagina} />

      <div>
        <h2 className="text-base font-semibold mb-4">
          Servicios que se muestran en la página
        </h2>
        <div className="space-y-6">
          <NuevoServicioItemForm ordenSugerido={siguienteOrden} />
          <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-100">
            {servicios.map((servicio) => (
              <ServicioItemRow key={servicio.id} servicio={servicio} />
            ))}
            {servicios.length === 0 && (
              <p className="p-6 text-center text-gray-400 text-sm">
                Todavía no hay servicios cargados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
