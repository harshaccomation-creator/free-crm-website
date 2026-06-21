import React, { useState } from 'react';
import { User, UserRole, UserStatus, Company } from '../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  UserCheck,
  ShieldAlert,
  Mail,
  Key,
  Unlock,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface UsersManagerProps {
  users: User[];
  companies: Company[];
  onAddUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  selectedUserId?: string; // from search
}

export default function UsersManager({
  users,
  companies,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  selectedUserId
}: UsersManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | UserStatus>('All');

  // Modal forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Password Reset simulation State
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TenantUser);
  const [status, setStatus] = useState<UserStatus>(UserStatus.Active);

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setCompanyId(u.companyId);
    setRole(u.role);
    setStatus(u.status);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyId) {
      alert('Please fill out all required fields');
      return;
    }

    const matchedComp = companies.find((c) => c.id === companyId);
    const companyName = matchedComp ? matchedComp.name : 'Unknown Tenancy';

    onAddUser({
      name,
      email,
      companyId,
      companyName,
      role,
      status
    });

    // Reset fields
    setName('');
    setEmail('');
    setCompanyId('');
    setRole(UserRole.TenantUser);
    setStatus(UserStatus.Active);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const matchedComp = companies.find((c) => c.id === companyId);
    const companyName = matchedComp ? matchedComp.name : editingUser.companyName;

    onUpdateUser({
      ...editingUser,
      name,
      email,
      companyId,
      companyName,
      role,
      status
    });

    setShowEditModal(false);
    setEditingUser(null);
  };

  // Generate strong random password keys
  const triggerGeneratePassword = (u: User) => {
    setResettingUser(u);
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let pass = '';
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
  };

  // Filter lists
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' ? true : u.status === statusFilter;

    // Search trigger override matches
    const matchesSelectedId = selectedUserId ? u.id === selectedUserId : true;

    return matchesSearch && matchesRole && matchesStatus && matchesSelectedId;
  });

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case UserRole.SuperAdmin:
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">SUPER ADMIN</span>;
      case UserRole.TenantOwner:
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">OWNER</span>;
      case UserRole.TenantAdmin:
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">ADMIN</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider">USER</span>;
    }
  };

  const getStatusBadge = (s: UserStatus) => {
    switch (s) {
      case UserStatus.Active:
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold text-[9px] uppercase font-mono px-2.5 py-0.5 rounded border border-emerald-200">
            <CheckCircle className="h-2.5 w-2.5 text-emerald-600" /> Active
          </span>
        );
      case UserStatus.Suspended:
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-extrabold text-[9px] uppercase font-mono px-2.5 py-0.5 rounded border border-rose-200">
            <XCircle className="h-2.5 w-2.5 text-rose-500" /> Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold text-[9px] uppercase font-mono px-2.5 py-0.5 rounded border border-amber-200">
            <Clock className="h-2.5 w-2.5 text-amber-500" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* Password Reset Modal Screen */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setResettingUser(null)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-amber-50 rounded text-amber-750 border border-amber-200">
                <Unlock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Generate Hardened Access Token</h3>
                <p className="text-[10px] text-slate-500 font-mono">Reset details for: {resettingUser.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              We generated a random secure password for this user context below. Give this directly to the user to bypass standard MFA.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-between font-mono text-xs font-bold text-emerald-700">
              <span className="tracking-wider select-all px-1 bg-white border border-slate-200 rounded">{generatedPassword}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword);
                  alert('Copied secure token password to clipboard!');
                }}
                className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                Copy Key
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResettingUser(null)}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Users & Roles Management
          </h2>
          <p className="text-xs text-slate-500">
            Audit identities, upgrade roles, freeze accounts, and trigger password credential updates.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#3b82f6] hover:bg-blue-600 text-white px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Multi-Tenant User
        </button>
      </div>

      {/* Filters block */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search human name, email company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
          />
        </div>

        {/* Option Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
            <Filter className="h-3 w-3 text-slate-400" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value={UserRole.SuperAdmin}>Super Admin</option>
            <option value={UserRole.TenantOwner}>Owner</option>
            <option value={UserRole.TenantAdmin}>Admin</option>
            <option value={UserRole.TenantUser}>User</option>
          </select>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold ml-2">
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value={UserStatus.Active}>Active</option>
            <option value={UserStatus.Suspended}>Suspended</option>
            <option value={UserStatus.Pending}>Pending</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold text-[9px] tracking-wider uppercase">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Organization / Tenancy</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Event Registered</th>
                <th className="py-3.5 px-4 text-right">Credentials & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-bold">
                    No active platform users matched your filters or search strings.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-[#3b82f6] transition-colors">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{u.companyName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[10px]">{u.lastLogin || 'Never logged-in'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 px-1 font-sans">
                        {/* Token password generator */}
                        <button
                          onClick={() => triggerGeneratePassword(u)}
                          className="p-1.5 bg-slate-55 text-amber-700 hover:text-white hover:bg-amber-600 border border-slate-200 rounded transition-all cursor-pointer"
                          title="Generate Hardended Secret"
                        >
                          <Key className="h-3.5 w-3.5" />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 bg-slate-55 text-slate-600 hover:text-slate-900 hover:bg-slate-150 border border-slate-200 rounded transition-all cursor-pointer"
                          title="Edit User Profile"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`De-register user "${u.name}" permanently from SalesFlow Hub?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          className="p-1.5 bg-slate-55 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded transition-all cursor-pointer"
                          title="De-register User"
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Invite/Register Platform Actor</h3>
            <p className="text-xs text-slate-500 mb-5">Create tenant admin, managers, or external partners.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sania Banik"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@customer.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client Tenancy *</label>
                  <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                  >
                    <option value="">-- Choose Company --</option>
                    <option value="salesflow-core">SalesFlow Core Sub-admin Unit</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.domain})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Role</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value={UserRole.TenantUser}>Standard User Seat</option>
                    <option value={UserRole.TenantAdmin}>System Administrator</option>
                    <option value={UserRole.TenantOwner}>Primary Legal Owner</option>
                    <option value={UserRole.SuperAdmin}>Global Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Activation Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                >
                  <option value={UserStatus.Active}>Pre-Activated (Bypasses verification)</option>
                  <option value={UserStatus.Pending}>Awaiting RSVP response</option>
                  <option value={UserStatus.Suspended}>Pre-Suspended / Locked</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Invite Actor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => { setShowEditModal(false); setEditingUser(null); }} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Modify Actor Profile</h3>
            <p className="text-xs text-slate-500 mb-5">Updating access parameters for: {editingUser.name}</p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-850 font-bold focus:bg-white focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client Tenancy</label>
                  <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                  >
                    <option value="salesflow-core">SalesFlow Core Unit</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Role</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 font-semibold focus:outline-none focus:border-[#3b82f6] cursor-pointer outline-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value={UserRole.TenantUser}>Standard User Seat</option>
                    <option value={UserRole.TenantAdmin}>System Administrator</option>
                    <option value={UserRole.TenantOwner}>Primary Legal Owner</option>
                    <option value={UserRole.SuperAdmin}>Global Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Identity Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 font-semibold cursor-pointer outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                >
                  <option value={UserStatus.Active}>Active</option>
                  <option value={UserStatus.Suspended}>Suspended / Locked</option>
                  <option value={UserStatus.Pending}>Awaiting RSVP response</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingUser(null); }}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-650 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Update Actor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
