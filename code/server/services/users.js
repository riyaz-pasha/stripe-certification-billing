import DataStore from "./datastore";

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


    DataStore.savePortalConfig(portalConfigurationId);
    return portalConfigurationId;
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
