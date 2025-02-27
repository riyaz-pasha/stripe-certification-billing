import { Router } from "express";
import { body } from "express-validator";
import asyncHandler from "express-async-handler";

import DataStore from "../services/datastore";
import OfferingsService from "../services/offerings";

const router = Router();

/**
 * Retrieves the details about our pair code and workshop offerings so
 * the client can list the appropriate costs and include the right priceId
 * in requests to start a subscription.
 *
 * The values from the DataStore will be empty until you finish implementing
 * the setup methods in the Offerings service.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - A JSON including {pairCode: pairCodeConfig, workshop: workshopConfig}
 *
 */
router.get("/offerings", async (request, response) => {
  response.json({
    pairCode: DataStore.getPairCodeConfig(),
    workshop: DataStore.getWorkshopConfig(),
  });
});

/**
 * Help the user start their subscription by sending them to a Checkout Session.
 *
 * @param {request} request
 * @param {response} response A JSON including {url: session.url}
 */
router.post(
  "/offerings/paircode",
  body("price").exists(),
  asyncHandler(async (request, response) => {
    const userId = request.query.user_id;
    const priceId = request.body.price;
    const result = await OfferingsService.startSubscription(userId, priceId);
    response.json(result);
  })
);

/**
 * Record the user's request for an on-demand pair coding session.
 *
 * @param {request} request
 * @param {response} response A JSON including {usageRecord: usageRecord.id}
 */
router.post(
  "/offerings/paircode/schedule",
  asyncHandler(async (request, response) => {
    const userId = request.query.user_id;
    const usageRecord = await OfferingsService.requestPairCode(userId);
    return response.json({ usageRecord: usageRecord.id });
  })
);

/**
 * Add a one-time fee for the user's multi-developer workshop onto their
 * subscription's next invoice.
 *
 * @param {request} request
 * @param {response} response A JSON including {subscription: subscription.id}
 */
router.post(
  "/offerings/workshop",
  asyncHandler(async (request, response) => {
    const userId = request.query.user_id;
    const attendees = request.body.attendees;
    const result = await OfferingsService.requestWorkshop(userId, attendees);
    response.json(result);
  })
);

export default router;
