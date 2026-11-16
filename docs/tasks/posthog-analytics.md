# PostHog browser analytics

Created: 2026-11-16

## Goal

Collect browser events from the published site (doroboty-ai-4975.netlify.app) in Kasia's PostHog project (EU), as she asked.

## Changes

- `posthog-js` dependency; `src/lib/analytics.ts` initialises it from `src/main.tsx`.
- Defaults `2025-05-24`: pageview on each history change (hash routes), pageleave, autocapture. Person profiles only after `identify` (never called). Session replay disabled.
- No init on localhost, 127.0.0.1, [::1] or when `navigator.webdriver` is set, so `npm run dev`, previews and Playwright send nothing.
- FEATURES.md: "Current implementation limits" now describes the analytics.

## Acceptance criteria

- [ ] `./scripts/verify` passes.
- [ ] Local run sends no requests to posthog.com.
- [ ] After merge and Netlify publish, pageview events appear in PostHog from the live URL.

## Open points

- No cookie/consent notice yet; PostHog stores its ID in a cookie and localStorage. Needs a decision before real users.
- Analytics is a remote runtime dependency; the design-system "no remote runtime dependencies" rule covers assets, not this, but worth reviewing.
