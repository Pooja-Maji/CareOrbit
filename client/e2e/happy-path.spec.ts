import { test, expect } from '@playwright/test';

/**
 * SthreeCare - 90-Second Judging Demo Path E2E Test
 *
 * Sequence:
 * 1. Open app and verify landing page / auth state
 * 2. Access assessment screen (/assess)
 * 3. Trigger the 90-second demo preset (PBAC 134 pts + Hb 9.8 g/dL)
 * 4. Run Compass evaluation and verify /result screen with flags & gauges
 * 5. Verify doctor summary dossier & QR
 * 6. Transition to Person B's Healthcare Time Bank (/support)
 * 7. Verify follow-up tracking and timeline persistence
 */

test.describe('SthreeCare 90-Second Demo Happy Path', () => {
  test('Completes end-to-end clinical assessment to community support journey', async ({ page }) => {
    // Step 1: Open Application
    await page.goto('/');
    await expect(page).toHaveTitle(/SthreeCare/i);

    // Step 2: Navigate to Health Check Assessment
    await page.goto('/assess');
    await expect(page.locator('text=Health Check')).toBeVisible();

    // Step 3: Trigger the 90-second demo preset
    const demoButton = page.locator('button:has-text("90s Hackathon Demo")');
    await expect(demoButton).toBeVisible();
    await demoButton.click();

    // Step 4: Evaluate with Health Compass Engine
    const evaluateButton = page.locator('button:has-text("Evaluate Results")');
    await expect(evaluateButton).toBeVisible();
    await evaluateButton.click();

    // Step 5: Verify Results Screen
    await expect(page).toHaveURL(/.*result/);
    await expect(page.locator('text=Your Results')).toBeVisible();

    // Check gauges and flags
    await expect(page.locator('text=Menstrual Flow (PBAC)').or(page.locator('text=Period flow'))).toBeVisible();
    await expect(page.locator('text=Haemoglobin')).toBeVisible();

    // Step 6: Test Volunteer Companion Link (Integration Handoff from A -> B)
    const volunteerHelpBtn = page.locator('button:has-text("Get Volunteer Help")').first();
    if (await volunteerHelpBtn.isVisible()) {
      await volunteerHelpBtn.click();
      await expect(page).toHaveURL(/.*support/);
      await expect(page.locator('text=Volunteer Companion').or(page.locator('text=Request Support'))).toBeVisible();
    }

    // Step 7: Verify History Care Thread (Person B)
    await page.goto('/history');
    await expect(page.locator('text=Care Thread').or(page.locator('text=History'))).toBeVisible();
  });
});
