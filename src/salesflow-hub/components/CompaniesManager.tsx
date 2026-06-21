import React, { useState } from 'react';
import { Company, PlanType, CompanyStatus, User, UserRole, UserStatus } from '../types';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  User as UserIcon,
  ExternalLink,
  Laptop,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  UserCheck,
  UserPlus,
  UserX,
  AlertTriangle
} from 'lucide-react';

interface CompaniesManagerProps {
  companies: Company[];
  onAddCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
  selectedCompanyId?: string; // from search
  setSelectedCompanyId?: (id: string | undefined) => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function CompaniesManager({
  companies,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  selectedCompanyId,
  setSelectedCompanyId,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: CompaniesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CompanyStatus>('All');
  const [planFilter, setPlanFilter] = useState<'All' | PlanType>('All');

  // Sorting
  const [sortField, setSortField] = useState<keyof Company>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal forms states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Impersonating simulator state
  const [impersonatingCompany, setImpersonatingCompany] = useState<Company | null>(null);

  // Active Selected Company Tracker for Company-wise Users
  const [selectedCompanyIdForUsers, setSelectedCompanyIdForUsers] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState<PlanType>(PlanType.Starter);
  const [status, setStatus] = useState<CompanyStatus>(CompanyStatus.Active);
  const [userCount, setUserCount] = useState(5);
  const [monthlySpend, setMonthlySpend] = useState(149);
  const [adminEmail, setAdminEmail] = useState('');

  // New Employee inline creation fields
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<UserRole>(UserRole.TenantUser);

  // Handle opening edit modal
  const openEditModal = (comp: Company) => {
    setEditingCompany(comp);
    setName(comp.name);
    setDomain(comp.domain);
    setPlan(comp.plan);
    setStatus(comp.status);
    setUserCount(comp.userCount);
    setMonthlySpend(comp.monthlySpend);
    setAdminEmail(comp.adminEmail);
    setShowEditModal(true);
  };

  // Submit Add form
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain || !adminEmail) {
      alert('Please fill out all required fields');
      return;
    }
    onAddCompany({
      name,
      domain,
      plan,
      status,
      userCount,
      monthlySpend,
      adminEmail
    });
    // Reset
    setName('');
    setDomain('');
    setPlan(PlanType.Starter);
    setStatus(CompanyStatus.Active);
    setUserCount(5);
    setMonthlySpend(149);
    setAdminEmail('');
    setShowAddModal(false);
  };

