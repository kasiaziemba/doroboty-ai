# Incident response

The published course app is https://doroboty-ai-4975.netlify.app (Netlify project `doroboty-ai-4975`, built from `main` of `kasiaziemba/doroboty-ai`).

## Who and where

- **Owner:** Kasia (repository and Netlify team owner) reacts to outages and broken releases.
- **Reports:** participants report problems in the course channel. The app says so in the public footer and in Settings → "O prototypie". Reports describe steps and what was seen; they never include exported data or real personal data.
- **Deploy failures:** visible on the Netlify Deploys page and in the GitHub commit status. A failed deploy never publishes, so the previous version stays live.

## If the site is down or a release is broken

1. Confirm the problem at the public address in a private window, using `docs/RELEASE_SMOKE_CHECK.md`.
2. Tell participants in the course channel to keep working locally in the meantime: `npm ci`, then `npm run dev`, and move their data with Settings → "Eksportuj dane" / "Importuj dane".
3. Fix forward: on GitHub, open the merged pull request that caused the problem, click **Revert**, wait for green CI on the revert pull request and merge it. Netlify then publishes `main` again. If no deploy starts, use **Trigger deploy** on the Netlify Deploys page.
4. Run the smoke check again at the public address and post the result in the course channel.

## Limits

User data lives only in each participant's browser, so there is no server data to restore. A broken release cannot corrupt saved data on the host; incompatible saves are protected by the app's recovery flow (SYS-09).
