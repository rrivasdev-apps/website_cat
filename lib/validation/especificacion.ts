import { z } from "zod";
import { GrupoEspec } from "@/lib/generated/prisma/enums";

export const especificacionSchema = z.object({
  grupo: z.enum(GrupoEspec),
  icono: z
    .union([z.string().trim().min(1), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  etiqueta: z.string().trim().min(1, "La etiqueta es obligatoria"),
  valor: z.string().trim().min(1, "El valor es obligatorio"),
  orden: z.number().int(),
});

export type EspecificacionInput = z.infer<typeof especificacionSchema>;

export const GRUPO_ESPEC_LABELS: Record<GrupoEspec, string> = {
  CARACTERISTICAS: "Características",
  EQUIPAMIENTO: "Equipamiento",
  EXTRAS: "Extras",
};
