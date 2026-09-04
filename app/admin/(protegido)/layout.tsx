import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function AdminProtegidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/admin" className="text-gray-900 hover:text-gray-600">
              Panel
            </Link>
            <Link
              href="/admin/vehiculos"
              className="text-gray-900 hover:text-gray-600"
            >
              Vehículos
            </Link>
            <Link
              href="/admin/marcas"
              className="text-gray-900 hover:text-gray-600"
            >
              Marcas
            </Link>
            <Link
              href="/admin/faq"
              className="text-gray-900 hover:text-gray-600"
            >
              FAQ
            </Link>
            <Link
              href="/admin/configuracion"
              className="text-gray-900 hover:text-gray-600"
            >
              Configuración
            </Link>
          </nav>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
