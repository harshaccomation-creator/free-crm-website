import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isBackendConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isBackendConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireBackend() {
  if (!supabase) {
    throw new Error('Supabase backend is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
  }
  return supabase;
}
