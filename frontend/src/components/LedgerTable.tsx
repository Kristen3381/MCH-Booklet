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
    <div className={`w-full ${className}`}>
      {/* Clinic Register Section Header (Unboxed, Authentic Registry Sheet Rule) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-tabular tracking-wider uppercase font-semibold text-ink-muted border-b border-ink/30 pb-0.5">
              {registerCode}
            </span>
          </div>
          <h4 className="font-heading text-lg font-bold text-ink">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-ink-muted mt-0.5 font-body">{subtitle}</p>
          )}
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs font-tabular text-ink-muted">
            {data.length} {data.length === 1 ? "entry" : "entries"} logged
          </span>
        </div>
      </div>

      {/* Register Ruled Sheet (Full-width horizontal lines, unboxed, lighter column headers) */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse border-t-2 border-b-2 border-ink/40 text-sm">
          <thead>
            <tr className="border-b border-ink/30 text-xs font-body font-normal text-ink-muted">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-2 px-3.5 font-medium text-ink-muted/90 ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/20 font-body">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-sm text-ink-muted italic font-body"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-ink/[0.02] transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-2.5 px-3.5 align-middle text-ink font-normal ${col.className || ""}`}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? (
                          <span className="font-tabular">
                            {String(item[col.accessorKey] ?? "")}
                          </span>
                        )
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
