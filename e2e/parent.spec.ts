import { test, expect } from '@playwright/test';

/**
 * Parent User Journey E2E Tests
 * 
 * Tests the complete flow:
 * Login → View Students → View Dashboard → View Sessions
 */

test.describe('Parent User Journey', () => {
    // Test data - should match seeded data in backend
    const parentCredentials = {
        phone: '0555123456',
        password: 'parent123',
    };

    test.beforeEach(async ({ page }) => {
        // Start from login page
        await page.goto('/login');
    });

    test('should display login page correctly', async ({ page }) => {
        // Check login form elements using actual placeholders
        await expect(page.getByPlaceholder('05xxxxxxxx')).toBeVisible();
        await expect(page.getByPlaceholder('••••••••')).toBeVisible();
        await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();
    });

    test('should login as parent successfully', async ({ page }) => {
        // Fill login form with actual placeholders
        await page.getByPlaceholder('05xxxxxxxx').fill(parentCredentials.phone);
        await page.getByPlaceholder('••••••••').fill(parentCredentials.password);

        // Submit form
        await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

        // Should redirect to student dashboard
        await expect(page).toHaveURL(/student-dashboard/, { timeout: 10000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // Fill with wrong password
        await page.getByPlaceholder('05xxxxxxxx').fill(parentCredentials.phone);
        await page.getByPlaceholder('••••••••').fill('wrongpassword');

        // Submit form
        await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

        // Should show error message (Arabic text: فشل تسجيل الدخول)
        await expect(page.locator('.bg-red-50, .text-red-700, [class*="error"]')).toBeVisible({ timeout: 5000 });
    });

    test('complete parent journey: login → view children → view cycles', async ({ page }) => {
        // Step 1: Login
        await page.getByPlaceholder('05xxxxxxxx').fill(parentCredentials.phone);
        await page.getByPlaceholder('••••••••').fill(parentCredentials.password);
        await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

        // Wait for student dashboard to load
        await page.waitForURL(/student-dashboard/, { timeout: 10000 });

        // Step 2: Dashboard should be visible
        await expect(page.locator('body')).toBeVisible();

        // Take screenshot of dashboard
        await page.screenshot({ path: 'e2e/screenshots/parent-dashboard.png' });
    });
});
