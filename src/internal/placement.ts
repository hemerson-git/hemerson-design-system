/** Space between the trigger and the panel, and the closest the panel gets to the window edge. */
export const GAP = 8;

/**
 * Places a panel under its trigger, or above it when there is no room below. The panel lives
 * in <body> with fixed positioning, so scroll containers (a table, a dialog) never clip it.
 */
export function placePanel(trigger: HTMLElement, panel: HTMLElement, align: "start" | "end") {
  const anchor = trigger.getBoundingClientRect();
  const width = panel.offsetWidth;
  const height = panel.offsetHeight;
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

  const fitsBelow = anchor.bottom + GAP + height <= viewportHeight - GAP;
  const fitsAbove = anchor.top - GAP - height >= GAP;
  const top = fitsBelow || !fitsAbove ? anchor.bottom + GAP : anchor.top - GAP - height;

  const preferredLeft = align === "end" ? anchor.right - width : anchor.left;
  const left = Math.min(Math.max(GAP, preferredLeft), Math.max(GAP, viewportWidth - width - GAP));

  panel.style.top = `${Math.round(top)}px`;
  panel.style.left = `${Math.round(left)}px`;
  panel.dataset.side = fitsBelow || !fitsAbove ? "bottom" : "top";
}
