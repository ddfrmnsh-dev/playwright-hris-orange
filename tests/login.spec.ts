import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import users from "../fixtures/users.json";
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test.describe("Login Tests", () => {
  test("should log in with valid credentials", async ({ page }) => {
    const { username, password } = users.validUser;
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);

    await expect(
      page.locator(".oxd-text.oxd-text--h6.oxd-topbar-header-breadcrumb-module")
    ).toHaveText("Dashboard", { timeout: 10000 });

    await page.screenshot({
      path: "evidence/login/login-dashboard.png",
      fullPage: false,
    });

    await page.locator(".oxd-userdropdown-tab").click({ timeout: 5000 });
    const logoutLink = page.locator('a[href="/web/index.php/auth/logout"]');
    await expect(logoutLink).toBeVisible({ timeout: 5000 });

    await logoutLink.click();

    await expect(page).toHaveURL("/web/index.php/auth/login", {
      timeout: 10000,
    });

    await expect(page.locator('input[name="username"]')).toBeVisible({
      timeout: 10000,
    });

    await page.screenshot({
      path: "evidence/login/logout-success.png",
      fullPage: false,
    });
  });

  test("should show error on invalid credentials", async ({ page }) => {
    const { username, password } = users.invalidUsername;
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password);

    await expect(page.getByText("Invalid credentials")).toHaveText(
      "Invalid credentials"
    );
  });
});
