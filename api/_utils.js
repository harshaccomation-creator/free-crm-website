import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OTP_FROM_EMAIL = process.env.OTP_FROM_EMAIL || 'SalesFlow Hub <onboarding@resend.dev>';

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function assertPost(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { ok: false, message: 'Method not allowed' });
    return false;
  }
  return true;
}

export function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server env. Add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

export function normalizePhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(-10);
  return digits;
}

export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getPasswordStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length < 8) return { label: 'weak', score };
  if (score >= 5) return { label: 'strong', score };
  if (score >= 3) return { label: 'medium', score };
  return { label: 'weak', score };
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sendOtpEmail({ to, otp, purpose = 'login' }) {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY in Vercel environment variables.');
  }
  const title = purpose === 'signup' ? 'Verify your SalesFlow account' : 'Your SalesFlow login OTP';
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h2 style="margin:0 0 12px;color:#0f172a">${title}</h2><p style="color:#475569">Use this OTP to continue. It will expire in 5 minutes.</p><div style="font-size:32px;font-weight:800;letter-spacing:8px;background:#eef5ff;color:#0b63f6;padding:18px 20px;border-radius:12px;text-align:center">${otp}</div><p style="color:#64748b;font-size:12px;margin-top:18px">If you did not request this, you can ignore this email.</p></div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: OTP_FROM_EMAIL,
      to,
      subject: title,
      html,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.message || 'Failed to send OTP email');
  }
  return result;
}
