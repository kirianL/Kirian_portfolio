---
title: "Micro-interacciones con propósito: feedback táctil sin ruido visual"
description: "El mejor movimiento casi no se nota: mantiene la continuidad espacial, confirma la intención al hacer clic y nunca frena al usuario."
date: "November 2, 2026"
category: "Ingeniería UI"
image: "/blog/cover-micro-interactions.jpg"
---

Cuando la animación se usa como adorno, la interfaz se siente lenta. Nadie quiere esperar 600ms a que una tarjeta rebote cada vez que pasa el cursor por encima.

Cuando el movimiento se usa como **comunicación espacial**, desaparece de la vista consciente y hace que el software se sienta físico y preciso.

---

## Transicionar solo lo que cambia, nunca `transition: all`

Usar `transition: all` obliga al navegador a vigilar propiedades de layout y color al mismo tiempo. Es mucho más limpio declarar exactamente qué cambia:

- `transform` y `opacity` para animar en GPU sin repintados.
- Una curva decidida como `cubic-bezier(0.2, 0, 0, 1)` que arranca rápido y asienta suave.
- Un sutil `scale(0.96)` al presionar botones para dar confirmación táctil inmediata.

---

## Continuidad entre páginas

Nada rompe tanto la inmersión como hacer clic en un artículo, ver un parpadeo de pantalla y que la misma imagen aparezca de golpe en otro tamaño.

Usar *View Transitions* compartidas (`transition:name`) con la misma proporción `16:9` tanto en la tarjeta como en la cabecera del artículo permite que la portada viaje suavemente a su lugar final sin brincos.

---

## La moderación es la clave

Las interacciones frecuentes deben responder en `150ms` o menos, y todo cambio animado debe conservar una señal estática (color, borde o icono) para que siga funcionando igual de bien con `prefers-reduced-motion`.
