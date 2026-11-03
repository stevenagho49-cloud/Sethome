import Link from 'next/link';
import { redirect } from 'next/navigation';
import SlimHeader from '@/components/SlimHeader';
import Fab from '@/components/Fab';
import Img from '@/components/Img';
import ReserveForm from '@/components/ReserveForm';
import { Tick } from '@/components/icons';
import { getCatalog } from '@/lib/catalog';
import { buildPack, getPackDef } from '@/lib/packs';
import { config, gbp, waLink } from '@/lib/config';

export const metadata = { title: 'Reserve your pack – SET Home' };
export const dynamic = 'force-dynamic';

export default async function Reserve({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const def = getPackDef(q.pack || '');
  if (!def) redirect('/#packs');
  let swaps: Record<number, string> = {};
  try { swaps = JSON.parse(q.swaps || '{}'); } catch {}
  const { products } = await getCatalog();
  const pack = buildPack(def, products, swaps);
  const wa = waLink(config.whatsappNumber);
  const balance = Math.max(pack.price - config.deposit, 0);

  return (
    <>
      <SlimHeader step={2} />
      <main className="wrap" style={{ maxWidth: 1200, paddingBottom: 72 }}>
        <p style={{ padding: '20px 0 8px' }}><Link href={`/packs/${def.slug}`}>← Back to {def.name}</Link></p>
        <h1 style={{ fontSize: 'clamp(34px,4vw,52px)' }}>Reserve your pack</h1>
        <p className="lead" style={{ marginTop: 10 }}>Pay a {gbp(config.deposit)} deposit today. You pay the balance after we confirm.</p>
        <div className="guarantee"><span className="tick"><Tick /></span>We confirm within 2 hours or refund your deposit in full.</div>
        <p style={{ marginTop: -12, marginBottom: 24, fontSize: 16 }}>Questions? <a href={wa} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--wa)' }}>Ask us on WhatsApp</a></p>
        <div className="reserve-grid">
          <aside className="summary box" aria-label="Your order">
            <h2>Your order</h2>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 84, height: 84, borderRadius: 14, overflow: 'hidden', flex: '0 0 84px', background: 'var(--bg)' }}><Img src={pack.image} alt="" label="pack" className="cover" /></div>
              <div><strong style={{ fontSize: 19 }}>{pack.name} pack</strong><div className="muted" style={{ fontSize: 15 }}>Delivered and set up</div></div>
            </div>
            <strong style={{ fontSize: 15 }}>Included</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 14px', fontSize: 15, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pack.items.map((it) => {
                const idx = def.slots.indexOf(it.slot);
                return <li key={idx}>{it.slot.qty ? `${it.slot.qty} × ` : ''}{it.product.title}{swaps[idx] ? <span className="swapped" style={{ marginLeft: 6 }}>Swapped</span> : null}</li>;
              })}
            </ul>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
              <div className="kv"><span>Pack price, delivered and set up</span><b>{gbp(pack.price)}</b></div>
            </div>
            <div className="paytoday">
              <div className="kv" style={{ alignItems: 'baseline' }}><strong>Pay today</strong><span className="big">{gbp(config.deposit)}</span></div>
              <div className="kv"><span>Balance, paid after we confirm</span><b>{gbp(balance)}</b></div>
            </div>
          </aside>
          <ReserveForm pack={def.slug} swaps={swaps} initialMoveIn={q.moveIn || ''} deposit={config.deposit} cardsOn={!!config.stripeKey} />
        </div>
      </main>
      <Fab href={wa} round hideOnMobile />
    </>
  );
}
