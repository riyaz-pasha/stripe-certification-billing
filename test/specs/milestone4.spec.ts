import { expect } from '@playwright/test';
import { test } from './helpers/fixtures';
import { stripeRequest } from './helpers/api';
import checkout from './helpers/checkout';
import login from './helpers/login';
const CHALLENGE_ID = process.env.CHALLENGE_ID;

test.describe('Milestone 4', () => {
  // add test to validate the one-time price for non-recurring
  test('Create the Price for non-recurring multi-dev workshops:4.1', async ({ page, request, browser }) => {
    const workshopLesson = '80 USD per session';
    await login(page);
    await page.locator('#ondemand-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle' });
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();
    // Validate price
    const priceId = await page.locator('[data-workshop-price-id]').getAttribute('data-workshop-price-id');
    const priceObj = await stripeRequest(request, 'GET', `prices/${priceId}`);
    await expect(priceObj.id).toBeTruthy();
    await expect(priceObj.unit_amount).toEqual(8000);
    await expect(priceObj.lookup_key).toContain('devchat_workshop_');
    await expect(priceObj.type).toEqual('one_time');
    await expect(priceObj.metadata.challenge_id).toBe(CHALLENGE_ID);
    const productId = await priceObj.product;
    // Validate Product
    const productObj = await stripeRequest(request, 'GET', `products/${productId}`);
    await expect(productObj.id).toBeTruthy();
    await expect(productObj.name).toEqual('/dev/chat Workshop');
    await expect(productObj.metadata.challenge_id).toBe(CHALLENGE_ID);
  });

  test('Create invoice item for a multi-dev workshop:4.2', async ({ page, request }) => {
    await login(page);
    await page.locator('#ondemand-subscription').click();
    await checkout(page);
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle' });
    // Get price Id
    const priceId = await page.locator('[data-workshop-price-id]').getAttribute('data-workshop-price-id');

    // Get Subscription Id
    const subscriptionId = await page.locator('[data-subscription-id]').getAttribute('data-subscription-id');
    await expect(subscriptionId).toBeTruthy();

    const numAttendees = 6;
    const attendeesInput = await page.locator('input[name="attendees"]');
    await attendeesInput.fill(numAttendees.toString());
    await page.locator('#register-workshop').click();
    const sessionRegistrationNotification = await page.locator('#workshop-notification');
    await expect(sessionRegistrationNotification).toHaveText('Workshop registered.');
    // Get Upcoming Invoice
    const upcomingInvoice = await stripeRequest(request, 'GET', `invoices/upcoming?subscription=${subscriptionId}`);
    await expect(upcomingInvoice).toBeTruthy();
    await expect(upcomingInvoice.lines.data).toBeTruthy();
    let invoiceItemQuantity = 0;
    let invoiceItemAmount = 0;
    // Find one_time invoice item
    for (const invoiceline of await upcomingInvoice.lines.data) {
      if(invoiceline.price.id === priceId) {
      invoiceItemQuantity = invoiceline.quantity;
      invoiceItemAmount = invoiceline.amount;
      }
    }
    await expect(invoiceItemQuantity).toBe(numAttendees);
    await expect(invoiceItemAmount).toBe(numAttendees * 8000);
  });
});
