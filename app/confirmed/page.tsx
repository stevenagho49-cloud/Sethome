import SlimHeader from '@/components/SlimHeader';
import Fab from '@/components/Fab';
import { Tick, WaIcon } from '@/components/icons';
import { getPackDef } from '@/lib/packs';
import { config, gbp, waLink } from '@/lib/config';

export const metadata = { title: 'Your pack is reserved – SET Home' };
export const dynamic = 'force-dynamic';

export default async function Confirmed({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const def = getPackDef(q.pack || '');
  const ref = (q.ref || '').replace(/[^A-Z0-9-]/gi, '').slice(0, 16) || '[REF]';
  const paid = q.paid === '1';
  const price = Number(q.price) || 0;
  const balance = Math.max(price - config.deposit, 0);
  const msg = `Hi SET Home, my order reference is ${ref} (${def?.name || 'pack'}).`;
  const wa = waLink(config.whatsappNumber, msg);
  return (
    <>
      <SlimHeader step={3} />
      <main className="wrap">
        <div className="confirm">
          <span className="big-tick"><Tick size={36} /></span>
          <h1 style={{ fontSize: 'clamp(38px,5vw,64px)' }}>Your pack is reserved</h1>
          <p style={{ margin: '16px 0' }}><span className="pill" style={{ background: 'var(--white)', fontSize: 17, padding: '8px 16px' }}>Order reference: <b>&nbsp;{ref}</b></span></p>
          <p className="lead">{paid ? `We have your ${gbp(config.deposit)} deposit. Keep WhatsApp open. We will message you there.` : 'We have your details. Keep WhatsApp open. We will message you there with a secure link to pay the deposit.'}</p>
          <div className="box" style={{ textAlign: 'left', marginTop: 32 }}>
            <h2>What happens next</h2>
            <ol className="timeline">
              <li><span className="n">01</span><div><strong>We check stock and confirm on WhatsApp</strong><p className="muted">Within 2 hours. If we can&apos;t confirm, we refund your deposit in full.</p></div></li>
              <li><span className="n">02</span><div><strong>You pay the balance</strong><p className="muted">We send you a payment link after we confirm.</p></div></li>
              <li><span className="n">03</span><div><strong>We deliver and set up on your move-in day</strong><p className="muted">Our team brings everything and builds it for you.</p></div></li>
            </ol>
          </div>
          <a className="btn btn-wa" style={{ marginTop: 28, minHeight: 66, width: '100%', maxWidth: 440 }} href={wa} target="_blank" rel="noopener noreferrer"><WaIcon /> Message us on WhatsApp</a>
          {config.communityUrl && <p style={{ marginTop: 14 }}><a href={config.communityUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>Join the &quot;New in Birmingham&quot; community</a></p>}
          <div className="box" style={{ textAlign: 'left', marginTop: 32, border: '1.5px solid var(--line)', background: 'transparent' }}>
            <h2 style={{ fontSize: 22 }}>Your order</h2>
            <div className="kv"><span>Pack</span><b>{def?.name || '–'}</b></div>
            <div className="kv"><span>Delivery postcode</span><b>{q.postcode || '–'}</b></div>
            <div className="kv"><span>Move-in date</span><b>{q.moveIn ? new Date(q.moveIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '–'}</b></div>
            <div className="kv" style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 12 }}><span>Deposit {paid ? 'paid' : 'to pay'}</span><b>{gbp(config.deposit)}</b></div>
            <div className="kv"><span>Balance, after we confirm</span><b>{gbp(balance)}</b></div>
          </div>
        </div>
      </main>
      <Fab href={waLink(config.whatsappNumber)} round />
    </>
  );
}
