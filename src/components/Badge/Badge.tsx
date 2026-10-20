import type { ReactNode } from "react";
import { cx } from "../../internal/cx";
import { Icon, type IconName } from "../../internal/Icon";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONE_ICONS: Partial<Record<BadgeTone, IconName>> = {
  accent: "info",
  success: "circle-check",
  warning: "triangle-alert",
  danger: "circle-x",
};

export interface BadgeProps {
  tone?: BadgeTone;
  /** A Lucide icon, or `false` for none. Status tones show their own icon by default. */
  icon?: ReactNode | false;
  children?: ReactNode;
  className?: string;
}

/**
 * A small pill that states a status or a category in one or two words.
 * The word stays in ink; the tone shows in the icon and the tint, so color never carries the meaning alone.
 */
export function Badge({ tone = "neutral", icon, children, className }: BadgeProps) {
  const defaultIcon = TONE_ICONS[tone];
  const shownIcon = icon === false ? null : (icon ?? (defaultIcon ? <Icon name={defaultIcon} /> : null));

  return (
    <span className={cx("hds-badge", `hds-badge--${tone}`, className)}>
      {shownIcon}
      {children}
    </span>
  );
}
