import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/cx";
import { Icon, type IconName } from "../../internal/Icon";
import { Button } from "../Button/Button";
import { GlassPanel } from "../GlassPanel/GlassPanel";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

const TONE_ICONS: Record<ToastTone, IconName> = {
  neutral: "info",
  success: "circle-check",
  warning: "triangle-alert",
  danger: "circle-x",
};

export interface ToastProps {
  open: boolean;
  onClose?: () => void;
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  /** Milliseconds before it closes itself; 0 keeps it open. Default 5000. */
  duration?: number;
  /** Accessible name of the close button. Default "Fechar aviso". */
  closeLabel?: string;
  className?: string;
}

/** A short glass notice at the bottom of the screen that confirms an action or reports a problem. */
export function Toast({
  open,
  onClose,
  tone = "neutral",
  title,
  description,
  duration = 5000,
  closeLabel = "Fechar aviso",
  className,
}: ToastProps) {
  const [isPaused, setPaused] = useState(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // The timer pauses while the pointer or focus is on the toast
  useEffect(() => {
    if (!open || !duration || isPaused) return;
    const timer = window.setTimeout(() => onCloseRef.current?.(), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, isPaused]);

  if (!open) return null;

  return createPortal(
    <div className="hds-toast-region">
      <GlassPanel
        role={tone === "danger" ? "alert" : "status"}
        className={cx("hds-toast", `hds-toast--${tone}`, className)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <Icon name={TONE_ICONS[tone]} />
        <div className="hds-toast-body">
          <p className="hds-toast-title">{title}</p>
          {description ? <p className="hds-toast-description">{description}</p> : null}
        </div>
        {onClose ? (
          <Button variant="ghost" size="sm" iconOnly icon={<Icon name="x" />} aria-label={closeLabel} onClick={onClose} />
        ) : null}
      </GlassPanel>
    </div>,
    document.body
  );
}
