const ZOHO_ACCOUNTS_BASE = process.env.ZOHO_ACCOUNTS_BASE || 'https://accounts.zoho.in';
const ZOHO_DESK_BASE = process.env.ZOHO_DESK_BASE || 'https://desk.zoho.in';

function send(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function missingEnv() {
  const required = [
    'ZOHO_CLIENT_ID',
    'ZOHO_CLIENT_SECRET',
    'ZOHO_REFRESH_TOKEN',
    'ZOHO_DESK_ORG_ID',
    'ZOHO_DESK_DEPARTMENT_ID',
  ];
  return required.filter((key) => !process.env[key]);
}

async function getAccessToken() {
  const params = new URLSearchParams();
  params.set('refresh_token', process.env.ZOHO_REFRESH_TOKEN);
  params.set('client_id', process.env.ZOHO_CLIENT_ID);
  params.set('client_secret', process.env.ZOHO_CLIENT_SECRET);
  params.set('grant_type', 'refresh_token');

  const response = await fetch(`${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error || data.error_description || 'ZOHO_TOKEN_FAILED');
  }

  return data.access_token;
}

async function createTicket(accessToken, input) {
  const name = String(input.requester_name || input.name || 'SalesFlow User').trim() || 'SalesFlow User';
  const email = String(input.email || '').trim().toLowerCase();
  const subject = String(input.subject || 'SalesFlow Support Request').trim();
  const category = String(input.category || input.issueType || 'Support').trim();
  const priority = String(input.priority || 'Medium').trim();
  const message = String(input.message || '').trim();

  const description = [
    `Requester: ${name}`,
    email ? `Email: ${email}` : '',
    `Issue Type: ${category}`,
    `Priority: ${priority}`,
    '',
    message,
    '',
    input.support_ticket_id ? `SalesFlow Ticket ID: ${input.support_ticket_id}` : '',
  ].filter(Boolean).join('\n');

  const payload = {
    departmentId: process.env.ZOHO_DESK_DEPARTMENT_ID,
    subject,
    description,
    priority,
    channel: 'Web',
    status: 'Open',
    contact: {
      lastName: name,
      email,
    },
  };

  const response = await fetch(`${ZOHO_DESK_BASE}/api/v1/tickets`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId: process.env.ZOHO_DESK_ORG_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.errorCode || data.error || 'ZOHO_TICKET_CREATE_FAILED');
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const missing = missingEnv();
  if (missing.length) {
    return send(res, 200, { ok: false, skipped: true, reason: 'ZOHO_ENV_NOT_CONFIGURED', missing });
  }

  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (!input.subject || !input.message) {
      return send(res, 400, { ok: false, error: 'Subject and message are required' });
    }

    const accessToken = await getAccessToken();
    const ticket = await createTicket(accessToken, input);

    return send(res, 200, {
      ok: true,
      zoho_ticket_id: ticket.id || ticket.ticketNumber || null,
      zoho_ticket_number: ticket.ticketNumber || null,
      ticket,
    });
  } catch (error) {
    return send(res, 200, {
      ok: false,
      reason: 'ZOHO_CREATE_FAILED',
      error: error?.message || 'Unable to create Zoho ticket',
    });
  }
}
