import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/cx";
import { Icon } from "../../internal/Icon";
import { Button } from "../Button/Button";
import { GlassPanel } from "../GlassPanel/GlassPanel";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  open: boolean;
  /** Called on Escape, on the close button and on a click outside the panel. */
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** The buttons, main action last. */
  footer?: ReactNode;
  /** Accessible name of the close button. Default "Fechar". */
  closeLabel?: string;
  /** `panel` focuses the panel itself instead of its first control. */
  initialFocus?: "first" | "panel";
  /** md (default, 560px) for forms and confirmations · lg (880px) for wide content such as a print preview. */
  size?: "md" | "lg";
  className?: string;
}

/** A modal panel of thick glass for a focused task or a confirmation. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel = "Fechar",
  initialFocus = "first",
  size = "md",
  className,
}: DialogProps) {
  const panel = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Always call the latest onClose, even from listeners added when the dialog opened
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [];
    const target = initialFocus === "panel" || focusables.length === 0 ? panel.current : focusables[0];
    target?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;

      const list = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open, initialFocus]);

  if (!open) return null;

  return createPortal(
    <div
      className="hds-scrim"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <GlassPanel
        ref={panel}
        tone="thick"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx("hds-dialog", size !== "md" && `hds-dialog--${size}`, className)}
      >
        <div className="hds-dialog-header">
          <div>
            <h2 id={titleId} className="hds-dialog-title">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="hds-dialog-description">
                {description}
              </p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" iconOnly icon={<Icon name="x" />} aria-label={closeLabel} onClick={onClose} />
        </div>
        {children}
        {footer ? <div className="hds-dialog-footer">{footer}</div> : null}
      </GlassPanel>
    </div>,
    document.body
  );
}
