import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastView, type ToastTone } from "./ToastView";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before it closes itself; 0 keeps it open until dismissed. Default 5000. */
  duration?: number;
}

export interface ToastApi {
  /** Shows a toast and returns its id, for `dismiss`. */
  show: (options: ToastOptions) => string;
  success: (title: ReactNode, description?: ReactNode) => string;
  error: (title: ReactNode, description?: ReactNode) => string;
  warning: (title: ReactNode, description?: ReactNode) => string;
  info: (title: ReactNode, description?: ReactNode) => string;
  dismiss: (id: string) => void;
}

interface QueuedToast extends Required<Pick<ToastOptions, "tone" | "duration">> {
  id: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Most toasts shown at once; the oldest goes first. Default 3. */
  max?: number;
  /** Accessible name of each close button. Default "Fechar aviso". */
  closeLabel?: string;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Shows the toasts raised with `useToast()` anywhere inside it, stacked at the bottom of the screen. */
export function ToastProvider({ children, max = 3, closeLabel = "Fechar aviso" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<QueuedToast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    ({ title, description, tone = "neutral", duration = 5000 }: ToastOptions) => {
      const id = `hds-toast-${++nextId.current}`;
      setToasts((current) => [...current, { id, title, description, tone, duration }].slice(-max));
      return id;
    },
    [max]
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (title, description) => show({ title, description, tone: "success" }),
      error: (title, description) => show({ title, description, tone: "danger" }),
      warning: (title, description) => show({ title, description, tone: "warning" }),
      info: (title, description) => show({ title, description, tone: "neutral" }),
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.length
        ? createPortal(
            <div className="hds-toast-region">
              {toasts.map((toast) => (
                <ToastView
                  key={toast.id}
                  tone={toast.tone}
                  title={toast.title}
                  description={toast.description}
                  duration={toast.duration}
                  closeLabel={closeLabel}
                  onClose={() => dismiss(toast.id)}
                />
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

/** Raises toasts from anywhere inside a ToastProvider: `toast.success("Boleto salvo")`. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside a ToastProvider.");
  return api;
}
