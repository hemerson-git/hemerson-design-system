import { forwardRef, useCallback, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/cx";
import { useFieldIds } from "../../internal/field";
import { Icon } from "../../internal/Icon";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** States the "yes" ("Pago"), never a negative. */
  label: ReactNode;
  hint?: ReactNode;
  /**
   * Partly checked: some of what it stands for is, some isn't ("2 de 3 pagos"). Drawn as a box half
   * filled on the diagonal, and read out as mixed. A click still checks or unchecks it, as the
   * browser does: the app decides what that means, and says whether it's still partly checked.
   */
  indeterminate?: boolean;
}

/** A checkbox whose whole label is clickable. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, id, className, indeterminate = false, ...rest },
  ref
) {
  const ids = useFieldIds(id);
  const input = useRef<HTMLInputElement | null>(null);
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      input.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  // A property, not an attribute; set after every render, since the browser clears it on a click
  useEffect(() => {
    input.current!.indeterminate = indeterminate;
  });

  return (
    <label className={cx("hds-checkbox", className)} htmlFor={ids.id}>
      <span className="hds-checkbox-control">
        <input
          {...rest}
          ref={setInput}
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
