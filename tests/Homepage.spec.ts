import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Naviguj na homepage
  await page.goto('http://localhost:3000/', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
});

test('Hero Component - visibility', async ({ page }) => {
  const heroContainer = page.locator('[data-testid="hero-container"]');
  const heroTitle = page.locator('[data-testid="hero-title"]');
  const heroQuote = page.locator('[data-testid="hero-quote"]');
  const heroBooksBtn = page.locator('[data-testid="hero-books-btn"]');
  const heroSchoolBtn = page.locator('[data-testid="hero-school-btn"]');
  const heroImage = page.locator('[data-testid="hero-image"]');

  // Overenie viditeľnosti
  await expect(heroContainer).toBeVisible();
  await expect(heroTitle).toBeVisible();
  await expect(heroQuote).toBeVisible();
  await expect(heroBooksBtn).toBeVisible();
  await expect(heroSchoolBtn).toBeVisible();
  await expect(heroImage).toBeVisible();
});

test('Hero - navigate to /books page', async ({ page }) => {
  const heroBooksBtn = page.locator('[data-testid="hero-books-btn"]');
  await heroBooksBtn.click();

  // Over, že URL sa zmenila na /books
  await expect(page).toHaveURL(/\/books$/);

  // Voliteľné: over, že stránka obsahuje text "Knihy"
  await expect(page.locator('text=Knihy')).toBeVisible();
});

test('Hero - open school external link', async ({ page, context }) => {
  const heroSchoolBtn = page.locator('[data-testid="hero-school-btn"]');

  // Zachytenie novej stránky (nová karta)
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    heroSchoolBtn.click(),
  ]);

  await newPage.waitForLoadState('load');

  // Over, že URL obsahuje školskú doménu
  await expect(newPage).toHaveURL(/spsbj\.sk/);

  // Voliteľné: over, že stránka obsahuje nejaký text
  await expect(newPage.locator('text=SPŠT')).toBeVisible();
});
