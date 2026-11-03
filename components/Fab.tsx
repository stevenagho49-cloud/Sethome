'use client';
import { useEffect, useState } from 'react';
import { WaIcon } from './icons';

// On desktop the button appears once you scroll past the top section, so it never covers the hero.
export default function Fab({ href, round, hideOnMobile }: { href: string; round?: boolean; hideOnMobile?: boolean }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const on = () => setShow(round || window.innerWidth <= 860 || window.scrollY > window.innerHeight * 0.55);
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [round]);
  if (!show) return null;
  return (
    <a className={`fab${round ? ' round' : ''}${hideOnMobile ? ' hide-sm' : ''}`} href={href} target="_blank" rel="noopener noreferrer" aria-label="Ask on WhatsApp">
      <WaIcon size={28} /><span>Ask on WhatsApp</span>
    </a>
  );
}
