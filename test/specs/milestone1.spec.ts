import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { assert } from 'console';

import { test } from './helpers/fixtures';
import { serverRequest, stripeRequest } from './helpers/api';
import checkout from './helpers/checkout';
import login from './helpers/login';
import { validatePrice } from './helpers/price';
import { validateSubscription } from './helpers/subscription';

test.describe('Milestone 1', () => {
  test('Create one Product named “Chat” with one fixed monthly Price of $60, price key value is one chat per month:1.1', async ({ page, request, browser }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const monthly = await page.locator('#monthly-subscription');
    // price id from data
    const priceId = await page.locator('[data-monthly-price-id]').getAttribute('data-monthly-price-id');
    await expect(priceId).toBeTruthy();
    await validatePrice(request, priceId, 'devchat_paircode_monthly_', 6000);
    await expect(monthly).toHaveText('60 USD per month');
  });

  test('Implement Checkout redirect on the lefthand button to start a subscription, quantity=1 and unchangeable, which allows a 3 day trial:1.2', async ({ page, request }) => {
    await login(page);
    await page.locator('#monthly-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle' });
    const priceId = await page.locator('[data-monthly-price-id]').getAttribute('data-monthly-price-id');
    await expect(priceId).toBeTruthy();
    await validatePrice(request, priceId, 'devchat_paircode_monthly_', 6000);
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    await validateSubscription(request, subscriptionId, priceId);
    await expect(priceId).toBeTruthy();

    const subscriptionStatus = page.locator('#subscription-type');
    await expect(subscriptionStatus).toHaveText('You are subscribed to the monthly package');
  });

  test('Implement POST /users:1.3', async ({ request }) => {
    const data = {
      email: faker.internet.email()
    }
    const response = await serverRequest(request, 'POST', `users`, data);
    await expect(response.id).toBeTruthy();
    const stripeResponse = await stripeRequest(request, 'GET', `customers/${response.id}`);
    await expect(stripeResponse.id).toBeTruthy();
    await expect(response.id).toEqual(stripeResponse.id);
  });

  test('Implement GET /users:1.4', async ({ request }) => {
    const data = {
      email: faker.internet.email()
    }
    const response = await serverRequest(request, 'POST', `users`, data);
    await expect(response.id).toBeTruthy();
    const customerId = await response.id;
    const getResponse = await serverRequest(request, 'GET', `users?user_id=${customerId}`);
    const retrievedCustomerId = getResponse.user.id;
    await assert(customerId, retrievedCustomerId, "Could not Retrieve User by Id.")
  });
});
