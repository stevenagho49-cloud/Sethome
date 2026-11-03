'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';
import type { Product, Category } from '@/lib/catalog';

export default function CatalogGrid({ products, categories, waHref, limit }: { products: Product[]; categories: Category[]; waHref: string; limit?: number }) {
  const [cat, setCat] = useState<'All' | Category>('All');
  const list = products.filter((p) => cat === 'All' || p.category === cat);
  const shown = limit ? list.slice(0, limit) : list;
  return (
    <>
      <div className="chips" role="group" aria-label="Filter by category">
        {(['All', ...categories] as const).map((c) => (
          <button key={c} className={`chip${cat === c ? ' on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {shown.length ? (
        <div className="products">{shown.map((p) => <ProductCard key={p.id} p={p} waHref={waHref} />)}</div>
      ) : <p className="muted">Nothing in this category right now. Add it to the wanted list and we&apos;ll message you.</p>}
    </>
  );
}
