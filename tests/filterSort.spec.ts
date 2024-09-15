import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Load page and wait for the list to load
  await page.goto('/');
  await page.waitForSelector('ul[class^="ActionsList_main"]');
});

test.describe('Filtering and Sorting', () => {

  test('Ensure text in Button chnages after click', async ({ page }) => {
    // Locate the button and get its initial text
    const button = await page.locator('button[name="sortFilter"]');
    await expect(button).toHaveText('Sort Filter');
  
    // Order by Oldest actions first
    await button.click();
    const textOption = await page.getByRole('option', { name: 'Oldest' });
    await expect(textOption).toBeVisible();
    await textOption.click();
    await expect(textOption).not.toBeVisible();

    // Other options not working
    // await textOption.click({ force: true });
    // await textOption.dispatchEvent('click');

    // By default we have 5000 timeout which is quite a lot. 
    // Added some more just in case, to no event
    // await page.waitForTimeout(10000); // Adjust timing if needed

    // Check the button has changed Title
    await expect(button).toHaveText('Oldest');
  });

  test('Ensure the list is correctly filtered by team', async ({ page }) => {
    // Filter items by team Normandy
    // TODO: Manage test data to ensure there are at least 1 item of team Normandy
    await page.locator('div[class^="ColonyDomainSelector_activeItem_"]').click();
    const NormandyOption = await page.getByRole('option', { name: 'Normandy' });
    await expect(NormandyOption).toBeVisible();
    await NormandyOption.click();
    await expect(NormandyOption).not.toBeVisible();

    // Check all the items are of type PAYMENT
    const listItems = page.locator('ul[class^="ActionsList_main"] > li');
    for (let i = 0; i < await listItems.count(); i++) {
      const item = listItems.nth(i);
      const domainText = await item.locator('span[class^="ActionsListItem_domain"]').textContent();
      await expect(domainText).toContain('Normandy');
    }
  });

  test('Ensure the list is correctly filtered by type', async ({ page }) => {
    // Filter items by type Payment
    // TODO: Manage test data to ensure there are at least 1 item of type Payment
    await page.locator('button[name="actionTypeFilter"]').click();
    const paymentOption = await page.locator('li[title="Payment"]');
    await expect(paymentOption).toBeVisible();
    await paymentOption.click();
    await expect(paymentOption).not.toBeVisible();

    // Check all the items are of type PAYMENT
    // FIXME: I am being careful to use the DOM item with the event attached but 
    // the list is not updated.
    // Manually the filter works, except the text change considered in the first test
    const listItems = page.locator('ul[class^="ActionsList_main"] > li');
    for (let i = 0; i < await listItems.count(); i++) {
      const item = listItems.nth(i);
      const attributeValue = await item.getAttribute('data-action-type');
      await expect(attributeValue).toBe('PAYMENT');
    }
  });

    test('Ensure the list is correctly sorted by date', async ({ page }) => {
      // TODO: Manage test data to ensure there are at least 2 items
      // FIXME: The dates do not have year so it is difficult to know if the sort is correct

      // Make sure we have 2 items
      const listItems = page.locator('ul[class^="ActionsList_main"] > li');
      const itemCount = await listItems.count();
      await expect(itemCount).toBeGreaterThanOrEqual(2);

      // Sort items by date	oldest first
      const button = await page.getByRole('button', { name: 'Sort Filter' });
      await expect(button).toHaveText('Sort Filter');    
      // Order by Oldest actions first
      await button.click();
      const oldestOption = await page.getByRole('option', { name: 'Oldest' });
      await expect(oldestOption).toBeVisible();
      await oldestOption.click();
      await expect(oldestOption).not.toBeVisible();
      // Wait for the list to be ready
      // FIXME: The list is not being updated. Manually the list is sorted
      await page.waitForSelector('ul[class^="ActionsList_main"]');        
      // Grab the list of date items
      const dateItemsOld = await page.$$eval('ul[class^="ActionsList_main"] > li span[class^="ActionsListItem_day"]', items =>
        items.map(item => item.textContent.trim())
      );
      const dateObjectsOld = dateItemsOld.map(dateStr => new Date(dateStr));
      // Check if the dates are in sorted order
      const isSortedOld = dateObjectsOld.every((date, i, arr) => i === 0 || arr[i - 1] <= date);
      expect(isSortedOld).toBe(true);

      // Sort items by date	newest first
      await button.click();
      const newestOption = await page.getByRole('option', { name: 'Oldest' });
      await expect(newestOption).toBeVisible();
      await newestOption.click();
      await expect(newestOption).not.toBeVisible();
      // Wait for the list to be ready
      // FIXME: The list is not being updated. Manually the list is sorted
      await page.waitForSelector('ul[class^="ActionsList_main"]');        
      // Grab the list of date items
      const dateItemsNew = await page.$$eval('ul[class^="ActionsList_main"] > li span[class^="ActionsListItem_day"]', items =>
        items.map(item => item.textContent.trim())
      );
      const dateObjectsNew = dateItemsNew.map(dateStr => new Date(dateStr));
      // Check if the dates are in sorted order
      const isSortedNew = dateObjectsNew.every((date, i, arr) => i === 0 || arr[i - 1] <= date);
      expect(isSortedNew).toBe(true);
    });
});
