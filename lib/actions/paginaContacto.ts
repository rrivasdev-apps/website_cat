"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  paginaContactoSchema,
  type PaginaContactoInput,
} from "@/lib/validation/paginaContacto";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

export async function guardarPaginaContacto(input: PaginaContactoInput) {
  await requireSession();
  const datos = paginaContactoSchema.parse(input);

  const datosDb = {
    titulo: datos.titulo || null,
    subtitulo: datos.subtitulo || null,
  };

  await prisma.paginaContacto.upsert({
    where: { id: 1 },
    create: { id: 1, ...datosDb },
    update: datosDb,
  });

  revalidatePath("/admin/configuracion/contacto");
  revalidatePath("/contacto");
}
