"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  especificacionSchema,
  type EspecificacionInput,
} from "@/lib/validation/especificacion";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

export async function crearEspecificacion(
  vehiculoId: string,
  input: EspecificacionInput,
) {
  await requireSession();
  const datos = especificacionSchema.parse(input);
  await prisma.especificacion.create({ data: { ...datos, vehiculoId } });
  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

export async function actualizarEspecificacion(
  id: string,
  vehiculoId: string,
  input: EspecificacionInput,
) {
  await requireSession();
  const datos = especificacionSchema.parse(input);
  await prisma.especificacion.update({ where: { id }, data: datos });
  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

export async function eliminarEspecificacion(id: string, vehiculoId: string) {
  await requireSession();
  await prisma.especificacion.delete({ where: { id } });
  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}
