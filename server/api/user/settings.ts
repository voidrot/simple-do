import { db } from '../../db'
import { userSettings } from '../../db/schema/userSettings'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = event.context.session.user.id
  const method = event.node.req.method

  if (method === 'GET') {
    // Fetch user settings
    const settings = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)

    if (settings.length === 0) {
      // Return default settings if none exist
      return {
        userId,
        notificationsEnabled: false,
        notifyEmail: false,
        notifyDiscord: false,
        discordWebhook: null,
        timezone: 'UTC',
        language: 'en',
      }
    }

    return settings[0]
  }

  if (method === 'PUT' || method === 'POST') {
    // Update or create user settings
    const body = await readBody(event)

    // Validate required fields
    const updates = {
      notificationsEnabled: body.notificationsEnabled ?? false,
      notifyEmail: body.notifyEmail ?? false,
      notifyDiscord: body.notifyDiscord ?? false,
      discordWebhook: body.discordWebhook || null,
      timezone: body.timezone || 'UTC',
      language: body.language || 'en',
      updatedAt: new Date(),
    }

    // Check if settings already exist
    const existingSettings = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)

    if (existingSettings.length === 0) {
      // Create new settings
      const newSettings = await db.insert(userSettings).values({
        userId,
        ...updates,
      }).returning()

      return newSettings[0]
    }
    else {
      // Update existing settings
      const updatedSettings = await db.update(userSettings)
        .set(updates)
        .where(eq(userSettings.userId, userId))
        .returning()

      return updatedSettings[0]
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
