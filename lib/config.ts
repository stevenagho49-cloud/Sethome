// Central settings. Change these in Vercel → Project → Settings → Environment Variables.
const num = (v: string | undefined, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) && v !== undefined && v !== '' ? n : d;
};

export const config = {
  shopUrl: (process.env.SHOP_URL || 'https://toytake2.co.uk').replace(/\/$/, ''),
  whatsappNumber: (process.env.WHATSAPP_NUMBER || '').replace(/[^0-9]/g, ''),
  contactEmail: process.env.CONTACT_EMAIL || '[EMAIL]',
  communityUrl: process.env.COMMUNITY_INVITE_URL || '',
  siteUrl: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  markupPercent: num(process.env.MARKUP_PERCENT, 0),
  packDiscountPercent: num(process.env.PACK_DISCOUNT_PERCENT, 5),
  deliveryFee: num(process.env.DELIVERY_FEE, 0),
  deposit: num(process.env.DEPOSIT, 50),
  stripeKey: process.env.STRIPE_SECRET_KEY || '',
  leadsWebhook: process.env.LEADS_WEBHOOK_URL || '',
};

// Public bits the browser needs (safe to expose).
export const publicConfig = {
  whatsappNumber: config.whatsappNumber,
  communityUrl: config.communityUrl,
  deposit: config.deposit,
  contactEmail: config.contactEmail,
};

export function waLink(number: string, text?: string) {
  const base = number ? `https://wa.me/${number}` : 'https://wa.me/';
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function gbp(n: number) {
  return '£' + (Math.round(n * 100) / 100).toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

