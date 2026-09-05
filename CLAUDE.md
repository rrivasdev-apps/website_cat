# Especificación de proyecto — Catálogo de vehículos con panel de administración

> Este documento es el punto de partida para construir el proyecto con Claude Code.
> Describe el alcance, el stack, el modelo de datos y la estructura de páginas.
> Las decisiones marcadas como **PENDIENTE DE CONFIRMAR** deben resolverse con el
> cliente (Rafael) antes de programarlas — no inventar el valor.

## 1. Qué se está construyendo

Un sitio de catálogo de vehículos (import/venta) con:

- Un **home público** de 5 secciones: slider principal, catálogo filtrable y paginado,
  destacados/más vendidos, preguntas frecuentes, footer.
- Una **página de detalle** por vehículo, con 10 bloques (imagen, características,
  galería, descripción, equipamiento, compra/costos, precio final + WhatsApp,
  información importante, franja CTA, footer).
- Un **panel de administración** privado (usuario + contraseña) desde donde se carga
  todo el contenido: vehículos, fotos, precios, FAQ, configuración global.

Nada del contenido del sitio va hardcodeado — todo lo que hoy sería "texto en el
código" (marcas, autos, preguntas frecuentes, tasa de cambio, textos legales) sale de
la base de datos y se edita desde el panel.

El nombre de marca es **Avan Motors** (confirmado) y ya cuenta con logo oficial
(`public/logo-avan-transparent.png`), en uso en header y footer del sitio. Dominio y
paleta definitiva del proyecto siguen **PENDIENTE DE CONFIRMAR** — no reutilizar
imágenes de ningún sitio usado como referencia visual durante el diseño de este
documento.

### Mercado objetivo y tono del contenido

Este sitio es **para Venezuela** (inicialmente — si el negocio se expande a otros
países más adelante, esto se puede reconsiderar, pero no anticiparlo). Todo el texto
del sitio (UI, botones, FAQ, descripciones de vehículos, mensajes de WhatsApp,
mensajes de error, textos del panel de administración) debe sonar natural para un
venezolano. En concreto:

- **Tratamiento de "tú", nunca "vos".** Nada de voseo rioplatense/centroamericano:
  ni conjugaciones ("tenés", "sos", "vení", "mirá", "escribinos") ni el pronombre
  "vos". La forma correcta es la de "tú" ("tienes", "eres", "ven", "mira",
  "escríbenos").
- **Nunca "vosotros".** Es de España, no se usa en Venezuela ni en el resto de
  Latinoamérica — usar "ustedes".
- **Sin modismos marcados de otro país.** Evitar jerga reconociblemente de otro
  lado — ejemplos a NO usar: "che", "boludo", "pibe", "laburo", "quilombo"
  (Argentina/Uruguay); "órale", "güey", "chido", "padrísimo" (México); "vale", "tío",
  "flipar", "curro" (España); "parcero", "parce" (Colombia). Si al escribir un texto
  hay duda sobre si una palabra es un modismo regional marcado, elegir la
  alternativa más neutra/estándar en español.
- **Vocabulario:** "vehículo" es el término principal del catálogo (neutro, ya en uso
  en todo el sitio) — "carro" es válido y muy venezolano si hace falta variar, pero
  evitar "coche" (España) y "auto" (más de cono sur) como palabra por defecto.
- Ya son coherentes con Venezuela y **hay que mantenerlos**: precios en USD, tasa
  BCV (Banco Central de Venezuela) como referencia cambiaria, y WhatsApp como canal
  de contacto principal — no reemplazar por convenciones de otro país.

Antes de dar por bueno un texto nuevo (o revisado) para el sitio, releerlo pensando
"¿esto es lo que diría alguien en Caracas, Valencia o Maracaibo?" — si suena a otro
país, ajustarlo.

## 2. Stack técnico

| Capa | Elección | Motivo |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | una sola base de código para el sitio público y el panel admin (Route Handlers / Server Actions) |
| Estilos | **Tailwind CSS** | velocidad de armado de UI consistente |
| Base de datos | **PostgreSQL** administrado (Neon o Supabase) | relacional, encaja con el modelo de vehículo + specs |
| ORM | **Prisma** | migraciones tipadas, buen soporte con TypeScript |
| Autenticación admin | **NextAuth.js (Credentials Provider)** | sesión en cookie httpOnly, sin infraestructura extra |
| Validación | **Zod** | validar formularios del admin y payloads de Server Actions |
| Formularios admin | **React Hook Form + Zod resolver** | |
| Imágenes | **Vercel Blob** (o Cloudinary si se prefiere transformación de imágenes en el borde) | sin disco local — el hosting no garantiza persistencia de archivos |
| Reordenar galería/sliders | **dnd-kit** | drag-and-drop en el panel |
| Hosting | **Vercel** | despliegue sin servidor que mantener |

