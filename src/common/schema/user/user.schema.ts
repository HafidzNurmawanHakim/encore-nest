import * as p from 'drizzle-orm/pg-core';

export const users = p.pgTable('users', {
  id: p.integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: p.text('name').notNull(),
  fullname: p.text('fullname').notNull(),
  email: p.text('email').notNull().unique(),
  role: p.text('role').default('user').notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  updatedAt: p
    .timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
