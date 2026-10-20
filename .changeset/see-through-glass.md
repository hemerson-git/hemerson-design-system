---
"@hemerson/design-system": minor
---

Liquid glass everywhere:

- **Dialogs are see-through.** Thick glass drops from 94% to 50% tint in dark and 70% in light, with a 10px blur, and the scrim behind a dialog is much lighter, so the page shows through as it does on Apple's sheets. Ink and ink-muted keep 4.5:1 or more over the app's own surfaces, text and fills. Over much brighter imagery in the dark theme (or darker in the light one), give the dialog the other theme with `data-theme`, as with regular glass.
- **`Table` takes `glass`** for a table on the app's background: regular glass with a frosted sticky header that keeps scrolled rows out of the way. Without it, tables stay solid.
