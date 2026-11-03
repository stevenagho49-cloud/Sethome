import { NextResponse } from 'next/server';
import { forwardLead } from '@/lib/leads';

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const clean = (v: unknown, n = 500) => String(v ?? '').slice(0, n).trim();
  const lead = { name: clean(b.name, 100), phone: clean(b.phone, 30), items: clean(b.items), budget: clean(b.budget, 30), moveIn: clean(b.moveIn, 20) };
  if (!lead.name || !lead.items || lead.phone.replace(/\D/g, '').length < 7) return NextResponse.json({ ok: false }, { status: 400 });
  const forwarded = await forwardLead('wanted', lead);
  return NextResponse.json({ ok: true, forwarded });
}
