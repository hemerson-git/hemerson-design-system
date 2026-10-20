import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { describedBy, FieldMessages, useFieldIds } from "../../internal/field";
import { Icon } from "../../internal/Icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  options: SelectOption[];
  /** Shown as a disabled first option. */
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
}

/** A labelled native dropdown, styled like Input, for choosing one option from a short list. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, hint, error, id, className, ...rest },
  ref
) {
  const ids = useFieldIds(id);

  return (
    <div className={cx("hds-field", className)}>
      <label className="hds-label" htmlFor={ids.id}>
        {label}
      </label>
      <div className="hds-select-wrap">
        <select
          {...rest}
          ref={ref}
          id={ids.id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy({ hint, error, "aria-describedby": rest["aria-describedby"] }, ids)}
          className="hds-select"
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" />
      </div>
      <FieldMessages hint={hint} error={error} ids={ids} />
    </div>
  );
});
