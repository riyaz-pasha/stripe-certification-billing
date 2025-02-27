"use strict";
import _ from "lodash";
import NodeCache from "node-cache";

const cache = new NodeCache();

/**
 * Simple in-memory key-value store for simulating a storage layer.
 * Includes methods for each piece of state required by the completed
 * application.  For the sake of the challenge, this can serve as
 * a stand-in for a database.  Implements all data storage and validation.
 */
const DataStore = {
  raw: cache,
  reset: function () {
    cache.flushAll();
    cache.set("users", {});
  },

  getUsers: function () {
    const storedUsers = cache.get("users");
    if (!storedUsers) {
      cache.set("users", {});
      return cache.get("users");
    }
    return storedUsers ? storedUsers : {};
  },

  /**
   * Retrieves a User by its ID from the cache.
   * If no such user is found, this method will return undefined.
   *
   * @param {string} id - ID of the User to retrieve
   * @returns {{
   *   id: string,
   *   email: string,
   *   subscription?: {
   *     id: string,
   *     status: string,
   *     type: "monthly" | "ondemand"
   *   }
   * }|undefined} - User object or undefined
   */
  findUserById: function (id) {
    const users = DataStore.getUsers();
    return users[id];
  },

  /**
   * Retrieves a User by its email from the cache.
   * If no such user is found, this method will return undefined.
   *
   * @param {string} email - Email of the User to retrieve
   * @returns {{
   *   id: string,
   *   email: string,
   *   subscription?: {
   *     id: string,
   *     status: string,
   *     type: "monthly" | "ondemand"
   *   }
   * }|undefined} - User object or undefined
   */
  findUserByEmail: function (email) {
    const users = DataStore.getUsers();
    return Object.values(users).find((user) => user.email === email);
  },

  /**
   * Stores a User in the cache, keyed by its ID.  You shouldn't
   * need to call this directly, as the User service has a create
   * method which should also set up a Stripe Customer. User object
   * always includes strings for email and id, and optionally includes
   * a subscription object with id, status, and type (either "monthly" or "ondemand").
   *
   * @param {Object} user - User object to store
   * @param {string} user.id - User ID
   * @param {string} user.email - User email
   * @param {Object} [user.subscription] - Subscription details
   * @param {string} user.subscription.id - Stripe Subscription ID
   * @param {string} user.subscription.status - Stripe Subscription status
   * @param {string} user.subscription.type - Billing type: either "monthly" or "ondemand"
   */
  saveUser: function (user) {
    const users = DataStore.getUsers();
    users[user.id] = user;
    cache.set("users", users);
  },

  /**
   * Retrieves the object representing the Stripe product & price
   * for our pair coding offering.
   *
   * If the product and price configuration haven't been saved to
   * the cache, then this method will return null.
   *
   *  @returns {{
   *   productId: string,
   *   productName: string,
   *   monthlyPrice: {
   *     id: string,
   *     nickname: string,
   *     currency: string,
   *     unit_amount: number,
   *     lookup_key: string
   *   },
   *   onDemandPrice?: {
   *     id: string,
   *     nickname: string,
   *     currency: string,
   *     unit_amount: number,
   *     lookup_key: string
   *   }
   * }|null}
   * - The pair code configuration object. Returns null if no configuration was found.
   */
  getPairCodeConfig: function () {
    const cached_config = cache.get("pair_code_configuration");

    const pairConfig = cached_config || null;
    return pairConfig;
  },

  /**
   * Accepts an object representing the Stripe product & price
   * for our pair coding offering, and persists it in the cache.
   * Milestone 1 only requires implementing the monthly price; the
   * on-demand price object can be undefined until you
   * reach Milestone 3.
   *
   * @param {Object} pairConfig - The pair code configuration object.
   * @param {string} pairConfig.productId
   * @param {string} pairConfig.productName
   * @param {Object} pairConfig.monthlyPrice
   * @param {string} pairConfig.monthlyPrice.id
   * @param {string} pairConfig.monthlyPrice.nickname
   * @param {string} pairConfig.monthlyPrice.currency
   * @param {number} pairConfig.monthlyPrice.unit_amount
   * @param {string} pairConfig.monthlyPrice.lookup_key
   * @param {Object} [pairConfig.onDemandPrice] - Implement this in Milestone 3
   * @param {string} pairConfig.onDemandPrice.id
   * @param {string} pairConfig.onDemandPrice.nickname
   * @param {string} pairConfig.onDemandPrice.currency
   * @param {number} pairConfig.onDemandPrice.unit_amount
   * @param {string} pairConfig.onDemandPrice.lookup_key
   */
  savePairCodeConfig: function (pairConfig) {
    const milestone1Keys = [
      "productId",
      "productName",
      "monthlyPrice",
      "monthlyPrice.id",
      "monthlyPrice.nickname",
      "monthlyPrice.currency",
      "monthlyPrice.unit_amount",
      "monthlyPrice.lookup_key",
    ];
    const milestone3Keys = [
      "onDemandPrice",
      "onDemandPrice.id",
      "onDemandPrice.nickname",
      "onDemandPrice.currency",
      "onDemandPrice.unit_amount",
      "onDemandPrice.lookup_key",
    ];
    if (Object.keys(pairConfig).length > 0) {
      milestone1Keys.forEach((key) => {
        if (!_.get(pairConfig, key)) {
          throw new Error(`Missing required key ${key} in pair code config`);
        }
      });
    }
    if (pairConfig.onDemandPrice) {
      milestone3Keys.forEach((key) => {
        if (!_.get(pairConfig, key)) {
          throw new Error(`Missing required key ${key} in pair code config`);
        }
      });
    }
    cache.set("pair_code_configuration", pairConfig);
  },

  /**
   * Retrieve the Stripe ID of the Customer Portal configuration
   * @returns {string} Stripe ID of the Customer Portal configuration
   */
  getPortalConfig: function () {
    return cache.get("portal_configuration");
  },

  /**
   * Accepts the Stripe ID of the Customer Portal configuration
   * and persists it in the cache.
   * @param {string} configId ID of the Customer Portal configuration */
  savePortalConfig: function (configId) {
    return cache.set("portal_configuration", configId);
  },

  /**
   * Retrieves the object representing the workshop offering's
   * Stripe product & price from the cache.
   *
   * If the product & price haven't been set up yet, then this
   * method will return null.
   *
   * @returns {{
   *   productId: string,
   *   productName: string,
   *   perSeatPrice: {
   *     id: string,
   *     nickname: string,
   *     currency: string,
   *     unit_amount: number,
   *     lookup_key: string
   *   }
   * }|null} workshopConfig - The workshop configuration object or null.
   */
  getWorkshopConfig: function () {
    return cache.get("workshop_configuration") || null;
  },

  /**
   * Accepts an object representing the Stripe product & price
   * for our workshop offering, and persists it in the cache.
   *
   * @param {Object} workshopConfig - The workshop configuration object.
   * @param {string} workshopConfig.productId
   * @param {string} workshopConfig.productName
   * @param {Object} workshopConfig.perSeatPrice
   * @param {string} workshopConfig.perSeatPrice.id
   * @param {string} workshopConfig.perSeatPrice.nickname
   * @param {string} workshopConfig.perSeatPrice.currency
   * @param {number} workshopConfig.perSeatPrice.unit_amount
   * @param {string} workshopConfig.perSeatPrice.lookup_key
   */
  saveWorkshopConfig: function (workshopConfig) {
    const requiredKeys = [
      "productId",
      "productName",
      "perSeatPrice",
      "perSeatPrice.id",
      "perSeatPrice.nickname",
      "perSeatPrice.currency",
      "perSeatPrice.unit_amount",
      "perSeatPrice.lookup_key",
    ];
    if (Object.keys(workshopConfig).length > 0) {
      requiredKeys.forEach((key) => {
        if (!_.get(workshopConfig, key)) {
          throw new Error(`Missing required key ${key} in workshop config`);
        }
      });
    }
    cache.set("workshop_configuration", workshopConfig);
  },
};

export default DataStore;
