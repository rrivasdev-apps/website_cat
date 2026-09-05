import { prisma } from "@/lib/prisma";

const HERO_SERVICIOS_DEFAULT =
  "https://lm1tc86gllmlsrp3.public.blob.vercel-storage.com/vehiculos/gs8/gac-gs8-uwyndBBlFvm4o42yE0iPceMzB6rh9a.jpg";

export async function obtenerPaginaServicios() {
  const pagina = await prisma.paginaServicios.findUnique({ where: { id: 1 } });

  return {
    heroImagenUrl: pagina?.heroImagenUrl ?? HERO_SERVICIOS_DEFAULT,
    heroTitulo: pagina?.heroTitulo ?? "NUESTROS SERVICIOS",
    heroSlogan:
      pagina?.heroSlogan ??
      "Importación directa y concesionario — al detal o al mayor, como lo necesites.",
    tallerActivo: pagina?.tallerActivo ?? true,
    tallerTitulo: pagina?.tallerTitulo ?? "TALLER DE SERVICIO ESPECIALIZADO",
    tallerTexto:
      pagina?.tallerTexto ??
      "Muy pronto sumamos nuestro propio taller de servicio especializado, para el mantenimiento de tu vehículo con la misma atención directa de siempre.",
  };
}

export async function obtenerServicioItems() {
  return prisma.servicioItem.findMany({
    where: { publicado: true },
    orderBy: { orden: "asc" },
  });
}

export async function obtenerPaginaContacto() {
  const pagina = await prisma.paginaContacto.findUnique({ where: { id: 1 } });

  return {
    titulo: pagina?.titulo ?? "ESCRÍBENOS Y COTIZAMOS TU VEHÍCULO",
    subtitulo:
      pagina?.subtitulo ??
      "Cuéntanos qué vehículo te interesa (o envíanos el enlace de la ficha) y te respondemos con precio, disponibilidad y tiempos de entrega.",
  };
}
