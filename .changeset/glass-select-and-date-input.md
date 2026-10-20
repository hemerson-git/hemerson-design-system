---
"@hemerson/design-system": minor
---

Glass for the last native popups:

- **`Select`'s open list is glass** in browsers with customizable select (Chromium 135+, Electron 36+), styled like `Menu`, with a checkmark on the chosen option. The select stays native, so the keyboard, screen readers and forms work as before; other browsers keep their own list.
- **New `DateInput`**: type the date as day/month/year or pick it from a glass calendar. The arrow keys move by day and week, Page Up/Down by month (with Shift, by year), Home/End to the start and end of the week, Enter picks and Escape closes. It takes and reports "yyyy-mm-dd" like `<input type="date">`, honours `min` and `max`, marks today, and with `name` sends its value with the form. Labels default to Brazilian Portuguese and month names follow `locale`.
- **Escape inside a dialog** closes an open menu or calendar first, and only the next Escape closes the dialog. Before, one Escape closed both.
