"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { actualizarFaq, eliminarFaq } from "@/lib/actions/faq";

type Faq = {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  publicado: boolean;
};

export function FaqItem({ faq }: { faq: Faq }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pregunta, setPregunta] = useState(faq.pregunta);
  const [respuesta, setRespuesta] = useState(faq.respuesta);
  const [orden, setOrden] = useState(faq.orden);
  const [publicado, setPublicado] = useState(faq.publicado);

  const inputClass =
    "w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const cancelar = () => {
    setPregunta(faq.pregunta);
    setRespuesta(faq.respuesta);
    setOrden(faq.orden);
    setPublicado(faq.publicado);
    setError(null);
    setEditando(false);
  };

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await actualizarFaq(faq.id, { pregunta, respuesta, orden, publicado });
      router.refresh();
      setEditando(false);
    } catch {
      setError("No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar la pregunta "${faq.pregunta}"?`)) return;
    setGuardando(true);
    try {
      await eliminarFaq(faq.id);
      router.refresh();
    } catch {
      setError("No se pudo eliminar.");
      setGuardando(false);
    }
  };

  if (editando) {
    return (
      <div className="p-4 bg-blue-50 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Pregunta
          </label>
          <input
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Respuesta
          </label>
          <textarea
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
              className={`${inputClass} w-20`}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-4">
            <input
              type="checkbox"
              checked={publicado}
              onChange={(e) => setPublicado(e.target.checked)}
              className="h-4 w-4"
            />
            Publicado
          </label>
        </div>
        <div>
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
          {error && <span className="text-xs text-red-600 ml-3">{error}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{faq.pregunta}</p>
          {!faq.publicado && (
            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px]">
              Oculta
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {faq.respuesta}
        </p>
      </div>
      <div className="shrink-0 flex items-center gap-3 text-xs">
        <span className="text-gray-400">#{faq.orden}</span>
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="text-blue-600 hover:underline"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={eliminar}
          disabled={guardando}
          className="text-red-600 hover:underline disabled:opacity-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
