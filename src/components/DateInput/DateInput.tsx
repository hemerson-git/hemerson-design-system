import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/cx";
import { describedBy, FieldMessages, useFieldIds } from "../../internal/field";
import { Icon } from "../../internal/Icon";
import { placePanel } from "../../internal/placement";
import { Button } from "../Button/Button";
import { GlassPanel } from "../GlassPanel/GlassPanel";
import { addDays, addMonths, formatTyped, fromIso, isWithin, monthGrid, parseTyped, toIso } from "./dates";

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "min" | "max"> {
  label: ReactNode;
  /** The date as "yyyy-mm-dd", or "" for none: the format of <input type="date">. */
  value?: string;
  defaultValue?: string;
  /** Called with "yyyy-mm-dd" when a whole valid date is typed or picked, and with "" when the field is cleared. */
  onChange?: (value: string) => void;
  /** Earliest and latest dates that can be picked or typed, as "yyyy-mm-dd". */
  min?: string;
  max?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Locale of the month and weekday names. Default "pt-BR". */
  locale?: string;
  /** First day of the week, 0 for Sunday. Default 0. */
  weekStartsOn?: number;
  /** Accessible names. Defaults in Brazilian Portuguese. */
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

const today = () => toIso(new Date());

/**
 * A date field: type day/month/year, or pick from a glass calendar. The value is "yyyy-mm-dd",
 * and with `name` a hidden input carries it, so forms read it like a native date input.
 */
export function DateInput({
  label,
  value,
  defaultValue = "",
  onChange,
  min,
  max,
  hint,
  error,
  locale = "pt-BR",
  weekStartsOn = 0,
  calendarLabel = "Abrir calendário",
  previousMonthLabel = "Mês anterior",
  nextMonthLabel = "Próximo mês",
  name,
  id,
  disabled,
  required,
  placeholder = "dd/mm/aaaa",
  className,
  ...rest
}: DateInputProps) {
  const ids = useFieldIds(id);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const current = value !== undefined ? value : innerValue;
  const [text, setText] = useState(() => formatTyped(current));
  const [isOpen, setOpen] = useState(false);
  const [focused, setFocused] = useState<Date>(() => fromIso(current) ?? new Date());
  const field = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);

  // Follow a value set from outside, e.g. a form reset
  const [shownValue, setShownValue] = useState(current);
  if (shownValue !== current) {
    setShownValue(current);
    setText(formatTyped(current));
  }

  function commit(next: string) {
    if (value === undefined) setInnerValue(next);
    if (next !== current) onChange?.(next);
  }

  function onType(raw: string) {
    setText(raw);
    if (raw.trim() === "") {
      commit("");
      return;
    }
    const parsed = parseTyped(raw);
    if (parsed && isWithin(parsed, min, max)) commit(parsed);
  }

  function open() {
    setFocused(fromIso(current) ?? fromIso(today()) ?? new Date());
    moveFocus.current = true;
    setOpen(true);
  }

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  }

  function pick(date: Date) {
    const iso = toIso(date);
    if (!isWithin(iso, min, max)) return;
    commit(iso);
    setText(formatTyped(iso));
    close(true);
  }

  // Position under the field, and follow it while the page scrolls or resizes
  useLayoutEffect(() => {
    if (!isOpen || !field.current || !panel.current) return;
    const place = () => {
      if (field.current && panel.current) placePanel(field.current, panel.current, "start");
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [isOpen]);

  // Keyboard focus follows the focused day
  useEffect(() => {
    if (!isOpen || !moveFocus.current) return;
    moveFocus.current = false;
    panel.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  });

  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (field.current?.contains(target) || panel.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  function moveTo(date: Date) {
    moveFocus.current = true;
    setFocused(date);
  }

  function onGridKeyDown(event: KeyboardEvent) {
    const steps: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    moveTo(step());
  }

  function onPanelKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  }

  // "Outubro de 2026": only the first letter, so words like "de" stay lowercase
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focused);
  const monthTitle = monthName.charAt(0).toLocaleUpperCase(locale) + monthName.slice(1);
  const dayName = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const weekdays = monthGrid(focused, weekStartsOn)[0].map((day) => ({
    short: new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(day),
    long: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(day),
  }));
  const focusedIso = toIso(focused);
  const todayIso = today();
  const titleId = `${ids.id}-calendar-title`;

  return (
    <div className={cx("hds-field", className)}>
      <label className="hds-label" htmlFor={ids.id}>
        {label}
      </label>
      <div ref={field} className="hds-date-wrap">
        <input
          {...rest}
          id={ids.id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy({ hint, error, "aria-describedby": rest["aria-describedby"] }, ids)}
          className="hds-input hds-input--numeric hds-date-input"
          onChange={(event) => onType(event.target.value)}
          onBlur={(event) => {
            rest.onBlur?.(event);
            // An incomplete or impossible date goes back to the last valid one
            if (text.trim() !== "" && parseTyped(text) !== current) setText(formatTyped(current));
          }}
        />
        <Button
          ref={button}
          variant="ghost"
          size="sm"
          iconOnly
          icon={<Icon name="calendar" />}
          aria-label={calendarLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          disabled={disabled}
          className="hds-date-button"
          onClick={() => (isOpen ? close(false) : open())}
        />
        {name ? <input type="hidden" name={name} value={current} /> : null}
      </div>
      <FieldMessages hint={hint} error={error} ids={ids} />

      {isOpen
        ? createPortal(
            <GlassPanel
              ref={panel}
              role="dialog"
              tone="thick"
              aria-labelledby={titleId}
              className="hds-date-panel"
              onKeyDown={onPanelKeyDown}
            >
              <div className="hds-date-header">
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  icon={<Icon name="chevron-left" />}
                  aria-label={previousMonthLabel}
                  onClick={() => setFocused(addMonths(focused, -1))}
                />
                <h2 id={titleId} className="hds-date-title" aria-live="polite">
                  {monthTitle}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  icon={<Icon name="chevron-right" />}
                  aria-label={nextMonthLabel}
                  onClick={() => setFocused(addMonths(focused, 1))}
                />
              </div>
              <table role="grid" aria-labelledby={titleId} className="hds-date-grid" onKeyDown={onGridKeyDown}>
                <thead>
                  <tr>
                    {weekdays.map((weekday) => (
                      <th key={weekday.long} scope="col" abbr={weekday.long}>
                        {weekday.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthGrid(focused, weekStartsOn).map((week) => (
                    <tr key={toIso(week[0])}>
                      {week.map((day) => {
                        const iso = toIso(day);
                        const allowed = isWithin(iso, min, max);
                        return (
                          <td key={iso} role="gridcell" aria-selected={iso === current}>
                            <button
                              type="button"
                              tabIndex={iso === focusedIso ? 0 : -1}
                              aria-label={dayName.format(day)}
                              aria-current={iso === todayIso ? "date" : undefined}
                              aria-disabled={allowed ? undefined : true}
                              className={cx(
                                "hds-date-day",
                                day.getMonth() !== focused.getMonth() && "hds-date-day--outside",
                                iso === current && "hds-date-day--selected"
                              )}
                              onClick={() => pick(day)}
                            >
                              {day.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassPanel>,
            document.body
          )
        : null}
    </div>
  );
}
