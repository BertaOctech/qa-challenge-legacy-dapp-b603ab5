import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});


test.describe('Actions List', () => {

  test('Page Title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Home/);
  });

  test('New Action Button', async ({ page }) => {
    // Expects page to have a button with text "New Action".
    await expect(page.getByRole('button', { name: 'New Action' })).toBeVisible();

    // Expects that button to be disabled
    await expect(page.getByRole('button', { name: 'New Action' })).toBeDisabled();
  });

  test('Ensure there is list of maximum 10 actions or the no actions message is shown', async ({ page }) => {
    // Check for list items
    const listItems = page.locator('ul[class^="ActionsList_main"] > li');
    const itemCount = await listItems.count();
    const maxItems = 10;
    if (itemCount > 0) {
      // Expects there are at most 10 items
      await expect(itemCount).toBeLessThanOrEqual(maxItems);
      // Expects there are at least one item having the correct class
      await expect(listItems.first()).toHaveAttribute('data-action-type');
    } else {
      // If no list items are present, check for the "no items" message
      const noListItemsElement = await page.locator('div[class⁼^"Actions_noData"]');
      await expect(noListItemsElement).toHaveText('No actions found');
    }
  });


  test('Ensure all the list components are rendered as expected', async ({ page }) => {
    // Define the required components
    const requiredTexts = {
      teamFilter: {
        locator: 'div[class^="ColonyDomainSelector_activeItem_"]',
        expectedText: ' All Teams'
      },
      title: {
        locator: 'div[class^="Actions_title"]',
        expectedText: 'Actions'
      },
      sortFilter: {
        locator: 'button[name="sortFilter"]',
        expectedText: 'Sort Filter'
      },
      typeFilter: {
        locator: 'button[name="actionTypeFilter"]',
        expectedText: 'Type Filter'
      },
      loadMoreButton: {
        locator: 'div[class^="LoadMoreButton"] > button',
        expectedText: 'Load More'
      }
    };
    // Verify the components are rendered as expected
    for (const [key, value] of Object.entries(requiredTexts)) {
      const element = await page.locator(value.locator);
      await expect(element).toHaveText(value.expectedText);
      await element.scrollIntoViewIfNeeded();
      await expect(element).toBeVisible();
    }
  });
});

