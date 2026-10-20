/*
 * Theme and transparency for the whole page, kept on <html> and remembered in localStorage.
 * Projects open in the dark theme whatever the system setting: light, and reduced
 * transparency, are the visitor's own choices. No React here, so plain HTML pages can use it.
 */

export type Theme = "dark" | "light";
export type Transparency = "full" | "reduced";

export interface Appearance {
  theme: Theme;
  transparency: Transparency;
}

export const APPEARANCE_STORAGE_KEYS = {
  theme: "hds-theme",
  transparency: "hds-transparency",
} as const;

const listeners = new Set<() => void>();

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Private windows and blocked storage: fall back to the defaults
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The choice still applies for this visit
  }
}

/** The saved choices, or dark with full transparency when nothing is saved. */
export function readStoredAppearance(): Appearance {
  return {
    theme: read(APPEARANCE_STORAGE_KEYS.theme) === "light" ? "light" : "dark",
    transparency: read(APPEARANCE_STORAGE_KEYS.transparency) === "reduced" ? "reduced" : "full",
  };
}

/** What <html> currently shows. */
export function getAppearance(): Appearance {
  const root = document.documentElement;
  return {
    theme: root.getAttribute("data-theme") === "light" ? "light" : "dark",
    transparency: root.getAttribute("data-transparency") === "reduced" ? "reduced" : "full",
  };
}

function apply({ theme, transparency }: Appearance) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  if (transparency === "reduced") {
    root.setAttribute("data-transparency", "reduced");
  } else {
    root.removeAttribute("data-transparency");
  }
  listeners.forEach((listener) => listener());
}

/**
 * Puts the saved theme and transparency on <html>, dark when nothing is saved.
 * Call it as early as possible, before the first paint, so the page never flashes the other theme.
 */
export function applyStoredAppearance(): Appearance {
  const appearance = readStoredAppearance();
  apply(appearance);
  return appearance;
}

export function setTheme(theme: Theme) {
  write(APPEARANCE_STORAGE_KEYS.theme, theme);
  apply({ ...getAppearance(), theme });
}

export function setTransparency(transparency: Transparency) {
  write(APPEARANCE_STORAGE_KEYS.transparency, transparency);
  apply({ ...getAppearance(), transparency });
}

/** Runs `listener` whenever the theme or transparency changes through these helpers. */
export function subscribeToAppearance(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
