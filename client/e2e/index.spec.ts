import { test, expect } from '@playwright/test';
import {
  GuessValidationResult,
  GetScoreResponse,
  DIRECTION,
  SubmitGuessResponse,
  CreateUserResponse,
} from '../src/types';

const baseURL = 'http://localhost:5173';
const apiBaseUrl = 'http://localhost:8080/api';

const mockSubmitGuessResponse: SubmitGuessResponse = {
  message: 'Guess submitted',
  guessId: 'fakeGuessId',
};

const mockGuessValidationResult: GuessValidationResult = {
  currentPrice: 50000,
  guessPrice: 49000,
  direction: DIRECTION.UP,
  isCorrectGuess: true,
};

const mockGetScoreResponse: GetScoreResponse = { score: 10 };

const mockCreateUserResponse: CreateUserResponse = {
  userId: 'newFakeUserId',
  name: 'Fake User',
};
const mockPrice = 50000;

test.describe('Crypto Guesser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/`);
    await page.evaluate(() => {
      localStorage.setItem('apiKey', 'mockApiKey');
      localStorage.setItem('userId', 'fakeUserId');
      localStorage.setItem('name', 'Fake User');
    });
    await page.reload();
  });

  test.beforeEach(async ({ page }) => {
    await page.route('**/config.ts*', async (route) => {
      const mockConfig = {
        appConfig: {
          apiBaseUrl,
          priceChangeTimeout: 30000,
          guessTimeout: 2,
          currency: 'USD',
        },
      };
      await route.fulfill({
        contentType: 'application/javascript',
        body: `export const appConfig = ${JSON.stringify(mockConfig.appConfig)};`,
      });
    });

    await page.route(`${apiBaseUrl}/guess/submit`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSubmitGuessResponse),
      });
    });

    await page.route(`${apiBaseUrl}/guess/validate/*`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGuessValidationResult),
      });
    });

    await page.route(`${apiBaseUrl}/users/*/score`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetScoreResponse),
      });
    });

    await page.route(`${apiBaseUrl}/users/create`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCreateUserResponse),
      });
    });

    await page.route(`${apiBaseUrl}/price/current`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ price: mockPrice }),
      });
    });
  });

  test('should display login page and allow user to enter name and login', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/login`);

    const nameInput = page.locator('.login-input');
    const loginButton = page.locator('.login-button');

    await expect(nameInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    await nameInput.fill('Test User');
    await loginButton.click();

    await expect(page).toHaveURL(`${baseURL}/game`);
  });

  test('should display current BTC price and next update label', async ({
    page,
  }) => {
    await page.route(`${apiBaseUrl}/guess/active/*`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(null),
      });
    });

    await page.goto(`${baseURL}/game`);

    await page.waitForTimeout(3000);

    const price = await page.locator('.price-container__price');
    const countdown = await page.locator('.price-container__countdown');

    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText.replace(/\s/g, '')).toBe('50.000,00$');

    await expect(countdown).toContainText('Next update in:');
  });

  test('should allow guess submission, show timer and disable buttons', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/game`);

    const upButton = page.locator('.guess-up');
    const downButton = page.locator('.guess-down');

    await expect(upButton).toBeEnabled();
    await expect(downButton).toBeEnabled();

    await upButton.click();

    await expect(upButton).toBeHidden();
    await expect(downButton).toBeHidden();

    const timer = page.locator('.timer-container .label');
    await expect(timer).toBeVisible();
  });

  test('should update score and show result after guess is resolved', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/game`);

    const upButton = page.locator('.guess-up');
    const score = page.locator('[data-testid="user-score"]');

    await upButton.click();

    await page.waitForTimeout(3000);

    const resultModal = page.locator('[data-testid="guess-result"]');
    const closeResultButton = resultModal.locator('.result-button');

    await expect(resultModal).toBeVisible();
    const newScore = await score.textContent();
    expect(Number(newScore)).not.toBe(0);

    await closeResultButton.click();
    await expect(resultModal).toBeHidden();
  });

  test('should persist score after reload', async ({ page }) => {
    await page.goto(`${baseURL}/game`);

    const score = page.locator('[data-testid="user-score"]');

    const upButton = page.locator('.guess-up');
    await upButton.click();
    await page.waitForTimeout(3000);

    await page.reload();

    const persistedScore = await score.textContent();
    expect(Number(persistedScore)).not.toBe(0);
  });

  test('should display game rules when "Rules" is clicked', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/game`);

    const rulesButton = page.locator('[data-testid="show-rules"]');
    const rulesContent = page.locator('[data-testid="game-rules"]');

    await expect(rulesContent).toBeHidden();

    await rulesButton.click();

    await expect(rulesContent).toBeVisible();
  });
});
