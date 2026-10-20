import { cx } from "../../internal/cx";
import { Icon } from "../../internal/Icon";

export interface LoadingProps {
  /** sm 16px · md 24px · lg 32px. */
  size?: "sm" | "md" | "lg";
  /** Announced to screen readers. Default "Carregando…". */
  label?: string;
  /** Shows the label beside the spinner. */
  showLabel?: boolean;
  className?: string;
}

/** A spinner that tells assistive technology something is loading. */
export function Loading({ size = "md", label = "Carregando…", showLabel = false, className }: LoadingProps) {
  return (
    <span role="status" className={cx("hds-loading", `hds-loading--${size}`, className)}>
      <Icon name="loader" />
      <span className={showLabel ? undefined : "hds-visually-hidden"}>{label}</span>
    </span>
  );
}
