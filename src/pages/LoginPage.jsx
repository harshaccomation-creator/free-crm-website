import { useState } from 'react';
import '../styles/loginPage.css';
import '../styles/loginDarkHero.css';

function DarkCrmHero() {
  return (
    <div className="dark-crm-hero">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-grid-wave" />

      <div className="dark-hero-brand">
        <span className="bar-logo"><i /><i /><i /></span>
        <strong>SalesFlow <em>CRM</em></strong>
      </div>

      <h1>Manage leads.<br />Close deals <span>faster.</span></h1>
      <p className="dark-hero-copy">Manage leads, follow-ups, sales, clients, and team activity from one powerful dashboard.</p>

      <div className="dark-feature-list">
        <article><span>♙</span><div><strong>Lead Tracking</strong><p>Capture, track, and manage leads through every stage.</p></div></article>
        <article><span>👥</span><div><strong>Team Collaboration</strong><p>Work together, assign tasks, and stay aligned with your team.</p></div></article>
        <article><span>♢</span><div><strong>Secure Access</strong><p>Role-based security to keep your CRM data safe and compliant.</p></div></article>
      </div>

      <div className="dark-dashboard-preview">
        <div className="dash-side">
          <b>▥ CRM</b><span className="active">⌂ Dashboard</span><span>♙ Leads</span><span>◇ Deals</span><span>☷ Contacts</span><span>☑ Tasks</span><span>▣ Calendar</span><span>◔ Reports</span><span>⚙ Settings</span>
        </div>
        <div className="dash-main">
          <h3>Dashboard</h3>
          <div className="dash-top-cards"><article><small>Total Leads</small><b>1,250</b><em>↑ 18.5%</em></article><article><small>Deals Won</small><b>320</b><em>↑ 12.7%</em></article></div>
          <div className="dash-chart"><strong>Sales Overview</strong><svg viewBox="0 0 260 120"><path d="M18 92 C48 72 62 42 92 66 C114 84 134 26 160 48 C184 68 188 32 208 52 C228 74 236 32 250 44" fill="none" stroke="#1682ff" strokeWidth="4" strokeLinecap="round"/><g fill="#1682ff"><circle cx="18" cy="92" r="3"/><circle cx="92" cy="66" r="3"/><circle cx="160" cy="48" r="3"/><circle cx="250" cy="44" r="3"/></g></svg></div>
          <div className="dash-source"><strong>Leads by Source</strong><div className="source-row"><i />Website <b>35%</b></div><div className="source-row"><i />Referral <b>25%</b></div><div className="source-row"><i />Social Media <b>20%</b></div></div>
        </div>
      </div>

      <div className="floating-revenue"><small>Revenue This Month</small><b>$78,420</b><em>↑ 16.3% vs last month</em></div>
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('salesflow:navigate'));
  };

  const submitLogin = (event) => {
    event.preventDefault();
    if (!email || !password) return setMessage('Please enter your email and password.');
    if (password !== '123456') return setMessage('Use password 123456 for demo login.');
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'employee@salesflow.com') return navigateTo('/employee/dashboard');
    if (cleanEmail === 'admin@salesflow.com') return navigateTo('/admin/dashboard');
    if (cleanEmail === 'superadmin@salesflow.com') return navigateTo('/super-admin/dashboard');
    setMessage('Demo emails: employee@salesflow.com, admin@salesflow.com, superadmin@salesflow.com');
  };

  return (
    <main className="login-dark-page">
      <button className="login-home-btn dark-back" onClick={() => navigateTo('/')}>← Back to SalesFlow</button>
      <section className="login-dark-card">
        <aside className="login-dark-left"><DarkCrmHero /></aside>
        <section className="login-dark-form-panel">
          <div className="login-form-box">
            <h2>Welcome Back!</h2>
            <p>Please sign in to your account</p>
            <form onSubmit={submitLogin} className="login-form">
              <label>Email<div className="login-input-wrap"><span>✉</span><input type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
              <label>Password<div className="login-input-wrap"><span>🔒</span><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? '🙈' : '👁'}</button></div></label>
              <div className="login-options-row"><label className="remember-check"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" onClick={() => setMessage('Password reset page will be connected with authentication.')}>Forgot password?</button></div>
              <button className="sign-in-btn" type="submit">Sign In</button>
            </form>
            <div className="login-divider"><span />OR<span /></div>
            <button className="google-login-btn" onClick={() => setMessage('Google sign-in will be connected with OAuth later.')}><span>G</span> Sign in with Google</button>
            <p className="signup-copy">Don’t have an account? <button onClick={() => setMessage('Signup flow will be connected next.')}>Sign up</button></p>
            {message && <div className="login-message">{message}</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
