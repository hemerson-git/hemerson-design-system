# @hemerson/design-system

## 0.10.0

### Minor Changes

- [#19](https://github.com/hemerson-git/hemerson-design-system/pull/19) [`dec1cf0`](https://github.com/hemerson-git/hemerson-design-system/commit/dec1cf0918c1943387f2155a935b8c61ce7147c5) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Toasts take an `action`: a text button next to the message, such as `{ label: "Desfazer", onAction }`, that runs and then closes the toast. Closing on its own never runs it. Toasts raised with an action through `useToast().show` stay 10 seconds instead of 5 unless a duration is given, and the timer still pauses on hover and focus.

## 0.9.0

### Minor Changes

- [#17](https://github.com/hemerson-git/hemerson-design-system/pull/17) [`ebc6089`](https://github.com/hemerson-git/hemerson-design-system/commit/ebc6089cb53a0fc9a0a0a1656cc25cbc38af65dd) Thanks [@hemerson-git](https://github.com/hemerson-git)! - New `BarChart` for comparing a few values: `vertical` for values over time, `horizontal` for rankings. Several series stack in each bar with a legend, coloured with the theme's tones, and `formatValue` sets how values read (e.g. as reais). The bars are hidden from screen readers, which get the same numbers as a table; the figure is named by its title, and an `empty` message replaces the bars when there is no data.

## 0.8.0

### Minor Changes

- [#15](https://github.com/hemerson-git/hemerson-design-system/pull/15) [`aa1b3ba`](https://github.com/hemerson-git/hemerson-design-system/commit/aa1b3ba1adb1ecea9dfa40f48a8ca41e47ecf476) Thanks [@hemerson-git](https://github.com/hemerson-git)! - `Input`, `Select`, `Typeahead` and `DateInput` take `hideLabel`: the label stays for screen readers but isn't shown, for a field whose context already says what it is, such as one inside a table cell.

## 0.7.0

### Minor Changes

- [#13](https://github.com/hemerson-git/hemerson-design-system/pull/13) [`324c876`](https://github.com/hemerson-git/hemerson-design-system/commit/324c876b49c01d4a9813543f86f1491c078450f6) Thanks [@hemerson-git](https://github.com/hemerson-git)! - New `Typeahead`: a text field that suggests values as you type, such as names already used, in a glass list like `Menu`. Matches ignore case and accents, those that start with the text come first, repeats show once and the matching part is bold. The arrow keys move through the list (wrapping), Enter picks, Escape closes only the list (a dialog around it stays open) and a click picks without losing focus. Any text is still accepted, and it follows the WAI-ARIA combobox pattern.

## 0.6.0

### Minor Changes

- [#11](https://github.com/hemerson-git/hemerson-design-system/pull/11) [`7d855f3`](https://github.com/hemerson-git/hemerson-design-system/commit/7d855f3f7d38a9e0547055f8b94771cef7c700fe) Thanks [@hemerson-git](https://github.com/hemerson-git)! - `Menu` takes a `header`: context shown above the actions, such as the signed-in account's name with its email in `<small>`. It is not an item, so focus and the arrow keys skip it, and screen readers hear it as the menu's description.

## 0.5.0

### Minor Changes

- [#9](https://github.com/hemerson-git/hemerson-design-system/pull/9) [`e4c4f92`](https://github.com/hemerson-git/hemerson-design-system/commit/e4c4f92f355e149db3dcd87e31f7c0def86976fb) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Glass for the last native popups:
  
  - **`Select`'s open list is glass** in browsers with customizable select (Chromium 135+, Electron 36+), styled like `Menu`, with a checkmark on the chosen option. The select stays native, so the keyboard, screen readers and forms work as before; other browsers keep their own list.
  - **New `DateInput`**: type the date as day/month/year or pick it from a glass calendar. The arrow keys move by day and week, Page Up/Down by month (with Shift, by year), Home/End to the start and end of the week, Enter picks and Escape closes. It takes and reports "yyyy-mm-dd" like `<input type="date">`, honours `min` and `max`, marks today, and with `name` sends its value with the form. Labels default to Brazilian Portuguese and month names follow `locale`.
  - **Escape inside a dialog** closes an open menu or calendar first, and only the next Escape closes the dialog. Before, one Escape closed both.

## 0.4.0

### Minor Changes

- [#7](https://github.com/hemerson-git/hemerson-design-system/pull/7) [`317e40b`](https://github.com/hemerson-git/hemerson-design-system/commit/317e40bc45dc60427698185c4b61885206fea2fa) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Liquid glass everywhere:
  
  - **Dialogs are see-through.** Thick glass drops from 94% to 50% tint in dark and 70% in light, with a 10px blur, and the scrim behind a dialog is much lighter, so the page shows through as it does on Apple's sheets. Ink and ink-muted keep 4.5:1 or more over the app's own surfaces, text and fills. Over much brighter imagery in the dark theme (or darker in the light one), give the dialog the other theme with `data-theme`, as with regular glass.
  - **`Table` takes `glass`** for a table on the app's background: regular glass with a frosted sticky header that keeps scrolled rows out of the way. Without it, tables stay solid.

## 0.3.1

### Patch Changes

- [#5](https://github.com/hemerson-git/hemerson-design-system/pull/5) [`dab3d8c`](https://github.com/hemerson-git/hemerson-design-system/commit/dab3d8cf8ba9c8ba5f60268c79d7fa65e2228391) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Fix the types of `applyStoredAppearance`, `setTheme`, `setTransparency` and the other appearance helpers when imported from `@hemerson/design-system`. The root entry re-exported them from a path that TypeScript resolved to the built `appearance.js` file, which has no types, so apps got "has no exported member". Imports from `@hemerson/design-system/appearance` were not affected.

## 0.3.0

### Minor Changes

- [#3](https://github.com/hemerson-git/hemerson-design-system/pull/3) [`55497db`](https://github.com/hemerson-git/hemerson-design-system/commit/55497db799c64ce241afa3a4ade0573ec6dcaab3) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Menus, dialogs, toasts and appearance for real apps:
  
  - **Menu** renders its list above the page, so a scrolling table or card can't clip it. It opens upward near the bottom of the window and stays inside its edges. Tab now closes it and returns focus to the trigger.
  - **Dialog** takes `size="lg"` (880px) for wide content such as a print preview.
  - **`ToastProvider` and `useToast()`** stack up to three toasts in one region, each on its own timer: `toast.success`, `error`, `warning`, `info`, `show` and `dismiss`.
  - **Appearance:** `ThemeToggle` and `TransparencyToggle` switch and remember the theme and solid glass. `applyStoredAppearance()`, `setTheme()` and `setTransparency()` come from the new React-free `@hemerson/design-system/appearance` entry. Apps open dark unless the visitor chose light.
  - **The `hidden` attribute** now hides any design system element, even ones whose styles set a display, such as the toast region.

## 0.2.0

### Minor Changes

- [#1](https://github.com/hemerson-git/hemerson-design-system/pull/1) [`7a85386`](https://github.com/hemerson-git/hemerson-design-system/commit/7a853868d0e4d44ee62dedcfbe1fa7414e590d07) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Glass now looks like Apple's Liquid Glass: a lighter tint (30% in dark, 20% in light) so the content behind shows through, a lighter blur, a lit two-tone rim, an inner glow and a text shadow for legibility. In Chromium, `enableGlassRefraction()` now bends the backdrop at each element's edges with a lens sized to it, replacing the noise distortion, and it is also available without React from `@hemerson/design-system/glass`. Dialog and toast text now uses the design system font.

## 0.1.0

### Minor Changes

- First release: tokens for a dark and a light theme, the liquid-glass stylesheet, and 21 React components (GlassPanel, Button, NavBar, Sidebar, SegmentedControl, Menu, FloatingButton, Dialog, Toast, Input, Select, Checkbox, Card, Badge, Table, Container, SectionTitle, Separator, ScrollArea, Loading and GlowAvatar), with `enableGlassRefraction` for refraction in Chromium.
