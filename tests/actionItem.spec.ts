import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Load page and wait for the list to load
  await page.goto('/');
  await page.waitForSelector('ul[class^="ActionsList_main"]');
});

test.describe('Action Item', () => {
  test('Ensure list items have the expected elements', async ({ page }) => {
    // Get the elements of the list
    const liItems = await page.locator('ul[class^="ActionsList_main"] > li'); 

    // Iterate through each li element
    for (let i = 0; i < await liItems.count(); i++) {
      // Verify the avatar is visible
      const avatarDiv = await liItems.nth(i).locator('div[class^="ActionsListItem_avatar"]');
      const avatarImage = avatarDiv.locator('img');
      await expect(avatarImage).toBeVisible();

      // Verify the title is visible
      const title = await liItems.nth(i).locator('span[class^="ActionsListItem_title"]');
      await expect(title).toBeVisible();

      // Verify the status is visible
      const status = await liItems.nth(i).locator('[class^="ActionsListItem_tagWrapper"] > span');
      await expect(status).toBeVisible();

      // Verify a date is visible and it has the right format
      const dateText = await liItems.nth(i).locator('span[class^="ActionsListItem_day"]').textContent();
      expect(dateText).toMatch(/^\d{1,2} [a-zA-Z]{3}$/);

      // Verify the team is visible
      const team = await liItems.nth(i).locator('span[class^="ActionsListItem_domain"]');
      await expect(team).toBeVisible();
    }
  });

  test('Ensure the title corresponds to the correct type', async ({ page }) => {
    // TODO: Verify the title schema, not only the substring
    // Define the type-titles
    const typeTitleTable = {
      'MINT': 'Mint',
      'PAYMENT': 'Pay',
      'TRANSFER': 'Transfer',
      'REPUTATION': 'Reputation',
      'PERMISSIONS':	'Assign the',
      'UPGRADE':	'Upgrade to version',
      'DETAILS': 'Details changed',
      'ADDRESS': 'Address book was updated',
      'TEAM': 'New team:',
      'GENERIC': 'Generic Action',
    };
  
    // Get the elements of the list
    const liItems = await page.locator('ul[class^="ActionsList_main"] > li'); 
  
    // Iterate through each li element
    for (let i = 0; i < await liItems.count(); i++) {
  
      // Get the type
      const typeValue = await liItems.nth(i).getAttribute('data-action-type');
      expect(typeValue).not.toBeNull();
  
      if (typeValue !== null) {
        // verify the type is a key of the typeTitleTable
        expect(Object.keys(typeTitleTable)).toContain(typeValue);
  
        if (Object.keys(typeTitleTable).includes(typeValue)) {
          const liText = await liItems.nth(i).textContent();
          // Verify the text of the element contains the expected one
          expect(liText).not.toBeNull();
          if (liText !== null) {
              await expect(liText.trim()).toContain(typeTitleTable[typeValue]);
          }
        }
      }
    }
  });
});
