import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  Kanban,
  ListFilter,
  DollarSign,
  TrendingDown,
  User,
  ArrowRight,
  Zap,
  Tag,
  FolderPlus,
  Search
} from 'lucide-react';

interface LeadsMonitorProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onDeployWonLeadAsTenant: (lead: Lead) => void; // magical onboarding
  selectedLeadId?: string; // from search
}

export default function LeadsMonitor({
  leads,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  onDeployWonLeadAsTenant,
  selectedLeadId
}: LeadsMonitorProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [value, setValue] = useState(5000);
  const [source, setSource] = useState('Google search');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.New);
  const [notes, setNotes] = useState('');

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setCompanyName(lead.companyName);
    setContactName(lead.contactName);
    setContactEmail(lead.contactEmail);
    setValue(lead.value);
    setSource(lead.source);
    setStatus(lead.status);
    setNotes(lead.notes);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !contactEmail) {
      alert('Please fill out all required fields');
      return;
    }

    onAddLead({
      companyName,
      contactName,
      contactEmail,
      value,
      source,
      status,
      notes
    });

    // Reset
    setCompanyName('');
    setContactName('');
    setContactEmail('');
    setValue(5000);
    setSource('Search engine');
    setStatus(LeadStatus.New);
    setNotes('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    onUpdateLead({
      ...editingLead,
      companyName,
      contactName,
      contactEmail,
      value,
      source,
      status,
      notes
    });
    setShowEditModal(false);
    setEditingLead(null);
  };

  // Quick move lead stage column helper
  const handleQuickMove = (lead: Lead, nextStatus: LeadStatus) => {
    onUpdateLead({
      ...lead,
      status: nextStatus
    });
  };

  // Columns for Kanban
  const kanbanColumns: { id: LeadStatus; label: string; color: string; border: string }[] = [
    { id: LeadStatus.New, label: 'Uncontacted Inbounds', color: 'bg-indigo-950/40 text-indigo-350', border: 'border-indigo-800/40' },
    { id: LeadStatus.Contacted, label: 'Lead Contacted', color: 'bg-blue-950/40 text-blue-355', border: 'border-blue-800/40' },
    { id: LeadStatus.Proposal, label: 'Draft Proposal', color: 'bg-purple-950/40 text-purple-350', border: 'border-purple-800/40' },
    { id: LeadStatus.Negotiating, label: 'In Negotiation', color: 'bg-amber-950/40 text-amber-350', border: 'border-amber-800/40' },
    { id: LeadStatus.Won, label: 'Won Deal 🎉', color: 'bg-emerald-950/40 text-emerald-350', border: 'border-emerald-800/40' },
    { id: LeadStatus.Lost, label: 'Lost Lead ✖', color: 'bg-rose-950/40 text-rose-350', border: 'border-rose-800/40' }
  ];

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSelectedId = selectedLeadId ? l.id === selectedLeadId : true;

    return matchesSearch && matchesSelectedId;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            CRM Lead Funnel & Dealflow
          </h2>
          <p className="text-xs text-slate-500">
            Monitor qualification funnels, change stages, set potential deals, and generate mock customer databases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher */}
          <div className="flex bg-slate-100 border border-slate-200 rounded p-1 text-[11px] font-bold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pipeline Visuals
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tabular Grid
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#3b82f6] hover:bg-blue-600 text-white px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Log New CRM Deal
          </button>
        </div>
      </div>

      {/* Internal Search bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals, representatives, sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Kanban Layout representation */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const columnLeads = filteredLeads.filter((l) => l.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-[#111827]/70 border border-slate-800 rounded-lg p-3 flex flex-col min-w-56"
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3.5 border-b border-slate-800/60 pb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="font-mono text-slate-400 text-[10px] font-bold bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-705/30">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column cards bucket */}
                <div className="flex-1 space-y-3 max-h-[500px] overflow-y-auto pr-0.5">
                  {columnLeads.length === 0 ? (
                    <div className="h-24 border border-dashed border-slate-800 rounded flex items-center justify-center text-center text-[10px] text-slate-500 font-bold p-4">
                      Empty stage
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow rounded-md p-3.5 flex flex-col gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] group cursor-grab relative"
                      >
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-xs leading-snug">
                            {lead.companyName}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-mono font-bold mt-1">
                            ₹{lead.value.toLocaleString()}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 border-t border-slate-100 pt-2 font-sans">
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate font-semibold">{lead.contactName}</span>
                        </div>

                        {/* Notes snippet */}
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed italic">
                          "{lead.notes || 'No custom deal criteria configured'}"
                        </p>

                        {/* Quick Action options inside individual cards */}
                        <div className="flex items-center justify-between mt-1 pt-1">
                          <span className="text-[8px] bg-slate-100 text-slate-500 font-bold font-mono py-0.5 px-1.5 rounded">
                            {lead.source}
                          </span>

                          <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* If WON, show magic Deploy button! */}
                            {lead.status === LeadStatus.Won && (
                              <button
                                onClick={() => onDeployWonLeadAsTenant(lead)}
                                className="p-1 text-emerald-700 hover:text-white hover:bg-emerald-600 rounded bg-emerald-50 border border-emerald-250 cursor-pointer text-[9px] font-bold flex items-center gap-0.5 transition-colors"
                                title="Onboard / Convert to Subscription Tenant Now!"
                              >
                                <FolderPlus className="h-3 w-3" /> Convert
                              </button>
                            )}

                            <button
                              onClick={() => openEditModal(lead)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-150 bg-slate-50 rounded border border-slate-200 cursor-pointer"
                              title="Edit Deal Settings"
                            >
                              <Edit2 className="h-2.5 w-2.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Discard deal pipeline context for ${lead.companyName}?`)) {
                                  onDeleteLead(lead.id);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-650 hover:bg-rose-50 bg-slate-50 rounded border border-slate-200 cursor-pointer"
                              title="Drop Deal"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>

                        {/* Arrows to quickly shift column */}
                        <div className="flex justify-end gap-1 border-t border-slate-100 pt-1.5 mt-1">
                          {col.id !== LeadStatus.New && (
                            <button
                              onClick={() => {
                                const statuses = Object.values(LeadStatus);
                                const currentIdx = statuses.indexOf(col.id);
                                handleQuickMove(lead, statuses[currentIdx - 1]);
                              }}
                              className="p-0.5 bg-slate-100 hover:bg-slate-200 rounded hover:text-slate-800 text-slate-400 cursor-pointer"
                              title="Move back"
                            >
                              &larr;
                            </button>
                          )}
                          {col.id !== LeadStatus.Lost && col.id !== LeadStatus.Won && (
                            <button
                              onClick={() => {
                                const statuses = Object.values(LeadStatus);
                                const currentIdx = statuses.indexOf(col.id);
                                handleQuickMove(lead, statuses[currentIdx + 1]);
                              }}
                              className="p-0.5 bg-slate-100 hover:bg-slate-200 rounded hover:text-slate-800 text-slate-500 cursor-pointer flex items-center gap-0.5"
                              title="Advance Deal"
                            >
                              <span className="text-[8px] font-bold uppercase">Next</span> &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Regular list Grid */
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-3.5 px-4">Deal organization</th>
                  <th className="py-3.5 px-4 text-right">Proposed Value</th>
                  <th className="py-3.5 px-4">Representing contact</th>
                  <th className="py-3.5 px-4">Pipeline channel source</th>
                  <th className="py-3.5 px-4">Funnel status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 font-bold">
                      No inbound leads matched your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{lead.companyName}</div>
                          <div className="text-[10px] text-slate-400 italic mt-0.5">"{lead.notes}"</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                        ₹{lead.value.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>
                          <div className="font-semibold text-slate-700">{lead.contactName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{lead.contactEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-semibold">{lead.source}</td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold py-0.5 px-2 rounded uppercase text-[9px]">
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 px-1">
                          {lead.status === LeadStatus.Won && (
                            <button
                              onClick={() => onDeployWonLeadAsTenant(lead)}
                              className="p-1 px-2.5 bg-emerald-50 text-emerald-700 hover:text-white hover:bg-emerald-600 rounded border border-emerald-250 transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                            >
                              Onboard
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(lead)}
                            className="p-1.5 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded transition-all cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Create Fresh Deal Record</h3>
            <p className="text-xs text-slate-500 mb-5">Qualify uncontacted inbounds or ad leads manually.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Enterprise / Deal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hindustan Retail"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Representative Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Deal Value (₹ INR)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-emerald-600 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lead Source Channel</label>
                  <input
                    type="text"
                    placeholder="e.g. LinkedIn Outreach"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Deal Stage status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-750 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  >
                    <option value={LeadStatus.New}>New Inbound</option>
                    <option value={LeadStatus.Contacted}>Contacted</option>
                    <option value={LeadStatus.Proposal}>Proposal Generated</option>
                    <option value={LeadStatus.Negotiating}>Negotiations Active</option>
                    <option value={LeadStatus.Won}>Won / Paid</option>
                    <option value={LeadStatus.Lost}>Lost / No Budget</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Deal criteria & Specific requirements</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-805 font-medium h-20 focus:outline-none focus:border-[#3b82f6] transition-colors focus:bg-white focus:ring-1 focus:ring-[#3b82f6]"
                  placeholder="e.g. Customer wants automatic SSO integrations and Stripe connectors."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => { setShowEditModal(false); setEditingLead(null); }} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Edit Deal Pipeline Settings</h3>
            <p className="text-xs text-slate-500 mb-5">Updating values for: {editingLead.companyName}</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Target Enterprise / Deal Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Representative Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Representative Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Deal Value (₹ INR)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-emerald-600 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Lead Source Channel</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Deal Stage status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-750 font-semibold cursor-pointer outline-none"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  >
                    <option value={LeadStatus.New}>New Inbound</option>
                    <option value={LeadStatus.Contacted}>Contacted</option>
                    <option value={LeadStatus.Proposal}>Proposal Generated</option>
                    <option value={LeadStatus.Negotiating}>Negotiations Active</option>
                    <option value={LeadStatus.Won}>Won / Paid</option>
                    <option value={LeadStatus.Lost}>Lost / No Budget</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Deal criteria & Specific requirements</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-805 font-medium h-20 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:ring-1 focus:ring-[#3b82f6]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingLead(null); }}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Update Deal Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
