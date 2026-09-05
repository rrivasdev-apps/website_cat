"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paginaServiciosSchema,
  type PaginaServiciosInput,
} from "@/lib/validation/paginaServicios";
import { guardarPaginaServicios } from "@/lib/actions/paginaServicios";
import { SubidaImagen } from "@/components/admin/SubidaImagen";

export function PaginaServiciosForm({
  pagina,
}: {
  pagina: PaginaServiciosInput;
}) {
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm<PaginaServiciosInput>({
    resolver: zodResolver(paginaServiciosSchema),
    defaultValues: pagina,
  });

  const heroImagenUrl = watch("heroImagenUrl");

  const onSubmit = async (datos: PaginaServiciosInput) => {
    setMensaje(null);
    await guardarPaginaServicios(datos);
    setMensaje("Cambios guardados.");
    router.refresh();
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Hero de la página
        </legend>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className={labelClass}>Imagen de fondo</label>
            <div className="flex items-center gap-3">
              {heroImagenUrl && (
                <Image
                  src={heroImagenUrl}
                  alt=""
                  width={120}
                  height={68}
                  className="rounded object-cover border border-gray-200"
                />
              )}
              <Controller
                control={control}
                name="heroImagenUrl"
                render={({ field }) => (
                  <SubidaImagen
                    carpeta="paginas/servicios"
                    etiqueta={field.value ? "Cambiar imagen" : "Subir imagen"}
                    onSubido={([url]) => field.onChange(url)}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Título</label>
            <input {...register("heroTitulo")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slogan</label>
            <textarea
              rows={2}
              {...register("heroSlogan")}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Taller de servicio (próximamente)
        </legend>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              {...register("tallerActivo")}
              className="h-4 w-4"
            />
            Mostrar este bloque en la página
          </label>
          <div>
            <label className={labelClass}>Título</label>
            <input {...register("tallerTitulo")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Texto</label>
            <textarea
              rows={3}
              {...register("tallerTexto")}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {mensaje && <p className="text-sm text-green-700">{mensaje}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gray-900 text-white rounded px-5 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
