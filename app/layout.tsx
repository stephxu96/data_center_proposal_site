import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'University AI Infrastructure | Decision Explorer',
  description: 'A decision explorer for a shared university AI data center.',
};

const nav = [
  ['Overview', '/'], ['Compare sites', '/countries'], ['Initial design', '/design'],
  ['Investment case', '/investment'], ['Evidence', '/evidence'], ['Adviser', '/adviser'], ['Glossary', '/glossary'],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <header className="site-header"><div className="shell header-row">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>Northstar<br/>Compute</span></Link>
      <nav className="nav" aria-label="Main navigation">{nav.map(([name,href]) => <Link key={href} href={href}>{name}</Link>)}</nav>
      <Link className="header-action" href="/investment">Explore the case ↗</Link>
    </div></header>
    <main>{children}</main>
    <footer className="footer"><div className="shell footer-inner"><div><strong>Northstar Compute</strong><p>A shared AI infrastructure concept for university decision-makers.</p></div><div><p><Link href="/countries">Compare locations</Link> &nbsp; <Link href="/design">Explore design</Link> &nbsp; <Link href="/investment">Investment case</Link></p></div></div></footer>
  </body></html>;
}
