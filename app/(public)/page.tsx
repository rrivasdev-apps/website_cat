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
    prisma.vehiculo.findMany({
      where: { esDestacado: true, publicado: true },
      orderBy: { ordenDestacado: "asc" },
      include: { marca: true, fotos: { where: { esPortada: true }, take: 1 } },
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
        slides={slides.map((v) => ({
          slideId: v.id,
          slug: v.slug,
          marca: v.marca.nombre,
          modelo: v.modelo,
          version: v.version,
          anio: v.anio,
          precioLlegada: v.precioLlegada.toNumber(),
          fotoPortada: v.fotos[0]?.url ?? null,
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
