import posthog from "posthog-js";

// Public project key: PostHog project keys are write-only ingestion tokens
// meant to ship in browser code, so this is not a secret.
const POSTHOG_KEY = "phc_AimttRvqMdUDEUEZgkQ33gGmgETPep5MB5wmkN8UUVNt";
const POSTHOG_HOST = "https://eu.i.posthog.com";

/** Stored visitor decision. Absent means the visitor has not decided yet. */
export const CONSENT_KEY = "doroboty.analytics.consent";
/**
 * Test/preview switch: set to "1" in localStorage to show the consent UI on a
 * local host. PostHog itself is never loaded in preview mode.
 */
export const PREVIEW_KEY = "doroboty.analytics.preview";

export type Consent = "granted" | "denied";
/**
 * live: published site, PostHog runs after consent.
 * preview: local host with PREVIEW_KEY, consent UI only, nothing is sent.
 * off: local host or automated browser, no consent UI and nothing is sent.
 */
export type AnalyticsMode = "live" | "preview" | "off";

export type ConsentSnapshot = {
  mode: AnalyticsMode;
  consent: Consent | null;
  /** True while the banner is shown: before a decision or after a reopen. */
  open: boolean;
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function detectMode(): AnalyticsMode {
  if (typeof window === "undefined") return "off";
  const local = LOCAL_HOSTS.has(window.location.hostname) || navigator.webdriver;
  if (!local) return "live";
  return storage()?.getItem(PREVIEW_KEY) === "1" ? "preview" : "off";
}

function readConsent(): Consent | null {
  const value = storage()?.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

let started = false;
let reopened = false;
let snapshot: ConsentSnapshot = { mode: "off", consent: null, open: false };
const listeners = new Set<() => void>();

function refresh() {
  const mode = detectMode();
  const consent = readConsent();
  snapshot = { mode, consent, open: mode !== "off" && (consent === null || reopened) };
  for (const listener of listeners) listener();
}

/** Removes PostHog's identifiers (ph_* cookies and localStorage entries). */
function clearPosthogStorage() {
  const local = storage();
  if (local) {
    for (const key of Object.keys(local)) if (key.startsWith("ph_")) local.removeItem(key);
  }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name?.startsWith("ph_")) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  }
}

function apply(consent: Consent | null) {
  if (snapshot.mode !== "live") return;
  if (consent === "granted") {
    if (!started) {
      started = true;
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        // 2025-05-24 defaults record a pageview on every history change,
        // which covers the hash routes, plus pageleave and autocapture.
        defaults: "2025-05-24",
        person_profiles: "identified_only",
        // Forms hold free text. Autocapture never sends input values, and
        // session replay stays off so typed text is not recorded either.
        disable_session_recording: true,
        // After a withdrawal PostHog stops writing cookies/localStorage.
        opt_out_persistence_by_default: true,
      });
    } else {
      posthog.opt_in_capturing();
    }
  } else if (consent === "denied") {
    if (started) posthog.opt_out_capturing();
    clearPosthogStorage();
  }
}

/**
 * Reads the stored decision and starts PostHog only on the published site
 * and only after the visitor accepted. Call once at application start.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  refresh();
  apply(snapshot.consent);
  window.addEventListener("storage", (event) => {
    if (event.key !== CONSENT_KEY && event.key !== PREVIEW_KEY) return;
    refresh();
    apply(snapshot.consent);
  });
}

export function setConsent(consent: Consent): void {
  storage()?.setItem(CONSENT_KEY, consent);
  reopened = false;
  refresh();
  apply(consent);
}

/** Shows the banner again so the visitor can change an earlier decision. */
export function openConsentSettings(): void {
  reopened = true;
  refresh();
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getConsentSnapshot(): ConsentSnapshot {
  return snapshot;
}
