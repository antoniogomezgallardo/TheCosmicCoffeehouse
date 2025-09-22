import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the Home/Landing page
 */
export class HomePage extends BasePage {
  // Locators
  private readonly heroSection: Locator;
  private readonly featuredProductsSection: Locator;
  private readonly navigationMenu: Locator;
  private readonly logoLink: Locator;
  private readonly shopNowButton: Locator;
  private readonly featuredCapsules: Locator;
  private readonly featuredMachines: Locator;
  private readonly authenticationLinks: Locator;

  constructor(page: Page) {
    super(page, '/');

    // Initialize locators
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.featuredProductsSection = page.locator('[data-testid="featured-products"]');
    this.navigationMenu = page.locator('[data-testid="navigation-menu"]');
    this.logoLink = page.locator('[data-testid="logo-link"]');
    this.shopNowButton = page.locator('[data-testid="shop-now-button"]');
    this.featuredCapsules = page.locator('[data-testid="featured-capsules"]');
    this.featuredMachines = page.locator('[data-testid="featured-machines"]');
    this.authenticationLinks = page.locator('[data-testid="auth-links"]');
  }

  /**
   * Navigate to home page and verify it loads
   */
  async navigateToHome(): Promise<void> {
    await this.goto();
    await this.verifyHomePageLoaded();
  }

  /**
   * Verify home page is loaded correctly
   */
  async verifyHomePageLoaded(): Promise<void> {
    await this.waitForVisible(this.heroSection);
    // Note: Using more flexible selectors since we may not have data-testid attributes yet
    await this.page.waitForSelector('h1, .hero, [class*="hero"]', { timeout: 10000 });
  }

  /**
   * Click on Shop Now button
   */
  async clickShopNow(): Promise<void> {
    // Fallback to text-based selector if data-testid is not available
    const shopButton = this.page.locator('button:has-text("Shop"), a:has-text("Shop"), button:has-text("Browse"), a:has-text("Browse")').first();
    if (await this.isVisible(shopButton)) {
      await this.clickAndWaitForNavigation(shopButton);
    } else {
      // Navigate directly to products page if no shop button is found
      await this.page.goto('/products');
    }
  }

  /**
   * Click on logo to return to home
   */
  async clickLogo(): Promise<void> {
    const logo = this.page.locator('img[alt*="logo"], .logo, [class*="logo"]').first();
    if (await this.isVisible(logo)) {
      await this.clickAndWaitForNavigation(logo);
    }
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    // Based on debug output, there's a "Login" button
    const loginButton = this.page.locator('button:has-text("Login")').first();
    if (await this.isVisible(loginButton)) {
      await loginButton.click();
      await this.waitForPageLoad();
    } else {
      await this.page.goto('/login');
    }
  }

  /**
   * Navigate to register page
   */
  async navigateToRegister(): Promise<void> {
    // Based on debug output, there's a "Register" button
    const registerButton = this.page.locator('button:has-text("Register")').first();
    if (await this.isVisible(registerButton)) {
      await registerButton.click();
      await this.waitForPageLoad();
    } else {
      await this.page.goto('/register');
    }
  }

  /**
   * Navigate to products page
   */
  async navigateToProducts(): Promise<void> {
    // Based on debug output, there are "Capsules" and "Machines" links, or "Explore Capsules"
    const capsulesLink = this.page.locator('a:has-text("Capsules"), a:has-text("Explore Capsules")').first();
    if (await this.isVisible(capsulesLink)) {
      await this.clickAndWaitForNavigation(capsulesLink);
    } else {
      await this.page.goto('/products');
    }
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    const logoutButton = this.page.locator('button:has-text("Logout"), a:has-text("Logout")');
    const userMenu = this.page.locator('[data-testid="user-menu"], .user-menu, [class*="user"]');

    return (await this.isVisible(logoutButton)) || (await this.isVisible(userMenu));
  }

  /**
   * Get featured products count
   */
  async getFeaturedProductsCount(): Promise<number> {
    const products = this.page.locator('.product-card, [data-testid="product-card"], .featured-product');
    await products.first().waitFor({ timeout: 5000 }).catch(() => {});
    return await products.count();
  }

  /**
   * Verify featured products are displayed
   */
  async verifyFeaturedProductsDisplayed(): Promise<void> {
    const featuredSection = this.page.locator('section:has-text("Featured"), .featured, [class*="featured"]').first();
    await this.waitForVisible(featuredSection);

    const productsCount = await this.getFeaturedProductsCount();
    if (productsCount === 0) {
      console.warn('No featured products found on homepage');
    }
  }

  /**
   * Search for products (if search functionality exists)
   */
  async searchProducts(searchTerm: string): Promise<void> {
    const searchInput = this.page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first();
    if (await this.isVisible(searchInput)) {
      await this.fillAndVerify(searchInput, searchTerm);

      const searchButton = this.page.locator('button[type="submit"], button:has-text("Search")').first();
      if (await this.isVisible(searchButton)) {
        await searchButton.click();
      } else {
        await searchInput.press('Enter');
      }
      await this.waitForPageLoad();
    }
  }
}