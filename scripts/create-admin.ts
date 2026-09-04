import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const [email, password, nombre] = process.argv.slice(2);

  if (!email || !password || !nombre) {
    console.error(
      'Uso: npm run create-admin -- "correo@ejemplo.com" "contraseña" "Nombre Apellido"',
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const usuario = await prisma.usuarioAdmin.upsert({
    where: { email },
    update: { passwordHash, nombre },
    create: { email, passwordHash, nombre },
  });

  console.log(`Usuario admin listo: ${usuario.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
