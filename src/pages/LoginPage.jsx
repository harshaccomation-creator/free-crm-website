import { useMemo, useState } from 'react';
import '../styles/loginPage.css';
import '../styles/loginDarkHero.css';

function DarkCrmHero() {
  return (
    <div className="dark-crm-hero stable-login-hero">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="hero-grid-wave" />

      <div className="dark-hero-content">
        <div className="dark-hero-brand salesflow-orange-brand">
          <span className="salesflow-orange-mark">S</span>
          <strong>Sales<span>Flow</span></strong>
        </div>

        <h1>Manage leads.<br />Close deals <span>faster.</span></h1>
        <p className="dark-hero-copy">
          Manage leads, follow-ups, sales, clients, and team activity from one powerful dashboard.
        </p>

        <div className="dark-feature-list">
          <article>
            <span>♙</span>
            <div>
              <strong>Lead Tracking</strong>
              <p>Capture, track, and manage leads through every stage.</p>
            </div>
          </article>
          <article>
            <span>👥</span>
            <div>
              <strong>Team Collaboration</strong>
              <p>Assign tasks, manage follow-ups, and keep your team aligned.</p>
            </div>
          </article>
          <article>
            <span>♢</span>
            <div>
              <strong>Secure Access</strong>
              <p>Role-based CRM access for employees, admins and super admins.</p>
            </div>
          </article>
        </div>
      </div>

      <div className="dark-dashboard-preview clean-preview-card">
        <div className="dash-side">
          <b><span className="mini-s">S</span> CRM</b>
          <span className="active">⌂ Dashboard</span>
          <span>♙ Leads</span>
          <span>◇ Deals</span>
          <span>☷ Contacts</span>
          <span>☑ Tasks</span>
          <span>▣ Calendar</span>
          <span>◔ Reports</span>
        </div>

        <div className="dash-main">
          <h3>Dashboard</h3>

          <div className="dash-top-cards">
            <article>
              <small>Total Leads</small>
              <b>1,250</b>
              <em>↑ 18.5%</em>
            </article>
            <article>
              <small>Deals Won</small>
              <b>320</b>
              <em>↑ 12.7%</em>
            </article>
          </div>

          <div className="dash-chart">
            <strong>Sales Overview</strong>
            <svg viewBox="0 0 260 120">
              <path
                d="M18 92 C48 72 62 42 92 66 C114 84 134 26 160 48 C184 68 188 32 208 52 C228 74 236 32 250 44"
                fill="none"
                stroke="#1682ff"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <g fill="#1682ff">
                <circle cx="18" cy="92" r="3" />
                <circle cx="92" cy="66" r="3" />
                <circle cx="160" cy="48" r="3" />
                <circle cx="250" cy="44" r="3" />
              </g>
            </svg>
          </div>

          <div className="dash-source">
            <strong>Leads by Source</strong>
            <div className="source-row"><i />Website <b>35%</b></div>
            <div className="source-row"><i />Referral <b>25%</b></div>
            <div className="source-row"><i />Social Media <b>20%</b></div>
          </div>
        </div>
      </div>

      <div className="floating-revenue">
        <small>Revenue This Month</small>
        <b>₹78,420</b>
        <em>↑ 16.3% vs last month</em>
      </div>
    </div>
  );
}

const initialSignup = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  password: '',
  confirmPassword: '',
  otp: '',
};

function passwordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 8 || score < 3) {
    return { label: 'Weak', className: 'weak' };
  }

  if (score >= 5) {
    return { label: 'Strong', className: 'strong' };
  }

  return { label: 'Medium', className: 'medium' };
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || data.error || 'Something went wrong.');
  }

  return data;
}

