import { test, expect } from '@playwright/test';

test.describe('Hero Component', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguj na stránku kde sa Hero komponenta nachádza
    await page.goto('/'); // baseURL je nastavená v playwright.config.ts
    
    // Počkaj na načítanie stránky
    await page.waitForLoadState('networkidle');
  });

  test('should render hero component with correct heading', async ({ page }) => {
    // Testuj či sa zobrazuje hlavný nadpis
    const heading = page.getByRole('heading', { name: 'SPŠT Knižnica', level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('SPŠT Knižnica');
    
    // Testuj správne CSS triedy pre responsive design
    await expect(heading).toHaveClass(/text-4xl.*sm:text-5xl.*md:text-6xl.*lg:text-7xl.*xl:text-8xl/);
  });

  test('should render Stephen King quote', async ({ page }) => {
    // Testuj zobrazenie citátu
    const quote = page.locator('q');
    await expect(quote).toBeVisible();
    await expect(quote).toHaveText('Knihy sú jedinečne prenosné kúzlo – Stephen King');
    await expect(quote).toHaveClass(/italic/);
  });

  test('should render both navigation buttons', async ({ page }) => {
    // Testuj tlačidlo "Zobraziť všetky knihy"
    const booksButton = page.getByRole('button', { name: 'Zobraziť všetky knihy' });
    await expect(booksButton).toBeVisible();
    await expect(booksButton).toHaveAttribute('id', 'bookBtn');
    
    // Testuj tlačidlo "Školská stránka"
    const schoolButton = page.getByRole('button', { name: 'Školská stránka' });
    await expect(schoolButton).toBeVisible();
    await expect(schoolButton).toHaveAttribute('id', 'schollBtn');
  });

  test('should have correct links for buttons', async ({ page }) => {
    // Testuj link pre knihy
    const booksLink = page.getByRole('link').filter({ has: page.getByText('Zobraziť všetky knihy') });
    await expect(booksLink).toHaveAttribute('href', '/books');
    
    // Testuj external link pre školu
    const schoolLink = page.getByRole('link').filter({ has: page.getByText('Školská stránka') });
    await expect(schoolLink).toHaveAttribute('href', 'https://www.spsbj.sk/');
    await expect(schoolLink).toHaveAttribute('target', '_blank');
    await expect(schoolLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should render school image', async ({ page }) => {
    // Testuj zobrazenie obrázka
    const image = page.getByRole('img', { name: 'Scholl homepage' });
    await expect(image).toBeVisible();
    
    // Testuj alt text
    await expect(image).toHaveAttribute('alt', 'Scholl homepage');
  });

  test('should handle button clicks correctly', async ({ page, context }) => {
    // Testuj klik na tlačidlo kníh (internal navigation)
    const booksButton = page.getByRole('button', { name: 'Zobraziť všetky knihy' });
    await booksButton.click();
    
    // Počkaj na navigáciu
    await page.waitForURL('**/books');
    expect(page.url()).toContain('/books');
    
    // Vráť sa späť
    await page.goBack();
    
    // Testuj klik na external link (otvorí novú kartu)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('button', { name: 'Školská stránka' }).click()
    ]);
    
    await newPage.waitForLoadState();
    expect(newPage.url()).toBe('https://www.spsbj.sk/');
    await newPage.close();
  });

  test('should have responsive layout', async ({ page }) => {
    // Testuj desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const container = page.locator('.flex.flex-col-reverse.md\\:flex-row');
    await expect(container).toBeVisible();
    
    // Testuj mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Na mobile by mal byť flex-col-reverse (obrázok hore, text dole)
    await expect(container).toHaveClass(/flex-col-reverse/);
  });

  test('should have proper animation setup', async ({ page }) => {
    // Testuj či má komponenta motion.div wrapper
    const motionDiv = page.locator('div[class*="container"]').first();
    await expect(motionDiv).toBeVisible();
    
    // Testuj či sú správne aplikované CSS triedy pre spacing
    await expect(motionDiv).toHaveClass(/container.*mx-auto.*px-4.*py-8/);
  });

  test('should work in both light and dark mode', async ({ page }) => {
    // Testuj light mode
    await page.emulateMedia({ colorScheme: 'light' });
    const heading = page.getByRole('heading', { name: 'SPŠT Knižnica' });
    await expect(heading).toHaveClass(/text-gray-900/);
    
    // Testuj dark mode  
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(heading).toHaveClass(/dark:text-blue-50/);
  });

  test('should handle image loading states', async ({ page }) => {
    // Testuj či sa obrázok načítava s priority
    const image = page.getByRole('img', { name: 'Scholl homepage' });
    
    // Počkaj na načítanie obrázka
    await expect(image).toBeVisible();
    
    // Testuj či má správne rozmery a objektové vlastnosti
    await expect(image).toHaveClass(/object-cover.*object-center/);
  });

  test('should be accessible', async ({ page }) => {
    // Testuj základnú prístupnosť
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    
    // Testuj či sú všetky interaktívne elementy dostupné
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBe(2);
    
    // Testuj focus states pre klávesovú navigáciu
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Zobraziť všetky knihy' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Školská stránka' })).toBeFocused();
  });
});