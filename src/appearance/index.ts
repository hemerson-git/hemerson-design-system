// Theme and transparency without React, for plain HTML pages and server code:
// import { applyStoredAppearance, setTheme } from "@hemerson/design-system/appearance";
export {
  APPEARANCE_STORAGE_KEYS,
  appearanceScript,
  applyStoredAppearance,
  getAppearance,
  readStoredAppearance,
  setTheme,
  setTransparency,
  subscribeToAppearance,
} from "./appearance";
export type { Appearance, Theme, Transparency } from "./appearance";
