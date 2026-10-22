---
title: "Digitalizing a Cultural Identity: The Challenge of Doing Justice to Limón on a Website"
description: "How to represent the cultural richness of Limón on an interactive web platform without simplifying its history and social context."
date: "June 13, 2026"
category: "Culture / Design"
image: "/blog-limon-identity.jpg"
---

As a web developer, I am used to solving technical problems. I think about performance, information architecture, user experience, accessibility, and scalability. However, when I started working on a digital proposal inspired by Limón, I discovered that the most complex challenge had nothing to do with code.

The question that ended up guiding the entire project was much more difficult:

> How do you represent an entire cultural identity within a website without reducing it to a mere set of photographs, colors, and texts?

Limón is not just a province of Costa Rica. It is history, migration, resistance, music, gastronomy, language, collective memory, and community. And when I began to investigate how it was represented digitally, I found a concerning reality: there is a huge gap between the cultural richness of Limón and the way it appears on the internet.

---

## The Problem: A Cultural Identity Hard to Find Online

If someone searches for information about Limonense culture today, they will likely find scattered articles, institutional publications, tourist content, or isolated historical references. What is hard to find is a digital experience that allows one to truly understand what it means to live in the Costa Rican Caribbean.

This is paradoxical considering the province's historical and cultural relevance.

