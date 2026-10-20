import { lensDisplacementMap, lensSettings } from "./lens";

const SVG = "http://www.w3.org/2000/svg";
const GLASS = ".hds-glass:not(.hds-glass--thick)";

let defs: SVGSVGElement | null = null;
const filters = new Map<string, string>();

function isChromium() {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands ?? [];
  return brands.some(({ brand }) => brand.includes("Chromium"));
}

function ensureDefs() {
  if (defs?.isConnected) return defs;
  defs = document.createElementNS(SVG, "svg");
  defs.setAttribute("id", "hds-glass-defs");
  defs.setAttribute("width", "0");
  defs.setAttribute("height", "0");
  defs.setAttribute("aria-hidden", "true");
  defs.style.position = "absolute";
  document.body.appendChild(defs);
  return defs;
}

/** One SVG filter per element size and corner radius, shared by elements that match. */
function filterFor(width: number, height: number, radius: number): string | null {
  const key = `${width}x${height}r${radius}`;
  const existing = filters.get(key);
  if (existing) return existing;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const { rim, scale } = lensSettings(height);
  const image = context.createImageData(width, height);
  image.data.set(lensDisplacementMap(width, height, radius, rim));
  context.putImageData(image, 0, 0);

  const id = `hds-glass-lens-${filters.size}`;
  const filter = document.createElementNS(SVG, "filter");
  const attributes: Record<string, string> = {
    id,
    x: "0",
    y: "0",
    width: String(width),
    height: String(height),
    filterUnits: "userSpaceOnUse",
    "color-interpolation-filters": "sRGB",
  };
  Object.entries(attributes).forEach(([name, value]) => filter.setAttribute(name, value));

  const map = document.createElementNS(SVG, "feImage");
  map.setAttribute("href", canvas.toDataURL());
  map.setAttribute("x", "0");
  map.setAttribute("y", "0");
  map.setAttribute("width", String(width));
  map.setAttribute("height", String(height));
  map.setAttribute("result", "map");

  const displace = document.createElementNS(SVG, "feDisplacementMap");
  displace.setAttribute("in", "SourceGraphic");
  displace.setAttribute("in2", "map");
  displace.setAttribute("scale", scale.toFixed(2));
  displace.setAttribute("xChannelSelector", "R");
  displace.setAttribute("yChannelSelector", "G");

  filter.append(map, displace);
  ensureDefs().appendChild(filter);
  filters.set(key, id);
  return id;
}

function applyLens(element: HTMLElement) {
  const width = Math.round(element.offsetWidth);
  const height = Math.round(element.offsetHeight);
  if (width < 8 || height < 8) return;

  const radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
  const id = filterFor(width, height, Math.min(radius, height / 2));
  if (id) element.style.setProperty("--hds-glass-lens", `url(#${id})`);
}

let active = false;

/**
 * Turns on the edge lens: glass bends the backdrop near its rim, like Apple's Liquid Glass.
 * Every glass element present now or added later gets a lens sized to it.
 *
 * Only Chromium renders SVG filters in backdrop-filter. Firefox accepts them and then
 * drops the whole backdrop-filter, blur included, so other browsers keep plain frosted
 * glass. Nothing happens when the user reduces transparency.
 * Returns whether the lens was turned on.
 */
export function enableGlassRefraction(): boolean {
  if (typeof document === "undefined") return false;

  const reducesTransparency = window.matchMedia?.("(prefers-reduced-transparency: reduce)").matches ?? false;
  if (!isChromium() || reducesTransparency) return false;
  if (active) return true;
  active = true;

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) applyLens(entry.target as HTMLElement);
  });
  const watch = (root: ParentNode) => {
    root.querySelectorAll<HTMLElement>(GLASS).forEach((element) => {
      applyLens(element);
      resizeObserver.observe(element);
    });
  };

  watch(document);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(GLASS)) {
          applyLens(node);
          resizeObserver.observe(node);
        }
        watch(node);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });

  document.documentElement.setAttribute("data-glass-refraction", "");
  return true;
}
