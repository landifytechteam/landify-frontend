/**
 * Download rows as a .csv file, straight from the browser.
 * `columns` is [{ header: "Company", value: (row) => row.name }, ...].
 *
 * TODO: if the backend adds export endpoints (e.g. GET /superadmin/companies/export),
 * switch the Export buttons to those so exports include every record server-side.
 */
export function downloadCsv(filename, columns, rows) {
  const escape = (cell) => {
    const text = cell == null ? "" : String(cell);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [
    columns.map((c) => escape(c.header)).join(","),
    ...rows.map((row) => columns.map((c) => escape(c.value(row))).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}