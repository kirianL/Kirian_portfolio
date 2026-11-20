---
title: "Sistemas de diseño que escalan: tokens, restricciones y criterio"
description: "Por qué la mayoría de sistemas de diseño colapsan bajo sus propias variantes y cómo las capas de tokens mantienen la coherencia."
date: "July 4, 2026"
category: "Sistemas de Diseño"
image: "/blog/cover-design-systems.jpg"
---

La mayoría de sistemas de diseño no fallan por falta de componentes. Fallan porque cada nueva funcionalidad añade una prop de excepción, un espaciado arbitrario o un tono de gris casi idéntico al resto del producto, pero distinto.

Después de construir librerías de UI entre proyectos con Next.js y Astro, el patrón se repite: un sistema de diseño solo escala cuando **respetar las restricciones cuesta menos que improvisar excepciones**.

---

## Separar la paleta base de la intención semántica

Un error frecuente es usar pasos de color crudos directamente en cada componente. En cuanto aparece el modo oscuro o una segunda capa de superficie, cada archivo se llena de condicionales.

La salida limpia es dividir los tokens en dos capas:

1. **Escala base**: pasos calibrados (`grayscale-1` a `grayscale-12`) que garantizan contraste.
2. **Roles semánticos**: superficie, borde estructural, texto secundario, texto principal y estado de foco.

Cuando una tarjeta usa una superficie semántica y un contorno neutro de `1px` (`oklch(0 0 0 / 0.1)` en claro y `oklch(1 0 0 / 0.1)` en oscuro), cambiar de tema es intercambiar variables, no reescribir componentes.

---

## Radios concéntricos y profundidad

Pocas cosas delatan tan rápido una interfaz apresurada como radios de borde desalineados. Si una tarjeta exterior tiene `20px` de radio y `10px` de padding, la imagen interior debe tener `10px`: `radioExterior = radioInterior + padding`.

De la misma forma, reserva los bordes para **estructura** (separadores, inputs, estados activos) y usa sombras transparentes en capas para **elevación**.

---

## Mantener las variantes simples

Un botón no necesita doce variantes. Cuatro tamaños, tres intenciones y un estado de foco accesible cubren el 98% de una aplicación real. El 2% restante se resuelve componiendo, no inflando el API del componente.
