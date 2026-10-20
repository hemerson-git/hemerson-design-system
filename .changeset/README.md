# Changesets

Each file in this folder describes one change that will go into the next release. Add one with every pull request that changes the package:

```bash
npx changeset
```

Pick the bump and write one line for the changelog, from the point of view of someone using the package:

- **patch:** a fix that changes no API ("Dialog returns focus to the button that opened it").
- **minor:** something new, or, while the version is below 1.0, a breaking change ("Add the Tabs component").
- **major:** a breaking change once the package is 1.0 or later.

Changes that don't touch the package (tests, stories, CI) need no changeset.
