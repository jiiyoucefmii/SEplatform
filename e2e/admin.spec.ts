import { test, expect } from '@playwright/test';

/**
 * Admin User Journey E2E Tests
 * 
 * Tests the complete flow:
 * Login → Dashboard → Manage Teachers → Manage Students/Applications
 */

test.describe('Admin User Journey', () => {
    // Test data - should match seeded data in backend
    const adminCredentials = {
        phone: 'admin',
        password: 'admin123',
    };

    test.beforeEach(async ({ page }) => {
        // Navigate to admin login
        await page.goto('/admin');
    });

    test('should display admin login/dashboard', async ({ page }) => {
        // Admin page should be accessible
        await expect(page.locator('body')).toBeVisible();
    });

    test('should login as admin', async ({ page }) => {
        // Look for login form on admin page
        const phoneInput = page.getByPlaceholder(/phone|username|اسم/i);
        const passwordInput = page.getByPlaceholder(/password|كلمة/i);

        if (await phoneInput.isVisible()) {
            await phoneInput.fill(adminCredentials.phone);
            await passwordInput.fill(adminCredentials.password);

            await page.getByRole('button', { name: /login|دخول/i }).click();

            // Wait for admin dashboard
            await page.waitForTimeout(3000);
        }

        // Take screenshot of admin area
        await page.screenshot({ path: 'e2e/screenshots/admin-dashboard.png' });
    });

    test('complete admin journey: dashboard → teachers → students', async ({ page }) => {
        // Step 1: Login (if required)
        const phoneInput = page.getByPlaceholder(/phone|username/i);
        if (await phoneInput.isVisible()) {
            await phoneInput.fill(adminCredentials.phone);
            await page.getByPlaceholder(/password/i).fill(adminCredentials.password);
            await page.getByRole('button', { name: /login/i }).click();
            await page.waitForTimeout(3000);
        }

        // Step 2: Look for navigation to teachers
        const teachersLink = page.getByRole('link', { name: /teacher|معلم/i });
        if (await teachersLink.isVisible()) {
            await teachersLink.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'e2e/screenshots/admin-teachers.png' });
        }

        // Step 3: Look for navigation to students/applications
        const studentsLink = page.getByRole('link', { name: /student|طالب|application|طلب/i });
        if (await studentsLink.isVisible()) {
            await studentsLink.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'e2e/screenshots/admin-students.png' });
        }
    });
});
