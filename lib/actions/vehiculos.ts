"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  vehiculoSchema,
  MAX_MAS_VENDIDOS,
  type VehiculoInput,
} from "@/lib/validation/vehiculo";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

async function excedeLimiteMasVendidos(
  esMasVendido: boolean,
  excluirId?: string,
): Promise<boolean> {
  if (!esMasVendido) return false;
  const cantidad = await prisma.vehiculo.count({
    where: {
      esMasVendido: true,
      ...(excluirId ? { id: { not: excluirId } } : {}),
    },
  });
  return cantidad >= MAX_MAS_VENDIDOS;
}

function esErrorSlugDuplicado(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    (error.meta.target as string[]).includes("slug")
  );
}

export async function crearVehiculo(
  input: VehiculoInput,
): Promise<{ id: string } | { error: string }> {
  await requireSession();
  const datos = vehiculoSchema.parse(input);

  if (await excedeLimiteMasVendidos(datos.esMasVendido)) {
    return {
      error: `Ya hay ${MAX_MAS_VENDIDOS} vehículos marcados como "más vendido". Quita alguno antes de agregar otro.`,
    };
  }

  try {
    const vehiculo = await prisma.vehiculo.create({ data: datos });
    revalidatePath("/admin/vehiculos");
    return { id: vehiculo.id };
  } catch (error) {
    if (esErrorSlugDuplicado(error)) {
      return { error: "Ya existe un vehículo con ese slug." };
    }
    throw error;
  }
}

export async function actualizarVehiculo(
  id: string,
  input: VehiculoInput,
): Promise<{ ok: true } | { error: string }> {
  await requireSession();
  const datos = vehiculoSchema.parse(input);

  if (await excedeLimiteMasVendidos(datos.esMasVendido, id)) {
    return {
      error: `Ya hay ${MAX_MAS_VENDIDOS} vehículos marcados como "más vendido". Quita alguno antes de agregar otro.`,
    };
  }

  try {
    await prisma.vehiculo.update({ where: { id }, data: datos });
    revalidatePath("/admin/vehiculos");
    revalidatePath(`/admin/vehiculos/${id}`);
    return { ok: true };
  } catch (error) {
    if (esErrorSlugDuplicado(error)) {
      return { error: "Ya existe un vehículo con ese slug." };
    }
    throw error;
  }
}

export async function eliminarVehiculo(id: string) {
  await requireSession();
  await prisma.vehiculo.delete({ where: { id } });
  revalidatePath("/admin/vehiculos");
}

export async function alternarPublicado(id: string, publicado: boolean) {
  await requireSession();
  await prisma.vehiculo.update({ where: { id }, data: { publicado } });
  revalidatePath("/admin/vehiculos");
}

export async function duplicarVehiculo(id: string): Promise<{ id: string }> {
  await requireSession();
  const original = await prisma.vehiculo.findUniqueOrThrow({ where: { id } });

  const copia = await prisma.vehiculo.create({
    data: {
      slug: `${original.slug}-copia-${Date.now()}`,
      marcaId: original.marcaId,
      modelo: original.modelo,
      version: original.version,
      anio: original.anio,
      tipoAuto: original.tipoAuto,
      condicion: original.condicion,
      origen: original.origen,
      precioEmbarque: original.precioEmbarque,
      precioLlegada: original.precioLlegada,
      tasaBCVUsada: original.tasaBCVUsada,
      fechaPrecio: original.fechaPrecio,
      precioFinalOverride: original.precioFinalOverride,
      disponibilidad: original.disponibilidad,
      descripcion: original.descripcion,
      publicado: false,
      esDestacado: false,
      esMasVendido: false,
    },
  });

  revalidatePath("/admin/vehiculos");
  return { id: copia.id };
}
