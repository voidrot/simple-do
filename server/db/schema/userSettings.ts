import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { user } from './auth'

export const userSettings = sqliteTable('user_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' })
    .notNull()
    .default(false),
  notifyEmail: integer('notify_email', { mode: 'boolean' })
    .notNull()
    .default(false),
  notifyDiscord: integer('notify_discord', { mode: 'boolean' })
    .notNull()
    .default(false),
  discordWebhook: text('discord_webhook'),
  timezone: text('timezone')
    .notNull()
    .default('UTC'),
  language: text('language')
    .notNull()
    .default('en'),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
})
