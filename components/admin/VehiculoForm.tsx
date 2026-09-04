"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vehiculoSchema,
  type VehiculoInput,
  TIPO_AUTO_LABELS,
  CONDICION_LABELS,
  DISPONIBILIDAD_LABELS,
} from "@/lib/validation/vehiculo";
import { crearVehiculo, actualizarVehiculo } from "@/lib/actions/vehiculos";
import { slugify } from "@/lib/slug";

type Marca = { id: string; nombre: string };

type VehiculoExistente = VehiculoInput & { id: string };

export function VehiculoForm({
  marcas,
  vehiculo,
}: {
  marcas: Marca[];
  vehiculo?: VehiculoExistente;
}) {
  const router = useRouter();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [slugTocado, setSlugTocado] = useState(Boolean(vehiculo));

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehiculoInput>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: vehiculo ?? {
      slug: "",
      marcaId: marcas[0]?.id ?? "",
      modelo: "",
      version: "",
      anio: new Date().getFullYear(),
      tipoAuto: "SUV",
      condicion: "NUEVO",
      origen: "",
      precioEmbarque: 0,
      precioLlegada: 0,
      tasaBCVUsada: 0,
      fechaPrecio: new Date(),
      disponibilidad: "EN_TRANSITO",
      descripcion: "",
      publicado: false,
    },
  });

  const actualizarSlugAutomatico = () => {
    if (slugTocado) return;
    const { marcaId, modelo, version, anio } = getValues();
    const marcaNombre = marcas.find((m) => m.id === marcaId)?.nombre ?? "";
    const propuesto = slugify(`${marcaNombre} ${modelo} ${version} ${anio}`);
    if (propuesto) setValue("slug", propuesto);
  };

  const onSubmit = async (datos: VehiculoInput) => {
    setErrorGeneral(null);

    const resultado = vehiculo
      ? await actualizarVehiculo(vehiculo.id, datos)
      : await crearVehiculo(datos);

    if ("error" in resultado) {
      setErrorGeneral(resultado.error);
      return;
    }

    router.push(
      `/admin/vehiculos/${"id" in resultado ? resultado.id : vehiculo?.id}`,
    );
    router.refresh();
  };

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-xs text-red-600 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Datos generales
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Marca</label>
            <select
              {...register("marcaId", { onChange: actualizarSlugAutomatico })}
              className={inputClass}
            >
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {errors.marcaId && (
              <p className={errorClass}>{errors.marcaId.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Modelo</label>
            <input
              {...register("modelo", { onChange: actualizarSlugAutomatico })}
              className={inputClass}
            />
            {errors.modelo && (
              <p className={errorClass}>{errors.modelo.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Versión</label>
            <input
              {...register("version", { onChange: actualizarSlugAutomatico })}
              className={inputClass}
            />
            {errors.version && (
              <p className={errorClass}>{errors.version.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Año</label>
            <input
              type="number"
              {...register("anio", {
                valueAsNumber: true,
                onChange: actualizarSlugAutomatico,
              })}
              className={inputClass}
            />
            {errors.anio && <p className={errorClass}>{errors.anio.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Tipo de auto</label>
            <select {...register("tipoAuto")} className={inputClass}>
              {Object.entries(TIPO_AUTO_LABELS).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Condición</label>
            <select {...register("condicion")} className={inputClass}>
              {Object.entries(CONDICION_LABELS).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Origen</label>
            <input {...register("origen")} className={inputClass} />
            {errors.origen && (
              <p className={errorClass}>{errors.origen.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Slug (URL)
              <span className="text-gray-400 font-normal"> — se genera solo</span>
            </label>
            <input
              {...register("slug", { onChange: () => setSlugTocado(true) })}
              className={inputClass}
            />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Descripción</label>
          <textarea
            {...register("descripcion")}
            rows={4}
            className={inputClass}
          />
          {errors.descripcion && (
            <p className={errorClass}>{errors.descripcion.message}</p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            id="publicado"
            type="checkbox"
            {...register("publicado")}
            className="h-4 w-4"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">
            Publicado (visible en el sitio)
          </label>
        </div>
      </fieldset>

      <fieldset className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <legend className="text-base font-semibold px-1">
          Precios y disponibilidad
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={labelClass}>Precio embarque (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("precioEmbarque", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.precioEmbarque && (
              <p className={errorClass}>{errors.precioEmbarque.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Precio llegada (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("precioLlegada", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.precioLlegada && (
              <p className={errorClass}>{errors.precioLlegada.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Tasa BCV usada</label>
            <input
              type="number"
              step="0.0001"
              {...register("tasaBCVUsada", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.tasaBCVUsada && (
              <p className={errorClass}>{errors.tasaBCVUsada.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Fecha del precio</label>
            <Controller
              control={control}
              name="fechaPrecio"
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
            {errors.fechaPrecio && (
              <p className={errorClass}>{errors.fechaPrecio.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Precio final manual (USD)
              <span className="text-gray-400 font-normal"> — opcional</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precioFinalOverride", {
                setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)),
              })}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">
              La fórmula automática de precio final todavía no está
              confirmada con el negocio — si se deja vacío, no se mostrará un
              precio final hasta definirla.
            </p>
          </div>

          <div>
            <label className={labelClass}>Disponibilidad</label>
            <select {...register("disponibilidad")} className={inputClass}>
              {Object.entries(DISPONIBILIDAD_LABELS).map(
                ([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </fieldset>

      {errorGeneral && (
        <p className="text-sm text-red-600" role="alert">
          {errorGeneral}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-900 text-white rounded px-5 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting
            ? "Guardando..."
            : vehiculo
              ? "Guardar cambios"
              : "Crear vehículo"}
        </button>
      </div>
    </form>
  );
}
