// Lets server code run under Node tests: Workers and Next runtime modules resolve to
// local stubs, and extensionless relative imports resolve to their .ts files as Vite does.
export async function resolve(specifier, context, next) {
  const stubs = { 'cloudflare:workers': './cloudflare-workers.mjs', 'next/headers': './next-headers.mjs', 'next/navigation': './next-navigation.mjs', 'next/server': './next-server.mjs' };
  if (stubs[specifier]) return { url: new URL(stubs[specifier], import.meta.url).href, shortCircuit: true };
  if (/^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$|\.json$/.test(specifier)) {
    for (const suffix of ['.ts', '.tsx', '/index.ts']) {
      try { return await next(specifier + suffix, context); } catch {}
    }
  }
  return next(specifier, context);
}
// Vite imports JSON without an attribute; Node requires one.
export async function load(url, context, next) {
  if (url.endsWith('.json')) return next(url, { ...context, importAttributes: { ...context.importAttributes, type: 'json' } });
  return next(url, context);
}
