export function formatoUSD(valor: number): string {
  return valor.toLocaleString("es-VE", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
