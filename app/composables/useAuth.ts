import { createAuthClient } from 'better-auth/client'
import { onMounted, ref, readonly } from 'vue'

export const client = createAuthClient({
  baseURL: 'http://localhost:3000' // adjust if needed
})

export const useAuth = () => {
  const session = ref<any>(null) // eslint-disable-line no-undef

  const getSession = async () => {
    const result = await client.getSession()
    session.value = result.data
    return result.data
  }

  const signOut = async () => {
    await client.signOut()
    session.value = null
  }

  onMounted(() => {
    getSession()
  })

  return {
    client,
    session: readonly(session),
    getSession,
    signOut
  }
}
