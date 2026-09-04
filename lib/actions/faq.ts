"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { faqSchema, type FaqInput } from "@/lib/validation/faq";

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
}

function revalidarFaq() {
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function crearFaq(input: FaqInput) {
  await requireSession();
  const datos = faqSchema.parse(input);
  await prisma.faq.create({ data: datos });
  revalidarFaq();
}

export async function actualizarFaq(id: string, input: FaqInput) {
  await requireSession();
  const datos = faqSchema.parse(input);
  await prisma.faq.update({ where: { id }, data: datos });
  revalidarFaq();
}

export async function eliminarFaq(id: string) {
  await requireSession();
  await prisma.faq.delete({ where: { id } });
  revalidarFaq();
}
