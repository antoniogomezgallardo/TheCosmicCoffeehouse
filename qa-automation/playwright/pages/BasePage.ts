import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object class that provides common functionality
 * All page objects should extend this class
 */
export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to the page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  }

  /**
   * Wait for an element to be visible
   */
  async waitForVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForHidden(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click and wait for navigation
   */
  async clickAndWaitForNavigation(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      locator.click()
    ]);
  }

  /**
   * Fill form field and verify
   */
  async fillAndVerify(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }

  /**
   * Select option and verify
   */
  async selectAndVerify(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
    await expect(locator).toHaveValue(value);
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content with fallback
   */
  async getTextContent(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text || '';
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string | RegExp, timeout: number = 10000): Promise<void> {
    await this.page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Handle alert dialogs
   */
  async handleAlert(accept: boolean = true): Promise<string> {
    return new Promise((resolve) => {
      this.page.on('dialog', async (dialog) => {
        const message = dialog.message();
        if (accept) {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        resolve(message);
      });
    });
  }

  /**
   * Add custom wait functionality
   */
  async waitFor(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Check if page has loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.url));
    await this.waitForPageLoad();
  }
}