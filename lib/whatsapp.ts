export function construirEnlaceWhatsApp(
  numero: string,
  plantilla: string,
  variables: Record<string, string>,
): string {
  let mensaje = plantilla;
  for (const [clave, valor] of Object.entries(variables)) {
    mensaje = mensaje.replaceAll(`{${clave}}`, valor);
  }
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
