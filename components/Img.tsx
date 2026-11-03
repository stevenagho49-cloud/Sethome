/* eslint-disable @next/next/no-img-element */
export default function Img({ src, alt, label, dark, className }: { src?: string; alt: string; label?: string; dark?: boolean; className?: string }) {
  if (!src) return <div className={`ph${dark ? ' dark' : ''}`} role="img" aria-label={alt}>PHOTO · {label || alt}</div>;
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}
