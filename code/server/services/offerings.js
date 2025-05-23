import Stripe from "stripe";
import DataStore from "./datastore.js";
import UserService from "./users.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CHALLENGE_ID = process.env.CHALLENGE_ID;
const BASE_URL = `${process.env.HOSTNAME}:${process.env.PORT}`;

// TODO M1: Write helper methods for finding products & prices
//
// Hint: List endpoints are immediately consistent, whereas
//       Search endpoints can take up to 60 seconds to reflect
//       newly created objects.
//
// Learn more: https://stripe.com/docs/search#data-freshness

async function findStripeProduct(productUrl) {
  let product = null;
  const response = await stripe.products.list({
    url: productUrl,
    limit: 1,
  });
  if (response?.data?.length) product = response.data[0];
  return product;
}

async function findStripePrice(lookupKey) {
  let price = null;
  const response = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
  })
  if (response?.data?.length) price = response.data[0];
  return price;
}

async function createProduct(name, url, unitLabel) {
  return stripe.products.create({
    name: name,
    url: url,
    unit_label: unitLabel,
    metadata: {
      challenge_id: process.env.CHALLENGE_ID,
    },
  })
}

async function createPrice(productId, unitAmount, nickname, lookupKey) {
  return stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: unitAmount,
    lookup_key: lookupKey,
    nickname: nickname,
    metadata: {
      challenge_id: process.env.CHALLENGE_ID,
    },
    recurring: {
      interval: "month",
      interval_count: 1,
      trial_period_days: 3,
      usage_type: "licensed",
    },
    transfer_lookup_key: true,
  })
}
/**
 * TODO M1: Set up the Pair Coding product and monthly price
 * on Stripe. First, check whether a correctly configured product
 * already exists. If not, or if there's no correct price, then
 * create them both.
 *
 * Hint: You can filter products by URL, and prices by lookup_key.
 *       If you accidentally misconfigured a price, you can use the
 *       `transfer_lookup_key` parameter to use that lookup_key for
 *       the new price.
 *
 * TODO M2: Set up the price for on-demand Pair Coding sessions.
 */
export async function setupPairCodeConfig() {

  // TODO M1: Check Stripe to see if there's already a product
  // and price satisfying our specifications. If not, create them.
  const PAIRCODE_PRODUCT_NAME = "/dev/chat Pair Coding";
  const PAIRCODE_PRODUCT_URL = `https://devchat.stripe/paircode/${CHALLENGE_ID}`;
  const PAIRCODE_PRODUCT_UNIT_LABEL = "session";

  const PAIRCODE_MONTHLY_LOOKUP_KEY = `devchat_paircode_monthly_${CHALLENGE_ID}`;
  const PAIRCODE_MONTHLY_NICKNAME = "/dev/chat Pair Coding Monthly";
  const PAIRCODE_MONTHLY_COST = 6000;

  let product = await findStripeProduct(PAIRCODE_PRODUCT_URL);
  let price;
  if (!product) {
    product = await createProduct(PAIRCODE_PRODUCT_NAME, PAIRCODE_PRODUCT_URL, PAIRCODE_PRODUCT_UNIT_LABEL);
    price = await createPrice(product.id, PAIRCODE_MONTHLY_COST, PAIRCODE_MONTHLY_NICKNAME, PAIRCODE_MONTHLY_LOOKUP_KEY);
  } else {
    price = await findStripePrice(PAIRCODE_MONTHLY_LOOKUP_KEY);
    if (!price) {
      price = await createPrice(product.id, PAIRCODE_MONTHLY_COST, PAIRCODE_MONTHLY_NICKNAME, PAIRCODE_MONTHLY_LOOKUP_KEY);
    }
  }

  const monthlyPrice = {
    id: price.id,
    nickname: price.nickname,
    currency: price.currency,
    unit_amount: price.unit_amount,
    lookup_key: price.lookup_key,
  }


  // TODO M2: Create the price for on-demand pair coding sessions,
  // add it onto the config object, and save it.
  const PAIRCODE_ONDEMAND_LOOKUP_KEY = `devchat_paircode_ondemand_${CHALLENGE_ID}`;
  const PAIRCODE_ONDEMAND_NICKNAME = "/dev/chat Pair Coding On-Demand";
  const PAIRCODE_ONDEMAND_COST = 8000;

  const pairCodeConfig = {
    productId: product.id,
    productName: product.name,
    monthlyPrice: monthlyPrice,
    onDemandPrice: undefined,
  };
  DataStore.savePairCodeConfig(pairCodeConfig);
}

