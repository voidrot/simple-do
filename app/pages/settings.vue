<template>
  <div class="max-w-2xl mx-auto">
    <div class="card shadow-xl bg-base-100">
      <div class="card-body">
        <h1 class="card-title text-3xl font-bold mb-6">
          Settings
        </h1>

        <!-- Success/Error Messages -->
        <div
          v-if="message"
          :class="['alert mb-6', isError ? 'alert-error' : 'alert-success']"
        >
          <span>{{ message }}</span>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex justify-center items-center py-8"
        >
          <span class="loading loading-spinner loading-lg" />
          <span class="ml-2">Loading settings...</span>
        </div>

        <!-- Settings Form -->
        <form
          v-else-if="settings"
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- Notifications Section -->
          <div class="divider">
            <h2 class="text-xl font-semibold">
              Notifications
            </h2>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Enable Notifications</span>
              <input
                v-model="formData.notificationsEnabled"
                type="checkbox"
                class="checkbox checkbox-primary"
                aria-describedby="notifications-help"
              >
            </label>
            <div
              id="notifications-help"
              class="text-sm text-base-content/70 mt-1"
            >
              Allow the app to send you notifications about your tasks
            </div>
          </div>

          <div
            v-if="formData.notificationsEnabled"
            class="space-y-4 ml-6"
          >
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Email Notifications</span>
                <input
                  v-model="formData.notifyEmail"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  aria-describedby="email-notifications-help"
                >
              </label>
              <div
                id="email-notifications-help"
                class="text-sm text-base-content/70 mt-1"
              >
                Receive notifications via email
              </div>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Discord Notifications</span>
                <input
                  v-model="formData.notifyDiscord"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  aria-describedby="discord-notifications-help"
                >
              </label>
              <div
                id="discord-notifications-help"
                class="text-sm text-base-content/70 mt-1"
              >
                Receive notifications via Discord webhook
              </div>
            </div>

            <div
              v-if="formData.notifyDiscord"
              class="form-control"
            >
              <label class="label">
                <span class="label-text">Discord Webhook URL</span>
              </label>
              <input
                v-model="formData.discordWebhook"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                class="input input-bordered w-full"
                aria-describedby="discord-webhook-help"
              >
              <div
                id="discord-webhook-help"
                class="text-sm text-base-content/70 mt-1"
              >
                Enter your Discord webhook URL to receive notifications
              </div>
            </div>
          </div>

          <!-- Preferences Section -->
          <div class="divider">
            <h2 class="text-xl font-semibold">
              Preferences
            </h2>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Timezone</span>
            </label>
            <select
              v-model="formData.timezone"
              class="select select-bordered w-full"
              aria-describedby="timezone-help"
            >
              <option value="UTC">
                UTC
              </option>
              <option value="America/New_York">
                Eastern Time
              </option>
              <option value="America/Chicago">
                Central Time
              </option>
              <option value="America/Denver">
                Mountain Time
              </option>
              <option value="America/Los_Angeles">
                Pacific Time
              </option>
              <option value="Europe/London">
                London
              </option>
              <option value="Europe/Paris">
                Paris
              </option>
              <option value="Asia/Tokyo">
                Tokyo
              </option>
              <option value="Australia/Sydney">
                Sydney
              </option>
            </select>
            <div
              id="timezone-help"
              class="text-sm text-base-content/70 mt-1"
            >
              Your local timezone for scheduling and notifications
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Language</span>
            </label>
            <select
              v-model="formData.language"
              class="select select-bordered w-full"
              aria-describedby="language-help"
            >
              <option value="en">
                English
              </option>
              <option value="es">
                Español
              </option>
              <option value="fr">
                Français
              </option>
              <option value="de">
                Deutsch
              </option>
              <option value="it">
                Italiano
              </option>
              <option value="pt">
                Português
              </option>
              <option value="ja">
                日本語
              </option>
              <option value="ko">
                한국어
              </option>
              <option value="zh">
                中文
              </option>
            </select>
            <div
              id="language-help"
              class="text-sm text-base-content/70 mt-1"
            >
              Preferred language for the application interface
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-control mt-8">
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="submitting"
            >
              <span
                v-if="submitting"
                class="loading loading-spinner loading-sm"
              />
              {{ submitting ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </form>

        <!-- No Settings State -->
        <div
          v-else
          class="text-center py-8"
        >
          <p class="text-base-content/70">
            Unable to load settings. Please try refreshing the page.
          </p>
          <button
            class="btn btn-primary mt-4"
            @click="loadSettings"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useSettings, type UserSettings } from '~/composables/useSettings'

const { session, getSession } = useAuth()
const router = useRouter()

const { settings, loading, error, fetchSettings, updateSettings } = useSettings()

const message = ref('')
const isError = ref(false)
const submitting = ref(false)

const formData = reactive<UserSettings>({
  userId: session.value?.user?.id || '',
  notificationsEnabled: false,
  notifyEmail: false,
  notifyDiscord: false,
  discordWebhook: null,
  timezone: 'UTC',
  language: 'en',
})

const loadSettings = async () => {
  console.log('loadSettings called, session:', session.value)
  if (!session.value?.user?.id) {
    message.value = 'You must be logged in to view settings'
    isError.value = true
    return
  }

  console.log('Fetching settings...')
  const result = await fetchSettings()
  console.log('Fetch result:', result)
  if (result) {
    // Populate form with current settings
    Object.assign(formData, result)
    // Ensure userId is set correctly
    formData.userId = session.value.user.id
    message.value = ''
    isError.value = false
  }
  else {
    // Check if it's an authentication error
    console.log('Fetch failed, error:', error.value)
    if (error.value?.includes('401') || error.value?.includes('Unauthorized')) {
      message.value = 'Session expired. Please log in again.'
      isError.value = true
      // Redirect to auth after a short delay
      setTimeout(() => {
        router.push('/auth')
      }, 2000)
    }
    else {
      message.value = 'Failed to load settings. Please try again.'
      isError.value = true
    }
  }
}

const handleSubmit = async () => {
  if (!session.value?.user?.id) {
    message.value = 'You must be logged in to update settings'
    isError.value = true
    return
  }

  submitting.value = true
  message.value = ''
  isError.value = false

  try {
    // Prepare update data (only send changed fields)
    const updates: Partial<UserSettings> = {}

    if (settings.value) {
      if (formData.notificationsEnabled !== settings.value.notificationsEnabled) {
        updates.notificationsEnabled = formData.notificationsEnabled
      }
      if (formData.notifyEmail !== settings.value.notifyEmail) {
        updates.notifyEmail = formData.notifyEmail
      }
      if (formData.notifyDiscord !== settings.value.notifyDiscord) {
        updates.notifyDiscord = formData.notifyDiscord
      }
      if (formData.discordWebhook !== settings.value.discordWebhook) {
        updates.discordWebhook = formData.discordWebhook
      }
      if (formData.timezone !== settings.value.timezone) {
        updates.timezone = formData.timezone
      }
      if (formData.language !== settings.value.language) {
        updates.language = formData.language
      }
    }
    else {
      // If no existing settings, send all fields
      updates.notificationsEnabled = formData.notificationsEnabled
      updates.notifyEmail = formData.notifyEmail
      updates.notifyDiscord = formData.notifyDiscord
      updates.discordWebhook = formData.discordWebhook
      updates.timezone = formData.timezone
      updates.language = formData.language
    }

    if (Object.keys(updates).length === 0) {
      message.value = 'No changes to save'
      isError.value = true
      return
    }

    const result = await updateSettings(updates)
    if (result) {
      message.value = 'Settings saved successfully!'
      isError.value = false
    }
    else {
      // Use the specific error from the composable
      message.value = error.value || 'Failed to save settings'
      isError.value = true
    }
  }
  catch (err) {
    message.value = (err as Error)?.message || 'Failed to save settings'
    isError.value = true
  }
  finally {
    submitting.value = false
  }
}

onMounted(async () => {
  console.log('Settings page mounted, checking session...')
  const currentSession = await getSession()
  console.log('Session result:', currentSession)
  if (!currentSession) {
    console.log('No session found, redirecting to auth')
    await router.push('/auth')
    return
  }
  console.log('Session found, loading settings')
  loadSettings()
})
</script>
