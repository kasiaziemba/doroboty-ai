import { beforeEach, describe, expect, it, vi } from "vitest";

const posthog = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  opt_in_capturing: vi.fn(),
  opt_out_capturing: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: posthog }));

function browser(href: string, stored: Record<string, string> = {}) {
  const items = new Map(Object.entries(stored));
  const localStorage = {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  };
  const location = { href, hostname: new URL(href).hostname };
  vi.stubGlobal("window", { location, localStorage, addEventListener: vi.fn() });
  vi.stubGlobal("navigator", { webdriver: false });
  vi.stubGlobal("document", { cookie: "" });
  return location;
}

async function load() {
  vi.resetModules();
  return import("./analytics");
}

beforeEach(() => {
  vi.unstubAllGlobals();
  for (const fn of Object.values(posthog)) fn.mockClear();
});

describe("hash route pageviews", () => {
  it("sends one $pageview per hash route with consent and disables PostHog's own", async () => {
    const location = browser("https://doroboty.example/#/", {
      "doroboty.analytics.consent": "granted",
    });
    const analytics = await load();
    analytics.initAnalytics();
    expect(posthog.init).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ capture_pageview: false, capture_pageleave: true }),
    );
    expect(posthog.capture).toHaveBeenCalledTimes(1);

    analytics.trackPageview(); // repeated effect for the same screen
    expect(posthog.capture).toHaveBeenCalledTimes(1);

    location.href = "https://doroboty.example/#/oferty?category=lead";
    analytics.trackPageview();
    location.href = "https://doroboty.example/#/oferty/ai-product-manager";
    analytics.trackPageview();
    expect(posthog.capture).toHaveBeenCalledTimes(3);
    expect(posthog.capture).toHaveBeenLastCalledWith("$pageview");
  });

  it("sends nothing before consent and counts the current screen once consent arrives", async () => {
    browser("https://doroboty.example/#/oferty");
    const analytics = await load();
    analytics.initAnalytics();
    analytics.trackPageview();
    expect(posthog.init).not.toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();

    analytics.setConsent("granted");
    expect(posthog.capture).toHaveBeenCalledTimes(1);

    analytics.setConsent("denied");
    analytics.trackPageview();
    expect(posthog.opt_out_capturing).toHaveBeenCalled();
    expect(posthog.capture).toHaveBeenCalledTimes(1);
  });

  it("never loads PostHog on a local host", async () => {
    browser("http://127.0.0.1:3001/#/oferty", { "doroboty.analytics.consent": "granted" });
    const analytics = await load();
    analytics.initAnalytics();
    analytics.trackPageview();
    expect(posthog.init).not.toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
