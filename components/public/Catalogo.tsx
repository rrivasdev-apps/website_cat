"use client";

import { useEffect, useState } from "react";
import { VehiculoCard, type VehiculoTarjeta } from "@/components/public/VehiculoCard";
import { TIPO_AUTO_LABELS, CONDICION_LABELS } from "@/lib/validation/vehiculo";

type Marca = { id: string; nombre: string };

type RespuestaCatalogo = {
  vehiculos: VehiculoTarjeta[];
  nextCursor: string | null;
};

export function Catalogo({
  marcas,
  origenes,
}: {
  marcas: Marca[];
  origenes: string[];
}) {
  const [origen, setOrigen] = useState("");
  const [condicion, setCondicion] = useState("");
  const [tipo, setTipo] = useState("");
  const [marca, setMarca] = useState("");
  const [orden, setOrden] = useState("reciente");

  const [vehiculos, setVehiculos] = useState<VehiculoTarjeta[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);

  const construirParams = (cursorActual: string | null) => {
    const params = new URLSearchParams();
    if (origen) params.set("origen", origen);
    if (condicion) params.set("condicion", condicion);
    if (tipo) params.set("tipo", tipo);
    if (marca) params.set("marca", marca);
    if (orden) params.set("orden", orden);
    if (cursorActual) params.set("cursor", cursorActual);
    return params.toString();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag before a data fetch, React's documented fetch-in-effect pattern
    setCargando(true);
    fetch(`/api/vehiculos?${construirParams(null)}`)
      .then((r) => r.json())
      .then((datos: RespuestaCatalogo) => {
        setVehiculos(datos.vehiculos);
        setCursor(datos.nextCursor);
      })
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origen, condicion, tipo, marca, orden]);

  const mostrarMas = async () => {
    if (!cursor) return;
    setCargandoMas(true);
    const res = await fetch(`/api/vehiculos?${construirParams(cursor)}`);
    const datos: RespuestaCatalogo = await res.json();
    setVehiculos((prev) => [...prev, ...datos.vehiculos]);
    setCursor(datos.nextCursor);
    setCargandoMas(false);
  };

  const selectClass =
    "bg-panel border border-line rounded px-3 py-2 text-sm text-ivory focus:outline-none focus:border-accent";

  return (
    <section id="catalogo" className="mx-auto max-w-[1600px] px-6 py-20">
      <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
        Catálogo
      </p>
      <h2 className="font-display text-4xl tracking-wide text-ivory mb-8">
        VEHÍCULOS DISPONIBLES
      </h2>

      <div className="flex flex-wrap gap-3 mb-10">
        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className={selectClass}
        >
          <option value="">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={selectClass}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPO_AUTO_LABELS).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>

        <select
          value={condicion}
          onChange={(e) => setCondicion(e.target.value)}
          className={selectClass}
        >
          <option value="">Nuevo y usado</option>
          {Object.entries(CONDICION_LABELS).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>

        {origenes.length > 0 && (
          <select
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className={selectClass}
          >
            <option value="">Todos los orígenes</option>
            {origenes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className={selectClass}
        >
          <option value="reciente">Más recientes</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
        </select>
      </div>

      {cargando ? (
        <p className="text-muted text-sm">Cargando vehículos...</p>
      ) : vehiculos.length === 0 ? (
        <p className="text-muted text-sm">
          No hay vehículos publicados con esos filtros.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehiculos.map((v, i) => (
              <VehiculoCard key={v.slug} vehiculo={v} prioridad={i === 0} />
            ))}
          </div>

          {cursor && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={mostrarMas}
                disabled={cargandoMas}
                className="border border-line px-6 py-3 text-sm font-semibold uppercase tracking-wide rounded hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
              >
                {cargandoMas ? "Cargando..." : "Mostrar más"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
