import nodemailer from 'nodemailer';

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function safeText(value) {
  return String(value || '').replace(/[<>]/g, '').trim();
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { error: 'Method not allowed' });
  }

  const host = process.env.ZOHO_SMTP_HOST || 'smtppro.zoho.com';
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  const to = process.env.DEMO_ALERT_TO || user;

  if (!user || !pass || !to) {
    return sendJson(response, 500, { error: 'Email alert is not configured.' });
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : request.body || {};
    const lead = {
      fullName: safeText(body.fullName),
      email: safeText(body.email),
      mobile: safeText(body.mobile),
      companyName: safeText(body.companyName),
      teamSize: safeText(body.teamSize),
      requirement: safeText(body.requirement),
      preferredTime: safeText(body.preferredTime),
    };

    if (!lead.fullName || !lead.email || !lead.mobile) {
      return sendJson(response, 400, { error: 'Missing demo request details.' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `New SalesFlow Hub Demo Request - ${lead.companyName || lead.fullName}`;
    const text = [
      'New Demo Request',
      '',
      `Name: ${lead.fullName}`,
      `Email: ${lead.email}`,
      `Mobile: ${lead.mobile}`,
      `Company: ${lead.companyName}`,
      `Team Size: ${lead.teamSize}`,
      `Requirement: ${lead.requirement}`,
      `Preferred Time: ${lead.preferredTime}`,
      '',
      'Open Supabase demo_requests table to manage this lead.',
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#101828">
        <h2>New SalesFlow Hub Demo Request</h2>
        <p><strong>Name:</strong> ${lead.fullName}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Mobile:</strong> ${lead.mobile}</p>
        <p><strong>Company:</strong> ${lead.companyName}</p>
        <p><strong>Team Size:</strong> ${lead.teamSize}</p>
        <p><strong>Requirement:</strong> ${lead.requirement}</p>
        <p><strong>Preferred Time:</strong> ${lead.preferredTime}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `SalesFlow Hub <${user}>`,
      to,
      replyTo: lead.email,
      subject,
      text,
      html,
    });

    return sendJson(response, 200, { ok: true });
  } catch (error) {
    return sendJson(response, 500, { error: error.message || 'Email alert failed.' });
  }
}
