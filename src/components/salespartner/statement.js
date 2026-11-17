import { COMMISSION_STATUSES, statusInfo } from "../../context/salespartner/partnerApi";
import { downloadCsv } from "../../utils/csv";
import { fullDate } from "../../utils/format";

// TODO (backend): a signed PDF statement (e.g. GET /partner/commissions/statement.pdf)
// would be more official. Until then the statement is a CSV built in the browser.

/** Statement = every commission matching the filters, as a CSV the partner can keep. */
export function downloadStatement(rows, filename = "commission-statement.csv") {
  downloadCsv(filename, [
    { header: "Date", value: (c) => fullDate(c.date) },
    { header: "Reference", value: (c) => c.reference },
    { header: "Client", value: (c) => c.clientName },
    { header: "Property", value: (c) => c.propertyName },
    { header: "Amount paid (NGN)", value: (c) => c.amountPaid },
    { header: "Rate", value: (c) => `${Math.round(c.rate * 100)}%` },
    { header: "Commission (NGN)", value: (c) => c.amount },
    { header: "Status", value: (c) => statusInfo(COMMISSION_STATUSES, c.status).label },
  ], rows);
}

