-- AlterTable
ALTER TABLE "ConfiguracionGlobal" ADD COLUMN     "maxMasVendidos" INTEGER NOT NULL DEFAULT 5,
ALTER COLUMN "tasaBCVVigente" DROP NOT NULL,
ALTER COLUMN "fechaTasaBCV" DROP NOT NULL,
ALTER COLUMN "tarifaServicioFija" DROP NOT NULL,
ALTER COLUMN "informacionImportante" DROP NOT NULL,
ALTER COLUMN "whatsappNumero" DROP NOT NULL,
ALTER COLUMN "whatsappMensajePlantilla" DROP NOT NULL;
