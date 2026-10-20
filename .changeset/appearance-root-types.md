---
"@hemerson/design-system": patch
---

Fix the types of `applyStoredAppearance`, `setTheme`, `setTransparency` and the other appearance helpers when imported from `@hemerson/design-system`. The root entry re-exported them from a path that TypeScript resolved to the built `appearance.js` file, which has no types, so apps got "has no exported member". Imports from `@hemerson/design-system/appearance` were not affected.
