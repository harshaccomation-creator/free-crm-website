import { useState } from 'react';
import LandingExtraSections from '../components/landing/LandingExtraSections.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';
import LandingModules from '../components/landing/LandingModules.jsx';
import '../styles/landingPage.css';
import '../styles/landingFit.css';

const menuItems = ['Products', 'Solutions', 'Resources', 'Pricing', 'About'];
const stats = [
  { label: 'Total Leads', value: '1,250', trend: '+12.5%' },
  { label: 'Qualified', value: '540', trend: '+8.2%' },
  { label: 'Deals Won', value: '320', trend: '+15.7%' },
];
const sideItems = [
  ['Dashboard', '⌂'], ['Leads', '◉'], ['Deals', '◆'], ['Contacts', '☷'], ['Tasks', '✓'], ['Reports', '▣'], ['Settings', '⚙']
];
const formModals = new Set(['Book a Demo', 'Start Free Trial', 'Contact Sales', 'Customer Support', 'Support', 'Login', 'Chat']);

const modalDetails = {
  'Lead Inbox': 'All new leads will appear here with source, owner, status and next follow-up action.',
  'Follow-up Hub': 'Manage reminders, missed calls, pending tasks and follow-up schedules from one hub.',
  'Deal Pipeline': 'Track every deal stage from new opportunity to negotiation, won or lost.',
  'Activity Notes': 'View calls, meetings, notes and timeline updates for every customer record.',
  'Task Board': 'Assign tasks to your sales team and monitor what needs attention today.',
  'Reports Studio': 'Build reports for lead conversion, activities, revenue and team performance.',
  'Lead Form Builder': 'Create lead capture forms for your landing pages and campaigns.',
  'Reminder Calendar': 'See upcoming calls, demos and follow-ups in a clean calendar view.',
  'Quote Tracker': 'Track proposals, quotes and deal values before closing.',
  'WhatsApp Follow-up': 'Plan WhatsApp follow-ups and keep conversation history organized.',
  'Email Templates': 'Prepare reusable email templates for sales follow-ups and onboarding.',
  'Sales Checklist': 'Use sales checklists to keep every lead process consistent.',
  'Why SalesFlow': 'SalesFlow is built to keep CRM modules separate, fast and easy to maintain.',
  Roadmap: 'Upcoming modules include dashboard, admin panel, super admin panel, leads and lead activity.',
  'Release Notes': 'Release notes will show what changed in each version of SalesFlow.',
  Security: 'Security options will include role-based access and protected CRM records.',
  Integrations: 'Integrations can connect forms, email, WhatsApp and reporting tools later.',
  'Contact Team': 'Contact the SalesFlow team for setup, demo and CRM customization.',
  'Help Center': 'Help Center will include guides for setup, usage and troubleshooting.',
  'Setup Guide': 'Setup Guide will explain how to launch and configure SalesFlow CRM.',
  'Admin Guide': 'Admin Guide will explain user roles, settings and team control.',
  'Super Admin Guide': 'Super Admin Guide will cover company control, plans, billing and tenant management.',
  Training: 'Training will include tutorials for sales teams and managers.',
  'Partner Program': 'Partner Program will help agencies and consultants work with SalesFlow.',
  Privacy: 'Privacy details will explain how SalesFlow handles customer and CRM data.',
  Terms: 'Terms will explain usage rules, subscriptions and product responsibilities.',
  Status: 'Status will show current system health and deployment information.',
};

