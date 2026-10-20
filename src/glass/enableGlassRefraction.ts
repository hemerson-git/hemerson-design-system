const SVG = "http://www.w3.org/2000/svg";

/**
 * Adds the SVG filter that makes glass refract its backdrop, and marks
 * `<html data-glass-refraction>` so the styles use it.
 *
 * Only Chromium renders the effect. Firefox accepts it in `@supports` and then
 * drops the whole backdrop-filter, blur included, so other browsers are left alone.
 * Returns whether refraction was turned on.
 */
export function enableGlassRefraction(): boolean {
  if (typeof document === "undefined") return false;

  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands ?? [];
  const isChromium = brands.some(({ brand }) => brand.includes("Chromium"));
  const reducesTransparency = window.matchMedia?.("(prefers-reduced-transparency: reduce)").matches ?? false;

  if (!isChromium || reducesTransparency) return false;

  if (!document.getElementById("hds-glass-defs")) {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("id", "hds-glass-defs");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";

    const filter = document.createElementNS(SVG, "filter");
    const attributes: Record<string, string> = {
      id: "hds-glass-distortion",
      x: "-20%",
      y: "-20%",
      width: "140%",
      height: "140%",
      filterUnits: "objectBoundingBox",
    };
    Object.entries(attributes).forEach(([name, value]) => filter.setAttribute(name, value));

    const steps: Array<[string, Record<string, string>]> = [
      ["feTurbulence", { type: "fractalNoise", baseFrequency: "0.012 0.012", numOctaves: "2", seed: "8", result: "noise" }],
      ["feGaussianBlur", { in: "noise", stdDeviation: "3", result: "blurredNoise" }],
      ["feDisplacementMap", { in: "SourceGraphic", in2: "blurredNoise", scale: "40", xChannelSelector: "R", yChannelSelector: "G" }],
    ];
    for (const [name, values] of steps) {
      const node = document.createElementNS(SVG, name);
      Object.entries(values).forEach(([key, value]) => node.setAttribute(key, value));
      filter.appendChild(node);
    }

    svg.appendChild(filter);
    document.body.appendChild(svg);
  }

  document.documentElement.setAttribute("data-glass-refraction", "");
  return true;
}
