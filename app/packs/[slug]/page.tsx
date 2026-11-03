import { notFound } from 'next/navigation';
import Link from 'next/link';
import Shell from '@/components/Shell';
import PackView from '@/components/PackView';
import { getCatalog } from '@/lib/catalog';
import { buildPack, getPackDef, packDefs } from '@/lib/packs';
import { config, waLink } from '@/lib/config';

export const revalidate = 600;
export function generateStaticParams() { return packDefs.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const def = getPackDef((await params).slug);
  return { title: def ? `${def.name} pack – SET Home` : 'Pack – SET Home' };
}

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const def = getPackDef((await params).slug);
  if (!def) notFound();
  const { products } = await getCatalog();
  const pack = buildPack(def, products);
  const slots = pack.items.map((it, i) => ({
    index: def.slots.indexOf(it.slot),
    label: it.slot.label,
    qty: it.slot.qty || 1,
    options: [it.product, ...it.alternatives],
    _i: i,
  }));
  return (
    <Shell fabRound>
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/#packs">Starter packs</Link> / {def.name}</nav>
        <PackView
          slug={def.slug} name={def.name} forWho={def.forWho} popular={!!def.popular}
          slots={slots} missing={pack.missing}
          discount={config.packDiscountPercent} delivery={config.deliveryFee} deposit={config.deposit}
          waHref={waLink(config.whatsappNumber, `Hi SET Home, I have a question about the ${def.name} pack.`)}
        />
      </div>
    </Shell>
  );
}
