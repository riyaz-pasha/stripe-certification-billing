# Running the test suite

1. From this directory, run `npm i` to install Playwright as an npm dependency.
2. Run `npx playwright install --with-deps chromium` to install Playwright and Chromium.
3. Check the current milestone's pull request to find the command to run its test suite, something like `npx playwright test ./specs/...`.

Playwright will install the browser drivers into a system cache directory.  If you're using a corporate machine which restricts which folders are allowed to run binaries, Playwright has an option to install the browsers directly into this project:

```sh
# Places binaries to node_modules/playwright-core/.local-browsers
export PLAYWRIGHT_BROWSERS_PATH=0
npx playwright install --with-deps chromium
npx playwright test ./specs/*
```
