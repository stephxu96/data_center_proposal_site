export function redirect(path) { throw Object.assign(new Error(`redirect:${path}`), { digest: 'NEXT_REDIRECT' }); }
