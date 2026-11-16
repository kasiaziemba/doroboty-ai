# Pageviews for hash routes

Created: 2026-11-16

## Problem

PostHog recorded `$pageview` only on the first page load. Live data for the last day had 6 pageviews, all for `https://doroboty-ai-4975.netlify.app/`, while autocapture showed visitors on `#/oferty`, `#/oferty?category=lead` and offer pages. PostHog's `capture_pageview: 'history_change'` (from defaults `2025-05-24`) compares only `location.pathname`, which is always `/` under HashRouter.

## Change

- `src/lib/analytics.ts`: `capture_pageview: false`, `capture_pageleave: true`; new `trackPageview()` sends `$pageview` for the current URL when PostHog runs with consent, skipping a repeat of the last sent URL. Consent arriving mid-visit counts the current screen; withdrawal resets the last URL.
- `useTrackPageviews()` in `src/features/prototype/consent.ts`, called by `Shell`: runs on every route path/query change. In-page section hashes (e.g. `#employer`) are not new screens.
- FEATURES.md limits paragraph corrected; the earlier claim that defaults covered hash routes was wrong.

## Acceptance criteria

- [x] Unit tests (`src/lib/analytics.test.ts`, mocked posthog-js): one pageview per route, no duplicate for the same URL, nothing before consent, current screen counted on consent, nothing after withdrawal, nothing on a local host.
- [x] `./scripts/verify` passes (2026-11-16: 30 unit tests, 38 Chromium journeys).
- [ ] After publish: PostHog shows `$pageview` with `#/oferty...` URLs from the live site after "Akceptuję".
