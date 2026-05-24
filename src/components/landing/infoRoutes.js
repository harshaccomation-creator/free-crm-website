export const infoPageTitles = [
  'Lead Inbox',
  'Follow-up Hub',
  'Deal Pipeline',
  'Activity Notes',
  'Task Board',
  'Reports Studio',
  'Lead Form Builder',
  'Reminder Calendar',
  'Quote Tracker',
  'WhatsApp Follow-up',
  'Email Templates',
  'Sales Checklist',
  'Why SalesFlow',
  'Roadmap',
  'Release Notes',
  'Security',
  'Integrations',
  'Contact Team',
  'Help Center',
  'Setup Guide',
  'Admin Guide',
  'Super Admin Guide',
  'Training',
  'Partner Program',
  'Privacy',
  'Terms',
  'Status',
];

export const slugifyInfoPage = (title) =>
  String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const pageFromPathname = (pathname) => {
  const slug = String(pathname || '').replace(/^\//, '').replace(/\/$/, '');
  return infoPageTitles.find((title) => slugifyInfoPage(title) === slug) || '';
};
