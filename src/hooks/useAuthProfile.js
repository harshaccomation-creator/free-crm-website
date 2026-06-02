import { useEffect, useState } from 'react';
import { isBackendConfigured, supabase } from '../lib/supabaseClient.js';

export function normalizeRole(role) {
  const value = String(role || 'employee').toLowerCase().replace(/[\s-]+/g, '_');
  if (value === 'company_admin' || value === 'admin') return 'company_admin';
  if (value === 'super_admin' || value === 'superadmin') return 'super_admin';
  if (value === 'manager') return 'manager';
  return 'employee';
}

export function roleHome(role) {
  const cleanRole = normalizeRole(role);
  if (cleanRole === 'super_admin') return '/super-admin/dashboard';
  if (cleanRole === 'company_admin') return '/admin/dashboard';
  return '/employee/dashboard';
}

export function clearStoredSession() {
  window.localStorage.removeItem('salesflow_user_email');
  window.localStorage.removeItem('salesflow_user_id');
  window.localStorage.removeItem('salesflow_user_role');
  window.localStorage.removeItem('salesflowRole');
  window.localStorage.removeItem('salesflow_auth_token');
  window.localStorage.removeItem('salesflow_session');
}

export function syncStoredProfile(user, profile) {
  if (!user) return 'employee';
  const cleanRole = normalizeRole(profile?.role || 'employee');
  window.localStorage.setItem('salesflow_user_email', profile?.email || user.email || '');
  window.localStorage.setItem('salesflow_user_id', user.id || profile?.id || '');
  window.localStorage.setItem('salesflow_user_role', cleanRole);
  window.localStorage.setItem('salesflowRole', cleanRole);
  if (profile?.full_name) window.localStorage.setItem('salesflow_user_name', profile.full_name);
  return cleanRole;
}

async function fetchProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export function useAuthProfile() {
  const [state, setState] = useState({ loading: true, session: null, user: null, profile: null, role: 'employee', error: '' });

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isBackendConfigured || !supabase) {
        if (alive) setState({ loading: false, session: null, user: null, profile: null, role: 'employee', error: 'Supabase is not configured.' });
        return;
      }

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const session = sessionData?.session || null;
        const user = session?.user || null;

        if (!user) {
          clearStoredSession();
          if (alive) setState({ loading: false, session: null, user: null, profile: null, role: 'employee', error: '' });
          return;
        }

        const profile = await fetchProfile(user.id);
        const role = syncStoredProfile(user, profile);
        if (alive) setState({ loading: false, session, user, profile, role, error: '' });
      } catch (error) {
        if (alive) setState((current) => ({ ...current, loading: false, error: error.message || 'Unable to verify session.' }));
      }
    }

    load();
    if (!supabase) return () => { alive = false; };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      if (!user) {
        clearStoredSession();
        setState({ loading: false, session: null, user: null, profile: null, role: 'employee', error: '' });
        return;
      }
      fetchProfile(user.id)
        .then((profile) => {
          if (!alive) return;
          const role = syncStoredProfile(user, profile);
          setState({ loading: false, session, user, profile, role, error: '' });
        })
        .catch((error) => {
          if (alive) setState((current) => ({ ...current, loading: false, error: error.message || 'Unable to verify session.' }));
        });
    });

    return () => {
      alive = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return state;
}
