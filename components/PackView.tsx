'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Img from './Img';
import PostcodeChecker from './PostcodeChecker';
import { Tick, WaIcon } from './icons';
import { gbp } from '@/lib/config';
import type { Product } from '@/lib/catalog';

type SlotView = { index: number; label: string; qty: number; options: Product[] };

export default function PackView(props: {
  slug: string; name: string; forWho: string; popular: boolean; slots: SlotView[]; missing: string[];
  discount: number; delivery: number; deposit: number; waHref: string;
}) {
  const { slots } = props;
  const [chosen, setChosen] = useState<Record<number, string>>(() => Object.fromEntries(slots.map((s) => [s.index, s.options[0].handle])));
  const [open, setOpen] = useState<number | null>(null);
  const [photo, setPhoto] = useState(0);
  const [moveIn, setMoveIn] = useState('');

  const picked = slots.map((s) => ({ ...s, product: s.options.find((o) => o.handle === chosen[s.index]) || s.options[0] }));
  const total = picked.reduce((sum, s) => sum + s.product.price * s.qty, 0);
  const price = Math.round(total * (1 - props.discount / 100) + props.delivery);
  const newPrice = Math.round(picked.reduce((sum, s) => sum + (s.product.wasPrice || s.product.price) * s.qty, 0));
  const swaps = Object.fromEntries(picked.filter((s) => s.product.handle !== s.options[0].handle).map((s) => [s.index, s.product.handle]));
  const swapCount = Object.keys(swaps).length;
  const photos = useMemo(() => picked.filter((s) => s.product.images[0]).map((s) => ({ src: s.product.images[0], alt: s.product.title })), [picked]);
  const shown = photos[photo] || photos[0];

  const reserveHref = `/reserve?${new URLSearchParams({ pack: props.slug, swaps: JSON.stringify(swaps), moveIn }).toString()}`;

  return (
    <>
      <div className="pack-top">
        <div className="gallery">
          <div className="main">
            {photos.length ? <img src={shown.src} alt={shown.alt} /> : <Img alt={`${props.name} pack`} label={`${props.name} pack`} />}
            {photos.length > 1 && <span className="counter">{Math.min(photo, photos.length - 1) + 1} / {photos.length}</span>}
          </div>
          {photos.length > 1 && (
            <div className="thumbs">
              {photos.slice(0, 10).map((p, i) => (
                <button key={p.src + i} className={i === photo ? 'on' : ''} onClick={() => setPhoto(i)} aria-label={`Show photo ${i + 1}: ${p.alt}`}><img src={p.src} alt="" /></button>
              ))}
            </div>
          )}
        </div>

        <div className="buybox">
          {props.popular && <span className="pill pill-gold" style={{ alignSelf: 'flex-start' }}>★ Most popular</span>}
          <h1 style={{ fontSize: 'clamp(38px,4vw,54px)' }}>{props.name}</h1>
          <p className="muted">{props.forWho}.</p>
          <div className="pp">
            <div className="price">{gbp(price)}</div>
            <strong>Delivered and set up</strong>
            {newPrice > price && <div className="row"><span>Price if bought new:</span><s>{gbp(newPrice)}</s></div>}
          </div>
          <PostcodeChecker waHref={props.waHref} compact />
          <label className="field"><span>Move-in date</span><input type="date" value={moveIn} onChange={(e) => setMoveIn(e.target.value)} /></label>
          <Link href={reserveHref} className="btn btn-navy btn-block" style={{ minHeight: 64 }}>Reserve with {gbp(props.deposit)} deposit</Link>
          <p className="muted" style={{ textAlign: 'center', fontSize: 15, marginTop: -6 }}>You pay the balance after we confirm.</p>
          <a href={props.waHref} className="btn btn-wa-outline btn-block" target="_blank" rel="noopener noreferrer"><WaIcon /> Ask on WhatsApp</a>
          <ul className="checks">
            {['Every item checked', "7-day swap if something doesn't work", 'Availability confirmed within 2 hours'].map((t) => <li key={t}><span className="tick"><Tick size={14} /></span>{t}</li>)}
          </ul>
        </div>
      </div>

      <section className="included" aria-labelledby="inc">
        <div>
          <h2 id="inc">What&apos;s included</h2>
          <p className="lead" style={{ marginTop: 12 }}>Want a different item? Tap Swap and choose another. We confirm any change on WhatsApp before you pay the balance.</p>
          {props.missing.length > 0 && <p className="notice" style={{ marginTop: 16 }}>Out of stock right now: {props.missing.join(', ')}. Ask us on WhatsApp and we&apos;ll find one.</p>}
        </div>
        <div className="items">
          {picked.map((s) => {
            const original = s.options[0];
            const isSwapped = s.product.handle !== original.handle;
            return (
              <div className="item" key={s.index}>
                <div className="th"><Img src={s.product.images[0]} alt={s.product.title} label={s.label} /></div>
                <div className="info">
                  <strong>{s.qty > 1 ? `${s.qty} × ` : ''}{s.product.title}</strong>
                  <span className="sub">{s.label}{s.product.condition ? ` · ${s.product.condition}` : ''}</span>
                  {isSwapped && <div><span className="swapped">Swapped from: {original.title}</span></div>}
                </div>
                {s.options.length > 1 && (
                  <button className="swap-btn" aria-expanded={open === s.index} onClick={() => setOpen(open === s.index ? null : s.index)}>{open === s.index ? 'Close' : 'Swap'}</button>
                )}
                {open === s.index && (
                  <div className="alts">
                    {s.options.filter((o) => o.handle !== s.product.handle).map((o) => (
                      <div className="alt" key={o.handle}>
                        {o.images[0] ? <img src={o.images[0]} alt="" /> : <span className="phs" />}
                        <span>{o.title}<br /><b>{gbp(o.price)}</b>{o.handle === original.handle ? ' · original' : ''}</span>
                        <button className="swap-btn" onClick={() => { setChosen({ ...chosen, [s.index]: o.handle }); setOpen(null); setPhoto(0); }}>Choose</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <p className="muted" style={{ padding: '14px 0', fontSize: 15 }}>Swaps made: <b>{swapCount}</b></p>
        </div>
      </section>
      <div style={{ height: 64 }} />

      <div className="sticky-buy" role="region" aria-label="Reserve">
        <span className="sp">{gbp(price)}</span>
        <Link href={reserveHref} className="btn btn-navy">Reserve with {gbp(props.deposit)}</Link>
        <a href={props.waHref} className="wa" target="_blank" rel="noopener noreferrer" aria-label="Ask on WhatsApp"><WaIcon /></a>
      </div>
    </>
  );
}
