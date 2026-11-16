import { LoaderCircle } from "lucide-react";

/**
 * Table driven by a `columns` list, so every screen's table looks the same.
 *
 *   columns = [{ key: "name", header: "Company", render: (row) => ..., className? }]
 *
 * `onRowClick` + `selectedKey` make rows selectable (e.g. the audit log detail).
 * Scrolls sideways on small screens instead of squashing the columns.
 */
export function DataTable({ columns, rows, rowKey = "id", loading, empty = "Nothing matches these filters.", onRowClick, selectedKey, minWidth = 760 }) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="border-y border-line bg-canvas text-xs uppercase tracking-wide text-body">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={`px-5 py-3 font-medium sm:px-6 ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows?.map((row) => {
            const key = row[rowKey];
            const selected = selectedKey === key;
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                aria-selected={onRowClick ? selected : undefined}
                className={`${onRowClick ? "cursor-pointer hover:bg-canvas/70" : ""} ${selected ? "bg-brand-50/60" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 align-middle sm:px-6 ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
          {!loading && rows?.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-body">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && (
        <div className={`flex items-center justify-center bg-white/60 ${rows?.length ? "absolute inset-0" : "py-12"}`}>
          <LoaderCircle className="h-6 w-6 animate-spin text-brand-600" aria-label="Loading" />
        </div>
      )}
    </div>
  );
}

/** Two-line cell: bold main text with a small grey line under it. */
export function Stacked({ main, sub, strong = true }) {
  return (
    <div className="min-w-0">
      <p className={strong ? "font-semibold text-ink" : "text-ink"}>{main}</p>
      {sub && <p className="mt-0.5 text-xs text-body">{sub}</p>}
    </div>
  );
}

/** "Showing 1–10 of 48 properties"  [Previous] 1 2 3 [Next] */
export function Pagination({ page, pageSize, total, onChange, noun = "records" }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const navButton =
    "h-11 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-brand-600 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-body/60 disabled:hover:border-line";

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-body">
        {total <= pageSize ? `Showing all ${total} ${noun}` : `Showing ${from}–${to} of ${total} ${noun}`}
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-2">
          <button type="button" className={navButton} disabled={page === 1} onClick={() => onChange(page - 1)}>
            Previous
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-current={n === page ? "page" : undefined}
              className={`h-11 min-w-11 rounded-md text-sm font-semibold ${n === page ? "bg-brand-600 text-white" : "border border-line bg-white text-ink hover:border-brand-600"}`}
            >
              {n}
            </button>
          ))}
          <button type="button" className={navButton} disabled={page === pages} onClick={() => onChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}