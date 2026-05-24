import '../../styles/landingInfoPage.css';

const infoData = {
  'Lead Inbox': {
    category: 'CRM Workspace',
    title: 'Lead Inbox',
    intro: 'Lead Inbox is the place where every new enquiry, form submission and sales opportunity enters your CRM.',
    points: ['View all fresh leads in one clean inbox', 'Track source, owner, status and priority', 'Move leads into follow-up or pipeline without confusion'],
    cta: 'Open Lead Inbox Module',
  },
  'Follow-up Hub': {
    category: 'CRM Workspace',
    title: 'Follow-up Hub',
    intro: 'Follow-up Hub helps your team stay on top of calls, reminders, demos and missed opportunities.',
    points: ['Daily pending follow-ups', 'Call and meeting reminders', 'Auto-priority for urgent leads'],
    cta: 'Create Follow-up Flow',
  },
  'Deal Pipeline': {
    category: 'CRM Workspace',
    title: 'Deal Pipeline',
    intro: 'Deal Pipeline gives your team a visual view of every opportunity from first contact to closing.',
    points: ['Track deal stages visually', 'See won/lost pipeline value', 'Identify stuck deals quickly'],
    cta: 'View Pipeline Demo',
  },
  'Activity Notes': {
    category: 'CRM Workspace',
    title: 'Activity Notes',
    intro: 'Activity Notes keeps calls, meetings, notes and changes connected with every lead record.',
    points: ['Timeline for every customer', 'Notes from team members', 'Complete sales communication history'],
    cta: 'Open Activity Timeline',
  },
  'Task Board': {
    category: 'CRM Workspace',
    title: 'Task Board',
    intro: 'Task Board helps managers and reps see what needs to be completed today, this week and later.',
    points: ['Assign tasks to team members', 'Track pending and completed work', 'Reduce missed follow-ups'],
    cta: 'View Task Board',
  },
  'Reports Studio': {
    category: 'CRM Workspace',
    title: 'Reports Studio',
    intro: 'Reports Studio turns your sales activity into clear insights for conversion, revenue and performance.',
    points: ['Lead conversion reporting', 'Team productivity metrics', 'Revenue and activity dashboards'],
    cta: 'Explore Reports',
  },
  'Lead Form Builder': {
    category: 'Sales Tools',
    title: 'Lead Form Builder',
    intro: 'Create forms for landing pages, campaigns and lead capture without making the CRM messy.',
    points: ['Custom lead fields', 'Source tracking', 'Form-to-CRM capture'],
    cta: 'Build Lead Form',
  },
  'Reminder Calendar': {
    category: 'Sales Tools',
    title: 'Reminder Calendar',
    intro: 'Reminder Calendar gives a clean view of calls, demos, meetings and follow-ups.',
    points: ['Daily schedule view', 'Upcoming reminder alerts', 'Follow-up planning'],
    cta: 'Open Calendar',
  },
  'Quote Tracker': {
    category: 'Sales Tools',
    title: 'Quote Tracker',
    intro: 'Quote Tracker helps your team track proposals, deal values and pending approvals.',
    points: ['Track sent quotes', 'Monitor proposal status', 'Connect quotes with deals'],
    cta: 'Track Quotes',
  },
  'WhatsApp Follow-up': {
    category: 'Sales Tools',
    title: 'WhatsApp Follow-up',
    intro: 'Plan WhatsApp follow-ups and keep lead communication organized for your sales team.',
    points: ['Follow-up templates', 'Conversation reminders', 'Lead-specific follow-up notes'],
    cta: 'Plan WhatsApp Flow',
  },
  'Email Templates': {
    category: 'Sales Tools',
    title: 'Email Templates',
    intro: 'Email Templates help sales reps send consistent follow-ups, proposals and onboarding messages.',
    points: ['Reusable email templates', 'Fast follow-up replies', 'Consistent team messaging'],
    cta: 'View Templates',
  },
  'Sales Checklist': {
    category: 'Sales Tools',
    title: 'Sales Checklist',
    intro: 'Sales Checklist keeps your sales process consistent from first call to deal close.',
    points: ['Step-by-step sales process', 'Lead qualification checklist', 'Close-ready deal checks'],
    cta: 'Open Checklist',
  },
  'Why SalesFlow': {
    category: 'Business',
    title: 'Why SalesFlow',
    intro: 'SalesFlow is built for teams that need simple CRM workflows, clean modules and fast follow-ups.',
    points: ['Separate files for safe fixes', 'Fast interface for sales reps', 'Admin and super admin ready architecture'],
    cta: 'See SalesFlow Benefits',
  },
  Roadmap: {
    category: 'Business',
    title: 'Roadmap',
    intro: 'The SalesFlow roadmap focuses on landing, dashboard, leads, lead activity, admin and super admin modules.',
    points: ['Dashboard module', 'Lead Activity page', 'Admin and Super Admin panels'],
    cta: 'View Roadmap',
  },
  'Release Notes': {
    category: 'Business',
    title: 'Release Notes',
    intro: 'Release Notes will show every important UI, feature and bug-fix update in SalesFlow.',
    points: ['Version-wise changes', 'UI improvements', 'Bug fixes and deployment notes'],
    cta: 'View Latest Changes',
  },
  Security: {
    category: 'Business',
    title: 'Security',
    intro: 'Security pages explain how SalesFlow will protect data, roles and CRM activity access.',
    points: ['Role-based access', 'Protected customer records', 'Admin-level visibility controls'],
    cta: 'Review Security Plan',
  },
  Integrations: {
    category: 'Business',
    title: 'Integrations',
    intro: 'Integrations can connect forms, email, WhatsApp, reports and business tools with SalesFlow.',
    points: ['Form integrations', 'Email and WhatsApp workflows', 'Reporting connections'],
    cta: 'Explore Integrations',
  },
  'Contact Team': {
    category: 'Business',
    title: 'Contact Team',
    intro: 'Contact the SalesFlow team for CRM setup, demo, customization and launch support.',
    points: ['Setup support', 'CRM customization', 'Launch guidance'],
    cta: 'Contact SalesFlow Team',
  },
  'Help Center': {
    category: 'Support',
    title: 'Help Center',
    intro: 'Help Center will contain simple guides for using and troubleshooting SalesFlow CRM.',
    points: ['Getting started guides', 'Feature tutorials', 'Troubleshooting support'],
    cta: 'Open Help Center',
  },
  'Setup Guide': {
    category: 'Support',
    title: 'Setup Guide',
    intro: 'Setup Guide explains how to configure SalesFlow for your team and launch safely.',
    points: ['Project setup', 'CRM configuration', 'Deployment checklist'],
    cta: 'Start Setup Guide',
  },
  'Admin Guide': {
    category: 'Support',
    title: 'Admin Guide',
    intro: 'Admin Guide covers team roles, permissions, settings and workspace control.',
    points: ['User management', 'Team permissions', 'Workspace settings'],
    cta: 'Open Admin Guide',
  },
  'Super Admin Guide': {
    category: 'Support',
    title: 'Super Admin Guide',
    intro: 'Super Admin Guide explains company-level control, plans, billing and tenant management.',
    points: ['Company management', 'Plan and billing control', 'Tenant-level visibility'],
    cta: 'Open Super Admin Guide',
  },
  Training: {
    category: 'Support',
    title: 'Training',
    intro: 'Training pages will help sales teams and managers learn SalesFlow faster.',
    points: ['Sales rep training', 'Manager workflow training', 'Admin setup training'],
    cta: 'Start Training',
  },
  'Partner Program': {
    category: 'Support',
    title: 'Partner Program',
    intro: 'Partner Program is for agencies, consultants and implementation partners working with SalesFlow.',
    points: ['Agency CRM rollout', 'Partner setup support', 'Implementation resources'],
    cta: 'Join Partner Program',
  },
  Privacy: {
    category: 'Legal',
    title: 'Privacy',
    intro: 'Privacy explains how SalesFlow plans to handle CRM data, customer records and user information.',
    points: ['Data handling', 'Customer record safety', 'Access control policy'],
    cta: 'Read Privacy Details',
  },
  Terms: {
    category: 'Legal',
    title: 'Terms',
    intro: 'Terms explain product usage, subscription responsibilities and account rules.',
    points: ['Product usage rules', 'Subscription terms', 'Account responsibilities'],
    cta: 'Read Terms',
  },
  Status: {
    category: 'System',
    title: 'Status',
    intro: 'Status will show SalesFlow system health, deployment state and availability information.',
    points: ['Deployment health', 'System uptime', 'Incident updates'],
    cta: 'View Status',
  },
};