export default function LoginPage() {
  const [activeMode, setActiveMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signup, setSignup] = useState(initialSignup);
  const [otpSent, setOtpSent] = useState(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(signup.password), [signup.password]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('salesflow:navigate'));
  };

  const updateSignup = (key, value) => {
    setSignup((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submitLogin = (event) => {
    event.preventDefault();

    if (!email || !password) {
      return setMessage('Please enter your email and password.');
    }

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail.includes('superadmin')) {
      return navigateTo('/super-admin/dashboard');
    }

    if (cleanEmail.includes('admin')) {
      return navigateTo('/admin/dashboard');
    }

    if (cleanEmail.includes('employee') || cleanEmail.includes('sales')) {
      return navigateTo('/employee/dashboard');
    }

    return setMessage('Invalid email or password. Please try again.');
  };

  const requestSignupOtp = async (event) => {
    event.preventDefault();
    setMessage('');

    const cleanPhone = signup.phone.replace(/\D/g, '').slice(-10);

    if (!signup.fullName.trim()) {
      return setMessage('Please enter your full name.');
    }

    if (!signup.email.trim()) {
      return setMessage('Please enter your email.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email.trim())) {
      return setMessage('Please enter a valid email address.');
    }

    if (!/^\d{10}$/.test(cleanPhone)) {
      return setMessage('Please enter valid 10 digit mobile number.');
    }

    if (signup.password.length < 8) {
      return setMessage('Password must be minimum 8 characters.');
    }

    if (strength.className === 'weak') {
      return setMessage('Password is weak. Add uppercase, number and symbol.');
    }

    if (signup.password !== signup.confirmPassword) {
      return setMessage('Password and confirm password do not match.');
    }

    try {
      setLoading(true);

      const data = await postJson('/api/signup-send-otp', {
        fullName: signup.fullName,
        email: signup.email,
        phone: signup.phone,
        companyName: signup.companyName || `${signup.fullName}'s Workspace`,
        password: signup.password,
      });

      setOtpSent(true);
      setMessage(data.message || 'OTP sent to your email.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifySignupOtp = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!/^\d{6}$/.test(signup.otp.trim())) {
      return setMessage('Please enter valid 6 digit OTP.');
    }

    try {
      setLoading(true);

      const data = await postJson('/api/signup-verify', {
        email: signup.email,
        otp: signup.otp,
        password: signup.password,
      });

      setMessage(data.message || 'Account created successfully.');

      setTimeout(() => {
        navigateTo(data.redirectTo || '/employee/dashboard');
      }, 500);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openSignup = () => {
    setActiveMode('signup');
    setMessage('');
  };

  const openLogin = () => {
    setActiveMode('login');
    setMessage('');
  };

  return (
    <main className="login-dark-page">
      <button className="login-home-btn dark-back" onClick={() => navigateTo('/')}>
        ← Back to SalesFlow
      </button>

      <section className="login-dark-card">
        <aside className="login-dark-left">
          <DarkCrmHero />
        </aside>

        <section className="login-dark-form-panel">
          <div className="login-form-box signup-enabled-box">
            <div className="auth-mode-tabs">
              <button
                type="button"
                className={activeMode === 'login' ? 'active' : ''}
                onClick={openLogin}
              >
                Sign In
              </button>

              <button
                type="button"
                className={activeMode === 'signup' ? 'active' : ''}
                onClick={openSignup}
              >
                Create Account
              </button>
            </div>

            {activeMode === 'login' ? (
              <>
                <h2>Welcome Back!</h2>
                <p>Please sign in to your account</p>

                <form onSubmit={submitLogin} className="login-form">
                  <label>
                    Email
                    <div className="login-input-wrap">
                      <span>✉</span>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </label>

                  <label>
                    Password
                    <div className="login-input-wrap">
                      <span>🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </label>

                  <div className="login-options-row">
                    <label className="remember-check">
                      <input type="checkbox" defaultChecked /> Remember me
                    </label>

                    <button
                      type="button"
                      onClick={() => setMessage('Password reset will be connected with your account authentication.')}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button className="sign-in-btn" type="submit">
                    Sign In
                  </button>
                </form>

                <div className="login-divider">
                  <span />OR<span />
                </div>

                <button
                  className="google-login-btn"
                  onClick={() => setMessage('Google sign-in will be connected with OAuth.')}
                >
                  <span>G</span> Sign in with Google
                </button>

                <p className="signup-copy">
                  Don’t have an account?{' '}
                  <button onClick={openSignup}>
                    Create 7 days trial
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2>Create Account</h2>
                <p>Email OTP verify hote hi employee dashboard open hoga.</p>

                <form
                  onSubmit={otpSent ? verifySignupOtp : requestSignupOtp}
                  className="login-form signup-form-grid"
                >
                  <label>
                    Full Name
                    <div className="login-input-wrap">
                      <span>👤</span>
                      <input
                        placeholder="Enter full name"
                        value={signup.fullName}
                        onChange={(event) => updateSignup('fullName', event.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                  </label>

                  <label>
                    Email ID
                    <div className="login-input-wrap">
                      <span>✉</span>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={signup.email}
                        onChange={(event) => updateSignup('email', event.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                  </label>

                  <label>
                    Mobile Number
                    <div className="login-input-wrap">
                      <span>📱</span>
                      <input
                        placeholder="10 digit mobile"
                        value={signup.phone}
                        onChange={(event) => updateSignup('phone', event.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                  </label>

                  <label>
                    Company Name
                    <div className="login-input-wrap">
                      <span>🏢</span>
                      <input
                        placeholder="Company / Workspace name"
                        value={signup.companyName}
                        onChange={(event) => updateSignup('companyName', event.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                  </label>

                  <label>
                    Password
                    <div className="login-input-wrap">
                      <span>🔒</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        value={signup.password}
                        onChange={(event) => updateSignup('password', event.target.value)}
                        disabled={otpSent}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </label>

                  <label>
                    Confirm Password
                    <div className="login-input-wrap">
                      <span>🔐</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={signup.confirmPassword}
                        onChange={(event) => updateSignup('confirmPassword', event.target.value)}
                        disabled={otpSent}
                      />
                    </div>
                  </label>

                  <div className={`password-strength ${strength.className}`}>
                    <span />
                    Password strength: <b>{strength.label}</b>
                  </div>

                  {otpSent && (
                    <label className="otp-field">
                      Email OTP
                      <div className="login-input-wrap">
                        <span>✅</span>
                        <input
                          placeholder="Enter 6 digit OTP"
                          value={signup.otp}
                          onChange={(event) => updateSignup('otp', event.target.value)}
                          maxLength={6}
                        />
                      </div>
                    </label>
                  )}

                  <button className="sign-in-btn" type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : otpSent ? 'Verify & Create Account' : 'Send OTP'}
                  </button>

                  {otpSent && (
                    <button
                      type="button"
                      className="google-login-btn"
                      onClick={() => {
                        setOtpSent(false);
                        updateSignup('otp', '');
                        setMessage('You can edit details and request OTP again.');
                      }}
                    >
                      Edit details
                    </button>
                  )}
                </form>

                <p className="signup-copy">
                  Already have an account?{' '}
                  <button onClick={openLogin}>Sign in</button>
                </p>
              </>
            )}

            {message && <div className="login-message">{message}</div>}
          </div>
        </section>
      </section>
    </main>
  );
}
