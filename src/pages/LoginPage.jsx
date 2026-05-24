import { useState } from 'react';
import '../styles/loginPage.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const submitLogin = (event) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage('Please enter your email and password.');
      return;
    }
    setMessage('Login flow is ready. Backend authentication will be connected next.');
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
              <small>CRM workspace for faster follow-ups</small>
            </div>
          </div>

          <div className="crm-illustration" aria-label="SalesFlow CRM illustration">
            <div className="analytics-window">
              <div className="window-sidebar"><i /><i /><i /><i /></div>
              <div className="window-body">
                <div className="metric-row">
                  <span><b>1,250</b><small>Leads</small></span>
                  <span><b>850</b><small>Deals</small></span>
                  <span><b>₹24.5k</b><small>Revenue</small></span>
                </div>
                <div className="chart-box"><i /><i /></div>
                <div className="activity-lines"><span /><span /><span /></div>
              </div>
            </div>
            <div className="person-block">
              <span className="person-head" />
              <span className="person-body" />
              <span className="person-desk" />
            </div>
            <div className="plant-block"><i /><i /><i /></div>
          </div>

          <div className="login-visual-copy">
            <h1>Manage leads. Close deals. Grow your business.</h1>
            <p>Track leads, activity, tasks and revenue from one clean SalesFlow workspace.</p>
          </div>
        </aside>

        <section className="login-form-panel">
          <div className="login-form-box">
            <span className="login-kicker">Welcome back</span>
            <h2>Sign in to SalesFlow</h2>
            <p>Access your CRM dashboard and continue managing your sales pipeline.</p>

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
