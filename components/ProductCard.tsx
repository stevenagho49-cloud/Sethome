import Img from './Img';
import { gbp } from '@/lib/config';
import type { Product } from '@/lib/catalog';

export default function ProductCard({ p, waHref }: { p: Product; waHref: string }) {
  const text = `Hi SET Home, is this still available? ${p.title} (${gbp(p.price)})`;
  return (
    <a className="card" href={`${waHref}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
      <div className="photo">
        <Img src={p.images[0]} alt={p.title} />
        {p.condition && <span className="pill pill-navy cond">{p.condition}</span>}
      </div>
      <span className="t">{p.title}</span>
      <span className="p">{gbp(p.price)}{p.wasPrice && <span className="was">{gbp(p.wasPrice)}</span>}</span>
    </a>
  );
}
