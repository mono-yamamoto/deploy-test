import { type Page, expect, test } from "@playwright/test";

// 以下のタブ切り替えテストの際には、それぞれのタブコンテント（.tab-content）内に"タブコンテンツn"という文字列をを手動で追加してから確認しています。

test("tab content", async ({ page }) => {
  await page.goto("http://localhost:3000/aa-bb/sample-sitename/category2nd-2/index.html");
  const tabNavigation = await page.locator(".tab-navigation > li");
  const tabContent = await page.locator(".tab-content");

  // 1つ目のタブコンテンツが表示（.tab-navigationの中の1つ目のliに.currentがついていて、.tab-content内に"タブコンテント1"が表示されている）されていて2つ目のタブコンテンツが非表示なことを確認。
  await expect(tabNavigation.first()).toHaveClass("current");
  await expect(tabContent.first().getByText("タブコンテンツ1")).toBeVisible();
  await expect(tabContent.nth(1).getByText("タブコンテンツ2")).toBeHidden();

  // .tab-navigationの中の2つ目のliをクリック。
  await tabNavigation.nth(1).click();

  // 2つ目のタブコンテンツが表示（.tab-navigationの中の2つ目のliに.currentがついていて、.tab-content内に"タブコンテント2"が表示されている）されていて1つ目のタブコンテンツが非表示なことを確認。
  await expect(tabNavigation.nth(1)).toHaveClass("current");
  await expect(tabContent.nth(1).getByText("タブコンテンツ2")).toBeVisible();
  await expect(tabContent.first().getByText("タブコンテンツ1")).toBeHidden();

  // .tab-navigationの中の1つ目のliをクリック。
  await tabNavigation.first().click();

  // 1つ目のタブコンテンツが表示（.tab-navigationの中の1つ目のliに.currentがついていて、.tab-content内に"タブコンテント1"が表示されている）されていて2つ目のタブコンテンツが非表示なことを確認。
  await expect(tabNavigation.first()).toHaveClass("current");
  await expect(tabContent.first().getByText("タブコンテンツ1")).toBeVisible();
  await expect(tabContent.nth(1).getByText("タブコンテンツ2")).toBeHidden();
});
