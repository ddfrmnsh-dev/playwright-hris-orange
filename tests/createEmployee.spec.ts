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

    // console.log("checkk", test.info().project.name);
    await pimPage.addEmployee("John", "A.", "Doe");
    const link = page.getByRole("link", { name: "Employee List" });
    const isMobile = test.info().project.name.toLowerCase().includes("mobile");

    if (isMobile) {
      // di mobile mungkin render lambat → kasih timeout
      await expect(page.getByText("Configuration")).toHaveText(
        "Configuration ",
        { timeout: 10000 }
      );
    } else {
      // di desktop tampil cepat → pakai default timeout
      await expect(link).toHaveText("Employee List");
    }
    // await expect(page.getByRole("link", { name: "Employee List" })).toHaveText(
    //   "Employee List",
    //   { timeout: 10000 }
    // );
    await expect(
      page.getByRole("heading", { name: "Personal Details" })
    ).toBeVisible({
      timeout: 10000,
    });

    const path = `evidence/pim/create-employee-success-`;
    if (!isMobile) {
      await page.screenshot({
        path: `${path}web.png`,
        fullPage: false,
      });
    }
    await page.screenshot({
      path: `${path}mobile.png`,
      fullPage: false,
    });
  });

  test("should add a new employee with create login details", async ({
    page,
  }) => {
    const pimPage = new PimPage(page);
    await pimPage.goto();

    await pimPage.addEmployee("Lorem", "Ipsum", "Dolor", true, false);
    const link = page.getByRole("link", { name: "Employee List" });
    const isMobile = test.info().project.name.toLowerCase().includes("mobile");

    if (isMobile) {
      // di mobile mungkin render lambat → kasih timeout
      await expect(page.getByText("Configuration")).toHaveText(
        "Configuration ",
        { timeout: 10000 }
      );
    } else {
      // di desktop tampil cepat → pakai default timeout
      await expect(link).toHaveText("Employee List");
    }
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

    const path = `evidence/pim/create-employee-failed-employeeid-already-existing-`;
    const isMobile = test.info().project.name.toLowerCase().includes("mobile");

    if (!isMobile) {
      await page.screenshot({
        path: `${path}web.png`,
        fullPage: false,
      });
    }
    await page.screenshot({
      path: `${path}mobile.png`,
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

    const isMobile = test.info().project.name.toLowerCase().includes("mobile");
    const path = `evidence/pim/create-employee-failed-username-already-existing-`;
    if (!isMobile) {
      await page.screenshot({
        path: `${path}web.png`,
        fullPage: false,
      });
    }
    await page.screenshot({
      path: `${path}mobile.png`,
      fullPage: false,
    });
  });
});
