# Inventario y Especificación de Recursos Gráficos
**Documento de Entrega:** `docs/design/asset-inventory.md`  
**Rol:** `@asset-researcher` — LandingFactory (Modo Solo Lectura)  
**Proyecto:** [Portfolio-Kirian](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian)  
**Fecha de Análisis:** 24 de Noviembre de 2026  

---

## 1. Assets Locales Detectados

Se realizó una inspección exhaustiva de los directorios [src/assets/](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/assets) y [public/](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public), así como de las referencias visuales suministradas en [references/](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references):

| Archivo Local | Ubicación Absoluta | Dimensiones | Peso en Disco | Tipo / Formato | Propósito / Uso Actual |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **saadb-red-banner.png** | [references/saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png) | 2000 × 1088 px | 1.18 MB | Imagen PNG (Referencia) | Captura de interfaz de Saad Basheer (`saadb.me`). Muestra el banner superior dithered/halftone rojo y la lista de proyectos con toggle list/grid. |
| **nachi-center-hero.png** | [references/nachi-center-hero.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/nachi-center-hero.png) | 2000 × 1088 px | 144.8 KB | Imagen PNG (Referencia) | Captura de interfaz de Nachi Tiwari (`nachi.design`). Muestra el hero minimalista con avatar centrado 1:1, tipografía editorial y botones CTA en píldora. |
| **profile.webp** | [public/profile.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/profile.webp) | 1169 × 1483 px | 116.2 KB | Fotografía WebP | Fotografía real de Kirian Luna (selfie en vehículo, iluminación natural diurna, anteojos rectangulares, cabello rizado, expresión amigable). |
| **LogoKirian.png** (Alta Res) | [src/assets/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/assets/LogoKirian.png) | 1098 × 1098 px | 173.4 KB | Gráfico PNG (Canal Alfa) | Logotipo de marca personal de Kirian Luna: silueta vectorizada de personaje en carrera con audífonos over-ear y ojos estilizados en rayo. |
| **LogoKirian.png** (Optimizada) | [public/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/LogoKirian.png) | 96 × 96 px | 1.63 KB | Gráfico PNG (Canal Alfa) | Versión compacta utilizada actualmente en [Navbar.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/Navbar.astro#L85) y cabecera del blog. |
| **KirianLunaOG.png** | [public/OG/KirianLunaOG.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/OG/KirianLunaOG.png) | 2400 × 1260 px | 36.8 KB | Gráfico PNG (Indexed) | Open Graph card para previsualización en redes sociales. |
| **costa-rica.webp** | [src/assets/costa-rica.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/assets/costa-rica.webp) | 512 × 341 px | 2.54 KB | Imagen WebP | Bandera de Costa Rica para metadata de ubicación. |
| **ulatina-campus.webp** | [public/images/ulatina-campus.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/images/ulatina-campus.webp) | 480 × 320 px | 18.2 KB | Imagen WebP | Vista previa flotante para el enlace a la Universidad Latina en la bio. |
| **blog-limon-identity.jpg** | [public/blog-limon-identity.jpg](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/blog-limon-identity.jpg) | 650 × 366 px | 38.2 KB | Fotografía JPEG | Portada editorial 16:9 del artículo de identidad cultural de Limón. |
| **Logos Corporativos** | [public/Logos/](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/Logos) | Varias dimensiones | 75 - 188 KB | WebP | Logotipos de proyectos: `Brisas del Rio.webp`, `LogoLEBP.webp`, `MonteLosOlivos.webp`. |
| **Tech Stack Icons** | [public/icons/tech/](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/icons/tech) | Vectorial SVG | 1 - 5 KB c/u | Vectorial SVG puro | 40+ iconos técnicos vectoriales optimizados para renderizado directo en DOM. |

---

## 2. Tabla Resumen de Inventario

| ID | Tipo | Ubicación en Referencia | Proporción | Estado | Método de Obtención | Ruta Destino Sugerida |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hero-red-banner` | Shader Procedural WebGL2 | Superior / Hero Header ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | Fluido / `100vw × 180-240px` | `original-recuperado` (Extensión de código) | Shader procedural WebGL2 en GLSL (cero bytes raster). Modificación del shader existente en [BannerHero.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/BannerHero.astro). | [src/components/BannerHero.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/BannerHero.astro) |
| `hero-center-avatar` | Fotografía de Retrato | Bloque Central Superior ([nachi-center-hero.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/nachi-center-hero.png)) | `1:1` (Cuadrado `rounded-2xl`) | `original-recuperado` | Recorte centrado en rostro (`object-cover object-[center_28%]`) del archivo local [public/profile.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/profile.webp). | [public/profile.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/profile.webp) vía [DitheredAvatar.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/DitheredAvatar.astro) |
| `brand-runner-logo` | Isotipo / Brand Mark | Navbar y Brand Badge ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | `1:1` | `original-recuperado` | Uso del asset existente [src/assets/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/assets/LogoKirian.png) y [public/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/LogoKirian.png). | [public/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/LogoKirian.png) |
| `ui-icons-set` | Iconografía Vectorial UI | Toda la interfaz (Hero, Navbar, Social, Work, Controles) | `1:1` (`viewBox="0 0 24 24"`) | `original-recuperado` | Componentes SVG nativos en código (Lucide / Feather / SimpleIcons adaptados sin emojis ni raster). | [src/components/](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components) |

---

## 3. Fichas Detalladas por Asset

### Ficha 1: Banner Rojo Dithered / Halftone Superior (`hero-red-banner`)

* **Ubicación en Referencia:** Fondo de la cabecera superior a ancho completo (`w-full`), visible en [references/saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png).
* **Dimensiones Aproximadas y Proporción:** Ancho responsivo `100vw` por una altura de `180px` a `220px` en escritorio (`160px` en móvil). Proporción horizontal aproximada de `10:1` a `16:3`.
* **Descripción Visual Detallada:**
  * **Sujeto:** Textura de fluido turbulento / volutas de humo / curvas de nivel orgánicas con distorsión matemática no lineal (Domain Warping / Fractional Brownian Motion).
  * **Composición:** Ocupa la franja superior de la ventana con un desvanecimiento inferior orgánico hacia el fondo negro puro (`#050505` / `#0A0A0A`).
  * **Patrón de Tono:** Trama retro-digital de **halftone dots / ordered dithering** (stippling circular o de matriz Bayer). En las zonas de mayor intensidad luminosa los puntos crecen y se agrupan densamente; en las zonas oscuras se dispersan hasta desaparecer en el negro.
  * **Paleta Cromática:**
    * Base profunda: `#050505` a `#0E0E10` (negro azabache).
    * Sombras medias: `#3A0808`, `#5C0D0D`, `#8B0000` (rojo granate / borgoña).
    * Highlights intensos: `#D91616`, `#FF2424`, `#FF3B30` (rojo escarlata brillante).
* **Decisión Técnica Crítica — ¿Shader WebGL/Canvas en código o Textura estática?**
  * **DICTAMEN:** **DEBE IMPLEMENTARSE MEDIANTE SHADER WEBGL2/CANVAS EN CÓDIGO** dentro de [BannerHero.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/BannerHero.astro).
  * **Fundamentación Técnica:**
    1. **Destrucción por Compresión Lossy:** Cualquier textura raster en WebP, AVIF o video MP4 con tramado de semitonos de alta frecuencia sufre severos macrobloques de cuantización y artefactos de "ringing" que emborronan los puntos del dither.
    2. **Sobrecarga de Red (LCP):** Una imagen PNG sin pérdida a 2000px pesaría entre **800 KB y 1.4 MB**, degradando el rendimiento móvil y las Core Web Vitals. Un shader WebGL2 en código añade **0 KB** de transferencia de medios (solo ~2 KB de código GLSL embebido).
    3. **Resolución Nativa a Nivel de Píxel:** El shader calcula el halftone directamente contra la resolución física del viewport (`uResolution` con escala de Device Pixel Ratio), garantizando nitidez perfecta en monitores 1x, 2x y pantallas Retina.
    4. **Infraestructura ya Construida:** [BannerHero.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/BannerHero.astro) ya cuenta con la implementación de WebGL2 (`VS` y `FS`), gestión de pérdida de contexto (`webglcontextlost`), apagado por `IntersectionObserver` cuando el usuario hace scroll, y renderizado estático de un solo frame bajo `prefers-reduced-motion`.
    5. **Paso Requerido en Shader:** Basta con reemplazar la paleta azul actual (`#4470FF` / `#16171D`) por la paleta roja (`accent: #FF2B2B`, `base: #0A0A0A`) y agregar en el Fragment Shader (`FS`) una función de umbralización por matriz Bayer 4x4 o cuadrícula de puntos halftone:
       $$\text{ditherVal} = \text{bayerMatrix}[\text{int}(\text{mod}(gl\_FragCoord.xy, 4.0))];$$
* **Prompt de Generación (Solo para contingencia / asset de fallback estático `banner-hero-fallback.webp`):**
  > *"Abstract horizontal panoramic banner, top view, organic fluid smoke and liquid plasma clouds with intense domain warping turbulence. High-contrast monochromatic scarlet red (#FF2020) and deep pitch black (#050505). Overlayed with a fine retro-digital ordered halftone stippling dot pattern and pixelated dithering texture. Subtle organic gradient fading out to solid black at the bottom edge. High resolution, ultra sharp, graphic design editorial aesthetic, 8k resolution, aspect ratio 16:3."*

---

### Ficha 2: Avatar Cuadrado Pequeño del Centro (`hero-center-avatar`)

* **Ubicación en Referencia:** Centro de la composición del Hero en [references/nachi-center-hero.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/nachi-center-hero.png), situado encima del titular de presentación y el texto de experiencia.
* **Dimensiones y Proporción:** Proporción estricta `1:1` (cuadrado). En pantalla: `52 × 52 px` a `56 × 56 px` (en Tailwind: `w-13 h-13` o `w-14 h-14`).
* **Visuales y Tratamiento en Referencia:**
  * Esquinas redondeadas pronunciadas pero sin llegar a círculo completo (`rounded-2xl`, radio de aprox. `14px` a `16px`).
  * Contorno con sutil borde de micro-relieve (`border border-black/10 dark:border-white/10`) y sombra ultra ligera (`shadow-xs`).
  * En la referencia de Nachi Tiwari, se trata de una fotografía personal del autor vistiendo camisa azul sobre fondo claro con iluminación suave.
* **Asset Local Identificado y Asignado:**
  * **Archivo Asignado:** [public/profile.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/profile.webp) (1169 × 1483 px, 116 KB, WebP optimizado).
  * **Sujeto:** Kirian Luna.
  * **Encuadre / Punto Focal:** El archivo original es un retrato vertical en automóvil. Para ajustarse al contenedor cuadrado `1:1` sin ninguna deformación anamórfica, debe aplicarse la directiva CSS:
    ```css
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center 28%;
    ```
    Esto fija el punto focal exactamente sobre el rostro y las gafas rectangulares de Kirian, recortando proporcionalmente el área excedente del asiento del automóvil.
  * **Componente Contenedor Existente:** El proyecto ya dispone de [src/components/DitheredAvatar.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/DitheredAvatar.astro). Este componente ya tiene las clases `w-13 h-13 sm:w-14 sm:h-14 rounded-xl border border-black/10 dark:border-white/10 shadow-xs overflow-hidden` preparadas para recibir la imagen de `public/profile.webp`.
  * **Asset Secundario de Marca (Alternativa):** [src/assets/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/assets/LogoKirian.png) / [public/LogoKirian.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/LogoKirian.png), que muestra el personaje corriendo con audífonos. Puede emplearse como avatar alternativo o badge de autor en modo monocromático (`dark:invert`).

---

## 4. Inventario de Iconografía SVG

Conforme a la regla obligatoria de **LandingFactory** ("cero emojis, cero imágenes raster para iconos"), todos los elementos de señalización e interactividad deben implementarse como **SVG en código**.

A continuación se catalogan todos los iconos necesarios para los bloques visualizados en las dos referencias ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png) y [nachi-center-hero.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/nachi-center-hero.png)) y el diseño actual de `Portfolio-Kirian`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MAPA DE ICONOGRAFÍA SVG EN CÓDIGO                    │
├────────────────────────────┬─────────────────────────────┬─────────────┤
│ Bloque / Sección           │ Iconos Requeridos           │ Formato     │
├────────────────────────────┼─────────────────────────────┼─────────────┤
│ 1. Barra de Navegación     │ Brand, Sun, Moon, Globe     │ SVG Inline  │
│ 2. Hero & Metadata         │ MapPin, Envelope, Check,    │ SVG Inline  │
│                            │ User, Code, Clock           │             │
│ 3. Barra Social (Saad)     │ X, GitHub, LinkedIn,        │ SVG Monocrom│
│                            │ Discord, Email              │             │
│ 4. Botones CTA (Nachi)     │ ArrowUpRight, Briefcase/Cal │ SVG Stroke  │
│ 5. Controles de Proyectos  │ User (Personal), Layers,    │ SVG Stroke  │
│                            │ List (≡), Grid (▦), ExtLink │             │
│ 6. Tech Stack & Footer     │ 40+ Logos Técnicos, Music,  │ SVG Monocrom│
│                            │ Gamepad, GitCommit          │             │
└────────────────────────────┴─────────────────────────────┴─────────────┘
```

### Tabla de Especificación Técnica de Iconos SVG

| Nombre del Icono | Ubicación / Componente | Propósito Visual | Atributos SVG (`viewBox`, `stroke`, `fill`) | Especificación de Geometría / Path |
| :--- | :--- | :--- | :--- | :--- |
| **ArrowUpRightIcon** | Botón *"book a call ↗"* (Hero Nachi) y Enlaces de Proyectos | Señalizar enlace o apertura de calendario externo. Reemplaza el caracter unicode `↗`. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"` | `<path d="M7 17L17 7M7 7h10v10" />` |
| **ListToggleIcon** | Switcher de vista en Proyectos ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | Botón de vista en lista vertical (`≡`). | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2.2"` | `<line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />` |
| **GridToggleIcon** | Switcher de vista en Proyectos ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | Botón de vista en cuadrícula de tarjetas (`▦`). | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2.2"` | `<rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />` |
| **CalendarIcon** | Botón de acción *"Book a call"* ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | Indicador de reserva de llamada / reunión. Reemplaza emoji `📅`. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />` |
| **DocumentCVIcon** | Botón de descarga *"CV"* ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | Indicador de descarga de Curriculum Vitae. Reemplaza emoji `📄`. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />` |
| **SendArrowIcon** | Botón enviar del input *"A role, a project..."* ([saadb-red-banner.png](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/references/saadb-red-banner.png)) | Botón circular con flecha hacia arriba para enviar consulta rápida. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<circle cx="12" cy="12" r="10" /><polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" />` |
| **EnvelopeIcon** | Metadata de Email y Barra de contacto | Icono de sobre postal para contacto directo. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />` |
| **CheckIcon** | Toast de copiado y confirmación | Icono de confirmación verde tras copiar email. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2.5"` | `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />` |
| **MapPinIcon** | Metadata de Ubicación (Limón, CR) | Pin de geolocalización física. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><circle cx="12" cy="11" r="3" />` |
| **UserIcon** | Segmented Control de Proyectos (Personal) | Identificador de categoría personal de proyectos. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />` |
| **LayersIcon** | Segmented Control de Proyectos (SorinLabs) | Identificador de proyectos corporativos / freelance. | `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"` | `<polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />` |
| **XTwitterIcon** | Fila Social de Cabecera | Identidad de marca X / Twitter. | `viewBox="0 0 24 24"`, `fill="currentColor"` | `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>` |
| **GitHubIcon** | Fila Social y Enlace de Repositorios | Identidad de marca GitHub. | `viewBox="0 0 24 24"`, `fill="currentColor"` | `<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>` |
| **LinkedInIcon** | Fila Social de Cabecera | Identidad de marca LinkedIn. | `viewBox="0 0 24 24"`, `fill="currentColor"` | `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>` |
| **DiscordIcon** | Fila Social de Cabecera | Identidad de marca Discord. | `viewBox="0 0 24 24"`, `fill="currentColor"` | `<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>` |

---

## 5. Resumen Ejecutivo y Recomendaciones de Implementación

1. **Banner Superior Dithered Rojo:**
   * No almacenar texturas pesadas raster ni loops de video.
   * Extender el shader GLSL en [BannerHero.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/BannerHero.astro) ajustando la paleta a tonos escarlata/carmesí (`#FF2020` / `#050505`) e insertando el pase de ordered dithering / halftone screen-space.
2. **Avatar Central de Nachi:**
   * Utilizar la fotografía original [public/profile.webp](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/public/profile.webp) a través del componente [DitheredAvatar.astro](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/src/components/DitheredAvatar.astro).
   * Enmarcar con `aspect-ratio: 1/1`, `rounded-2xl`, y `object-position: center 28%`.
3. **Iconografía UI:**
   * Todos los iconos quedan formalizados en SVG puro en código, garantizando consistencia óptica, cero dependencias raster y cero emojis.

*(Este informe ha sido generado en **Modo Solo Lectura** por `@asset-researcher` y se encuentra listo para ser persistido en `docs/design/asset-inventory.md`).*