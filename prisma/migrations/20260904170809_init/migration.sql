-- CreateEnum
CREATE TYPE "TipoAuto" AS ENUM ('SUV', 'SEDAN', 'PICKUP', 'HATCHBACK', 'VAN', 'COUPE', 'OTRO');

-- CreateEnum
CREATE TYPE "Condicion" AS ENUM ('NUEVO', 'USADO', 'SUBASTA');

-- CreateEnum
CREATE TYPE "Disponibilidad" AS ENUM ('EN_ORIGEN', 'EN_TRANSITO', 'DISPONIBLE_VENEZUELA');

-- CreateEnum
CREATE TYPE "GrupoEspec" AS ENUM ('CARACTERISTICAS', 'EQUIPAMIENTO', 'EXTRAS');

-- CreateEnum
CREATE TYPE "RolAdmin" AS ENUM ('ADMIN', 'EDITOR');

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "tipoAuto" "TipoAuto" NOT NULL,
    "condicion" "Condicion" NOT NULL,
    "origen" TEXT NOT NULL,
    "precioEmbarque" DECIMAL(12,2) NOT NULL,
    "precioLlegada" DECIMAL(12,2) NOT NULL,
    "tasaBCVUsada" DECIMAL(12,4) NOT NULL,
    "fechaPrecio" TIMESTAMP(3) NOT NULL,
    "precioFinalOverride" DECIMAL(12,2),
    "disponibilidad" "Disponibilidad" NOT NULL DEFAULT 'EN_TRANSITO',
    "descripcion" TEXT NOT NULL,
    "tiemposEntregaOverride" JSONB,
    "informacionImportanteOverride" TEXT,
    "esDestacado" BOOLEAN NOT NULL DEFAULT false,
    "ordenDestacado" INTEGER,
    "esMasVendido" BOOLEAN NOT NULL DEFAULT false,
    "ordenMasVendido" INTEGER,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especificacion" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "grupo" "GrupoEspec" NOT NULL,
    "icono" TEXT,
    "etiqueta" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Especificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "esPortada" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "publicado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionGlobal" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "tasaBCVVigente" DECIMAL(12,4) NOT NULL,
    "fechaTasaBCV" TIMESTAMP(3) NOT NULL,
    "tarifaServicioFija" DECIMAL(12,2) NOT NULL,
    "tiempoPreparacionDias" INTEGER NOT NULL DEFAULT 15,
    "tiempoTransitoDias" INTEGER NOT NULL DEFAULT 60,
    "tiempoAduanaDias" INTEGER NOT NULL DEFAULT 15,
    "informacionImportante" TEXT NOT NULL,
    "whatsappNumero" TEXT NOT NULL,
    "whatsappMensajePlantilla" TEXT NOT NULL,
    "bannerDestacadosUrl" TEXT,
    "footerTextoLegal" TEXT,

    CONSTRAINT "ConfiguracionGlobal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioAdmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "RolAdmin" NOT NULL DEFAULT 'ADMIN',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_slug_key" ON "Vehiculo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nombre_key" ON "Marca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioAdmin_email_key" ON "UsuarioAdmin"("email");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Especificacion" ADD CONSTRAINT "Especificacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
