import { type Page, expect, test } from "@playwright/test";

test.describe('ナビゲーションバーのテスト', () => {
  test.beforeEach(async ({ page }) => {
    // テスト対象のページにアクセス
    await page.goto('http://localhost:3000/aa-bb/sample-sitename/index.html');
  });

  //  ページ読み込み後、動的に追加された以下スタイルが適用されている
  //   1. .right-navigation__list li:not(.current) ul{display:none};
  //   2. .l-header__navigation:not(.active) > ul > li > dl > dd{visibility:hidden};
  test('ページ読み込み後、動的にスタイルが適用されている', async ({ page }) => {
		const styleTags = page.locator('style');
		const styleTagCount = await styleTags.count();

		let foundFirstCSS = false;
		let foundSecondCSS = false;

		for (let i = 0; i < styleTagCount; i++) {
			const styleTagText = await styleTags.nth(i).innerText();

			if (styleTagText.includes('.right-navigation__list li:not(.current) ul{display:none};')) {
				foundFirstCSS = true;
			}

			if (styleTagText.includes('.l-header__navigation:not(.active) > ul > li > dl > dd{visibility:hidden};')) {
				foundSecondCSS = true;
			}

			if (foundFirstCSS && foundSecondCSS) {
				break;
			}
		}

		await expect(foundFirstCSS).toBe(true);
		await expect(foundSecondCSS).toBe(true);
  });

  test('パンくずリストが表示されている', async ({ page }) => {
    await expect(page.locator('.breadcrumb')).toBeVisible();
  });

  test('.right-navigation__listが設置されている場合の表示と、正しい国パス（aa-bb || aa-en）が設定されている', async ({ page }) => {
    const url = await page.url();
    
    // 2階層までのページでは.right-navigation__listが存在しないのでテストを実行しない
    if(url.split('/').length < 7) {
      return
    }
    
    // .right-navigation__listが表示されているか確認
    await expect(page.locator('.right-navigation__list')).toBeVisible();
    
    // right-navigation__list　a が正しいパスになっているか確認
    // const url = await page.url();
    // const firstLevelPath = url.split('/')[3];
    const firstLevelPath = url.split('/')[3];
    let baseUrl
    firstLevelPath === 'aa-bb' ? baseUrl = /aa-bb/ : baseUrl = /aa-en/
    const rightNavigationLinks = await page.$$('.right-navigation__list a');
    for (let i = 0; i < rightNavigationLinks.length; i++) {
      await expect(page.locator('.right-navigation__list a').nth(i)).toHaveAttribute('href', baseUrl)
    }
  });

  test('メニューが正しく表示される', async ({ page }) => {
    const spMenuButton = await page.locator('.l-header__block__sm-menu-btn');
    const spMenuOverlay = await page.locator('.overlay');
    const headerNavigation = await page.locator('.l-header__navigation')

    const getScrollPosition = async () => {
      const scrollPosition = await page.evaluate(() => window.scrollY);
      return scrollPosition;
    };

    await page.setViewportSize({ width: 390, height: 844 });
		await page.mouse.wheel(0, 320);
		await page.mouse.wheel(0, -20);
    await expect(spMenuButton).toBeVisible();
    await expect(spMenuOverlay).toBeHidden();
    await expect(headerNavigation).toBeHidden();

    // ウィンドウがSPサイズの時かつメニューが表示されている時、ハンバーガーメニューをクリックでメニューとオーバーレイが非表示になり、メニューを展開する前の位置にウィンドウが戻る
    await spMenuButton.click();
    await expect(spMenuOverlay).toBeVisible();
    await expect(headerNavigation).toBeVisible();
    // ウィンドウの位置が最上部になっているか確認
    expect(await getScrollPosition()).toEqual(0);
    // NOTE メニュー内のアコーディオンの処理はlocal-navigation-light.jsのためここでは確認しない

    // ウィンドウがSPサイズの時かつメニューが表示されている時、ハンバーガーメニューをクリックでメニューとオーバーレイが非表示になる
    await spMenuButton.click();
    await expect(spMenuOverlay).toBeHidden();
    await expect(headerNavigation).toBeHidden();
     // ウィンドウの位置がハンバーガーメニューをクリックする前の位置に戻っているか確認
    expect(await getScrollPosition()).toEqual(300);

    // ウィンドウがPCサイズの時に、ハンバーガーメニューが非表示になりメニューが常時表示されている
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(spMenuButton).toBeHidden();
    await expect(spMenuOverlay).toBeHidden();
    await expect(headerNavigation).toBeVisible();
  });

  test('検索フォームが正しく表示される', async ({ page }) => {
    const spSearchButton = await page.locator('.l-header__block__sm-search-btn');
    const SearchForm = await page.locator('.l-header__block__search');

    if(!spSearchButton) return

    // spメニューの表示、非表示確認
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(spSearchButton).toBeVisible();
    await expect(SearchForm).toBeHidden();

    // ウィンドウがSPサイズの時かつ検索フォームが非表示の時、虫眼鏡ボタンをクリックで表示される
    await spSearchButton.click();
    await expect(SearchForm).toBeVisible();
    // NOTE: フォームの動作確認はするべき？そもそも検索してみても動作しないっぽい

    // ウィンドウがSPサイズの時かつ検索フォームが表示されている時、虫眼鏡ボタンをクリックで非表示になる
    await spSearchButton.click();
    await expect(SearchForm).toBeHidden();

    // ウィンドウがPCサイズの時に、虫眼鏡ボタンが非表示になりフォームが常時表示されている
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(spSearchButton).toBeHidden();
    await expect(SearchForm).toBeVisible();
  });

	test('ナビゲーションヘッダーの動作確認', async ({ page }) => {
    const navigationHeader = await page.locator('.l-header');
		const spHeaderHeight = "45px"
		const pcHeaderHeight = "63px"
		
    // ウィンドウがSPサイズの時に下にスクロールするとナビゲーションヘッダーがページ上部に固定されるが、見えない位置にポジショニングされる
		await page.setViewportSize({ width: 390, height: 844 });
		await page.mouse.wheel(0, 300);
    await expect(navigationHeader).toHaveCSS('position', `fixed`);

    // ウィンドウがSPサイズの時に上にスクロールするとページ上部にポジショニングされる
		await expect(navigationHeader).toHaveCSS('top', `-${spHeaderHeight}`);	
		await page.mouse.wheel(0, -20);
		await expect(navigationHeader).toHaveCSS('top', `0px`);	

    // ウィンドウがSPサイズの時にページ最上部にスクロールするとナビゲーションヘッダーのページ上部固定が解除される
    await page.keyboard.press('Home');
    await expect(navigationHeader).not.toHaveCSS('position', `fixed`);

    // ウィンドウがPCサイズの時に下にスクロールするとナビゲーションヘッダーがページ上部に固定され.l-header__blockが見えない位置にポジショニングされる
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.mouse.wheel(0, 300);
    await expect(navigationHeader).toHaveCSS('position', `fixed`);
		await expect(navigationHeader).toHaveCSS('top', `-${pcHeaderHeight}`);	

		// ウィンドウがSPサイズの時に上にスクロールするとl-header__blockが見える位置にポジショニングされる
		await page.mouse.wheel(0, -20);
		await expect(navigationHeader).toHaveCSS('top', `0px`);	

    // ウィンドウがPCサイズの時にページ最上部にスクロールするとナビゲーションヘッダーのページ上部固定が解除される
    await page.keyboard.press('Home');
    await expect(navigationHeader).not.toHaveCSS('position', `fixed`);
  });

   test('pcメニューがマウスオーバーで表示される', async ({ page }) => {
    await expect(page.locator('.l-header__navigation')).toBeVisible();

    // .l-header__navigation > ul > li.currentにhoverすると.l-header__navigation > ul > li > dl > ddが表示される
    await page.locator('.l-header__navigation > ul > li').nth(1).hover();
    await expect(page.locator('.l-header__navigation > ul > li > dl > dd')).toBeVisible();
    
    // .l-header__navigation > ul > li > dl > dd > ul > li.currentにhoverすると.l-header__navigation > ul > li > dl > dd > ul > li > dl > ddが表示される
    await page.locator('.l-header__navigation > ul > li > dl > dd > ul > li').nth(1).hover();
    await expect(page.locator('.l-header__navigation > ul > li > dl > dd > ul > li > dl > dd')).toBeVisible();
    // NOTE 3階層以下のページの場合グレーメニューが最初から表示されるが、その実装はlocal-navigation-light.jsのためここでは確認しない
  });
});
