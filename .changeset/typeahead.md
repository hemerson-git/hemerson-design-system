---
"@hemerson/design-system": minor
---

New `Typeahead`: a text field that suggests values as you type, such as names already used, in a glass list like `Menu`. Matches ignore case and accents, those that start with the text come first, repeats show once and the matching part is bold. The arrow keys move through the list (wrapping), Enter picks, Escape closes only the list (a dialog around it stays open) and a click picks without losing focus. Any text is still accepted, and it follows the WAI-ARIA combobox pattern.
