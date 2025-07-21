import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { PimPage } from "../pages/PimPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login("Admin", "admin123");
});

test.describe("PIM Page Tests Valid", () => {
  test("should add a new employee", async ({ page }) => {
    const pimPage = new PimPage(page);
    await pimPage.goto();

    await pimPage.addEmployee("John", "A.", "Doe");

    await expect(page.getByRole("link", { name: "Employee List" })).toHaveText(
      "Employee List"
    );

    await expect(
      page.getByRole("heading", { name: "Personal Details" })
    ).toBeVisible({
      timeout: 10000,
    });

    await page.screenshot({
      path: "evidence/pim/create-employee-success.png",
      fullPage: false,
    });
  });

  test("should add a new employee with create login details", async ({
    page,
  }) => {
    const pimPage = new PimPage(page);
    await pimPage.goto();

    await pimPage.addEmployee("Lorem", "Ipsum", "Dolor", true, false);

    await expect(page.getByRole("link", { name: "Employee List" })).toHaveText(
      "Employee List"
    );

    await expect(
      page.getByRole("heading", { name: "Personal Details" })
    ).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("PIM Page Tests Invalid", () => {
  test("should add a new employee", async ({ page }) => {
    const pimPage = new PimPage(page);
    await pimPage.goto();

    await pimPage.addEmployee("John", "A.", "Doe", false, true);

    // await expect(page.getByRole("link", { name: "Employee List" })).toHaveText(
    //   "Employee List"
    // );

    // await expect(
    //   page.getByRole("heading", { name: "Personal Details" })
    // ).toBeVisible({
    //   timeout: 10000,
    // });
    await expect(page.getByText("Employee Id already exists")).toBeVisible({
      timeout: 10000,
    });

    await page.screenshot({
      path: "evidence/pim/create-employee-failed-employeeid-already-existing.png",
      fullPage: false,
    });
  });

  test("should add a new employee with create login details", async ({
    page,
  }) => {
    const pimPage = new PimPage(page);
    await pimPage.goto();

    await pimPage.addEmployee("Lorem", "Ipsum", "Dolor", true, true);

    // await expect(page.getByRole("link", { name: "Employee List" })).toHaveText(
    //   "Employee List"
    // );

    // await expect(
    //   page.getByRole("heading", { name: "Personal Details" })
    // ).toBeVisible({
    //   timeout: 10000,
    // });
    await expect(page.getByText("Username already exists")).toBeVisible({
      timeout: 10000,
    });

    await page.screenshot({
      path: "evidence/pim/create-employee-failed-username-already-existing.png",
      fullPage: false,
    });
  });
});