/**
 * TODO M1: Start a subscription for the given user with the given price
 * by sending them to a Checkout Session.  Make sure to follow all of the
 * requirements from the Milestone brief.
 *
 * Hint: When the user is redirected back to your app, the client will be
 *       looking for a query parameter named "session_id".
 *
 * @param {*} userId
 * @param {*} priceId
 * @returns { url: checkoutSessionUrl }
 */
export async function startSubscription(userId, priceId) {
  const result = { url: null };
  const pairCodeConfig = DataStore.getPairCodeConfig();
  if (pairCodeConfig.monthlyPrice.id === priceId || pairCodeConfig.onDemandPrice.id === priceId) {
    const subscription = await stripe.checkout.sessions.create({
      customer: userId,
      mode: 'subscription',
      payment_method_types: ["card"],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          challenge_id: process.env.CHALLENGE_ID,
        },
      },
      success_url: `${process.env.HOSTNAME}:${process.env.PORT}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.HOSTNAME}:${process.env.PORT}/dashboard`,
    });
    result.url = subscription.url;
  }

  return result;
}

/**
 * TODO M1: Given a Checkout Session ID, check to see if it corresponds
 * to a new subscription.  If so, return the subscription object.  This
 * is called by the GET /users route if it receives a session_id query param.
 *
 * @param {string} sessionId
 * @returns Stripe.Subscription || null
 */
export async function findSubscriptionFromCheckoutSession(sessionId) {
  let subscription = null;
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription']
  });
  if (session.mode === 'subscription') {
    subscription = session.subscription;
  }
  return subscription;
}

/**
 * TODO M3: Given the ID of a user, create a usage record to represent
 * their request for an on-demand pair coding session, then
 * return the usage record's Stripe ID.
 *
 * @param {string} userId
 * @returns {string} Stripe ID of the usage record
 */
export async function requestPairCode(userId) {
  let usageRecordId = null;
  const user = DataStore.findUserById(userId);
  const pairCode = DataStore.getPairCodeConfig();

  if (!user) throw new Error("No User exists");


  return usageRecordId;
}

/**
 * TODO M4: Set up the Workshop product and its non-recurring price
 * based on the requirements included in the milestone brief.  First,
 * check to see if there's already a Stripe product and price satisfying
 * our given requirements.  If not, create them both, add their details
 * to workshopConfig, and save them.
 */
export async function setupWorkshopConfig() {
  const WORKSHOP_PRODUCT_NAME = "/dev/chat Workshop";
  const WORKSHOP_PRODUCT_URL = `https://devchat.stripe/workshop/${CHALLENGE_ID}`;
  const WORKSHOP_PRODUCT_UNIT_LABEL = "attendee";

  const WORKSHOP_PRICE_LOOKUP_KEY = `devchat_workshop_${CHALLENGE_ID}`;
  const WORKSHOP_PRICE_NICKNAME = "/dev/chat Workshop";
  const WORKSHOP_PRICE_COST = 8000;

  const workshopConfig = {};


  DataStore.saveWorkshopConfig(workshopConfig);
}

/**
 * TODO M4: Given the ID of a user and a number of attendees, add
 * an item onto their subscription's next invoice representing a
 * multi-developer training workshop.  Update our cached copy of
 * their subscription and then return the subscription's ID.
 *
 * @param {string} userId
 * @param {number} attendees
 * @returns { subscription: subscription.id }
 */
export async function requestWorkshop(userId, attendees = 1) {
  const result = { subscription: null };
  const workshopConfig = DataStore.getWorkshopConfig();
  const user = DataStore.findUserById(userId);
  if (!user) throw new Error("No such user exists!");


  return result;
}

export const OfferingsService = {
  setupPairCodeConfig,
  startSubscription,
  findSubscriptionFromCheckoutSession,
  requestPairCode,
  setupWorkshopConfig,
  requestWorkshop,
};
export default OfferingsService;
