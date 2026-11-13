# Release smoke check

Run this right after publishing the static build, at the real public address, in a private browser window (so no earlier local data is reused). It takes about five minutes. Local `./scripts/verify` results do not replace it: they do not prove that the hosted copy is the right version or that the host serves every file.

Record the date, address, published commit and result of each step. If any step fails, republish the previous working version (see the hosting notes in the production-readiness report) and tell participants to use `npm ci` and `npm run dev` locally in the meantime.

## Before you start

- [ ] The published commit is the one that passed CI on `main`.
- [ ] The address opens over `https://` without a certificate warning.

## Steps

1. [ ] **Home page.** The page loads with the heading and job cards, and the browser console shows no errors.
2. [ ] **Job list.** "Zobacz oferty" opens the list; search and one category filter change the results.
3. [ ] **Offer page.** Open one offer; the description, salary and "Aplikuj" action are visible.
4. [ ] **Person selection.** "Wybierz osobę" → enter as Karolina or Tomasz (employer) and publish a short test offer.
5. [ ] **Application.** Switch to Anna or Marek, open the new offer, write an answer of at least 20 characters, tick the approval and send it.
6. [ ] **Employer decision.** Switch back to the employer, open the candidate and move the application to the next stage.
7. [ ] **Reload.** Reload the page: the offer, application and decision are still there.
8. [ ] **Deep link.** Copy the current address (it contains `#/`), open it in a new tab: the same screen appears, not a 404.
9. [ ] **Static files.** On a candidate application, "Otwórz CV (PDF)" opens the sample PDF and company logos are visible.
10. [ ] **Search engines.** The page source contains `<meta name="robots" content="noindex, nofollow" />`.
11. [ ] **No outside requests.** In the browser developer tools Network tab, all requests go to the published address.
12. [ ] **Clean up.** Settings → "Resetuj" and confirm, so the test offer does not stay in this browser.

## Result

- Date and person:
- Address and published commit:
- Steps passed / failed (with what was observed):
