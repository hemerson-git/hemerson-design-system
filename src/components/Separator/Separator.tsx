import { cx } from "../../internal/cx";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  /** Hides the line from screen readers when it only decorates. */
  decorative?: boolean;
  className?: string;
}

/** A 1px line that divides groups of content. */
export function Separator({ orientation = "horizontal", decorative = false, className }: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cx("hds-separator", `hds-separator--${orientation}`, className)}
    />
  );
}
