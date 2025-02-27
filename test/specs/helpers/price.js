import { expect } from "@playwright/test";
import dotenv from "dotenv";
import { stripeRequest } from "./api";
dotenv.config({ path: "../server/.env" });
const CHALLENGE_ID = process.env.CHALLENGE_ID;

export const validatePrice = async (
  request,
  priceId,
  lookupKeyMatch,
  priceAmount
) => {
  const stripeResponse = await stripeRequest(
    request,
    "GET",
    `prices/${priceId}`
  );
  await expect(stripeResponse.id).toBeTruthy();
  await expect(priceId).toEqual(stripeResponse.id);
  await expect(stripeResponse.lookup_key).toContain(lookupKeyMatch);
  await expect(priceAmount).toEqual(stripeResponse.unit_amount);
  await expect(stripeResponse.metadata.challenge_id).toBe(
    CHALLENGE_ID,
    `Could not find challenge_id (${CHALLENGE_ID}) in Price metadata.`
  );
  const productId = await stripeResponse.product;
  await validateProduct(request, productId);
};

export const validateProduct = async (request, productId) => {
  const stripeResponse = await stripeRequest(
    request,
    "GET",
    `products/${productId}`
  );
  await expect(stripeResponse.id).toBeTruthy();
  await expect(productId).toEqual(stripeResponse.id);
  await expect(stripeResponse.metadata.challenge_id).toBe(
    CHALLENGE_ID,
    `Could not find challenge_id (${CHALLENGE_ID}) in Product metadata.`
  );
};
