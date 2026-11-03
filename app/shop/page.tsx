import Shell from '@/components/Shell';
import CatalogGrid from '@/components/CatalogGrid';
import { getCatalog, categories } from '@/lib/catalog';
import { config, waLink } from '@/lib/config';

export const revalidate = 600;
export const metadata = { title: 'All stock – SET Home' };

export default async function Shop() {
  const { products } = await getCatalog();
  const wa = waLink(config.whatsappNumber);
  return (
    <Shell>
      <section className="section">
        <div className="wrap">
          <div className="head">
            <div>
              <h2>All stock</h2>
              <p className="lead">Build your own pack: pick 5 or more items and get {config.packDiscountPercent}% off. Tap any item to ask about it on WhatsApp.</p>
            </div>
            <span className="pill pill-light">{products.length} items in stock</span>
          </div>
          <CatalogGrid products={products} categories={categories} waHref={wa} />
        </div>
      </section>
    </Shell>
  );
}
