import { useState } from 'react';
import '../styles/loginPage.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('salesflow:navigate'));
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
              <small>Grow your business, build better relationships.</small>
            </div>
          </div>

          <div className="crm-illustration" aria-label="SalesFlow CRM illustration">
            <div className="crm-board">
              <div className="crm-sidebar"><i /><i /><i /><i /><i /></div>
              <div className="crm-screen">
                <div className="crm-stats">
                  <div><b>1,250</b><span>Leads</span></div>
                  <div><b>850</b><span>Deals</span></div>
                  <div><b>$24,500</b><span>Revenue</span></div>
                </div>
                <div className="crm-main-panels">
                  <div className="chart-panel">
                    <span className="panel-title">Sales Overview</span>
                    <div className="chart-grid" />
                    <div className="chart-line line-one" />
                    <div className="chart-line line-two" />
                  </div>
                  <div className="activity-panel">
                    <span className="panel-title">Recent Activities</span>
                    {[1, 2, 3].map((row) => (
                      <div className="activity-row" key={row}><i /><div><span /><span /></div></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="illustration-dots" />

            <div className="desk-scene">
              <div className="desk-table" />
              <div className="desk-leg left" />
              <div className="desk-leg right" />
              <div className="laptop"><div className="laptop-screen"><span /><span /><span /></div></div>
              <div className="person">
                <div className="person-head" />
                <div className="person-body" />
                <div className="person-arm" />
                <div className="person-chair" />
                <div className="person-leg one" />
                <div className="person-leg two" />
              </div>
            </div>

            <div className="left-plant">
              <span className="pot" />
              <i className="leaf one" />
              <i className="leaf two" />
              <i className="leaf three" />
              <i className="leaf four" />
            </div>
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
