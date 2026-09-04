import { prisma } from "@/lib/prisma";
import { ConfiguracionForm } from "@/components/admin/ConfiguracionForm";

export default async function ConfiguracionPage() {
  const config = await prisma.configuracionGlobal.findUnique({
    where: { id: 1 },
  });

  return (
    <div>
      <h1 className="text-lg font-semibold mb-6">Configuración global</h1>
      <ConfiguracionForm
        configuracion={{
          maxMasVendidos: config?.maxMasVendidos ?? 5,
          tiempoPreparacionDias: config?.tiempoPreparacionDias ?? 15,
          tiempoTransitoDias: config?.tiempoTransitoDias ?? 60,
          tiempoAduanaDias: config?.tiempoAduanaDias ?? 15,
          tasaBCVVigente: config?.tasaBCVVigente?.toNumber(),
          fechaTasaBCV: config?.fechaTasaBCV ?? undefined,
          tarifaServicioFija: config?.tarifaServicioFija?.toNumber(),
          informacionImportante: config?.informacionImportante ?? undefined,
          whatsappNumero: config?.whatsappNumero ?? undefined,
          whatsappMensajePlantilla:
            config?.whatsappMensajePlantilla ?? undefined,
          bannerDestacadosUrl: config?.bannerDestacadosUrl ?? undefined,
          footerTextoLegal: config?.footerTextoLegal ?? undefined,
        }}
      />
    </div>
  );
}
