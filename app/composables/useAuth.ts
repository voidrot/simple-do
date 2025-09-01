import { createAuthClient } from 'better-auth/client'
import type { Session } from 'better-auth'
import { onMounted, ref, readonly } from 'vue'

export const client = createAuthClient({
  baseURL: 'http://localhost:3000', // adjust if needed
})

export const useAuth = () => {
  const session = ref<Session | null>(null)

  const getSession = async (): Promise<Session | null> => {
    try {
      const result = await client.getSession()
      session.value = result.data as Session | null
      return result.data as Session | null
    }
    catch (error) {
      console.error('Failed to get session:', error)
      session.value = null
      return null
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await client.signOut()
      session.value = null
    }
    catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  // Get initial session on mount
  onMounted(async () => {
    await getSession()
  })

  return {
    client,
    session: readonly(session),
    getSession,
    signOut,
  }
}
