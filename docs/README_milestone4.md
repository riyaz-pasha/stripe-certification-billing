## Milestone 4: Workshops for multiple devs

The last business model that I want to experiment with is putting together workshops for multiple developers.  The price of the workshop has to go up with the number of developers, as I may need to ask friends to help me run breakout sessions.  I’ll coordinate the workshop timing and topics separately, so I just need you to hook up the interface for requesting one.

### Requirements
1. **Provision a new non-recurring workshop price**
    - Update the provisioning service to set up one last Price for multi-seat sessions.  
        - Each seat at the workshop should cost $80.
        - Unlike the other two prices, this one should not be recurring – it’s just one workshop.
        - Continue including the `challenge_id` in the metadata.


<br />

2. **Add an invoice item upon clicking “Register”**
    - When a user clicks register, please add a charge to their next invoice.  The button should already be hooked up to `POST /offerings/workshop`, so you should only need to complete the underlying implementation.
        - The new item on their invoice should use the price you just created.
        - The quantity should be equal to the number of attendees they requested.
        - No `challenge_id` is necessary on this invoice item.


_Make sure to pull before pushing, as we've made a small update to the README._

_Test locally by [setting up Playwright](/test/README.md), starting your application's client and server, and then running `npx playwright test ./specs/milestone4.spec.ts` in the repo's `./test` directory._