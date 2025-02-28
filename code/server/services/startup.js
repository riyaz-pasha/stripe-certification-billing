import DataStore from "./datastore.js";
import UserService from "./users.js";
import OfferingsService from "./offerings.js";

/**
 * This function runs when the server starts up and calls the
 * relevant setup functions for provisioning Stripe Products,
 * Prices, and a Customer Portal Configuration.
 */
export async function onStartup() {
  try {
    // Clear in-memory cache
    DataStore.reset();

    // Call all object setup functions
    await UserService.setupPortalConfig();
    await OfferingsService.setupPairCodeConfig();
    await OfferingsService.setupWorkshopConfig();
  } catch (error) {
    throw new Error(`Provisioning error during startup: ${error}`);
  }
}

export default onStartup;
