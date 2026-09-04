import Link from "next/link";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";

export async function Footer() {
  const config = await obtenerConfiguracionPublica();

  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl tracking-wide text-ivory">
            CATÁLOGO
          </p>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Importación y venta de vehículos. Cotiza por WhatsApp y recibe el
            detalle completo de costos antes de comprar.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            Navegación
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/#catalogo"
                className="hover:text-accent transition-colors"
              >
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                href="/#preguntas-frecuentes"
                className="hover:text-accent transition-colors"
              >
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            Contacto
          </p>
          {config.whatsappNumero ? (
            <a
              href={`https://wa.me/${config.whatsappNumero}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-accent transition-colors"
            >
              WhatsApp: {config.whatsappNumero}
            </a>
          ) : (
            <p className="text-sm text-muted">Contacto próximamente.</p>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted">
          {config.footerTextoLegal ?? (
            <span>
              © {new Date().getFullYear()} — Todos los derechos reservados.
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
