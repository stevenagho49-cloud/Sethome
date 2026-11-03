'use client';
import { useState } from 'react';
import { checkPostcode, areaNames } from '@/lib/areas';

export default function PostcodeChecker({ waHref, compact }: { waHref: string; compact?: boolean }) {
  const [pc, setPc] = useState('');
  const [res, setRes] = useState<null | { ok: boolean; area?: string }>(null);
  const run = () => setRes(checkPostcode(pc));
  return (
    <div>
      <label htmlFor={compact ? 'pc2' : 'pc'} style={{ fontWeight: 700, display: 'block', marginBottom: 10 }}>{compact ? 'Delivery postcode' : 'Do we deliver to you?'}</label>
      <div className="pc-row">
        <input id={compact ? 'pc2' : 'pc'} value={pc} placeholder="e.g. B29 6AB" autoComplete="postal-code"
          onChange={(e) => { setPc(e.target.value); setRes(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); run(); } }} />
        <button type="button" className={`btn ${compact ? 'btn-outline' : 'btn-navy'}`} onClick={run}>Check</button>
      </div>
      {!compact && <div className="areas">{areaNames.map((a) => <span key={a}>{a}</span>)}</div>}
      {res && (res.ok
        ? <p className="msg ok" role="status">Yes, we deliver to {res.area}. Delivery and set-up are included.</p>
        : <p className="msg no" role="status">We don&apos;t cover this postcode yet. <a href={waHref} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> and we&apos;ll check for you.</p>)}
    </div>
  );
}
