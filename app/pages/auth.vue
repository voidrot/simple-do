<template>
  <div class="card w-full max-w-md shadow-xl bg-base-100">
    <div class="card-body">
      <h2 class="card-title justify-center text-2xl font-bold">
        {{ isLogin ? 'Login' : 'Register' }}
      </h2>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="form-control">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter your name"
            class="input input-bordered w-full"
            required
            aria-describedby="name-error"
          >
          <label v-if="errors.name" class="label">
            <span id="name-error" class="label-text-alt text-error">{{ errors.name }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            class="input input-bordered w-full"
            required
            aria-describedby="email-error"
          >
          <label v-if="errors.email" class="label">
            <span id="email-error" class="label-text-alt text-error">{{ errors.email }}</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            class="input input-bordered w-full"
            required
            aria-describedby="password-error"
          >
          <label v-if="errors.password" class="label">
            <span id="password-error" class="label-text-alt text-error">{{ errors.password }}</span>
          </label>
        </div>

        <div class="form-control mt-6">
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"/>
            {{ loading ? 'Processing...' : (isLogin ? 'Login' : 'Register') }}
          </button>
        </div>
      </form>

      <div class="divider">OR</div>

      <button
        class="btn btn-outline btn-block"
        @click="toggleMode"
      >
        {{ isLogin ? 'Need to register?' : 'Already have an account?' }}
      </button>

      <div v-if="message" v-show="!isError" class="alert alert-success">
        <span>{{ message }}</span>
      </div>
      <div v-if="message" v-show="isError" class="alert alert-error">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const { client, session, getSession } = useAuth()
const router = useRouter()

const isLogin = ref(true)
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  message.value = ''
  isError.value = false
  // Clear form
  form.name = ''
  form.email = ''
  form.password = ''
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const handleSubmit = async () => {
  loading.value = true
  message.value = ''
  isError.value = false

  try {
    if (isLogin.value) {
      const result = await client.signIn.email({
        email: form.email,
        password: form.password
      })
      if (result.error) {
        throw new Error(result.error.message)
      }
      message.value = 'Login successful!'
      // Redirect to home or dashboard
      await router.push('/')
    } else {
      const result = await client.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name
      })
      if (result.error) {
        throw new Error(result.error.message)
      }
      message.value = 'Registration successful! Please check your email to verify.'
      // Optionally switch to login mode
      isLogin.value = true
    }
  } catch (error) {
    isError.value = true
    message.value = error?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getSession()
  if (session.value) {
    await router.push('/')
  }
})
</script>
