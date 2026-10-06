// Test stand-in for next/headers: tests set globalThis.__requestHeaders to simulate the Sites identity headers.
export async function headers() { return new Headers(globalThis.__requestHeaders ?? {}); }
export async function cookies() { return { get: () => undefined }; }
