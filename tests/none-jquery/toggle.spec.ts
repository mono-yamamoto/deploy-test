import { type Page, expect, test } from "@playwright/test";

test.use({
  // iPhone 12 Proのサイズ
  viewport: { width: 390, height: 844 },
});

// 以下のアコーディオンテストの際には、それぞれのアコーディオンに"アコーディオンn"という文字列をを手動で追加してから確認しています。

test('accordion expansion', async ({ page }) => {
  await page.goto('http://localhost:3000/aa-bb/sample-sitename/index.html');
  const parentTitles = await page.$$('.footer-toggle-menu__ttl--parent');

  // すべての.footer-toggle-menu__listがデフォルトで閉じていて内容（アコーディオンn）が表示されていいないことを確認
  for (let i = 0; i < 4; i++) {
    await expect(page.locator('.footer-toggle-menu__list').getByText(`アコーディオン${i + 1}`)).toBeHidden()
  }

  // .footer-toggle-menu__ttl--parentをクリック。
  for (const title of parentTitles) {
    await title.click();
  }

  // .footer-toggle-menu__listが展開して内容（アコーディオンn）が表示されることを確認。
  for (let i = 0; i < 4; i++) {
    await expect(page.locator('.footer-toggle-menu__list').getByText(`アコーディオン${i + 1}`)).toBeVisible()
  }
  
  // .footer-toggle-menu__ttl--parentをクリック。
  for (const title of parentTitles) {
    await title.click();
  }

  // .footer-toggle-menu__listが閉じて内容（アコーディオンn）が表示されていないことを確認。
  for (let i = 0; i < 4; i++) {
    await expect(page.locator('.footer-toggle-menu__list').getByText(`アコーディオン${i + 1}`)).toBeHidden()
  }
});
