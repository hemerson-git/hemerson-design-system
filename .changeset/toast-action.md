---
"@hemerson/design-system": minor
---

Toasts take an `action`: a text button next to the message, such as `{ label: "Desfazer", onAction }`, that runs and then closes the toast. Closing on its own never runs it. Toasts raised with an action through `useToast().show` stay 10 seconds instead of 5 unless a duration is given, and the timer still pauses on hover and focus.
