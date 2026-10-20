// Theme and transparency without React, for plain HTML pages:
// import { applyStoredAppearance, setTheme } from "@hemerson/design-system/appearance";
export {
  APPEARANCE_STORAGE_KEYS,
  applyStoredAppearance,
  getAppearance,
  readStoredAppearance,
  setTheme,
  setTransparency,
  subscribeToAppearance,
} from "./appearance";
export type { Appearance, Theme, Transparency } from "./appearance";
