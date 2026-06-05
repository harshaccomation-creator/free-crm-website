import { adminClient, json, readBody, normalizeEmail, isValidEmail } from './_lib.js';

function makePassword() {
  return `SalesFlow@${Math.floor(100000 + Math.random() * 900000)}`;
}

function normalizeRole(role = '') {
  const value = String(role || '').toLowerCase().replace(/[\s-]+/g, '_');
  if (value === 'manager') return 'manager';
  if (value === 'employee') return 'employee';
  return 'employee';
}

async function getRequester(supabase, req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth