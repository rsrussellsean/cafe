/**
 * Visual verification for the katperry site.
 *
 * Usage: start the server first (npm run dev or next start), then:
 *   node scripts/verify.mjs            (defaults to http://localhost:3001)
 *   BASE_URL=http://localhost:3000 node scripts/verify.mjs
 *
 * Saves screenshots to ./screenshots and asserts:
 *  1. menu hover preview appears on hover
 *  2. preview hides when the cursor leaves the row
 *  3. preview hides when scrolling away while still hovering
 *  4. the pinned Space gallery fits inside the viewport (bottom image visible)
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3001";
const VIEW = { width: 1440, height: 900 };
mkdirSync("screenshots", { recursive: true });

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEW });

const scrollTo = async (y) => {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(900);
};
const sectionTop = (sel) =>
  page.evaluate(
    (s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY,
    sel,
  );
const floatOpacity = () =>
  page.evaluate(
    () => parseFloat(getComputedStyle(document.querySelector(".menu-float")).opacity),
  );

await page.goto(BASE, { waitUntil: "load" });
await page.waitForTimeout(2500); // let fonts/images/intro animation settle
await page.screenshot({ path: "screenshots/01-hero.png" });

await scrollTo(await sectionTop("#story"));
await page.waitForTimeout(800);
await page.screenshot({ path: "screenshots/02-story.png" });

// --- menu hover preview ---
await scrollTo(await sectionTop("#menu"));
const row = page.locator("[data-menu-row]").first();
await row.hover();
await page.waitForTimeout(700);
const shown = await floatOpacity();
check("menu preview appears on hover", shown > 0.5, `opacity=${shown}`);
await page.screenshot({ path: "screenshots/03-menu-hover.png" });

// leaving the row hides it
await page.mouse.move(VIEW.width / 2, 60);
await page.waitForTimeout(600);
const afterRowLeave = await floatOpacity();
check("menu preview hides on row leave", afterRowLeave < 0.1, `opacity=${afterRowLeave}`);

// scrolling away while hovering hides it (mouseleave never fires here)
await row.hover();
await page.waitForTimeout(700);
await scrollTo(0);
await page.waitForTimeout(600);
const afterScrollAway = await floatOpacity();
check(
  "menu preview hides when scrolling out of section",
  afterScrollAway < 0.1,
  `opacity=${afterScrollAway}`,
);
await page.screenshot({ path: "screenshots/04-hero-after-scroll-back.png" });

// --- pinned Space gallery fits the viewport ---
const spaceTop = await sectionTop("#space");
await scrollTo(spaceTop);
await page.waitForTimeout(800);
const fit = await page.evaluate(() => {
  const figures = [...document.querySelectorAll("#space figure")];
  const bottoms = figures
    .map((f) => f.getBoundingClientRect())
    .filter((r) => r.left < window.innerWidth && r.right > 0)
    .map((r) => r.bottom);
  return { maxBottom: Math.max(...bottoms), viewport: window.innerHeight };
});
check(
  "space gallery images fully visible while pinned",
  fit.maxBottom <= fit.viewport + 2,
  `lowest image bottom=${Math.round(fit.maxBottom)}px, viewport=${fit.viewport}px`,
);
await page.screenshot({ path: "screenshots/05-space-pinned-start.png" });

// scroll through the horizontal pin and capture the end
await scrollTo(spaceTop + 2200);
await page.screenshot({ path: "screenshots/06-space-pinned-end.png" });

await scrollTo(await sectionTop("#visit"));
await page.screenshot({ path: "screenshots/07-visit.png" });

await page.evaluate(() =>
  window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
);
await page.waitForTimeout(900);
await page.screenshot({ path: "screenshots/08-footer.png" });

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed. Screenshots in ./screenshots`,
);
process.exit(failed.length ? 1 : 0);
