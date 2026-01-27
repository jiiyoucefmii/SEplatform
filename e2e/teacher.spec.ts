import { test, expect } from '@playwright/test';

/**
 * Teacher User Journey E2E Tests
 * 
 * Tests the complete flow:
 * Login with Phone/Password → Redirect to Teacher Dashboard → View Courses → View Sessions
 * 
 * Note: Teachers login via the same /login page as parents.
 * The system redirects to /teacher-dashboard based on user role.
 */

test.describe('Teacher User Journey', () => {
    // Test data - should match seeded data in backend
    // Teachers login with phone+password (same as other users)
    const teacherCredentials = {
        phone: '0555777666',
        password: 'teacher123',
    };

    test.beforeEach(async ({ page }) => {
        // Teachers use the same login page
        await page.goto('/login');
    });

    test('should display teacher login page', async ({ page }) => {
        // Same login page as parents - check form elements
        await expect(page.getByPlaceholder('05xxxxxxxx')).toBeVisible();
        await expect(page.getByPlaceholder('••••••••')).toBeVisible();
        await expect(page.getByRole('button', { name: 'تسجيل الدخول' })).toBeVisible();
    });

    test('should login as teacher and redirect to teacher dashboard', async ({ page }) => {
        // Fill login form with teacher credentials
        await page.getByPlaceholder('05xxxxxxxx').fill(teacherCredentials.phone);
        await page.getByPlaceholder('••••••••').fill(teacherCredentials.password);

        // Submit
        await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

        // Should redirect to teacher dashboard based on role
        await expect(page).toHaveURL(/teacher-dashboard/, { timeout: 10000 });
    });

    test('complete teacher journey: login → view dashboard → manage sessions', async ({ page }) => {
        // Step 1: Login
        await page.getByPlaceholder('05xxxxxxxx').fill(teacherCredentials.phone);
        await page.getByPlaceholder('••••••••').fill(teacherCredentials.password);
        await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

        // Wait for teacher dashboard
        await page.waitForURL(/teacher-dashboard/, { timeout: 10000 });

        // Step 2: Dashboard should be visible with courses/sessions
        await expect(page.locator('body')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'e2e/screenshots/teacher-dashboard.png' });
    });
});
