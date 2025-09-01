<template>
  <div class="card w-full max-w-md shadow-xl bg-base-100">
    <!-- Skip link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-content focus:px-4 focus:py-2 focus:rounded"
    >Skip to main content</a>
    <div class="card-body">
      <div class="flex justify-end mb-4">
        <component :is="ThemeToggle" />
      </div>
      <header>
        <h2 class="card-title justify-center text-2xl font-bold">
          {{ isLogin ? 'Login' : 'Register' }}
        </h2>
      </header>

      <main id="main-content">
        <form
          class="space-y-4"
          @submit.prevent="debouncedSubmit"
        >
          <div
            v-if="!isLogin"
            class="form-control"
          >
            <label
              for="auth-name-input"
              class="label"
            >
              <span class="label-text">Name</span>
            </label>
            <input
              id="auth-name-input"
              v-model="form.name"
              type="text"
              placeholder="Enter your name"
              class="input input-bordered w-full"
              required
              aria-describedby="name-error"
              :disabled="loading"
            >
            <label
              v-if="errors.name"
              class="label"
            >
              <span
                id="name-error"
                class="label-text-alt text-error"
                role="alert"
              >{{ errors.name }}</span>
            </label>
          </div>

          <div class="form-control">
            <label
              for="auth-email-input"
              class="label"
            >
              <span class="label-text">Email</span>
            </label>
            <input
              id="auth-email-input"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              class="input input-bordered w-full"
              required
              aria-describedby="email-error"
              :disabled="loading"
            >
            <label
              v-if="errors.email"
              class="label"
            >
              <span
                id="email-error"
                class="label-text-alt text-error"
                role="alert"
              >{{ errors.email }}</span>
            </label>
          </div>

          <div class="form-control">
            <label
              for="auth-password-input"
              class="label"
            >
              <span class="label-text">Password</span>
            </label>
            <div class="relative">
              <input
                id="auth-password-input"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="isLogin ? 'Enter your password' : 'Create a password'"
                class="input input-bordered w-full pr-10"
                required
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                aria-describedby="password-error"
                :disabled="loading"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :disabled="loading"
                @click="showPassword = !showPassword"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                  <template v-else>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </template>
                </svg>
              </button>
            </div>
            <label
              v-if="errors.password"
              class="label"
            >
              <span
                id="password-error"
                class="label-text-alt text-error"
                role="alert"
              >{{ errors.password }}</span>
            </label>
          </div>

          <div class="form-control mt-6">
            <button
              id="auth-submit-btn"
              type="submit"
              class="btn btn-primary w-full"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="loading loading-spinner loading-sm"
              />
              {{ loading ? 'Processing...' : (isLogin ? 'Login' : 'Register') }}
            </button>
          </div>
        </form>

        <div class="divider">
          OR
        </div>

        <button
          id="auth-toggle-btn"
          class="btn btn-outline btn-block"
          :disabled="loading"
          @click="toggleMode"
        >
          {{ isLogin ? 'Need to register?' : 'Already have an account?' }}
        </button>

        <div
          v-if="isLogin"
          class="text-center mt-4"
        >
          <a
            href="/forgot-password"
            class="link link-primary"
          >Forgot your password?</a>
        </div>
        <div
          v-else
          class="text-center mt-4"
        >
          <p class="text-sm">
            Already verified your email?
            <a
              href="/resend-verification"
              class="link link-primary"
            >
              Resend verification
            </a>
          </p>
        </div>

        <div
          v-if="message && !isError"
          class="alert alert-success"
          role="alert"
        >
          <span>{{ message }}</span>
        </div>
        <div
          v-else-if="message && isError"
          class="alert alert-error"
          role="alert"
        >
          <span>{{ message }}</span>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useAuthForm } from '~/composables/useAuthForm'

/**
 * Lazy-loaded ThemeToggle component for performance.
 */
const ThemeToggle = defineAsyncComponent(() => import('~/components/ThemeToggle.vue'))

const { session, getSession } = useAuth()
const router = useRouter()
const {
  isLogin,
  loading,
  message,
  isError,
  showPassword,
  form,
  errors,
  toggleMode,
  debouncedSubmit,
} = useAuthForm()

onMounted(async () => {
  try {
    await getSession()
    // Only redirect if we have a valid session
    if (session.value) {
      await router.push('/')
    }
  } catch (error) {
    console.error('Error checking session on auth page:', error)
    // Don't redirect on error, let user try to authenticate
  }
})
</script>

<style scoped>
/* Screen reader only utility class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Enhanced focus states for accessibility */
input:focus, button:focus {
  outline: 2px solid hsl(var(--p));
  outline-offset: 2px;
}

/* Ensure high contrast for focus */
@media (prefers-contrast: high) {
  input:focus, button:focus {
    outline: 3px solid #000;
  }
}
</style>
