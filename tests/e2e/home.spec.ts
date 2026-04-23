import { test, expect } from "@playwright/test";

test("home page loads and shows a heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1, h2").first()).toBeVisible();
});

test("login page is accessible", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page.getByLabel(/email address/i)).toBeVisible();
  await expect(page.getByLabel(/password/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("signup page is accessible", async ({ page }) => {
  await page.goto("/auth/signup");
  await expect(page.getByLabel(/email address/i)).toBeVisible();
  await expect(page.getByLabel(/password/i).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: /sign up/i })
  ).toBeVisible();
});

test("login page has link to signup", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible();
});

test("signup page has link to login", async ({ page }) => {
  await page.goto("/auth/signup");
  await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
});
