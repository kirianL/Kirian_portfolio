---
title: "Rendimiento web más allá del 100 en Lighthouse"
description: "Sacar 100 en Lighthouse es el punto de partida, no la meta. La velocidad real depende del peso de assets, CSS crítico y cero saltos de layout."
date: "August 18, 2026"
category: "Rendimiento"
image: "/blog/cover-web-performance.jpg"
---

Lograr 100 en las cuatro categorías de Lighthouse se siente bien, hasta que abres tu sitio en una conexión 4G real y ves cómo una imagen hero de 1.7 MB frena el primer pintado mientras las fuentes parpadean dos veces.

Los puntajes sintéticos miden un laboratorio ideal. Tus usuarios navegan con latencia variable, cachés fríos y teléfonos de gama media.

---

## Auditar bytes antes de optimizar código

Antes de implementar estrategias complejas de caché, revisa qué viaja realmente por la red:

- **Imágenes**: Una portada sin comprimir puede pesar 20 veces más que todo tu JavaScript junto. Redimensiona al ancho máximo real, apunta a `< 200 KB` y declara siempre `width` y `height`.
- **Fuentes**: Elimina formatos heredados como `.eot`, `.ttf` o `.woff`. Hoy basta con `.woff2`, y una fuente variable suele reemplazar seis archivos estáticos.
- **Scripts de terceros**: Carga analíticas de forma asíncrona para que no compitan con el hilo principal al arrancar la página.

---

## Dejar que el CSS crítico se integre automáticamente

Desactivar por completo el *inlining* de hojas de estilo obliga al navegador a esperar un viaje extra de red antes de pintar el primer frame. Permitir que el framework integre estilos pequeños de forma automática reduce el bloqueo inicial sin inflar el HTML.

---

## La velocidad percibida también cuenta

Combinar *prefetch* al pasar el cursor (`data-astro-prefetch`) con *View Transitions* hace que navegar entre páginas se sienta inmediato. El rendimiento real no se mide solo en milisegundos de un gráfico: se siente en la respuesta instantánea tras cada clic.
