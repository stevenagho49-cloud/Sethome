import { Logo } from './Header';
import { Tick } from './icons';

export default function SlimHeader({ step }: { step: 2 | 3 }) {
  return (
    <header className="site-header slim-header">
      <div className="wrap bar">
        <Logo />
        <div className="progress" aria-label={`Step ${step} of 3`}>
          <span className="s done"><span className="c"><Tick size={14} /></span>Pack</span>
          <span className="line" />
          <span className={`s ${step === 2 ? 'cur' : 'done'}`}><span className="c">{step === 2 ? '2' : <Tick size={14} />}</span>Reserve</span>
          <span className="line" />
          <span className={`s ${step === 3 ? 'cur' : ''}`}><span className="c">3</span>Confirmed</span>
          <span className="short">Step {step} of 3</span>
        </div>
      </div>
    </header>
  );
}
