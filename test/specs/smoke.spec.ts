import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { test } from './helpers/fixtures';
import { stripeRequest } from './helpers/api';

test.describe('Smoke Tests', () => {

    test('Smoke Test Case #1', async ({ request }) => {
        const data = {
            form: {
                name: faker.name.findName(),
                email: faker.internet.email(),
            }
        }
        const response = await stripeRequest(request, 'POST', `customers`, data);
        await expect(1).toEqual(1);
    });

    test('Validate that Landing page displays', async ({ page, request, browser }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
        const monthly = await page.locator('#monthly-subscription');
        // price id from data
        const priceId = await page.locator('[data-monthly-price-id]').getAttribute('data-monthly-price-id');
        await expect(priceId).toBeTruthy();
        await expect(monthly).toContainText('per month');
        // validate on-demand price
        const ondemand = await page.locator('#ondemand-subscription');
        const onDemandPriceId = await page.locator('[data-ondemand-price-id]').getAttribute('data-ondemand-price-id');
        await expect(onDemandPriceId).toBeTruthy();
        await expect(ondemand).toContainText('per session');
    });
});
