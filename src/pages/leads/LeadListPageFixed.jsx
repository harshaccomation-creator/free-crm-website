import { useEffect, useMemo, useState } from 'react';
import { Filter, Loader2, Plus, Search } from 'lucide-react';
import EmployeeShell from '../../components/employee/EmployeeShell.jsx';
import { listLeads } from '../../services/crmApi.js';

const TABS = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PAGE_SIZE = 10;

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function initials(name = '') {
  return String(name || 'Lead').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function normalize(row = {}) {
  const score = Number(row.score || 0) || (row.priority === 'Hot' ? 90 : row.priority === 'Cold' ? 45 : 60);
  return {
    id: row.id,
    name: row.name || 'Not assigned',
    email: row.email || '',
    company: row.company || 'Not assigned',
    source: row.source || 'Website',
    status: row.status || 'New',
    score,
  };
}

export default function LeadListPageFixed() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    listLeads({ limit: 500 })
      .then((rows) => { if (ok) setLeads((rows || []).map(normalize)); })
      .catch(() => { if (ok) setLeads([]); })
      .finally(() => { if (ok) setLoading(false); });
    return () => { ok = false; };
  }, []);

  const counts = useMemo(() => TABS.reduce((a, item) => {
    a[item] = item === 'All' ? leads.length : leads.filter((l) => l.status === item).length;
    return a;
  }, {}), [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const tabOk = tab === 'All' || lead.status === tab;
      const qOk = !q || [lead.name, lead.email, lead.company, lead.source, lead.status].join(' ').toLowerCase().includes(q);
      return tabOk && qOk;
    });
  }, [leads, tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <EmployeeShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Employee Workspace</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">My Leads</h1>
            <p className="mt-2 text-lg text-slate-500">Manage and track your Supabase leads.</p>
          </div>
          <button type="button" className="inline-flex h-12 items-center gap-3 rounded-2xl bg-orange-600 px-7 font-black text-white shadow-lg shadow-orange-500/20">
            <Plus className="h-5 w-5" /> Add Lead
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="font-bold text-slate-500">Total Leads</p><h2 className="mt-1 text-4xl font-black text-slate-900">{loading ? '...' : leads.length}</h2></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="font-bold text-slate-500">Active Leads</p><h2 className="mt-1 text-4xl font-black text-slate-900">{loading ? '...' : leads.filter((l) => !['Won', 'Lost'].includes(l.status)).length}</h2></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="font-bold text-slate-500">Lost Leads</p><h2 className="mt-1 text-4xl font-black text-slate-900">{loading ? '...' : leads.filter((l) => l.status === 'Lost').length}</h2></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="font-bold text-slate-500">Won Leads</p><h2 className="mt-1 text-4xl font-black text-slate-900">{loading ? '...' : leads.filter((l) => l.status === 'Won').length}</h2></div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 pt-5">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {TABS.map((item) => (
                <button key={item} type="button" onClick={() => { setTab(item); setPage(1); }} className={`relative flex items-center gap-2 pb-5 text-base font-black ${tab === item ? 'text-orange-600' : 'text-slate-500'}`}>
                  {item}<span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm">{counts[item] || 0}</span>
                  {tab === item ? <span className="absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-orange-600" /> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <label className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search leads, company, source..." className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold text-slate-800 outline-none" />
              </label>
              <button type="button" className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 font-black text-slate-700"><Filter className="h-5 w-5" /> Filter</button>
            </div>
          </div>

          <div className="w-full overflow-visible">
            <table className="w-full table-fixed text-left">
              <colgroup><col style={{ width: '27%' }} /><col style={{ width: '17%' }} /><col style={{ width: '14%' }} /><col style={{ width: '15%' }} /><col style={{ width: '13%' }} /><col style={{ width: '14%' }} /></colgroup>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4 font-black">Lead</th><th className="px-4 py-4 font-black">Company</th><th className="px-4 py-4 font-black">Source</th><th className="px-4 py-4 font-black">Status</th><th className="px-4 py-4 text-center font-black">Score</th><th className="px-4 py-4 text-center font-black">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-purple-600 font-black text-white">{initials(lead.name)}</div><div className="min-w-0"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="block max-w-[210px] truncate text-left text-base font-black text-slate-900">{lead.name}</button><p className="mt-1 max-w-[210px] truncate text-sm font-semibold text-slate-500">{lead.email}</p></div></div></td>
                    <td className="truncate px-4 py-4 text-base font-black text-slate-900">{lead.company}</td>
                    <td className="truncate px-4 py-4 text-base font-bold text-slate-600">{lead.source}</td>
                    <td className="px-4 py-4"><span className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{lead.status}</span></td>
                    <td className="px-4 py-4 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-base font-black text-emerald-700">{lead.score}</span></td>
                    <td className="relative px-4 py-4 text-center"><button type="button" onClick={() => setMenu(menu === lead.id ? null : lead.id)} className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-xl font-black text-slate-600">⋯</button>{menu === lead.id ? <div className="absolute right-4 top-14 z-[80] w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">View Lead</button><button type="button" onClick={() => go(`/leads/${lead.id}`)} className="w-full px-4 py-3 text-left text-sm font-bold text-orange-600 hover:bg-orange-50">Edit Lead</button></div> : null}</td>
                  </tr>
                ))}
                {loading ? <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500"><Loader2 className="mr-2 inline h-5 w-5 animate-spin" />Loading leads...</td></tr> : null}
                {!loading && rows.length === 0 ? <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No leads found.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </EmployeeShell>
  );
}
