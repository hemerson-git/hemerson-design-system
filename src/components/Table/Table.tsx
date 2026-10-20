import type { ReactNode } from "react";
import { cx } from "../../internal/cx";

export interface TableColumn<Row> {
  key: string;
  header: ReactNode;
  /** Mono, tabular figures, right-aligned. */
  numeric?: boolean;
  align?: "start" | "center";
  /** Renders the cell from the row; by default the cell shows `row[key]`. */
  render?: (row: Row) => ReactNode;
}

export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Key of each row's unique id. Default `id`. */
  rowKey?: keyof Row & string;
  /** Names the table and its scroll region. */
  caption?: string;
  /** Keeps the caption for screen readers only. */
  hideCaption?: boolean;
  /** Shown when there are no rows. Default "Nada para mostrar.". */
  empty?: ReactNode;
  maxHeight?: number | string;
  /** Regular glass instead of a solid surface, for a table over the app's background rather than over other content. */
  glass?: boolean;
  className?: string;
}

function cellClass<Row>(column: TableColumn<Row>) {
  if (column.numeric) return "hds-cell--numeric";
  return column.align === "center" ? "hds-cell--center" : undefined;
}

/** A data table with a sticky header, roomy rows and aligned numbers, on a solid surface or on glass. */
export function Table<Row extends object>({
  columns,
  rows,
  rowKey = "id" as keyof Row & string,
  caption,
  hideCaption = false,
  empty = "Nada para mostrar.",
  maxHeight,
  glass = false,
  className,
}: TableProps<Row>) {
  return (
    <div
      className={cx("hds-table-wrap", "hds-scroll", glass && "hds-glass hds-table-wrap--glass", className)}
      role="region"
      aria-label={caption}
      tabIndex={0}
      style={maxHeight !== undefined ? { maxHeight } : undefined}
    >
      <table className="hds-table">
        {caption ? <caption className={hideCaption ? "hds-visually-hidden" : undefined}>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={cellClass(column)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={String(row[rowKey] ?? index)}>
                {columns.map((column) => (
                  <td key={column.key} className={cellClass(column)}>
                    {column.render ? column.render(row) : (row[column.key as keyof Row] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1} className="hds-table-empty">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
