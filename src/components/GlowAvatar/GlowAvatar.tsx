import { cx } from "../../internal/cx";

export interface GlowAvatarProps {
  src: string;
  /** The person's name. */
  alt: string;
  /** Diameter in px. Default 96. */
  size?: number;
  className?: string;
}

/** A round photo ringed in the accent with a soft glow behind it. One per view. */
export function GlowAvatar({ src, alt, size = 96, className }: GlowAvatarProps) {
  return (
    <span className={cx("hds-avatar", className)} style={{ width: size, height: size }}>
      <span className="hds-avatar-glow" aria-hidden="true" />
      <img className="hds-avatar-image" src={src} alt={alt} width={size} height={size} />
    </span>
  );
}
