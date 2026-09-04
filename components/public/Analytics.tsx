import Script from "next/script";

/**
 * Slot de analítica preparado pero no activo: no bloquea el proyecto si
 * todavía no se decide un proveedor (ver CLAUDE.md sección 8). Configurar
 * NEXT_PUBLIC_GA_MEASUREMENT_ID para activar Google Analytics 4.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
