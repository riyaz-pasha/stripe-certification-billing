import { expect } from '@playwright/test';
import { assert } from 'console';
import dotenv from 'dotenv';
import { stripeRequest } from './api';
dotenv.config({ path: '../server/.env' });

const CHALLENGE_ID = process.env.CHALLENGE_ID;

export const validateSubscription = async (request, subscriptionId, priceId) => {
  const subscriptionResponse = await stripeRequest(request, 'GET', `subscriptions/${subscriptionId}`);
  await expect(subscriptionResponse).toBeTruthy();
  await expect(subscriptionResponse.items).toBeTruthy();
  let foundPriceId = false;
    for (const subscriptionItem of await subscriptionResponse.items.data) {
      await expect(subscriptionItem).toBeTruthy();
      if (subscriptionItem.price.id === priceId) {
        foundPriceId = true;
      }
    }
  await assert(foundPriceId, true, "Could not Retrieve Subscription Item for Monthly Price.");
  await expect(subscriptionResponse.trial_end != null).toBe(true, '3 day Trial not set');
  await expect(await subscriptionResponse.metadata.challenge_id).toBe(CHALLENGE_ID, `Could not find challenge_id in metadata of Subscription.`);
};

export const validateUsageRecord = async (request, subscriptionId, priceId) => {
    const subscriptionResponse = await stripeRequest(request, 'GET', `subscriptions/${subscriptionId}`);
    await expect(subscriptionResponse).toBeTruthy();
    await expect(subscriptionResponse.items).toBeTruthy();
    let subscriptionItemId = 0;
    for (const subscriptionItem of await subscriptionResponse.items.data) {
      await expect(subscriptionItem).toBeTruthy();
      if (subscriptionItem.price.id === priceId) {
        subscriptionItemId = subscriptionItem.id;
      }
    }
    let totalUsage = 0;
    const usageRecords = await stripeRequest(request, 'GET', `subscription_items/${subscriptionItemId}/usage_record_summaries`);
    await expect(usageRecords).toBeTruthy();
    for (const usageItem of await usageRecords.data) {
        totalUsage = usageItem.total_usage;
    }
    await expect(totalUsage).toEqual(1);
};
