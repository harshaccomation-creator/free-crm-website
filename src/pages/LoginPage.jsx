import { useState } from 'react';
import '../styles/loginPage.css';

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
            <img src="/login-crm-illustration.svg" alt="SalesFlow CRM dashboard illustration" />
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
              <label>
                Email
                <div className="login-input-wrap">
                  <span>✉</span>
                  <input type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
              </label>

              <label>
                Password
                <div className="login-input-wrap">
                  <span>🔒</span>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? '🙈' : '👁'}</button>
                </div>
              </label>

              <div className="login-options-row">
                <label className="remember-check"><input type="checkbox" defaultChecked /> Remember me</label>
                <button type="button" onClick={() => setMessage('Password reset page will be connected with authentication.')}>Forgot password?</button>
              </div>

              <button className="sign-in-btn" type="submit">Sign In</button>
            </form>

            <div className="login-divider"><span />OR<span /></div>

            <button className="google-login-btn" onClick={() => setMessage('Google sign-in will be connected with OAuth later.')}>
              <span>G</span> Sign in with Google
            </button>

            <p className="signup-copy">Don’t have an account? <button onClick={() => setMessage('Signup flow will be connected next.')}>Sign up</button></p>
            {message && <div className="login-message">{message}</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
