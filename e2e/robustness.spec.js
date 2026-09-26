import { test, expect } from '@playwright/test';

test.describe('Robustness / Stress Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Handle initial setup if needed
        const startBtn = page.getByRole('button', { name: 'Start' });
        if (await startBtn.isVisible()) {
            await page.fill('input[aria-label="Initial budget amount"]', '5000');
            await startBtn.click();
        }
    });

    test('User Flow: Rapid Expense Entry', async ({ page }) => {
        await page.click('button:has-text("Add Expense")');
        const overlay = page.locator('.add-overlay');
        await expect(overlay).toBeVisible();

        // Rapidly add 5 items
        for (let i = 0; i < 5; i++) {
            await page.fill('input[placeholder="Title"]', `Rapid Item ${i}`);
            await page.fill('input[placeholder="Price"]', '100');
            await page.click('button:has-text("Save")');
            // Wait for overlay to close slightly, then reopen
            await expect(overlay).not.toBeVisible();
            if (i < 4) await page.click('button:has-text("Add Expense")');
        }

        // Verify list
        const rows = page.locator('.expenses-table tbody tr');
        await expect(rows).toHaveCount(5);
    });

    test('User Flow: Persistence Check', async ({ page }) => {
        // Add item
        await page.click('button:has-text("Add Expense")');
        await page.fill('input[placeholder="Title"]', 'Persistent Item');
        await page.fill('input[placeholder="Price"]', '555');
        await page.click('button:has-text("Save")');

        // Reload
        await page.reload();

        // Verify item still there
        await expect(page.locator('text=Persistent Item')).toBeVisible();
        await expect(page.locator('text=₹555.00')).toBeVisible();
    });

    test('User Flow: Delete Category with Expenses', async ({ page }) => {
        // 1. Create unique category
        await page.click('text=Categories');
        await page.fill('input[placeholder="New category"]', 'DeleteMe');
        await page.click('button:has-text("Add")');
        await expect(page.locator('text=DeleteMe')).toBeVisible();

        // 2. Add expense to it
        await page.click('text=Expenses');
        await page.click('button:has-text("Add Expense")');
        await page.fill('input[placeholder="Title"]', 'To Move');
        await page.fill('input[placeholder="Price"]', '50');
        await page.selectOption('select', { label: 'DeleteMe' });
        await page.click('button:has-text("Save")');

        // 3. Delete Category
        await page.click('text=Categories');
        page.on('dialog', dialog => dialog.accept()); // Accept confirmation
        await page.click('button[aria-label="Delete"] >> nth=-1'); // Click delete on the last item (should be DeleteMe)

        // 4. Verify Expense Moved to Miscellaneous
        await page.click('text=Expenses');
        const row = page.locator('.expense-row', { hasText: 'To Move' });
        await expect(row).toContainText('Miscellaneous');
    });
});
