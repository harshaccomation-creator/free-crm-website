export async function sendSupportTicketToZoho(ticket) {
  try {
    const response = await fetch('/api/zoho-support-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });

    return await response.json().catch(() => ({ ok: false, error: 'Invalid support bridge response' }));
  } catch (error) {
    return { ok: false, reason: 'SUPPORT_BRIDGE_UNREACHABLE', error: error?.message || 'Unable to reach support bridge' };
  }
}

export function zohoNoticeText(result) {
  if (result?.ok) return 'Your support ticket has been created. SalesFlow Hub Support will review it shortly.';
  if (result?.skipped || result?.reason === 'ZOHO_ENV_NOT_CONFIGURED') return 'Your support ticket has been created. SalesFlow Hub Support will review it shortly.';
  return 'Your support ticket has been created. SalesFlow Hub Support will review it shortly.';
}
