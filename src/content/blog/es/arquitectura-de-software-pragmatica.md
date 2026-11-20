---
title: "Arquitectura de software pragmática: límites claros antes que burocracia"
description: "Una buena arquitectura no consiste en cinco capas de abstracción para un CRUD, sino en trazar límites donde el cambio realmente ocurre."
date: "September 22, 2026"
category: "Arquitectura"
image: "/blog/cover-software-architecture.jpg"
---

Es muy tentador empezar un proyecto creando repositorios, servicios, mapeadores de DTOs y buses de eventos antes de que un solo usuario pruebe el producto. Seis meses después, agregar un campo a un formulario obliga a editar siete archivos distintos.

La arquitectura pragmática optimiza para **cambiar lo importante sin fricción**, no para impresionar en un diagrama.

---

## Trazar límites donde existe volatilidad

Todo sistema tiene dos tipos de código: reglas propias del producto y detalles de infraestructura (proveedores de correo, Redis, pasarelas de pago) que conviene aislar para probar o reemplazar sin dolor.

Encapsular integraciones externas detrás de utilidades pequeñas —como un *rate limiter* único o un módulo centralizado de metadatos SEO— te da puntos de extensión limpios sin sobre-ingenierizar rutas internas.

---

## Validar en la frontera, confiar en el núcleo

Los endpoints públicos son el perímetro de tu sistema. Valida tipos y longitudes estrictamente, escapa HTML antes de interpolar datos en correos y aplica límites de peticiones antes de consumir recursos externos.

Una vez que los datos cruzan esa frontera validados, el resto del código se mantiene corto, legible y libre de comprobaciones repetitivas.

---

## Eliminar código antes de abstraerlo

La duplicación es más barata que una abstracción equivocada. Espera a ver el mismo patrón en tres contextos reales antes de extraer un módulo compartido, y cuando lo hagas, mantén su interfaz lo más pequeña posible.
