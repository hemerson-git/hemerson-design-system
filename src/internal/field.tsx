import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";

export interface FieldTextProps {
  hint?: ReactNode;
  error?: ReactNode;
  "aria-describedby"?: string;
}

/** Ids for a field and its hint and error, so they can be linked with aria-describedby. */
export function useFieldIds(id?: string) {
  const generated = useId();
  const fieldId = id ?? generated;
  return { id: fieldId, hint: `${fieldId}-hint`, error: `${fieldId}-error` };
}

export function describedBy(props: FieldTextProps, ids: ReturnType<typeof useFieldIds>) {
  const list = [props.hint && ids.hint, props.error && ids.error, props["aria-describedby"]].filter(Boolean);
  return list.length ? list.join(" ") : undefined;
}

export function FieldMessages({ hint, error, ids }: FieldTextProps & { ids: ReturnType<typeof useFieldIds> }) {
  return (
    <>
      {hint ? (
        <p id={ids.hint} className="hds-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={ids.error} className="hds-error">
          <Icon name="circle-x" />
          {error}
        </p>
      ) : null}
    </>
  );
}
