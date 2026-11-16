import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { setConsent, type Consent } from "@/lib/analytics";
import { hasReopenTrigger, reopenConsent, takeReopenTrigger, useConsent } from "./consent";

/** Control that reopens the consent banner. Hidden when analytics is off. */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const { mode } = useConsent();
  if (mode === "off") return null;
  return (
    <button
      type="button"
      className={className}
      onClick={(event) => reopenConsent(event.currentTarget)}
    >
      Ustawienia cookies
    </button>
  );
}

/**
 * Non-modal consent region fixed to the bottom of the viewport. It reserves
 * page space below the content (--consent-banner-space) so it never covers
 * the last content or a focused control.
 */
export function ConsentBanner() {
  const { open, consent } = useConsent();
  const region = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const element = region.current;
    if (!open || !element) return;
    const update = () =>
      root.style.setProperty("--consent-banner-space", `${element.offsetHeight + 32}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--consent-banner-space");
    };
  }, [open]);

  useEffect(() => {
    // Only a deliberate reopen moves focus; the first visit never steals it.
    if (open && hasReopenTrigger()) region.current?.focus();
  }, [open]);

  if (!open) return null;

  const decide = (value: Consent) => {
    const trigger = takeReopenTrigger();
    setConsent(value);
    const target = trigger?.isConnected ? trigger : document.getElementById("main");
    target?.focus({ preventScroll: true });
  };

  return (
    <section ref={region} className="consent-banner" aria-labelledby="consent-title" tabIndex={-1}>
      <h2 id="consent-title">Pliki cookie i analityka</h2>
      <p>
        Za Twoją zgodą zbieramy anonimowe dane o korzystaniu ze strony: odsłony i kliknięcia. Robimy
        to w narzędziu PostHog na serwerach w UE. Nie zapisujemy tego, co wpisujesz w formularze,
        ani nagrań ekranu. Bez zgody nic nie wysyłamy.{" "}
        <Link to="/polityka-prywatnosci">Więcej o prywatności</Link>
      </p>
      {consent && (
        <p className="consent-banner__state">
          Obecnie: {consent === "granted" ? "zgoda udzielona" : "zgoda odrzucona"}.
        </p>
      )}
      <div className="consent-banner__actions">
        <Button onClick={() => decide("granted")}>Akceptuję</Button>
        <Button variant="outline" onClick={() => decide("denied")}>
          Odrzucam
        </Button>
      </div>
    </section>
  );
}
