"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export function SubidaImagen({
  multiple = false,
  carpeta,
  etiqueta = "Subir imagen",
  onSubido,
  className,
}: {
  multiple?: boolean;
  carpeta?: string;
  etiqueta?: string;
  onSubido: (urls: string[]) => void;
  className?: string;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError(null);
    setSubiendo(true);

    try {
      const subidas = await Promise.all(
        files.map((file) =>
          upload(carpeta ? `${carpeta}/${file.name}` : file.name, file, {
            access: "public",
            handleUploadUrl: "/api/uploads",
          }),
        ),
      );
      onSubido(subidas.map((s) => s.url));
    } catch {
      setError("No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  return (
    <div className={className}>
      <label className="inline-block cursor-pointer text-sm bg-gray-900 text-white rounded px-4 py-2 hover:bg-gray-800">
        {subiendo ? "Subiendo..." : etiqueta}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          disabled={subiendo}
          className="hidden"
        />
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
