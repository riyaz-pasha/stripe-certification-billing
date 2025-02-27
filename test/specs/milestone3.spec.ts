import { expect } from '@playwright/test';
import { test } from './helpers/fixtures';
import checkout from './helpers/checkout';
import login from './helpers/login';
import { validatePrice } from './helpers/price';
import { validateUsageRecord } from './helpers/subscription';

test.describe('Milestone 3', () => {
  test('Create the Price for on-demand pair coding sessions":3.1', async ({ page, request, browser }) => {
    const onDemandSession = '80 USD per session';
    await page.goto('/');
    // price id from data
    const priceId = await page.locator('[data-ondemand-price-id]').getAttribute('data-ondemand-price-id');
    await expect(priceId).toBeTruthy();
    await validatePrice(request, priceId, 'devchat_paircode_ondemand_', 8000);
    await expect(page.locator('#ondemand-subscription')).toHaveText(onDemandSession, { timeout: 500 });
  });

  test('Implement Checkout for on-demand subscription:3.2', async ({ page }) => {
    await login(page);
    await page.locator('#ondemand-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload();
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    const priceId = await page.locator('[data-ondemand-price-id]').getAttribute('data-ondemand-price-id');
    await expect(priceId).toBeTruthy();
    const customerId = await page.locator('[data-customer-id]').getAttribute('data-customer-id');
    await expect(customerId).toBeTruthy();
    const subscriptionStatus = await page.locator('#subscription-type');
    await expect(subscriptionStatus).toHaveText('You are subscribed to the on-demand package.');
  });


  test('Cancel a subscription and reflect status on page:3.3', async ({ page }) => {
    test.setTimeout(60 * 1000);
    await login(page);
    await page.locator('#ondemand-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload();
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    const priceId = await page.locator('[data-ondemand-price-id]').getAttribute('data-ondemand-price-id');
    await expect(priceId).toBeTruthy();
    const customerId = await page.locator('[data-customer-id]').getAttribute('data-customer-id');
    await expect(customerId).toBeTruthy();
    await page.locator('#manage-subscription').click();
    await page.locator('[data-test="cancel-subscription"]').click();
    await page.locator('[data-testid="confirm"]').click();
    await page.locator('[data-testid="return-to-business-link"]').click();
    await expect(page).toHaveURL('/dashboard');
    await page.waitForTimeout(2000);
    await page.reload();
    const subscriptionEnded = page.locator('#subscription-ended');
    await expect(subscriptionEnded).toHaveText('you have ended your /dev/chat subscription');
  });

  test('Create usage record:3.4', async ({ page, request }) => {
    await login(page);
    await page.locator('#ondemand-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload();
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    const priceId = await page.locator('[data-ondemand-price-id]').getAttribute('data-ondemand-price-id');
    await expect(priceId).toBeTruthy();
    const customerId = await page.locator('[data-customer-id]').getAttribute('data-customer-id');
    await expect(customerId).toBeTruthy();
    await page.locator('#arrange-session').click();
    const sessionRegistered = await page.locator('#session-registered');
    await expect(sessionRegistered).toHaveText('Session registered');
    await validateUsageRecord(request, subscriptionId, priceId);
  });

});
