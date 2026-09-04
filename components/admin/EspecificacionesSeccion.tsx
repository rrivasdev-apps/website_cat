import { EspecificacionItem } from "@/components/admin/EspecificacionItem";
import { NuevaEspecificacionForm } from "@/components/admin/NuevaEspecificacionForm";
import { GRUPO_ESPEC_LABELS } from "@/lib/validation/especificacion";
import type { GrupoEspec } from "@/lib/generated/prisma/enums";

type Especificacion = {
  id: string;
  icono: string | null;
  etiqueta: string;
  valor: string;
  orden: number;
};

export function EspecificacionesSeccion({
  vehiculoId,
  grupo,
  especificaciones,
}: {
  vehiculoId: string;
  grupo: GrupoEspec;
  especificaciones: Especificacion[];
}) {
  const ordenadas = [...especificaciones].sort((a, b) => a.orden - b.orden);
  const siguienteOrden =
    ordenadas.length > 0 ? ordenadas[ordenadas.length - 1].orden + 1 : 0;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {GRUPO_ESPEC_LABELS[grupo]}
      </h3>
      <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-3 py-2 w-20">Icono</th>
            <th className="px-3 py-2">Etiqueta</th>
            <th className="px-3 py-2">Valor</th>
            <th className="px-3 py-2 w-16">Orden</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ordenadas.map((esp) => (
            <EspecificacionItem
              key={esp.id}
              especificacion={esp}
              vehiculoId={vehiculoId}
              grupo={grupo}
            />
          ))}
          <NuevaEspecificacionForm
            vehiculoId={vehiculoId}
            grupo={grupo}
            ordenSugerido={siguienteOrden}
          />
        </tbody>
      </table>
    </div>
  );
}