Alternativa evaluada y descartada por el cliente: WordPress + CPT a medida (más
mantenimiento, menos control sobre catálogo filtrable e interactivo).

## 3. Estructura de carpetas sugerida

```
/app
  /(public)
    /page.tsx                 -> home (5 secciones)
    /catalogo/page.tsx        -> catálogo standalone con filtros (si se separa del home)
    /catalogo/[slug]/page.tsx -> ficha de detalle del vehículo
  /admin
    /login/page.tsx
    /(protegido)/vehiculos/...
    /(protegido)/marcas/...
    /(protegido)/faq/...
    /(protegido)/configuracion/page.tsx
  /api
    /vehiculos/route.ts        -> GET catálogo con filtros + paginación (uso público)
    /uploads/route.ts          -> subida de imágenes (uso admin)
/components
  /public   (Hero, CatalogoGrid, FiltrosCatalogo, DestacadosSlider, Faq, Footer, FichaVehiculo/*)
  /admin    (VehiculoForm, GaleriaUploader, TablaVehiculos, ...)
/lib
  /prisma.ts
  /auth.ts
  /precio.ts     -> lógica de cálculo de precio final
/prisma
  /schema.prisma
```

## 4. Modelo de datos (Prisma)

```prisma
model Vehiculo {
  id                     String    @id @default(cuid())
  slug                   String    @unique
  marcaId                String
  marca                  Marca     @relation(fields: [marcaId], references: [id])
  modelo                 String
  version                String
  anio                   Int
  tipoAuto               TipoAuto
  condicion              Condicion
  origen                 String
  precioEmbarque         Decimal   @db.Decimal(12, 2)
  precioLlegada          Decimal   @db.Decimal(12, 2)
  tasaBCVUsada           Decimal   @db.Decimal(12, 4)
  fechaPrecio            DateTime
  precioFinalOverride    Decimal?  @db.Decimal(12, 2)
  disponibilidad         Disponibilidad @default(EN_TRANSITO)
  descripcion            String    @db.Text
  tiemposEntregaOverride Json?
  informacionImportanteOverride String? @db.Text
  esDestacado            Boolean   @default(false)
  ordenDestacado         Int?
  esMasVendido           Boolean   @default(false)
  ordenMasVendido        Int?
  publicado              Boolean   @default(false)
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  especificaciones Especificacion[]
  fotos            Foto[]
  slides           Slide[]
}

enum TipoAuto { SUV SEDAN PICKUP HATCHBACK VAN COUPE OTRO }
enum Condicion { NUEVO USADO SUBASTA }
enum Disponibilidad { EN_ORIGEN EN_TRANSITO DISPONIBLE_VENEZUELA }

model Especificacion {
  id         String     @id @default(cuid())
  vehiculoId String
  vehiculo   Vehiculo   @relation(fields: [vehiculoId], references: [id], onDelete: Cascade)
  grupo      GrupoEspec
  icono      String?
  etiqueta   String
  valor      String
  orden      Int        @default(0)
}
enum GrupoEspec { CARACTERISTICAS EQUIPAMIENTO EXTRAS }

model Foto {
  id         String   @id @default(cuid())
  vehiculoId String
  vehiculo   Vehiculo @relation(fields: [vehiculoId], references: [id], onDelete: Cascade)
  url        String
  esPortada  Boolean  @default(false)
  orden      Int      @default(0)
}

model Marca {
  id        String     @id @default(cuid())
  nombre    String     @unique
  logoUrl   String?
  vehiculos Vehiculo[]
}

model Faq {
  id        String  @id @default(cuid())
  pregunta  String
  respuesta String  @db.Text
  orden     Int     @default(0)
  publicado Boolean @default(true)
}

model Slide {
  id         String   @id @default(cuid())
  vehiculoId String
  vehiculo   Vehiculo @relation(fields: [vehiculoId], references: [id], onDelete: Cascade)
  orden      Int      @default(0)
  activo     Boolean  @default(true)
}

model ConfiguracionGlobal {
  id                       Int       @id @default(1)
  maxMasVendidos           Int       @default(5)
  tasaBCVVigente           Decimal?  @db.Decimal(12, 4)
  fechaTasaBCV             DateTime?
  tarifaServicioFija       Decimal?  @db.Decimal(12, 2)
  tiempoPreparacionDias    Int       @default(15)
  tiempoTransitoDias       Int       @default(60)
  tiempoAduanaDias         Int       @default(15)
  informacionImportante    String?   @db.Text
  whatsappNumero           String?
  whatsappMensajePlantilla String?   @db.Text
  bannerDestacadosUrl      String?
  footerTextoLegal         String?   @db.Text
}

model UsuarioAdmin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  nombre       String
  rol          RolAdmin @default(ADMIN)
  activo       Boolean  @default(true)
  createdAt    DateTime @default(now())
}
enum RolAdmin { ADMIN EDITOR }
```

