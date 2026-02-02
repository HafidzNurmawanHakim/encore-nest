import { drizzle } from 'drizzle-orm/node-postgres';
import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const db = new SQLDatabase('encore-nest', {
  migrations: {
    path: './migrations',
    source: 'drizzle',
  },
});

export const drizzleDb = drizzle(db.connectionString);
