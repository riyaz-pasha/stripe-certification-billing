import DataStore from "./datastore.js";

const BASE_URL = `${process.env.HOSTNAME}:${process.env.PORT}`;

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export function UserService() {
  /**
   * TODO M1: Create User and corresponding Stripe Customer, but only if
   * another user isn't using the same email address, then store it in the
   * cache and return the User. If a payment method is provided, that
   * should automatically used for invoices.
   *
   * @param {string} email - User's email. Uniqueness is enforced.
   * @param {string} [paymentMethod] - Optional Payment Method id.
   * @returns {Object} User - New User object.
   * @property {string} user.id - User ID
   * @property {string} user.email - User email
   * @property {Object} [user.subscription] - Subscription details
   * @property {string} user.subscription.id - Stripe Subscription ID
   * @property {string} user.subscription.status - Stripe Subscription status
   * @property {string} user.subscription.type - Billing type: either "monthly" or "ondemand"
   */
  async function create(email, paymentMethod = null) {
    try {
      let user = null;
      let customer = null;
      const response = await stripe.customers.list({
        email: email,
        limit: 1,
      })
      if (response.data.length) customer = response.data[0]
      else {
        customer = await stripe.customers.create({
          email: email,
          metadata: {
            challenge_id: process.env.CHALLENGE_ID,
          },
          ...paymentMethod && { payment_method: paymentMethod },
        })
      }

      user = {
        id: customer.id,
        email: customer.email,
        subscription: undefined,
      }
      if (user) DataStore.saveUser(user);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Accepts a Stripe Subscription object and saves its key
   * details onto our stored User object under the subscription key.
   * Returns the updated user object.
   * @param {Stripe.Subscription} subscription
   * @returns {Object} User - Updated User object.
   */
  function saveSubscription(subscription) {
    const pairCodeConfig = DataStore.getPairCodeConfig();
    const user = DataStore.findUserById(subscription.customer);

    let subscriptionType;

    subscription.items.data.find((item) => {
      switch (item.price.id) {
        case pairCodeConfig.monthlyPrice.id:
          subscriptionType = "monthly";
          break;
        case pairCodeConfig.onDemandPrice.id:
          subscriptionType = "ondemand";
          break;
        default:
          throw new Error("Subscription type not found");
      }
    });

    user.subscription = {
      id: subscription.id,
      status: subscription.status,
      type: subscriptionType,
    };

    DataStore.saveUser(user);
    return user;
  }

  /**
   * TODO M2: Search the last 100 Customer Portal Configurations in
   * Stripe to see if one already exists which satisfies the
   * requirements from Milestone 2.  If a valid configuration
   * doesn't exist, then create one.  Finally, save the
   * configuration ID and return it.
   *
   * @returns {string} Customer Portal Configuration ID
   */
  async function setupPortalConfig() {
    let portalConfigurationId = null;
    const PORTAL_HEADLINE = "/dev/chat";

    let portalConfig = await findPortalConfig(PORTAL_HEADLINE);
    if (!portalConfig) {
      portalConfig = await createPortalConfig(PORTAL_HEADLINE);
    }

    portalConfigurationId = portalConfig.id;

    DataStore.savePortalConfig(portalConfigurationId);
    return portalConfigurationId;
  }

  async function findPortalConfig(businessProfileHeadline) {
    const portalConfigs = await stripe.billingPortal.configurations.list({ limit: 100 });
    return portalConfigs.data.find(config =>
      config.business_profile?.headline === businessProfileHeadline &&
      config.metadata?.challenge_id === process.env.CHALLENGE_ID
    );
  }

  async function createPortalConfig(businessProfileHeadline) {
    return await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: businessProfileHeadline,
      },
      metadata: {
        challenge_id: process.env.CHALLENGE_ID,
      },
      features: {
        payment_method_update: { enabled: true, },
        invoice_history: { enabled: true, },
        subscription_cancel: { enabled: true, mode: "immediately", },
      },
    });
  }

  /**
   * TODO M2: Given a user ID, create a Customer Portal session and
   * return the URL so the user can be redirected to it.
   *
   * @param {string} userId
   * @returns JSON include {url: session.url, configuration: session.configuration}
   */
  async function getPortalLink(userId) {
    const result = { url: null, configuration: null };
    const portalConfigurationId = await setupPortalConfig();

    const session = await stripe.billingPortal.sessions.create({
      customer: userId,
      configuration: portalConfigurationId,
      return_url: `${process.env.HOSTNAME}:${process.env.PORT}/dashboard`,
    });

    result.url = session.url;
    result.configuration = session.configuration;

    return result;
  }

  return {
    create,
    saveSubscription,
    setupPortalConfig,
    getPortalLink,
  };
}

// Calling so we can return an object with the functions
export default UserService();
