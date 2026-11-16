import { useEffect, useSyncExternalStore } from "react";
import { useLocation } from "react-router";
import {
  getConsentSnapshot,
  openConsentSettings,
  subscribeConsent,
  trackPageview,
} from "@/lib/analytics";

export function useConsent() {
  return useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentSnapshot);
}

// Element that reopened the banner, so focus can return to it afterwards.
let reopenTrigger: HTMLElement | null = null;

/** Reopens the consent banner; it takes focus and returns it to `trigger`. */
export function reopenConsent(trigger: HTMLElement | null) {
  reopenTrigger = trigger;
  openConsentSettings();
}

export function hasReopenTrigger() {
  return reopenTrigger !== null;
}

/** Returns and forgets the element that reopened the banner. */
export function takeReopenTrigger() {
  const trigger = reopenTrigger;
  reopenTrigger = null;
  return trigger;
}

/**
 * Sends a pageview whenever the hash route (path or query) changes. In-page
 * section hashes such as #employer are not separate screens and are ignored.
 */
export function useTrackPageviews() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPageview();
  }, [pathname, search]);
}
