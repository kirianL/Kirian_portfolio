import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_URL,
  PERSON_ID,
  WEBSITE_ID,
  absoluteUrl,
  defaultBreadcrumbs,
  organizationSchema,
  personSchema,
  resolveAlternates,
  websiteSchema,
  withTrailingSlash,
  type BreadcrumbItem,
} from "@/lib/seo";

type PageType =
  | "WebPage"
  | "ProfilePage"
  | "AboutPage"
  | "CollectionPage"
  | "ContactPage";

export interface DocumentMetaOptions {
  title: string;
  description: string;
  lang: "en" | "es";
  image?: string;
  pageType?: PageType;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  mainEntityId?: string;
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

function upsertMeta(attrName: "name" | "property", attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang]):not([type])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useDocumentMeta({
  title,
  description,
  lang,
  image = "/OG/KirianLunaOG.png",
  pageType = "WebPage",
  schema,
  mainEntityId = PERSON_ID,
  breadcrumbs,
  noindex = false,
}: DocumentMetaOptions) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    const origin =
      window.location.hostname === "kirian.dev" ||
      window.location.hostname === "www.kirian.dev"
        ? `https://${window.location.hostname}`
        : SITE_URL;

    const canonicalPath = withTrailingSlash(pathname || "/");
    const canonicalURL = new URL(canonicalPath, origin).href;
    const resolvedImageURL = new URL(image, origin).href;

    const alternates = resolveAlternates(pathname);
    const englishURL = alternates.en
      ? new URL(withTrailingSlash(alternates.en), origin).href
      : undefined;
    const spanishURL = alternates.es
      ? new URL(withTrailingSlash(alternates.es), origin).href
      : undefined;
    const defaultURL = englishURL ?? spanishURL;

    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    );

    upsertLink("canonical", canonicalURL);
    if (englishURL) upsertLink("alternate", englishURL, "en");
    if (spanishURL) upsertLink("alternate", spanishURL, "es");
    if (defaultURL) upsertLink("alternate", defaultURL, "x-default");

    upsertMeta("property", "og:url", canonicalURL);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", resolvedImageURL);
    upsertMeta("property", "og:image:secure_url", resolvedImageURL);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("property", "og:locale", lang === "es" ? "es_ES" : "en_US");
    upsertMeta(
      "property",
      "og:locale:alternate",
      lang === "es" ? "en_US" : "es_ES",
    );

    upsertMeta("name", "twitter:url", canonicalURL);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", resolvedImageURL);
    upsertMeta("name", "twitter:image:alt", title);

    const resolvedBreadcrumbs =
      breadcrumbs ?? defaultBreadcrumbs(pathname, lang);

    const breadcrumbSchema =
      resolvedBreadcrumbs.length > 0
        ? {
            "@type": "BreadcrumbList",
            "@id": `${canonicalURL}#breadcrumb`,
            itemListElement: resolvedBreadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: absoluteUrl(item.path),
            })),
          }
        : null;

    const pageSchema = {
      "@type": pageType,
      "@id": `${canonicalURL}#webpage`,
      url: canonicalURL,
      name: title,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": mainEntityId },
      inLanguage: lang,
      ...(breadcrumbSchema
        ? { breadcrumb: { "@id": breadcrumbSchema["@id"] } }
        : {}),
    };

    const extraSchemas = Array.isArray(schema) ? schema : schema ? [schema] : [];
    const structuredData = [
      personSchema,
      websiteSchema,
      pageSchema,
      organizationSchema,
      ...extraSchemas,
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ].map((node) => ({ "@context": "https://schema.org", ...node }));

    let ldScript = document.head.querySelector<HTMLScriptElement>(
      "#structured-data-jsonld",
    );
    if (!ldScript) {
      ldScript = document.createElement("script");
      ldScript.id = "structured-data-jsonld";
      ldScript.type = "application/ld+json";
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(structuredData);
  }, [
    title,
    description,
    lang,
    image,
    pageType,
    schema,
    mainEntityId,
    breadcrumbs,
    noindex,
    pathname,
  ]);
}
