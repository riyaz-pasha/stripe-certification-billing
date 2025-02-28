import { Router } from "express";
import { body } from "express-validator";
import asyncHandler from "express-async-handler";

import UsersService from "../services/users.js";
import OfferingsService from "../services/offerings.js";
import DataStore from "../services/datastore.js";

const router = Router();

/**
 * Retrieves the details about a given user by checking
 * for a user_id query parameter.  This will be automatically
 * plugged in by the client's axios helper.  Returns the user
 * object, whose shape is defined in the service and the DataStore.
 *
 * @param {request} request
 * @param {response} response A JSON including {user: UserRecord}
 */
router.get(
  "/users",
  asyncHandler(async (request, response) => {
    const userId = request.query.user_id;
    const user = DataStore.findUserById(userId);
    if (!user) throw new Error("No User exists");

    const sessionId = request.query.session_id;
    if (sessionId && sessionId.trim().length > 0) {
      const subscription =
        await OfferingsService.findSubscriptionFromCheckoutSession(sessionId);
      UsersService.saveSubscription(subscription);
    }

    response.json({ user });
  })
);

/**
 * Idempotent endpoint for creating a user; checks to see if we
 * already have one for the given email, and creates one using the
 * UserService if we don't.
 *
 * @param {request} request
 * @param {response} response A JSON including {user: UserRecord}
 */
router.post(
  "/users",
  body("email").isEmail().normalizeEmail(),
  asyncHandler(async (request, response) => {
    const email = request.body.email;
    let user = DataStore.findUserByEmail(email);
    if (!user) {
      user = await UsersService.create(email);
    }
    response.send(user);
  })
);

/**
 * Produces a link to send the user to the Stripe Customer Portal,
 * where they can update their payment information or cancel their
 * subscription.
 *
 * @param {request} request
 * @param {response} response A JSON including {url: session.url, configuration: session.configuration}
 */
router.post(
  "/users/portal",
  asyncHandler(async (request, response) => {
    const userId = request.query.user_id;
    const result = await UsersService.getPortalLink(userId);
    response.json(result);
  })
);

export default router;
