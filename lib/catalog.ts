import { config } from './config';
import { fallbackProducts } from './fallback';

export type Category = 'Bedroom' | 'Living room' | 'Kitchen' | 'Appliances' | 'Study' | 'Outdoor & kids';
export const categories: Category[] = ['Bedroom', 'Living room', 'Kitchen', 'Appliances', 'Study', 'Outdoor & kids'];

export type Product = {
  id: string;
  handle: string;
  title: string;
  price: number;        // SET Home price (Kai's price + markup)
  wasPrice?: number;    // RRP shown as "was"
  images: string[];
  available: boolean;
  category: Category;
  condition?: string;
};

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  vendor?: string;
  product_type?: string;
  tags?: string[] | string;
  variants: { price: string; compare_at_price?: string | null; available?: boolean }[];
  images: { src: string }[];
};

const rules: [Category, RegExp][] = [
  ['Appliances', /fridge|freezer|dishwasher|washing machine|air fryer|oven|kettle|toaster|coffee|microwave|heater|radiator|fireplace|blender|steamer|food warmer/i],
  ['Kitchen', /kitchen|bar stool|barstool|trolley|bin|dining/i],
  ['Bedroom', /bed|wardrobe|drawer|dresser|mattress|bedside|nightstand/i],
  ['Study', /desk|office|computer|file cabinet|bookcase|bookshelf/i],
  ['Outdoor & kids', /ride on|ride-on|scooter|kids|garden|outdoor|gazebo|parasol|sunlounger|bike|trampoline/i],
  ['Living room', /sofa|armchair|recliner|chair|coffee table|tv|lamp|shelf|shelving|cabinet|sideboard|ottoman|mirror/i],
];

export function categorise(title: string, type = ''): Category {
  const text = `${title} ${type}`;
  for (const [cat, re] of rules) if (re.test(text)) return cat;
  return 'Living room';
}

function conditionFrom(tags: string[]): string | undefined {
  const t = tags.map((x) => x.toLowerCase());
  if (t.some((x) => x.includes('customer return') || x === 'return' || x === 'returns')) return 'Customer return';
  if (t.some((x) => x.includes('second') || x.includes('used'))) return 'Checked second-hand';
  if (t.some((x) => x.includes('clearance') || x.includes('overstock'))) return 'Clearance';
  if (t.some((x) => x === 'new' || x.includes('brand new'))) return 'New';
  return undefined;
}

const withMarkup = (p: number) => Math.round(p * (1 + config.markupPercent / 100) * 100) / 100;

function mapProduct(p: ShopifyProduct): Product {
  const tags = Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',').map((s) => s.trim());
  const v = p.variants[0] || { price: '0' };
  const price = withMarkup(Number(v.price));
  const cmp = v.compare_at_price ? Number(v.compare_at_price) : undefined;
  return {
    id: String(p.id),
    handle: p.handle,
    title: p.title.replace(/^(HOMCOM|TOYTAKE2|AIYAPLAY|Vinsetto|Outsunny|SPORTNOW|WLIVE)\s+/i, ''),
    price,
    wasPrice: cmp && cmp > price ? cmp : undefined,
    images: (p.images || []).map((i) => i.src),
    available: p.variants.some((x) => x.available !== false),
    category: categorise(p.title, p.product_type),
    condition: conditionFrom(tags),
  };
}

let memo: { at: number; data: Product[]; live: boolean } | null = null;

/** All products from Kai's shop, refreshed every 10 minutes. Sold items are removed. */
export async function getCatalog(): Promise<{ products: Product[]; live: boolean }> {
  if (memo && Date.now() - memo.at < 10 * 60 * 1000) return { products: memo.data, live: memo.live };
  try {
    const all: ShopifyProduct[] = [];
    for (let page = 1; page <= 8; page++) {
      const res = await fetch(`${config.shopUrl}/products.json?limit=250&page=${page}`, {
        next: { revalidate: 600 },
        headers: { 'User-Agent': 'SETHomeCatalog/1.0' },
      });
      if (!res.ok) throw new Error(`Shop returned ${res.status}`);
      const json = (await res.json()) as { products: ShopifyProduct[] };
      all.push(...json.products);
      if (json.products.length < 250) break;
    }
    const data = all.map(mapProduct).filter((p) => p.available && p.price > 0 && !/mystery|pallet/i.test(p.title));
    memo = { at: Date.now(), data, live: true };
    return { products: data, live: true };
  } catch (e) {
    console.warn('[catalog] Using fallback products:', (e as Error).message);
    const data = fallbackProducts.map((p) => ({ ...p, price: withMarkup(p.price) }));
    memo = { at: Date.now() - 9 * 60 * 1000, data, live: false };
    return { products: data, live: false };
  }
}

export async function getProduct(handle: string) {
  const { products } = await getCatalog();
  return products.find((p) => p.handle === handle);
}
