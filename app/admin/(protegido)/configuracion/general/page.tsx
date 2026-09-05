import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfiguracionForm } from "@/components/admin/ConfiguracionForm";

export default async function ConfiguracionGeneralPage() {
  const config = await prisma.configuracionGlobal.findUnique({
    where: { id: 1 },
  });

  return (
    <div>
      <Link
        href="/admin/configuracion"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Configuración
      </Link>
      <h1 className="text-lg font-semibold mt-2 mb-6">
        Configuración general
      </h1>
      <ConfiguracionForm
        configuracion={{
          maxMasVendidos: config?.maxMasVendidos ?? 5,
          sliderIntervaloSegundos: config?.sliderIntervaloSegundos ?? 6,
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
