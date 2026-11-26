/**
 * Section-by-section breakdown for each case study.
 *
 * Every capture exists twice: the English and the Spanish build of each site,
 * at 2x density, inside `public/work/<slug>/en|es/`. Width is shared; height
 * differs per locale because a translated sentence reflows the section. Both
 * heights are kept here so every card reserves its exact box before the lazy
 * image decodes, and the page never shifts under the section index while the
 * user scrolls.
 *
 * Copy rule: no hyphens, em dashes or middle dots in any prose field. Commas,
 * periods, colons and semicolons carry the pauses instead.
 */
export interface WorkSection {
  id: string;
  imageEn: string;
  imageEs: string;
  width: number;
  heightEn: number;
  heightEs: number;
  labelEn: string;
  labelEs: string;
  titleEn: string;
  titleEs: string;
  whyEn: string;
  whyEs: string;
  noteEn: string;
  noteEs: string;
}

export const WORK_SECTIONS: Record<string, WorkSection[]> = {
  koragrid: [
    {
      id: "hero",
      imageEn: "/work/koragrid/en/01.png",
      imageEs: "/work/koragrid/es/01.png",
      width: 2880,
      heightEn: 1452,
      heightEs: 1452,
      labelEn: "Hero",
      labelEs: "Portada",
      titleEn: "The product number is the first thing you read",
      titleEs: "El número del producto es lo primero que se lee",
      whyEn:
        "The headline stays inside a 660px column while the live console below it carries the kW reading in blue tabular numerals. The page is selling measurement, so one real number does more work than three abstract claims. Sector chips sit under the reading because changing the scenario is the fastest way to prove the console is not a static mock.",
      whyEs:
        "El titular se queda en una columna de 660 px mientras el panel en vivo de abajo carga la lectura de kW en números tabulares azules. La página vende medición, así que un número real hace más trabajo que tres frases abstractas. Los chips de sector van debajo de la lectura porque cambiar el escenario es la forma más rápida de probar que el panel no es una maqueta.",
      noteEn:
        "The kW value only animates while the console is in view, and the figure uses tabular numerals so the line does not jog when 412,8 becomes 413,2. The panel is a real blur layer over the spectrum graphic, not a flattened image.",
      noteEs:
        "El valor en kW solo se anima cuando el panel está en pantalla, y la cifra usa números tabulares para que la línea no baile cuando 412,8 pasa a 413,2. El panel es una capa real de desenfoque sobre el gráfico de espectro, no una imagen aplanada.",
    },
    {
      id: "traceability",
      imageEn: "/work/koragrid/en/02.png",
      imageEs: "/work/koragrid/es/02.png",
      width: 2880,
      heightEn: 1122,
      heightEs: 1122,
      labelEn: "Traceability",
      labelEs: "Trazabilidad",
      titleEn: "Five claims, five numbered stops",
      titleEs: "Cinco afirmaciones, cinco paradas numeradas",
      whyEn:
        "Instead of five identical feature cards, the claims live inside one paragraph and each gets a small numbered square. The active claim turns white while the rest drop to grey, so the eye follows a sequence rather than a grid. That matches the content: each step depends on the previous one, from reading a circuit to linking a local offset.",
      whyEs:
        "En vez de cinco tarjetas idénticas, las afirmaciones viven dentro de un párrafo y cada una recibe un cuadrado numerado. La afirmación activa se vuelve blanca y el resto baja a gris, así que el ojo sigue una secuencia y no una cuadrícula. El contenido lo pide: cada paso depende del anterior, desde leer un circuito hasta vincular una compensación local.",
      noteEn:
        "The five stops are buttons, and the 18px badge keeps the sentence from reflowing when the selection changes. The copy block keeps a fixed measure so the five lines never jump between states.",
      noteEs:
        "Las cinco paradas son botones, y la insignia de 18 px evita que la frase se reacomode al cambiar la selección. El bloque de texto mantiene una medida fija para que las cinco líneas no salten entre estados.",
    },
    {
      id: "problem",
      imageEn: "/work/koragrid/en/03.png",
      imageEs: "/work/koragrid/es/03.png",
      width: 2880,
      heightEn: 1674,
      heightEs: 1674,
      labelEn: "Problem",
      labelEs: "Problema",
      titleEn: "A light break that makes the diagnosis feel clinical",
      titleEs: "Un corte claro que vuelve clínico el diagnóstico",
      whyEn:
        "The dark hero and the dark traceability block run into a cream section that spans the full width, which is the layout equivalent of turning on the lights. Logos sit in a thin strip above the argument, before the reader is asked to care, because recognition buys the next ten seconds. Three equal columns name the failures without icons or oversized headings; the copy is the evidence.",
      whyEs:
        "El hero oscuro y el bloque de trazabilidad desembocan en una sección crema a todo el ancho, que es el equivalente visual de encender la luz. Los logos van en una franja delgada antes del argumento, porque el reconocimiento compra los siguientes diez segundos. Tres columnas iguales nombran las fallas sin iconos ni titulares gigantes; el texto es la evidencia.",
      noteEn:
        "Each card gets four 4px registration ticks half a pixel outside its corners, and the grid uses a 1px border instead of shadows. The cream panel runs edge to edge, so it reads as a physical insert in the dark page rather than another floating card.",
      noteEs:
        "Cada tarjeta lleva cuatro marcas de registro de 4 px medio píxel fuera de sus esquinas, y la cuadrícula usa bordes de 1 px en vez de sombras. El panel crema corre de borde a borde, así que se lee como un inserto físico en la página oscura y no como otra tarjeta flotante.",
    },
    {
      id: "modeling",
      imageEn: "/work/koragrid/en/04.png",
      imageEs: "/work/koragrid/es/04.png",
      width: 2880,
      heightEn: 1744,
      heightEs: 1744,
      labelEn: "Modeling",
      labelEs: "Modelado",
      titleEn: "Two canvases instead of a feature list",
      titleEs: "Dos lienzos en lugar de una lista de funciones",
      whyEn:
        "Load modeling is hard to explain in bullets, so the section gives it two 16:10 ASCII canvases and lets them take half the width each. The heading stays at 640px; the visuals do the describing. The copy under each canvas names the operational win, catching a spike before the window of 15 minutes closes, instead of restating the animation.",
      whyEs:
        "Modelar carga es difícil de explicar en viñetas, así que la sección le da dos lienzos ASCII de 16:10 y deja que cada uno ocupe la mitad del ancho. El titular se queda en 640 px; los visuales describen. El texto bajo cada lienzo nombra la ganancia operativa, detectar un pico antes de que cierre la ventana de 15 minutos, en lugar de repetir la animación.",
      noteEn:
        "Each canvas draws procedural ASCII at a 7px cell width, so it scales without shipping a video or a sprite sheet. The cards sit on a rule grid of 1px lines and drop their animation when the system asks for less motion.",
      noteEs:
        "Cada lienzo dibuja ASCII procedural con celdas de 7 px, así que escala sin enviar un video ni una hoja de sprites. Las tarjetas viven sobre una retícula de líneas de 1 px y apagan su animación cuando el sistema pide menos movimiento.",
    },
    {
      id: "grid-stress",
      imageEn: "/work/koragrid/en/05.png",
      imageEs: "/work/koragrid/es/05.png",
      width: 2880,
      heightEn: 1658,
      heightEs: 1658,
      labelEn: "Grid stress",
      labelEs: "Red bajo presión",
      titleEn: "The warning comes before the pitch",
      titleEs: "La advertencia llega antes que la propuesta",
      whyEn:
        "The section opens with an overloaded transformer and a countdown of 42 minutes, not with a feature. The order matters: a grid operator already knows the risk, so the page earns attention by naming the specific failure first. The ASCII tower occupies the middle while the alert panel and the resolution copy bracket it, which keeps the eye moving from problem to method.",
      whyEs:
        "La sección abre con un transformador sobrecargado y una cuenta de 42 minutos, no con una función. El orden importa: quien opera una red ya conoce el riesgo, así que la página gana atención nombrando primero la falla concreta. La torre ASCII ocupa el centro mientras el panel de alerta y el texto de solución la enmarcan, lo que lleva el ojo del problema al método.",
      noteEn:
        "The critical tag is a small solid red chip, not an animated badge; the urgency comes from the figure of 42 minutes next to it. The tower is drawn glyph by glyph on a canvas, so there is no poster frame to download before the section can paint.",
      noteEs:
        "La etiqueta de crítico es un chip rojo sólido y pequeño, no una insignia animada; la urgencia viene de la cifra de 42 minutos al lado. La torre se dibuja glifo por glifo en un canvas, así que no hay un póster que descargar antes de que la sección pinte.",
    },
    {
      id: "coverage",
      imageEn: "/work/koragrid/en/06.png",
      imageEs: "/work/koragrid/es/06.png",
      width: 2880,
      heightEn: 964,
      heightEs: 964,
      labelEn: "Coverage",
      labelEs: "Cobertura",
      titleEn: "Close on a map, not a form",
      titleEs: "Cerrar con un mapa, no con un formulario",
      whyEn:
        "The last section states national coverage and stops. A map of Costa Rica answers the remaining question, where does this actually run, without another feature block. The single CTA is deliberately quiet: after five sections of proof, a hard sell would read as panic.",
      whyEs:
        "La última sección declara cobertura nacional y se detiene. Un mapa de Costa Rica responde la pregunta que queda, dónde corre esto de verdad, sin otro bloque de funciones. El único CTA es deliberadamente discreto: después de cinco secciones de prueba, una venta agresiva se leería como pánico.",
      noteEn:
        "The map is vector, not a screenshot, and the section height is held around 480px on desktop so the page does not end in a long empty tail. The CTA is the only interactive element left, which keeps the exit obvious.",
      noteEs:
        "El mapa es vectorial, no una captura, y la altura de la sección se sostiene alrededor de 480 px en escritorio para que la página no termine en una cola vacía. El CTA es el único elemento interactivo que queda, lo que mantiene obvia la salida.",
    },
  ],

  customerup: [
    {
      id: "hero",
      imageEn: "/work/customerup/en/01.png",
      imageEs: "/work/customerup/es/01.png",
      width: 2880,
      heightEn: 2120,
      heightEs: 2120,
      labelEn: "Hero",
      labelEs: "Portada",
      titleEn: "A campaign panel does the explaining",
      titleEs: "Un panel de campaña hace la explicación",
      whyEn:
        "The left side states the offer in three short lines and the right side shows the thing being sold: a campaign with email, push and in app counts. That split keeps the headline from carrying the whole argument. Navigation is pushed to a single row above, so the eye lands on the product, not the menu.",
      whyEs:
        "El lado izquierdo plantea la oferta en tres líneas cortas y el derecho muestra lo que se vende: una campaña con conteos de correo, push y app. Esa división evita que el titular cargue todo el argumento. La navegación se reduce a una fila arriba, así que el ojo cae en el producto, no en el menú.",
      noteEn:
        "Each channel row is a label and value pair on the same baseline, and the 3.424 / 2.343 / 1.200 figures use tabular numerals so the three rows align. The card is sized to the hero's optical centre instead of being stretched to the column edge.",
      noteEs:
        "Cada fila de canal es un par etiqueta y valor en la misma línea base, y las cifras 3.424 / 2.343 / 1.200 usan números tabulares para que las tres filas alineen. La tarjeta se dimensiona al centro óptico del hero en vez de estirarse al borde de la columna.",
    },
    {
      id: "scale",
      imageEn: "/work/customerup/en/02.png",
      imageEs: "/work/customerup/es/02.png",
      width: 2880,
      heightEn: 2156,
      heightEs: 2242,
      labelEn: "Scale",
      labelEs: "Escala",
      titleEn: "The metrics get the biggest type on the page",
      titleEs: "Las métricas tienen el tipo más grande de la página",
      whyEn:
        "99,55%, 34B+, 5,4B+ and 24/5 sit above their labels and carry more visual weight than the section heading. That inversion is intentional: a data platform has to prove volume before it explains features. The three service columns below are quieter, so the section reads as evidence first and capabilities second.",
      whyEs:
        "99,55%, 34B+, 5,4B+ y 24/5 van arriba de sus leyendas y pesan más que el titular de la sección. La inversión es intencional: una plataforma de datos tiene que probar volumen antes de explicar funciones. Las tres columnas de servicios de abajo son más discretas, así que la sección se lee como evidencia primero y capacidades después.",
      noteEn:
        "The four numbers count up once when the strip enters the viewport and use tabular numerals, so their width never wobbles mid animation. The strip is separated by a single top rule rather than four boxes.",
      noteEs:
        "Los cuatro números cuentan una vez cuando la franja entra en pantalla y usan números tabulares, así que su ancho no tiembla a mitad de la animación. La franja se separa con una sola línea superior, no con cuatro cajas.",
    },
    {
      id: "data-hub",
      imageEn: "/work/customerup/en/03.png",
      imageEs: "/work/customerup/es/03.png",
      width: 2880,
      heightEn: 1568,
      heightEs: 1570,
      labelEn: "Data hub",
      labelEs: "Hub de datos",
      titleEn: "One diagram replaces a paragraph about architecture",
      titleEs: "Un diagrama reemplaza un párrafo sobre arquitectura",
      whyEn:
        "The section is mostly a single isometric drawing with three proof figures pinned above it. Inputs enter from the left, the hub sits in the middle, outputs leave to the right, so the architecture is legible before a line of copy is read. The figures at the top borrow the previous section's proof and apply it to the drawing.",
      whyEs:
        "La sección es casi un solo dibujo isométrico con tres cifras de prueba fijadas arriba. Las entradas llegan por la izquierda, el hub ocupa el centro y las salidas salen por la derecha, así que la arquitectura se entiende antes de leer una línea. Las cifras de arriba toman la prueba de la sección anterior y la aplican al dibujo.",
      noteEn:
        "The hub is built from SVG primitives with animated 1px signal paths, not a flat illustration. Labels sit on their own layer above the artboard, so a longer Spanish label cannot collide with the geometry.",
      noteEs:
        "El hub se construye con primitivas SVG y rutas de señal animadas de 1 px, no con una ilustración plana. Las etiquetas viven en su propia capa sobre el tablero, así que una etiqueta más larga en español no choca con la geometría.",
    },
    {
      id: "why-us",
      imageEn: "/work/customerup/en/04.png",
      imageEs: "/work/customerup/es/04.png",
      width: 2880,
      heightEn: 1950,
      heightEs: 1844,
      labelEn: "Why us",
      labelEs: "Por qué nosotros",
      titleEn: "A bento grid that admits it is a bento grid",
      titleEs: "Una retícula que admite que es una retícula",
      whyEn:
        "The heading and paragraph take the top band, then the proof splits into unequal tiles: a growth chart, two short claims, a timeline of three steps and a 12/12 figure. Unequal spans stop the eye from treating every claim as equal, which matters when one tile is a chart and another is a sentence. The 2026 figure is labelled as an estimate, not dressed up as actual revenue.",
      whyEs:
        "El titular y el párrafo ocupan la banda superior, y la prueba se divide en piezas desiguales: un gráfico de crecimiento, dos afirmaciones cortas, una línea de tres pasos y una cifra 12/12. Los tamaños distintos evitan que el ojo trate todas las afirmaciones por igual, lo que importa cuando una pieza es un gráfico y otra es una frase. La cifra 2026 se rotula como estimación, no se disfraza de ingreso real.",
      noteEn:
        "The growth chart is a real plot with 2025 and 2026 labels, not a decorative squiggle. Timeline steps are written as text, so translating '1 semana' cannot break a graphic with a fixed width.",
      noteEs:
        "El gráfico de crecimiento es un trazado real con etiquetas 2025 y 2026, no un garabato decorativo. Los pasos de la línea de tiempo son texto, así que traducir «1 semana» no rompe un gráfico de ancho fijo.",
    },
    {
      id: "problem",
      imageEn: "/work/customerup/en/05.png",
      imageEs: "/work/customerup/es/05.png",
      width: 2880,
      heightEn: 1614,
      heightEs: 1614,
      labelEn: "The problem",
      labelEs: "El problema",
      titleEn: "A failure chart with a time axis",
      titleEs: "Un gráfico de fallas con eje de tiempo",
      whyEn:
        "The section explains why batch data hurts: the chart runs from 8AM to midnight, annotates a midday delay and a night spike, and puts 2M+ lost events in the middle. Time is the argument, so the horizontal axis is the first thing the layout establishes. Three small notes underneath translate the shape into operational consequences.",
      whyEs:
        "La sección explica por qué los datos por lotes fallan: el gráfico corre de 8AM a medianoche, marca un retraso al mediodía y un pico en la noche, y pone 2M+ eventos perdidos en el centro. El tiempo es el argumento, así que el eje horizontal es lo primero que establece el layout. Tres notas pequeñas debajo traducen la forma en consecuencias operativas.",
      noteEn:
        "The labels sit directly on the plot near their data points instead of in a legend, which keeps the eye from travelling back and forth. The event count is DOM text, so it stays selectable and legible at any zoom.",
      noteEs:
        "Las etiquetas viven sobre el trazado, cerca de sus puntos, en vez de en una leyenda, lo que evita que el ojo viaje de ida y vuelta. El conteo de eventos es texto DOM, así que sigue seleccionable y legible con cualquier zoom.",
    },
    {
      id: "services",
      imageEn: "/work/customerup/en/06.png",
      imageEs: "/work/customerup/es/06.png",
      width: 2880,
      heightEn: 1662,
      heightEs: 1662,
      labelEn: "Services",
      labelEs: "Servicios",
      titleEn: "A lime panel inside a dark page",
      titleEs: "Un panel lima dentro de una página oscura",
      whyEn:
        "The services block is a single forest green panel inset into a lime band, with a photo on the left and a 2×2 grid on the right. The contrast reversal tells the reader this is the commercial turn of the page without another heading ornament. One card is lime because the primary offer needs different weight, not because the grid needed decoration.",
      whyEs:
        "El bloque de servicios es un solo panel verde bosque dentro de una banda lima, con una foto a la izquierda y una cuadrícula 2×2 a la derecha. La inversión de contraste avisa que aquí gira la página hacia lo comercial sin otro adorno en el titular. Una tarjeta es lima porque la oferta principal necesita otro peso, no porque la cuadrícula necesitara decoración.",
      noteEn:
        "The panel uses a 24px radius at desktop and 16px on mobile, and every card keeps a 126px minimum height so the arrow badges line up across rows. The photo fills its own frame, so a slow image never reflows the grid.",
      noteEs:
        "El panel usa radio de 24 px en escritorio y 16 px en móvil, y cada tarjeta mantiene 126 px de altura mínima para que las flechas alineen entre filas. La foto cubre su propio marco, así que una imagen lenta nunca reacomoda la cuadrícula.",
    },
  ],

  "kora-finance": [
    {
      id: "hero",
      imageEn: "/work/kora-finance/en/01.png",
      imageEs: "/work/kora-finance/es/01.png",
      width: 2880,
      heightEn: 1800,
      heightEs: 1800,
      labelEn: "Hero",
      labelEs: "Portada",
      titleEn: "Local rails, named in the headline",
      titleEs: "Rieles locales, nombrados en el titular",
      whyEn:
        "The headline names colones and SINPE instead of 'modern treasury', because the product only matters if the reader recognises their own banking rails. 'Colones' sits inside a pale pill, which is a local currency marker rather than a decorative highlight. The hero photograph of coins of 100 colones on moss carries the rest of the context.",
      whyEs:
        "El titular nombra colones y SINPE en vez de «tesorería moderna», porque el producto solo importa si el lector reconoce sus propios rieles bancarios. «Colones» va dentro de una píldora clara, que funciona como marca de moneda local y no como resaltado decorativo. La fotografía de monedas de 100 colones sobre musgo carga el resto del contexto.",
      noteEn:
        "The photograph is a single 2000×1117 JPEG, loaded eagerly and pinned to the bottom edge, so the coin field never reflows around the copy. The headline's two lines are authored spans with nowrap at desktop, which keeps 'y SINPE.' from wrapping alone.",
      noteEs:
        "La fotografía es un solo JPEG de 2000×1117, cargado de inmediato y fijado al borde inferior, así que el campo de monedas nunca reacomoda el texto. Las dos líneas del titular son spans escritos con nowrap en escritorio, lo que evita que «y SINPE.» quede sola.",
    },
    {
      id: "platform",
      imageEn: "/work/kora-finance/en/02.png",
      imageEs: "/work/kora-finance/es/02.png",
      width: 2880,
      heightEn: 1978,
      heightEs: 1978,
      labelEn: "Platform",
      labelEs: "Plataforma",
      titleEn: "The dashboard is the proof of the section",
      titleEs: "El panel es la prueba de la sección",
      whyEn:
        "Under a short heading, the page shows a full treasury dashboard with four accounts, totals in CRC and USD, and a spend bar filled to 18,4M of 25M. The numbers are specific and uneven on purpose: a real account does not carry round balances. Two feature blurbs sit below the mock, so the interface argues first and the copy annotates it.",
      whyEs:
        "Bajo un titular corto, la página muestra un panel de tesorería completo con cuatro cuentas, totales en CRC y USD y una barra de gasto llena hasta 18,4M de 25M. Los números son específicos y dispares a propósito: una cuenta real no tiene saldos redondos. Dos textos de funciones van debajo de la maqueta, así que la interfaz argumenta primero y el texto la anota.",
      noteEn:
        "Every figure in the mock uses tabular numerals, and the currency column is aligned to the right so decimal points stack. The account status is a small text label instead of a green pill, which keeps the panel from looking like a dashboard template.",
      noteEs:
        "Cada cifra de la maqueta usa números tabulares, y la columna de moneda se alinea a la derecha para que los decimales apilen. El estado de la cuenta es una etiqueta de texto pequeña en vez de una píldora verde, lo que evita que el panel parezca una plantilla de dashboard.",
    },
    {
      id: "flow",
      imageEn: "/work/kora-finance/en/03.png",
      imageEs: "/work/kora-finance/es/03.png",
      width: 2880,
      heightEn: 1688,
      heightEs: 1688,
      labelEn: "Flow",
      labelEs: "Flujo",
      titleEn: "A wiring diagram, not an explainer in three steps",
      titleEs: "Un diagrama de cableado, no un explicativo de tres pasos",
      whyEn:
        "The section draws the actual connections: banks on the left, Kora in the middle, SINPE, MONEX/BCCR and Hacienda on the right. Each node is labelled with the institution it represents, so the diagram doubles as an integration list. The copy is reduced to two lines because the topology is the explanation.",
      whyEs:
        "La sección dibuja las conexiones reales: bancos a la izquierda, Kora en el centro, SINPE, MONEX/BCCR y Hacienda a la derecha. Cada nodo está rotulado con la institución que representa, así que el diagrama también funciona como lista de integraciones. El texto se reduce a dos líneas porque la topología es la explicación.",
      noteEn:
        "Paths are 1px SVG strokes with small dashed pulses travelling toward Kora; the animation stops when the system asks for less motion. Node labels are HTML, so a bank name can grow in Spanish without redrawing the diagram.",
      noteEs:
        "Las rutas son trazos SVG de 1 px con pequeños pulsos discontinuos que viajan hacia Kora; la animación se detiene cuando el sistema pide menos movimiento. Las etiquetas de los nodos son HTML, así que un nombre de banco puede crecer en español sin redibujar el diagrama.",
    },
    {
      id: "ecosystem",
      imageEn: "/work/kora-finance/en/04.png",
      imageEs: "/work/kora-finance/es/04.png",
      width: 2880,
      heightEn: 1116,
      heightEs: 1116,
      labelEn: "Ecosystem",
      labelEs: "Ecosistema",
      titleEn: "Sixteen marks, two rows, one tooltip",
      titleEs: "Dieciséis marcas, dos filas, un tooltip",
      whyEn:
        "The integrations section shows the banks and services as a compact tile field instead of a grey logo wall with a legend. Hovering a tile reveals the full institution name, so the section can stay dense without hiding what each mark means. The copy stays at two lines; the names are the content.",
      whyEs:
        "La sección de integraciones muestra los bancos y servicios como un campo compacto de fichas en vez de un muro de logos grises con leyenda. Al pasar el cursor sobre una ficha aparece el nombre completo de la institución, así que la sección puede ser densa sin esconder qué significa cada marca. El texto se queda en dos líneas; los nombres son el contenido.",
      noteEn:
        "Two rows hold 16 tiles, each with a fixed square cell so a 1990s bank mark and a fintech mark of the 2020s do not fight over scale. The tooltip waits on the first hover and then opens at once on its neighbours, so scanning the grid does not feel twitchy.",
      noteEs:
        "Dos filas sostienen 16 fichas, cada una con una celda cuadrada fija para que una marca bancaria de los 90 y una fintech de 2020 no peleen por escala. El tooltip usa el patrón de retraso en el primer hover y apertura instantánea en los vecinos, así que recorrer la cuadrícula no se siente nervioso.",
    },
    {
      id: "compliance",
      imageEn: "/work/kora-finance/en/05.png",
      imageEs: "/work/kora-finance/es/05.png",
      width: 2880,
      heightEn: 1658,
      heightEs: 1658,
      labelEn: "Compliance",
      labelEs: "Cumplimiento",
      titleEn: "Regulation as a feature row",
      titleEs: "La regulación como fila de funciones",
      whyEn:
        "Three figures carry the section: 100% SUGEF traceability, 99,99% TLS 1.3, 16+ banks and cooperatives. Each one is a compliance claim a finance lead can repeat in a meeting, which is more useful than another paragraph about security. The heading stays short and the stat labels do the qualifying.",
      whyEs:
        "Tres cifras cargan la sección: 100% trazabilidad SUGEF, 99,99% TLS 1.3, 16+ bancos y cooperativas. Cada una es una afirmación de cumplimiento que un responsable financiero puede repetir en una reunión, más útil que otro párrafo sobre seguridad. El titular se mantiene corto y las leyendas de las cifras califican.",
      noteEn:
        "The three figures share a row and a baseline; captions may wrap to two lines instead of shrinking the number. No shield icons or badge graphics: the numbers are the badge.",
      noteEs:
        "Las tres cifras comparten fila y línea base; las leyendas pueden ocupar dos líneas en vez de encoger el número. Sin iconos de escudo ni gráficos de insignia: los números son la insignia.",
    },
    {
      id: "pricing",
      imageEn: "/work/kora-finance/en/06.png",
      imageEs: "/work/kora-finance/es/06.png",
      width: 2880,
      heightEn: 2140,
      heightEs: 2116,
      labelEn: "Pricing",
      labelEs: "Precios",
      titleEn: "Three plans, one recommended",
      titleEs: "Tres planes, uno recomendado",
      whyEn:
        "The middle plan gets the emphasis through a stronger border and a label, not through scale or a badge explosion. Each card lists what changes between tiers, the bank count, team seats and ERP access, so the upgrade decision is readable without a comparison table. Monthly and annual sit as a two state switch above the cards.",
      whyEs:
        "El plan del medio recibe el énfasis con un borde más fuerte y una etiqueta, no con escala ni una explosión de insignias. Cada tarjeta lista lo que cambia entre niveles, cantidad de bancos, miembros del equipo y acceso a ERP, así que la decisión de subir de plan se lee sin tabla comparativa. Mensual y anual viven como un interruptor de dos estados sobre las tarjetas.",
      noteEn:
        "The recommended card is one step lighter and one border stronger; its CTA is the only filled button in the row. Feature lists share a fixed leading, so the three cards end at different heights instead of being padded into false symmetry.",
      noteEs:
        "La tarjeta recomendada es un paso más clara y un borde más fuerte; su CTA es el único botón relleno de la fila. Las listas comparten un interlineado fijo, así que las tres tarjetas terminan a distinta altura en vez de rellenarse hasta una simetría falsa.",
    },
  ],

  "alder-psicologia": [
    {
      id: "hero",
      imageEn: "/work/alder-psicologia/en/01.png",
      imageEs: "/work/alder-psicologia/es/01.png",
      width: 2880,
      heightEn: 1240,
      heightEs: 1240,
      labelEn: "Hero",
      labelEs: "Portada",
      titleEn: "Clinical proof below the first sentence",
      titleEs: "Prueba clínica debajo de la primera frase",
      whyEn:
        "The headline is warm, but the three panels underneath are clinical artifacts: a portrait, a PHQ9 outcome dial at 86% and a weekly mood tracker. That combination answers the quiet question a therapy client actually has before the copy asks for a booking: is this a real practice? The dark forest background gives the cards enough contrast to read as instruments.",
      whyEs:
        "El titular es cálido, pero los tres paneles de abajo son artefactos clínicos: un retrato, un dial de resultados PHQ9 al 86% y un seguimiento semanal del ánimo. Esa combinación responde, antes de que el texto pida una cita, la pregunta silenciosa de un paciente: ¿esto es una práctica real? El fondo verde bosque da a las tarjetas suficiente contraste para leerse como instrumentos.",
      noteEn:
        "The outcome dial is an SVG ring of 34 dots with five ticks and a carousel of five quotes; 86% is the resting state, not a single figure. The portrait is grayscale with a contrast filter, so it does not pull focus from the data.",
      noteEs:
        "El dial de resultados es un anillo SVG de 34 puntos con cinco marcas y un carrusel de cinco citas; 86% es el estado inicial, no una cifra aislada. El retrato va en escala de grises con filtro de contraste, así que no le roba foco a los datos.",
    },
    {
      id: "services",
      imageEn: "/work/alder-psicologia/en/02.png",
      imageEs: "/work/alder-psicologia/es/02.png",
      width: 2880,
      heightEn: 1496,
      heightEs: 1538,
      labelEn: "Services",
      labelEs: "Servicios",
      titleEn: "Modality and duration before the pitch",
      titleEs: "Modalidad y duración antes de la venta",
      whyEn:
        "Each service column states who it is for, then the format and the session length. That is the order a hesitant client needs: individual, couple or online first; 50 or 60 minutes second; CTA last. Three columns is enough here because the options really are three, not because the grid template had three slots.",
      whyEs:
        "Cada columna de servicio dice para quién es, luego el formato y la duración. Ese es el orden que necesita alguien indeciso: individual, pareja o en línea primero; 50 o 60 minutos después; el CTA al final. Tres columnas bastan porque las opciones realmente son tres, no porque la plantilla tuviera tres espacios.",
      noteEn:
        "The duration shares a line with the CTA, so the two facts a client compares sit together. The cards use different editorial backdrops (rings, an arch, a wave) drawn as inline SVG, which keeps the three modalities distinct without three icon boxes.",
      noteEs:
        "La duración comparte línea con el CTA, así que los dos datos que un paciente compara quedan juntos. Las tarjetas usan fondos editoriales distintos (anillos, un arco, una onda) dibujados como SVG en línea, lo que distingue las tres modalidades sin tres cajas de iconos.",
    },
    {
      id: "approach",
      imageEn: "/work/alder-psicologia/en/03.png",
      imageEs: "/work/alder-psicologia/es/03.png",
      width: 2880,
      heightEn: 1366,
      heightEs: 1324,
      labelEn: "Approach",
      labelEs: "Enfoque",
      titleEn: "Four modalities, one open at a time",
      titleEs: "Cuatro modalidades, una abierta a la vez",
      whyEn:
        "TCC, ACT, EMDR and MBCT are shown as four tabs with an underline, and only one explanation is visible. A therapy seeker does not need all four methods at once; they need to know the practice can choose. The lavender panel keeps the clinical detail from turning into a textbook page.",
      whyEs:
        "TCC, ACT, EMDR y MBCT aparecen como cuatro pestañas con subrayado, y solo una explicación está visible. Quien busca terapia no necesita los cuatro métodos a la vez; necesita saber que la práctica puede elegir. El panel lavanda evita que el detalle clínico se vuelva una página de manual.",
      noteEn:
        "The active tab is marked by a 2px underline instead of a filled pill, so the four codes stay equally readable. The panel swaps an illustration and a short block of focus and cadence; no accordion, no hidden tabs.",
      noteEs:
        "La pestaña activa se marca con un subrayado de 2 px en vez de una píldora rellena, así que los cuatro códigos siguen igual de legibles. El panel cambia una ilustración y un bloque corto de enfoque y ritmo; sin acordeón ni pestañas escondidas.",
    },
    {
      id: "team",
      imageEn: "/work/alder-psicologia/en/04.png",
      imageEs: "/work/alder-psicologia/es/04.png",
      width: 2880,
      heightEn: 1390,
      heightEs: 1468,
      labelEn: "Team",
      labelEs: "Equipo",
      titleEn: "Four faces, four specialities",
      titleEs: "Cuatro rostros, cuatro especialidades",
      whyEn:
        "Portraits are cropped to the same ratio and the bios are limited to two or three lines, so the section reads as a team rather than a set of personal brands. Each speciality is specific (couples, burnout, trauma and EMDR, sleep), which lets a reader self select. The heading carries the reassurance; the cards carry the credentials.",
      whyEs:
        "Los retratos se recortan a la misma proporción y las biografías se limitan a dos o tres líneas, así que la sección se lee como un equipo y no como un conjunto de marcas personales. Cada especialidad es concreta (pareja, desgaste laboral, trauma y EMDR, sueño), lo que permite que el lector se identifique. El titular da la tranquilidad; las tarjetas dan las credenciales.",
      noteEn:
        "The four images fill a fixed frame, so a landscape portrait and a studio portrait still line up. Names, roles and specialities are DOM text, not baked into the photo.",
      noteEs:
        "Las cuatro imágenes cubren un marco fijo, así que un retrato horizontal y uno de estudio siguen alineados. Los nombres, cargos y especialidades son texto DOM, no están dentro de la foto.",
    },
    {
      id: "testimonials",
      imageEn: "/work/alder-psicologia/en/05.png",
      imageEs: "/work/alder-psicologia/es/05.png",
      width: 2880,
      heightEn: 1378,
      heightEs: 1378,
      labelEn: "Testimonials",
      labelEs: "Testimonios",
      titleEn: "Anonymity is stated, then respected",
      titleEs: "El anonimato se declara y se respeta",
      whyEn:
        "The line above the quotes says the stories are shared with permission and anonymised for privacy, and the cards use initials instead of names or stock faces. That removes the usual testimonial theatre. Each quote also names the modality and the number of sessions, which makes the result checkable rather than magical.",
      whyEs:
        "La línea sobre las citas dice que las historias se comparten con permiso y se anonimizan por privacidad, y las tarjetas usan iniciales en vez de nombres o rostros de stock. Eso elimina el teatro habitual del testimonio. Cada cita también nombra la modalidad y el número de sesiones, lo que hace el resultado verificable en vez de mágico.",
      noteEn:
        "The disclaimer is set at the same size as the quote metadata, not in 10px legal type, because it is part of the argument. The cards use 1px rules and no illustration of quotation marks.",
      noteEs:
        "El aviso usa el mismo tamaño que los metadatos de la cita, no letra legal de 10 px, porque es parte del argumento. Las tarjetas usan líneas de 1 px y ninguna ilustración de comillas.",
    },
    {
      id: "mood-check",
      imageEn: "/work/alder-psicologia/en/06.png",
      imageEs: "/work/alder-psicologia/es/06.png",
      width: 2880,
      heightEn: 1180,
      heightEs: 1180,
      labelEn: "Mood check",
      labelEs: "Registro de ánimo",
      titleEn: "One question, four answers",
      titleEs: "Una pregunta, cuatro respuestas",
      whyEn:
        "The closing section turns the intake into a single question, how have you felt this week, with four mood options and percentages. It demonstrates the patient portal without asking the visitor to imagine it. The voseo in 'sentís' is deliberate: this is Costa Rican Spanish, not a neutral translation.",
      whyEs:
        "La sección de cierre convierte la admisión en una sola pregunta, cómo te has sentido esta semana, con cuatro estados de ánimo y porcentajes. Demuestra el portal del paciente sin pedirle al visitante que lo imagine. El voseo en «sentís» es deliberado: es español costarricense, no una traducción neutra.",
      noteEn:
        "The check in sits inside a lavender arch built from CSS borders and a large top radius, with three mood buttons on the perimeter. Choosing one updates all four percentages at once; the widget previews the portal, and the numbers are demo data.",
      noteEs:
        "El registro vive dentro de un arco lavanda construido con bordes CSS y un radio superior grande, con tres botones de ánimo en el perímetro. Elegir uno actualiza los cuatro porcentajes a la vez; el widget muestra el portal y las cifras son datos de demostración.",
    },
  ],

  "mp-legal": [
    {
      id: "hero",
      imageEn: "/work/mp-legal/en/01.png",
      imageEs: "/work/mp-legal/es/01.png",
      width: 2880,
      heightEn: 1800,
      heightEs: 1800,
      labelEn: "Hero",
      labelEs: "Portada",
      titleEn: "The promise is written as a sentence, not a slogan",
      titleEs: "La promesa está escrita como frase, no como eslogan",
      whyEn:
        "The hero gives four lines to 'we protect and preserve what you built' and very little else. That restraint is the positioning: a private advisory firm does not need feature bullets on the first screen. The bronze Themis statue at the right edge carries the legal register without another icon or badge.",
      whyEs:
        "El hero dedica cuatro líneas a «protegemos y preservamos lo que usted construyó» y muy poco más. Esa contención es el posicionamiento: una firma de asesoría privada no necesita viñetas de funciones en la primera pantalla. La estatua de bronce de Temis en el borde derecho carga el registro legal sin otro icono ni insignia.",
      noteEn:
        "The headline is capped at 13ch and only 'preservamos' switches to the italic serif, at 1.08em. The statue is one 896×1200 PNG with a sepia filter, so it inherits the garnet background instead of competing with it.",
      noteEs:
        "El titular se limita a 13ch y solo «preservamos» cambia a la serif itálica, a 1.08em. La estatua es un solo PNG de 896×1200 con filtro sepia, así que hereda el fondo granate en vez de competir con él.",
    },
    {
      id: "about",
      imageEn: "/work/mp-legal/en/02.png",
      imageEs: "/work/mp-legal/es/02.png",
      width: 2880,
      heightEn: 2190,
      heightEs: 2274,
      labelEn: "About",
      labelEs: "Nosotros",
      titleEn: "A quiet paragraph and three hard numbers",
      titleEs: "Un párrafo tranquilo y tres números duros",
      whyEn:
        "The about section spends one paragraph on the firm's history, then puts 31 years, 2,700+ clients and 70+ specialists on a single line. For private clients, longevity and client count are the actual product; the copy would be less convincing without them. The CTA stays a text link because the section is still building trust.",
      whyEs:
        "La sección de nosotros dedica un párrafo a la historia de la firma y luego pone 31 años, 2.700+ clientes y 70+ especialistas en una sola línea. Para clientes privados, la trayectoria y la cantidad de clientes son el producto real; el texto sería menos convincente sin ellas. El CTA sigue siendo un enlace de texto porque la sección todavía construye confianza.",
      noteEn:
        "The stats sit below a top rule, separated by vertical rules of 1px, with tabular numerals and units set at 16px so 'años' never competes with '31'. The numbers use the same garnet as the headings, which keeps the section in one colour family.",
      noteEs:
        "Las cifras van debajo de una línea superior, separadas por líneas verticales de 1 px, con números tabulares y unidades a 16 px para que «años» nunca compita con «31». Los números usan el mismo granate que los titulares, lo que mantiene la sección en una sola familia de color.",
    },
    {
      id: "practice-areas",
      imageEn: "/work/mp-legal/en/03.png",
      imageEs: "/work/mp-legal/es/03.png",
      width: 2880,
      heightEn: 1690,
      heightEs: 1688,
      labelEn: "Practice areas",
      labelEs: "Áreas de práctica",
      titleEn: "Four topics in one row, no accordion",
      titleEs: "Cuatro temas en una fila, sin acordeón",
      whyEn:
        "Four practice areas share one row, each with a 4:3 dark image, a top rule of 1px and a description of three lines naming the actual instruments: BCCR reports, SINPE and MONEX transfers, succession protocols, foreign account structures. The density is the point: this reader is evaluating competence, not browsing. 'Conocer más' repeats in every cell so the row stays scannable.",
      whyEs:
        "Cuatro áreas de práctica comparten una fila, cada una con una imagen oscura 4:3, una línea superior de 1 px y una descripción de tres líneas que nombra los instrumentos reales: reportes al BCCR, transferencias SINPE y MONEX, protocolos sucesorios, estructuras de cuentas en el exterior. La densidad es el punto: este lector evalúa competencia, no pasea. «Conocer más» se repite en cada celda para que la fila siga siendo escaneable.",
      noteEn:
        "At 1080px the four columns fold to a 2×2 grid, then to one column at 600px; the images keep their 4:3 ratio at every step. Hover scale is limited to the image inside the frame, so the text never moves.",
      noteEs:
        "A 1080 px las cuatro columnas pasan a una cuadrícula 2×2, y a una columna a 600 px; las imágenes mantienen su proporción 4:3 en cada paso. El zoom al pasar el cursor se limita a la imagen dentro del marco, así que el texto nunca se mueve.",
    },
    {
      id: "videos-faq",
      imageEn: "/work/mp-legal/en/04.png",
      imageEs: "/work/mp-legal/es/04.png",
      width: 2880,
      heightEn: 2102,
      heightEs: 2102,
      labelEn: "Videos + FAQ",
      labelEs: "Videos + preguntas",
      titleEn: "Short answers, with the runtime printed",
      titleEs: "Respuestas cortas, con la duración impresa",
      whyEn:
        "Two video cards show 08:42 and 11:15 before the play button, so the visitor knows the cost of watching. The FAQ sits below them in two dual tone cards, with the question in larger type than the answer. It is the same editorial logic as the rest of the page: state the commitment before asking for attention.",
      whyEs:
        "Dos tarjetas de video muestran 08:42 y 11:15 antes del botón de reproducción, así que el visitante sabe cuánto cuesta mirar. Las preguntas frecuentes van debajo en dos tarjetas de doble tono, con la pregunta en tipo mayor que la respuesta. Es la misma lógica editorial del resto de la página: declarar el compromiso antes de pedir atención.",
      noteEn:
        "Thumbnails keep a 16:9 frame with the duration in the corner, and the play control is a real button with an accessible name. The FAQ cards carry a faint 300×300 mesh SVG instead of an icon set.",
      noteEs:
        "Las miniaturas mantienen un marco 16:9 con la duración en la esquina, y el control de reproducción es un botón real con nombre accesible. Las tarjetas de preguntas llevan una malla SVG tenue de 300×300 en vez de un set de iconos.",
    },
    {
      id: "regional-network",
      imageEn: "/work/mp-legal/en/05.png",
      imageEs: "/work/mp-legal/es/05.png",
      width: 2880,
      heightEn: 1652,
      heightEs: 1544,
      labelEn: "Regional network",
      labelEs: "Red regional",
      titleEn: "A map that doubles as a directory",
      titleEs: "Un mapa que también es un directorio",
      whyEn:
        "The map labels Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica and Panama, then a card lists the Costa Rican banks. That combination answers both 'how far do you reach' and 'who do you actually work with'. Costa Rica gets the detail because it is the home market; the rest of the region gets a name and a pin.",
      whyEs:
        "El mapa rotula Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica y Panamá, y una tarjeta lista los bancos costarricenses. Esa combinación responde tanto «hasta dónde llegan» como «con quién trabajan de verdad». Costa Rica recibe el detalle porque es el mercado base; el resto de la región recibe un nombre y un punto.",
      noteEn:
        "The map is projected from the world atlas TopoJSON with d3 at 720×460, and pins are projected from lon and lat; clicking a pin swaps the jurisdiction card without leaving the page. Only the six Central American countries are highlighted, so the rest of the world stays as quiet context.",
      noteEs:
        "El mapa se proyecta desde el TopoJSON del atlas mundial con d3 a 720×460, y los puntos se proyectan desde longitud y latitud; al hacer clic en un punto cambia la tarjeta de jurisdicción sin salir de la página. Solo los seis países de Centroamérica se resaltan, así que el resto del mundo queda como contexto discreto.",
    },
    {
      id: "news",
      imageEn: "/work/mp-legal/en/06.png",
      imageEs: "/work/mp-legal/es/06.png",
      width: 2880,
      heightEn: 1590,
      heightEs: 1588,
      labelEn: "News",
      labelEs: "Noticias",
      titleEn: "Date first, headline second",
      titleEs: "Fecha primero, titular después",
      whyEn:
        "The news section uses date led rows instead of image cards, which keeps the focus on the argument in each article. Three pieces are enough to suggest an active practice without pretending to be a media site. 'Ver todas las noticias' sits at the top right, where a reader who already trusts the firm will find it.",
      whyEs:
        "La sección de noticias usa filas guiadas por fecha en vez de tarjetas con imagen, lo que mantiene el foco en el argumento de cada artículo. Tres piezas bastan para sugerir una práctica activa sin pretender ser un medio. «Ver todas las noticias» va arriba a la derecha, donde lo encuentra quien ya confía en la firma.",
      noteEn:
        "Each row is a date column, a 220×135 thumbnail, a column with the title and excerpt, and an arrow at the far right; the date leads the reading order. On mobile the columns stack and the excerpt clamps, so the list stays scannable without horizontal scroll.",
      noteEs:
        "Cada fila es una columna de fecha, una miniatura de 220×135, una columna con el titular y el extracto, y una flecha al extremo derecho; la fecha abre el orden de lectura. En móvil las columnas se apilan y el extracto se recorta, así que la lista sigue escaneable sin desplazamiento horizontal.",
    },
  ],
};

export function getWorkSections(slug?: string): WorkSection[] {
  if (!slug) return [];
  return WORK_SECTIONS[slug] ?? [];
}
