"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  alternarPublicado,
  duplicarVehiculo,
} from "@/lib/actions/vehiculos";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { eliminarVehiculo } from "@/lib/actions/vehiculos";

export function AccionesVehiculo({
  id,
  publicado,
}: {
  id: string;
  publicado: boolean;
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();

  const handleTogglePublicado = () => {
    startTransition(async () => {
      await alternarPublicado(id, !publicado);
      router.refresh();
    });
  };

  const handleDuplicar = () => {
    startTransition(async () => {
      const { id: nuevoId } = await duplicarVehiculo(id);
      router.push(`/admin/vehiculos/${nuevoId}`);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-3 text-xs">
      <button
        type="button"
        onClick={handleTogglePublicado}
        disabled={pendiente}
        className="text-blue-600 hover:underline disabled:opacity-50"
      >
        {publicado ? "Despublicar" : "Publicar"}
      </button>
      <button
        type="button"
        onClick={handleDuplicar}
        disabled={pendiente}
        className="text-gray-600 hover:underline disabled:opacity-50"
      >
        Duplicar
      </button>
      <BotonEliminar
        confirmacion="¿Eliminar este vehículo? Esta acción no se puede deshacer."
        accion={() => eliminarVehiculo(id)}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        Eliminar
      </BotonEliminar>
    </div>
  );
}
