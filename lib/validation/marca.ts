import { z } from "zod";

export const marcaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  logoUrl: z
    .union([z.string().trim().url("URL inválida"), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
});

export type MarcaInput = z.infer<typeof marcaSchema>;
