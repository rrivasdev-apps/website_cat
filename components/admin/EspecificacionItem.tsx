"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  actualizarEspecificacion,
  eliminarEspecificacion,
} from "@/lib/actions/especificaciones";
import type { GrupoEspec } from "@/lib/generated/prisma/enums";

type Especificacion = {
  id: string;
  icono: string | null;
  etiqueta: string;
  valor: string;
  orden: number;
};

export function EspecificacionItem({
  especificacion,
  vehiculoId,
  grupo,
}: {
  especificacion: Especificacion;
  vehiculoId: string;
  grupo: GrupoEspec;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [icono, setIcono] = useState(especificacion.icono ?? "");
  const [etiqueta, setEtiqueta] = useState(especificacion.etiqueta);
  const [valor, setValor] = useState(especificacion.valor);
  const [orden, setOrden] = useState(especificacion.orden);

  const cancelar = () => {
    setIcono(especificacion.icono ?? "");
    setEtiqueta(especificacion.etiqueta);
    setValor(especificacion.valor);
    setOrden(especificacion.orden);
    setError(null);
    setEditando(false);
  };

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await actualizarEspecificacion(especificacion.id, vehiculoId, {
        grupo,
        icono,
        etiqueta,
        valor,
        orden,
      });
      router.refresh();
      setEditando(false);
    } catch {
      setError("No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar "${especificacion.etiqueta}"?`)) return;
    setGuardando(true);
    try {
      await eliminarEspecificacion(especificacion.id, vehiculoId);
      router.refresh();
    } catch {
      setError("No se pudo eliminar.");
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (editando) {
    return (
      <tr className="bg-blue-50">
        <td className="px-3 py-2">
          <input
            value={icono}
            onChange={(e) => setIcono(e.target.value)}
            placeholder="Icono (opcional)"
            className={inputClass}
          />
        </td>
        <td className="px-3 py-2">
          <input
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
            className={inputClass}
          />
        </td>
        <td className="px-3 py-2">
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className={inputClass}
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(Number(e.target.value))}
            className={`${inputClass} w-16`}
          />
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="text-blue-600 hover:underline text-xs mr-3 disabled:opacity-50"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={cancelar}
            disabled={guardando}
            className="text-gray-500 hover:underline text-xs"
          >
            Cancelar
          </button>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-3 py-2 text-gray-500">{especificacion.icono}</td>
      <td className="px-3 py-2 font-medium">{especificacion.etiqueta}</td>
      <td className="px-3 py-2">{especificacion.valor}</td>
      <td className="px-3 py-2 text-gray-400">{especificacion.orden}</td>
      <td className="px-3 py-2 whitespace-nowrap">
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="text-blue-600 hover:underline text-xs mr-3"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={eliminar}
          disabled={guardando}
          className="text-red-600 hover:underline text-xs disabled:opacity-50"
        >
          Eliminar
        </button>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </td>
    </tr>
  );
}
