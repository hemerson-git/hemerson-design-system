import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/cx";
import { GlassPanel } from "../GlassPanel/GlassPanel";

export interface NavBarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Product or page name on the left. */
  title?: ReactNode;
  /** Buttons on the right. */
  actions?: ReactNode;
  /** Name of the navigation landmark. Default "Principal". */
  navLabel?: string;
}

export interface NavBarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the current page. */
  active?: boolean;
}

function NavBarLink({ active = false, className, ...rest }: NavBarLinkProps) {
  return <a {...rest} aria-current={active ? "page" : undefined} className={cx("hds-navbar-link", className)} />;
}

function NavBarRoot({ title, actions, navLabel = "Principal", className, children, ...rest }: NavBarProps) {
  return (
    <GlassPanel {...rest} as="header" className={cx("hds-navbar", className)}>
      {title ? <p className="hds-navbar-title">{title}</p> : null}
      {children ? (
        <nav className="hds-navbar-nav" aria-label={navLabel}>
          {children}
        </nav>
      ) : null}
      {actions ? <div className="hds-navbar-actions">{actions}</div> : null}
    </GlassPanel>
  );
}

/** The app's top bar: a floating glass capsule with the product name, the main sections and the global actions. */
export const NavBar = Object.assign(NavBarRoot, { Link: NavBarLink });
