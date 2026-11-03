import { config } from './config';
import type { Product } from './catalog';

export type Slot = { label: string; match: RegExp; qty?: number };
export type PackDef = {
  slug: string;
  name: string;
  forWho: string;
  popular?: boolean;
  plus?: string;
  slots: Slot[];
};

// Edit packs here. Each slot picks the first in-stock item from Kai's shop whose name matches.
// Customers can swap to any other match.
export const packDefs: PackDef[] = [
  {
    slug: 'student-room',
    name: 'Student Room',
    forWho: 'For one room in a shared house',
    slots: [
      { label: 'Desk', match: /desk/i },
      { label: 'Chair', match: /office chair|desk chair|computer chair/i },
      { label: 'Shelf unit', match: /bookshelf|bookcase|shelf|shelving/i },
      { label: 'Kettle and toaster set', match: /kettle.*toaster|toaster.*kettle/i },
    ],
  },
  {
    slug: 'flat-starter',
    name: 'Flat Starter',
    forWho: 'For a one or two bedroom flat',
    popular: true,
    slots: [
      { label: 'Dining table', match: /dining table(?!.*bench)/i },
      { label: 'Dining chairs', match: /dining chair/i, qty: 4 },
      { label: 'Chest of drawers', match: /chest of drawers|drawer chest|\bdresser/i },
      { label: 'Shelves', match: /bookshelf|bookcase|shelf|shelving/i },
      { label: 'Kettle and toaster set', match: /kettle.*toaster|toaster.*kettle/i },
      { label: 'Air fryer oven', match: /air fry/i },
    ],
  },
  {
    slug: 'family-home',
    name: 'Family Home',
    forWho: 'For a family house',
    plus: 'Everything in Flat Starter, plus:',
    slots: [
      { label: 'Dining table', match: /dining table(?!.*bench)/i },
      { label: 'Dining chairs', match: /dining chair/i, qty: 4 },
      { label: 'Chest of drawers', match: /chest of drawers|drawer chest|\bdresser/i },
      { label: 'Shelves', match: /bookshelf|bookcase|shelf|shelving/i },
      { label: 'Kettle and toaster set', match: /kettle.*toaster|toaster.*kettle/i },
      { label: 'Air fryer oven', match: /air fry/i },
      { label: 'Sofa bed', match: /sofa bed|sofabed|chair bed/i },
      { label: 'Extra storage', match: /cabinet|trolley|wardrobe|storage unit/i },
      { label: 'Bar stools', match: /bar ?stool/i },
    ],
  },
];

export type PackItem = { slot: Slot; product: Product; alternatives: Product[] };
export type Pack = PackDef & { items: PackItem[]; missing: string[]; price: number; itemsTotal: number; image?: string };

export function buildPack(def: PackDef, products: Product[], swaps: Record<number, string> = {}): Pack {
  const items: PackItem[] = [];
  const missing: string[] = [];
  def.slots.forEach((slot, i) => {
    const matches = products.filter((p) => slot.match.test(p.title)).sort((a, b) => a.price - b.price);
    if (!matches.length) { missing.push(slot.label); return; }
    const chosen = matches.find((m) => m.handle === swaps[i]) || matches[0];
    items.push({ slot, product: chosen, alternatives: matches.filter((m) => m !== chosen).slice(0, 4) });
  });
  const itemsTotal = items.reduce((s, it) => s + it.product.price * (it.slot.qty || 1), 0);
  const price = Math.round(itemsTotal * (1 - config.packDiscountPercent / 100) + config.deliveryFee);
  const image = items.find((it) => it.product.images[0])?.product.images[0];
  return { ...def, items, missing, price, itemsTotal, image };
}

export function getPackDef(slug: string) {
  return packDefs.find((p) => p.slug === slug);
}
