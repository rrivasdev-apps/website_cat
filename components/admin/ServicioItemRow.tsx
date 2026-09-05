"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  actualizarServicioItem,
  eliminarServicioItem,
} from "@/lib/actions/paginaServicios";
import { SubidaImagen } from "@/components/admin/SubidaImagen";

type ServicioItem = {
  id: string;
  titulo: string;
  texto: string;
  imagenUrl: string | null;
  orden: number;
  publicado: boolean;
};

export function ServicioItemRow({ servicio }: { servicio: ServicioItem }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState(servicio.titulo);
  const [texto, setTexto] = useState(servicio.texto);
  const [imagenUrl, setImagenUrl] = useState(servicio.imagenUrl ?? "");
  const [orden, setOrden] = useState(servicio.orden);
  const [publicado, setPublicado] = useState(servicio.publicado);

  const inputClass =
    "w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const cancelar = () => {
    setTitulo(servicio.titulo);
    setTexto(servicio.texto);
    setImagenUrl(servicio.imagenUrl ?? "");
    setOrden(servicio.orden);
    setPublicado(servicio.publicado);
    setError(null);
    setEditando(false);
  };

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await actualizarServicioItem(servicio.id, {
        titulo,
        texto,
        imagenUrl,
        orden,
        publicado,
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
    if (!window.confirm(`¿Eliminar el servicio "${servicio.titulo}"?`)) return;
    setGuardando(true);
    try {
      await eliminarServicioItem(servicio.id);
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
            Título
          </label>
          <input
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
      <div className="flex items-start gap-3 min-w-0">
        {servicio.imagenUrl && (
          <Image
            src={servicio.imagenUrl}
            alt=""
            width={64}
            height={48}
            className="rounded object-cover border border-gray-200 shrink-0"
          />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{servicio.titulo}</p>
            {!servicio.publicado && (
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px]">
                Oculto
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {servicio.texto}
          </p>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-3 text-xs">
        <span className="text-gray-400">#{servicio.orden}</span>
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
