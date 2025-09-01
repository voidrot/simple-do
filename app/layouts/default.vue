<template>
  <div
    class="min-h-screen bg-base-200"
    :data-theme="currentTheme"
  >
    <NuxtRouteAnnouncer />
    <header
      v-if="!isAuthPage"
      class="navbar bg-base-200 shadow-lg"
    >
      <div class="navbar-start">
        <h1 class="text-xl font-bold">
          Simple Do
        </h1>
      </div>
      <div class="navbar-end">
        <ThemeToggle />
        <div
          v-if="session"
          class="flex items-center gap-4"
        >
          <span class="text-sm">Welcome, {{ session.user.name }}!</span>
          <NuxtLink
            to="/settings"
            class="btn btn-ghost btn-sm"
          >
            Settings
          </NuxtLink>
          <button
            class="btn btn-outline btn-sm"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
        <div v-else>
          <NuxtLink
            to="/auth"
            class="btn btn-primary btn-sm"
          >
            Login / Register
          </NuxtLink>
        </div>
      </div>
    </header>
    <main
      class="container mx-auto px-4 py-8"
      :class="{ 'min-h-screen flex items-center justify-center': isAuthPage }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from '#app'
import { useAuth } from '~/composables/useAuth'
import { computed, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const { session, signOut, getSession } = useAuth()

// Theme management
const themeCookie = useCookie('theme', {
  default: () => 'dark',
  watch: true,
})

const currentTheme = computed(() => themeCookie.value)

const isAuthPage = computed(() => route.path === '/auth')

// Watch for route changes and refresh session if needed
watch(() => route.path, async (newPath) => {
  if (newPath !== '/auth' && !session.value) {
    await getSession()
  }
})

const handleSignOut = async () => {
  await signOut()
  await router.push('/auth')
}
</script>
