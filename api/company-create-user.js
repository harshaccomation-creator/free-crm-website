import { adminClient, json, readBody, normalizeEmail, isValidEmail } from './_lib.js';

function makePassword() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return 'SalesFlow@' + code;
}

function normalizeRole(role = '') {
  const value = String(role || '').toLowerCase().replace(/[\s-]+/g, '_');
  return value === 'manager' ? 'manager' : 'employee';
}

async function getRequester(supabase, req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw new Error('Login required.');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) throw new Error('Invalid session.');
  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
  if (profileError) throw profileError;
  if (!profile?.company_id) throw new Error('Company