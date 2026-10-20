---
"@hemerson/design-system": minor
---

Menus, dialogs, toasts and appearance for real apps:

- **Menu** renders its list above the page, so a scrolling table or card can't clip it. It opens upward near the bottom of the window and stays inside its edges. Tab now closes it and returns focus to the trigger.
- **Dialog** takes `size="lg"` (880px) for wide content such as a print preview.
- **`ToastProvider` and `useToast()`** stack up to three toasts in one region, each on its own timer: `toast.success`, `error`, `warning`, `info`, `show` and `dismiss`.
- **Appearance:** `ThemeToggle` and `TransparencyToggle` switch and remember the theme and solid glass. `applyStoredAppearance()`, `setTheme()` and `setTransparency()` come from the new React-free `@hemerson/design-system/appearance` entry. Apps open dark unless the visitor chose light.
- **The `hidden` attribute** now hides any design system element, even ones whose styles set a display, such as the toast region.
