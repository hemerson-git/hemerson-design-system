import { describe, expect, it } from "vitest";
import componentsCss from "./components.css?raw";

// jsdom hides [hidden] on its own whatever the styles say, so ask the sheet which rules would win in a browser
function forcesDisplayNone(element: Element) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(componentsCss.replace(/@import[^;]+;/g, ""));
  return Array.from(sheet.cssRules).some(
    (rule) =>
      rule instanceof CSSStyleRule &&
      element.matches(rule.selectorText) &&
      rule.style.getPropertyValue("display") === "none" &&
      rule.style.getPropertyPriority("display") === "important"
  );
}

describe("the hidden attribute", () => {
  it("beats the display that design system styles set, such as the toast region's flex", () => {
    document.body.innerHTML = `
      <div class="hds-toast-region" hidden></div>
      <button class="hds-button" hidden></button>
    `;

    for (const element of document.body.children) expect(forcesDisplayNone(element)).toBe(true);
  });

  it("leaves visible elements and other people's classes alone", () => {
    document.body.innerHTML = `
      <div class="hds-toast-region"></div>
      <div class="app-banner" hidden></div>
    `;

    for (const element of document.body.children) expect(forcesDisplayNone(element)).toBe(false);
  });
});
