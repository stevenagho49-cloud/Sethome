import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { config, gbp } from '@/lib/config';
import { getCatalog } from '@/lib/catalog';
import { buildPack, getPackDef } from '@/lib/packs';
import { forwardLead } from '@/lib/leads';

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const def = getPackDef(String(b.pack || ''));
  if (!def) return NextResponse.json({ error: 'Unknown pack' }, { status: 400 });
  const clean = (v: unknown, n = 200) => String(v ?? '').slice(0, n).trim();
  const name = clean(b.name, 100), phone = clean(b.phone, 30), email = clean(b.email, 120);
  if (!name || phone.replace(/\D/g, '').length < 7) return NextResponse.json({ error: 'Please add your name and WhatsApp number.' }, { status: 400 });

  // Re-price on the server from live stock, so prices can't be changed in the browser.
  const { products } = await getCatalog();
  const swaps: Record<number, string> = typeof b.swaps === 'object' && b.swaps ? b.swaps : {};
  const pack = buildPack(def, products, swaps);
  const ref = 'SH-' + Date.now().toString(36).toUpperCase().slice(-6);
  const order = {
    ref, pack: pack.name, price: pack.price, deposit: config.deposit,
    items: pack.items.map((it) => `${it.slot.qty ? it.slot.qty + ' x ' : ''}${it.product.title} (${it.product.handle})`).join('; '),
    postcode: clean(b.postcode, 12), moveIn: clean(b.moveIn, 20), code: clean(b.code, 40), name, phone, email,
  };
  await forwardLead('reservation', order);

  const params = new URLSearchParams({ ref, pack: def.slug, postcode: order.postcode, moveIn: order.moveIn, price: String(pack.price) });
  if (config.stripeKey) {
    const stripe = new Stripe(config.stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ quantity: 1, price_data: { currency: 'gbp', unit_amount: Math.round(config.deposit * 100), product_data: { name: `Deposit – ${pack.name} pack (${ref})`, description: `Pack price ${gbp(pack.price)} delivered and set up. Balance paid after we confirm.` } } }],
      customer_email: email || undefined,
      metadata: { ...order, price: String(order.price), deposit: String(order.deposit), items: order.items.slice(0, 480) },
      success_url: `${config.siteUrl}/confirmed?${params.toString()}&paid=1`,
      cancel_url: `${config.siteUrl}/reserve?pack=${def.slug}`,
    });
    return NextResponse.json({ url: session.url });
  }
  // No card payments set up yet: confirm by WhatsApp instead.
  return NextResponse.json({ url: `/confirmed?${params.toString()}&paid=0` });
}
