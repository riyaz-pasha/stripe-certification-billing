# Milestone 3: On-demand pair coding

Another offering I want to try is on-demand pair coding sessions for $80, where each session costs more because you didn't have to prepay for it at the beginning of the month.  Rather than updating subscription quantities and having to think about prorations, I'd like to leverage Stripe’s usage-based pricing.  While this may create last minute requests that make my workload less predictable, it’s worth testing whether this will produce more revenue overall.

## Requirements

1. **Provision a new Price for on-demand sessions**
    - Similar to before, we need to set up a Price for on-demand sessions.  There's already a method laid out for setting it up in the Offerings service, you just need to complete it.
      - You can reuse the same Product, and the billing interval is still 1 month.
      - It should be configured as a usage-based price, and the other details are included as constants in the provisioning service.  
      - The metadata should include the same `challenge_id` as the other objects.

<br />

2. **Sign people up when they select "On-demand package"**

    - The button for the on-demand package should already be hooked up to submit a request to `POST /offerings/paircode`, you just need to make sure the Checkout Session is now created with the new price.
      - Unlike the fixed price, there should be no trial on this usage-based price.
      - No quantity should be specified, as we’re tracking usage.
      - As before, include the `challenge_id` on the metadata.
      - The existing implementation for subscribing to the monthly package should still behave correctly.


<br />


3. **Record usage when some clicks “Arrange session”**
    - When the user clicks “Arrange Session”, it should already be hooked up to send a request to `POST /offerings/paircode/schedule`.  Please complete the implementation behind that route so it creates a “usage record”.
      - Record 1 usage each time the user clicks the button.
      - All usage should be recorded on the same subscription item.
      - Unlike other objects, no metadata needs to be included on usage records.



_Make sure to pull before pushing, as we've made a small update to the README._

_Test locally by [setting up Playwright](/test/README.md), starting your application's client and server, and then running `npx playwright test ./specs/milestone3.spec.ts` in the repo's `./test` directory._