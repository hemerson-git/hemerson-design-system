import type { CSSProperties, ReactNode } from "react";

const shape = (style: CSSProperties): CSSProperties => ({ position: "absolute", display: "block", ...style });

/** Brand shapes and real copy behind glass components in stories, so the blur and its legibility show. */
export function GlassScene({ children, minHeight = 280 }: { children: ReactNode; minHeight?: number }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight,
        padding: "var(--space-6)",
        borderRadius: "var(--radius-xl)",
        background: "var(--surface)",
      }}
    >
      <span aria-hidden="true" style={shape({ left: "6%", top: "18%", width: 180, height: 180, borderRadius: "var(--radius-full)", background: "var(--primary-500)" })} />
      <span aria-hidden="true" style={shape({ right: "8%", top: "8%", width: 220, height: 120, borderRadius: "var(--radius-xl)", background: "var(--secondary-500)" })} />
      <span aria-hidden="true" style={shape({ left: "42%", bottom: "6%", width: 260, height: 64, borderRadius: "var(--radius-full)", background: "var(--ink)" })} />
      <p
        aria-hidden="true"
        style={{ position: "absolute", left: "var(--space-6)", right: "var(--space-6)", top: "46%", margin: 0, color: "var(--ink-muted)" }}
      >
        Boleto 000123 · Fulano de Tal · vence em 10/10/2026 · R$ 1.234,56 · pago via Pix · Boleto 000124 · Ciclano · vence em
        15/10/2026 · R$ 89,90
      </p>
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: "var(--space-4)", alignItems: "flex-start" }}>
        {children}
      </div>
    </div>
  );
}
