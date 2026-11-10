import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Keep layout checks independent of third-party embeds and their trackers.
  await page.route(/https:\/\/(open\.spotify\.com|www\.openstreetmap\.org)\//, route => route.fulfill({ contentType: "text/html", body: "<html><body>Third-party player/map test frame</body></html>" }));
});

test("professional content, all sections, navigation, and narrow layouts", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/");
  await expect(page).toHaveTitle("Hire Jose Jerez | IT Operations & Automation");
  await expect(page.locator("h1")).toContainText("Simplifying");
  for (const value of ["5,600+", "< 2h 30m", "< 12 min", "3,500–5,000"]) await expect(page.locator(".metrics-grid")).toContainText(value);
  for (const id of ["home", "projects", "skills", "work-history", "certifications", "trails", "dugout", "grill", "music", "ask", "about", "contact"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator(".project-card")).toHaveCount(4);
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "All sections" }).getByRole("link")).toHaveCount(13);
  await page.getByRole("navigation", { name: "All sections" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("resume page and a real PDF download", async ({ page, request }) => {
  await page.goto("/resume");
  await expect(page).toHaveTitle("Résumé | Jose Jerez");
  await expect(page.getByRole("heading", { name: "Jose Jerez", exact: true })).toBeVisible();
  const pdf = await request.get("/jose-jerez-resume.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 8).toString()).toBe("%PDF-1.4");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download one-page PDF" }).click();
  expect((await download).suggestedFilename()).toBe("jose-jerez-resume.pdf");
});

test("Spotify artist selection, map connections, and rotating jokes", async ({ page }) => {
  await page.goto("/?view=personal");
  await expect(page.locator("#music iframe")).toHaveAttribute("src", /open\.spotify\.com\/embed\/(artist|playlist)\//);
  if (await page.getByRole("button", { name: "blink-182", exact: true }).count()) {
    await page.getByRole("button", { name: "blink-182", exact: true }).click();
    await expect(page.locator("#music iframe")).toHaveAttribute("src", /6FBDaR13swtiWwGhX1WQsP/);
  }
  await expect(page.locator("#grill iframe")).toHaveAttribute("src", /openstreetmap|google\.com\/maps\/embed/);
  await expect(page.locator("#trails iframe")).toHaveAttribute("src", /openstreetmap|google\.com\/maps\/embed/);
  const joke = await page.locator(".joke p").innerText();
  await page.getByRole("button", { name: "Another one" }).click();
  await expect(page.locator(".joke p")).not.toHaveText(joke);
  await page.getByRole("button", { name: "Pause rotation" }).click();
  await expect(page.getByRole("button", { name: "Resume rotation" })).toHaveAttribute("aria-pressed", "true");
});

test("shareable tabs keep the same music iframe, retain chat, and support keyboard and history", async ({ page }) => {
  await page.goto("/?view=personal");
  await expect(page.getByRole("tab", { name: /^Personal/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#panel-personal")).toBeVisible();
  await expect(page.locator("#panel-professional")).toBeHidden();
  await expect(page.frameLocator("#music iframe").locator("body")).toContainText("Third-party player/map test frame");
  await page.locator("#music iframe").evaluate(frame => { frame.dataset.retained = "yes"; frame.dataset.reloads = "0"; frame.addEventListener("load", () => { frame.dataset.reloads = String(Number(frame.dataset.reloads) + 1); }); });
  await page.getByRole("tab", { name: /^Professional/ }).click();
  await expect(page).toHaveURL(/view=professional/);
  await expect(page.locator("#panel-personal")).toBeHidden();
  await page.getByLabel("Your question for Ask Jose").fill("An unfinished question about IAM");
  await page.getByRole("tab", { name: /^Professional/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /^Personal/ })).toBeFocused();
  await expect(page.locator("#music iframe")).toHaveAttribute("data-retained", "yes");
  await expect(page.locator("#music iframe")).toHaveAttribute("data-reloads", "0");
  await page.goBack();
  await expect(page.getByRole("tab", { name: /^Professional/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Your question for Ask Jose")).toHaveValue("An unfinished question about IAM");
  const metrics = await page.locator(".hub-metrics").boundingBox();
  const ask = await page.locator("#ask").boundingBox();
  expect(Math.abs(ask!.y - metrics!.y)).toBeLessThan(350);
});

test("legacy personal links open the right tab, maps can expand, and JJ reveals a bonus joke", async ({ page }) => {
  await page.goto("/#dugout");
  await expect(page.getByRole("tab", { name: /^Personal/ })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("navigation", { name: "All sections" }).getByRole("link", { name: "Trail Log" }).click();
  await expect(page.locator("#trails")).toBeVisible();
  await expect(page.locator("#trails").locator("..")).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Reveal a bonus help desk joke" }).click();
  await expect(page.locator(".bonus-joke")).toContainText("Chuck Norris");
  await page.getByRole("button", { name: "Dismiss bonus joke" }).click();
  await expect(page.locator(".bonus-joke")).toHaveCount(0);
});

test("switching tabs restores each scroll position and Personal fits narrow screens", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: 850, behavior: "instant" }));
  const previous = await page.evaluate(() => window.scrollY);
  await page.getByRole("tab", { name: /^Personal/ }).click();
  await expect(page.locator("#panel-personal")).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.getByRole("tab", { name: /^Professional/ }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(previous);
  await page.getByRole("tab", { name: /^Personal/ }).click();
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("recommendation submission requires consent and confirms private review", async ({ page }) => {
  let submissions = 0;
  await page.route("**/api/recommendations", route => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      expect(body.consent).toBe(true); expect(body.email).toBe("private@example.test"); submissions++;
      return route.fulfill({ status: 201, json: { message: "Thank you! Your recommendation is private until Jose approves it." } });
    }
    return route.fulfill({ json: { items: [] } });
  });
  await page.goto("/recommendations#recommend");
  await page.getByLabel("Your name", { exact: true }).fill("A Test Colleague");
  await page.getByLabel(/^Email/).fill("private@example.test");
  await page.getByLabel("Title or role").fill("IT Manager");
  await page.getByLabel("How do you know Jose?").fill("Former project partner");
  await page.getByLabel("Your recommendation").fill("Jose made our workflows clearer and easier for the whole team.");
  await page.getByRole("button", { name: "Send for Jose’s approval" }).click();
  expect(submissions).toBe(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send for Jose’s approval" }).click();
  await expect(page.locator("#recommend").getByRole("status")).toContainText("private until Jose approves");
  expect(submissions).toBe(1);
  await expect(page.locator(".recommendation-card")).toHaveCount(0);
});

test("owner can approve and unpublish a recommendation through the private inbox", async ({ page, request }) => {
  expect((await request.get("/api/admin/recommendations")).status()).toBe(401);
  let signedIn = false;
  const item = { id: "11111111-1111-4111-8111-111111111111", name: "Test Colleague", email: "private@example.test", title: "IT Manager", relationship: "Project partner", message: "Jose built clear workflows that made support much easier for the whole team.", consent: true, status: "pending", createdAt: new Date().toISOString() };
  await page.route("**/api/admin/session", route => { signedIn = route.request().method() !== "DELETE"; return route.fulfill({ json: { ok: true } }); });
  await page.route("**/api/admin/recommendations", route => {
    if (!signedIn) return route.fulfill({ status: 401, json: { error: "Please sign in" } });
    if (route.request().method() === "PATCH") { item.status = route.request().postDataJSON().status; return route.fulfill({ json: { ok: true } }); }
    return route.fulfill({ json: { items: [item] } });
  });
  await page.goto("/admin/recommendations");
  await page.getByLabel("Owner password").fill("test-only-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Private contact:")).toContainText(item.email);
  await page.getByRole("button", { name: "Approve & publish" }).click();
  await expect(page.getByRole("status")).toContainText("now public");
  await page.getByRole("button", { name: /^Published/ }).click();
  await page.getByRole("button", { name: "Unpublish", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("not public");
  expect(item.status).toBe("rejected");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByLabel("Owner password")).toBeVisible();
});

test("chat renders real response content and preserves input on failure", async ({ page }) => {
  await page.route("**/api/ask", route => route.fulfill({ json: { answer: "Jose has built asset recovery and verification workflows." } }));
  await page.goto("/#ask");
  await page.getByRole("button", { name: "What has Jose automated?" }).click();
  await expect(page.getByRole("log")).toContainText("Jose has built asset recovery");
  await page.route("**/api/ask", route => route.fulfill({ status: 503, json: { error: "AI chat isn’t connected yet. Please email Jose." } }));
  await page.getByLabel("Your question for Ask Jose").fill("Tell me about IAM.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.locator("#ask").getByRole("alert")).toContainText("isn’t connected");
  await expect(page.getByLabel("Your question for Ask Jose")).toHaveValue("Tell me about IAM.");
});

test("sports scores, real game state labels, and feed failure", async ({ page }) => {
  await page.route("**/api/sports", route => route.fulfill({ json: { checkedAt: new Date().toISOString(), teams: [{ id: "lad", league: "MLB", games: [{ id: "test-game", name: "Dodgers at Giants", date: new Date().toISOString(), state: "in", status: "Top 4th", scores: "LAD 3 · SF 1" }], error: null }] } }));
  await page.goto("/#dugout");
  await expect(page.locator(".score-card").first()).toContainText("LIVE · Top 4th");
  await expect(page.locator(".score-card").first()).toContainText("LAD 3 · SF 1");
  await page.route("**/api/sports", route => route.fulfill({ status: 503 }));
  await page.getByRole("button", { name: "Refresh scores" }).click();
  await expect(page.locator("#dugout")).toContainText("couldn’t connect");
  await expect(page.locator("#dugout a[href*='espn.com']")).toHaveCount(4);
});
