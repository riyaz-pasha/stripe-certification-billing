## React Client

This is the React client for /dev/chat's web app.

## Implementation Notes

- This project uses `create-react-app`; you can turn it on by either running our generic start script, `. start.sh`, or by calling `npm run start`.
- The client-side Axios helper is automatically adding the authentication data to each request.  You won't need to pass along the `user_id` parameter; after login, that value will be automatically included as a query parameter on every request.

## Project Structure

As you work through the project milestones, here are the key places you'll need to make client-side changes:

<details>
<summary>Milestone 1: Basic monthly subscription</summary>
This functionality works through the server, no client-side changes are required.
</details>
<details>
<summary>Milestone 2: Handle cancellations & declines</summary>
This functionality works through the server, no client-side changes are required.
Use the Stripe CLI to forward webhook events to the POST /webhook endpoint. Here is the command
stripe listen --forward-to 127.0.0.1:4242/webhook --api-key <secret_api_key>
</details>
<details>
<summary>Milestone 3: On-demand pair coding</summary>
This functionality works through the server, no client-side changes are required.
</details>
<details>
<summary>Milestone 4: Workshops for multiple devs</summary>
This functionality works through the server, no client-side changes are required.
</details>

## Gotchas

