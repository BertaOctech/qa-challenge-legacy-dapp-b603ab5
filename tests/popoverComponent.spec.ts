import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Load page and wait for the list to load
  await page.goto('/');
  await page.waitForSelector('ul[class^="ActionsList_main"]');
});

test.describe('Popover Component', () => {
  test('Ensure the user popover component opens and closes as expected', async ({ page }) => {
	// Get first item of the list
	const firstItem = page.locator('ul[class^="ActionsList_main"] > li').first();
    // Locate the avatar and open the popover
	const avatarDiv = await firstItem.locator('div[class^="ActionsListItem_avatar"]').first();
	const avatarImage = avatarDiv.locator('img').first();
	await expect(avatarImage).toBeVisible();
	await avatarImage.click();
	// Verfy the popover is visible
	const popoverTitle = await firstItem.locator('p[class^="InfoPopover_userName"]');
	await expect(popoverTitle).toBeVisible();
	//verify the popover hides when clicking outside
	await avatarImage.click();
	await expect(popoverTitle).not.toBeVisible();
  });
});
