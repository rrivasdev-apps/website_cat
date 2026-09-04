"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

export async function agregarFotos(vehiculoId: string, urls: string[]) {
  await requireSession();

  const existentes = await prisma.foto.findMany({
    where: { vehiculoId },
    orderBy: { orden: "desc" },
    take: 1,
  });
  const hayPortada = await prisma.foto.findFirst({
    where: { vehiculoId, esPortada: true },
  });

  const siguienteOrden = (existentes[0]?.orden ?? -1) + 1;

  await prisma.foto.createMany({
    data: urls.map((url, i) => ({
      vehiculoId,
      url,
      orden: siguienteOrden + i,
      esPortada: !hayPortada && i === 0,
    })),
  });

  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

export async function marcarPortada(id: string, vehiculoId: string) {
  await requireSession();

  await prisma.$transaction([
    prisma.foto.updateMany({
      where: { vehiculoId },
      data: { esPortada: false },
    }),
    prisma.foto.update({ where: { id }, data: { esPortada: true } }),
  ]);

  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

export async function actualizarOrdenFoto(
  id: string,
  vehiculoId: string,
  orden: number,
) {
  await requireSession();
  await prisma.foto.update({ where: { id }, data: { orden } });
  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

export async function eliminarFoto(id: string, vehiculoId: string) {
  await requireSession();

  const foto = await prisma.foto.findUniqueOrThrow({ where: { id } });
  await prisma.foto.delete({ where: { id } });

  try {
    await del(foto.url);
  } catch {
    // El blob puede haber sido eliminado ya; no bloquea el borrado del registro.
  }

  if (foto.esPortada) {
    const siguiente = await prisma.foto.findFirst({
      where: { vehiculoId },
      orderBy: { orden: "asc" },
    });
    if (siguiente) {
      await prisma.foto.update({
        where: { id: siguiente.id },
        data: { esPortada: true },
      });
    }
  }

  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}
