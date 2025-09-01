import { test as setup, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const authFile = path.join(__dirname, '../playwright/.auth/user.json')

// Generate a random email for testing
const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 15)
  return `test${randomString}@example.com`
}

setup('authenticate user', async ({ page }) => {
  await page.goto('/auth')
  await page.waitForLoadState('networkidle')

  // Switch to register mode
  await page.locator('#auth-toggle-btn').click()

  // Wait for the name input to be visible
  await page.waitForSelector('#auth-name-input', { timeout: 5000 })
  await page.locator('#auth-name-input').fill('Test User')
  await page.locator('#auth-email-input').fill(generateRandomEmail())
  await page.locator('#auth-password-input').fill('password123')

  await page.locator('#auth-submit-btn').click()

  // Check for success message
  await expect(page.locator('.alert-success')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