Notas de diseño del modelo:

- `Especificacion` es intencionalmente clave/valor (no columnas fijas) para poder
  agregar un campo nuevo a la ficha técnica sin migrar el esquema.
- `tiemposEntregaOverride` e `informacionImportanteOverride` permiten que un vehículo
  puntual difiera del valor global sin duplicar la tabla de configuración.
- `precioFinalOverride` existe por si el negocio necesita fijar un precio manual que
  no siga la fórmula automática (ver sección 6).
- `ConfiguracionGlobal.maxMasVendidos` es editable desde `/admin/configuracion`
  (default 5) — reemplaza lo que antes era una constante hardcodeada, para que el
  negocio pueda ajustarlo sin tocar código.
- Los campos de `ConfiguracionGlobal` ligados a decisiones aún pendientes del
  negocio (tasa BCV, tarifa fija, información importante, WhatsApp — ver
  sección 11) son opcionales (`?`) en vez de obligatorios: el panel ya existe y se
  puede publicar el sitio sin que esos valores estén definidos todavía.

## 5. Home — 5 secciones (en orden)

1. **Slider principal** — lee de `Slide[]` (ordenado, solo `activo = true`); cada
   slide referencia un `Vehiculo` existente, no duplica sus datos.
2. **Catálogo** — grid de tarjetas desde `Vehiculo` (`publicado = true`). Filtros:
   origen, condición (nuevo/usado/subasta), tipo de auto, marca, y un selector de
   orden (precio asc/desc, más reciente). Paginación tipo "Mostrar Más"
   (incremental por offset o cursor), no números de página. Implementar como
   Route Handler `GET /api/vehiculos?origen=&condicion=&tipo=&marca=&orden=&cursor=`.
3. **Destacados / Más vendidos** — imagen fija a la izquierda desde
   `ConfiguracionGlobal.bannerDestacadosUrl`; slider horizontal a la derecha con los
   vehículos `esMasVendido = true` ordenados por `ordenMasVendido` (limitar a un
   máximo razonable, ej. 5-8, validado en el formulario del admin).
4. **Preguntas frecuentes** — `Faq[]` ordenado, solo `publicado = true`.
5. **Footer** — datos de `ConfiguracionGlobal` (texto legal, contacto) + enlaces de
   navegación fijos.

La franja CTA amarilla ("Ver Catálogo" / "Contáctanos") es un componente
reutilizable, no contenido de base de datos — solo el número/enlace de WhatsApp sale
de `ConfiguracionGlobal.whatsappNumero`.

## 6. Página de detalle (`/catalogo/[slug]`)

Bloques en orden, todos alimentados por el mismo `Vehiculo`:

1. Imagen principal (la `Foto` con `esPortada = true`) con nombre, marca y precio superpuestos.
2. **Características** (acordeón/retraíble) — `Especificacion` donde `grupo = CARACTERISTICAS`.
3. Galería de fotos — `Foto[]` ordenada por `orden`, slider horizontal + lightbox al click.
4. Descripción — `Vehiculo.descripcion` (texto enriquecido).
5. Equipamiento — `Especificacion` donde `grupo` es `EQUIPAMIENTO` o `EXTRAS`.
6. **Compra** (acordeón/retraíble) — desglose de costos (`precioEmbarque`,
   `precioLlegada`, impuestos calculados — ver fórmula abajo) + tarjeta de
   Tiempos de Entrega (`tiemposEntregaOverride` si existe, si no los valores de
   `ConfiguracionGlobal`).
7. Precio Final Aproximado — precio calculado (ver fórmula abajo) o
   `precioFinalOverride` si está definido; indicador de `disponibilidad`; botón
   **Comprar** que abre `https://wa.me/<whatsappNumero>?text=<mensaje>` con el
   mensaje armado desde `whatsappMensajePlantilla` (placeholders `{modelo}`, `{anio}`,
   `{precio}`).
8. Información Importante — `informacionImportanteOverride` del vehículo o, si no
   existe, `ConfiguracionGlobal.informacionImportante`.
9. Franja CTA (mismo componente reutilizable del home).
10. Footer (mismo componente del home).

### ⚠️ Fórmula de precio final — PENDIENTE DE CONFIRMAR

