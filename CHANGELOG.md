# @hemerson/design-system

## 0.2.0

### Minor Changes

- [#1](https://github.com/hemerson-git/hemerson-design-system/pull/1) [`7a85386`](https://github.com/hemerson-git/hemerson-design-system/commit/7a853868d0e4d44ee62dedcfbe1fa7414e590d07) Thanks [@hemerson-git](https://github.com/hemerson-git)! - Glass now looks like Apple's Liquid Glass: a lighter tint (30% in dark, 20% in light) so the content behind shows through, a lighter blur, a lit two-tone rim, an inner glow and a text shadow for legibility. In Chromium, `enableGlassRefraction()` now bends the backdrop at each element's edges with a lens sized to it, replacing the noise distortion, and it is also available without React from `@hemerson/design-system/glass`. Dialog and toast text now uses the design system font.

## 0.1.0

### Minor Changes

- First release: tokens for a dark and a light theme, the liquid-glass stylesheet, and 21 React components (GlassPanel, Button, NavBar, Sidebar, SegmentedControl, Menu, FloatingButton, Dialog, Toast, Input, Select, Checkbox, Card, Badge, Table, Container, SectionTitle, Separator, ScrollArea, Loading and GlowAvatar), with `enableGlassRefraction` for refraction in Chromium.
