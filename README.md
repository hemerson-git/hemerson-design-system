# Hemerson Design System

A dark-first design system with a sage-teal accent and liquid-glass navigation, built for React. It ships design tokens for a dark and a light theme, a stylesheet, and React components with a Storybook to browse them.

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

- **Themes:** set `data-theme="dark"` (the default) or `data-theme="light"` on `<html>`.
- **Reduced transparency:** set `data-transparency="reduced"` on `<html>` to turn every glass surface solid. Offer it as a setting in your app.
- **Fonts:** `styles.css` loads Raleway and JetBrains Mono from Google Fonts. To self-host them, import `tokens.css` and your own font files instead.

## What's inside

| Export | Contents |
| --- | --- |
| `@hemerson/design-system` | React components |
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
