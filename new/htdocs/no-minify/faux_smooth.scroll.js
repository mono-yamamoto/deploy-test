window.addEventListener('load', () => {
	// htmlタグを取得
	const html = document.documentElement;
	html.style.scrollBehavior = 'smooth';

	const elements = {
		headerBlock: document.querySelector('.l-header__block') || null,
		header: document.querySelector('.l-header') || null
	};
	console.dir(elements.header);

	const updateScrollPaddingTop = () => {
		const headerTop = elements.headerBlock?.offsetHeight;
		const contentMarginTop = elements.header?.offsetHeight;
		console.log(headerTop, contentMarginTop);
		if (headerTop !== undefined && contentMarginTop !== undefined) {
			html.style.scrollPaddingTop = `${contentMarginTop - headerTop}px`;
		}
	};

	// デバウンス関数
	const debounce = (func, wait) => {
		let timeout;
		return function(...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	};

	// リサイズイベントのハンドラ
	const handleResize = () => {
		elements.headerBlock = document.querySelector('.l-header__block') || null;
		elements.header = document.querySelector('.l-header') || null;
		updateScrollPaddingTop();
	};

	// 初期設定5秒後に実行
	setTimeout(() => {
		updateScrollPaddingTop();
	}, 200);
	

	// デバウンスを適用したリサイズイベントリスナー
	window.addEventListener('resize', debounce(handleResize, 200));
});