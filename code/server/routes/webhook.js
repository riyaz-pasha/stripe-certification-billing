import { Router, raw } from "express";
import UserService from "../services/users.js";
const router = Router();

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * TODO M2: Sync subscription status via webhook events
 * Handle subscription creation, update and delete events to update
 * our stored user subscription status via the saveSubscription
 * method on the user service.
 *
 * Hint: The Users service already has a method to save a
 * subscription onto our record of the user who owns it.
 *
 * @param {request} request
 * @param {response} 200 JSON response including {received: true}
 */
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  async (request, response) => {
    try {
      const payload = request.body;
      const signature = request.headers["stripe-signature"];
      if (!webhookSecret) throw new Error("Webhook secret required");

      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await UserService.saveSubscription(event.data.object);
          break;

        default:
          break;
      }
      response.json({ received: true });
    } catch (error) {
      response.status(400).json({ error: { message: error.message } });
    }
  }
);

export default router;
