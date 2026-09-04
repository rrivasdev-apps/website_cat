"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearFaq } from "@/lib/actions/faq";

export function NuevaFaqForm({ ordenSugerido }: { ordenSugerido: number }) {
  const router = useRouter();
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [orden, setOrden] = useState(ordenSugerido);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await crearFaq({ pregunta, respuesta, orden, publicado: true });
      setPregunta("");
      setRespuesta("");
      setOrden(ordenSugerido + 1);
      router.refresh();
    } catch {
      setError("No se pudo agregar la pregunta.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-3"
    >
      <h2 className="text-sm font-semibold">Nueva pregunta</h2>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Pregunta
        </label>
        <input
          required
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
          required
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>
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
      <button
        type="submit"
        disabled={enviando}
        className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {enviando ? "Agregando..." : "Agregar pregunta"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
