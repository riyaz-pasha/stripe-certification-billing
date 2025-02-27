# Milestone 2: Handle cancellations & declines

Now that my young business has subscribers, I need to handle the issues caused by collecting recurring payments. The two most important ones are:

- Letting the user cancel their subscription
- Detecting a failed payment so I cancel their next session

Stripe’s Customer Portal gives me an easy subscription management interface out of the box, but my app still needs to respond to that event.  I need you to set up the webhook listener so I can respond accordingly.  Given that the app isn't hosted anywhere yet, you should use the Stripe CLI to send webhook events to your dev server. 


## Requirements

1. **Make the provisioning service set up my Customer Portal**

    - Before we can send someone to the Customer Portal, we need to configure how it will work.  Please expand the provisioning service to now also create a portal configuration where:
        - The business headline is /dev/chat – no other business info required for now.
        - Customers can update their payment info, view past invoices, and cancel the subscription.
        - Include your `challenge_id` in the metadata.
        - _Hint: Search through the most recent 100 configurations.  If you find a Customer Portal configuration which already includes your `challenge_id`, make sure that its attributes match our requirements.  If they don't, you can update it.  If one isn't found, then create a new one._

<br />

2. **Redirect to the Customer Portal when users click "Manage subscription"**

    - After the portal configuration exists, we can start sending people there.  The button should already be hooked up to the  `POST /users/portal` endpoint, please complete that implementation so it creates a Customer Portal Session and then redirects the user to that URL.  The session’s return URL should send users back to the /dev/chat dashboard.

<br />

3. **Use webhook events to update our cached subscription data**

    - The Customer Portal will let people cancel their subscription, which I need to know so I stop doing pair coding sessions with them.  Using the Stripe CLI to forward webhook events to the `POST /webhook` endpoint, please sync the cached subscription state with any events sent by Stripe.  I started a `saveSubscription` handler on the user service which should help!
    - Make sure that the subscription ends immediately when they cancel, I don't want to wait for their month to run out.
    - If your implementation is behaving, I’d expect to see the subscription state reflected on the logged-in dashboard.
    - Make sure that the webhook events are actually coming from Stripe, we don't want somebody to trick us into thinking they've started a subscription when they haven't paid us.



_Make sure to pull before pushing, as we've made a small update to the README._

_Test locally by [setting up Playwright](/test/README.md), starting your application's client and server, and then running `npx playwright test ./specs/milestone2.spec.ts` in the repo's `./test` directory._