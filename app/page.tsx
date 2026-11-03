import Link from 'next/link';
import Shell from '@/components/Shell';
import Img from '@/components/Img';
import PostcodeChecker from '@/components/PostcodeChecker';
import WantedForm from '@/components/WantedForm';
import CatalogGrid from '@/components/CatalogGrid';
import { Tick } from '@/components/icons';
import { getCatalog, categories } from '@/lib/catalog';
import { buildPack, packDefs } from '@/lib/packs';
import { config, gbp, waLink } from '@/lib/config';

export const revalidate = 600;

export default async function Home() {
  const { products } = await getCatalog();
  const packs = packDefs.map((d) => buildPack(d, products));
  const wa = waLink(config.whatsappNumber);
  const heroImgs = [packs[1]?.image, ...products.filter((p) => p.images[0]).map((p) => p.images[0])].filter(Boolean).slice(0, 3) as string[];

  return (
    <Shell>
      <section className="hero">
        <div className="wrap grid">
          <div>
            <h1>New to Birmingham? <span className="gold">Furnish your home for less.</span></h1>
            <p className="lead">Ready-made room packs of checked second-hand, clearance and new furniture. Delivered and set up on your move-in day.</p>
            <div className="ctas">
              <Link href="#packs" className="btn btn-gold">See the starter packs</Link>
              <Link href="#wanted" className="btn btn-outline-light">Tell us what you need</Link>
            </div>
            <div className="pc-card" id="delivery"><PostcodeChecker waHref={wa} /></div>
          </div>
          <div className="collage" aria-hidden="true">
            {[0, 1, 2].map((i) => <div key={i}><Img src={heroImgs[i]} alt="" label={['our team setting up a living room', 'bedroom pack', 'kitchen'][i]} dark className="cover" /></div>)}
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Our promises">
        <div className="wrap"><ul>
          {['Every item checked', 'Delivery and set-up included', `Reserve with a ${gbp(config.deposit)} deposit`, "7-day swap if something doesn't work"].map((t) => (
            <li key={t}><span className="tick"><Tick /></span>{t}</li>
          ))}
        </ul></div>
      </section>

      <section className="section" id="packs">
        <div className="wrap">
          <div className="head"><div><h2>Starter packs</h2><p className="lead">Pick the pack for your home. One price, delivered and set up.</p></div></div>
          <div className="packs">
            {packs.map((p) => {
              const flatSlots = p.slug === 'family-home' ? p.slots.slice(6) : p.slots;
              return (
                <article key={p.slug} className={`pack${p.popular ? ' popular' : ''}`}>
                  <div className="photo">
                    <Img src={p.image} alt={`${p.name} pack`} label={`${p.name} pack`} dark={p.popular} className="cover" />
                    {p.popular && <span className="pill pill-gold badge-pos">★ Most popular</span>}
                  </div>
                  <div className="body">
                    <h3>{p.name}</h3>
                    <p style={{ color: p.popular ? 'var(--on-navy)' : 'var(--muted)', fontSize: 17 }}>{p.forWho}</p>
                    <ul>
                      {p.plus && <li className="plus">{p.plus}</li>}
                      {flatSlots.map((s) => <li key={s.label}>{s.qty ? `${s.label} (${s.qty})` : s.label}</li>)}
                    </ul>
                    <div className="price-panel">
                      <div><div className="price">{gbp(p.price)}</div><div className="price-note">Delivered and set up</div></div>
                      <Link href={`/packs/${p.slug}`} className={`btn ${p.popular ? 'btn-gold' : 'btn-navy'}`}>See this pack</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="byo">
            <div><h3>Build your own pack</h3><p className="muted">Pick 5 or more items and save.</p></div>
            <div className="slots" aria-hidden="true"><span className="f">1</span><span className="f">2</span><span className="f">3</span><span className="e">4</span><span className="e">5+</span></div>
            <Link href="/shop" className="btn btn-navy">Start building</Link>
          </div>
        </div>
      </section>

      <section className="section" id="how" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>How it works</h2></div>
          <ol className="steps">
            <li><span className="n">01</span><strong>Pick a pack</strong><span className="muted">Choose a starter pack or build your own.</span></li>
            <li><span className="n">02</span><strong>Reserve with {gbp(config.deposit)}</strong><span className="muted">A {gbp(config.deposit)} deposit holds your items.</span></li>
            <li><span className="n">03</span><strong>We confirm in 2 hours</strong><span className="muted">We check availability and message you.</span></li>
            <li><span className="n">04</span><strong>Delivered and set up</strong><span className="muted">On your move-in day. We build it all.</span></li>
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>New in this week</h2><Link href="/shop" style={{ fontWeight: 700 }}>See all stock</Link></div>
          <CatalogGrid products={products} categories={categories} waHref={wa} limit={8} />
        </div>
      </section>

      <section className="wanted section" id="wanted">
        <div className="wrap grid">
          <div>
            <h2>Can&apos;t find it? <span className="gold">Tell us what you need.</span></h2>
            <p className="lead" style={{ color: 'var(--on-navy)', marginTop: 18 }}>Join the wanted list. We WhatsApp you when a match arrives.</p>
          </div>
          <WantedForm waNumber={config.whatsappNumber} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="community">
            <div><h2 style={{ fontSize: 'clamp(28px,3vw,40px)' }}>Join &quot;New in Birmingham&quot; on WhatsApp</h2><p style={{ marginTop: 8 }}>Tips for your first weeks plus weekly deals.</p></div>
            <a className="btn btn-navy" href={config.communityUrl || wa} target="_blank" rel="noopener noreferrer">Join the community</a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>Google reviews</h2><a href="https://www.google.com/maps/search/SET+Home+Birmingham" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>Read all reviews on Google</a></div>
          <div className="reviews"><div>GOOGLE REVIEW · embed real review</div><div>GOOGLE REVIEW · embed real review</div><div>GOOGLE REVIEW · embed real review</div></div>
        </div>
      </section>
    </Shell>
  );
}
