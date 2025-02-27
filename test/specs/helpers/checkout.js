import { faker } from "@faker-js/faker";

const checkout = async (page, trial = false) => {
  let cardNumber;

  if (trial) {
    cardNumber = "4000 0000 0000 0341";
  } else {
    cardNumber = "4242 4242 4242 4242";
  }
  // Get the current date
  const currentDate = new Date();
  // Add 1 year to the current date
  const nextYearDate = new Date(currentDate);
  nextYearDate.setFullYear(currentDate.getFullYear() + 1);
  // Get the month and year from the next year date
  const nextYearMonth = (nextYearDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");

  const nextYearTwoDigitYear = nextYearDate.getFullYear().toString().slice(-2);
  const expiryDate = nextYearMonth + " / " + nextYearTwoDigitYear;
  const fakeName = faker.name.findName();
  // Set the billing country to US, as labels are different in
  // other countries even if they're in English.  Specifically,
  // only the US calls it "ZIP" instead of "Postal code".
  await page.locator('#billingCountry').selectOption('US');

  const cardField = await page.locator('input[name="cardNumber"]');
  await cardField.click(); // Esnure card field is focused
  await cardField.type(cardNumber, { delay: 50 });
  await page.locator('[placeholder="MM \\/ YY"]').fill(expiryDate);
  await page.locator('[placeholder="CVC"]').fill("123");
  await page.locator('input[name="billingName"]').fill(fakeName);
  await page.locator('[placeholder="ZIP"]').fill("90210");
  await page.locator('[name="enableStripePass"]').setChecked(false);
  await page.locator('[data-testid="hosted-payment-submit-button"]').click();

  await page.waitForNavigation({ timeout: 20000 });
};

export default checkout;
