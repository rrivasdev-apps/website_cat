-- DropForeignKey
ALTER TABLE "Slide" DROP CONSTRAINT "Slide_vehiculoId_fkey";

-- DropTable
DROP TABLE "Slide";

-- CreateTable
CREATE TABLE "PaginaServicios" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroImagenUrl" TEXT,
    "heroTitulo" TEXT,
    "heroSlogan" TEXT,
    "tallerActivo" BOOLEAN NOT NULL DEFAULT true,
    "tallerTitulo" TEXT,
    "tallerTexto" TEXT,

    CONSTRAINT "PaginaServicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicioItem" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "publicado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServicioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaginaContacto" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "titulo" TEXT,
    "subtitulo" TEXT,

    CONSTRAINT "PaginaContacto_pkey" PRIMARY KEY ("id")
);

