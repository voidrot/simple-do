import { ref, reactive } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'

/**
 * Composable for handling authentication form logic.
 * Provides reactive form state, validation, and submission handling.
 */
export const useAuthForm = () => {
  const { client, session, getSession } = useAuth()
  const router = useRouter()

  const isLogin = ref(true)
  const loading = ref(false)
  const message = ref('')
  const isError = ref(false)
  const showPassword = ref(false)

  const form = reactive({
    name: '',
    email: '',
    password: '',
  })

  const errors = reactive({
    name: '',
    email: '',
    password: '',
  })

  /**
   * Debounce utility to prevent rapid form submissions.
   */
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  /**
   * Toggles between login and register modes, clearing form and errors.
   */
  const toggleMode = () => {
    isLogin.value = !isLogin.value
    message.value = ''
    isError.value = false
    form.name = ''
    form.email = ''
    form.password = ''
    errors.name = ''
    errors.email = ''
    errors.password = ''
  }

  /**
   * Handles form submission with authentication logic.
   */
  const handleSubmit = async () => {
    loading.value = true
    message.value = ''
    isError.value = false

    try {
      if (isLogin.value) {
        const result = await client.signIn.email({
          email: form.email,
          password: form.password,
        })
        if (result.error) {
          throw new Error(result.error.message)
        }
        message.value = 'Login successful!'
        await getSession()
        await router.push('/')
      }
      else {
        const result = await client.signUp.email({
          email: form.email,
          password: form.password,
          name: form.name,
        })
        if (result.error) {
          throw new Error(result.error.message)
        }
        message.value = 'Registration successful! Please check your email to verify.'
        await getSession()
        isLogin.value = true
      }
    }
    catch (error) {
      isError.value = true
      message.value = (error as Error)?.message || 'An error occurred'
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Debounced version of handleSubmit.
   */
  const debouncedSubmit = debounce(handleSubmit, 300)

  return {
    isLogin,
    loading,
    message,
    isError,
    showPassword,
    form,
    errors,
    toggleMode,
    debouncedSubmit,
  }
}
