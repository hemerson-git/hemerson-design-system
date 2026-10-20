import { cx } from "./cx";

type Shape = string | { cx: number; cy: number; r: number };

const RING = { cx: 12, cy: 12, r: 10 };

// The few Lucide icons (ISC licence) the components draw themselves: a string is a path,
// an object a circle. Projects pass any other icon from lucide-react.
const ICONS = {
  check: ["M20 6 9 17l-5-5"],
  x: ["M18 6 6 18", "m6 6 12 12"],
  "chevron-down": ["m6 9 6 6 6-6"],
  "circle-check": [RING, "m9 12 2 2 4-4"],
  "circle-x": [RING, "m15 9-6 6", "m9 9 6 6"],
  "triangle-alert": [
    "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
    "M12 9v4",
    "M12 17h.01",
  ],
  info: [RING, "M12 16v-4", "M12 8h.01"],
  loader: ["M21 12a9 9 0 1 1-6.219-8.56"],
  sun: [
    { cx: 12, cy: 12, r: 4 },
    "M12 2v2",
    "M12 20v2",
    "m4.93 4.93 1.41 1.41",
    "m17.66 17.66 1.41 1.41",
    "M2 12h2",
    "M20 12h2",
    "m6.34 17.66-1.41 1.41",
    "m19.07 4.93-1.41 1.41",
  ],
  moon: ["M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"],
  blend: [
    { cx: 9, cy: 9, r: 7 },
    { cx: 15, cy: 15, r: 7 },
  ],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const shapes: Shape[] = ICONS[name];
  return (
    <svg
      className={cx("hds-icon", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes.map((shape, index) =>
        typeof shape === "string" ? <path key={index} d={shape} /> : <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} />
      )}
    </svg>
  );
}
