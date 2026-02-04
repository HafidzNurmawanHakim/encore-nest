import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/config/database/migrations',
  schema: './src/modules/**/schema/**/*.ts',
  dialect: 'postgresql',
});
