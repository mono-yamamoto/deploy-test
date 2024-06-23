import { type Page, expect, test } from "@playwright/test";

test.describe('ナビゲーションバーのテスト', () => {
  test.beforeEach(async ({ page }) => {
    // テスト対象のページにアクセス
    await page.goto('http://localhost:3000/aa-bb/sample-sitename/index.html');
    // await page.goto('http://localhost:3000/aa-bb/sample-sitename/category2nd-1/index.html');
    // await page.goto('http://localhost:3000/aa-bb/sample-sitename/category2nd-1/category3rd-1/index.html');
    // await page.goto('http://localhost:3000/aa-bb/sample-sitename/category2nd-1/category3rd-1/category4th-1/index.html');
    // await page.goto('http://localhost:3000/aa-bb/sample-sitename/category2nd-1/category3rd-1/category4th-1/category5th-3/index.html');
  });

  //  ページ読み込み後、動的に追加された以下スタイルが適用されている
  //   1. .right-navigation__list li:not(.light-current) ul{display:none}
  //   2. .right-navigation__list li.current ul{display:block}
  //   2. .right-navigation__list li.light-current ul{display:block}
  // 18-30
  test('ページ読み込み後、動的にスタイルが適用されている', async ({ page }) => {
		const styleTags = page.locator('style');
		const styleTagCount = await styleTags.count();

		let foundFirstCSS = false;
		let foundSecondCSS = false;
		let foundThirdCSS = false;

		for (let i = 0; i < styleTagCount; i++) {
			const styleTagText = await styleTags.nth(i).innerText();

			if (styleTagText.includes('.right-navigation__list li:not(.light-current) ul{display:none}')) {
				foundFirstCSS = true;
			}

			if (styleTagText.includes('.right-navigation__list li.current ul{display:block}')) {
				foundSecondCSS = true;
			}

      if (styleTagText.includes('.right-navigation__list li.light-current ul{display:block}')) {
				foundThirdCSS = true;
			}

			if (foundFirstCSS && foundSecondCSS && foundThirdCSS) {
				break;
			}
		}

		await expect(foundFirstCSS).toBe(true);
		await expect(foundSecondCSS).toBe(true);
		await expect(foundThirdCSS).toBe(true);
  });

  test('2階層以上のページの時に、l-header__navigation内の.current .light-currentが適切に設置されている', async ({ page }) => {
    const url = await page.url();
    
    // 2階層未満のページでは.right-navigation__listが存在しないのでテストを実行しない
    if(url.split('/').length < 7) {
			return
    }

		await expect(page.locator('.l-header__navigation')).toBeVisible();
		const lightCurrentLink = await page.locator('.l-header__navigation>ul>li.light-current:not(.light-current-hide)>dl>dd ul li.current a').first();
		const parentElement = await lightCurrentLink.locator('xpath=..').locator('xpath=..');
		const headerListText = await lightCurrentLink.innerText();

    // 2階層のページ
		if(url.split('/').length === 7){
			expect(headerListText).toEqual("第2階層下層有り トップ")
			const hasCurrentClass = await parentElement.evaluate(node => node.classList.contains('current'));
			const hasLightCurrentClass = await parentElement.evaluate(node => node.classList.contains('light-current'));
			await expect(hasCurrentClass).toBe(true);
			await expect(hasLightCurrentClass).toBe(true);

			const secondDirElement = await page.getByText('第2階層下層有り（index用テンプレート）')
			const secondDir = await page.locator('li').filter({ has: secondDirElement }).nth(0)
			await expect(secondDir).toHaveClass('current light-current')

		} else if(url.split('/').length === 8){ // 3階層のページ
			expect(headerListText).toEqual("第3階層下層有り")
			const hasCurrentClass = await parentElement.evaluate(node => node.classList.contains('current'));
			const hasLightCurrentClass = await parentElement.evaluate(node => node.classList.contains('light-current'));
			await expect(hasCurrentClass).toBe(true);
			await expect(hasLightCurrentClass).toBe(true);
			
			const secondDirElement = await page.getByText('第2階層下層有り（index用テンプレート）')
			const secondDir = await page.locator('li').filter({ has: secondDirElement }).nth(0)
			await expect(secondDir).toHaveClass('current light-current')
		} else if(url.split('/').length > 8){ // 3階層以上のページ
			expect(headerListText).toEqual("第3階層下層有り")
		  const parentElement = await lightCurrentLink.locator('xpath=..').locator('xpath=..').locator('xpath=..');
			const hasCurrentClass = await parentElement.evaluate(node => node.classList.contains('current'));
			const hasLightCurrentClass = await parentElement.evaluate(node => node.classList.contains('light-current'));
			await expect(hasCurrentClass).toBe(true);
			await expect(hasLightCurrentClass).toBe(true);
			
			const secondDirElement = await page.getByText('第2階層下層有り（index用テンプレート）')
			const secondDir = await page.locator('li').filter({ has: secondDirElement }).nth(0)
			await expect(secondDir).toHaveClass('current light-current')
		}
  });

	test('3階層以上のページの時に、.row-lg-right-nav__nav内の.current .light-currentが適切に設置されている', async({page}) => {
    const url = await page.url();
		
		// 2階層までのページでは.right-navigation__listが存在しないのでテストを実行しない
		if(url.split('/').length < 8) {
			return
    } else if(url.split('/').length === 8) {
			const currentPagePath = '/' + url.split('/').slice(3).join('/');
			const pCurrentLink = await page.locator('.right-navigation p.current a').first();
			const currentLink = await pCurrentLink.getAttribute('href');
	
			if (currentPagePath !== currentLink) {
				throw new Error('currentPagePathとcurrentLinkが一致していません。');
			}

			const parentElement = await pCurrentLink.locator('xpath=..');
			const hasCurrentClass = await parentElement.evaluate(node => node.classList.contains('current'));
			await expect(hasCurrentClass).toBe(true);

    } else if(url.split('/').length > 8) { // 3階層までのページでは.right-navigation__list配下にul > li.currentが存在しないので以降のテストは実行しない
			const currentList = await page.locator('.right-navigation ul li.current')
			const grandparentElement = await currentList.locator('xpath=..').locator('xpath=..');
			const hasLightCurrentClass = await grandparentElement.evaluate(node => node.classList.contains('light-current'));
			await expect(hasLightCurrentClass).toBe(true);

			const currentPagePath = '/' + url.split('/').slice(3).join('/');
			const pCurrentLink = await page.locator('.right-navigation li.current a').first();
			const currentLink = await pCurrentLink.getAttribute('href');
			if (currentPagePath !== currentLink) {
				throw new Error('currentPagePathとcurrentLinkが一致していません。');
			}
		}

	})

  test('.l-header__navigation.navigation-light>ul>liにhover時のクラス付与、削除が正しく行われる', async ({ page }) => {
		const headerLists = page.locator('.l-header__navigation.navigation-light>ul>li');
		const headerListCount = await headerLists.count();

		for (let i = 0; i < headerListCount; i++) {
			const headerList = await headerLists.nth(i);
			await headerList.hover();
			await expect(headerList).toHaveClass(/light-open/);
			const headerListText = await headerList.innerText();
			// .l-header__navigation.navigation-light>ul>liにdlが含まれている場合、ddにtop:100px（現在のヘッダーの高さ）が付与される
			if (headerListText.includes('第2階層下層有り（index用テンプレート）')) {
				expect(headerList.locator('>dl>dd')).toHaveCSS('top', '100px');
			}
			await page.mouse.move(0, 0);	
			await expect(headerList).not.toHaveClass(/light-open/);
		}
  });

  test('スマホでメニュー内のアコーディオンが正しく動作する', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

		const accordionButton = page.locator('.l-header__navigation.navigation-light>ul>li>dl>dt');
		const accordionItem = page.locator('.l-header__navigation.navigation-light>ul>li>dl>dd');
		const accordionGrandparent = accordionButton.locator('xpath=..').locator('xpath=..');

		await page.locator('.l-header__block__sm-menu-btn').click()
		
		await expect(accordionGrandparent).not.toHaveClass(/light-open/);
		await expect(accordionItem).toBeHidden();
		await accordionButton.click();
		await expect(accordionGrandparent).toHaveClass(/light-open/);
		await expect(accordionItem).toBeVisible();
    await page.waitForTimeout(1000);
		await accordionButton.click();
		await expect(accordionGrandparent).not.toHaveClass(/light-open/);
		await expect(accordionItem).toBeHidden();
  });
});
