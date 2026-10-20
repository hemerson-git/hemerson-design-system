# Hemerson Design System

[![npm](https://img.shields.io/npm/v/@hemerson/design-system?color=7ea8a7)](https://www.npmjs.com/package/@hemerson/design-system)
[![CI](https://github.com/hemerson-git/hemerson-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/hemerson-git/hemerson-design-system/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook&logoColor=white)](https://hemerson-git.github.io/hemerson-design-system/)
[![License: MIT](https://img.shields.io/badge/license-MIT-78718e)](LICENSE)

A dark-first design system with a sage-teal accent and liquid-glass navigation, built for React. It ships design tokens for a dark and a light theme, a stylesheet, and React components with a Storybook to browse them.

**[Browse the components in Storybook →](https://hemerson-git.github.io/hemerson-design-system/)**

## Install

```bash
npm install @hemerson/design-system
```

React 18.2 or later is required.

```tsx
import "@hemerson/design-system/styles.css";
import { Button } from "@hemerson/design-system";

export function Toolbar() {
  return <Button variant="primary">Novo boleto</Button>;
}
```

- **Themes and transparency:** apps open dark. Call `applyStoredAppearance()` before the first render to restore what the visitor chose last time, and put `ThemeToggle` and `TransparencyToggle` in your toolbar. Without React, `setTheme` and `setTransparency` do the same job. Under the hood these set `data-theme` and `data-transparency` on `<html>`.
- **Toasts:** wrap the app in `ToastProvider` and call `useToast()` to stack up to three at a time.
- **Edge lens:** call `enableGlassRefraction()` from `@hemerson/design-system/glass` once at startup to bend the content at the glass edges in Chromium. Other browsers keep frosted glass.

```ts
// main.tsx, before the first render, so the page never flashes the wrong theme
import { applyStoredAppearance } from "@hemerson/design-system/appearance";

applyStoredAppearance();
```

```tsx
import { ThemeToggle, TransparencyToggle } from "@hemerson/design-system";

<ThemeToggle />          // dark ↔ light, remembered
<TransparencyToggle />   // solid glass, remembered
```

```tsx
import { ToastProvider, useToast } from "@hemerson/design-system";

<ToastProvider>
  <App />
</ToastProvider>;

// anywhere inside
const toast = useToast();
toast.success("Boleto salvo", "Fulano de Tal · R$ 1.234,56");
toast.error("Não foi possível salvar");
```

- **Fonts:** `styles.css` loads Raleway and JetBrains Mono from Google Fonts. To self-host them, import `tokens.css` and your own font files instead.

## What's inside

| Export | Contents |
| --- | --- |
| `@hemerson/design-system` | React components |
| `@hemerson/design-system/appearance` | `applyStoredAppearance()`, `setTheme()`, `setTransparency()`, without React |
| `@hemerson/design-system/glass` | `enableGlassRefraction()`, the Chromium edge lens, without React |
| `@hemerson/design-system/styles.css` | Fonts, tokens and component styles |
| `@hemerson/design-system/tokens.css` | CSS custom properties for both themes |
| `@hemerson/design-system/tokens.json` | The tokens as data |

## Development

```bash
npm install
npm run dev          # Storybook on http://localhost:6006
npm test             # unit tests
npm run typecheck
npm run lint
npm run build        # the package, into dist/
npm run build-storybook
```

Tokens live in [`tokens/tokens.json`](tokens/tokens.json); `npm run tokens` turns them into `src/styles/tokens.css`. Each component lives in `src/components/<Name>/` with its stories and tests.

## Releases

Versions follow [semver](https://semver.org) and are managed with [Changesets](https://github.com/changesets/changesets). Every change to the package comes with a changeset (`npx changeset`). Merging to `master` opens a "version packages" pull request that bumps the version and updates the [changelog](CHANGELOG.md); merging that pull request publishes to npm from GitHub Actions. Storybook redeploys on every push to `master`.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up the project and how contributors are credited.

## Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/github/all-contributors/hemerson-git/hemerson-design-system?color=7ea8a7&style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks to everyone who has contributed ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://hemerson-dev.vercel.app/pt-BR"><img src="https://avatars.githubusercontent.com/u/48595787?v=4?s=100" width="100px;" alt="Hemerson Oliveira"/><br /><sub><b>Hemerson Oliveira</b></sub></a><br /><a href="https://github.com/hemerson-git/hemerson-design-system/commits?author=hemerson-git" title="Code">💻</a> <a href="#design-hemerson-git" title="Design">🎨</a> <a href="https://github.com/hemerson-git/hemerson-design-system/commits?author=hemerson-git" title="Documentation">📖</a> <a href="https://github.com/hemerson-git/hemerson-design-system/commits?author=hemerson-git" title="Tests">⚠️</a> <a href="#infra-hemerson-git" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-hemerson-git" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](LICENSE)
