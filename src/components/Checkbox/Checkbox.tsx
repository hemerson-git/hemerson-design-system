import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/cx";
import { useFieldIds } from "../../internal/field";
import { Icon } from "../../internal/Icon";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** States the "yes" ("Pago"), never a negative. */
  label: ReactNode;
  hint?: ReactNode;
}

/** A checkbox whose whole label is clickable. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, id, className, ...rest },
  ref
) {
  const ids = useFieldIds(id);

  return (
    <label className={cx("hds-checkbox", className)} htmlFor={ids.id}>
      <span className="hds-checkbox-control">
        <input
          {...rest}
          ref={ref}
          id={ids.id}
          type="checkbox"
          className="hds-checkbox-input"
          aria-describedby={hint ? ids.hint : rest["aria-describedby"]}
        />
        <span className="hds-checkbox-box">
          <Icon name="check" />
        </span>
      </span>
      <span className="hds-checkbox-text">
        {label}
        {hint ? (
          <span id={ids.hint} className="hds-hint">
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
});
