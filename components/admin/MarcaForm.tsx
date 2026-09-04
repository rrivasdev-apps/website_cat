"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearMarca } from "@/lib/actions/marcas";

export function MarcaForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await crearMarca({ nombre, logoUrl });
      setNombre("");
      setLogoUrl("");
      router.refresh();
    } catch {
      setError("No se pudo crear la marca. ¿El nombre ya existe?");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Logo (URL, opcional)
        </label>
        <input
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm w-64"
        />
      </div>
      <button
        type="submit"
        disabled={enviando}
        className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {enviando ? "Agregando..." : "Agregar marca"}
      </button>
      {error && <p className="text-sm text-red-600 w-full">{error}</p>}
    </form>
  );
}