export default function LandingPage() {
  const [modal, setModal] = useState('');
  const [notice, setNotice] = useState('');
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const action = (text) => setNotice(text);
  const modalText = modalDetails[modal] || 'This button is working. Full backend connection will be added with the CRM module.';
  const shouldShowForm = formModals.has(modal) || modal.includes('Module');

  return (
    <div className="landing-page">
      <div className="top-mini-bar"><div className="landing-shell mini-inner"><button onClick={() => action('English selected')}>🌐 English</button><button onClick={() => action('High contrast ready')}>◐ High Contrast</button><span /><button onClick={() => setModal('Support')}>🎧 Customer Support</button><button onClick={() => setModal('Contact Sales')}>✉ Contact Sales</button><button onClick={() => setModal('Login')}>👤 Log in</button></div></div>
      <header className="main-header"><div className="landing-shell header-inner"><button className="brand-wrap" onClick={() => goTo('hero')}><span className="brand-mark">S</span><span className="brand-name">Sales<span>Flow</span></span></button><nav className="desktop-menu">{menuItems.map((item) => <button key={item} onClick={() => goTo(item.toLowerCase())}>{item}</button>)}</nav><div className="header-actions"><button className="btn btn-soft" onClick={() => setModal('Book a Demo')}><span className="btn-icon">📅</span>Book a Demo</button><button className="btn btn-primary" onClick={() => setModal('Start Free Trial')}><span className="btn-icon">🚀</span>Start Free Trial <small>7 Days Free</small></button></div></div></header>
      <main id="hero" className="hero-section"><div className="landing-shell hero-layout"><section className="hero-content"><span className="pill">⚡ All-in-one CRM platform</span><h1>Where Sales Teams <span>Close More.</span> Faster.</h1><p>Manage leads, automate follow-ups, close deals and grow your revenue with a clean CRM built for speed.</p><div className="value-grid"><button onClick={() => action('Lead capture selected')}><strong>◎ Capture More Leads</strong><span>Collect leads from every channel in one clean pipeline.</span></button><button onClick={() => action('Follow-up automation selected')}><strong>↻ Automate Follow-ups</strong><span>Never miss calls, reminders, meetings or next actions.</span></button><button onClick={() => action('Deals insight selected')}><strong>◆ Close More Deals</strong><span>Track activity, stages and team performance faster.</span></button></div><div className="hero-cta"><button className="btn btn-primary btn-big" onClick={() => setModal('Start Free Trial')}><span className="btn-icon">🚀</span>Start 7 Days Free Trial</button><button className="btn btn-outline btn-big" onClick={() => goTo('platform-highlights')}><span className="btn-icon">▼</span>Explore Features</button></div></section><section className="dashboard-mock"><div className="mock-sidebar"><strong>SalesFlow</strong>{sideItems.map(([item, icon]) => <button key={item} className={item === 'Dashboard' ? 'active' : ''} onClick={() => action(item + ' preview opened')}><span>{icon}</span>{item}</button>)}</div><div className="mock-main"><div className="mock-top"><div><span>Good morning, Aman</span><h3>Sales Overview</h3></div><button onClick={() => action('Date filter opened')}>📅 May 1 - May 31</button></div><div className="mock-stats">{stats.map((item) => <button key={item.label} onClick={() => action(item.label + ': ' + item.value)}><span>{item.label}</span><strong>{item.value}</strong><small>{item.trend}</small></button>)}</div><div className="mock-card chart-card"><div className="card-head"><span>Sales Overview</span><button onClick={() => action('Report opened')}>📊 View Report</button></div><div className="chart-line"><i /></div></div></div><div className="floating-task"><strong>Upcoming Tasks</strong><button onClick={() => action('Call task opened')}>☎ Call with new lead</button><button onClick={() => action('Follow-up opened')}>↻ Follow-up with Raj</button><button onClick={() => action('Proposal opened')}>✉ Send proposal</button></div></section></div></main>
      <LandingExtraSections action={action} />
      <LandingModules action={action} openModal={setModal} />
      <LandingFooter openModal={setModal} />
      <button className="chat-bubble" onClick={() => setModal('Chat')} aria-label="Open chat">💬</button>
      {notice && <div className="toast-message">{notice}</div>}
      {modal && <div className="modal-backdrop"><div className={`action-modal ${!shouldShowForm ? 'info-modal' : ''}`}><button className="modal-close" onClick={() => setModal('')}>×</button><h2>{modal}</h2><p>{modalText}</p>{shouldShowForm ? <><input placeholder="Name" /><input placeholder="Email" /><button className="btn btn-primary" onClick={() => { action('Request saved'); setModal(''); }}><span className="btn-icon">✓</span>Submit</button></> : <button className="btn btn-primary info-close-btn" onClick={() => setModal('')}>Okay, Got it</button>}</div></div>}
    </div>
  );
}
