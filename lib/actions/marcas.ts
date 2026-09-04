"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { marcaSchema, type MarcaInput } from "@/lib/validation/marca";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

export async function crearMarca(input: MarcaInput) {
  await requireSession();
  const datos = marcaSchema.parse(input);
  await prisma.marca.create({ data: datos });
  revalidatePath("/admin/marcas");
  revalidatePath("/admin/vehiculos/nuevo");
}

export async function eliminarMarca(id: string) {
  await requireSession();
  await prisma.marca.delete({ where: { id } });
  revalidatePath("/admin/marcas");
}
