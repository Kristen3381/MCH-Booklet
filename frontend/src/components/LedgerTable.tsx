import React from "react";

export interface LedgerColumn<T> {
  header: string;
  accessorKey?: keyof T;
  className?: string;
  cell?: (item: T) => React.ReactNode;
}

export interface LedgerTableProps<T> {
  title: string;
  subtitle?: string;
  registerCode?: string; // e.g. "CLINIC REGISTER • PART 3"
  columns: LedgerColumn<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export function LedgerTable<T extends { id: string | number }>({
  title,
  subtitle,
  registerCode = "CLINIC REGISTER • PART 3",
  columns,
  data,
  emptyMessage = "No ledger entries recorded yet.",
  className = "",
}: LedgerTableProps<T>) {
  return (
    <div className={`bg-paper-card border border-ink/15 rounded-md overflow-hidden shadow-2xs ${className}`}>
      {/* Ledger Header Bar */}
      <div className="bg-paper-dark/60 px-4 py-3 border-b border-ink/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-heading font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-clay/50 text-ink border border-ink/15">
              {registerCode}
            </span>
          </div>
          <h4 className="font-heading text-lg font-bold text-ink mt-1">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-ink-muted mt-0.5 font-body">{subtitle}</p>
          )}
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs font-tabular text-ink-muted">
            {data.length} {data.length === 1 ? "entry" : "entries"} logged
          </span>
        </div>
      </div>

      {/* Ledger Table Sheet */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink/20 bg-paper-dark/30 text-[11px] font-heading font-bold text-ink-muted uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-2.5 px-4 font-semibold ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 font-body">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-ink-muted italic font-body"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-paper transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3 px-4 align-middle ${col.className || ""}`}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
