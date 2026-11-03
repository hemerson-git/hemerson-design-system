---
"@hemerson/design-system": minor
---

Ready for Next.js and other React Server Components frameworks, with English labels.

- The root entry is marked `"use client"`, so Server Components can render the components. `/appearance` and `/glass` stay usable from server code.
- `appearanceScript`, from `/appearance`, restores the saved theme in an inline `<head>` script before the first paint of a server-rendered page.
- `components.css` and `fonts.css` are published on their own. Self-hosted fonts now work, and the component styles can go into a cascade layer such as Tailwind's `components`. `styles.css` is unchanged.
- The built-in labels are now in English. An app in Portuguese passes the old ones back as props:

| Component | Prop | Was | Now |
| --- | --- | --- | --- |
| `Dialog` | `closeLabel` | Fechar | Close |
| `Toast`, `ToastProvider` | `closeLabel` | Fechar aviso | Close notification |
| `Sidebar` | `label` | Navegação | Navigation |
| `Loading` | `label` | Carregando… | Loading… |
| `ThemeToggle` | `lightLabel` / `darkLabel` | Mudar para o tema claro / escuro | Switch to the light / dark theme |
| `TransparencyToggle` | `label` | Reduzir transparência | Reduce transparency |
| `DateInput` | `calendarLabel` | Abrir calendário | Open calendar |
| `DateInput` | `previousMonthLabel` / `nextMonthLabel` | Mês anterior / Próximo mês | Previous month / Next month |
| `DateInput` | `placeholder` | dd/mm/aaaa | dd/mm/yyyy |
| `DateInput` | `locale` (month and day names) | pt-BR | en-GB |

Dates are still typed day/month/year, and `BarChart` numbers and `Typeahead` matching still default to pt-BR: those are formats, not labels.
