import { z } from "zod";

export const faqSchema = z.object({
  pregunta: z.string().trim().min(1, "La pregunta es obligatoria"),
  respuesta: z.string().trim().min(1, "La respuesta es obligatoria"),
  orden: z.number().int(),
  publicado: z.boolean(),
});

export type FaqInput = z.infer<typeof faqSchema>;
