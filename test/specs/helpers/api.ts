import { APIRequestContext } from "@playwright/test";

export const stripeRequest = async (request, method, route, data?, timeout?) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
  }

  const response = await request.fetch(`https://api.stripe.com/v1/${route}`, { headers, method, timeout });

  return await response.json();
}

export const serverRequest = async (request: APIRequestContext, method, route, data?, timeout?, headers?) => {
  const response = await request.fetch(`${process.env.DOMAIN}/${route}`, { data, method, timeout, headers });

  return await response.json();
}

export const createStripeWebhookPayload = async () => {
  const webhookPayload = {
    id: "evt_1O3kSBFVSFYfDb2QPzilwfYV",
    object: "event",
    api_version: "2022-11-15",
    created: 1697914997,
    data: {
      object: {
        id: "sub_1O3kS8FVSFYfDb2QJG6z7KCe",
        object: "subscription",
        application: null,
        application_fee_percent: null,
        automatic_tax: {
          enabled: false,
        },
        billing_cycle_anchor: 1697914996,
        billing_thresholds: null,
        cancel_at: null,
        cancel_at_period_end: false,
        canceled_at: null,
        cancellation_details: {
          comment: null,
          feedback: null,
          reason: null,
        },
        collection_method: "charge_automatically",
        created: 1697914996,
        currency: "usd",
        current_period_end: 1700593396,
        current_period_start: 1697914996,
        customer: "cus_OrTOPIKNxItZJc",
        days_until_due: null,
        default_payment_method: "pm_1O3kS6FVSFYfDb2QXiOcUJi2",
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        ended_at: null,
        items: {
          object: "list",
          data: [
            {
              id: "si_OrTOHhYSIJoRFF",
              object: "subscription_item",
              billing_thresholds: null,
              created: 1697914997,
              metadata: {},
              plan: {
                id: "price_1O2GmnFVSFYfDb2Q4n2KtRlf",
                object: "plan",
                active: true,
                aggregate_usage: null,
                amount: 8000,
                amount_decimal: "8000",
                billing_scheme: "per_unit",
                created: 1697562629,
                currency: "usd",
                interval: "month",
                interval_count: 1,
                livemode: false,
                metadata: {
                  challenge_id: "unique_challenge_id",
                },
                nickname: "/dev/chat On Demand",
                product: "prod_Opwgade8Sov45j",
                tiers_mode: null,
                transform_usage: null,
                trial_period_days: null,
                usage_type: "metered",
              },
              price: {
                id: "price_1O2GmnFVSFYfDb2Q4n2KtRlf",
                object: "price",
                active: true,
                billing_scheme: "per_unit",
                created: 1697562629,
                currency: "usd",
                custom_unit_amount: null,
                livemode: false,
                lookup_key: "devchat_ondemand_",
                metadata: {
                  challenge_id: "unique_challenge_id",
                },
                nickname: "/dev/chat On Demand",
                product: "prod_Opwgade8Sov45j",
                recurring: {
                  aggregate_usage: null,
                  interval: "month",
                  interval_count: 1,
                  trial_period_days: null,
                  usage_type: "metered",
                },
                tax_behavior: "unspecified",
                tiers_mode: null,
                transform_quantity: null,
                type: "recurring",
                unit_amount: 8000,
                unit_amount_decimal: "8000",
              },
              subscription: "sub_1O3kS8FVSFYfDb2QJG6z7KCe",
              tax_rates: [],
            },
          ],
          has_more: false,
          total_count: 1,
          url: "/v1/subscription_items?subscription=sub_1O3kS8FVSFYfDb2QJG6z7KCe",
        },
        latest_invoice: "in_1O3kS8FVSFYfDb2Q0UNKNvjA",
        livemode: false,
        metadata: {},
        next_pending_invoice_item_invoice: null,
        on_behalf_of: null,
        pause_collection: null,
        payment_settings: {
          payment_method_options: null,
          payment_method_types: null,
          save_default_payment_method: "off",
        },
        pending_invoice_item_interval: null,
        pending_setup_intent: null,
        pending_update: null,
        plan: {
          id: "price_1O2GmnFVSFYfDb2Q4n2KtRlf",
          object: "plan",
          active: true,
          aggregate_usage: null,
          amount: 8000,
          amount_decimal: "8000",
          billing_scheme: "per_unit",
          created: 1697562629,
          currency: "usd",
          interval: "month",
          interval_count: 1,
          livemode: false,
          metadata: {
            challenge_id: "unique_challenge_id",
          },
          nickname: "/dev/chat On Demand",
          product: "prod_Opwgade8Sov45j",
          tiers_mode: null,
          transform_usage: null,
          trial_period_days: null,
          usage_type: "metered",
        },
        quantity: 1,
        schedule: null,
        start_date: 1697914996,
        status: "active",
        test_clock: null,
        transfer_data: null,
        trial_end: null,
        trial_settings: {
          end_behavior: {
            missing_payment_method: "create_invoice",
          },
        },
        trial_start: null,
      },
    },
    livemode: false,
    pending_webhooks: 2,
    request: {
      id: null,
      idempotency_key: null,
    },
    type: "customer.subscription.created",
  };

  return webhookPayload;
}