export default function LandingInfoPage({ page, onBack, openModal }) {
  const data = infoData[page] || {
    category: 'SalesFlow',
    title: page,
    intro: 'This SalesFlow page will include complete information about this module.',
    points: ['Module overview', 'Key benefits', 'Setup details'],
    cta: 'Contact SalesFlow',
  };

  return (
    <div className="info-page">
      <header className="info-header">
        <div className="landing-shell info-header-inner">
          <button className="brand-wrap" onClick={onBack}><span className="brand-mark">S</span><span className="brand-name">Sales<span>Flow</span></span></button>
          <button className="info-back" onClick={onBack}>← Back to Home</button>
        </div>
      </header>

      <main className="landing-shell info-main">
        <section className="info-hero-card">
          <div>
            <span className="info-kicker">{data.category}</span>
            <h1>{data.title}</h1>
            <p>{data.intro}</p>
            <button className="btn btn-primary" onClick={() => openModal(data.cta)}>🚀 {data.cta}</button>
          </div>
          <div className="info-visual-card">
            <div className="info-visual-top" />
            <div className="info-visual-grid"><span /><span /><span /></div>
            <div className="info-visual-line" />
          </div>
        </section>

        <section className="info-details-grid">
          {data.points.map((point, index) => (
            <article key={point} className="info-detail-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{point}</h3>
              <p>SalesFlow keeps this area organized, modular and easy to improve without affecting other CRM pages.</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
