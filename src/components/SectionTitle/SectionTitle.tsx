import type { ReactNode } from "react";
import { cx } from "../../internal/cx";

export interface SectionTitleProps {
  children: ReactNode;
  /** Shown zero-padded (3 → "03") before the heading, only when sections are a sequence. */
  index?: number;
  /** Heading level. Default `h2`. */
  as?: "h1" | "h2" | "h3" | "h4";
  id?: string;
  className?: string;
}

/** A page-section heading led by a glowing mono index, the portfolio's signature heading. */
export function SectionTitle({ children, index, as: Tag = "h2", id, className }: SectionTitleProps) {
  return (
    <Tag id={id} className={cx("hds-section-title", className)}>
      {index !== undefined ? (
        <span className="hds-section-index" aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      {children}
    </Tag>
  );
}
