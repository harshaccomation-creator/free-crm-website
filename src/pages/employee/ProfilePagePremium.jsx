import { useEffect, useMemo, useState } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import { getCurrentProfile, supabase } from '../../services/crmApi.js';
import './ProfilePagePremium.css';

function roleLabel(role) {
  if (role === 'company_admin') return 'Company Admin';
  if (role === 'manager') return 'Manager';
  if (role === 'super_admin') return 'Super Admin';
  return 'Sales Executive';
}
function toView(row = {}) {
  return {
    id: row.id || '',
    name: row.full_name || row.email?.split('@')[0] || 'Employee User',
    role: roleLabel(row.role),
    email: row.email || '-',
    phone: row.phone || '-',
    team: row.team || 'Sales',
    location: row.location || 'India',
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(toView());
  const [draft, setDraft] = useState(toView());
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const initial = useMemo(() => (profile.name || profile.email || 'E').slice(0, 1).toUpperCase(), [profile.name, profile.email]);

  async function loadProfile() {
    setLoading(true);
    try {
      const row = await getCurrentProfile();
      if (!row?.id) throw new Error('Authenticated profile not found. Please login again.');
      const next = toView(row);
      setProfile(next);
      setDraft(next);
    } catch (error) {
      setMessage(error.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadProfile(); }, []);

  const openEdit = () => { setDraft(profile); setMessage(''); setShowModal(true); };
  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage('');
    if (!draft.id) return setMessage('Profile id missing. Please login again.');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: draft.name.trim(), phone: draft.phone.trim() })
        .eq('id', draft.id)
        .select('id,full_name,email,phone,role')
        .single();
      if (error) throw error;
      const next = toView(data);
      setProfile(next);
      setDraft(next);
      setShowModal(false);
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage(error.message || 'Unable to update profile.');
    }
  };

  return (
    <div className="sf-dashboard premium-profile-page">
      <DashboardSidebar role="employee" />
      <main className="profile-premium-main">
        <header className="profile-premium-head"><div><span className="profile-kicker">Employee Workspace</span><h1>Profile</h1><p>Manage your account details and workspace identity.</p></div><button className="profile-edit-btn" type="button" onClick={openEdit}>Edit Profile</button></header>
        <section className="profile-hero-card"><div className="profile-cover-glow" /><div className="profile-avatar-xl">{initial}</div><div className="profile-main-info"><span className="profile-status">Active Employee</span><h2>{loading ? 'Loading profile...' : profile.name}</h2><p>{profile.role}</p><div className="profile-actions-row"><button type="button" className="ghost" onClick={openEdit}>Update Details</button></div></div></section>
        {message && <div className="profile-success">{message}</div>}
        <section className="profile-details-grid"><article><span>Email Address</span><strong>{profile.email}</strong><small>Read-only login email</small></article><article><span>Mobile Number</span><strong>{profile.phone}</strong><small>Internal communication</small></article><article><span>Team</span><strong>{profile.team}</strong><small>Your department</small></article><article><span>Location</span><strong>{profile.location}</strong><small>Workspace region</small></article></section>
      </main>
      {showModal && <div className="profile-modal-backdrop" onClick={() => setShowModal(false)}><form className="profile-modal" onSubmit={saveProfile} onClick={(event) => event.stopPropagation()}><div className="profile-modal-head"><div><h3>Edit Profile</h3><p>Update logged-in employee details.</p></div><button type="button" onClick={() => setShowModal(false)}>×</button></div><label>Full Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label>Email<input type="email" value={draft.email} readOnly /></label><label>Phone<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label><label>Team<input value={draft.team} readOnly /></label><label>Location<input value={draft.location} readOnly /></label><div className="profile-modal-actions"><button type="button" onClick={() => setShowModal(false)}>Cancel</button><button type="submit">Save Profile</button></div></form></div>}
    </div>
  );
}
