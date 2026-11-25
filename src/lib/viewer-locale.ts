/**
 * Viewer locale, timezone & Hispanic country detection helper.
 * Used across CentralHero (visitor flag, time difference) and
 * SelectedWorkCarousel (automatic ES/EN screenshot selection).
 */

// Simulated viewer timezone for testing (e.g. "Europe/Madrid", "America/New_York", or null for real browser timezone).
// You can also override dynamically in the browser via query param ?tz=Europe/Madrid or ?tz=America/New_York
export const SIMULATED_VIEWER_TIMEZONE: string | null = null;

export const HISPANIC_COUNTRY_CODES = new Set([
  "ES", // Spain
  "CR", // Costa Rica
  "MX", // Mexico
  "CO", // Colombia
  "AR", // Argentina
  "CL", // Chile
  "PE", // Peru
  "VE", // Venezuela
  "EC", // Ecuador
  "GT", // Guatemala
  "CU", // Cuba
  "BO", // Bolivia
  "DO", // Dominican Republic
  "HN", // Honduras
  "PY", // Paraguay
  "SV", // El Salvador
  "NI", // Nicaragua
  "PA", // Panama
  "UY", // Uruguay
  "PR", // Puerto Rico
  "GQ", // Equatorial Guinea
]);

export const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  // United States & Canada
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Detroit": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Montreal": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",

  // Latin America & Caribbean (Hispanic)
  "America/Costa_Rica": "CR",
  "America/Mexico_City": "MX",
  "America/Cancun": "MX",
  "America/Monterrey": "MX",
  "America/Tijuana": "MX",
  "America/Bogota": "CO",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Lima": "PE",
  "America/Caracas": "VE",
  "America/Guayaquil": "EC",
  "America/Guatemala": "GT",
  "America/Havana": "CU",
  "America/La_Paz": "BO",
  "America/Santo_Domingo": "DO",
  "America/Tegucigalpa": "HN",
  "America/Asuncion": "PY",
  "America/El_Salvador": "SV",
  "America/Managua": "NI",
  "America/Panama": "PA",
  "America/Montevideo": "UY",
  "America/Puerto_Rico": "PR",

  // Brazil & other Americas
  "America/Sao_Paulo": "BR",
  "America/Fortaleza": "BR",
  "America/Manaus": "BR",

  // Europe
  "Europe/Madrid": "ES",
  "Atlantic/Canary": "ES",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Dublin": "IE",
  "Europe/Lisbon": "PT",
  "Europe/Zurich": "CH",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Warsaw": "PL",

  // Asia / Pacific
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Singapore": "SG",
  "Asia/Kolkata": "IN",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
};

/**
 * Returns the effective viewer timezone, respecting query param ?tz=,
 * fallback SIMULATED_VIEWER_TIMEZONE, and finally browser Intl timezone.
 */
export function getViewerTimeZone(): string {
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tzParam = urlParams.get("tz");
      if (tzParam) return tzParam;
    } catch {}
  }

  if (SIMULATED_VIEWER_TIMEZONE) {
    return SIMULATED_VIEWER_TIMEZONE;
  }

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Resolves country ISO alpha-2 code from a timezone string.
 */
export function getCountryCodeFromTimeZone(tz: string): string | null {
  if (TIMEZONE_TO_COUNTRY[tz]) return TIMEZONE_TO_COUNTRY[tz];

  // Heuristic prefix matching
  if (tz.startsWith("America/Argentina/")) return "AR";
  if (tz.startsWith("America/Indiana/")) return "US";
  if (tz.startsWith("America/Kentucky/")) return "US";
  if (tz.startsWith("America/North_Dakota/")) return "US";

  return null;
}

/**
 * Checks whether the visitor is likely in a Hispanic country
 * (via resolved country code or Spanish browser language as fallback).
 */
export function isHispanicVisitor(): boolean {
  if (typeof window === "undefined") return false;

  const tz = getViewerTimeZone();
  const country = getCountryCodeFromTimeZone(tz);
  if (country && HISPANIC_COUNTRY_CODES.has(country)) {
    return true;
  }

  // Fallback to browser primary language if country could not be matched
  try {
    const navLang = navigator.language || (navigator as any).userLanguage || "";
    if (navLang.toLowerCase().startsWith("es")) {
      return true;
    }
  } catch {}

  return false;
}
