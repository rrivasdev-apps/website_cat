import { prisma } from "@/lib/prisma";
import { FaqItem } from "@/components/admin/FaqItem";
import { NuevaFaqForm } from "@/components/admin/NuevaFaqForm";

export default async function FaqAdminPage() {
  const preguntas = await prisma.faq.findMany({ orderBy: { orden: "asc" } });
  const siguienteOrden =
    preguntas.length > 0
      ? Math.max(...preguntas.map((p) => p.orden)) + 1
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Preguntas frecuentes</h1>

      <NuevaFaqForm ordenSugerido={siguienteOrden} />

      <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-100">
        {preguntas.map((faq) => (
          <FaqItem key={faq.id} faq={faq} />
        ))}
        {preguntas.length === 0 && (
          <p className="p-6 text-center text-gray-400 text-sm">
            Todavía no hay preguntas frecuentes.
          </p>
        )}
      </div>
    </div>
  );
}
