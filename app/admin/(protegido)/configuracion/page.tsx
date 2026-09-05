import Link from "next/link";

const SECCIONES = [
  {
    href: "/admin/configuracion/general",
    titulo: "General",
    descripcion:
      "Tasa BCV, tarifas, tiempos de entrega, WhatsApp e información legal.",
  },
  {
    href: "/admin/vehiculos",
    titulo: "Inicio — hero",
    descripcion:
      "El slider principal de la página de inicio se arma marcando vehículos como \"Destacado\" desde Vehículos.",
  },
  {
    href: "/admin/configuracion/servicios",
    titulo: "Servicios",
    descripcion:
      "Imagen y texto del encabezado, los servicios que se muestran y el bloque del taller.",
  },
  {
    href: "/admin/configuracion/contacto",
    titulo: "Contacto",
    descripcion: "Título y texto del encabezado de la página de contacto.",
  },
];

export default function ConfiguracionPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Configuración</h1>
      <p className="text-sm text-gray-500 mb-6">
        Editable por sección — cada página del sitio tiene su propia
        configuración.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECCIONES.map((seccion) => (
          <Link
            key={seccion.href}
            href={seccion.href}
            className="block bg-white p-5 rounded-lg shadow border border-gray-200 hover:border-gray-400 transition-colors"
          >
            <h2 className="font-semibold text-sm mb-1">{seccion.titulo}</h2>
            <p className="text-sm text-gray-500">{seccion.descripcion}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
