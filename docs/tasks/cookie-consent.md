# Cookie consent banner for PostHog analytics

Created: 2026-11-16

## Goal

Ask visitors of the published site for consent before PostHog analytics runs (RODO/ePrivacy), as Kasia asked. Before this change PostHog started on every visit and set its cookie without consent, and the privacy page wrongly said nothing was sent to an analytics system.

## Scope and composition

- Routes: every route through `Shell` (public and workspace); `/#/polityka-prywatnosci` text; public footer.
- No source family for consent exists in Poster People v1. Host extension composed from the outlined white surface (r24, one ink contour), Geist Serif H2 at the 26px H3 scale (22px <=600px), 14px body text and existing `Button` default/outline variants with equal size.
- Non-modal `section` named by its heading, fixed to the bottom (z 40: above the sidebar, below dialogs). The banner height plus 32px is reserved as body padding and `scroll-padding-bottom`, so it never covers the last content or a focused control.

## Behavior

- `src/lib/analytics.ts`: consent store. PostHog loads only in `live` mode (not localhost/127.0.0.1/[::1]/webdriver) and only with stored consent `granted`. Refusal or withdrawal opts out and removes `ph_*` cookies/localStorage; `opt_out_persistence_by_default` stops further writes.
- Decision in localStorage `doroboty.analytics.consent`, outside the versioned scenario. Cross-tab `storage` events re-apply it.
- First visit: banner shown, focus not moved. "Ustawienia cookies" (footer, privacy page) reopens it, focuses the region, shows the current decision and returns focus to the trigger after a choice; otherwise focus goes to `#main`.
- `doroboty.analytics.preview=1` shows the consent UI locally without loading PostHog, for tests and visual checks.

## Acceptance criteria

- [x] No PostHog request or `ph_*` cookie before consent; none in preview mode at all.
- [x] Decline, reload, reopen, accept, focus return and current-state text work (browser journey).
- [x] 1280px, 390px and 320px checked in the browser; no horizontal overflow; buttons stack at 320px; workspace sidebar not covered.
- [x] axe wcag2a/aa on the banner: no violations.
- [x] `./scripts/verify` passes (2026-11-16: 27 unit tests, 38 Chromium journeys).
- [x] Withdrawal checked against posthog-js in the browser: `ph_*` cookie and localStorage removed; only the opt-out flag remains.
- [ ] After publish: banner on the live URL; no PostHog request before "Akceptuję"; events after it; withdrawal removes `ph_*` storage.

## Open points

- Accept and refuse are equally sized; accept uses the primary pink. Some regulators prefer visually equal choices; switch both to outline if required.
- Workspace screens have no footer; the privacy page button is the way back there.
