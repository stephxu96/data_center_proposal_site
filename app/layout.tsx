import type { Metadata } from 'next';
import './globals.css';
import { authEnabled } from '../lib/access';
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from './chatgpt-auth';

export const metadata: Metadata = {
  title: 'University AI Infrastructure | Decision Explorer',
  description: 'A decision explorer for a shared university AI data center.',
};

const nav = [
  ['Overview', '/'], ['Compare sites', '/countries'], ['Initial design', '/design'],
  ['Investment case', '/investment'], ['Evidence', '/evidence'], ['Adviser', '/adviser'], ['Glossary', '/glossary'], ['Workspace', '/workspace'],
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authenticated = authEnabled();
  const user = authenticated ? await getChatGPTUser() : null;
  const actionHref = !authenticated
    ? '/workspace'
    : user
      ? chatGPTSignOutPath('/')
      : chatGPTSignInPath('/workspace');
  const actionLabel = !authenticated
    ? 'Team workspace'
    : user
      ? 'Sign out'
      : 'Sign in';
  return <html lang="en"><body>
    <header className="site-header"><div className="shell header-row">
      <a className="brand" href="/"><span className="brand-mark" aria-hidden="true"><i/><i/><i/><i/></span><span>Northstar<br/>Compute</span></a>
      <nav className="nav" aria-label="Main navigation">{nav.map(([name,href]) => <a key={href} href={href}>{name}</a>)}</nav>
      <a className="header-action" href={actionHref}>{actionLabel}</a>
    </div></header>
    <main>{children}</main>
    <footer className="footer"><div className="shell footer-inner"><div><strong>Northstar Compute</strong><p>A shared AI infrastructure concept for university decision-makers.</p></div><div><p><a href="/countries">Compare locations</a> &nbsp; <a href="/design">Explore design</a> &nbsp; <a href="/investment">Investment case</a> &nbsp; <a href="/glossary">Glossary</a></p></div></div></footer>
  </body></html>;
}
