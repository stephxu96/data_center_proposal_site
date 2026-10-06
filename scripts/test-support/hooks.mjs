// Lets server code run under Node tests: the Workers-only module resolves to a local
// stub, and extensionless relative imports resolve to their .ts files as Vite does.
export async function resolve(specifier, context, next) {
  if (specifier === 'cloudflare:workers') return { url: new URL('./cloudflare-workers.mjs', import.meta.url).href, shortCircuit: true };
  if (/^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$|\.json$/.test(specifier)) {
    for (const suffix of ['.ts', '.tsx', '/index.ts']) {
      try { return await next(specifier + suffix, context); } catch {}
    }
  }
  return next(specifier, context);
}
