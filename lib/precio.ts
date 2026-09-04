/**
 * La fórmula automática de precio final no está confirmada con el negocio
 * (ver CLAUDE.md sección 6): los montos de referencia (embarque + llegada +
 * impuestos) no sumaban el "Precio Final Aproximado" en las capturas usadas
 * para diseñar la especificación. Hasta que se confirme, `precioFinalOverride`
 * es la única fuente de verdad — si no está definido, no hay precio final que
 * mostrar todavía.
 */
export function precioFinalAproximado(
  precioFinalOverride: number | null | undefined,
): number | null {
  return precioFinalOverride ?? null;
}
