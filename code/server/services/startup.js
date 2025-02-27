import DataStore from "./datastore";
import UserService from "./users";
import OfferingsService from "./offerings";

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
