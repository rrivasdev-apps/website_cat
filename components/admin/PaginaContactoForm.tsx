"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paginaContactoSchema,
  type PaginaContactoInput,
} from "@/lib/validation/paginaContacto";
import { guardarPaginaContacto } from "@/lib/actions/paginaContacto";

export function PaginaContactoForm({
  pagina,
}: {
  pagina: PaginaContactoInput;
}) {
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PaginaContactoInput>({
    resolver: zodResolver(paginaContactoSchema),
    defaultValues: pagina,
  });

  const onSubmit = async (datos: PaginaContactoInput) => {
    setMensaje(null);
    await guardarPaginaContacto(datos);
    setMensaje("Cambios guardados.");
    router.refresh();
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">Encabezado</legend>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className={labelClass}>Título</label>
            <input {...register("titulo")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subtítulo</label>
            <textarea
              rows={3}
              {...register("subtitulo")}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          El número de WhatsApp y el botón de contacto se configuran en{" "}
          <span className="font-medium">Configuración general</span>.
        </p>
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
