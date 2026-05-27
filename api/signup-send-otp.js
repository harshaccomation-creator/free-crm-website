import { assertPost, generateOtp, getAdminClient, getPasswordStrength, isValidEmail, json, normalizeEmail, normalizePhone, sendOtpEmail, sha256 } from './_utils.js';

export default async function handler(req, res) {
  if (!assertPost(req, res)) return;
  try {
    const { fullName, email: rawEmail, phone: rawPhone, password, companyName } = req.body || {};
    const full_name = String(fullName || '').trim();
    const email = normalizeEmail(rawEmail);
    const phone = String(rawPhone || '').trim();
    const phone_normalized = normalizePhone(phone);
    const strength = getPasswordStrength(password || '');

    if (!full_name || full_name.length < 2) return json(res, 400, { ok: false, field: 'fullName', message: 'Please enter your full name.' });
    if (!isValidEmail(email)) return json(res, 400, { ok: false, field: 'email', message: 'Please enter a valid email address.' });
    if (!phone_normalized || phone_normalized.length !== 10) return json(res, 400, { ok: false, field: 'phone', message: 'Please enter a valid 10 digit mobile number.' });
    if (strength.label === 'weak') return json(res, 400, { ok: false, field: 'password', strength, message: 'Password must be at least 8 characters and strong enough.' });

    const supabase = getAdminClient();

    const { data: existingEmail } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
    if (existingEmail) return json(res, 409, { ok: false, field: 'email', message: 'This email is already registered. Please login.' });

    const { data: existingPhone } = await supabase.from('profiles').select('id').eq('phone_normalized', phone_normalized).maybeSingle();
    if (existingPhone) return json(res, 409, { ok: false, field: 'phone', message: 'This mobile number is already registered.' });

    const otp = generateOtp();
    const otp_hash = await sha256(`${email}:${otp}:signup`);
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data: otpRow, error: otpError } = await supabase.from('otp_codes').insert({ email, otp_hash, expires_at, purpose: 'signup' }).select('id').single();
    if (otpError) throw otpError;

    await supabase.from('pending_signups').update({ status: 'cancelled' }).eq('email', email).eq('status', 'pending');
    const { error: pendingError } = await supabase.from('pending_signups').insert({
      full_name,
      email,
      phone,
      phone_normalized,
      company_name: String(companyName || `${full_name}'s Workspace`).trim(),
      otp_id: otpRow.id,
      status: 'pending',
    });
    if (pendingError) throw pendingError;

    await sendOtpEmail({ to: email, otp, purpose: 'signup' });
    return json(res, 200, { ok: true, message: 'OTP sent to your email.', strength });
  } catch (error) {
    return json(res, 500, { ok: false, message: error.message || 'Something went wrong while sending OTP.' });
  }
}
