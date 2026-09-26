import { test, expect } from '@playwright/test'

test('full flow: initial budget, add/edit/delete expense', async ({ page }) => {
  await page.goto('http://localhost:4173')

  // Initial budget prompt visible
  await page.waitForSelector('form.add-form')
  await page.fill('input[type=number]', '200')
  // Wait for any opening overlay/animation to finish before clicking
  await page.waitForSelector('.add-overlay', { state: 'detached', timeout: 5000 }).catch(() => {})
  await page.click('form.add-form >> text=Start')

  // Add an expense
  await page.click('text=Add Expense')
  await page.fill('input[aria-label=Title]', 'Coffee')
  await page.fill('input[type=number]', '3.5')
  await page.click('text=Save')

  // Go to Expenses view
  await page.click('text=Expenses')
  await expect(page.locator('table.expenses-table')).toContainText('Coffee')

  // Edit expense
  await page.click('text=Edit')
  await page.fill('input[aria-label=Title]', 'Coffee Latte')
  await page.click('text=Save')
  await expect(page.locator('table.expenses-table')).toContainText('Coffee Latte')

  // Delete expense with two-step confirm
  await page.click('text=Delete')
  await page.click('text=Continue')
  await page.click('text=Delete Permanently')
  await expect(page.locator('table.expenses-table')).not.toContainText('Coffee Latte')
})