According to the [National Institute of Statistics and Censuses (INEC)](https://admin.inec.cr/sites/default/files/2023-07/INFOGRAFIA_ESTIM_POB_VIV_2022_LIMON.pdf), Limón has an estimated population of 470,383 inhabitants for 2022.

Furthermore, according to data from the [United Nations Development Programme (UNDP)](https://pnud-conocimiento.cr/wp-content/uploads/2022/06/Ficha-tecnica-Limon-Folleto-imprimible.pdf), Limón concentrates the highest percentage of the country's Afro-descendant population, with approximately 23% of people identifying as Afro-descendant or Mulatto.

### Limón in Figures

| Indicator                  | Data               |
| -------------------------- | ------------------ |
| Estimated population (2022)| 470,383 inhabitants|
| Women                      | 52%                |
| Men                        | 48%                |
| Afro-descendant population | 23%                |
| Cantons                    | 6                  |

<div class="not-prose my-8 p-6 rounded-xl border border-grayscale-3 dark:border-grayscale-3/50 bg-grayscale-2/40 dark:bg-black/30 backdrop-blur-sm flex flex-col gap-5">
  <div class="flex items-center justify-between border-b border-grayscale-3/80 dark:border-grayscale-3/30 pb-3 text-[10px] font-mono tracking-widest uppercase text-grayscale-10">
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-accent-9 animate-pulse"></span>
      <span class="text-grayscale-12 font-medium">TELEMETRY // DEMO-07-LIMON</span>
    </div>
    <span>CENSUS DATA // INEC</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
    <div class="md:col-span-5 flex flex-col gap-2">
      <div class="text-[10px] font-mono uppercase tracking-wider text-grayscale-10">Afro-descendant Identity</div>
      <div class="flex items-baseline gap-2">
        <span class="text-4xl sm:text-5xl font-mono font-bold text-accent-9 tracking-tight">23.0%</span>
        <span class="text-xs font-mono text-grayscale-11 font-medium">/ 108,188 people</span>
      </div>
      <p class="text-xs text-grayscale-11 leading-relaxed mt-1">
        Limón concentrates the highest percentage of Afro-descendant & Mulatto population in Costa Rica, shaping the nation's maritime, musical, and linguistic heritage.
      </p>
    </div>

    <div class="md:col-span-7 flex flex-col gap-3 bg-white dark:bg-[#16171d] p-4 rounded-lg border border-grayscale-3/60 dark:border-grayscale-3/40">
      <div class="flex items-center justify-between text-[9px] font-mono uppercase text-grayscale-10">
        <span>POPULATION DENSITY MATRIX (1 NODE = 1%)</span>
        <span class="text-accent-9 font-semibold">23 NODES HIGHLIGHTED</span>
      </div>
      <div class="grid grid-cols-10 gap-1.5 py-1">
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-accent-9 shadow-[0_0_6px_rgba(235,94,40,0.4)]"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
        <div class="h-3 rounded-xs bg-grayscale-3 dark:bg-grayscale-3/40"></div>
      </div>
      <div class="flex items-center justify-between text-[10px] font-mono text-grayscale-10 pt-1 border-t border-grayscale-3/40 dark:border-grayscale-3/20">
        <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-xs bg-accent-9"></span><span>23% Afro-descendants</span></div>
        <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-xs bg-grayscale-4 dark:bg-grayscale-3/60"></span><span>77% Rest of population</span></div>
      </div>
    </div>
  </div>

  <div class="text-[9px] font-mono text-grayscale-10 flex items-center justify-between border-t border-grayscale-3/60 dark:border-grayscale-3/20 pt-2">
    <span>SOURCE: NATIONAL INSTITUTE OF STATISTICS & CENSUSES (INEC)</span>
    <span>CONFIDENCE: 95%</span>
  </div>
</div>

However, when comparing these figures with the number of digital projects dedicated to documenting Limonense identity, the contrast is stark.

---

## When Others Also Tried

During my research, I discovered that the problem is not that no one has tried to digitally preserve Limón's culture. In fact, there are significant efforts from academia and research.

One of the most interesting is the project on [intangible cultural heritage](https://orion.tec.ac.cr/en/publications/patrimonio-inmaterial-recursos-del-patrimonio-inmaterial-lim%C3%B3n-co/) developed by researchers from the Instituto Tecnológico de Costa Rica (TEC), focused on documenting and visualizing the province's heritage resources.

I also found the interactive project [... and Anancy arrived with them...](https://tecdigital.tec.ac.cr/servicios/cv-recursos/html/anancy/), an educational initiative by TEC that allows users to explore aspects of Costa Rican Afro-Caribbean culture through an immersive digital experience.

The interesting thing about this project is that it is not limited to displaying information.

It uses narrative, illustration, history, and interactive elements to transmit culture.

And that is where an important conclusion emerged:

> Culture should not feel like a database. It should feel like an experience.

However, even these efforts face a common challenge: keeping community participation alive and preventing culture from being reduced to a static digital archive.

---

## The Challenge: Designing Without Simplifying

One of the greatest risks when building a cultural website is falling into simplification.

It is easy to represent Limón through:

* Exotic beaches.
* Rice and Beans.
* Calypso music.
* Carnival parades.

But Limón is much more than that.

Its history is deeply connected to the construction of the Atlantic Railroad, Caribbean migrations, banana production, port development, and the evolution of entire communities that helped build Costa Rica.

Reducing all that complexity to three or four visual symbols would be unfair.

That is why the project stopped being just about design.

It began to be about representation.

The question was no longer how to make an attractive page, but how to do justice to a cultural identity.

---

## An Unexpected Source: Collective Memory

An important part of the research did not come solely from official documents or academic publications.

It also emerged from conversations, historical photographs, and stories shared by people who lived through different stages of the province.

One of the most valuable spaces for understanding this collective memory was the Facebook group [Mi Limón de Ayer](https://www.facebook.com/share/g/1CeUp5KFKT/) (My Limón of Yesterday).

Beyond functioning as a digital community, this group acts as a living archive where hundreds of people share:

* Historical family and architectural photographs.
* Oral stories and anecdotes from traditional neighborhoods.
* Memories of old Port Limón and its docks.
* Stories about everyday traditions and customs.

Although these posts do not replace academic sources or official statistics, they do bring something that reports rarely capture:

> The way people remember and feel their own history.

And when the goal is to represent culture, that human dimension is just as important as any statistical data.

---

## Design Decisions

After all the research, I understood that every visual element carried a cultural weight.

### Colors

The palette was inspired by real elements of the province:

* Blue of the Caribbean Sea.
* Tropical vegetation green.
* Sand tones of its coasts.
* Vibrant colors present in artistic expressions and festivities.

The goal was not to reproduce a traditional tourist aesthetic, but to transmit the energy and diversity that characterize Limón.

### Photography

The priority was to use authentic images and avoid generic stock photos.

People had to occupy a central place. I did not want to show a touristy or idealized version of Limón, but a representation closer to daily reality in the province.

During the visual research process, the photographic work of [Xaxier Sandi Castillo](https://www.instagram.com/amkras_/), who captured most of the photos for the website, served as an important reference to understand how photography can document identity, memory, and territory from a local perspective. His work demonstrates the importance of communities participating in building the region's visual narrative, preventing history from being told solely from external viewpoints.

For that reason, one of the project's premises was to prioritize images produced by people who know and live the daily reality of Limón, ensuring that the visual representation retains greater authenticity and cultural context.

### Narrative

Instead of starting with tourism, the structure was organized around:

1. History.
2. Culture.
3. Community.
4. Gastronomy.
5. Experiences.

Because before being a tourist destination, Limón is a living cultural identity.

---

## What I Learned

It was related to inequality.

According to data compiled by the [UNDP (PNUD)](https://pnud-conocimiento.cr/wp-content/uploads/2022/06/Ficha-tecnica-Limon-Folleto-imprimible.pdf) from census records, approximately one-third of Limonense households lived in poverty.

<div class="not-prose my-8 p-6 rounded-xl border border-grayscale-3 dark:border-grayscale-3/50 bg-grayscale-2/40 dark:bg-black/30 backdrop-blur-sm flex flex-col gap-5">
  <div class="flex items-center justify-between border-b border-grayscale-3/80 dark:border-grayscale-3/30 pb-3 text-[10px] font-mono tracking-widest uppercase text-grayscale-10">
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-grayscale-10"></span>
      <span class="text-grayscale-12 font-medium">INDICATORS // SOCIOECONOMIC-VULNERABILITY</span>
    </div>
    <span>UNDP TECHNICAL FILE</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="p-4 rounded-lg bg-white dark:bg-[#16171d] border border-grayscale-3/60 dark:border-grayscale-3/40 flex flex-col justify-between gap-3">
      <div class="flex items-center justify-between text-[10px] font-mono uppercase text-grayscale-10">
        <span>Vulnerable Households</span>
        <span class="font-bold text-grayscale-12">LIMÓN</span>
      </div>
      <div class="text-3xl sm:text-4xl font-mono font-bold text-grayscale-12">
        31.0<span class="text-lg font-normal text-grayscale-10">%</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="h-1.5 flex-1 bg-accent-9 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-accent-9 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-accent-9 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
      </div>
      <p class="text-[11px] text-grayscale-11 leading-normal font-sans">
        Approx. 1 out of 3 households experiences unmet basic needs, contrasting high-volume port logistics with regional household realities.
      </p>
    </div>

    <div class="p-4 rounded-lg bg-white dark:bg-[#16171d] border border-grayscale-3/60 dark:border-grayscale-3/40 flex flex-col justify-between gap-3">
      <div class="flex items-center justify-between text-[10px] font-mono uppercase text-grayscale-10">
        <span>Basic Needs Covered</span>
        <span class="font-bold text-grayscale-12">BASELINE</span>
      </div>
      <div class="text-3xl sm:text-4xl font-mono font-bold text-grayscale-12">
        69.0<span class="text-lg font-normal text-grayscale-10">%</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-9 dark:bg-grayscale-11 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
        <div class="h-1.5 flex-1 bg-grayscale-3 dark:bg-grayscale-3/40 rounded-full"></div>
      </div>
      <p class="text-[11px] text-grayscale-11 leading-normal font-sans">
        Stable household infrastructure requiring sustainable digital investment to close the regional connectivity divide.
      </p>
    </div>
  </div>

  <div class="text-[9px] font-mono text-grayscale-10 flex items-center justify-between border-t border-grayscale-3/60 dark:border-grayscale-3/20 pt-2">
    <span>SOURCE: UNITED NATIONS DEVELOPMENT PROGRAMME (UNDP)</span>
    <span>INDICATORS OF SOCIAL INEQUALITY</span>
  </div>
</div>

<div class="not-prose my-10 p-6 rounded-xl border border-grayscale-3 dark:border-grayscale-3/50 bg-gradient-to-br from-grayscale-2/60 via-white to-grayscale-1 dark:from-[#181920] dark:via-[#131418] dark:to-[#0f1013] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs">
  <div class="flex flex-col gap-1.5 max-w-lg">
    <div class="flex items-center gap-2">
      <span class="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider bg-accent-9/10 text-accent-9 border border-accent-9/20">DOCUMENTARY ARCHIVE</span>
    </div>
    <div class="text-base font-semibold text-grayscale-12 font-sans">Living Cultural Memory of Limón</div>
    <p class="text-xs text-grayscale-11 leading-relaxed">
      Explore oral histories, architecture, and ancestral memory preserved directly by Limonense creators and communities.
    </p>
  </div>
  <a href="https://tecdigital.tec.ac.cr/servicios/cv-recursos/html/anancy/" target="_blank" rel="noopener noreferrer" class="shrink-0 px-4 py-2.5 rounded-lg bg-grayscale-12 text-grayscale-1 font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90 active:scale-95 transition-all">
    EXPLORE ARCHIVE →
  </a>
</div>

This data changed the way I understood the project.

Because representing a culture does not mean showing only what is attractive.

It also implies recognizing the challenges that are part of its reality.

The cultural identity does not exist isolated from the social, economic, and historical conditions surrounding it.

---

## The Problem of "Digital Fossilization"

During my research, I found recent studies on digital heritage that discuss a phenomenon known as **digital fossilization**.

This concept describes projects that successfully collect photographs, documents, and cultural archives, but over time cease to evolve because the community no longer actively participates.

In other words: culture is documented, but the living culture is lost.

That risk is especially relevant in Limón.

Afro-Limonense culture continues to transform every day.

New artistic expressions are created.

New stories appear.

New voices emerge.

Therefore, any platform seeking to represent Limonense identity should be built alongside the community, and not just about it.

---

## Beyond Design

There is something no UX guide explains.

When you design a cultural page, you are also making decisions about memory.

Deciding:

* Which stories appear.
* Which are left out.
* Which voices are heard.
* What identity is projected to the world.

And those decisions have consequences.

The internet has become one of the main storefronts where people get to know territories, communities, and cultures.

If Limón does not tell its story correctly on the internet, someone else will tell it.

And they will probably do it from the outside.

---

## Conclusion

This project started as an idea related to web design.

Ended up becoming a reflection on memory, identity, and cultural representation.

The main lesson was understanding that digitalizing a culture does not mean uploading information to the internet.

It means making decisions.

Deciding which stories are told.

Which images are shown.

Which voices appear.

And what version of a community will be seen by thousands of people.

Limón deserves a digital presence that lives up to its history and its enormous contribution to the country.

This project does not claim to be the final answer.

Rather, it is an invitation.

An invitation for more Limonense developers, photographers, researchers, artists, historians, and creators to participate in building a more complete, authentic, and human digital representation.

Because if one thing became clear during this process, it is that the best way to tell the story of Limón is still to let Limonenses tell it themselves.

---

## Credits and Visual Inspiration

* Documentary inspiration and photography (most photos on the website): [Xaxier Sandi Castillo](https://www.instagram.com/amkras_/)
* Community archive and historical memory: [Mi Limón of Yesterday](https://www.facebook.com/share/g/1CeUp5KFKT/)

---

## References

* [National Institute of Statistics and Censuses (INEC) - Limón in figures 2022](https://admin.inec.cr/sites/default/files/2023-07/INFOGRAFIA_ESTIM_POB_VIV_2022_LIMON.pdf)
* [United Nations Development Programme (UNDP) - Ficha Técnica Provincia de Limón](https://pnud-conocimiento.cr/wp-content/uploads/2022/06/Ficha-tecnica-Limon-Folleto-imprimible.pdf)
* [Anancy Project - Tecnológico de Costa Rica](https://tecdigital.tec.ac.cr/servicios/cv-recursos/html/anancy/)
* [New website on Afro-Caribbean culture - TEC](https://www.tec.ac.cr/hoyeneltec/2019/07/22/nuevo-sitio-web-le-permite-conocer-cultura-afrocaribena-costa-rica)
* [Intangible Cultural Heritage of Limón - Tecnológico de Costa Rica](https://orion.tec.ac.cr/en/publications/patrimonio-inmaterial-recursos-del-patrimonio-inmaterial-lim%C3%B3n-co/)
* [Mi Limón of Yesterday - Digital community archive](https://www.facebook.com/share/g/1CeUp5KFKT/)
