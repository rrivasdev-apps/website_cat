import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const usuario = await prisma.usuarioAdmin.findUnique({
          where: { email: parsed.data.email },
        });
        if (!usuario || !usuario.activo) return null;

        const passwordValida = await bcrypt.compare(
          parsed.data.password,
          usuario.passwordHash,
        );
        if (!passwordValida) return null;

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          rol: usuario.rol,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.rol = (user as { rol: string }).rol;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as { rol?: string }).rol = token.rol as string;
      }
      return session;
    },
  },
});
