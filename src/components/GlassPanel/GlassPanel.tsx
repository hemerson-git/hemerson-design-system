import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cx } from "../../internal/cx";

export type GlassTone = "regular" | "clear" | "thick" | "accent";

export interface GlassPanelProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Default `div`. */
  as?: ElementType;
  /**
   * regular (default, the only tone for text) · clear (icon-only controls over the app's own surfaces)
   * · thick (dialogs and sheets) · accent (one prominent floating control per view).
   */
  tone?: GlassTone;
}

/** Liquid glass: the material of every surface that floats above the content. */
export const GlassPanel = forwardRef<HTMLElement, GlassPanelProps>(function GlassPanel(
  { as: Tag = "div", tone = "regular", className, ...rest },
  ref
) {
  return <Tag {...rest} ref={ref} className={cx("hds-glass", tone !== "regular" && `hds-glass--${tone}`, className)} />;
});