En las capturas de referencia usadas para diseñar este documento, los tres montos
mostrados (embarque + llegada + impuestos) **no suman exactamente** el "Precio Final
Aproximado" que se mostraba en pantalla. Antes de programar el cálculo automático,
hay que confirmar con el negocio la fórmula real — por ejemplo, si existe un valor
base del vehículo (FOB) que no aparece desglosado, o si el impuesto se calcula sobre
una base distinta a la suma simple. **No asumir una fórmula sin esa confirmación** —
mientras tanto, dejar `precioFinalOverride` como el campo autoritativo y el cálculo
automático como una ayuda visual en el formulario del admin, no como fuente de verdad
hasta que se valide.

## 7. Panel de administración

- Ruta `/admin`, con `middleware.ts` que exige sesión válida para todo lo que cuelgue
  de `/admin` excepto `/admin/login`. Meta `robots: noindex` en todo el panel.
- Login con NextAuth (Credentials): email + contraseña contra `UsuarioAdmin`
  (`passwordHash` con bcrypt). Limitar intentos de login (ej. `@upstash/ratelimit` o
  un contador simple en memoria/DB para el MVP).
- MVP con un solo rol `ADMIN`; el enum `RolAdmin` ya deja espacio para `EDITOR`.
- Módulos:
  - **Vehículos**: tabla con búsqueda/filtros, crear/editar/eliminar/duplicar,
    publicar/despublicar.
  - **Ficha de vehículo**: formulario por pestañas — datos generales, precios y
    costos, especificaciones (CRUD de filas `Especificacion` agrupadas), galería
    (subida múltiple, reordenar con dnd-kit, marcar portada), visibilidad
    (destacado/más vendido + orden).
  - **Marcas**: nombre + logo.
  - **FAQ**: pregunta/respuesta/orden.
  - **Configuración global**: tasa BCV + fecha, tarifa fija, tiempos de entrega por
    defecto, información importante, WhatsApp (número + plantilla de mensaje),
    banner de destacados.
- Subida de imágenes: componente único reutilizado en galería de vehículo, logo de
  marca y banner de destacados; sube a Vercel Blob y guarda solo la URL.

## 8. Requisitos no funcionales

- Responsive en todas las páginas públicas y en el panel admin.
- SEO: metadata dinámica por vehículo (`generateMetadata` con marca/modelo/precio),
  `sitemap.xml` generado desde los vehículos publicados.
- Imágenes con `next/image`, lazy loading fuera del viewport inicial.
- Accesibilidad básica: alt text en todas las fotos de vehículo (usar
  `"{marca} {modelo} {version}"` por defecto), estado de foco visible en controles
  interactivos, contraste AA en textos sobre fondos de color.
- Analítica: dejar preparado un slot para Google Analytics/Plausible, sin bloquear
  el proyecto si no se decide ahora.

## 9. Variables de entorno

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
BLOB_READ_WRITE_TOKEN=
```

## 10. Fases de entrega

| Fase | Contenido | Listo cuando… |
|---|---|---|
| 1 — Fundaciones | Prisma schema + migraciones, login admin, CRUD de vehículos con carga de imágenes | se puede crear un vehículo completo desde el panel y verlo en la base de datos |
| 2 — Sitio público | Home (5 secciones), ficha de detalle completa, filtros del catálogo, botón de WhatsApp | un vehículo cargado en el panel aparece correctamente en el catálogo y su ficha |
| 3 — Contenido dinámico | FAQ, Configuración Global, cálculo de precio (una vez validada la fórmula) | los textos y el precio final ya no dependen de nada hardcodeado |
| 4 — Pulido | SEO, rendimiento de imágenes, analítica, roles adicionales | Lighthouse aceptable en móvil, sitemap generado |

## 11. Decisiones pendientes del negocio (no inventar, preguntar)

- [ ] Fórmula real de precio final (ver sección 6).
- [x] Nombre de marca y logo — **Avan Motors**, confirmado y aplicado en header,
      footer y metadata del sitio.
- [ ] Dominio y paleta definitiva del proyecto.
- [ ] Número de WhatsApp y texto exacto de la plantilla de mensaje.
- [ ] Textos legales exactos (registro fiscal, licencias) para el footer.
- [x] Máximo de vehículos permitido en el slider de "Más Vendidos" — ya no es un
      valor fijo en código: es editable por el negocio en
      `/admin/configuracion` → "Más vendidos y tiempos de entrega"
      (`ConfiguracionGlobal.maxMasVendidos`, default 5 si no se ha configurado).
- [x] Proveedor final de base de datos/imágenes — **Supabase Postgres** + **Vercel Blob** (store público), ya en uso.
