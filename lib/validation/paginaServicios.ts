import { z } from "zod";

export const paginaServiciosSchema = z.object({
  heroImagenUrl: z.string().trim().optional(),
  heroTitulo: z.string().trim().optional(),
  heroSlogan: z.string().trim().optional(),
  tallerActivo: z.boolean(),
  tallerTitulo: z.string().trim().optional(),
  tallerTexto: z.string().trim().optional(),
});

export type PaginaServiciosInput = z.infer<typeof paginaServiciosSchema>;

export const servicioItemSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio"),
  texto: z.string().trim().min(1, "El texto es obligatorio"),
  imagenUrl: z.string().trim().optional(),
  orden: z.number().int(),
  publicado: z.boolean(),
});

export type ServicioItemInput = z.infer<typeof servicioItemSchema>;
