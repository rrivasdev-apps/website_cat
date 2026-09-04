import { prisma } from "@/lib/prisma";

export async function obtenerConfiguracionPublica() {
  const config = await prisma.configuracionGlobal.findUnique({
    where: { id: 1 },
  });

  return {
    maxMasVendidos: config?.maxMasVendidos ?? 5,
    informacionImportante: config?.informacionImportante ?? null,
    whatsappNumero: config?.whatsappNumero ?? null,
    whatsappMensajePlantilla: config?.whatsappMensajePlantilla ?? null,
    bannerDestacadosUrl: config?.bannerDestacadosUrl ?? null,
    footerTextoLegal: config?.footerTextoLegal ?? null,
    tiempoPreparacionDias: config?.tiempoPreparacionDias ?? 15,
    tiempoTransitoDias: config?.tiempoTransitoDias ?? 60,
    tiempoAduanaDias: config?.tiempoAduanaDias ?? 15,
  };
}
