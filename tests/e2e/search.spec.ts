import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
  test("search modal opens via header trigger on desktop", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const searchTrigger = page.locator("#search-trigger");
    await expect(searchTrigger).toBeVisible();
    await searchTrigger.click();

    const searchModal = page.locator("#search-modal");
    await expect(searchModal).toBeVisible();
    await expect(searchModal).not.toHaveClass(/hidden/);

    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeFocused();
  });

  test("search modal opens via Cmd+K keyboard shortcut", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");

    const searchModal = page.locator("#search-modal");
    await expect(searchModal).toBeVisible();
    await expect(searchModal).not.toHaveClass(/hidden/);

    const searchInput = page.locator("#search-input");
    await expect(searchInput).toBeFocused();
  });

  test("search modal closes via Escape key", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");
    await expect(page.locator("#search-modal")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#search-modal")).toHaveClass(/hidden/);
  });

  test("search modal closes when clicking backdrop", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");
    const searchModal = page.locator("#search-modal");
    await expect(searchModal).toBeVisible();

    await searchModal.click({ position: { x: 50, y: 50 } });
    await expect(searchModal).toHaveClass(/hidden/);
  });

  test("returns results for valid search query", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");
    await page.locator("#search-input").fill("build");

    const results = page.locator("#search-results");
    await expect(results).not.toContainText("Start typing to search");

    const resultLinks = results.locator("a");
    const count = await resultLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("shows no results for gibberish query", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");
    await page.locator("#search-input").fill("xyznonexistent12345");

    const searchResults = page.locator("#search-results");
    await expect(searchResults).toContainText("No results found");
  });

  test("shows placeholder when query is cleared", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");
    const searchInput = page.locator("#search-input");
    await searchInput.fill("build");
    await searchInput.clear();

    const searchResults = page.locator("#search-results");
    await expect(searchResults).toContainText("Start typing to search");
  });

  test("search result links navigate correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Meta+k");
    await page.locator("#search-input").fill("build");

    const firstResult = page.locator("#search-results a").first();
    await expect(firstResult).toBeVisible();
    await expect(firstResult).toHaveAttribute("href");
  });

  test("command palette opens search modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const cmdTrigger = page.locator("#command-palette-trigger");
    await expect(cmdTrigger).toBeVisible();
    await cmdTrigger.click();

    const searchModal = page.locator("#search-modal");
    await expect(searchModal).toBeVisible();
    await expect(searchModal).not.toHaveClass(/hidden/);
  });

  test.describe("mobile viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("search modal opens on mobile", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const searchTrigger = page.locator("#search-trigger");
      await expect(searchTrigger).toBeVisible();
      await searchTrigger.click();

      const searchModal = page.locator("#search-modal");
      await expect(searchModal).toBeVisible();
      await expect(searchModal).not.toHaveClass(/hidden/);

      const searchInput = page.locator("#search-input");
      await expect(searchInput).toBeFocused();
    });

    test("search returns results on mobile", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await page.keyboard.press("Meta+k");
      await page.locator("#search-input").fill("build");

      const results = page.locator("#search-results");
      const resultLinks = results.locator("a");
      const count = await resultLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("search closes via backdrop click on mobile", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await page.keyboard.press("Meta+k");
      const searchModal = page.locator("#search-modal");
      await expect(searchModal).toBeVisible();

      await searchModal.click({ position: { x: 10, y: 10 } });
      await expect(searchModal).toHaveClass(/hidden/);
    });
  });
});
