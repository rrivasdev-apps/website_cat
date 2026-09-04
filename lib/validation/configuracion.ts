import { z } from "zod";

export const configuracionSchema = z.object({
  maxMasVendidos: z.number().int().min(1).max(20),
  tiempoPreparacionDias: z.number().int().nonnegative(),
  tiempoTransitoDias: z.number().int().nonnegative(),
  tiempoAduanaDias: z.number().int().nonnegative(),
  tasaBCVVigente: z.number().positive().optional(),
  fechaTasaBCV: z.date().optional(),
  tarifaServicioFija: z.number().nonnegative().optional(),
  informacionImportante: z.string().trim().optional(),
  whatsappNumero: z.string().trim().optional(),
  whatsappMensajePlantilla: z.string().trim().optional(),
  bannerDestacadosUrl: z.string().trim().optional(),
  footerTextoLegal: z.string().trim().optional(),
});

export type ConfiguracionInput = z.infer<typeof configuracionSchema>;
