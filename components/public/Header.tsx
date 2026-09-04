"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ENLACES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/servicios", etiqueta: "Servicios" },
  { href: "/contacto", etiqueta: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const claseBoton = (activo: boolean) =>
    `px-4 py-2 rounded text-sm font-semibold uppercase tracking-wide transition-colors ${
      activo
        ? "bg-accent text-ink"
        : "bg-transparent text-ivory hover:bg-ivory/10"
    }`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-transparent">
      <div className="mx-auto max-w-[1600px] px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setMenuAbierto(false)}
          className="font-display text-xl tracking-wide text-ivory"
        >
          CATÁLOGO
        </Link>

        <nav className="hidden sm:flex items-center gap-2">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={claseBoton(pathname === enlace.href)}
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden text-ivory p-2 -mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            {menuAbierto ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {menuAbierto && (
        <nav className="sm:hidden bg-ink/95 border-t border-line px-6 py-4 flex flex-col gap-2">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              onClick={() => setMenuAbierto(false)}
              className={claseBoton(pathname === enlace.href)}
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
