import { test, expect } from '@playwright/test';

/**
 * Interaction E2E Tests
 * 
 * Verifies the read/write workflow between Teacher and Parent users.
 * 
 * Scenario:
 * 1. Teacher logs in and creates a session.
 * 2. Teacher marks a student (Ali) as Absent.
 * 3. Parent logs in.
 * 4. Parent views the session and confirms "Absent" status.
 */

test.describe('Teacher-Parent Interaction', () => {
    // Shared data
    const sessionDate = new Date().toISOString().split('T')[0]; // Today
    const sessionNumber = Math.floor(Math.random() * 1000) + 100; // Random ID to avoid duplicates

    // Teacher credentials
    const teacherCreds = { phone: '0555777666', password: 'teacher123' };

    // Parent credentials
    const parentCreds = { phone: '0555123456', password: 'parent123' };

    test('Teacher modifications should be visible to Parent', async ({ browser }) => {
        // use distinct contexts if we wanted concurrent users, but sequential is fine here
        const context = await browser.newContext();
        const page = await context.newPage();

        // =================================================================
        // PART 1: TEACHER ACTIONS (CREATE & UPDATE)
        // =================================================================
        await test.step('Teacher creates session and marks absent', async () => {
            await page.goto('/login');
            await page.getByPlaceholder('05xxxxxxxx').fill(teacherCreds.phone);
            await page.getByPlaceholder('••••••••').fill(teacherCreds.password);
            await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
            await page.waitForURL(/teacher-dashboard/);

            // Navigate to first course (Teacher has "حلقة ألف")
            // Wait for dashboard to load
            await expect(page.getByText('الأفواج الدراسية')).toBeVisible();

            // Click the specific course card
            await page.getByText('حلقة ألف').click();

            // Wait for sessions view (Header changes to Course Name)
            await expect(page.getByRole('heading', { name: 'حلقة ألف' })).toBeVisible();

            // Open "Add Session" modal
            await page.getByRole('button', { name: 'إضافة حصة جديدة' }).click();

            // Wait for modal
            await expect(page.getByRole('dialog').getByText('إضافة حصة جديدة')).toBeVisible();

            // Fill Session Form
            const dateInput = page.locator('input[type="date"]');
            await dateInput.fill(sessionDate);
            await dateInput.blur(); // Trigger validation/state change

            // Number input
            const numInput = page.locator('input[type="number"]');
            await numInput.fill(sessionNumber.toString());
            await numInput.blur();

            // Wait for Add button to be enabled (date filled)
            const addButton = page.getByRole('button', { name: 'إضافة', exact: true });
            await expect(addButton).toBeEnabled();
            await addButton.click({ force: true });

            // Verify Session Created
            // It should appear in the list.
            await expect(page.getByText(`حصة رقم ${sessionNumber}`)).toBeVisible();

            // Click the new Session to open Details
            await page.getByText(`حصة رقم ${sessionNumber}`).click();

            // Wait for Students list
            await expect(page.getByText('سجل الطلاب')).toBeVisible();

            // Find Student row (Name: 'علي') and Attendance button
            // The attendance button toggles. Default is 'حاضر' (Present - Green).
            // We want to click it to make it 'غائب' (Absent - Red).
            // The button contains text "حاضر" or "غياب".
            const studentRow = page.getByRole('row').filter({ hasText: 'علي' });
            const attendanceButton = studentRow.locator('button').filter({ hasText: 'حاضر' });

            // If already absent, this selector won't find it, so we assume default is present.
            await attendanceButton.click();

            // Verify it changed to Absent
            await expect(studentRow.locator('button')).toHaveText(/غياب/);

            // Save Changes
            await page.getByRole('button', { name: 'حفظ الحضور' }).click();

            // Wait for success/save completion (saving state clears)
            // Button text changes back from 'جاري الحفظ...' to 'حفظ الحضور'
            await expect(page.getByRole('button', { name: 'حفظ الحضور' })).toBeEnabled();

            // Logout
            // TeacherDashboard Sidebar has logout? 
            // We'll just clear cookies/storage or restart context, but manual logout is better if UI has it.
            // Simplify: Close page/context.
            await page.context().clearCookies();
            await page.evaluate(() => localStorage.clear());
        });

        // =================================================================
        // PART 2: PARENT ACTIONS (READ)
        // =================================================================
        await test.step('Parent verifies attendance status', async () => {
            await page.goto('/login');
            await page.getByPlaceholder('05xxxxxxxx').fill(parentCreds.phone);
            await page.getByPlaceholder('••••••••').fill(parentCreds.password);
            await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
            await page.waitForURL(/student-dashboard/);

            // Parent Dashboard lands on ChildrenList usually, or selects first child.
            // If ChildrenList is shown (multiple kids), we select 'علي'.
            // If single kid, it might auto-select.
            // Let's assume auto-select or click 'علي'.
            const childCard = page.getByText('علي');
            if (await childCard.isVisible()) {
                await childCard.click();
            }

            // Cycles List should appear. Select the active cycle.
            // Click the first cycle card.
            await page.locator('.cursor-pointer').first().click();

            // Sessions Table appears.
            // Look for our session number.
            const sessionRow = page.getByRole('row').filter({ hasText: sessionNumber.toString() });

            // Verify it is visible
            await expect(sessionRow).toBeVisible();

            // Check for "Absent" status (غائب)
            // The row should contain text "غائب" or icon XCircle
            await expect(sessionRow).toHaveText(/غائب/);
        });

        await context.close();
    });
});
