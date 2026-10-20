import { cx } from "./cx";

// The few Lucide icons (ISC licence) the components draw themselves.
// Projects pass any other icon from lucide-react.
const ICONS = {
  check: ["M20 6 9 17l-5-5"],
  x: ["M18 6 6 18", "m6 6 12 12"],
  "chevron-down": ["m6 9 6 6 6-6"],
  "circle-check": ["circle", "m9 12 2 2 4-4"],
  "circle-x": ["circle", "m15 9-6 6", "m9 9 6 6"],
  "triangle-alert": [
    "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
    "M12 9v4",
    "M12 17h.01",
  ],
  info: ["circle", "M12 16v-4", "M12 8h.01"],
  loader: ["M21 12a9 9 0 1 1-6.219-8.56"],
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
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
      {ICONS[name].map((shape) =>
        shape === "circle" ? <circle key={shape} cx={12} cy={12} r={10} /> : <path key={shape} d={shape} />
      )}
    </svg>
  );
}
