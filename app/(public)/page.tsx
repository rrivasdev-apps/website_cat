import { prisma } from "@/lib/prisma";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";
import { HeroSlider } from "@/components/public/HeroSlider";
import { Catalogo } from "@/components/public/Catalogo";
import { DestacadosMasVendidos } from "@/components/public/DestacadosMasVendidos";
import { Faq } from "@/components/public/Faq";
import { CtaStrip } from "@/components/public/CtaStrip";
import { Footer } from "@/components/public/Footer";

export default async function HomePage() {
  const [slides, marcas, origenesRaw, faqs, config] = await Promise.all([
    prisma.slide.findMany({
      where: { activo: true, vehiculo: { publicado: true } },
      orderBy: { orden: "asc" },
      include: {
        vehiculo: {
          include: { marca: true, fotos: { where: { esPortada: true }, take: 1 } },
        },
      },
    }),
    prisma.marca.findMany({ orderBy: { nombre: "asc" } }),
    prisma.vehiculo.findMany({
      where: { publicado: true },
      distinct: ["origen"],
      select: { origen: true },
    }),
    prisma.faq.findMany({
      where: { publicado: true },
      orderBy: { orden: "asc" },
    }),
    obtenerConfiguracionPublica(),
  ]);

  return (
    <>
      <HeroSlider
        slides={slides.map((s) => ({
          slideId: s.id,
          slug: s.vehiculo.slug,
          marca: s.vehiculo.marca.nombre,
          modelo: s.vehiculo.modelo,
          version: s.vehiculo.version,
          anio: s.vehiculo.anio,
          precioLlegada: s.vehiculo.precioLlegada.toNumber(),
          fotoPortada: s.vehiculo.fotos[0]?.url ?? null,
        }))}
        intervaloSegundos={config.sliderIntervaloSegundos}
      />

      <Catalogo
        marcas={marcas}
        origenes={origenesRaw.map((o) => o.origen)}
      />

      <DestacadosMasVendidos />

      <Faq preguntas={faqs} />

      <CtaStrip />
      <Footer />
    </>
  );
}
