'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LogoMark } from './icons';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="SET Home – home">
      <LogoMark />
      <span><b>SET HOME</b><small className="logo-tag">Home · Furniture · Appliances</small></span>
    </Link>
  );
}

export default function Header({ waHref }: { waHref: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Logo />
        <button className="menu-btn" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        <nav id="main-nav" className={`nav${open ? ' open' : ''}`} aria-label="Main">
          <Link href="/#packs" onClick={() => setOpen(false)}>Starter packs</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>Build your own</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>New in</Link>
          <Link href="/#how" onClick={() => setOpen(false)}>How it works</Link>
          <a href={waHref} className="dot" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <Link href="/#wanted" className="btn btn-gold" style={{ minHeight: 48 }} onClick={() => setOpen(false)}>Tell us what you need</Link>
        </nav>
      </div>
    </header>
  );
}
