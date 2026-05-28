import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import './ProfilePagePremium.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const defaultProfile = {
  id: '',
  name: 'Employee User',
  role: 'Sales Executive',
  email: '-',
  phone: '-',
  team: 'Sales',
  location: 'India',
};

function normalizeRole(role) {
  if (!role || role === 'employee') return 'Sales Executive';
  if (role === 'company_admin' || role === 'admin') return 'Company Admin';
  return role;
}

function getLocalUser() {
  return {
    id: localStorage.getItem('salesflow_user_id') || '',
    email: (localStorage.getItem('salesflow_user_email') || '').trim().toLowerCase(),
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [draft, setDraft] = useState(defaultProfile);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const initial = useMemo(() => (profile.name || profile.email || 'E').slice(0, 1).toUpperCase(), [profile.name, profile.email]);

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      const localUser = getLocalUser();
      const fallback = { ...defaultProfile, id: localUser.id, email: localUser.email || '-' };

      if (!supabase) {
        if (alive) {
          setProfile(fallback);
          setDraft(fallback);
          setLoading(false);
        }
        return;
      }

      try {
        let query = supabase.from('profiles').select('id,full_name,email,phone,role,created_at').limit(1);
        if (localUser.id) query = query.eq('id', localUser.id);
        else if (localUser.email) query = query.eq('email', localUser.email);
        else query = query.eq('role', 'employee').order('created_at', { ascending: false });

        const { data, error } = await query.maybeSingle();
        if (!alive) return;

        if (error || !data) {
          setProfile(fallback);
          setDraft(fallback);
          return;
        }

        const nextProfile = {
          id: data.id || localUser.id,
          name: data.full_name || data.email?.split('@')[0] || 'Employee User',
          role: normalizeRole(data.role),
          email: data.email || localUser.email || '-',
          phone: data.phone || '-',
          team: 'Sales',
          location: 'India',
        };
        setProfile(nextProfile);
        setDraft(nextProfile);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProfile();
    return () => { alive = false; };
  }, []);

  const openEdit = () => {
    setDraft(profile);
    setMessage('');
    setShowModal(true);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage('');

    const cleaned = {
      ...draft,
      name: draft.name.trim() || 'Employee User',
      email: draft.email.trim().toLowerCase() || profile.email,
      phone: draft.phone.trim() || '-',
      team: draft.team.trim() || 'Sales',
      location: draft.location.trim() || 'India',
    };

    setProfile(cleaned);
    setShowModal(false);
    localStorage.setItem('salesflow_user_email', cleaned.email);

    if (supabase && cleaned.id) {
      await supabase.from('profiles').update({ full_name: cleaned.name, phone: cleaned.phone, email: cleaned.email }).eq('id', cleaned.id);
    } else if (supabase && cleaned.email) {
      await supabase.from('profiles').update({ full_name: cleaned.name, phone: cleaned.phone }).eq('email', cleaned.email);
    }

    setMessage('Profile updated successfully.');
  };

  return (
    <div className="sf-dashboard premium-profile-page">
      <DashboardSidebar role="employee" />
      <main className="profile-premium-main">
        <header className="profile-premium-head">
          <div>
            <span className="profile-kicker">Employee Workspace</span>
            <h1>Profile</h1>
            <p>Manage your account details and workspace identity.</p>
          </div>
          <button className="profile-edit-btn" type="button" onClick={openEdit}>Edit Profile</button>
        </header>

        <section className="profile-hero-card">
          <div className="profile-cover-glow" />
          <div className="profile-avatar-xl">{initial}</div>
          <div className="profile-main-info">
            <span className="profile-status">Active Employee</span>
            <h2>{loading ? 'Loading profile...' : profile.name}</h2>
            <p>{profile.role}</p>
            <div className="profile-actions-row">
              <button type="button" onClick={() => window.Tawk_API?.maximize?.()}>Contact Support</button>
              <button type="button" className="ghost" onClick={openEdit}>Update Details</button>
            </div>
          </div>
        </section>

        {message && <div className="profile-success">{message}</div>}

        <section className="profile-details-grid">
          <article><span>Email Address</span><strong>{profile.email}</strong><small>Used for login and OTP verification</small></article>
          <article><span>Mobile Number</span><strong>{profile.phone}</strong><small>Customer and internal communication</small></article>
          <article><span>Team</span><strong>{profile.team}</strong><small>Your current department</small></article>
          <article><span>Location</span><strong>{profile.location}</strong><small>Default workspace region</small></article>
        </section>

        <section className="profile-info-row">
          <article className="profile-mini-card"><b>Security</b><p>Email OTP verified account with role-based dashboard access.</p></article>
          <article className="profile-mini-card"><b>Workspace</b><p>Connected to SalesFlow employee workspace and support chat.</p></article>
          <article className="profile-mini-card"><b>Support</b><p>Use Need Help in sidebar or Contact Support button for assistance.</p></article>
        </section>
      </main>

      {showModal && (
        <div className="profile-modal-backdrop" onClick={() => setShowModal(false)}>
          <form className="profile-modal" onSubmit={saveProfile} onClick={(event) => event.stopPropagation()}>
            <div className="profile-modal-head"><div><h3>Edit Profile</h3><p>Update logged-in employee details.</p></div><button type="button" onClick={() => setShowModal(false)}>×</button></div>
            <label>Full Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>Email<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
            <label>Phone<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
            <label>Team<input value={draft.team} onChange={(event) => setDraft({ ...draft, team: event.target.value })} /></label>
            <label>Location<input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label>
            <div className="profile-modal-actions"><button type="button" onClick={() => setShowModal(false)}>Cancel</button><button type="submit">Save Profile</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
