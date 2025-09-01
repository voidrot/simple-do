import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthForm } from '../../app/composables/useAuthForm'

// Mock dependencies
vi.mock('#app', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    client: {
      signIn: {
        email: vi.fn(),
      },
      signUp: {
        email: vi.fn(),
      },
    },
    session: { value: null },
    getSession: vi.fn(),
  }),
}))

describe('useAuthForm', () => {
  let composable: ReturnType<typeof useAuthForm>

  beforeEach(() => {
    composable = useAuthForm()
  })

  it('should initialize with default values', () => {
    expect(composable.isLogin.value).toBe(true)
    expect(composable.loading.value).toBe(false)
    expect(composable.message.value).toBe('')
    expect(composable.isError.value).toBe(false)
    expect(composable.showPassword.value).toBe(false)
  })

  it('should toggle mode correctly', () => {
    composable.toggleMode()
    expect(composable.isLogin.value).toBe(false)
    expect(composable.message.value).toBe('')
    expect(composable.isError.value).toBe(false)
  })

  it('should clear form and errors on toggle', () => {
    composable.form.name = 'test'
    composable.form.email = 'test@example.com'
    composable.form.password = 'password'
    composable.errors.name = 'error'
    composable.errors.email = 'error'
    composable.errors.password = 'error'

    composable.toggleMode()

    expect(composable.form.name).toBe('')
    expect(composable.form.email).toBe('')
    expect(composable.form.password).toBe('')
    expect(composable.errors.name).toBe('')
    expect(composable.errors.email).toBe('')
    expect(composable.errors.password).toBe('')
  })

  // Add more tests for handleSubmit, debouncedSubmit, etc.
})
