import { useState } from 'react';
import './EmployeeShell.css';

const navItems = [
  ['Dashboard', '/employee/dashboard', '▦'],
  ['My Leads', '/leads', '♙'],
  ['Contacts', '/contacts', '☎'],
  ['Won', '/employee/won', '✓'],
  ['Tasks', '/employee/tasks', '☑'],
  ['Calendar', '/employee/calendar', '▣'],
  ['Activities', '/employee/activities', '☷'],
  ['Reports', '/employee/reports', '▥'],
  ['Notifications', '/notifications', '◈'],
  ['Profile', '/employee/profile', '♙'],
  ['Settings', '/settings', '⚙'],
];

function navigateTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('salesflow:navigate'));
}

function isActive(path, label) {
  const current = window.location.pathname;
  if (current === path) return true;
  if (label === 'My Leads' && current.startsWith('/leads')) return true;
  return false;
}

export default function EmployeeShell({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sf-employee-shell">
      {open ? (
        <button
          className="sf-employee-overlay"
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className={`sf-employee-sidebar ${open ? 'open' : ''}`}>
        <div className="sf-employee-logo-wrap">
          <button
            type="button"
            className="sf-employee-logo"
            onClick={() => navigateTo('/employee/dashboard')}
          >
            <img
              src="/assets/salesflow-hub-logo-transparent.png"
              alt="SalesFlow Hub"
            />
          </button>

          <button
            type="button"
            className="sf-employee-close"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sf-employee-nav">
          {navItems.map(([label, path, icon]) => {
            const active = isActive(path, label);

            return (
              <button
                key={label}
                type="button"
                className={active ? 'active' : ''}
                onClick={() => {
                  setOpen(false);
                  navigateTo(path);
                }}
              >
                <span>{icon}</span>
                <em>{label}</em>
              </button>
            );
          })}
        </nav>

        <div className="sf-employee-sidebar-card">
          <strong>SalesFlow CRM</strong>
          <small>Employee workspace</small>
        </div>
      </aside>

      <main className="sf-employee-main">
        <header className="sf-employee-topbar">
          <button
            type="button"
            className="sf-employee-menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <div>
            <span>Employee Workspace</span>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          <div className="sf-employee-top-actions">
            <input type="search" placeholder="Search..." />
            <button type="button">🔔</button>
            <button type="button">Logout</button>
          </div>
        </header>

        <section className="sf-employee-content">{children}</section>
      </main>
    </div>
  );
}
