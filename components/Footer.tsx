import Link from 'next/link';
import { LogoMark } from './icons';

export default function Footer({ waHref, waLabel, email }: { waHref: string; waLabel: string; email: string }) {
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div>
          <div className="logo" style={{ marginBottom: 14 }}><LogoMark /><span><b>SET HOME</b><small>Home · Furniture · Appliances</small></span></div>
          <p>Room packs for people new to Birmingham.<br />Delivered and set up on your move-in day.</p>
        </div>
        <div><h4>Shop</h4><Link href="/#packs">Starter packs</Link><Link href="/shop">Build your own</Link><Link href="/shop">New in</Link></div>
        <div><h4>Help</h4><Link href="/#how">How it works</Link><Link href="/#delivery">Delivery areas</Link><Link href="/#how">7-day swap</Link></div>
        <div><h4>Contact</h4><a href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp {waLabel}</a><a href={`mailto:${email}`}>{email}</a><span style={{ display: 'block', padding: '4px 0' }}>Birmingham, UK</span></div>
      </div>
      <div className="wrap bottom">© SET Home</div>
    </footer>
  );
}
