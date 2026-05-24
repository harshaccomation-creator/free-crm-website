import { useState } from 'react';
import '../styles/loginPage.css';

function LoginIllustration() {
  return (
    <div className="login-css-art" aria-label="SalesFlow CRM workspace illustration">
      <div className="art-bg-circle one" />
      <div className="art-bg-circle two" />
      <div className="art-dashboard">
        <aside><i /><i /><i /><i /><i /></aside>
        <main>
          <div className="art-cards"><span><b>1,250</b><em>Leads</em></span><span><b>850</b><em>Deals</em></span><span><b>₹24.5k</b><em>Revenue</em></span></div>
          <div className="art-chart"><strong>Sales Overview</strong><svg viewBox="0 0 300 110"><path d="M20 72 C70 30 105 84 150 42 C190 10 230 74 280 38" fill="none" stroke="#0b63f6" strokeWidth="7" strokeLinecap="round"/><path d="M20 88 C80 74 120 84 160 60 C205 34 238 52 280 24" fill="none" stroke="#69aefc" strokeWidth="5" strokeLinecap="round" opacity=".75"/></svg></div>
          <div className="art-activity"><strong>Recent Activities</strong><p /><p /><p /></div>
        </main>
      </div>
      <div className="art-person"><span /><b /><em /><i /></div>
      <div className="art-table"><p /><p /><p /></div>
      <div className="art-plant"><i /><i /><i /><b /></div>
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

  const goHome = () => navigateTo('/');

  const submitLogin = (event) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage('Please enter your email and password.');
      return;
    }
    if (password !== '123456') {
      setMessage('Use password 123456 for demo login.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'employee@salesflow.com') return navigateTo('/employee/dashboard');
    if (cleanEmail === 'admin@salesflow.com') return navigateTo('/admin/dashboard');
    if (cleanEmail === 'superadmin@salesflow.com') return navigateTo('/super-admin/dashboard');
    setMessage('Demo emails: employee@salesflow.com, admin@salesflow.com, superadmin@salesflow.com');
  };

  return (
    <main className="login-page-shell">
      <button className="login-home-btn" onClick={goHome}>← Back to SalesFlow</button>

      <section className="login-card-wrap">
        <aside className="login-visual-panel">
          <div className="login-brand">
            <span className="login-brand-mark">S</span>
            <div>
              <strong>Sales<span>Flow</span></strong>
              <small>Grow your business, build better relationships.</small>
            </div>
          </div>

          <div className="crm-illustration clean-svg-illustration">
            <LoginIllustration />
          </div>

          <div className="login-visual-copy">
            <h1>Manage Leads. Close Deals. Grow Your Business.</h1>
          </div>
        </aside>

        <section className="login-form-panel">
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
