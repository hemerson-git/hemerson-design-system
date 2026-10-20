import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../../internal/cx";

export type FloatingButtonPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface FloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name and tooltip. */
  label: string;
  position?: FloatingButtonPosition;
}

/** A round glass button fixed to a corner of the viewport, for one persistent action. */
export const FloatingButton = forwardRef<HTMLButtonElement, FloatingButtonProps>(function FloatingButton(
  { label, position = "bottom-right", type = "button", className, ...rest },
  ref
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx("hds-glass", "hds-fab", `hds-fab--${position}`, className)}
    />
  );
});
