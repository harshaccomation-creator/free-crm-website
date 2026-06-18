export async function sendSupportTicketToZoho(ticket) {
  try {
    const response = await fetch('/api/zoho-support-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });

    return await response.json().catch(() => ({ ok: false, error: 'Invalid Zoho bridge response' }));
  } catch (error) {
    return { ok: false, reason: 'ZOHO_BRIDGE_UNREACHABLE', error: error?.message || 'Unable to reach Zoho bridge' };
  }
}

export function zohoNoticeText(result) {
  if (result?.ok) return 'Your support ticket has been created and sent to Zoho Desk.';
  if (result?.skipped || result?.reason === 'ZOHO_ENV_NOT_CONFIGURED') return 'Your support ticket has been created. Zoho Desk connection is pending environment setup.';
  return 'Your support ticket has been created. Zoho Desk sync is pending.';
}
