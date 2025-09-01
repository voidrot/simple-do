import { test, expect } from '@playwright/test'

test.describe('Authentication Page', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
  })

  test('should display login form by default', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Login')
    await expect(page.locator('#auth-email-input')).toBeVisible()
    await expect(page.locator('#auth-password-input')).toBeVisible()
    await expect(page.locator('#auth-submit-btn')).toHaveText('Login')
  })

  test('should toggle to register form', async ({ page }) => {
    await page.locator('#auth-toggle-btn').click()
    await expect(page.locator('h2')).toHaveText('Register')
    await expect(page.locator('#auth-name-input')).toBeVisible()
    await expect(page.locator('#auth-submit-btn')).toHaveText('Register')
  })

  test('should show password toggle button', async ({ page }) => {
    const passwordInput = page.locator('#auth-password-input')
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click the toggle button (assuming it's the button inside the relative div)
    await page.locator('.relative button').click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
  })

  test('should disable form during submission', async ({ page }) => {
    await page.locator('#auth-email-input').fill('test@example.com')
    await page.locator('#auth-password-input').fill('password')

    await page.locator('#auth-submit-btn').click()

    // Check that inputs are disabled during loading
    await expect(page.locator('#auth-email-input')).toBeDisabled()
    await expect(page.locator('#auth-password-input')).toBeDisabled()
    await expect(page.locator('#auth-submit-btn')).toBeDisabled()
  })

  test('should show error message for invalid login', async ({ page }) => {
    await page.locator('#auth-email-input').fill('invalid@example.com')
    await page.locator('#auth-password-input').fill('wrongpassword')

    await page.locator('#auth-submit-btn').click()

    await expect(page.locator('.alert-error')).toBeVisible()
    await expect(page.locator('.alert-error')).toHaveAttribute('role', 'alert')
  })

  test('should have accessible labels and IDs', async ({ page }) => {
    // Check for attributes
    await expect(page.locator('label[for="auth-email-input"]')).toBeVisible()
    await expect(page.locator('#auth-email-input')).toHaveAttribute('aria-describedby', 'email-error')

    // Check skip link
    await expect(page.locator('a[href="#main-content"]')).toBeVisible()
  })

  test('should have semantic HTML structure', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
  })
})
