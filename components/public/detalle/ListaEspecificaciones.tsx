type Especificacion = {
  id: string;
  icono: string | null;
  etiqueta: string;
  valor: string;
};

export function ListaEspecificaciones({
  especificaciones,
}: {
  especificaciones: Especificacion[];
}) {
  if (especificaciones.length === 0) {
    return <p className="text-sm text-muted">Sin información todavía.</p>;
  }

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {especificaciones.map((e) => (
        <div key={e.id} className="flex items-center justify-between gap-4 border-b border-line pb-2">
          <dt className="text-sm text-muted flex items-center gap-2">
            {e.icono && <span aria-hidden>{e.icono}</span>}
            {e.etiqueta}
          </dt>
          <dd className="text-sm text-ivory font-medium text-right">
            {e.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}
