"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  paginaServiciosSchema,
  servicioItemSchema,
  type PaginaServiciosInput,
  type ServicioItemInput,
} from "@/lib/validation/paginaServicios";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

function revalidarServicios() {
  revalidatePath("/admin/configuracion/servicios");
  revalidatePath("/servicios");
}

export async function guardarPaginaServicios(input: PaginaServiciosInput) {
  await requireSession();
  const datos = paginaServiciosSchema.parse(input);

  const datosDb = {
    heroImagenUrl: datos.heroImagenUrl || null,
    heroTitulo: datos.heroTitulo || null,
    heroSlogan: datos.heroSlogan || null,
    tallerActivo: datos.tallerActivo,
    tallerTitulo: datos.tallerTitulo || null,
    tallerTexto: datos.tallerTexto || null,
  };

  await prisma.paginaServicios.upsert({
    where: { id: 1 },
    create: { id: 1, ...datosDb },
    update: datosDb,
  });

  revalidarServicios();
}

export async function crearServicioItem(input: ServicioItemInput) {
  await requireSession();
  const datos = servicioItemSchema.parse(input);
  await prisma.servicioItem.create({
    data: { ...datos, imagenUrl: datos.imagenUrl || null },
  });
  revalidarServicios();
}

export async function actualizarServicioItem(
  id: string,
  input: ServicioItemInput,
) {
  await requireSession();
  const datos = servicioItemSchema.parse(input);
  await prisma.servicioItem.update({
    where: { id },
    data: { ...datos, imagenUrl: datos.imagenUrl || null },
  });
  revalidarServicios();
}

export async function eliminarServicioItem(id: string) {
  await requireSession();
  await prisma.servicioItem.delete({ where: { id } });
  revalidarServicios();
}
