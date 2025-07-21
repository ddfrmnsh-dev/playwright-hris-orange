import { expect, Page } from "@playwright/test";

export class PimPage {
  constructor(private page: Page) {}

  now = new Date();
  day = this.now.getDate().toString().padStart(2, "0");
  hour = this.now.getHours().toString().padStart(2, "0");
  minute = this.now.getMinutes().toString().padStart(2, "0");
  second = this.now.getSeconds().toString().padStart(2, "0");
  uniqueUsername = `user${this.day}${this.hour}${this.minute}`;
  uniqueEmployeeId = `${this.day}${this.hour}${this.minute}${this.second}`;
  async goto() {
    await this.page.goto("/web/index.php/pim/viewEmployeeList");
  }

  async addEmployee(
    firstName: string,
    middleName: string,
    lastName: string,
    isCreateLogin = false,
    isInvalidData = false
  ) {
    await expect(this.page).toHaveURL("/web/index.php/pim/viewEmployeeList", {
      timeout: 10000,
    });

    await this.page.getByRole("button", { name: "Add" }).click();
    await expect(this.page).toHaveURL("/web/index.php/pim/addEmployee", {
      timeout: 10000,
    });

    await expect(
      this.page.getByRole("heading", { name: "Add Employee" })
    ).toHaveText("Add Employee", { timeout: 10000 });

    await expect(this.page.locator('input[name="firstName"]')).toBeVisible({
      timeout: 10000,
    });
    const inputFile = this.page.locator('input[type="file"]');

    await inputFile.setInputFiles("fixtures/assets/download.jpeg");
    await this.page.fill('input[name="firstName"]', firstName);
    await this.page.fill('input[name="middleName"]', middleName);
    await this.page.fill('input[name="lastName"]', lastName);
    if (isInvalidData) {
      await this.page.getByRole("textbox").nth(4).fill("09557");
      await expect(
        this.page.getByText("Employee Id already exists")
      ).toBeVisible({
        timeout: 5000,
      });
    } else {
      await this.page.getByRole("textbox").nth(4).fill(this.uniqueEmployeeId);
    }

    if (isCreateLogin) {
      if (isInvalidData) {
        await this.createLoginDetails(this.uniqueUsername, "p@ssW0rd!!", true);
      } else {
        await this.createLoginDetails(this.uniqueUsername, "p@ssW0rd!!");
      }
    }
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  async searchEmployee(name: string) {
    await this.page.fill('input[placeholder="Search"]', name);
    await this.page.click('button[type="submit"]');
  }

  private async createLoginDetails(
    userName: string,
    newPassword: string,
    isInvalidData = false
  ) {
    await this.page
      .locator("div")
      .filter({ hasText: /^Create Login Details$/ })
      .locator("label")
      .click();

    if (isInvalidData) {
      await this.page
        .locator(
          "div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input"
        )
        .fill("admin");
    } else {
      await this.page
        .locator(
          "div:nth-child(4) > .oxd-grid-2 > div > .oxd-input-group > div:nth-child(2) > .oxd-input"
        )
        .fill(userName);
    }

    await this.page
      .locator("label")
      .filter({ hasText: "Enabled" })
      .locator("span")
      .click();

    await this.page.locator('input[type="password"]').first().fill(newPassword);
    await this.page.locator('input[type="password"]').nth(1).fill(newPassword);

    if (!isInvalidData) {
      await this.page.screenshot({
        path: "evidence/pim/create-employee-with-account.png",
        fullPage: false,
      });
    }
  }
}
