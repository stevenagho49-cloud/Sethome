import Header from './Header';
import Footer from './Footer';
import Fab from './Fab';
import { config, waLink } from '@/lib/config';

export function waDisplay() {
  const n = config.whatsappNumber;
  return n ? '+' + n.replace(/^(\d{2})(\d{4})(\d+)/, '$1 $2 $3') : '[NUMBER]';
}

export default function Shell({ children, fabRound }: { children: React.ReactNode; fabRound?: boolean }) {
  const wa = waLink(config.whatsappNumber);
  return (
    <>
      <Header waHref={wa} />
      <main>{children}</main>
      <Footer waHref={wa} waLabel={waDisplay()} email={config.contactEmail} />
      <Fab href={wa} round={fabRound} />
    </>
  );
}
