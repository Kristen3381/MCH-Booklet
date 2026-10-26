import { test, expect } from "@playwright/test";

test.describe("Kitabu Living Style Guide Smoke Suite", () => {
  test("loads /styleguide and renders de-officialised tokens, stamps, and offline card", async ({
    page,
  }) => {
    await page.goto("/styleguide");

    // 1. Verify Page Title & Kitabu Branding
    await expect(page).toHaveTitle(/Kitabu | Design System & Living Style Guide/);
    await expect(
      page.getByRole("heading", {
        name: /The Booklet's Digital Companion/i,
      })
    ).toBeVisible();

    // 2. Verify Demo Data Mark
    await expect(page.getByText(/Demo data/i).first()).toBeVisible();

    // 3. Verify Companion Tenet
    await expect(
      page.getByText(/Always instruct the patient to carry their physical paper booklet/i)
    ).toBeVisible();

    // 4. Verify No LaTeX notation in visible copy
    const pageText = await page.locator("body").innerText();
    expect(pageText).not.toContain("$\\ge");
    expect(pageText).not.toContain("\\ge");

    // 5. Verify Inked Facility Stamp (De-officialised, fictional facility)
    await expect(page.getByText("Mto Mukuu Health Centre").first()).toBeVisible();
    await expect(page.getByText(/FACILITY CONFIRMED/i).first()).toBeVisible();

    // 6. Verify Overlapping Stamp Vignette on Clinic Register
    await expect(
      page.getByText(/Real-Use Vignette: Inked Stamp Overlapping Clinic Register Entry/i)
    ).toBeVisible();

    // 7. Verify Winding Journey Path (Single language heading in English)
    await expect(page.getByText("Your Pregnancy Journey")).toBeVisible();
    expect(pageText).not.toContain("Safari Yako ya Ujauzito / ANC Journey");
    expect(pageText).not.toContain("Kiswahili:");

    const visit1Btn = page.getByRole("button", { name: /Visit 1/i }).first();
    await expect(visit1Btn).toBeVisible();
    await visit1Btn.click();
    await expect(page.getByText("1st Contact: Early Booking")).toBeVisible();

    // 8. Verify Ledger Registers with Ruled Lines
    await expect(page.getByText(/CLINIC REGISTER • PART 3/i)).toBeVisible();
    await expect(page.getByText("Hemoglobin [Mass/volume] in Blood")).toBeVisible();

    // 9. Verify Perforated Lab Card
    await expect(page.getByText("Full Hemogram & Platelets")).toBeVisible();

    // 10. Verify Offline Emergency Card
    await expect(page.getByText(/Critical Emergency Card/i).first()).toBeVisible();
    await expect(page.getByText("O+")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Amina Wanjiku Muthoni" })
    ).toBeVisible();

    // 11. Verify Bilingual Toggle Switch (Switches to single-language Kiswahili)
    const kiswahiliButton = page.getByRole("button", { name: "Kiswahili" });
    await expect(kiswahiliButton).toBeVisible();
    await kiswahiliButton.click();
    await expect(kiswahiliButton).toHaveAttribute("aria-pressed", "true");

    // Stamp switches to Kiswahili confirmed
    await expect(page.getByText("IMETHIBITISHWA KITUONI").first()).toBeVisible();
    // Journey switches to pure Kiswahili without English slash
    await expect(page.getByText("Safari Yako ya Ujauzito")).toBeVisible();
    // Register headers switch to Kiswahili
    await expect(page.getByText("DAFTARI LA KLINIKI • SEHEMU YA 3")).toBeVisible();
  });

  test("verifies 360px mobile viewport in English and Kiswahili without horizontal overflow", async ({
    page,
  }) => {
    // Set 360px mobile viewport (standard low-end Android)
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/styleguide");

    // Check no horizontal overflow in English
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Verify touch target size on interactive buttons (>= 48px)
    const visitBtnBox = await page.getByRole("button", { name: /Visit 1/i }).first().boundingBox();
    expect(visitBtnBox).not.toBeNull();
    if (visitBtnBox) {
      expect(visitBtnBox.height).toBeGreaterThanOrEqual(48);
      expect(visitBtnBox.width).toBeGreaterThanOrEqual(48);
    }

    // Verify Kiswahili on 360px mobile
    const swButton = page.getByRole("button", { name: "Kiswahili" });
    await swButton.click();

    const hasHorizontalOverflowSw = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflowSw).toBe(false);

    // Verify stamp remains visible and readable at 360px
    await expect(page.getByText("Mto Mukuu Health Centre").first()).toBeVisible();
    await expect(page.getByText("IMETHIBITISHWA KITUONI").first()).toBeVisible();
  });
});
