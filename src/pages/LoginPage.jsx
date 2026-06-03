import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { normalizeRole, roleHome, syncStoredProfile } from '../hooks/useAuthProfile.js';
import '../styles/loginPage.css';
import '../styles/loginDarkHero.css';

function navigateTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.message || data.error || 'Something went wrong.');
  return data;
}

function Hero() {
  return (
    <div className="dark-crm-hero stable-login-hero">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-grid-wave" />
      <div className="dark-hero-content">
        <div className="dark-hero-brand salesflow-orange-brand"><span className="salesflow-orange-mark">S</span><strong>Sales<span>Flow</span></strong></div>
        <h1>Manage leads.<br />Close deals <span>faster.</span></h1>
        <p className="dark-hero-copy">Manage leads, follow-ups, sales, clients, and team activity from one secure dashboard.</p>
        <div className="dark-feature-list">
          <article><span>♙</span><div><strong>Lead Tracking</strong><p>Capture and manage leads through every stage.</p></div></article>
          <article><span>👥</span><div><strong>Team Collaboration</strong><p>Assign work and keep employee access controlled.</p></div></article>
          <article><span>♢</span><div><strong>Secure Access</strong><p>Role-based access powered by Supabase auth.</p></div></article>
        </div>
      </div>
    </div>
  );
}

const blankSignup = { fullName: '', phone: '', companyName: '', email: '', password: '', confirmPassword: '', otp: '' };

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signup, setSignup] = useState(blankSignup);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateSignup = (key, value) => setSignup((current) => ({ ...current, [key]: value }));

  async function submitLogin(event) {
    event.preventDefault();
    setMessage('');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return setMessage('Please enter email and password.');
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) throw error;
      const user = data?.user;
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (profileError) throw profileError;
      const role = syncStoredProfile(user, profile);
      navigateTo(roleHome(role));
    } catch (error) {
      setMessage(error.message || 'Unable to login.');
    } finally {
      setLoading(false);
    }
  }

  async function requestOtp(event) {
    event.preventDefault();
    setMessage('');
    if (!signup.fullName.trim()) return setMessage('Please enter full name.');
    if (!/^\d{10}$/.test(signup.phone.replace(/\D/g, '').slice(-10))) return setMessage('Please enter valid 10 digit mobile number.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email.trim())) return setMessage('Please enter valid email.');
    if (signup.password.length < 8) return setMessage('Password must be at least 8 characters.');
    if (signup.password !== signup.confirmPassword) return setMessage('Password and confirm password do not match.');
    try {
      setLoading(true);
      const data = await postJson('/api/signup-send-otp', signup);
      setMessage(data.message || 'OTP sent to your email.');
      setStep(3);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setMessage('');
    if (!/^\d{6}$/.test(signup.otp.trim())) return setMessage('Please enter valid 6 digit OTP.');
    try {
      setLoading(true);
      const data = await postJson('/api/signup-verify', { email: signup.email, otp: signup.otp, password: signup.password });
      const role = normalizeRole(data.role || 'employee');
      setMessage(data.message || 'Account created. Please login.');
      setMode('login');
      setEmail(signup.email.trim().toLowerCase());
      setPassword('');
      setStep(1);
      window.localStorage.setItem('salesflow_user_role', role);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-dark-page">
      <button className="login-home-btn dark-back" onClick={() => navigateTo('/')}>← Back to SalesFlow</button>
      <section className="login-dark-card">
        <aside className="login-dark-left"><Hero /></aside>
        <section className="login-dark-form-panel">
          <div className="login-form-box signup-enabled-box">
            <div className="auth-mode-tabs">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage(''); }}>Sign In</button>
              <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setMessage(''); }}>Create Account</button>
            </div>
            {mode === 'login' ? (
              <>
                <h2>Welcome Back!</h2>
                <p>Please sign in to your account</p>
                <form onSubmit={submitLogin} className="login-form">
                  <label>Email<div className="login-input-wrap"><span>✉</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" /></div></label>
                  <label>Password<div className="login-input-wrap"><span>🔒</span><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? '🙈' : '👁'}</button></div></label>
                  <button className="sign-in-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                </form>
                <p className="signup-copy">Don’t have an account? <button onClick={() => setMode('signup')}>Create 7 days trial</button></p>
              </>
            ) : (
              <>
                <h2>Create Account</h2>
                <p>Step {step} of 3</p>
                {step === 1 && <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="login-form signup-form-grid step-signup-form"><label>Full Name<div className="login-input-wrap"><span>👤</span><input value={signup.fullName} onChange={(e) => updateSignup('fullName', e.target.value)} /></div></label><label>Mobile Number<div className="login-input-wrap"><span>��</span><input value={signup.phone} onChange={(e) => updateSignup('phone', e.target.value)} /></div></label><label>Company Name<div className="login-input-wrap"><span>🏢</span><input value={signup.companyName} onChange={(e) => updateSignup('companyName', e.target.value)} /></div></label><button className="sign-in-btn" type="submit">Next</button></form>}
                {step === 2 && <form onSubmit={requestOtp} className="login-form signup-form-grid step-signup-form"><label>Email ID<div className="login-input-wrap"><span>✉</span><input type="email" value={signup.email} onChange={(e) => updateSignup('email', e.target.value)} /></div></label><label>Password<div className="login-input-wrap"><span>🔒</span><input type="password" value={signup.password} onChange={(e) => updateSignup('password', e.target.value)} /></div></label><label>Confirm Password<div className="login-input-wrap"><span>🔐</span><input type="password" value={signup.confirmPassword} onChange={(e) => updateSignup('confirmPassword', e.target.value)} /></div></label><div className="signup-nav-row"><button type="button" className="google-login-btn" onClick={() => setStep(1)}>Back</button><button className="sign-in-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button></div></form>}
                {step === 3 && <form onSubmit={verifyOtp} className="login-form signup-form-grid step-signup-form"><label>Email OTP<div className="login-input-wrap"><span>✅</span><input maxLength={6} value={signup.otp} onChange={(e) => updateSignup('otp', e.target.value)} /></div></label><button className="sign-in-btn" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify & Create Account'}</button></form>}
              </>
            )}
            {message && <div className="login-message">{message}</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
