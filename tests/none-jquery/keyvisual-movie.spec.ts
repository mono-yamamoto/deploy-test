import { type Page, expect, test } from "@playwright/test";
// chromiumだと動画が上手く動作しないためwebkitでテスト。非jquery前からこの現象が起きていた。
test.use({ browserName: 'webkit' });

test.describe('キービジュアルのテスト', () => {
  test.beforeEach(async ({ page }) => {
    // テスト対象のページにアクセス
    await page.goto('http://localhost:3000/aa-bb/sample-sitename/index.html');
  });

  // ModalVideo関数
  test('モーダルが正しく動作する', async ({ page }) => {
		// モーダルビデオがクリックで正しく開くか
    await page.click('.keyvisual_video ._play');
    await expect(page.locator('.modal-video')).toBeVisible();

    // モーダルビデオが正しいビデオURLをロードするか
    const iframeSrc = await page.locator('.modal-video iframe').getAttribute('src');
    expect(iframeSrc).toContain('//players.brightcove.net/5513379533001/Hy6eX6RwW_default/index.html?videoId=5724518295001');

    // モーダルビデオが閉じるボタンで正しく閉じるか
    await page.click('.modal-video-close-btn');
    await expect(page.locator('.modal-video')).not.toBeVisible();

    // モーダルビデオが背景クリックで正しく閉じるか
    await page.click('.keyvisual_video ._play');
    // 背景クリック
    await page.mouse.click(0, 0);	
    await expect(page.locator('.modal-video')).not.toBeVisible();

    // モーダルビデオが正しいIDを持つか
    await page.click('.keyvisual_video ._play');
    const modalId = await page.locator('.modal-video').getAttribute('id');
    expect(modalId).toMatch(/^[A-Z0-9]{13}$/);
    await page.click('.modal-video-close-btn');

    // モーダルビデオが埋め込みコードを正しく処理するか
    // NOTE 旧383行目 data-embed="_brightcove_modal"にした場合の処理はもともと壊れているっぽいのでテストは行わない（そもそも設定されているページはない）
    // NOTE 旧428行目も同様
    // await page.click('.keyvisual_video ._play[data-embed="_brightcove_modal"]');

    // フォーカスが正しく動作しているか
    await page.click('.keyvisual_video ._play');
    await expect(page.locator('.modal-video')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('.modal-video-close-btn')).toBeFocused();
    await page.click('.modal-video-close-btn');
    // NOTE ._playにフォーカスするコードがあるが、p要素且つtabindexが付与されていないのでフォーカスができない仕様になっているためテストはできない
    // await expect(page.locator('._play')).toBeFocused();
  });

  // heightControl関数
  test('キービジュアルの高さが正しく計算されている', async ({ page }) => {
    const heightPc = 28.90625;
    const heightSp = 97.22222222222222;
    let keyVisualTestHeight: number | null | undefined
    let keyVisualHeight
    
    const calcHeight = async () => {
      keyVisualTestHeight = await page.evaluate(({ heightPc, heightSp }) => {
        const keyVisual = document.querySelector('.keyvisual_video');
        if (!keyVisual) return null;

        if (window.matchMedia('(min-width:720px)').matches) {
          return Math.floor(keyVisual.clientWidth * (heightPc / 100));
        } else if (window.matchMedia('(max-width:719px)').matches) {
          return Math.floor(keyVisual.clientWidth * (heightSp / 100));
        }
      }, { heightPc, heightSp });
    }

    await page.setViewportSize({ width: 1280, height: 720 });
    calcHeight()
    keyVisualHeight = await page.locator('.keyvisual_video').evaluate(el => {
      const styleHeight = el.style.height;
      const height = styleHeight.replace('px', "")
      return Math.floor(Number(height));
    });
    await expect(keyVisualTestHeight).toEqual(keyVisualHeight);

    await page.setViewportSize({ width: 719, height: 720 });
    calcHeight()
    keyVisualHeight = await page.locator('.keyvisual_video').evaluate(el => {
      const styleHeight = el.style.height;
      const height = styleHeight.replace('px', "")
      return Math.floor(Number(height));
    });
    await expect(keyVisualTestHeight).toEqual(keyVisualHeight);

    await page.setViewportSize({ width: 390, height: 844 });
    calcHeight()
    keyVisualHeight = await page.locator('.keyvisual_video').evaluate(el => {
      const styleHeight = el.style.height;
      const height = styleHeight.replace('px', "")
      return Math.floor(Number(height));
    });
    await expect(keyVisualTestHeight).toEqual(keyVisualHeight);
  })

  // modalPaddingControl関数
  test('モーダルのpaddingが正しく設定される', async ({ page }) => {
    const modalBody = await page.locator('.modal-video-body')
    await page.click('.keyvisual_video ._play');
    await expect(page.locator('.modal-video')).toBeVisible();
    
		// pcではpaddingが50px
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(modalBody).toHaveCSS('padding', '50px')
    
    // spではpaddingが0px
    await page.setViewportSize({ width: 390, height: 720 });
    await expect(modalBody).toHaveCSS('padding', '0px')
  });

  test('動画停止ボタンが動作する', async ({ page }) => {
    const moviePauseButton = await page.locator('.keyvisual_pause')
    await moviePauseButton.click();
    await expect(moviePauseButton).toHaveClass(/paused/);

    await moviePauseButton.click();
    await expect(moviePauseButton).not.toHaveClass(/paused/);
  });
});
