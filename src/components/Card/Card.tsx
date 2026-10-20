import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/cx";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The element to render. Default `article`; use `a` with `href` for a link card. */
  as?: ElementType;
  href?: string;
  /** An uppercase label above the title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  media?: { src: string; alt?: string };
  /** Actions or badges at the bottom. */
  footer?: ReactNode;
  /** The whole card is clickable; it scales up slightly on hover. */
  interactive?: boolean;
}

/** A solid raised block that groups one item's content. */
export function Card({
  as: Tag = "article",
  eyebrow,
  title,
  media,
  footer,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag {...rest} className={cx("hds-card", interactive && "hds-card--interactive", className)}>
      {media ? <img className="hds-card-media" src={media.src} alt={media.alt ?? ""} /> : null}
      <div className="hds-card-body">
        {eyebrow ? <p className="hds-card-eyebrow">{eyebrow}</p> : null}
        {title ? <h3 className="hds-card-title">{title}</h3> : null}
        {children ? <div className="hds-card-text">{children}</div> : null}
      </div>
      {footer ? <div className="hds-card-footer">{footer}</div> : null}
    </Tag>
  );
}
