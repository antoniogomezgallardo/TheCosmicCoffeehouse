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

    // Initialize common locators with multiple fallback selectors
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    this.passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    this.submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Register"), button:has-text("Sign In"), button:has-text("Sign Up")').first();
    this.errorMessage = page.locator('.error, [class*="error"], .alert-danger, [role="alert"]').first();
    this.successMessage = page.locator('.success, [class*="success"], .alert-success').first();
    this.switchFormLink = page.locator('a:has-text("Register"), a:has-text("Login"), a:has-text("Sign up"), a:has-text("Sign in")').first();

    // Register-specific locators
    this.usernameInput = page.locator('input[name="username"], input[placeholder*="username"]').first();
    this.firstNameInput = page.locator('input[name="firstName"], input[name="first_name"], input[placeholder*="first"]').first();
    this.lastNameInput = page.locator('input[name="lastName"], input[name="last_name"], input[placeholder*="last"]').first();
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm_password"], input[placeholder*="confirm"]').first();
  }

  /**
   * Login with credentials
   */
  async login(email: string, userPassword: string): Promise<void> {
    await this.goto();
    await this.fillLoginForm(email, userPassword);
    await this.submitForm();
    await this.waitForAuthResult();
  }

  /**
   * Register new user
   */
  async register(userData: UserCredentials): Promise<void> {
    await this.goto();
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
        this.page.waitForURL(url => url !== this.url, { timeout: 10000 }),
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
    await this.page.waitForURL(url => !url.includes('/login'), { timeout: 10000 });

    // Or check for user-specific elements
    const userIndicator = this.page.locator('button:has-text("Logout"), .user-menu, [data-testid="user-menu"]').first();
    await this.waitForVisible(userIndicator);
  }

  /**
   * Verify registration success
   */
  async verifyRegistrationSuccess(): Promise<void> {
    // Check if redirected to login or dashboard
    await this.page.waitForURL(url => !url.includes('/register'), { timeout: 10000 });

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
    const response = await this.page.request.post('http://localhost:3001/api/auth/login', {
      data: { email, password: userPassword }
    });

    if (response.ok()) {
      const userData = await response.json();
      return userData.data.token;
    }

    throw new Error('Quick login failed');
  }
}