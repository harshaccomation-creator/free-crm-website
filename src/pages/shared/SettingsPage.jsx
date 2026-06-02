import DashboardSidebar from '../../components/dashboard/DashboardSidebar.jsx';
import '../../styles/settingsNotificationsPolish.css';

function getRole() {
  return localStorage.getItem('salesflow_user_role') || localStorage.getItem('salesflowRole') || 'employee';
}

function getDisplayRole(role) {
  const normalized = String(role || 'employee').replace(/[_-]+/g, ' ');
  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getName() {
  return localStorage.getItem('salesflow_user_name') || localStorage.getItem('salesflow_user_full_name') || 'SalesFlow User';
}

function getEmail() {
  return localStorage.getItem('salesflow_user_email') || 'No email found';
}

function initials(name = '') {
  return String(name || 'S').split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SF';
}

function go(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

const settingsSections = [
  {
    title: 'Profile',
    description: 'Keep your CRM identity clean across dashboards, leads, follow-ups and reports.',
    items: ['Name and email visibility', 'Avatar initials', 'Role based dashboard experience'],
  },
  {
    title: 'Company',
    description: 'Company-level information used for teams, lead ownership and client reporting.',
    items: ['Company profile', 'Team mapping', 'Business timezone'],
  },
  {
    title: 'Subscription',
    description: 'Track trial, plan status and premium access from one professional panel.',
    items: ['Trial status', 'Plan badge', 'Billing visibility'],
  },
  {
    title: 'Notifications',
    description: 'Control overdue follow-up alerts, weekly summaries and manager/admin updates.',
    items: ['Overdue reminders', 'Weekly reports', 'In-app notification preferences'],
  },
  {
    title: 'Security',
    description: 'Basic account safety and session controls for the CRM workspace.',
    items: ['Session review', 'Password hygiene', 'Role access check'],
  },
];

export default function SettingsPage() {
  const role = getRole();
  const name = getName();
  const email = getEmail();
  const safeSidebarRole = role === 'admin' || role === 'company_admin' ? 'admin' : role === 'super_admin' || role === 'superadmin' ? 'superAdmin' : role === 'manager' ? 'manager' : 'employee';

  return (
    <div className="sf-dashboard settings-shell">
      <DashboardSidebar role={safeSidebarRole} />
      <main className="settings-main">
        <header className="settings-hero">
          <div>
            <span className="settings-eyebrow">Workspace Settings</span>
            <h1>Settings</h1>
            <p>Manage profile, company, subscription, notifications and security from one clean CRM control center.</p>
          </div>
          <button type="button" onClick={() => go('/employee/profile')}>Open Profile</button>
        </header>

        <section className="settings-profile-card">
          <div className="settings-avatar">{initials(name)}</div>
          <div>
            <h2>{name}</h2>
            <p>{email}</p>
          </div>
          <span>{getDisplayRole(role)}</span>
        </section>

        <section className="settings-grid">
          {settingsSections.map((section) => (
            <article className="settings-card" key={section.title}>
              <div className="settings-card-head">
                <h3>{section.title}</h3>
                <small>Ready</small>
              </div>
              <p>{section.description}</p>
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
