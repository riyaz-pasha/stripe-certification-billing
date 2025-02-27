# Milestone 1: Basic monthly subscription

My baseline service will be a $60 per month subscription for a single pair coding session. This is the simplest offering to implement, and it’ll also give me the most predictability on my extra workload – each subscriber works out to 1 hour per month.  I need you to set up the recurring Price and then integrate Checkout so my users can subscribe. 


## Requirements

1. **Make the provisioning service set up my Stripe Product & Price**

    - When the app turns on, it should make sure there's a Stripe Product and Price for my once-per-month pair coding sessions.  If a Product & Price is found, then make sure its attributes match our requirements here.  If they aren't found, then create them.
    - There's already a method laid out for setting it up in the Offerings service, you just need to complete it. The names, amounts, and URLs are already set up as constants in the method, you just need to write the API calls to put them in Stripe.
    - The label for a given unit should be "session".
    - All Products & Prices should include the `challenge_id` in the metadata.
    - _Hint: If you need to create a new Price but want to preserve the same lookup key, try the [`transfer_lookup_key`](https://stripe.com/docs/api/prices/create#create_price-transfer_lookup_key) parameter._

<br />

2. **Make the User service set up a Stripe Customer**

    - There’s already a `POST /users` route which will create a record in our cache, but it isn’t integrated with Stripe.  When a user signs up, we should create a Customer record for them.
    - The Customer record should include their email, and the metadata should include your `challenge_id`.
    - The `GET /users` route should check query parameters to see if the customer has any existing subscriptions, and if so, pass the subscription to the user service's `saveSubscription` method so that it’s stored on the user record.

<br />

3. **Enable monthly subscriptions through Checkout**

    - When a user clicks the button for a basic Subscription, it will send a request to the `POST /offerings/paircode` endpoint.  You need to make that endpoint create a Checkout Session and then redirect the user to its URL.  
    - The Session should:
      - Use the monthly Price you created in the provisioning script, only allowing the user to subscribe for 1 pair code per month.
      - Set up a 3-day trial so users can try one sample session with me before they start paying.  Make sure that the user provides a payment method before getting started, that way we're ready to charge them at the end of the trial.
      - Redirect the user back to the /dev/chat Dashboard, including the Checkout Session ID in the URL.
      - Ensure that the subscription it creates includes the `challenge_id` in its metadata.


_The milestones in this challenge will mostly require changes on the server-side, the client is already implemented.  Search for TODOs to help guide your way._

_Test locally by [setting up Playwright](/test/README.md), starting your application's client and server, and then running `npx playwright test ./specs/milestone1.spec.ts` in the repo's `./test` directory._