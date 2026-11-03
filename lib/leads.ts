import { config } from './config';

/** Sends a lead (wanted list or reservation) to LEADS_WEBHOOK_URL, e.g. a Google Sheet script. */
export async function forwardLead(kind: string, data: Record<string, unknown>): Promise<boolean> {
  if (!config.leadsWebhook) { console.log(`[lead:${kind}]`, JSON.stringify(data)); return false; }
  try {
    const r = await fetch(config.leadsWebhook, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, at: new Date().toISOString(), ...data }),
    });
    return r.ok;
  } catch { return false; }
}
