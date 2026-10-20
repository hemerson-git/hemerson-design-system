import { useEffect, useRef, useState, type ReactNode } from "react";
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

export interface ToastViewProps {
  tone: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  /** Milliseconds before it closes itself; 0 keeps it open. */
  duration: number;
  onClose?: () => void;
  closeLabel: string;
  className?: string;
}

/** One toast: the glass card, its icon and close button, and a timer that pauses on hover or focus. */
export function ToastView({ tone, title, description, duration, onClose, closeLabel, className }: ToastViewProps) {
  const [isPaused, setPaused] = useState(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!duration || isPaused) return;
    const timer = window.setTimeout(() => onCloseRef.current?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, isPaused]);

  return (
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
  );
}
