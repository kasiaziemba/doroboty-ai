import posthog from "posthog-js";

// Public project key: PostHog project keys are write-only ingestion tokens
// meant to ship in browser code, so this is not a secret.
const POSTHOG_KEY = "phc_AimttRvqMdUDEUEZgkQ33gGmgETPep5MB5wmkN8UUVNt";
const POSTHOG_HOST = "https://eu.i.posthog.com";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Starts PostHog browser analytics on the published site only.
 * Local dev, previews on this machine and automated browsers (Playwright)
 * send nothing, so tests and participant runs do not pollute the project.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (LOCAL_HOSTS.has(window.location.hostname)) return;
  if (navigator.webdriver) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // 2025-05-24 defaults record a pageview on every history change,
    // which covers the hash routes, plus pageleave and autocapture.
    defaults: "2025-05-24",
    person_profiles: "identified_only",
    // Forms hold free text. Autocapture never sends input values, and
    // session replay stays off so typed text is not recorded either.
    disable_session_recording: true,
  });
}
