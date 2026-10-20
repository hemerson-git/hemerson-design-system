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
import { placePanel } from "../../internal/placement";
import { GlassPanel } from "../GlassPanel/GlassPanel";

export interface TypeaheadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  /** Called with the text on every keystroke and when a suggestion is picked. */
  onChange?: (value: string) => void;
  /** Values to suggest; repeats are shown once. Any text is still accepted. */
  suggestions: string[];
  /** Most suggestions shown at once. Default 8. */
  maxSuggestions?: number;
  hint?: ReactNode;
  error?: ReactNode;
  /** Locale for matching without case. Default "pt-BR". */
  locale?: string;
}

/** Lowercase and without accents, so "sao" finds "São Paulo". */
function fold(text: string, locale: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase(locale);
}

/** The suggestions that contain the text, those that start with it first. */
export function matchSuggestions(suggestions: string[], text: string, locale = "pt-BR", max = 8) {
  const query = fold(text.trim(), locale);
  const unique = [...new Map(suggestions.filter(Boolean).map((s) => [fold(s, locale), s])).values()];
  if (!query) return unique.slice(0, max);
  return unique
    .map((suggestion) => ({ suggestion, at: fold(suggestion, locale).indexOf(query) }))
    .filter(({ suggestion, at }) => at >= 0 && fold(suggestion, locale) !== query)
    .sort((a, b) => (a.at === 0 ? 0 : 1) - (b.at === 0 ? 0 : 1) || a.suggestion.localeCompare(b.suggestion, locale))
    .slice(0, max)
    .map(({ suggestion }) => suggestion);
}

/** The suggestion with the part that matches the text marked. Folding keeps lengths, so indexes line up. */
function Highlight({ text, query, locale }: { text: string; query: string; locale: string }) {
  const at = query.trim() ? fold(text, locale).indexOf(fold(query.trim(), locale)) : -1;
  if (at < 0) return <>{text}</>;
  const end = at + query.trim().length;
  return (
    <>
      {text.slice(0, at)}
      <mark className="hds-typeahead-match">{text.slice(at, end)}</mark>
      {text.slice(end)}
    </>
  );
}

/** A text field that suggests values as you type, in a glass list. Free text is still allowed. */
export function Typeahead({
  label,
  value,
  defaultValue = "",
  onChange,
  suggestions,
  maxSuggestions = 8,
  hint,
  error,
  locale = "pt-BR",
  id,
  className,
  disabled,
  ...rest
}: TypeaheadProps) {
  const ids = useFieldIds(id);
  const listId = `${ids.id}-list`;
  const labelId = `${ids.id}-label`;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const text = value !== undefined ? value : innerValue;
  const [isOpen, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLElement>(null);

  const matches = matchSuggestions(suggestions, text, locale, maxSuggestions);
  const shown = isOpen && matches.length > 0;

  function change(next: string) {
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  }

  function pick(suggestion: string) {
    change(suggestion);
    setOpen(false);
    setActive(-1);
  }

  // Under the field and as wide as it, following it while the page scrolls or resizes
  useLayoutEffect(() => {
    if (!shown || !input.current || !panel.current) return;
    const place = () => {
      if (!input.current || !panel.current) return;
      panel.current.style.width = `${input.current.offsetWidth}px`;
      placePanel(input.current, panel.current, "start");
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [shown, matches.length]);

  useEffect(() => {
    if (!shown || active < 0) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView?.({ block: "nearest" });
  }, [shown, active, listId]);

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    rest.onKeyDown?.(event);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!shown) {
        setOpen(true);
        setActive(event.key === "ArrowDown" ? 0 : matches.length - 1);
        return;
      }
      // Wraps around at both ends
      setActive((current) =>
        event.key === "ArrowDown" ? (current + 1) % matches.length : current <= 0 ? matches.length - 1 : current - 1
      );
    } else if (event.key === "Enter" && shown && active >= 0) {
      event.preventDefault();
      pick(matches[active]);
    } else if (event.key === "Escape" && shown) {
      // Only the list closes; a dialog around the field stays open
      event.preventDefault();
      setOpen(false);
      setActive(-1);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className={cx("hds-field", className)}>
      <label id={labelId} className="hds-label" htmlFor={ids.id}>
        {label}
      </label>
      <input
        // Names and places, not prose: no red underlines (a spellCheck prop still wins)
        spellCheck={false}
        {...rest}
        ref={input}
        id={ids.id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={shown}
        aria-controls={shown ? listId : undefined}
        aria-activedescendant={shown && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ hint, error, "aria-describedby": rest["aria-describedby"] }, ids)}
        className="hds-input"
        disabled={disabled}
        value={text}
        onChange={(event) => {
          change(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          rest.onBlur?.(event);
          setOpen(false);
          setActive(-1);
        }}
      />
      <FieldMessages hint={hint} error={error} ids={ids} />

      {shown
        ? createPortal(
            <GlassPanel ref={panel} id={listId} role="listbox" aria-labelledby={labelId} className="hds-typeahead-panel">
              {matches.map((suggestion, index) => (
                <div
                  key={suggestion}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className="hds-typeahead-option"
                  // Keep focus in the field, so the click doesn't blur it and close the list first
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(suggestion)}
                  onMouseMove={() => setActive(index)}
                >
                  <Highlight text={suggestion} query={text} locale={locale} />
                </div>
              ))}
            </GlassPanel>,
            document.body
          )
        : null}
    </div>
  );
}
