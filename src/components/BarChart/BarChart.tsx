import { useId, type ReactNode } from "react";
import { cx } from "../../internal/cx";

export type ChartTone = "accent" | "secondary" | "success" | "warning" | "danger" | "neutral";

export interface ChartSeries {
  name: string;
  /** Default: accent, then secondary, warning and so on, in order. */
  tone?: ChartTone;
}

export interface ChartDatum {
  label: string;
  /** One value per series, in the same order. */
  values: number[];
}

export interface BarChartProps {
  /** Names the chart: shown above it and used as the accessible name. */
  title: ReactNode;
  data: ChartDatum[];
  /** One series by default; several stack in each bar, with a legend. */
  series?: ChartSeries[];
  /** `vertical`: bars rise from a baseline, for time. `horizontal`: one row per label, for rankings. Default `vertical`. */
  orientation?: "vertical" | "horizontal";
  /** How values read in labels and in the data table. Default: the number in pt-BR. */
  formatValue?: (value: number) => string;
  /** Shown instead of the bars when there is no data. Default "Nada para mostrar.". */
  empty?: ReactNode;
  /** Height of the bar area in vertical charts, in px. Default 200. */
  height?: number;
  className?: string;
}

const TONES: ChartTone[] = ["accent", "secondary", "warning", "success", "danger", "neutral"];
const defaultFormat = (value: number) => value.toLocaleString("pt-BR");

/**
 * Bars for comparing a few values: a vertical chart over time, or a horizontal ranking.
 * Several series stack in each bar. The bars are drawn for sighted users and hidden from
 * screen readers, which get the same numbers as a table.
 */
export function BarChart({
  title,
  data,
  series = [{ name: "Valor" }],
  orientation = "vertical",
  formatValue = defaultFormat,
  empty = "Nada para mostrar.",
  height = 200,
  className,
}: BarChartProps) {
  const titleId = useId();
  const tones = series.map((item, index) => item.tone ?? TONES[index % TONES.length]);
  const total = (datum: ChartDatum) => datum.values.reduce((sum, value) => sum + Math.max(0, value), 0);
  const max = Math.max(0, ...data.map(total));
  const share = (value: number) => (max > 0 ? (Math.max(0, value) / max) * 100 : 0);
  const stacked = series.length > 1;

  return (
    <figure aria-labelledby={titleId} className={cx("hds-chart", `hds-chart--${orientation}`, className)}>
      <figcaption id={titleId} className="hds-chart-title">
        {title}
      </figcaption>

      {data.length === 0 || max === 0 ? (
        <p className="hds-chart-empty">{empty}</p>
      ) : (
        <>
          {stacked ? (
            <ul className="hds-chart-legend" aria-hidden="true">
              {series.map((item, index) => (
                <li key={item.name}>
                  <span className={cx("hds-chart-swatch", `hds-chart-tone--${tones[index]}`)} />
                  {item.name}
                </li>
              ))}
            </ul>
          ) : null}

          {orientation === "vertical" ? (
            <div className="hds-chart-columns" aria-hidden="true" style={{ height }}>
              {data.map((datum) => (
                <div key={datum.label} className="hds-chart-column">
                  <div className="hds-chart-plot">
                    <span className="hds-chart-value">{formatValue(total(datum))}</span>
                    <div className="hds-chart-stack" style={{ height: `${share(total(datum))}%` }}>
                      {datum.values.map((value, index) =>
                        value > 0 ? (
                          <span
                            key={series[index]?.name ?? index}
                            className={cx("hds-chart-bar", `hds-chart-tone--${tones[index]}`)}
                            style={{ flexGrow: value }}
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                  <span className="hds-chart-label">{datum.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="hds-chart-rows" aria-hidden="true">
              {data.map((datum) => (
                <div key={datum.label} className="hds-chart-row">
                  <span className="hds-chart-label">{datum.label}</span>
                  <div className="hds-chart-track">
                    <div className="hds-chart-stack" style={{ width: `${share(total(datum))}%` }}>
                      {datum.values.map((value, index) =>
                        value > 0 ? (
                          <span
                            key={series[index]?.name ?? index}
                            className={cx("hds-chart-bar", `hds-chart-tone--${tones[index]}`)}
                            style={{ flexGrow: value }}
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                  <span className="hds-chart-value">{formatValue(total(datum))}</span>
                </div>
              ))}
            </div>
          )}

          <table className="hds-visually-hidden">
            <thead>
              <tr>
                <th scope="col">{typeof title === "string" ? title : ""}</th>
                {series.map((item) => (
                  <th key={item.name} scope="col">
                    {item.name}
                  </th>
                ))}
                {stacked ? <th scope="col">Total</th> : null}
              </tr>
            </thead>
            <tbody>
              {data.map((datum) => (
                <tr key={datum.label}>
                  <th scope="row">{datum.label}</th>
                  {series.map((item, index) => (
                    <td key={item.name}>{formatValue(datum.values[index] ?? 0)}</td>
                  ))}
                  {stacked ? <td>{formatValue(total(datum))}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </figure>
  );
}
