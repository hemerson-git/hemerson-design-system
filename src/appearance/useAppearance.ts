import { useEffect, useSyncExternalStore } from "react";
import {
  applyStoredAppearance,
  getAppearance,
  setTheme,
  setTransparency,
  subscribeToAppearance,
  type Appearance,
  type Theme,
  type Transparency,
} from "./appearance";

let initialized = false;

const serverAppearance: Appearance = { theme: "dark", transparency: "full" };
let lastSnapshot: Appearance = serverAppearance;

// useSyncExternalStore needs the same object back while nothing has changed
function snapshot(): Appearance {
  const current = getAppearance();
  if (current.theme !== lastSnapshot.theme || current.transparency !== lastSnapshot.transparency) {
    lastSnapshot = current;
  }
  return lastSnapshot;
}

export interface UseAppearance extends Appearance {
  setTheme: (theme: Theme) => void;
  setTransparency: (transparency: Transparency) => void;
  toggleTheme: () => void;
  toggleTransparency: () => void;
}

/**
 * The page's theme and transparency, kept in sync across every component that uses it.
 * The first use applies the saved choice (dark when nothing is saved), unless the app already
 * called applyStoredAppearance() at startup.
 */
export function useAppearance(): UseAppearance {
  useEffect(() => {
    if (initialized) return;
    initialized = true;
    if (!document.documentElement.hasAttribute("data-theme")) applyStoredAppearance();
  }, []);

  const appearance = useSyncExternalStore(subscribeToAppearance, snapshot, () => serverAppearance);

  return {
    ...appearance,
    setTheme,
    setTransparency,
    toggleTheme: () => setTheme(appearance.theme === "dark" ? "light" : "dark"),
    toggleTransparency: () => setTransparency(appearance.transparency === "full" ? "reduced" : "full"),
  };
}
