# Netlify hosting configuration

Created: 2026-11-13

## Goal

Publish the static build on Netlify (project `doroboty-ai-4975`, team `k-ziemba1988`) from the `main` branch of `kasiaziemba/doroboty-ai`.

## Changes

- `netlify.toml`: build command `npm run build`, publish directory `dist`. Node.js 24 comes from `.nvmrc`. No redirects, functions, forms or environment variables: hash routes need no SPA fallback and the app has no secrets.
- `.gitignore`: ignore `.netlify/`, which Netlify linking writes locally.

## Acceptance criteria

- [ ] `./scripts/verify` passes.
- [ ] The first Netlify production deploy succeeds and `docs/RELEASE_SMOKE_CHECK.md` passes at the real address.
- [ ] Visitor access is changed from team-only to public before sharing the link with participants.

## Notes

FEATURES.md was reviewed and needs no change: hosting configuration does not change application behavior. Netlify does not wait for GitHub CI before publishing `main`; merge only after CI is green.
