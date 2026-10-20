import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastView, type ToastTone } from "./ToastView";

export type { ToastTone } from "./ToastView";

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

/**
 * A short glass notice at the bottom of the screen that confirms an action or reports a problem.
 * To raise toasts from anywhere in an app, wrap it in ToastProvider and use `useToast()` instead.
 */
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
  if (!open) return null;

  return createPortal(
    <div className="hds-toast-region">
      <ToastView
        tone={tone}
        title={title}
        description={description}
        duration={duration}
        onClose={onClose}
        closeLabel={closeLabel}
        className={className}
      />
    </div>,
    document.body
  );
}
