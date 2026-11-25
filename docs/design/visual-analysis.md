# Informe de Análisis Visual Forense — Rediseño del Hero

**Agente:** `@visual-analyst` — LandingFactory  
**Modo:** Solo Lectura (`read-only`)  
**Proyecto:** `Portfolio-Kirian` (Astro 5 + Tailwind CSS v4)  
**Destino documental:** [visual-analysis.md](file:///C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian/docs/design/visual-analysis.md)

---

## 1. Inventario de Referencias

| Archivo | Dimensiones (px) | Viewport Web Útil | Canvas / Fondo | Propósito en el Rediseño | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `references/saadb-red-banner.png` | `2000 × 1088` | `2000 × 999` (Y: 89 a 1087) | `#0c0504` (crimson black) | Textura superior orgánica en rojos con tramado dither/halftone y desvanecimiento vertical hacia abajo. | **Inspeccionado** |
| `references/nachi-center-hero.png` | `2000 × 1088` | `2000 × 999` (Y: 89 a 1087) | `#0a0a0a` (neutral dark) | Layout minimalista centrado: barra superior bipartita, avatar cuadrado redondeado, bio escalonada, email y botones pill. | **Inspeccionado** |

> [!NOTE]
> Ambas capturas provienen de navegadores basados en Chromium a DPR = 1.0 sobre una ventana de 2000px de ancho. Los primeros 88px verticales corresponden a la barra de pestañas y dirección del sistema; el viewport web real inicia con precisión en `Y = 89px`.

---

## 2. Arquitectura Macro y Ritmo de Secciones

### 2.1. Anatomía Estructural Comparada

```
+-----------------------------------------------------------------------------------+
| saadb-red-banner.png                                                              |
| [================== Banner Rojo Halftone / Dither (100vw, H: ~330px) ============] |
|                                                                                   |
|                   [ X: 736px | Saad Basheer (Instrument Serif) ]                 |
|                   [ Bio / Metadatos / Formulario de contacto  ]                   |
|                   [ Work Grid (Lista de proyectos)            ]                   |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| nachi-center-hero.png                                                             |
|                                                                                   |
|                   [ X: 726px | nachi.                     twitter | X: 1265px ]   |
|                   [ Avatar 48x48px (rounded-xl)                       ]           |
|                   [ Bio líneas cortas + @UmbraPrivacy                 ]           |
|                   [ Contacto: [icon] email                            ]           |
|                   [ [book a call ↗]  [view my work]                   ]           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 2.2. Ritmo Vertical y Coordenadas del Hero (Nachi)

| Bloque / Elemento | Rango Y (px) | Altura (px) | Separación al siguiente | Clases Tailwind v4 Equivalentes |
| :--- | :--- | :--- | :--- | :--- |
| **Viewport superior vacío / Offset** | `89 → 398` | `309px` | — | Centrado vertical (`min-h-[calc(100vh-theme(spacing.24))] flex flex-col justify-center`) |
| **Header Row** (`nachi.` / `twitter`) | `398 → 414` | `17px` | `47px` | `w-full flex justify-between items-center mb-12` |
| **Avatar Cuadrado** | `461 → 507` | `47px (~48px)` | `19px` | `w-12 h-12 rounded-xl mb-5 overflow-hidden` |
| **Línea 1 Bio** (`@UmbraPrivacy`) | `526 → 538` | `13px` | `17px` | `leading-[19px] mb-4` |
| **Línea 2 Bio** (`recentdesign`) | `555 → 568` | `14px` | `18px` | `leading-[19px] mb-4.5` |
| **Línea 3 Bio** (Experiencia startups, 2 líneas) | `586 → 614` | `29px` | `18px` | `leading-[19px] mb-4.5` |
| **Línea 4 Bio** (Empresas y rol, 3 líneas) | `632 → 675` | `44px` | `17px` | `leading-[19px] mb-4` |
| **Línea 5 Contacto** (`[icon] email`) | `692 → 704` | `13px` | `39px` | `leading-[19px] mb-10 flex items-center gap-2` |
| **Fila de Botones Pill** (CTA) | `743 → 778` | `36px` | — | `flex items-center gap-2.5 h-9` |

### 2.3. Contenedor y Centrado Óptico
- **Ancho del contenedor observado:** `539px` (desde `X = 726px` hasta `X = 1265px`).
- **Comportamiento responsive propuesto:** `max-w-[540px] w-full mx-auto px-5 sm:px-0`.
- **Alineación interna:** El contenedor está centrado horizontalmente en la pantalla, pero todo su contenido interno está rigurosamente **alineado a la izquierda** (`text-left`). La fila superior utiliza `justify-between` para anclar los dos extremos de la columna.

---

## 3. Sistema Tipográfico Observado y Especificado

El proyecto cuenta con especificaciones tipográficas mandatarias que armonizan con las dos referencias:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Instrument Serif — 28px / Weight 400 / Leading 46px / #d1c5ad                   │
│ Inter — 15px / Weight 450 / Leading 19px / Tracking 0.16px / #f5f5f5            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

| Rol Tipográfico | Fuente | Tamaño (`font-size`) | Peso (`font-weight`) | Interlineado (`line-height`) | Espaciado (`letter-spacing`) | Color (Hex) | Mapeo Tailwind v4 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Headline / Nombre Principal** | **Instrument Serif** | `28px` (`1.75rem`) | `400` (Regular) | `46px` (`2.875rem`) | Normal (`0`) | `#d1c5ad` | `font-serif text-[28px] font-normal leading-[46px] text-[#d1c5ad]` |
| **Marca / Logo Navbar** (`kirian.`) | **Inter** | `15px` | `500` (Medium) | `19px` | `0.16px` (`0.01em`) | `#f5f5f5` | `font-sans text-[15px] font-medium leading-[19px] tracking-[0.16px] text-[#f5f5f5]` |
| **Enlace Navbar** (`twitter` / `github`) | **Inter** | `14px - 15px` | `450` (Normal+) | `19px` | `0.16px` | `#737373` → `#f5f5f5` | `text-[15px] text-neutral-500 hover:text-[#f5f5f5] transition-colors` |
| **Bio / Párrafos de Cuerpo** | **Inter** | `15px` | `450` | `19px` | `0.16px` (`0.01em`) | `#f5f5f5` / `#b0b0b0` | `font-sans text-[15px] font-[450] leading-[19px] tracking-[0.16px] text-[#b0b0b0]` |
| **Resaltados / Menciones** (`@Company`) | **Inter** | `15px` | `500` (Medium) | `19px` | `0.16px` | `#00a2f4` (vivid blue) | `text-[#00a2f4] hover:underline font-medium` |
| **Botón Primario** (`book a call ↗`) | **Inter** | `13.5px - 14px` | `500` (Medium) | `18px` | `-0.01em` | `#000000` sobre `#f5f5f5` | `text-[13.5px] font-medium text-black` |
| **Botón Secundario** (`view my work`) | **Inter** | `13.5px - 14px` | `450` - `500` | `18px` | `-0.01em` | `#b8b8b8` sobre `#171717` | `text-[13.5px] font-medium text-[#b8b8b8]` |

---

## 4. Paleta, Superficies y Profundidad

### 4.1. Tokens de Color Extraídos Forensemente

```
#e80100 ──── Peak Red / Vermilion (Altas luces del banner)
#990a0a ──── Midtone Crimson (Cuerpo del fluido / dither)
#400302 ──── Deep Burgundy / Shadow (Contorno oscuro)
#0c0504 ──── Dark Crimson Base (Fondo de Saad Basheer)
#0a0a0a ──── Neutral Canvas Base (Fondo de Nachi)
#d1c5ad ──── Warm Cream Serif (Instrument Serif display)
#f5f5f5 ──── Off-White Primary (Inter cuerpo y CTA primario)
#b0b0b0 ──── Muted Secondary Text (Bio y subtítulos)
#00a2f4 ──── Accent Vivid Blue (Enlaces destacados)
#171717 ──── Dark Surface (Superficie botón secundario)
#262626 ──── Subtle Border (Borde de elementos interactivos)
```

### 4.2. Matriz de Superficies y Jerarquía de Capas

| Capa / Superficie | Rol | Token / Valor | Opacidad / Efecto |
| :--- | :--- | :--- | :--- |
| **L0: Canvas Base** | Fondo global | `#0a0a0a` / `#0c0504` | Sólido |
| **L1: Banner Dither** | Atmósfera superior | Gradiente `#e80100` / `#990a0a` | Bayer Dither 4px, máscara `linear-gradient(to bottom, black 40%, transparent 100%)` |
| **L2: Gradiente de Fusión** | Suavizado del banner | `radial-gradient` elíptico | `rgba(12, 5, 4, 0.85)` a `rgba(10, 10, 10, 1)` |
| **L3: Contenedor Hero** | Contenido centrado | Transparente | `z-10`, `max-w-[540px]` |
| **L4: Avatar Surface** | Contenedor de imagen | Foto + borde `rgba(255,255,255,0.1)` | Borde de 1px sutil, `rounded-xl` |
| **L5: Botón Primario** | CTA principal | `#f5f5f5` | Sólido, texto `#000000`, `rounded-lg` / pill |
| **L6: Botón Secundario** | CTA secundario | `#171717` con borde `#262626` | Superficie oscura con contraste táctil |

---

## 5. Análisis Detallado del Hero Combinado

### 5.1. Banner Halftone / Dither (`saadb-red-banner.png`)
1. **Pitch y Estructura del Tramado:**
   - La textura dither está modulada sobre una cuadrícula periódica con un paso exacto de **`4px × 4px`** (matriz Bayer 4x4 o raster halftone ortogonal).
   - En las zonas de alta luminosidad (zona superior central, `Y = 110..190px`), los puntos crecen y se fusionan formando filamentos vermellón continuos (`#e80100`).
   - En las zonas oscuras y hacia la base (`Y = 250..340px`), los puntos rojos disminuyen en diámetro y densidad espacial, dejando ver el fondo negro profundo.
2. **Geometría del Desvanecimiento:**
   - El banner ocupa el ancho total de la pantalla (`100vw`).
   - Se extiende verticalmente desde el borde superior (`Y = 0`) hasta aproximadamente `330px - 350px`.
   - La transición inferior es orgánica y se desvanece por completo antes de `Y = 420px`, sin líneas de corte duras ni sombras duras.
3. **Estrategia Técnica de Implementación en Astro / Tailwind:**
   - **Opción A (Shader WebGL / Canvas):** Continuar con la infraestructura de shader ya existente en `BannerHero.astro` adaptando el fragment shader para emitir el campo de ruido turbulento en la gama roja y cuantizarlo con un filtro dither de 4px (`mod(gl_FragCoord.xy, 4.0)`).
   - **Opción B (CSS / SVG Overlay + Grayscale Noise):** Un contenedor `h-80 w-full absolute top-0 pointer-events-none` con fondo rojo degradado, máscara SVG dither y `mask-image: linear-gradient(to bottom, black 50%, transparent 100%)`.

### 5.2. Contenedor Minimalista Centrado (`nachi-center-hero.png`)
1. **Barra Superior (Header Row):**
   - Dispuesta en `display: flex; justify-content: space-between; align-items: center;`.
   - Elemento izquierdo: `kirian.` o marca personal en Inter 15px `#f5f5f5` minúsculas.
   - Elemento derecho: Enlace social (`twitter` o `github`) en Inter 14px `#737373`, interactivo con transición a blanco.
2. **Avatar:**
   - Dimensiones precisas: `48px × 48px` (`w-12 h-12`).
   - Radio de curvatura: `rounded-xl` (~10px - 12px de radio).
   - Ubicación: A la izquierda del contenedor, espaciado `48px` debajo del header row.
3. **Bloque de Título e Identidad (Integración con Instrument Serif):**
   - Para incorporar la fuente mandataria `Instrument Serif (28px, line-height 46px, color #d1c5ad)`, se ubica el título de presentación (ej. *"Kirian Luna"* o *"Software Engineer & Interface Builder"*) inmediatamente bajo el avatar o encabezando la bio, sirviendo de puente visual entre el banner rojo de Saad y el contenido de Nachi.
4. **Bio Escalonada:**
   - Líneas de texto concisas con saltos intencionados para mantener la longitud de línea (`measure`) en torno a los 50-65 caracteres.
   - Párrafos espaciados con márgenes verticales consistentes de `16px - 18px` (`gap-y-4`).
   - Enlace destacado en azul vibrante (`#00a2f4`) para llamar la atención sobre el rol o producto actual.
5. **Fila de Acciones (Botones Pill):**
   - **Botón Primario ("book a call ↗"):** Ancho ~103px, alto 36px (`h-9 px-4`). Fondo blanco `#f5f5f5`, texto negro `#000000`, radio `rounded-lg` (8px-10px) o pill. Incluye glifo de flecha oblicua `↗`.
   - **Botón Secundario ("view my work"):** Ancho ~107px, alto 36px (`h-9 px-4`). Fondo `#171717`, borde 1px `#262626`, texto `#b8b8b8`.
   - **Separación entre botones:** `10px` (`gap-2.5`).

---

## 6. Ledger de Evidencia (Evidence Ledger)

| Elemento Analizado | Estado | Fuente de Información | Medición Forense / Justificación |
| :--- | :--- | :--- | :--- |
| **Dimensiones de Screenshots** | `observed` | Archivos PNG en `references/` | `2000 × 1088 px` exactos mediante `sharp` IHDR chunk. |
| **Altura de Chrome del Navegador** | `observed` | `references/saadb-red-banner.png` y `nachi-center-hero.png` | `88px` de altura (píxeles `Y: 0..88`). Borde de ventana en `#3f3f3f`. |
| **Fondo Base Nachi** | `observed` | `references/nachi-center-hero.png` | `rgb(10, 10, 10)` → `#0a0a0a` (neutral dark uniforme). |
| **Fondo Base Saad Basheer** | `observed` | `references/saadb-red-banner.png` | `rgb(12, 5, 4)` → `#0c0504` (dark con matiz cálido rojizo). |
| **Ancho del Contenedor Nachi** | `observed` | `references/nachi-center-hero.png` | `539px` (límite izquierdo en `X=726px`, límite derecho en `X=1265px`). |
| **Dimensiones Avatar** | `observed` | `references/nachi-center-hero.png` | `48 × 47 px` (prácticamente `48 × 48 px`, `w-12 h-12`). Radio ~10-12px (`rounded-xl`). |
| **Dimensiones Botón 1 (`book a call ↗`)** | `observed` | `references/nachi-center-hero.png` | `103px × 36px` (`h-9 px-4`), fondo `#f5f5f5`, texto `#000000`. |
| **Dimensiones Botón 2 (`view my work`)** | `observed` | `references/nachi-center-hero.png` | `107px × 36px` (`h-9 px-4`), fondo `#171717`, texto `#b8b8b8`. |
| **Pitch del Tramado Halftone / Dither** | `observed` | `references/saadb-red-banner.png` | Período de paso exacto de `4px` en X e Y (`autocorrelation peak interval = 4px`). |
| **Picos de Color del Banner Rojo** | `observed` | `references/saadb-red-banner.png` | Pico rojo `rgb(232, 1..4, 0)` (`#e80100`), midtones `rgb(153, 10, 10)` (`#990a0a`). |
| **Color Título Saad Basheer** | `observed` | `references/saadb-red-banner.png` | `rgb(209, 197, 173)` → `#d1c5ad` en serif (coincide al 100% con la especificación del usuario). |
| **Color Enlace Mención (`@UmbraPrivacy`)** | `observed` | `references/nachi-center-hero.png` | `rgb(0, 162, 244)` → `#00a2f4`. |
| **Tipografía Mandataria Inter** | `inferred` + `user-defined` | Instrucción explícita del usuario | `Inter (15px, weight 450, line-height 19px, tracking 0.16px, #f5f5f5)` reemplaza la sans de Nachi. |
| **Tipografía Mandataria Instrument Serif** | `inferred` + `user-defined` | Instrucción explícita del usuario + `saadb` | `Instrument Serif (28px, weight 400, line-height 46px, #d1c5ad)` se usa para el nombre/título. |
| **Comportamiento Animado del Banner Rojo** | `inferred` | `references/saadb-red-banner.png` | La textura parece derivar de un shader de ruido Perlin/Simplex o fluid dynamics renderizado en canvas con dither shader. |
| **Microinteracciones en Hover de Botones** | `inferred` | Buenas prácticas de diseño UI | Opacidad `hover:opacity-90` en botón primario y aclarado de borde `hover:border-neutral-700` en secundario. |
| **Dinámica en Pantallas Móviles (<640px)** | `inferred` | Práctica estándar de diseño responsivo | Contenedor pasa a `w-full px-5`, banner reduce altura a ~220px, botones se apilan o ajustan a `flex-wrap`. |
| **Destino de Acción de "Book a call"** | `unknown` | `references/nachi-center-hero.png` | No determinable mediante inspección estática (puede ser Cal.com, Calendly o enlace `mailto:`). |
| **Estado Dinámico del Shader en Vivo** | `unknown` | `references/saadb-red-banner.png` | Al ser una captura estática, no se puede verificar si el banner posee animación fluida continua o reactividad al puntero. |

---

## 7. Recomendaciones para la Fase de Implementación

1. **Configuración de Fuentes en Tailwind v4:**
   - Asegurar la definición de `@theme` con las fuentes:
     ```css
     @theme {
       --font-sans: "Inter", sans-serif;
       --font-serif: "Instrument Serif", serif;
     }
     ```
2. **Composición del Banner Superior:**
   - Crear un componente `TopRedBanner.astro` que proyecte el fondo degradado rojo tramado con un `mask-image` exponencial hacia abajo, posicionado de forma absoluta (`pointer-events-none`) detrás del flujo de contenido.
3. **Estructura del Hero:**
   - Utilizar un contenedor centrado `max-w-[540px]` con padding horizontal de seguridad para dispositivos móviles.
   - Mantener la jerarquía limpia: Header bipartito (`kirian.` / social link) -> Avatar 48px -> Nombre en Instrument Serif `#d1c5ad` -> Bio escalonada en Inter 15px `#f5f5f5` / `#b0b0b0` -> Botones pill `h-9` (`#f5f5f5` y `#171717`).

---
*Informe generado por `@visual-analyst` de LandingFactory en modo solo lectura.*