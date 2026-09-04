"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearEspecificacion } from "@/lib/actions/especificaciones";
import type { GrupoEspec } from "@/lib/generated/prisma/enums";

export function NuevaEspecificacionForm({
  vehiculoId,
  grupo,
  ordenSugerido,
}: {
  vehiculoId: string;
  grupo: GrupoEspec;
  ordenSugerido: number;
}) {
  const router = useRouter();
  const [icono, setIcono] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [valor, setValor] = useState("");
  const [orden, setOrden] = useState(ordenSugerido);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const inputClass =
    "w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const agregar = async () => {
    if (!etiqueta.trim() || !valor.trim()) {
      setError("Etiqueta y valor son obligatorios.");
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      await crearEspecificacion(vehiculoId, {
        grupo,
        icono,
        etiqueta,
        valor,
        orden,
      });
      setIcono("");
      setEtiqueta("");
      setValor("");
      setOrden(ordenSugerido + 1);
      router.refresh();
    } catch {
      setError("No se pudo agregar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <tr>
      <td className="px-3 py-2">
        <input
          value={icono}
          onChange={(e) => setIcono(e.target.value)}
          placeholder="Icono"
          className={inputClass}
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={etiqueta}
          onChange={(e) => setEtiqueta(e.target.value)}
          placeholder="Etiqueta"
          className={inputClass}
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Valor"
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
          onClick={agregar}
          disabled={enviando}
          className="text-green-700 hover:underline text-xs disabled:opacity-50"
        >
          {enviando ? "Agregando..." : "+ Agregar"}
        </button>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </td>
    </tr>
  );
}
