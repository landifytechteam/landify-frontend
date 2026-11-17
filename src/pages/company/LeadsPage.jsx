import { useMemo, useState } from "react";
import { Mail, Phone, Plus, RefreshCw, UserPlus } from "lucide-react";
import { leadsApi, LEAD_STATUSES } from "../../context/leads/leadsApi";
import { useAction, useRequest } from "../../context/hooks";
import { Button, DetailList, ErrorState, FormError, PageHeader, Panel, StatCard, StatGrid, StatusBadge } from "../../components/dashboard/ui";
import { Field, FilterBar, SearchInput, Select } from "../../components/dashboard/controls";
import { DataTable, Pagination, Stacked } from "../../components/dashboard/DataTable";
import { Modal } from "../../components/dashboard/Modal";
import { useToast } from "../../components/dashboard/useToast";
import { downloadCsv } from "../../utils/csv";
import { fullDate, fullDateTime } from "../../utils/format";

const PAGE_SIZE = 10;
const statusLabel = Object.fromEntries(LEAD_STATUSES.map((s) => [s.value, s.label]));
const statusTone = { NEW: "gold", CONTACTED: "grey", QUALIFIED: "grey", CONVERTED: "green", LOST: "red" };

// Each stat card is a group of statuses
const GROUPS = {
  all: () => true,
  new: (l) => l.status === "NEW",
  active: (l) => ["CONTACTED", "QUALIFIED"].includes(l.status),
  converted: (l) => l.status === "CONVERTED",
};

