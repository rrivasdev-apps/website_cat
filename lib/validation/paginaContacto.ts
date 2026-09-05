import { z } from "zod";

export const paginaContactoSchema = z.object({
  titulo: z.string().trim().optional(),
  subtitulo: z.string().trim().optional(),
});

export type PaginaContactoInput = z.infer<typeof paginaContactoSchema>;
