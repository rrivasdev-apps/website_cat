import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Condicion, TipoAuto } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";

const LIMITE_PAGINA = 12;

function esCondicion(valor: string | null): valor is Condicion {
  return !!valor && (Object.values(Condicion) as string[]).includes(valor);
}

function esTipoAuto(valor: string | null): valor is TipoAuto {
  return !!valor && (Object.values(TipoAuto) as string[]).includes(valor);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const origen = searchParams.get("origen");
  const condicionParam = searchParams.get("condicion");
  const tipoParam = searchParams.get("tipo");
  const marcaId = searchParams.get("marca");
  const orden = searchParams.get("orden") ?? "reciente";
  const cursor = searchParams.get("cursor");

  const where: Prisma.VehiculoWhereInput = {
    publicado: true,
    ...(origen ? { origen } : {}),
    ...(esCondicion(condicionParam) ? { condicion: condicionParam } : {}),
    ...(esTipoAuto(tipoParam) ? { tipoAuto: tipoParam } : {}),
    ...(marcaId ? { marcaId } : {}),
  };

  const orderBy: Prisma.VehiculoOrderByWithRelationInput =
    orden === "precio_asc"
      ? { precioLlegada: "asc" }
      : orden === "precio_desc"
        ? { precioLlegada: "desc" }
        : { createdAt: "desc" };

  const vehiculos = await prisma.vehiculo.findMany({
    where,
    orderBy,
    take: LIMITE_PAGINA + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      marca: true,
      fotos: { where: { esPortada: true }, take: 1 },
    },
  });

  const hayMas = vehiculos.length > LIMITE_PAGINA;
  const pagina = hayMas ? vehiculos.slice(0, LIMITE_PAGINA) : vehiculos;

  return NextResponse.json({
    vehiculos: pagina.map((v) => ({
      id: v.id,
      slug: v.slug,
      marca: v.marca.nombre,
      marcaLogoUrl: v.marca.logoUrl,
      modelo: v.modelo,
      version: v.version,
      anio: v.anio,
      tipoAuto: v.tipoAuto,
      condicion: v.condicion,
      disponibilidad: v.disponibilidad,
      precioLlegada: v.precioLlegada.toNumber(),
      precioFinalOverride: v.precioFinalOverride?.toNumber() ?? null,
      fotoPortada: v.fotos[0]?.url ?? null,
      fotoTarjetaUrl: v.fotoTarjetaUrl,
    })),
    nextCursor: hayMas ? pagina[pagina.length - 1]?.id : null,
  });
}
