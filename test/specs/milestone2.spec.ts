import { expect } from '@playwright/test';
import dotenv from 'dotenv';
import Stripe from 'stripe';

import { test } from './helpers/fixtures';
import { createStripeWebhookPayload, serverRequest } from './helpers/api';
import { validatebillingPortalConfiguration } from './helpers/billingPortal';
import checkout from './helpers/checkout';
import login from './helpers/login';
dotenv.config({ path: '../server/.env' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // @ts-ignore Our test account uses this API version
  apiVersion: '2019-12-03',
});

test.describe('Milestone 2', () => {
  // add test case for webhook handler is up

  test('Trial ending:2.1', async ({ page }) => {
    await login(page);
    await page.locator('#monthly-subscription').click();
    await checkout(page, true);
    await page.waitForTimeout(2000);
    await page.reload();

    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    const priceId = await page.locator('[data-monthly-price-id]').getAttribute('data-monthly-price-id');
    await expect(priceId).toBeTruthy();
    const customerId = await page.locator('[data-customer-id]').getAttribute('data-customer-id');
    await expect(customerId).toBeTruthy();

    await stripe.subscriptions.update(subscriptionId as string, {
      trial_end: 'now'
    });

    await page.waitForTimeout(2000)
    await page.reload();

    const status = await page.locator('#subscription-status');
    await expect(status).toContainText('past_due');
  });

  test('Cancel a subscription and reflect status on page:2.2', async ({ page, request }) => {
    test.setTimeout(60 * 1000);
    await login(page);
    await page.locator('#monthly-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload();
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    const priceId = await page.locator('[data-monthly-price-id]').getAttribute('data-monthly-price-id');
    await expect(priceId).toBeTruthy();
    const customerId = await page.locator('[data-customer-id]').getAttribute('data-customer-id');
    await expect(customerId).toBeTruthy();
    // check billing portal configuration
    const data = { priceType: 'monthly' };
    const billingPortalResponse = await serverRequest(request, 'POST', `users/portal?user_id=${customerId}`, data);
    await expect(billingPortalResponse).toBeTruthy();
    await expect(billingPortalResponse.configuration).toBeTruthy();
    const billingPortalConfigurationId = billingPortalResponse.configuration;
    await validatebillingPortalConfiguration(request, billingPortalConfigurationId);
    //check the cancel flow
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

  test('Verify Webhook Signature Implementation:2.3', async ({ page, request }) => {
    const data = await createStripeWebhookPayload();
    const fakeWebhookSignature = 'incorrect_webhook_signature';
    const headers = {
      'Stripe-Signature': fakeWebhookSignature,
      'Content-Type': 'application/json',
    };
    const webhookResponse = await serverRequest(request, 'POST', `webhook`, data, 3600, headers);
    const errorMessage = await webhookResponse.error.message;
    await expect(errorMessage).toEqual('Unable to extract timestamp and signatures from header');
  });
});
