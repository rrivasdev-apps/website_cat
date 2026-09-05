"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearServicioItem } from "@/lib/actions/paginaServicios";
import { SubidaImagen } from "@/components/admin/SubidaImagen";

export function NuevoServicioItemForm({
  ordenSugerido,
}: {
  ordenSugerido: number;
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
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
      await crearServicioItem({
        titulo,
        texto,
        imagenUrl,
        orden,
        publicado: true,
      });
      setTitulo("");
      setTexto("");
      setImagenUrl("");
      setOrden(ordenSugerido + 1);
      router.refresh();
    } catch {
      setError("No se pudo agregar el servicio.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-3"
    >
      <h2 className="text-sm font-semibold">Nuevo servicio</h2>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Texto
        </label>
        <textarea
          required
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Imagen
        </label>
        <div className="flex items-center gap-2">
          {imagenUrl && (
            <Image
              src={imagenUrl}
              alt=""
              width={64}
              height={48}
              className="rounded object-cover border border-gray-200"
            />
          )}
          <SubidaImagen
            carpeta="paginas/servicios"
            etiqueta={imagenUrl ? "Cambiar imagen" : "Subir imagen"}
            onSubido={([url]) => setImagenUrl(url)}
          />
        </div>
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
        {enviando ? "Agregando..." : "Agregar servicio"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
