import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { user } from './auth'

export const task = sqliteTable('task', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type', { enum: ['one_off', 'scheduled'] }).notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  startDate: integer('start_date', { mode: 'timestamp' }),
  recurrence: text('recurrence'), // e.g., 'daily', 'weekly', 'monthly'
  interval: integer('interval').default(1), // every X units
  endDate: integer('end_date', { mode: 'timestamp' }),
  status: text('status', { enum: ['pending', 'in_progress', 'completed', 'cancelled'] })
    .notNull()
    .default('pending'),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})
