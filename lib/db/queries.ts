import { getDb } from './client';

export async function getSchemaHealth() {
  const db = getDb();
  const result = await db.$client.prepare('SELECT COUNT(*) AS count FROM countries').first<{ count: number }>();
  return { countryCount: result?.count ?? null };
}
