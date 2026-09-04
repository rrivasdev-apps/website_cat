import Link from "next/link";
import { obtenerConfiguracionPublica } from "@/lib/data/configuracion";

export async function CtaStrip() {
  const config = await obtenerConfiguracionPublica();
  const whatsappHref = config.whatsappNumero
    ? `https://wa.me/${config.whatsappNumero}`
    : null;

  return (
    <section className="bg-accent text-ink">
      <div className="mx-auto max-w-[1600px] px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-display text-2xl sm:text-3xl tracking-wide text-center sm:text-left">
          ¿LISTO PARA ENCONTRAR TU PRÓXIMO VEHÍCULO?
        </p>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/#catalogo"
            className="bg-ink text-ivory px-6 py-3 text-sm font-semibold uppercase tracking-wide rounded hover:bg-panel-raised transition-colors"
          >
            Ver catálogo
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink/10 border border-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide rounded hover:bg-ink hover:text-ivory transition-colors"
            >
              Contáctanos
            </a>
          ) : (
            <span className="border border-ink/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide rounded text-ink/50">
              Contáctanos
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
