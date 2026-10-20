import type { ReactNode } from "react";
import { cx } from "../../internal/cx";
import { GlassPanel } from "../GlassPanel/GlassPanel";

export interface SidebarItem {
  /** Accessible name and tooltip. */
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  /** Items pinned to the bottom, such as settings. */
  footer?: ReactNode;
  /** A free-floating capsule instead of a rail attached to the edge. */
  floating?: boolean;
  /** Name of the navigation landmark. Default "Navegação". */
  label?: string;
  className?: string;
}

/** A slim glass rail of icon buttons for the app's main sections. */
export function Sidebar({ items, footer, floating = false, label = "Navegação", className }: SidebarProps) {
  return (
    <GlassPanel as="nav" aria-label={label} className={cx("hds-sidebar", floating && "hds-sidebar--floating", className)}>
      <ul className="hds-sidebar-items">
        {items.map((item) => {
          const shared = {
            "aria-label": item.label,
            title: item.label,
            "aria-current": item.active ? ("page" as const) : undefined,
            className: "hds-sidebar-item",
          };
          return (
            <li key={item.label}>
              {item.href ? (
                <a {...shared} href={item.href} onClick={item.onClick}>
                  {item.icon}
                </a>
              ) : (
                <button {...shared} type="button" onClick={item.onClick}>
                  {item.icon}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {footer ? <div className="hds-sidebar-footer">{footer}</div> : null}
    </GlassPanel>
  );
}
