"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SubidaImagen } from "@/components/admin/SubidaImagen";
import {
  agregarFotos,
  marcarPortada,
  eliminarFoto,
  actualizarOrdenFoto,
} from "@/lib/actions/fotos";

type Foto = {
  id: string;
  url: string;
  esPortada: boolean;
  orden: number;
};

export function GaleriaVehiculo({
  vehiculoId,
  fotos,
}: {
  vehiculoId: string;
  fotos: Foto[];
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const ordenadas = [...fotos].sort((a, b) => a.orden - b.orden);

  const handleSubido = (urls: string[]) => {
    setError(null);
    startTransition(async () => {
      try {
        await agregarFotos(vehiculoId, urls);
        router.refresh();
      } catch {
        setError("No se pudieron guardar las fotos subidas.");
      }
    });
  };

  const handlePortada = (id: string) => {
    startTransition(async () => {
      await marcarPortada(id, vehiculoId);
      router.refresh();
    });
  };

  const handleOrden = (id: string, orden: number) => {
    startTransition(async () => {
      await actualizarOrdenFoto(id, vehiculoId, orden);
      router.refresh();
    });
  };

  const handleEliminar = (id: string) => {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    startTransition(async () => {
      await eliminarFoto(id, vehiculoId);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Galería de fotos</h2>
        <SubidaImagen
          multiple
          carpeta={`vehiculos/${vehiculoId}`}
          etiqueta="+ Subir fotos"
          onSubido={handleSubido}
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {ordenadas.length === 0 ? (
        <p className="text-sm text-gray-400">Todavía no hay fotos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ordenadas.map((foto) => (
            <div
              key={foto.id}
              className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
            >
              <div className="relative aspect-video">
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                {foto.esPortada && (
                  <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Portada
                  </span>
                )}
              </div>
              <div className="p-2 flex items-center justify-between gap-2 text-xs">
                <input
                  type="number"
                  value={foto.orden}
                  onChange={(e) => handleOrden(foto.id, Number(e.target.value))}
                  disabled={pendiente}
                  className="w-12 rounded border border-gray-300 px-1 py-0.5"
                />
                <div className="flex gap-2">
                  {!foto.esPortada && (
                    <button
                      type="button"
                      onClick={() => handlePortada(foto.id)}
                      disabled={pendiente}
                      className="text-blue-600 hover:underline disabled:opacity-50"
                    >
                      Portada
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEliminar(foto.id)}
                    disabled={pendiente}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
