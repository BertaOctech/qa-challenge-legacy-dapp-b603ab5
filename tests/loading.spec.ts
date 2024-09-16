import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Loading issues', () => {
  test('Ensure the "Load More" button works as expected', async ({ page }) => {
    // TODO: Manage test data to ensure ther number of items is known, I am using 62 items here.
    const itemsNumber = 62;
    // Load more items
    const loadMoreButton = page.locator('div[class^="LoadMoreButton"] > button');
    await loadMoreButton.scrollIntoViewIfNeeded();
    await expect(loadMoreButton).toBeVisible();
    await loadMoreButton.click();

    for (let i = 0; 10 * (i+2) < itemsNumber; i++) {            
      const listItems = page.locator('ul[class^="ActionsList_main"] > li');
      const itemCount = await listItems.count();
      
      // Assert that the item count matches the expected count
      await expect(itemCount).toBe(10 * (i+2));
      await loadMoreButton.scrollIntoViewIfNeeded();
      await expect(loadMoreButton).toBeVisible();
      await loadMoreButton.click();
    }
    // Once the last batch of items is loaded, the button should disappear
    const listItems = page.locator('ul[class^="ActionsList_main"] > li');
    const itemCount = await listItems.count();
    await expect(itemCount).toBe(itemsNumber);
    await expect(loadMoreButton).not.toBeVisible();
  });
  
  test('Ensure list loading renders the correct loader component', async ({ page }) => {
    // Force a slower browser behaviour
    // FIXME: I do not manage to see the spinner.
    // I tried killing the internet conection too
    // await page.context().setOffline(true);
    await page.context().setDefaultNavigationTimeout(10000);

    // Load more items
    // TODO: Manage test data to ensure there are at least 11 items in list
    const loadMoreButton = await page.locator('div[class^="LoadMoreButton"] > button');
    await loadMoreButton.scrollIntoViewIfNeeded();
    await expect(loadMoreButton).toBeVisible();
    await loadMoreButton.click();

    // Verify the spinner is visible
    const loadingSpinner = await page.locator('div[class^="loadingSpinner"] ');
    await loadingSpinner.scrollIntoViewIfNeeded();
    await expect(loadingSpinner).toBeVisible();
    // TODO: Restore conection and verify the spinner is gone
  });
});
