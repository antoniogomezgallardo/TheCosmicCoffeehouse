import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

interface UserCredentials {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Page Object for Authentication (Login/Register) pages
 */
export class AuthPage extends BasePage {
  // Common locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly switchFormLink: Locator;

  // Register-specific locators
  private readonly usernameInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly confirmPasswordInput: Locator;

  constructor(page: Page, isLoginPage: boolean = true) {
    super(page, isLoginPage ? '/login' : '/register');

    // Initialize common locators with data-testid priority and fallback selectors
    this.emailInput = page.locator('[data-testid="email-input"], input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    this.passwordInput = page.locator('[data-testid="password-input"], input[type="password"], input[name="password"]').first();
    this.submitButton = page.locator('[data-testid="submit-button"], button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"], .error, [class*="error"], .alert-danger, [role="alert"]').first();
    this.successMessage = page.locator('[data-testid="success-message"], .success, [class*="success"], .alert-success').first();
    this.switchFormLink = page.locator('a:has-text("Register"), a:has-text("Login"), a:has-text("Sign up"), a:has-text("Sign in")').first();

    // Register-specific locators with data-testid priority
    this.usernameInput = page.locator('[data-testid="username-input"], input[name="username"], input[placeholder*="username"]').first();
    this.firstNameInput = page.locator('[data-testid="firstName-input"], input[name="firstName"], input[name="first_name"], input[placeholder*="first"]').first();
    this.lastNameInput = page.locator('[data-testid="lastName-input"], input[name="lastName"], input[name="last_name"], input[placeholder*="last"]').first();
    this.confirmPasswordInput = page.locator('[data-testid="confirmPassword-input"], input[name="confirmPassword"], input[name="confirm_password"], input[placeholder*="confirm"]').first();
  }

  /**
   * Login with credentials
   */
  async login(email: string, userPassword: string): Promise<void> {
    // Only navigate if not already on login page
    if (!this.page.url().includes('/login')) {
      await this.page.goto('/login');
      await this.page.waitForLoadState('networkidle');
    }
    await this.fillLoginForm(email, userPassword);
    await this.submitForm();
    await this.waitForAuthResult();
  }

  /**
   * Register new user
   */
  async register(userData: UserCredentials): Promise<void> {
    // Only navigate if not already on register page
    if (!this.page.url().includes('/register')) {
      await this.page.goto('/register');
      await this.page.waitForLoadState('networkidle');
    }
    await this.fillRegisterForm(userData);
    await this.submitForm();
    await this.waitForAuthResult();
  }

  /**
   * Fill login form
   */
  async fillLoginForm(email: string, userPassword: string): Promise<void> {
    await this.waitForVisible(this.emailInput);
    await this.fillAndVerify(this.emailInput, email);
    await this.fillAndVerify(this.passwordInput, userPassword);
  }

  /**
   * Fill register form
   */
  async fillRegisterForm(userData: UserCredentials): Promise<void> {
    await this.waitForVisible(this.emailInput);

    await this.fillAndVerify(this.emailInput, userData.email);
    await this.fillAndVerify(this.passwordInput, userData.password);

    // Fill optional fields if they exist
    if (userData.username && await this.isVisible(this.usernameInput)) {
      await this.fillAndVerify(this.usernameInput, userData.username);
    }

    if (userData.firstName && await this.isVisible(this.firstNameInput)) {
      await this.fillAndVerify(this.firstNameInput, userData.firstName);
    }

    if (userData.lastName && await this.isVisible(this.lastNameInput)) {
      await this.fillAndVerify(this.lastNameInput, userData.lastName);
    }

    // Handle confirm password if it exists
    if (await this.isVisible(this.confirmPasswordInput)) {
      await this.fillAndVerify(this.confirmPasswordInput, userData.password);
    }
  }

  /**
   * Submit the authentication form
   */
  async submitForm(): Promise<void> {
    await this.waitForVisible(this.submitButton);
    await this.submitButton.click();
  }

  /**
   * Wait for authentication result (success or error)
   */
  async waitForAuthResult(): Promise<void> {
    try {
      // Wait for either navigation (success) or error message
      await Promise.race([
        this.page.waitForURL(url => url.toString() !== this.url, { timeout: 10000 }),
        this.errorMessage.waitFor({ state: 'visible', timeout: 10000 })
      ]);
    } catch (error) {
      console.warn('Auth result timeout - proceeding with test');
    }
  }

  /**
   * Verify successful login (user is redirected)
   */
  async verifyLoginSuccess(): Promise<void> {
    // Check if we're redirected away from login page
    await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });

    // Or check for user-specific elements
    const userIndicator = this.page.locator('button:has-text("Logout"), .user-menu, [data-testid="user-menu"]').first();
    await this.waitForVisible(userIndicator);
  }

  /**
   * Verify registration success
   */
  async verifyRegistrationSuccess(): Promise<void> {
    // Check if redirected to login or dashboard
    await this.page.waitForURL(url => !url.toString().includes('/register'), { timeout: 10000 });

    // Look for success indicators
    const successIndicators = this.page.locator(
      'text="Registration successful", text="Welcome", text="Account created", .success'
    ).first();

    if (await this.isVisible(successIndicators)) {
      await this.waitForVisible(successIndicators);
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getTextContent(this.errorMessage);
    }
    return '';
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage?: string): Promise<void> {
    await this.waitForVisible(this.errorMessage);

    if (expectedMessage) {
      const actualMessage = await this.getErrorMessage();
      expect(actualMessage.toLowerCase()).toContain(expectedMessage.toLowerCase());
    }
  }

  /**
   * Switch between login and register forms
   */
  async switchToRegister(): Promise<void> {
    const registerLink = this.page.locator('a:has-text("Register"), a:has-text("Sign up"), a:has-text("Create account")').first();
    if (await this.isVisible(registerLink)) {
      await this.clickAndWaitForNavigation(registerLink);
    } else {
      await this.page.goto('/register');
    }
  }

  /**
   * Switch to login form
   */
  async switchToLogin(): Promise<void> {
    const loginLink = this.page.locator('a:has-text("Login"), a:has-text("Sign in"), a:has-text("Already have")').first();
    if (await this.isVisible(loginLink)) {
      await this.clickAndWaitForNavigation(loginLink);
    } else {
      await this.page.goto('/login');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const logoutButton = this.page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out")').first();
    if (await this.isVisible(logoutButton)) {
      await this.clickAndWaitForNavigation(logoutButton);
    }
  }

  /**
   * Quick login for tests (bypasses UI)
   * Note: Credentials are passed as parameters, not hardcoded
   */
  async quickLogin(email: string, userPassword: string): Promise<string> {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const response = await this.page.request.post(`${baseUrl}/api/auth/login`, {
      data: { email, password: userPassword }
    });

    if (response.ok()) {
      const userData = await response.json();
      return userData.data.token;
    }

    throw new Error('Quick login failed');
  }
}