---
"@hemerson/design-system": minor
---

New `BarChart` for comparing a few values: `vertical` for values over time, `horizontal` for rankings. Several series stack in each bar with a legend, coloured with the theme's tones, and `formatValue` sets how values read (e.g. as reais). The bars are hidden from screen readers, which get the same numbers as a table; the figure is named by its title, and an `empty` message replaces the bars when there is no data.
