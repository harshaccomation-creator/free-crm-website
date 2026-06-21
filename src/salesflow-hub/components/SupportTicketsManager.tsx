import React, { useState } from 'react';
import { SupportTicket } from '../types';
import { 
  Headphones, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertOctagon, 
  Trash2, 
  Plus, 
  Send,
  UserCheck
} from 'lucide-react';

interface SupportProps {
  tickets: SupportTicket[];
  onUpdateTicket: (updated: SupportTicket) => void;
  onDeleteTicket: (id: string) => void;
  onAddTicket: (newTicket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
}

export default function SupportTicketsManager({ 
  tickets, 
  onUpdateTicket, 
  onDeleteTicket, 
  onAddTicket 
}: SupportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Modals state
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add state
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Billing' | 'Technical' | 'Integration' | 'Account'>('Technical');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'critical':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">CRITICAL</span>;
      case 'high':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">HIGH</span>;
      case 'medium':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">MEDIUM</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 border border-slate-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">LOW</span>;
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle className="h-2.5 w-2.5" /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-extrabold text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-blue-200 animate-pulse">
            <Clock className="h-2.5 w-2.5" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-extrabold text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-rose-200">
            <AlertOctagon className="h-2.5 w-2.5" /> Open
          </span>
        );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newEmail || !newSubject) return;
    onAddTicket({
      companyName: newCompanyName,
      userEmail: newEmail,
      subject: newSubject,
      desc: newDesc,
      category: newCategory,
      priority: newPriority,
      status: 'Open'
    });
    // Reset fields
    setNewCompanyName('');
    setNewEmail('');
    setNewSubject('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;
    
    // Simulate updating ticket with an in-progress or resolved state and add a log message
    onUpdateTicket({
      ...selectedTicket,
      status: 'In Progress',
      desc: `${selectedTicket.desc}\n\n[Reply Admin]: ${replyText}`
    });
    setReplyText('');
    setSelectedTicket(null);
    alert("Reply dispatched to customer! Ticket state updated to 'In Progress'.");
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Headphones className="h-5 w-5 text-blue-600" />
            Support Ticketing Triage
          </h2>
          <p className="text-xs text-slate-500">
            Review service requests, resolve technical integration blockages, and send custom answers to tenants.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#3b82f6] hover:bg-blue-600 text-white px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Create Service Request
        </button>
      </div>

      {/* Filters block */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by domain, subject, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
            <Filter className="h-3 w-3 text-slate-400" />
            <span>Priority:</span>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold ml-2">
            <span>Progress:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-550 font-bold text-[9px] tracking-wider uppercase">
                <th className="py-3.5 px-4 col-span-2">Customer Details</th>
                <th className="py-3.5 px-4">Subject & Issue description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Escalation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-405 font-bold">
                    No active tenant support service requests found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3.5 px-4" colSpan={2}>
                      <div>
                        <div className="font-bold text-slate-800">{t.companyName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{t.userEmail}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <div>
                        <div className="font-bold text-slate-900 truncate">{t.subject}</div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.desc}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-650">{t.category}</td>
                    <td className="py-3.5 px-4">{getPriorityBadge(t.priority)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1 px-1">
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="p-1.5 bg-slate-50 border border-slate-200 rounded text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          title="Open Reply Conversation"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                        {t.status !== 'Resolved' && (
                          <button
                            onClick={() => onUpdateTicket({ ...t, status: 'Resolved' })}
                            className="p-1.5 bg-slate-50 border border-slate-200 rounded text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                            title="Mark Resolved"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Permanently wipe support ticket?')) {
                              onDeleteTicket(t.id);
                            }
                          }}
                          className="p-1.5 bg-slate-50 border border-slate-200 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                          title="Wipe Ticket Data"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Reply Conversation Drawer Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedTicket(null)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-lg p-6 relative z-10 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-105 pb-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Service Ticket Discussion</span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{selectedTicket.subject}</h3>
              </div>
              <div>{getPriorityBadge(selectedTicket.priority)}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4 font-sans text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-600 font-semibold border-b border-slate-200 pb-1.5">
                <span>By: {selectedTicket.companyName} ({selectedTicket.userEmail})</span>
                <span className="font-mono text-[10px]">{selectedTicket.createdAt}</span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed select-text">{selectedTicket.desc}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Draft Superadmin Reply</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-800 font-semibold h-24 focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-all"
                placeholder="Type details, instructions, pricing credit waivers, or DB recovery logs to push to client..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-4 py-2 rounded text-xs font-bold cursor-pointer"
              >
                Close View
              </button>
              <button
                disabled={!replyText.trim()}
                onClick={handleSendReply}
                className="bg-[#3b82f6] hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-bold cursor-pointer flex items-center gap-1 transition-colors"
              >
                <Send className="h-3.5 w-3.5" /> Dispatch Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Create Support Ticket</h3>
            <p className="text-xs text-slate-500 mb-5">Open an internal incident report or log external client request manually.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-505 tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acer Global"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-505 tracking-wider">Sender Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@acer.co"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-505 tracking-wider">Subject Issue</label>
                <input
                  type="text"
                  required
                  placeholder="Failed login limit or Stripe failed invoice webhook"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-505 tracking-wider">Category</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-755 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                  >
                    <option value="Technical">Technical failure</option>
                    <option value="Billing">Billing webhook error</option>
                    <option value="Integration">Api Gateway lag</option>
                    <option value="Account">Account reactivation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550 tracking-wider">Priority Escalation</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-755 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                  >
                    <option value="low">Low (Standard)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High escalations</option>
                    <option value="critical">Critical (NOC pager)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-505 tracking-wider">Descriptive message Content</label>
                <textarea
                  placeholder="Provide precise details of client complaint logs..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none h-20"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Create Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
