import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '~~/server/db'
import * as schema from '~~/server/db/schema'
import { userSettings } from '../db/schema/userSettings'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema.auth,
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          // Create Initial User Settings entry in database
          await db.insert(userSettings).values({
            userId: user.id,
            notificationsEnabled: true,
            notifyEmail: false,
            notifyDiscord: false,
            discordWebhook: null,
            timezone: 'UTC',
            language: 'en',
          })
        },
      },
    },
  },
})
