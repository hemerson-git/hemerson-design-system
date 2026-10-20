import type { HTMLAttributes } from "react";
import { cx } from "../../internal/cx";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the region. */
  label: string;
  maxHeight?: number | string;
}

/** A focusable scrollable region with the brand's slim scrollbars. */
export function ScrollArea({ label, maxHeight, className, style, ...rest }: ScrollAreaProps) {
  return (
    <div
      {...rest}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cx("hds-scroll", className)}
      style={{ maxHeight, ...style }}
    />
  );
}
