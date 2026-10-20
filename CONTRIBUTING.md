# Contributing

Thanks for helping improve the design system.

## Set up

```bash
npm install
npm run dev
```

Storybook opens on http://localhost:6006. Use its toolbar to check your change in both themes and with reduced transparency.

## Make a change

1. Fork the repository and create a branch from `master`.
2. Put each component in `src/components/<Name>/`, with its stories (`<Name>.stories.tsx`) and tests (`<Name>.test.tsx`).
3. Use the tokens (`var(--surface)`, `var(--accent)` and so on) instead of literal colors and sizes. Change a token in `tokens/tokens.json`, never in the generated `tokens.css`.
4. Keep glass for navigation and controls; content stays solid. The Introduction page in Storybook lists the rules.
5. If the change affects the published package, add a changeset with `npx changeset`: pick patch, minor or major and write one line for the changelog. [.changeset/README.md](.changeset/README.md) explains which bump to pick. Tests, stories and CI changes need none.
6. Before pushing, run `npm run typecheck`, `npm run lint` and `npm test`. The git hooks run them for you, and CI runs them again on the pull request.
7. Open a pull request that explains what changed and why.

## Get credited

Contributors are listed in the README with [all-contributors](https://allcontributors.org). Once your pull request is merged, comment on it:

```text
@all-contributors please add @<your-username> for code, doc
```

Use the [contribution types](https://allcontributors.org/docs/en/emoji-key) that fit what you did, such as `code`, `design`, `doc`, `test` or `ideas`. The bot opens a pull request that adds you to the README.
