"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function BotonEliminar({
  confirmacion,
  accion,
  className,
  children,
}: {
  confirmacion: string;
  accion: () => Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!window.confirm(confirmacion)) return;
    setError(null);
    startTransition(async () => {
      try {
        await accion();
        router.refresh();
      } catch {
        setError("No se pudo eliminar.");
      }
    });
  };

  return (
    <span>
      <button
        type="button"
        onClick={handleClick}
        disabled={pendiente}
        className={className}
      >
        {pendiente ? "..." : children}
      </button>
      {error && <span className="text-red-600 text-xs ml-2">{error}</span>}
    </span>
  );
}
