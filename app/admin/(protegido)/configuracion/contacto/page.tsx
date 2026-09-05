import Link from "next/link";
import { obtenerPaginaContacto } from "@/lib/data/paginas";
import { PaginaContactoForm } from "@/components/admin/PaginaContactoForm";

export default async function ConfiguracionContactoPage() {
  const pagina = await obtenerPaginaContacto();

  return (
    <div>
      <Link
        href="/admin/configuracion"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Configuración
      </Link>
      <h1 className="text-lg font-semibold mt-2 mb-6">Página de Contacto</h1>
      <PaginaContactoForm pagina={pagina} />
    </div>
  );
}