/** /admin/leads: the company's leads (GET/POST/PUT /leads). */
export default function LeadsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useRequest(leadsApi.getLeads, {});
  const update = useAction(leadsApi.updateLead);

  // Status changes show straight away, before the server answers
  const [statusOverrides, setStatusOverrides] = useState({});
  const [group, setGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState(null);

  const leads = useMemo(() => (data ?? []).map((l) => ({ ...l, status: statusOverrides[l.id] ?? l.status })), [data, statusOverrides]);
  const count = (g) => leads.filter(GROUPS[g]).length;

  const q = search.trim().toLowerCase();
  const rows = leads
    .filter(GROUPS[group])
    .filter((l) => !status || l.status === status)
    .filter((l) => !q || `${l.fullName} ${l.email} ${l.phone} ${l.propertyName}`.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const openLead = leads.find((l) => l.id === openId);

  const pickGroup = (g) => {
    setGroup(group === g ? "all" : g);
    setPage(1);
  };

  const changeStatus = async (lead, next) => {
    const before = lead.status;
    setStatusOverrides((o) => ({ ...o, [lead.id]: next }));
    if (await update.run(lead.id, { status: next })) {
      toast(`${lead.fullName} marked as ${statusLabel[next] ?? next}`);
    } else {
      setStatusOverrides((o) => ({ ...o, [lead.id]: before })); // undo on failure
      toast("Couldn't update that lead. Please try again.", "error");
    }
  };

  const exportCsv = () => {
    downloadCsv("landify-leads.csv", [
      { header: "Name", value: (l) => l.fullName },
      { header: "Email", value: (l) => l.email },
      { header: "Phone", value: (l) => l.phone },
      { header: "Status", value: (l) => statusLabel[l.status] ?? l.status },
      { header: "Source", value: (l) => l.source },
      { header: "Property", value: (l) => l.propertyName },
      { header: "Message", value: (l) => l.message },
      { header: "Added", value: (l) => (l.createdAt ? fullDateTime(l.createdAt) : "") },
    ], rows);
    toast(`Exported ${rows.length} leads`);
  };

  const columns = [
    { key: "name", header: "Lead", render: (l) => <Stacked main={l.fullName} sub={l.email} /> },
    { key: "phone", header: "Phone", render: (l) => l.phone || "–" },
    { key: "source", header: "Source", render: (l) => <Stacked main={l.source} sub={l.propertyName} strong={false} /> },
    {
      key: "status",
      header: "Status",
      render: (l) => (
        <div onClick={(e) => e.stopPropagation()} className="w-40">
          <Select value={l.status} onChange={(v) => changeStatus(l, v)} options={LEAD_STATUSES} />
        </div>
      ),
    },
    { key: "added", header: "Added", render: (l) => (l.createdAt ? fullDate(l.createdAt) : "–") },
    {
      key: "contact",
      header: "Contact",
      render: (l) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {l.phone && <a href={`tel:${l.phone}`} className="rounded-md border border-line p-2 text-brand-600 hover:border-brand-600" aria-label={`Call ${l.fullName}`}><Phone className="h-4 w-4" /></a>}
          {l.email && <a href={`mailto:${l.email}`} className="rounded-md border border-line p-2 text-brand-600 hover:border-brand-600" aria-label={`Email ${l.fullName}`}><Mail className="h-4 w-4" /></a>}
        </div>
      ),
    },
  ];

  const noCompany = /company context/i.test(error ?? "");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales pipeline"
        title="Leads"
        subtitle="Website inquiries and leads your team adds, in one place."
        actions={
          <>
            <Button icon={RefreshCw} onClick={reload} loading={loading && Boolean(data)}>Refresh</Button>
            <Button onClick={exportCsv} disabled={!rows.length}>Export</Button>
            <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add lead</Button>
          </>
        }
      />

      <StatGrid>
        <StatCard label="All leads" value={data ? count("all") : undefined} detail="Every lead for your company" active={group === "all"} onClick={() => pickGroup("all")} />
        <StatCard label="New" value={data ? count("new") : undefined} detail="Not contacted yet" active={group === "new"} onClick={() => pickGroup("new")} />
        <StatCard label="In progress" value={data ? count("active") : undefined} detail="Contacted or qualified" active={group === "active"} onClick={() => pickGroup("active")} />
        <StatCard label="Converted" value={data ? count("converted") : undefined} detail="Became clients" active={group === "converted"} onClick={() => pickGroup("converted")} />
      </StatGrid>

      {error && !data ? (
        <ErrorState
          message={noCompany ? "Your account isn't linked to a company yet, so there are no leads to show. Ask a super admin to attach your company." : error}
          onRetry={noCompany ? undefined : reload}
        />
      ) : (
        <Panel title="Lead list" subtitle={`${rows.length} of ${leads.length} leads · Click a lead to see their message`} flush>
          <FilterBar>
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, email, phone or property" />
            <Select value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={LEAD_STATUSES} placeholder="All statuses" className="lg:w-44" />
          </FilterBar>
          <DataTable
            columns={columns}
            rows={pageRows}
            loading={loading && !data}
            onRowClick={(l) => setOpenId(l.id)}
            minWidth={880}
            empty={leads.length ? "No leads match these filters." : "No leads yet. Website inquiries will appear here, or add one yourself."}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={rows.length} onChange={setPage} noun="leads" />
        </Panel>
      )}

      <AddLeadModal
        open={adding}
        onClose={() => setAdding(false)}
        onCreated={(lead) => {
          toast(`${lead.fullName || "Lead"} added`);
          reload();
        }}
      />

      <Modal open={Boolean(openLead)} onClose={() => setOpenId(null)} title={openLead?.fullName} description={openLead?.source}>
        {openLead && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <StatusBadge tone={statusTone[openLead.status]}>{statusLabel[openLead.status] ?? openLead.status}</StatusBadge>
              <Select value={openLead.status} onChange={(v) => changeStatus(openLead, v)} options={LEAD_STATUSES} className="w-44" />
            </div>
            <DetailList
              items={[
                { label: "Email", value: openLead.email },
                { label: "Phone", value: openLead.phone },
                { label: "Property", value: openLead.propertyName },
                { label: "Added", value: openLead.createdAt && fullDateTime(openLead.createdAt) },
              ]}
            />
            <div>
              <p className="text-sm text-body">Message</p>
              <p className="mt-1.5 whitespace-pre-line rounded-lg bg-canvas px-4 py-3 text-sm text-ink">{openLead.message || "No message."}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {openLead.phone && <Button icon={Phone} onClick={() => (window.location.href = `tel:${openLead.phone}`)}>Call</Button>}
              {openLead.email && <Button icon={Mail} onClick={() => (window.location.href = `mailto:${openLead.email}`)}>Email</Button>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AddLeadModal({ open, onClose, onCreated }) {
  return (
    <Modal open={open} onClose={onClose} title="Add lead" description="For people who called, walked in or were referred.">
      {/* Modal renders nothing while closed, so the form starts empty each time */}
      <AddLeadForm onClose={onClose} onCreated={onCreated} />
    </Modal>
  );
}

function AddLeadForm({ onClose, onCreated }) {
  const create = useAction(leadsApi.createLead);
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", status: "NEW" });
  const [touched, setTouched] = useState(false);
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e?.target ? e.target.value : e }));

  const errors = {
    fullName: !values.fullName.trim() && "Enter the lead's name.",
    contact: !values.email.trim() && !values.phone.trim() && "Add an email or a phone number.",
    email: values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email) && "Enter a valid email address.",
  };
  const show = (key) => (touched ? errors[key] || undefined : undefined);

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) return;
    const lead = await create.run({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      status: values.status,
    });
    if (lead) {
      onCreated({ ...lead, fullName: values.fullName.trim() });
      onClose();
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Full name" value={values.fullName} onChange={set("fullName")} error={show("fullName")} />
      <Field label="Email address" type="email" value={values.email} onChange={set("email")} error={show("email")} />
      <Field label="Phone number" type="tel" value={values.phone} onChange={set("phone")} placeholder="+234 801 234 5678" error={show("contact")} />
      <Select label="Status" value={values.status} onChange={set("status")} options={LEAD_STATUSES} />
      <FormError>{create.error}</FormError>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary" icon={UserPlus} loading={create.busy}>Add lead</Button>
      </div>
    </form>
  );
}