  // Submit Edit form
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    onUpdateCompany({
      ...editingCompany,
      name,
      domain,
      plan,
      status,
      userCount,
      monthlySpend,
      adminEmail
    });
    setShowEditModal(false);
    setEditingCompany(null);
  };

  // Trigger automated fields calculation based on selected tier
  const handlePlanChangeInForm = (selectedTier: PlanType) => {
    setPlan(selectedTier);
    if (selectedTier === PlanType.Starter) {
      setMonthlySpend(149);
      setStatus(CompanyStatus.Active);
    } else if (selectedTier === PlanType.Professional) {
      setMonthlySpend(499);
      setStatus(CompanyStatus.Paid);
    } else if (selectedTier === PlanType.Enterprise) {
      setMonthlySpend(1499);
      setStatus(CompanyStatus.Paid);
    } else if (selectedTier === PlanType.Trial) {
      setMonthlySpend(0);
      setStatus(CompanyStatus.Trial);
    }
  };

  // Sort helper
  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Process data showing list
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
    const matchesPlan = planFilter === 'All' ? true : c.plan === planFilter;

    // From search nav
    const matchesSelectedId = selectedCompanyId ? c.id === selectedCompanyId : true;

    return matchesSearch && matchesStatus && matchesPlan && matchesSelectedId;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortOrder === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    } else {
      return sortOrder === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    }
  });

  const getStatusBadge = (stat: CompanyStatus) => {
    switch (stat) {
      case CompanyStatus.Paid:
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-200/60">
            <CheckCircle2 className="h-2.5 w-2.5" /> PAID
          </span>
        );
      case CompanyStatus.Active:
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-blue-200/60">
            <CheckCircle2 className="h-2.5 w-2.5" /> ACTIVE
          </span>
        );
      case CompanyStatus.Trial:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 font-bold text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-amber-200/60">
            <Clock className="h-2.5 w-2.5 animate-spin" /> TRIAL
          </span>
        );
      case CompanyStatus.Expired:
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 font-bold text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-rose-200/60">
            <XCircle className="h-2.5 w-2.5" /> EXPIRED
          </span>
        );
    }
  };

  const getPlanBadge = (p: PlanType) => {
    switch (p) {
      case PlanType.Enterprise:
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px] px-2 py-0.5 rounded">{p}</span>;
      case PlanType.Professional:
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px] px-2 py-0.5 rounded">{p}</span>;
      case PlanType.Starter:
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px] px-2 py-0.5 rounded">{p}</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded">{p}</span>;
    }
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* Impersonated Screen Overlay Simulator */}
      {impersonatingCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-xl p-8 shadow-2xl text-center space-y-6 text-slate-800">
            <div className="relative inline-flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-500 opacity-20"></span>
              <div className="h-14 w-14 bg-[#3b82f6] rounded-xl flex items-center justify-center shadow-md">
                <Laptop className="h-7 w-7 text-white animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Active Tenant Impersonation Session</h2>
              <p className="text-sm text-slate-550 leading-relaxed max-w-md mx-auto">
                You are currently connected as a Tenant Super-Admin into <strong className="text-slate-900 font-bold">{impersonatingCompany.name}</strong>. Access tokens and simulation logs are running.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-3 max-w-lg mx-auto">
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenant Domain</div>
                <div className="font-bold text-xs mt-1 text-slate-700">{impersonatingCompany.domain}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Seats</div>
                <div className="font-bold text-xs mt-1 text-slate-700">{impersonatingCompany.userCount} / Unlimited</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active License</div>
                <div className="font-bold text-xs mt-1 text-[#3b82f6]">{impersonatingCompany.plan}</div>
              </div>
            </div>

            <div className="flex gap-4 items-center justify-center pt-2">
              <button
                onClick={() => setImpersonatingCompany(null)}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded shadow-sm cursor-pointer transition-colors"
              >
                Disconnect Session
              </button>
              <button
                onClick={() => {
                  alert(`Testing action: Dispatched mock force-logout flag to all active users on ${impersonatingCompany.domain}`);
                }}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded cursor-pointer transition-colors"
              >
                Simulate Tenant Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Add Company action trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Companies & Tenancy CRM
          </h2>
          <p className="text-xs text-slate-500">
            Provision, scale, edit subscription levels, and track customer organizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCompanyId && setSelectedCompanyId && (
            <button
              onClick={() => setSelectedCompanyId(undefined)}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer shadow-sm"
            >
              Clear Search Filter
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#3b82f6] hover:bg-blue-600 text-white px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Company
          </button>
        </div>
      </div>

      {/* Filter and search bar controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, admin, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-colors"
          />
        </div>

        {/* Quick filters dropdown options */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Filter className="h-3 w-3" />
            <span>Plan:</span>
          </div>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-750 font-medium rounded px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="All">All Plans</option>
            <option value={PlanType.Starter}>Starter</option>
            <option value={PlanType.Professional}>Professional</option>
            <option value={PlanType.Enterprise}>Enterprise</option>
            <option value={PlanType.Trial}>Trial</option>
          </select>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-750 font-medium rounded px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value={CompanyStatus.Active}>Active</option>
            <option value={CompanyStatus.Paid}>Paid</option>
            <option value={CompanyStatus.Trial}>Trial</option>
            <option value={CompanyStatus.Expired}>Expired</option>
          </select>
        </div>
      </div>

      {/* Main Dynamic Workspace Side-By-Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Client Companies Table (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold text-[10px] tracking-wider uppercase">
                  <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">Company <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('plan')}>
                    <div className="flex items-center gap-1">Saas Tier <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 font-mono text-right" onClick={() => handleSort('userCount')}>
                    <div className="flex items-center gap-1 justify-end font-sans">Seats <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 font-mono text-right" onClick={() => handleSort('monthlySpend')}>
                    <div className="flex items-center gap-1 justify-end font-sans">Spend / Mo <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="py-3.5 px-4">Admin Email</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sortedCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-bold">
                      No client companies match your filter criteria or search queries.
                    </td>
                  </tr>
                ) : (
                  sortedCompanies.map((comp) => (
                    <tr 
                      key={comp.id} 
                      onClick={() => setSelectedCompanyIdForUsers(comp.id)}
                      className={`cursor-pointer transition-all duration-150 group ${selectedCompanyIdForUsers === comp.id ? 'bg-[#3b82f6]/10 font-medium border-l-4 border-[#3b82f6]' : 'hover:bg-slate-50/70 border-l-4 border-transparent'}`}
                    >
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {comp.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{comp.domain}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getPlanBadge(comp.plan)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(comp.status)}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-700 font-bold">{comp.userCount}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-800 font-bold">
                        ₹{comp.monthlySpend.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{comp.adminEmail}</td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 px-1">
                          {/* Impersonate */}
                          <button
                            onClick={() => setImpersonatingCompany(comp)}
                            className="p-1.5 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded transition-all cursor-pointer"
                            title="Impersonate (Connect to CRM)"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(comp)}
                            className="p-1.5 bg-slate-50 text-slate-600 hover:text-[#3b82f6] hover:bg-blue-50 border border-slate-200 rounded transition-all cursor-pointer"
                            title="Edit Tenancy Settings"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you absolutely sure you want to completely de-provision "${comp.name}"? This action cannot be undone.`)) {
                                onDeleteCompany(comp.id);
                              }
                            }}
                            className="p-1.5 bg-slate-50 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded transition-all cursor-pointer"
                            title="De-provision Company"
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

        {/* Right Column: Recent Registrations Sidebar Panel (3 cols) – Identical to Screenshot 1 & 3 */}
        <div className="lg:col-span-3 bg-[#0d1321] border border-slate-800 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2.5">
              <span className="text-xs font-bold text-slate-200 tracking-wider">Recent Registrations</span>
              <button className="text-[11px] font-bold text-blue-400 hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {/* Registration 1 */}
              <div className="flex items-start gap-3 transition-colors hover:bg-[#1a2336]/20 p-1.5 rounded">
                <div className="h-9 w-9 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold text-sm rounded flex items-center justify-center shrink-0">
                  L
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-200 text-xs truncate leading-snug">Lexcorp</h5>
                  <p className="text-[10px] text-slate-450 leading-tight">New company registered</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500 shrink-0 mt-0.5">5m ago</span>
              </div>

              {/* Registration 2 */}
              <div className="flex items-start gap-3 transition-colors hover:bg-[#1a2336]/20 p-1.5 rounded">
                <div className="h-9 w-9 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm rounded flex items-center justify-center shrink-0">
                  M
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-200 text-xs truncate leading-snug">Massive Dynamic</h5>
                  <p className="text-[10px] text-slate-450 leading-tight">New company registered</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500 shrink-0 mt-0.5">18m ago</span>
              </div>

              {/* Registration 3 */}
              <div className="flex items-start gap-3 transition-colors hover:bg-[#1a2336]/20 p-1.5 rounded">
                <div className="h-9 w-9 bg-purple-600/20 border border-purple-500/30 text-purple-400 font-extrabold text-sm rounded flex items-center justify-center shrink-0">
                  O
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-200 text-xs truncate leading-snug">Oscorp Industries</h5>
                  <p className="text-[10px] text-slate-450 leading-tight">New company registered</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500 shrink-0 mt-0.5">32m ago</span>
              </div>

              {/* Registration 4 */}
              <div className="flex items-start gap-3 transition-colors hover:bg-[#1a2336]/20 p-1.5 rounded">
                <div className="h-9 w-9 bg-amber-600/20 border border-amber-500/30 text-amber-400 font-extrabold text-sm rounded flex items-center justify-center shrink-0">
                  W
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-200 text-xs truncate leading-snug">Wonka Industries</h5>
                  <p className="text-[10px] text-slate-450 leading-tight">New company registered</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500 shrink-0 mt-0.5">1h ago</span>
              </div>

              {/* Registration 5 */}
              <div className="flex items-start gap-3 transition-colors hover:bg-[#1a2336]/20 p-1.5 rounded">
                <div className="h-9 w-9 bg-teal-600/20 border border-teal-500/30 text-teal-400 font-extrabold text-sm rounded flex items-center justify-center shrink-0">
                  T
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-200 text-xs truncate leading-snug">Tyrell Corporation</h5>
                  <p className="text-[10px] text-slate-450 leading-tight">New company registered</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-500 shrink-0 mt-0.5">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Seat Utilization & Employee Role Assignment Panel */}
      {(() => {
        const activeComp = companies.find(c => c.id === selectedCompanyIdForUsers) || companies[0];
        if (!activeComp) return null;

        const companyUsers = users.filter(u => u.companyId === activeComp.id || u.companyName === activeComp.name);
        const limitPercentage = Math.min(100, (companyUsers.length / activeComp.userCount) * 100);

        // Expiring logic / alert trigger
        const isExpiringSoon = activeComp.status === CompanyStatus.Expired || activeComp.status === CompanyStatus.Trial;

        const handleRoleChange = (userId: string, newRole: UserRole) => {
          const userToUpdate = users.find(u => u.id === userId);
          if (userToUpdate) {
            onUpdateUser({
              ...userToUpdate,
              role: newRole
            });
            alert(`Assigned active role "${newRole}" to ${userToUpdate.name}!`);
          }
        };

        const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!newEmpName.trim() || !newEmpEmail.trim()) {
            alert('Please fill out employee name and professional email.');
            return;
          }
          onAddUser({
            name: newEmpName.trim(),
            email: newEmpEmail.trim(),
            companyId: activeComp.id,
            companyName: activeComp.name,
            role: newEmpRole,
            status: UserStatus.Active
          });
          setNewEmpName('');
          setNewEmpEmail('');
          setNewEmpRole(UserRole.TenantUser);
        };

        return (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm text-left space-y-6 select-none animate-fadeIn">
            {/* Title & Organization Profile Card */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#3b82f6] font-mono">
                  Active Tenant Workspace Selection (Click directory row to change)
                </span>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2 mt-0.5">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  Employee & Role Assignment Center: <strong className="text-slate-950 font-black">{activeComp.name}</strong>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Group, search, audit seats utilization and assign custom user roles on domain <code className="bg-slate-50 border px-1.5 py-0.5 rounded font-mono text-slate-700 text-[10px]">{activeComp.domain}</code>
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-450 font-mono">License Value:</span>
                <span className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-2.5 py-1 border border-emerald-200 rounded font-mono">
                  ₹{activeComp.monthlySpend.toLocaleString()} / mo
                </span>
                {isExpiringSoon && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] uppercase px-2 py-1 rounded">
                    <AlertTriangle className="h-3 w-3 text-amber-600 animate-pulse" /> EXPIRING / TRIAL
                  </span>
                )}
              </div>
            </div>

            {/* Smart Expiring License Alert Alert Box */}
            {isExpiringSoon && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3 text-rose-800 animate-fadeIn">
                <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-extrabold text-[#991b1b] uppercase font-mono tracking-wider flex items-center gap-1.5">
                    Tenant Status Alert: Action Required
                  </h4>
                  <p className="text-rose-750 mt-1">
                    Warning! The tenancy license for <strong className="text-slate-900">{activeComp.name}</strong> is in <strong className="uppercase font-mono text-rose-800">{activeComp.status}</strong> mode. 
                    This resource was provisioned for <strong className="font-mono">₹{activeComp.monthlySpend.toLocaleString()} / month</strong>. 
                    Billing services advise immediate manual renewal to avert downtime.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Employees list & Role dropdowns (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Seats progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      Tenant Seats Registered: {companyUsers.length} of {activeComp.userCount} Max Allocated
                    </span>
                    <span className="font-mono font-black text-slate-850">{limitPercentage.toFixed(0)}% Utilized</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-150">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${limitPercentage >= 90 ? 'bg-rose-500' : limitPercentage >= 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${limitPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Employees table */}
                <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-500 font-bold text-[10px] tracking-wider uppercase font-mono">
                          <th className="py-2.5 px-3">Name & Email</th>
                          <th className="py-2.5 px-3">Assigned Role</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                        {companyUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-slate-400 font-bold italic">
                              No employees currently registered under this customer account. Use the quick signup form on the right!
                            </td>
                          </tr>
                        ) : (
                          companyUsers.map((emp) => (
                            <tr key={emp.id} className="hover:bg-white transition-all">
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-slate-800">{emp.name}</div>
                                <div className="text-[10px] text-slate-450 font-mono">{emp.email}</div>
                              </td>
                              <td className="py-2.5 px-3">
                                <select
                                  value={emp.role}
                                  onChange={(e) => handleRoleChange(emp.id, e.target.value as UserRole)}
                                  className="bg-white border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 rounded cursor-pointer hover:border-blue-500 transition-colors focus:outline-none"
                                >
                                  <option value={UserRole.SuperAdmin}>Super Admin</option>
                                  <option value={UserRole.TenantOwner}>Owner</option>
                                  <option value={UserRole.TenantAdmin}>Admin</option>
                                  <option value={UserRole.TenantUser}>User</option>
                                </select>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`inline-block text-[9px] uppercase font-bold font-mono px-1.5 py-0.5 rounded border ${
                                  emp.status === UserStatus.Active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  emp.status === UserStatus.Suspended ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {emp.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Remove employee "${emp.name}" from ${activeComp.name}?`)) {
                                      onDeleteUser(emp.id);
                                    }
                                  }}
                                  className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-rose-50 cursor-pointer transition-all"
                                  title="Unlink Employee"
                                >
                                  <UserX className="h-3.5 w-3.5 inline-block" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Add Employee Inline Form (4 cols) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4 font-normal">
                <h4 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5 mb-2.5">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  Quick Account Allocation
                </h4>
                <p className="text-[10px] text-slate-500 leading-snug mb-3">
                  Instantly provision credentials and link them to this tenant group's database workspace.
                </p>

                <form onSubmit={handleCreateEmployeeSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clark Kent"
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider font-mono">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. clark@domain.com"
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                      value={newEmpEmail}
                      onChange={(e) => setNewEmpEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Access Scope Role</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-705 font-bold cursor-pointer"
                      value={newEmpRole}
                      onChange={(e) => setNewEmpRole(e.target.value as UserRole)}
                    >
                      <option value={UserRole.TenantUser}>Tenant User</option>
                      <option value={UserRole.TenantAdmin}>Admin Overseer</option>
                      <option value={UserRole.TenantOwner}>Owner / Partner</option>
                      <option value={UserRole.SuperAdmin}>Super Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={companyUsers.length >= activeComp.userCount}
                    className={`w-full font-bold text-xs py-2 rounded text-white shadow-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
                      companyUsers.length >= activeComp.userCount 
                      ? 'bg-slate-350 cursor-not-allowed text-slate-500' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {companyUsers.length >= activeComp.userCount ? 'Allocation Limit Reached' : 'Link Employee Spot'}
                  </button>
                  {companyUsers.length >= activeComp.userCount && (
                    <p className="text-[9px] text-rose-500 font-semibold text-center leading-tight mt-1">
                      ⚠️ Enterprise policy blocks adding user slots. Edit tenancy parameter seats first.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Company Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-lg p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Configure New Tenant Organization</h3>
            <p className="text-xs text-slate-500 mb-5">Provision fresh databases and primary sub-admin account triggers.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Systems"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#3b82f6] focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">DNS Domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. apexsystems.io"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-[#3b82f6] focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-colors"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Pricing Tier</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-750 font-semibold focus:ring-1 focus:ring-[#3b82f6] focus:outline-none focus:bg-white focus:border-[#3b82f6] cursor-pointer"
                    value={plan}
                    onChange={(e) => handlePlanChangeInForm(e.target.value as PlanType)}
                  >
                    <option value={PlanType.Starter}>Starter Plan (₹149)</option>
                    <option value={PlanType.Professional}>Professional (₹499)</option>
                    <option value={PlanType.Enterprise}>Enterprise (₹1499)</option>
                    <option value={PlanType.Trial}>Free Demo trial (₹0)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider">Simulated Account Status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-755 font-semibold focus:ring-1 focus:ring-[#3b82f6] focus:outline-none focus:bg-white focus:border-[#3b82f6] cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CompanyStatus)}
                  >
                    <option value={CompanyStatus.Active}>Active (Grace Period)</option>
                    <option value={CompanyStatus.Paid}>Paid Current</option>
                    <option value={CompanyStatus.Trial}>Active Trial</option>
                    <option value={CompanyStatus.Expired}>Expired / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 font-mono">Assigned Seats</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-slate-800 font-bold focus:bg-white focus:border-[#3b82f6]"
                    value={userCount}
                    onChange={(e) => setUserCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 font-mono">Price / Month (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-emerald-600 font-bold focus:bg-white focus:border-[#3b82f6]"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider">Tenant Admin Email *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 text-slate-450 h-3.5 w-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="sysadmin@customer.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-850 focus:ring-1 focus:ring-[#3b82f6] focus:outline-none focus:bg-white focus:border-[#3b82f6] transition-colors"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
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
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold shadow-sm cursor-pointer transition-colors"
                >
                  Provision Tenancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal Form */}
      {showEditModal && editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => { setShowEditModal(false); setEditingCompany(null); }} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-lg p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Edit Tenancy Parameters</h3>
            <p className="text-xs text-slate-500 mb-5">Admin variables and subscription modifications for: {editingCompany.name}</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">DNS Domain</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6]"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Pricing Tier</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-750 font-semibold cursor-pointer"
                    value={plan}
                    onChange={(e) => handlePlanChangeInForm(e.target.value as PlanType)}
                  >
                    <option value={PlanType.Starter}>Starter Plan (₹149)</option>
                    <option value={PlanType.Professional}>Professional (₹499)</option>
                    <option value={PlanType.Enterprise}>Enterprise (₹1499)</option>
                    <option value={PlanType.Trial}>Free Demo trial (₹0)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Primary Status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-755 font-semibold cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CompanyStatus)}
                  >
                    <option value={CompanyStatus.Active}>Active</option>
                    <option value={CompanyStatus.Paid}>Paid</option>
                    <option value={CompanyStatus.Trial}>Trial</option>
                    <option value={CompanyStatus.Expired}>Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 font-mono">Assigned Seats</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-slate-800 font-bold focus:bg-white focus:border-[#3b82f6]"
                    value={userCount}
                    onChange={(e) => setUserCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 font-mono">Price / Month (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-emerald-600 font-bold focus:bg-white focus:border-[#3b82f6]"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Primary Admin Email</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 text-slate-450 h-3.5 w-3.5" />
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-850 focus:ring-1 focus:ring-[#3b82f6] focus:outline-none focus:bg-white focus:border-[#3b82f6]"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingCompany(null); }}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Update Tenancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
