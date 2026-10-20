import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../../internal/cx";
import { GlassPanel } from "../GlassPanel/GlassPanel";

export interface SegmentedOption<T extends string | number = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  /** Accessible name when the label is only an icon or a flag. */
  ariaLabel?: string;
}

export interface SegmentedControlProps<T extends string | number = string> {
  options: SegmentedOption<T>[];
  /** The selected value, for a controlled control. */
  value?: T;
  /** The initially selected value, for an uncontrolled control. */
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** Name of the group. */
  label: string;
  className?: string;
}

const STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/** Switches between two to four exclusive options with a lit thumb that slides between them. */
export function SegmentedControl<T extends string | number = string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const [innerValue, setInnerValue] = useState<T | undefined>(defaultValue ?? options[0]?.value);
  const current = value !== undefined ? value : innerValue;
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const thumb = useRef<HTMLSpanElement>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === current)
  );

  // The thumb is positioned directly on the DOM node: it follows the selected option's size
  useLayoutEffect(() => {
    function measure() {
      const button = buttons.current[selectedIndex];
      if (!button || !thumb.current) return;
      thumb.current.style.width = `${button.offsetWidth}px`;
      thumb.current.style.transform = `translateX(${button.offsetLeft - 4}px)`;
      thumb.current.style.opacity = "1";
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [selectedIndex, options.length]);

  function select(next: T) {
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent) {
    const step = STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    const nextIndex = (selectedIndex + step + options.length) % options.length;
    select(options[nextIndex].value);
    buttons.current[nextIndex]?.focus();
  }

  return (
    <GlassPanel role="radiogroup" aria-label={label} className={cx("hds-segmented", className)} onKeyDown={onKeyDown}>
      <span ref={thumb} className="hds-segmented-thumb" aria-hidden="true" style={{ opacity: 0 }} />
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={String(option.value)}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.ariaLabel}
            tabIndex={isSelected ? 0 : -1}
            className="hds-segmented-option"
            onClick={() => select(option.value)}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </GlassPanel>
  );
}
