import { useSyncExternalStore } from "react";
import { getConsentSnapshot, openConsentSettings, subscribeConsent } from "@/lib/analytics";

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
