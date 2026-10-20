// Compiled against the built package, the way an app imports it: run `npm run build` first
import * as root from "@hemerson/design-system";
import * as appearance from "@hemerson/design-system/appearance";
import * as glass from "@hemerson/design-system/glass";

// The root entry re-exports everything the React-free entries offer, with their types
export const rootHasAppearance: Pick<typeof root, keyof typeof appearance> = appearance;
export const rootHasGlass: Pick<typeof root, keyof typeof glass> = glass;

const theme: "dark" | "light" = root.applyStoredAppearance().theme;
export const toggles = [root.ThemeToggle, root.TransparencyToggle, root.ToastProvider, root.useToast, theme];
