import { useState } from 'react';
import '../styles/loginPage.css';

function LoginIllustration() {
  return (
    <svg className="login-fixed-illustration" viewBox="0 0 720 520" role="img" aria-label="SalesFlow CRM dashboard illustration">
      <defs>
        <linearGradient id="panelBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f5bc4" />
          <stop offset="1" stopColor="#0b3d91" />
        </linearGradient>
        <linearGradient id="personBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8cff" />
          <stop offset="1" stopColor="#1f5fe0" />
        </linearGradient>
      </defs>

      <circle cx="105" cy="390" r="118" fill="#dbeafe" opacity="0.75" />
      <circle cx="618" cy="90" r="76" fill="#eef5ff" />
      <g opacity="0.45" fill="#9bbcff">
        {[0,1,2,3,4].map((r) => [0,1,2,3,4].map((c) => <circle key={`${r}-${c}`} cx={510 + c * 18} cy={70 + r * 18} r="3" />))}
      </g>

      <rect x="135" y="92" width="482" height="275" rx="22" fill="#ffffff" stroke="#dce7f6" />
      <rect x="135" y="92" width="86" height="275" rx="22" fill="url(#panelBlue)" />
      <rect x="166" y="120" width="44" height="12" rx="6" fill="#ffffff" />
      <rect x="166" y="156" width="54" height="12" rx="6" fill="#8db7f5" />
      <rect x="166" y="192" width="54" height="12" rx="6" fill="#8db7f5" />
      <rect x="166" y="228" width="54" height="12" rx="6" fill="#8db7f5" />
      <rect x="166" y="264" width="54" height="12" rx="6" fill="#8db7f5" />

      <g>
        <rect x="250" y="120" width="128" height="74" rx="16" fill="#fff" stroke="#dce7f6" />
        <text x="273" y="152" fill="#0f1b34" fontSize="25" fontWeight="800">1,250</text>
        <text x="274" y="176" fill="#60708f" fontSize="16">Leads</text>
        <rect x="400" y="120" width="128" height="74" rx="16" fill="#fff" stroke="#dce7f6" />
        <text x="424" y="152" fill="#0f1b34" fontSize="25" fontWeight="800">850</text>
        <text x="424" y="176" fill="#60708f" fontSize="16">Deals</text>
        <rect x="548" y="120" width="128" height="74" rx="16" fill="#fff" stroke="#dce7f6" />
        <text x="570" y="152" fill="#0f1b34" fontSize="25" fontWeight="800">₹24.5k</text>
        <text x="570" y="176" fill="#60708f" fontSize="16">Revenue</text>
      </g>

      <rect x="250" y="218" width="292" height="114" rx="16" fill="#fff" stroke="#dce7f6" />
      <text x="270" y="250" fill="#52637f" fontSize="17">Sales Overview</text>
      <path d="M275 296 C322 262 356 310 397 272 C432 240 474 296 522 266" fill="none" stroke="#0b63f6" strokeWidth="7" strokeLinecap="round" />
      <path d="M275 312 C326 296 356 300 397 282 C440 260 478 276 522 246" fill="none" stroke="#69aefc" strokeWidth="5" strokeLinecap="round" opacity="0.75" />

      <rect x="562" y="218" width="118" height="114" rx="16" fill="#fff" stroke="#dce7f6" />
      <text x="580" y="250" fill="#52637f" fontSize="16">Activities</text>
      <circle cx="586" cy="277" r="13" fill="#dbeafe" />
      <rect x="608" y="268" width="55" height="8" rx="4" fill="#c9dcf7" />
      <circle cx="586" cy="306" r="13" fill="#dbeafe" />
      <rect x="608" y="297" width="55" height="8" rx="4" fill="#c9dcf7" />

      <rect x="300" y="364" width="280" height="18" rx="9" fill="#bfd7fb" />
      <rect x="356" y="342" width="114" height="74" rx="12" fill="#f8fbff" stroke="#0b3d91" strokeWidth="3" />
      <rect x="372" y="360" width="72" height="8" rx="4" fill="#c9dcf7" />
      <rect x="372" y="378" width="62" height="8" rx="4" fill="#c9dcf7" />
      <rect x="372" y="396" width="52" height="8" rx="4" fill="#c9dcf7" />

      <g>
        <circle cx="490" cy="286" r="38" fill="#092b5c" />
        <path d="M432 346 C432 300 459 278 502 278 C545 278 574 304 574 346 L574 396 L432 396 Z" fill="url(#personBlue)" />
        <rect x="526" y="344" width="70" height="90" rx="18" fill="#2459bd" />
        <rect x="403" y="325" width="152" height="28" rx="14" fill="#4f8cff" transform="rotate(-18 403 325)" opacity="0.85" />
        <rect x="558" y="420" width="26" height="62" rx="13" fill="#0b2a5b" />
        <rect x="600" y="420" width="26" height="62" rx="13" fill="#0b2a5b" />
      </g>

      <g>
        <path d="M70 396 C32 350 32 315 98 358" fill="#5c8ff0" />
        <path d="M105 394 C86 326 108 294 139 360" fill="#8bbcff" />
        <path d="M130 396 C178 350 184 321 142 361" fill="#5c8ff0" />
        <rect x="86" y="390" width="70" height="60" rx="16" fill="#fff" />
      </g>
    </svg>
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
          <div className="crm-illustration clean-svg-illustration"><LoginIllustration /></div>
          <div className="login-visual-copy"><h1>Manage Leads. Close Deals. Grow Your Business.</h1></div>
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
