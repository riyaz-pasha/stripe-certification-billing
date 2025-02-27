import { expect } from '@playwright/test';
import dotenv from 'dotenv';
import { stripeRequest } from './api';
dotenv.config({ path: '../server/.env' });
const CHALLENGE_ID = process.env.CHALLENGE_ID;

export const validatebillingPortalConfiguration = async (request, billingPortalConfigurationId) => {
  const billingPortalResponse = await stripeRequest(request, 'GET', `billing_portal/configurations/${billingPortalConfigurationId}`);
  await expect(billingPortalResponse).toBeTruthy();
  await expect(billingPortalResponse.business_profile.headline).toBe('/dev/chat', 'The business headline is not /dev/chat.');
  await expect(billingPortalResponse.metadata.challenge_id).toBe(CHALLENGE_ID, `Could not find challenge_id in metadata of Portal Configuration.`);
  await expect(billingPortalResponse.features.subscription_cancel.enabled).toBe(true, 'Customers should be able to cancel the subscription.');
  await expect(billingPortalResponse.features.subscription_cancel.mode).toBe('immediately', 'Customers should be able to immediately cancel the subscription.');
  await expect(billingPortalResponse.features.invoice_history.enabled).toBe(true, 'Customers should be able to view past invoices.');
  await expect(billingPortalResponse.features.payment_method_update.enabled).toBe(true, 'Customers should be able to update their payment info.');
};
