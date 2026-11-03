'use client';
import { useState } from 'react';
import { waLink } from '@/lib/config';

const validPhone = (s: string) => /^\+?[0-9\s()-]{7,20}$/.test(s.trim()) && s.replace(/\D/g, '').length >= 7;

export default function WantedForm({ waNumber }: { waNumber: string }) {
  const [f, setF] = useState({ name: '', phone: '', items: '', budget: '', moveIn: '' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState<null | { forwarded: boolean }>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.items.trim()) return setErr('Please add your name and what you need.');
    if (!validPhone(f.phone)) return setErr('Please add a WhatsApp number we can reach, UK or international.');
    setErr(''); setBusy(true);
    try {
      const r = await fetch('/api/wanted', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const j = await r.json();
      setDone({ forwarded: !!j.forwarded });
    } catch { setDone({ forwarded: false }); }
    setBusy(false);
  }

  if (done) {
    const text = `Hi SET Home, please add me to the wanted list.\nName: ${f.name}\nItems: ${f.items}\nBudget: ${f.budget || '-'}\nMove-in: ${f.moveIn || '-'}`;
    return (
      <div className="form-card" role="status">
        <div className="full">
          <h3 style={{ marginBottom: 10 }}>You&apos;re on the list, {f.name.split(' ')[0]}.</h3>
          <p className="muted">We&apos;ll WhatsApp you when a match arrives.{done.forwarded ? '' : ' Tap below to send your list to us now so we have it straight away.'}</p>
        </div>
        {!done.forwarded && <a className="btn btn-wa full" href={waLink(waNumber, text)} target="_blank" rel="noopener noreferrer">Send my list on WhatsApp</a>}
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <label className="field"><span>Your name</span><input value={f.name} onChange={set('name')} autoComplete="name" /></label>
      <label className="field"><span>WhatsApp number</span><input value={f.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+44 7… or your home country number" /></label>
      <label className="field full"><span>Items you need</span><textarea value={f.items} onChange={set('items')} placeholder="For example: double bed, wardrobe, washing machine" /></label>
      <label className="field"><span>Your budget</span><input value={f.budget} onChange={set('budget')} inputMode="decimal" placeholder="£" /></label>
      <label className="field"><span>Move-in date</span><input value={f.moveIn} onChange={set('moveIn')} type="date" /></label>
      {err && <p className="msg no full" role="alert">{err}</p>}
      <button className="btn btn-navy full" disabled={busy}>{busy ? 'Adding…' : 'Add me to the wanted list'}</button>
      <p className="full muted" style={{ fontSize: 14 }}>UK or international number. We only message you about your list.</p>
    </form>
  );
}
