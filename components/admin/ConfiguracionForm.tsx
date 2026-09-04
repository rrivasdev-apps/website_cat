"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  configuracionSchema,
  type ConfiguracionInput,
} from "@/lib/validation/configuracion";
import { guardarConfiguracion } from "@/lib/actions/configuracion";
import { SubidaImagen } from "@/components/admin/SubidaImagen";

export function ConfiguracionForm({
  configuracion,
}: {
  configuracion: ConfiguracionInput;
}) {
  const router = useRouter();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConfiguracionInput>({
    resolver: zodResolver(configuracionSchema),
    defaultValues: configuracion,
  });

  const bannerDestacadosUrl = watch("bannerDestacadosUrl");

  const onSubmit = async (datos: ConfiguracionInput) => {
    setMensaje(null);
    await guardarConfiguracion(datos);
    setMensaje("Cambios guardados.");
    router.refresh();
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-xs text-red-600 mt-1";
  const pendienteClass = "text-xs text-amber-600 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Más vendidos y tiempos de entrega
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>
              Máximo en el slider de &quot;Más vendidos&quot;
            </label>
            <input
              type="number"
              {...register("maxMasVendidos", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.maxMasVendidos && (
              <p className={errorClass}>{errors.maxMasVendidos.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Intervalo del slider principal (segundos)
            </label>
            <input
              type="number"
              {...register("sliderIntervaloSegundos", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.sliderIntervaloSegundos && (
              <p className={errorClass}>
                {errors.sliderIntervaloSegundos.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Preparación (días)</label>
            <input
              type="number"
              {...register("tiempoPreparacionDias", { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tránsito (días)</label>
            <input
              type="number"
              {...register("tiempoTransitoDias", { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Aduana (días)</label>
            <input
              type="number"
              {...register("tiempoAduanaDias", { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Tasa BCV y tarifas
        </legend>
        <p className={pendienteClass}>
          Pendiente de confirmar con el negocio — la fórmula de precio final
          no usa estos valores todavía (ver sección 6 del CLAUDE.md).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Tasa BCV vigente</label>
            <input
              type="number"
              step="0.0001"
              {...register("tasaBCVVigente", {
                setValueAs: (v) =>
                  v === "" || v === undefined ? undefined : Number(v),
              })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Fecha de la tasa</label>
            <Controller
              control={control}
              name="fechaTasaBCV"
              render={({ field }) => (
                <input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? new Date(e.target.value) : undefined,
                    )
                  }
                  className={inputClass}
                />
              )}
            />
          </div>

          <div>
            <label className={labelClass}>Tarifa de servicio fija (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("tarifaServicioFija", {
                setValueAs: (v) =>
                  v === "" || v === undefined ? undefined : Number(v),
              })}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">WhatsApp</legend>
        <p className={pendienteClass}>
          Pendiente de confirmar con el negocio (ver sección 11 del
          CLAUDE.md).
        </p>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className={labelClass}>
              Número (formato internacional, sin +)
            </label>
            <input
              placeholder="584121234567"
              {...register("whatsappNumero")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Plantilla de mensaje
              <span className="text-gray-400 font-normal">
                {" "}
                — placeholders: {"{modelo}"}, {"{anio}"}, {"{precio}"}
              </span>
            </label>
            <textarea
              rows={3}
              {...register("whatsappMensajePlantilla")}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Contenido del sitio
        </legend>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className={labelClass}>Información importante</label>
            <textarea
              rows={4}
              {...register("informacionImportante")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Texto legal del footer</label>
            <textarea
              rows={3}
              {...register("footerTextoLegal")}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Banner de destacados</label>
            <div className="flex items-center gap-3">
              {bannerDestacadosUrl && (
                <Image
                  src={bannerDestacadosUrl}
                  alt=""
                  width={120}
                  height={64}
                  className="rounded object-cover border border-gray-200"
                />
              )}
              <Controller
                control={control}
                name="bannerDestacadosUrl"
                render={({ field }) => (
                  <SubidaImagen
                    carpeta="configuracion"
                    etiqueta={
                      field.value ? "Cambiar banner" : "Subir banner"
                    }
                    onSubido={([url]) => field.onChange(url)}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </fieldset>

      {mensaje && <p className="text-sm text-green-700">{mensaje}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gray-900 text-white rounded px-5 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : "Guardar configuración"}
      </button>
    </form>
  );
}
