import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/cx";
import { Button, type ButtonVariant } from "../Button/Button";
import { GlassPanel } from "../GlassPanel/GlassPanel";
import { placePanel } from "../../internal/placement";

export type MenuItem =
  | { label: string; icon?: ReactNode; onSelect?: () => void; danger?: boolean; separator?: never }
  | { separator: true };

export interface MenuProps {
  /** Trigger text, or its accessible name with `iconOnly`. */
  label: string;
  icon?: ReactNode;
  iconOnly?: boolean;
  items: MenuItem[];
  /** Which edge of the trigger the list lines up with. Default `end`. */
  align?: "start" | "end";
  /** Default `glass`. */
  triggerVariant?: ButtonVariant;
  className?: string;
}

/** A button that opens a glass list of actions. */
export function Menu({ label, icon, iconOnly = false, items, align = "end", triggerVariant = "glass", className }: MenuProps) {
  const [isOpen, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const id = useId();

  const menuItems = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  }

  // Position before the first paint, then follow the trigger while the page scrolls or resizes
  useLayoutEffect(() => {
    if (!isOpen || !trigger.current || !panel.current) return;
    const place = () => {
      if (trigger.current && panel.current) placePanel(trigger.current, panel.current, align);
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [isOpen, align]);

  useEffect(() => {
    if (!isOpen) return;
    menuItems()[0]?.focus();

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (trigger.current?.contains(target) || panel.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  function onKeyDown(event: KeyboardEvent) {
    const list = menuItems();
    const index = list.indexOf(document.activeElement as HTMLElement);

    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") {
      // The list sits at the end of <body>, so let focus return to the trigger's place
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      list[(index + step + list.length) % list.length]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      (event.key === "Home" ? list[0] : list[list.length - 1])?.focus();
    }
  }

  return (
    <div className={cx("hds-menu", className)}>
      <Button
        ref={trigger}
        variant={triggerVariant}
        icon={icon}
        iconOnly={iconOnly}
        aria-label={iconOnly ? label : undefined}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? id : undefined}
        onClick={() => setOpen(!isOpen)}
      >
        {label}
      </Button>

      {isOpen
        ? createPortal(
            <GlassPanel
              ref={panel}
              id={id}
              role="menu"
              aria-label={label}
              className="hds-menu-panel"
              onKeyDown={onKeyDown}
            >
              {items.map((item, index) =>
                item.separator ? (
                  <div key={`separator-${index}`} role="separator" className="hds-menu-separator" />
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    className={cx("hds-menu-item", item.danger && "hds-menu-item--danger")}
                    onClick={() => {
                      close(true);
                      item.onSelect?.();
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )
              )}
            </GlassPanel>,
            document.body
          )
        : null}
    </div>
  );
}
