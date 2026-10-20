import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/cx";
import { Icon } from "../../internal/Icon";

export type ButtonVariant = "primary" | "secondary" | "glass" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary (one per view) · secondary · glass (over content or in glass bars) · ghost · danger (destructive). */
  variant?: ButtonVariant;
  /** sm 32px · md 40px · lg 56px, as on the portfolio. */
  size?: ButtonSize;
  /** A Lucide icon, shown before the label. */
  icon?: ReactNode;
  /** Shows only the icon. Requires `aria-label`. */
  iconOnly?: boolean;
  /** Shows a spinner, disables the button and sets `aria-busy`. */
  loading?: boolean;
}

/** Triggers an action. Labels are set uppercase and bold, verb first. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    icon,
    iconOnly = false,
    loading = false,
    disabled,
    type = "button",
    className,
    children,
    ...rest
  },
  ref
) {
  if (iconOnly && !rest["aria-label"] && !rest["aria-labelledby"]) {
    console.warn("Button: an icon-only button needs an aria-label.");
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "hds-btn",
        `hds-btn--${variant}`,
        size !== "md" && `hds-btn--${size}`,
        iconOnly && "hds-btn--icon",
        variant === "glass" && "hds-glass",
        className
      )}
    >
      {loading ? <Icon name="loader" className="hds-spin" /> : icon}
      {iconOnly ? null : children}
    </button>
  );
});
