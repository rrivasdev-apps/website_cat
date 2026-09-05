"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  configuracionSchema,
  type ConfiguracionInput,
} from "@/lib/validation/configuracion";

const DEFAULT_MAX_MAS_VENDIDOS = 5;

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

export async function obtenerMaxMasVendidos(): Promise<number> {
  const config = await prisma.configuracionGlobal.findUnique({
    where: { id: 1 },
    select: { maxMasVendidos: true },
  });
  return config?.maxMasVendidos ?? DEFAULT_MAX_MAS_VENDIDOS;
}

export async function guardarConfiguracion(input: ConfiguracionInput) {
  await requireSession();
  const datos = configuracionSchema.parse(input);

  const datosDb = {
    maxMasVendidos: datos.maxMasVendidos,
    sliderIntervaloSegundos: datos.sliderIntervaloSegundos,
    tiempoPreparacionDias: datos.tiempoPreparacionDias,
    tiempoTransitoDias: datos.tiempoTransitoDias,
    tiempoAduanaDias: datos.tiempoAduanaDias,
    tasaBCVVigente: datos.tasaBCVVigente ?? null,
    fechaTasaBCV: datos.fechaTasaBCV ?? null,
    tarifaServicioFija: datos.tarifaServicioFija ?? null,
    informacionImportante: datos.informacionImportante || null,
    whatsappNumero: datos.whatsappNumero || null,
    whatsappMensajePlantilla: datos.whatsappMensajePlantilla || null,
    bannerDestacadosUrl: datos.bannerDestacadosUrl || null,
    footerTextoLegal: datos.footerTextoLegal || null,
  };

  await prisma.configuracionGlobal.upsert({
    where: { id: 1 },
    create: { id: 1, ...datosDb },
    update: datosDb,
  });

  revalidatePath("/admin/configuracion/general");
  revalidatePath("/admin/vehiculos");
  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath("/contacto");
}
