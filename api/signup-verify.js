import { assertPost, getAdminClient, json, normalizeEmail, sha256 } from './_utils.js';

export default async function handler(req, res) {
  if (!assertPost(req, res)) return;

  try {
    const { email: rawEmail, otp, password } = req.body || {};
    const email = normalizeEmail(rawEmail);
    const code = String(otp || '').trim();
    const userPassword = String(password || '');

    if (!email) {
      return json(res, 400, { ok: false, field: 'email', message: 'Email is required.' });
    }

    if (!/^\d{6}$/.test(code)) {
      return json(res, 400, { ok: false, field: 'otp', message: 'Please enter valid 6 digit OTP.' });
    }

    if (userPassword.length < 8) {
      return json(res, 400, { ok: false, field: 'password', message: 'Password must be minimum 8 characters.' });
    }

    const supabase = getAdminClient();

    const { data: otpRow, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('purpose', 'signup')
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) throw otpError;

    if (!otpRow) {
      return json(res, 400, { ok: false, field: 'otp', message: 'OTP not found. Please request a new OTP.' });
    }

    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      return json(res, 400, { ok: false, field: 'otp', message: 'OTP expired. Please request a new OTP.' });
    }

    if (otpRow.attempts >= 5) {
      return json(res, 400, { ok: false, field: 'otp', message: 'Too many attempts. Please request a new OTP.' });
    }

    const otpHash = await sha256(`${email}:${code}:signup`);

    if (otpHash !== otpRow.otp_hash) {
      await supabase
        .from('otp_codes')
        .update({ attempts: otpRow.attempts + 1 })
        .eq('id', otpRow.id);

      return json(res, 400, { ok: false, field: 'otp', message: 'Invalid OTP. Please try again.' });
    }

    const { data: pending, error: pendingError } = await supabase
      .from('pending_signups')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingError) throw pendingError;

    if (!pending) {
      return json(res, 400, { ok: false, message: 'Signup request not found. Please signup again.' });
    }

    const { data: existingEmail } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      return json(res, 409, { ok: false, field: 'email', message: 'This email is already registered. Please login.' });
    }

    const { data: existingPhone } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone_normalized', pending.phone_normalized)
      .maybeSingle();

    if (existingPhone) {
      return json(res, 409, { ok: false, field: 'phone', message: 'This mobile number is already registered.' });
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: userPassword,
      email_confirm: true,
      user_metadata: {
        full_name: pending.full_name,
        phone: pending.phone,
        role: 'employee',
      },
    });

    if (authError) throw authError;

    const userId = authUser.user.id;
    const now = new Date();
    const trialEnds = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: pending.company_name || `${pending.full_name}'s Workspace`,
        admin_email: email,
        admin_phone: pending.phone,
        signup_user_id: userId,
        plan_status: 'trial',
        account_status: 'trial',
        trial_start_at: now.toISOString(),
        trial_ends_at: trialEnds.toISOString(),
        plan: 'free',
      })
      .select('*')
      .single();

    if (companyError) throw companyError;

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      company_id: company.id,
      full_name: pending.full_name,
      email,
      phone: pending.phone,
      phone_normalized: pending.phone_normalized,
      role: 'employee',
      is_email_verified: true,
      email_verified_at: now.toISOString(),
      trial_started_at: now.toISOString(),
      trial_ends_at: trialEnds.toISOString(),
      signup_source: 'website',
      is_active: true,
    });

    if (profileError) throw profileError;

    await supabase
      .from('otp_codes')
      .update({ is_used: true, verified_at: now.toISOString() })
      .eq('id', otpRow.id);

    await supabase
      .from('pending_signups')
      .update({ status: 'verified' })
      .eq('id', pending.id);

    return json(res, 200, {
      ok: true,
      message: 'Account created successfully.',
      redirectTo: '/employee/dashboard',
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      message: error.message || 'Unable to verify OTP.',
    });
  }
}
