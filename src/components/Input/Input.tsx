import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/cx";
import { describedBy, FieldMessages, useFieldIds } from "../../internal/field";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Always visible, written as a noun ("Beneficiário"). */
  label: ReactNode;
  hint?: ReactNode;
  /** Says how to fix the value; also marks the input invalid. */
  error?: ReactNode;
  /** Mono, tabular figures and a decimal keyboard, for amounts and codes. */
  numeric?: boolean;
}

/** A labelled text field on a solid, recessed well. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, numeric = false, id, className, ...rest },
  ref
) {
  const ids = useFieldIds(id);

  return (
    <div className={cx("hds-field", className)}>
      <label className="hds-label" htmlFor={ids.id}>
        {label}
      </label>
      <input
        inputMode={numeric ? "decimal" : undefined}
        {...rest}
        ref={ref}
        id={ids.id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ hint, error, "aria-describedby": rest["aria-describedby"] }, ids)}
        className={cx("hds-input", numeric && "hds-input--numeric")}
      />
      <FieldMessages hint={hint} error={error} ids={ids} />
    </div>
  );
});
