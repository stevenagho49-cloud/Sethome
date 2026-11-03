'use client';
import { useState } from 'react';
import { gbp } from '@/lib/config';
import { checkPostcode } from '@/lib/areas';

export default function ReserveForm({ pack, swaps, initialMoveIn, deposit, cardsOn }: { pack: string; swaps: Record<number, string>; initialMoveIn: string; deposit: number; cardsOn: boolean }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', postcode: '', moveIn: initialMoveIn, code: '' });
  const [codeMsg, setCodeMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return setErr('Please add your full name.');
    if (f.phone.replace(/\D/g, '').length < 7) return setErr('Please add a WhatsApp number, UK or international.');
    if (!f.postcode.trim()) return setErr('Please add your delivery postcode.');
    if (!checkPostcode(f.postcode).ok) return setErr("We don't cover this postcode yet. Message us on WhatsApp and we'll check for you.");
    if (!f.moveIn) return setErr('Please choose your move-in date.');
    setErr(''); setBusy(true);
    try {
      const r = await fetch('/api/reserve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pack, swaps, ...f }) });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.error || 'Something went wrong');
      window.location.href = j.url;
    } catch (x) { setErr((x as Error).message + '. Please try again or message us on WhatsApp.'); setBusy(false); }
  }

  return (
    <form onSubmit={pay} noValidate>
      <div className="box">
        <h2><span className="c">1</span>Your details</h2>
        <div style={{ display: 'grid', gap: 14 }}>
          <label className="field"><span>Full name</span><input value={f.name} onChange={set('name')} autoComplete="name" /></label>
          <label className="field"><span>WhatsApp number</span><span className="help">UK or international number. We send your confirmation here.</span><input value={f.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+44 7… or your home country number" /></label>
          <label className="field"><span>Email</span><span className="help">Optional, for your receipt</span><input value={f.email} onChange={set('email')} type="email" autoComplete="email" /></label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <label className="field"><span>Delivery postcode</span><input value={f.postcode} onChange={set('postcode')} autoComplete="postal-code" placeholder="e.g. B29 6AB" /></label>
            <label className="field"><span>Move-in date</span><input value={f.moveIn} onChange={set('moveIn')} type="date" /></label>
          </div>
        </div>
      </div>
      <div className="box">
        <h2><span className="c">2</span>Partner or referral code</h2>
        <p className="muted" style={{ fontSize: 15, marginBottom: 10 }}>From your university, employer or a friend. Optional.</p>
        <div className="pc-row">
          <input value={f.code} onChange={(e) => { setF({ ...f, code: e.target.value.toUpperCase() }); setCodeMsg(''); }} placeholder="ENTER CODE" aria-label="Referral code" />
          <button type="button" className="btn btn-outline" onClick={() => setCodeMsg(f.code ? `Code ${f.code} added. We apply it when we confirm your order.` : '')}>Apply</button>
        </div>
        {codeMsg && <p className="msg ok" role="status">{codeMsg}</p>}
      </div>
      <div className="box">
        <h2><span className="c">3</span>Pay {gbp(deposit)} deposit</h2>
        <p className="muted" style={{ fontSize: 15, marginBottom: 14 }}>
          {cardsOn ? 'You’ll pay securely by card on the next screen.' : 'We’ll send you a secure payment link on WhatsApp when we confirm.'}
        </p>
        {err && <p className="msg no" role="alert" style={{ marginBottom: 12 }}>{err}</p>}
        <button className="btn btn-gold btn-block" style={{ minHeight: 66, fontSize: 20 }} disabled={busy}>{busy ? 'One moment…' : cardsOn ? `Pay ${gbp(deposit)} deposit` : 'Reserve my pack'}</button>
        <p className="muted" style={{ textAlign: 'center', fontSize: 15, marginTop: 12 }}>We confirm within 2 hours or refund your deposit in full.<br />The balance is paid after we confirm.</p>
      </div>
    </form>
  );
}
