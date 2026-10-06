declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    DEMO_PUBLIC_REFRESH?: string;
    AUTH_ENABLED?: string;
    INITIAL_ADMIN_USER_ID?: string;
  }
}
