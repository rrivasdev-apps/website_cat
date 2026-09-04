import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function AdminHomePage() {
  const session = await auth();

  return (
    <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
      <h1 className="text-xl font-semibold mb-2">Panel de administración</h1>
      <p className="text-gray-600 mb-6">
        Sesión iniciada como {session?.user?.email}.
      </p>

      <div className="flex gap-3">
        <Link
          href="/admin/vehiculos"
          className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          Ver vehículos
        </Link>
        <Link
          href="/admin/marcas"
          className="bg-white text-gray-900 border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Ver marcas
        </Link>
      </div>
    </div>
  );
}
