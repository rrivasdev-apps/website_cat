import { z } from "zod";
import { TipoAuto, Condicion, Disponibilidad } from "@/lib/generated/prisma/enums";

const anioActual = new Date().getFullYear();

export const vehiculoSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  marcaId: z.string().trim().min(1, "Selecciona una marca"),
  modelo: z.string().trim().min(1, "El modelo es obligatorio"),
  version: z.string().trim().min(1, "La versión es obligatoria"),
  anio: z
    .number()
    .int()
    .min(1990, "Año inválido")
    .max(anioActual + 1, "Año inválido"),
  tipoAuto: z.enum(TipoAuto),
  condicion: z.enum(Condicion),
  origen: z.string().trim().min(1, "El origen es obligatorio"),
  precioEmbarque: z.number().nonnegative("Debe ser un número positivo"),
  precioLlegada: z.number().nonnegative("Debe ser un número positivo"),
  tasaBCVUsada: z.number().positive("Debe ser un número positivo"),
  fechaPrecio: z.date(),
  precioFinalOverride: z.number().nonnegative().optional(),
  disponibilidad: z.enum(Disponibilidad),
  descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
  publicado: z.boolean(),
  esDestacado: z.boolean(),
  ordenDestacado: z.number().int().optional(),
  esMasVendido: z.boolean(),
  ordenMasVendido: z.number().int().optional(),
});

export type VehiculoInput = z.infer<typeof vehiculoSchema>;

export const TIPO_AUTO_LABELS: Record<TipoAuto, string> = {
  SUV: "SUV",
  SEDAN: "Sedán",
  PICKUP: "Pickup",
  HATCHBACK: "Hatchback",
  VAN: "Van",
  COUPE: "Coupé",
  OTRO: "Otro",
};

export const CONDICION_LABELS: Record<Condicion, string> = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  SUBASTA: "Subasta",
};

export const DISPONIBILIDAD_LABELS: Record<Disponibilidad, string> = {
  EN_ORIGEN: "En origen",
  EN_TRANSITO: "En tránsito",
  DISPONIBLE_VENEZUELA: "Disponible en Venezuela",
};
