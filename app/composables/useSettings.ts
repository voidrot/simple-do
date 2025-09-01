import { ref, readonly } from 'vue'

export interface UserSettings {
  id?: number
  userId: string
  notificationsEnabled: boolean
  notifyEmail: boolean
  notifyDiscord: boolean
  discordWebhook?: string | null
  timezone: string
  language: string
  updatedAt?: Date
}

export const useSettings = () => {
  const settings = ref<UserSettings | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchSettings = async (): Promise<UserSettings | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<UserSettings>('/api/user/settings', {
        method: 'GET',
      })
      console.log(response)
      settings.value = response
      return response
    }
    catch (err: unknown) {
      console.error('Settings fetch error:', err)
      const errorObj = err as { statusCode?: number, status?: number, message?: string }
      if (errorObj?.statusCode === 401 || errorObj?.status === 401) {
        error.value = 'Unauthorized: Please log in to access settings'
      }
      else if (errorObj?.statusCode === 500 || errorObj?.status === 500) {
        error.value = 'Server error: Please try again later'
      }
      else {
        error.value = errorObj?.message || 'Failed to fetch settings'
      }
      return null
    }
    finally {
      loading.value = false
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>): Promise<UserSettings | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<UserSettings>('/api/user/settings', {
        method: 'PUT',
        body: updates,
      })
      settings.value = response
      return response
    }
    catch (err: unknown) {
      console.error('Settings update error:', err)
      const errorObj = err as { statusCode?: number, status?: number, message?: string }
      if (errorObj?.statusCode === 401 || errorObj?.status === 401) {
        error.value = 'Unauthorized: Please log in to update settings'
      }
      else if (errorObj?.statusCode === 400 || errorObj?.status === 400) {
        error.value = 'Invalid data: Please check your input'
      }
      else if (errorObj?.statusCode === 500 || errorObj?.status === 500) {
        error.value = 'Server error: Please try again later'
      }
      else {
        error.value = errorObj?.message || 'Failed to update settings'
      }
      return null
    }
    finally {
      loading.value = false
    }
  }

  return {
    settings: readonly(settings),
    loading: readonly(loading),
    error: readonly(error),
    fetchSettings,
    updateSettings,
  }
}
