import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function adminClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

export function normalizePhone(phone = '') {
  let digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(-10);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(-10);
  return digits;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getPasswordStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length < 8) return 'weak';
  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(email, otp, purpose) {
  const secret = process.env.OTP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'salesflow-dev-secret';
  return crypto.createHash('sha256').update(`${normalizeEmail(email)}:${purpose}:${otp}:${secret}`).digest('hex');
}

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'SalesFlow Hub <onboarding@resend.dev>';
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Unable to send email');
  }
  return data;
}

export function otpTemplate({ otp, title = 'SalesFlow Login OTP' }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f6f9ff;padding:28px;color:#0f172a">
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5edf8;border-radius:18px;padding:26px;box-shadow:0 16px 40px rgba(15,23,42,.06)">
        <h2 style="margin:0 0 8px;font-size:22px">${title}</h2>
        <p style="margin:0 0 18px;color:#64748b">Use this OTP to continue. It expires in 5 minutes.</p>
        <div style="letter-spacing:8px;font-size:34px;font-weight:800;background:#eef5ff;color:#0b63f6;border-radius:14px;padding:18px;text-align:center">${otp}</div>
        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px">If you did not request this, you can ignore this email.</p>
      </div>
    </div>`;
}

export async function storeOtp({ supabase, email, otp, purpose }) {
  const otpHash = hashOtp(email, otp, purpose);
  await supabase.from('otp_codes').update({ is_used: true }).eq('email', normalizeEmail(email)).eq('purpose', purpose).eq('is_used', false);
  return supabase.from('otp_codes').insert({
    email: normalizeEmail(email),
    purpose,
    otp_hash: otpHash,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
}

export async function verifyOtp({ supabase, email, otp, purpose }) {
  const normalizedEmail = normalizeEmail(email);
  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', normalizedEmail)
    .eq('purpose', purpose)
    .eq('is_used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false, message: 'OTP not found. Please request a new OTP.' };
  if (new Date(data.expires_at).getTime() < Date.now()) return { ok: false, message: 'OTP expired. Please request a new OTP.' };
  if (data.attempts >= 5) return { ok: false, message: 'Too many wrong attempts. Please request a new OTP.' };

  const expected = hashOtp(normalizedEmail, otp, purpose);
  if (expected !== data.otp_hash) {
    await supabase.from('otp_codes').update({ attempts: data.attempts + 1 }).eq('id', data.id);
    return { ok: false, message: 'Invalid OTP. Please try again.' };
  }

  await supabase.from('otp_codes').update({ is_used: true, verified_at: new Date().toISOString() }).eq('id', data.id);
  return { ok: true };
}


export function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

export function normalizePhone(phone = '') {
  let digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(-10);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(-10);
  return digits;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getPasswordStrength(password = '') {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length < 8) return 'weak';
  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(email, otp, purpose) {
  const secret = process.env.OTP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'salesflow-dev-secret';
  return crypto.createHash('sha256').update(`${normalizeEmail(email)}:${purpose}:${otp}:${secret}`).digest('hex');
}

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'SalesFlow Hub <onboarding@resend.dev>';
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Unable to send email');
  }
  return data;
}

export function otpTemplate({ otp, title = 'SalesFlow Login OTP' }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f6f9ff;padding:28px;color:#0f172a">
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5edf8;border-radius:18px;padding:26px;box-shadow:0 16px 40px rgba(15,23,42,.06)">
        <h2 style="margin:0 0 8px;font-size:22px">${title}</h2>
        <p style="margin:0 0 18px;color:#64748b">Use this OTP to continue. It expires in 5 minutes.</p>
        <div style="letter-spacing:8px;font-size:34px;font-weight:800;background:#eef5ff;color:#0b63f6;border-radius:14px;padding:18px;text-align:center">${otp}</div>
        <p style="margin:18px 0 0;color:#94a3b8;font-size:12px">If you did not request this, you can ignore this email.</p>
      </div>
    </div>`;
}

export async function storeOtp({ supabase, email, otp, purpose }) {
  const otpHash = hashOtp(email, otp, purpose);
  await supabase.from('otp_codes').update({ is_used: true }).eq('email', normalizeEmail(email)).eq('purpose', purpose).eq('is_used', false);
  return supabase.from('otp_codes').insert({
    email: normalizeEmail(email),
    purpose,
    otp_hash: otpHash,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
}

export async function verifyOtp({ supabase, email, otp, purpose }) {
  const normalizedEmail = normalizeEmail(email);
  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', normalizedEmail)
    .eq('purpose', purpose)
    .eq('is_used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false, message: 'OTP not found. Please request a new OTP.' };
  if (new Date(data.expires_at).getTime() < Date.now()) return { ok: false, message: 'OTP expired. Please request a new OTP.' };
  if (data.attempts >= 5) return { ok: false, message: 'Too many wrong attempts. Please request a new OTP.' };

  const expected = hashOtp(normalizedEmail, otp, purpose);
  if (expected !== data.otp_hash) {
    await supabase.from('otp_codes').update({ attempts: data.attempts + 1 }).eq('id', data.id);
    return { ok: false, message: 'Invalid OTP. Please try again.' };
  }

  await supabase.from('otp_codes').update({ is_used: true, verified_at: new Date().toISOString() }).eq('id', data.id);
  return { ok: true };
}
