import { auth, signOut } from "@/lib/auth";

export default async function AdminHomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <h1 className="text-xl font-semibold mb-2">Panel de administración</h1>
        <p className="text-gray-600 mb-6">
          Sesión iniciada como {session?.user?.email}.
        </p>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
