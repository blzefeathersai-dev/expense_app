import { test } from '@playwright/test'

test('inspect console and click buttons', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG[' + msg.type() + ']:', msg.text()))
  page.on('pageerror', err => console.log('PAGE ERROR:', err))
  await page.goto('http://localhost:4173')
  await page.waitForTimeout(1000)
  // Handle initial budget overlay if it appears (fresh install state)
  try {
    const budgetInput = page.locator('input[aria-label="Initial budget amount"]')
    if (await budgetInput.isVisible({ timeout: 2000 })) {
      await budgetInput.fill('5000')
      await page.click('text=Start')
      await page.waitForTimeout(500)
    }
  } catch (e) {
    // Ignore if not present
  }

  // try clicking main nav buttons
  const labels = ['Dashboard','Expenses','Categories','Past Months','Analytics']
  for (const label of labels) {
    try {
      console.log('TRY CLICK:', label)
      await page.click(`text=${label}`, { timeout: 3000 })
      await page.waitForTimeout(300)
    } catch (e) {
      console.log('CLICK FAILED', label, e.message)
    }
  }
  // also try Add Expense
  try {
    await page.click('text=Add Expense', {timeout:3000})
    await page.waitForTimeout(500)
  } catch (e) {
    console.log('Add Expense click failed:', e.message)
  }
})