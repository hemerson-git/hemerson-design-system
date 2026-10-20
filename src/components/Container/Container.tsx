import type { ElementType, HTMLAttributes } from "react";
import { cx } from "../../internal/cx";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Default `section`. */
  as?: ElementType;
  /** Adds the sidebar's width as left padding from 768px up. */
  withSidebar?: boolean;
}

/** Centres page content at content-max, with a section's vertical rhythm and the side gutter. */
export function Container({ as: Tag = "section", withSidebar = false, className, ...rest }: ContainerProps) {
  return <Tag {...rest} className={cx("hds-container", withSidebar && "hds-container--with-sidebar", className)} />;
}
