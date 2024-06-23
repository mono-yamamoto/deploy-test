/* --------------------------------------------------------------------------------------
	2021/08/10 KMJ_CODING-355 【サイト内検索】流入元判別タグ（JSによる動的取得）

	#4128 【サイト内検索】SP時画像リンク切れ修正(2018-03-30)
	#4918 【ランプロ】Facebookからのリンク不具合対応(2018-07-26)
	#5202 旧サイトへのcookieアラート表示(2018-10-09)
	#5197 【パーツ追加】画像上で右クリックをさせない
	#7391 【パーツ追加】アコーディオンパーツ作成 (2018-7-05)
 	#7535 【IR】【CGW】表示速度改善施策（追加施策）
 	#9465 【調査依頼】【HC】IEでのアコーディオンの挙動
 	#10369 フェーズ4（グロナビの遅延読み込み全体実装）
	2024.07 jqueryメソッドを除去
-------------------------------------------------------------------------------------- */
// helper functions
// debounce resize eventの連続発火を防ぐ
function debounce(func, wait) {
	let timeout;
	return function () {
		const context = this,
			args = arguments;
		const later = function () {
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// slideToggle
const removeStyleProperties = (element, properties) => {
	properties.forEach((property) => {
		element.style.removeProperty(property);
	});
};
const slideDown = (element, speed = 400) => {
	const elem = element;

	if (elem.classList.contains("is-sliding")) {
		return;
	}
	if (window.getComputedStyle(elem).display !== "none") {
		return;
	}
	elem.classList.add("is-sliding");
	elem.previousElementSibling.classList.add("is-open");
	elem.style.removeProperty("display");
	const { display } = window.getComputedStyle(elem);
	if (display === "none") {
		elem.style.display = "block";
	}
	const height = elem.offsetHeight;
	elem.style.overflow = "hidden";
	elem.style.height = 0;
	elem.style.paddingTop = 0;
	elem.style.paddingBottom = 0;
	elem.style.marginTop = 0;
	elem.style.marginBottom = 0;

	setTimeout(() => {
		elem.style.transitionProperty =
			"height, margin-top, margin-bottom, padding-top, padding-bottom";
		elem.style.transitionDuration = `${speed}ms`;
		elem.style.height = `${height}px`;
		removeStyleProperties(elem, [
			"margin-top",
			"margin-bottom",
			"padding-top",
			"padding-bottom",
		]);
	}, 0);

	setTimeout(() => {
		removeStyleProperties(elem, [
			"height",
			"overflow",
			"transition-property",
			"transition-duration",
		]);
		elem.classList.remove("is-sliding");
	}, speed);
};

const slideUp = (element, speed = 400) => {
	const elem = element;

	if (elem.classList.contains("is-sliding")) {
		return;
	}
	if (window.getComputedStyle(elem).display === "none") {
		return;
	}
	elem.classList.add("is-sliding");
	elem.previousElementSibling.classList.remove("is-open");
	elem.style.overflow = "hidden";
	elem.style.height = `${elem.offsetHeight}px`;

	setTimeout(() => {
		elem.style.transitionProperty =
			"height, margin-top, margin-bottom, padding-top, padding-bottom";
		elem.style.transitionDuration = `${speed}ms`;
		elem.style.height = 0;
		elem.style.paddingTop = 0;
		elem.style.paddingBottom = 0;
		elem.style.marginTop = 0;
		elem.style.marginBottom = 0;
	}, 0);

	setTimeout(() => {
		elem.style.display = "none";

		removeStyleProperties(elem, [
			"height",
			"overflow",
			"transition-property",
			"transition-duration",
			"margin-top",
			"margin-bottom",
			"padding-top",
			"padding-bottom",
		]);
		elem.classList.remove("is-sliding");
	}, speed);
};

const vanillaSlideToggle = (element, speed = 400) => {
	const elem = element;

	if (window.getComputedStyle(elem).display === "none") {
		slideDown(elem, speed);
	} else {
		slideUp(elem, speed);
	}
};

(function ($) {
	let $header__function__menu_span_img = {};
	let _header__function__menu_span_img_orgPass = "";
	let $closeSecondWrap_span = {};

	var clickEvent = "click";
	var overEvent = "mouseover focusin";
	var outEvent = "mouseout focusout";
	var revent = "resize"; //#4918

	var uas = navigator.userAgent;
	var toucDevice = false;
	if (uas.search(/iPhone|iPod|iPad|Android|Windows.*Phone/i) !== -1) {
		toucDevice = true;
	}

	if ("ontouchstart" in window) {
		clickEvent = "touchend";
		overEvent = "touchend focusin";
		outEvent = "focusout";
	} else if (uas.search(/Edge/) !== -1 || uas.search(/Tablet/) !== -1) {
		//win系tablet or Edge
		clickEvent = "click touchend";
		overEvent = "mouseover focusin";
		outEvent = null;
	}
	if (uas.search(/iPhone|iPod|iPad/i) !== -1) {
		revent = "orientationchange"; //#4918
	}

	// Dom ready で実行
	(function () {
		$header__function__menu_span_img = document.querySelector(
			".header__function__menu button img",
		);

		$closeSecondWrap_span = document.querySelectorAll(
			".header__nav > ul > li .second-wrap .close-second-wrap span",
		);

		//#4128
		if (decodeURI(location.href).search("search.x") !== -1) {
			let int__header__function__menu_span_img = setInterval(function () {
				if ($header__function__menu_span_img) {
					let _src = $header__function__menu_span_img.getAttribute("src");
					if (_src.startsWith("//") || _src.startsWith("http")) {
						let srcArr = _src.split("/");
						_header__function__menu_span_img_orgPass = _src.replace(
							srcArr[srcArr.length - 1],
							"",
						);

						clearInterval(int__header__function__menu_span_img);
					}
				}
			}, 100);
		} else {
			if ($header__function__menu_span_img) {
				let srcX = $header__function__menu_span_img.src;

				if (srcX) {
					let srcArr = srcX.split("/");
					_header__function__menu_span_img_orgPass = srcX.replace(
						srcArr[srcArr.length - 1],
						"",
					);
				}
			}
		}

		function set__header__function__menu_span_img(imgPass) {
			if (_header__function__menu_span_img_orgPass !== "") {
				$header__function__menu_span_img.src =
					_header__function__menu_span_img_orgPass + imgPass;
			}
		}

		// without jquery
		(function () {
			var imgContextDisable = document.querySelectorAll(
				"img.img-context-disable",
			); //静的画像

			var contextDisableSlick = document.querySelectorAll(
				".img-context-disable-keyvisual",
			); //キービジュアル系
			var contextDisableSlickObj = [];
			var slicInt = [];
			var slicIntCnt = [];

			var contextDisableSlider = document.querySelectorAll(
				".img-context-disable-slider",
			); //製品系
			var contextDisableSliderObj = [];
			var slidInt = [];
			var slidIntCnt = [];
			var props = {
				"-webkit-touch-callout": "none",
				"user-select": "none",
				"-webkit-user-select": "none",
				"-ms-user-select": "none",
			};

			//静的画像
			if (imgContextDisable.length) {
				imgContextDisable.forEach(function (img) {
					img.style.cssText = Object.entries(props)
						.map(([k, v]) => `${k}: ${v}`)
						.join(";");
					img.addEventListener("contextmenu", function (e) {
						e.preventDefault();
					});
					img.addEventListener("dragstart", function (e) {
						e.preventDefault();
					});
				});
			}

			//キービジュアル系
			if (contextDisableSlick.length) {
				contextDisableSlick.forEach(function (slick, i) {
					contextDisableSlickObj[i] = slick;
					slick.querySelectorAll("img").forEach(function (img) {
						img.style.cssText = Object.entries(props)
							.map(([k, v]) => `${k}: ${v}`)
							.join(";");
					});
					slicIntCnt[i] = 0;
					slicInt[i] = setInterval(function () {
						if (
							contextDisableSlickObj[i].classList.contains("slick-initialized")
						) {
							clearInterval(slicInt[i]);
							contextDisableSlickObj[i]
								.querySelectorAll("img")
								.forEach(function (img) {
									img.style.cssText = Object.entries(props)
										.map(([k, v]) => `${k}: ${v}`)
										.join(";");
									img.addEventListener("contextmenu", function (e) {
										e.preventDefault();
									});
									img.addEventListener("dragstart", function (e) {
										e.preventDefault();
									});
								});
						} else {
							slicIntCnt[i]++;
							if (slicIntCnt[i] >= 80) {
								//timeout 10sec
								clearInterval(slicInt[i]);
							}
						}
					}, 250);
				});
			}

			//製品系
			if (contextDisableSlider.length) {
				contextDisableSlider.forEach(function (slider, i) {
					contextDisableSliderObj[i] = slider;
					slider
						.querySelectorAll(
							".swiper-container img, .swiper-pagination-bullet",
						)
						.forEach(function (img) {
							img.style.cssText = Object.entries(props)
								.map(([k, v]) => `${k}: ${v}`)
								.join(";");
						});
					slidIntCnt[i] = 0;
					slidInt[i] = setInterval(function () {
						if (contextDisableSliderObj[i].classList.contains("active")) {
							clearInterval(slidInt[i]);
							contextDisableSliderObj[i]
								.querySelectorAll(
									".swiper-container img, .swiper-pagination-bullet",
								)
								.forEach(function (img) {
									img.style.cssText = Object.entries(props)
										.map(([k, v]) => `${k}: ${v}`)
										.join(";");
									img.addEventListener("contextmenu", function (e) {
										e.preventDefault();
									});
									img.addEventListener("dragstart", function (e) {
										e.preventDefault();
									});
								});
						} else {
							slidIntCnt[i]++;
							if (slidIntCnt[i] >= 80) {
								//timeout 10sec
								clearInterval(slidInt[i]);
							}
						}
					}, 250);
				});
			}
		})();

		(() => {
			const ckMax = 7000000; // 有効期限7日（秒まで判定）
			const cookieItem = localStorage.getItem("cookieMessage");
			const cDate = new Date();
			const cyy = toStringcv2(cDate.getFullYear());
			const cmm = toStringcv2(cDate.getMonth() + 1);
			const cdd = toStringcv2(cDate.getDate());
			const chh = toStringcv2(cDate.getHours());
			const cmn = toStringcv2(cDate.getMinutes());
			const csc = toStringcv2(cDate.getSeconds());
			const cdn = Number(cyy + cmm + cdd + chh + cmn + csc);
			let csb = 0;

			const cookieMessage = document.querySelector(".cookie-message");
			const cookieMessageObject = document.querySelector(
				".cookie-message-object",
			);

			if (cookieMessage) {
				if (cookieItem === null) {
					csb = ckMax;
				} else {
					csb = Math.abs(cdn - cookieItem);
				}

				if (csb >= ckMax) {
					// 有効期限7日以上の時表示
					cookieMessage.classList.add("is-open");

					if (cookieMessageObject) {
						const span = cookieMessageObject.querySelector("span");
						span.style.top = `${cookieMessage.offsetHeight}px`;
						window.addEventListener("resize", () => {
							span.style.top = `${cookieMessage.offsetHeight}px`;
						});
					}

					cookieMessage
						.querySelector("button")
						.addEventListener("click", () => {
							cookieMessage.classList.remove("is-open");
							localStorage.setItem("cookieMessage", cdn);

							if (cookieMessageObject) {
								const span = cookieMessageObject.querySelector("span");
								span.style = "";
								window.removeEventListener("resize", () => {
									span.style.top = `${cookieMessage.offsetHeight}px`;
								});
								window.addEventListener("resize", () => {
									span.style = "";
								});
							}
						});
				}
			}

			function toStringcv2(nn) {
				return nn <= 9 ? `0${nn}` : nn.toString();
			}
		})();

		// padding内側の高さを取得し、変数に格納

		// without jQuery
		(function () {
			const updateHeight = debounce(function () {
				const cookieMessage = document.querySelector(".cookie-message");
				const headerFunctionMenu = document.querySelector(
					".header__function__menu",
				);
				const secondWrap = document.querySelector(
					".cookie-message.is-open + .header .header__nav > ul > li .second-wrap",
				);
				const searchForm = document.querySelector(
					".cookie-message.is-open + .header .header__function .header__function__search .header__function__search__form",
				);
				const languageWrapper = document.querySelector(
					".cookie-message.is-open + .header .header__function .header__function__language .language-wrapper",
				);

				if (cookieMessage) {
					const h = cookieMessage.offsetHeight;
					const pch = h + 60;

					if (cookieMessage.classList.contains("is-open")) {
						if (getComputedStyle(headerFunctionMenu).display === "none") {
							secondWrap.style.top = `${pch}px`;
							searchForm.style.top = `${pch}px`;
							languageWrapper.style.top = `${pch}px`;
						}
					}
				}
			}, 250);

			window.addEventListener("load", updateHeight);
			window.addEventListener("resize", updateHeight);
		})();

		// without jQuery
		let current_scrollY = 0;

		// SP ハンバーガーメニュー開閉
		let headerFunctionMenu = document.querySelector(".header__function__menu");
		if (headerFunctionMenu) {
			headerFunctionMenu.addEventListener("click", function () {
				// サーチウィンドウとランゲージセレクターをクローズ
				let headerFunctionSearch = document.querySelector(
					".header__function__search",
				);
				let headerFunctionLanguage = document.querySelector(
					".header__function__language",
				);
				let headerFunctionSearchForm = document.querySelector(
					".header__function__search form",
				);
				let headerFunctionLanguageLanguageWrapper = document.querySelector(
					".header__function__language .language-wrapper",
				);

				if (headerFunctionSearch)
					headerFunctionSearch.classList.remove("is-open");
				if (headerFunctionLanguage)
					headerFunctionLanguage.classList.remove("is-open");
				if (headerFunctionSearchForm)
					headerFunctionSearchForm.style.display = "none";
				if (headerFunctionLanguageLanguageWrapper)
					headerFunctionLanguageLanguageWrapper.style.display = "none";

				let header = document.querySelector(".header");
				let headerHeaderNav = document.querySelector(".header .header__nav");
				let contentWrapper = document.querySelector(".content-wrapper");

				if (header) header.classList.toggle("is-absolute");
				if (headerHeaderNav) headerHeaderNav.classList.toggle("is-open");
				if (contentWrapper) {
					contentWrapper.style.position = "";
					contentWrapper.style.width = "";
					contentWrapper.style.top = "";
				}

				if (
					headerHeaderNav &&
					window.getComputedStyle(headerHeaderNav).display === "none"
				) {
					set__header__function__menu_span_img("btn_sp_menu.png");

					if (current_scrollY) {
						window.scrollTo(0, current_scrollY);
						current_scrollY = 0;
					}
				} else {
					current_scrollY =
						window.pageYOffset || document.documentElement.scrollTop;
					if (contentWrapper) {
						contentWrapper.style.position = "fixed";
						contentWrapper.style.width = "100%";
						contentWrapper.style.top = -1 * current_scrollY + "px";
					}
					set__header__function__menu_span_img("btn_sp_menu_close.png");
				}
			});
		}

		// ドロップダウンメニュー内のクローズボタン
		let headerNavClose = document.querySelector(".header__nav__close");
		if (headerNavClose) {
			headerNavClose.addEventListener("click", function () {
				let headerHeaderNav = document.querySelector(".header .header__nav");
				let header = document.querySelector(".header");
				let contentWrapper = document.querySelector(".content-wrapper");

				if (headerHeaderNav) headerHeaderNav.classList.remove("is-open");
				if (header) header.classList.remove("is-absolute");
				set__header__function__menu_span_img("btn_sp_menu.png");

				if (contentWrapper) {
					contentWrapper.style.position = "";
					contentWrapper.style.width = "";
					contentWrapper.style.top = "";
				}

				window.scrollTo(0, current_scrollY);
				current_scrollY = 0;
			});
		}
		//pcドロップダウンメニュー処理
		(function () {
			let $open = null;
			let $this = {};

			let megaTm = 0;

			if ("ontouchstart" in window) {
				$closeSecondWrap_span.forEach((span) => {
					span.style.userSelect = "none";
				});
			} else if (uas.search(/Edge/) !== -1 || uas.search(/Tablet/) !== -1) {
				//win系tablet or Edge
				$closeSecondWrap_span.forEach((span) => {
					span.style.userSelect = "none";
				});
			}

			// グルナビ #のみはクリックスルー 2017-05-22
			document
				.querySelectorAll(".header .header__nav > ul > li")
				.forEach(function (li) {
					var a = li.querySelector("a");
					if (a) {
						var href = a.getAttribute("href");
						if (href === "#" || href === "") {
							a.addEventListener("click", function (e) {
								li.classList.remove("is-open");
								e.preventDefault();
							});
						}
					}
				});

			//SP→PC時にグローバルナビの状態をリセット
			headerChange();

			window.addEventListener(revent, function () {
				headerChange();
			});

			function headerChange() {
				// DOM要素の取得
				const body = document.body;
				const header = document.querySelector(".header");
				const contentWrapper = document.querySelector(".content-wrapper");
				const headerNav = document.querySelector(".header .header__nav");
				const headerNavUl = document.querySelector(".header .header__nav > ul");
				// 要素が存在するか確認
				if (!headerNav || !headerNavUl) {
					return;
			}
				// PCモードの確認
				if (body.classList.contains("pc")) {
					// PCモードの場合、ヘッダー内のすべての要素から'is-open'クラスを削除
					document
						.querySelectorAll(".header *")
						.forEach((el) => el.classList.remove("is-open"));
					// contentWrapperのスタイルをリセット
					contentWrapper.style.position = "";
					contentWrapper.style.width = "";
					contentWrapper.style.top = "";
					// headerから'is-absolute'クラスを削除
					header.classList.remove("is-absolute");
				} else {
					// PCモードでない場合、'sp'クラスを削除し、'pc'クラスを追加
					body.classList.remove("sp");
					body.classList.add("pc");
				}

				// デバイスやウィンドウサイズに応じた処理
				if (toucDevice) {
					// タッチデバイスの場合
					droppdownSet("sp");
				} else if (
					window.matchMedia("(min-width:720px)").matches &&
					window.matchMedia("(max-width:1239px)").matches
				) {
					// ウィンドウの幅が720px以上1239px以下の場合
					if (headerNav.offsetWidth !== 0 && headerNavUl.offsetWidth !== 0) {
						if (headerNav.offsetWidth - headerNavUl.offsetWidth > 2) {
							droppdownSet("pc");
						} else {
							droppdownSet("sp");
						}
					} else {
						droppdownSet("sp");
					}
				} else if (window.matchMedia("(max-width:719px)").matches) {
					// ウィンドウの幅が719px以下の場合
					droppdownSet("sp");
				} else {
					// それ以外の場合
					droppdownSet("pc");
				}
			}

			function droppdownSet(mode) {
				const body = document.body;
				const headerHeaderNav = document.querySelector(".header .header__nav");

				if (mode === "pc") {
					if (!body.classList.contains("pc")) {
						body.classList.remove("sp");
						body.classList.add("pc");
					}
					pcDroppdown();
				} else if (mode === "sp") {
					if (!body.classList.contains("sp")) {
						body.classList.remove("pc");
						body.classList.add("sp");
						if (headerHeaderNav.classList.contains("is-open")) {
							//#4128
							set__header__function__menu_span_img("btn_sp_menu_close.png");
						} else {
							set__header__function__menu_span_img("btn_sp_menu.png");
						}
					}
					pcDroppdownCancell();
				}
			}

			//PCドロップダウン
			function pcDroppdown() {
				document
					.querySelectorAll(".header .header__nav > ul > li")
					.forEach((li) => {
						const secondWrap = li.querySelector(".second-wrap");
						if (secondWrap) {
							secondWrap.classList.add("is-close");
							secondWrap.style.display = "none";
						}
					});

				document
					.querySelectorAll(".header .header__nav > ul > li")
					.forEach((li) => {
						const handleEvent = function () {
							const secondWrap = li.querySelector(".second-wrap");
							if (megaTm) {
								clearTimeout(megaTm);
							}

							if (secondWrap) {
								if (!li.classList.contains("is-open")) {
									megaTm = setTimeout(function () {
										secondWrapClose(); // before close
										secondWrapOpen(li); // target open
									}, 400);
								}
							} else {
								secondWrapClose(); // now close
								return false;
							}
						};

						overEvent.split(" ").forEach((event) => {
							li.addEventListener(event, handleEvent);
						});
					});

				document
					.querySelectorAll(".header .header__nav > ul > li")
					.forEach((li) => {
						const handleOverEvent = function () {
							const secondWrap = li.querySelector(".second-wrap");
							if (megaTm) {
								clearTimeout(megaTm);
							}

							if (secondWrap) {
								if (!li.classList.contains("is-open")) {
									megaTm = setTimeout(function () {
										secondWrapClose(); // before close
										secondWrapOpen(li); // target open
									}, 400);
								}
							} else {
								secondWrapClose(); // now close
								return false;
							}
						};

						const handleOutEvent = function () {
							const secondWrap = li.querySelector(".second-wrap");
							if (secondWrap) {
								if (megaTm) {
									clearTimeout(megaTm);
								}
								megaTm = setTimeout(function () {
									secondWrapClose(); // all close
								}, 500);
							}
						};

						overEvent.split(" ").forEach((event) => {
							li.addEventListener(event, handleOverEvent);
						});

						outEvent.split(" ").forEach((event) => {
							li.addEventListener(event, handleOutEvent);
						});
					});

				//PCドロップダウンメニュークローズボタン
				$closeSecondWrap_span.forEach((span) => {
					span.addEventListener("click", function () {
						secondWrapClose(); //target close
					});
				});

				document
					.querySelectorAll(".header__nav > ul > li")
					.forEach(function (li) {
						li.addEventListener("mouseenter", function () {
							const secondWrap = li.querySelector(".second-wrap");
							if (secondWrap) {
								secondWrap.classList.remove("is-close");
							}
						});
					});

				//PCドロップダウン open
				function secondWrapOpen(obj) {
					$open = obj;

					let $menu = [];
					const $second_wrap = $open.querySelector(".second-wrap");
					const $third_wrap = $second_wrap.querySelector(".third-wrap");

					const headerFunctionSearch = document.querySelector(
						".header__function__search",
					);
					const headerFunctionLanguage = document.querySelector(
						".header__function__language",
					);
					const headerFunctionSearchForm = document.querySelector(
						".header__function__search > form",
					);
					const headerFunctionLanguageWrapper = document.querySelector(
						".header__function__language .language-wrapper",
					);

					if (headerFunctionSearch)
						headerFunctionSearch.classList.remove("is-open");
					if (headerFunctionLanguage)
						headerFunctionLanguage.classList.remove("is-open");
					if (headerFunctionSearchForm)
						headerFunctionSearchForm.style.display = "none";
					if (headerFunctionLanguageWrapper)
						headerFunctionLanguageWrapper.style.display = "none";

					$open.classList.add("is-open");

					$second_wrap.classList.remove("is-close");
					$second_wrap.style.display = "block";

					if ($third_wrap) {
						$third_wrap.style.display = "none";
						let $third_wrap_active = $third_wrap; // Assuming you want the first element, which is the same as the element itself
						$third_wrap_active.style.display = "block"; // Show the first third-wrap element
						imgDatasrc($third_wrap_active);

						$menu = $second_wrap.querySelector(".gnavi-2nd-block"); // third_wrap open 処理
					}

					function imgDatasrc(element) {
						const dataImgs = element.querySelectorAll("img[data-src]");
						dataImgs.forEach((img) => {
							const src = img.getAttribute("data-src");
							img.setAttribute("src", src);
							img.removeAttribute("data-src");
						});
					}
				}
				//PCドロップダウン close
				function secondWrapClose() {
					if ($open !== null) {
						$open.classList.remove("is-open");

						const secondWrap = $open.querySelector(".second-wrap");
						if (secondWrap) {
							secondWrap.classList.add("is-close");
							secondWrap.style.display = "none";
						}

						const thirdWrap = $open.querySelector(".third-wrap");
						if (thirdWrap) {
							thirdWrap.style.display = "none";
						}

						$open = null;
					}
				}
			}

			function pcDroppdownCancell() {
				if (megaTm) {
					clearTimeout(megaTm);
				}

				document
					.querySelectorAll(".header .header__nav > ul > li")
					.forEach(function (li) {
						const handleOverEvent = function () {
							const secondWrap = li.querySelector(".second-wrap");
							if (megaTm) {
								clearTimeout(megaTm);
							}

							if (secondWrap) {
								if (!li.classList.contains("is-open")) {
									megaTm = setTimeout(function () {
										secondWrapClose(); // before close
										secondWrapOpen(li); // target open
									}, 400);
								}
							} else {
								secondWrapClose(); // now close
								return false;
							}
						};

						const handleOutEvent = function () {
							const secondWrap = li.querySelector(".second-wrap");
							if (secondWrap) {
								if (megaTm) {
									clearTimeout(megaTm);
								}
								megaTm = setTimeout(function () {
									secondWrapClose(); // all close
								}, 500);
							}
						};

						overEvent.split(" ").forEach((event) => {
							li.removeEventListener(event, handleOverEvent);
						});

						outEvent.split(" ").forEach((event) => {
							li.removeEventListener(event, handleOutEvent);
						});
					});
			}

			//ホバーした最後のブロックを表示
			/*
	$(".gnavi-2nd-block > li").hover(function () {
		$(this).siblings().children('.third-wrap').hide();
		$(this).children('.third-wrap').show();
	});
	*/

			//全体をマウスアウトしたら、一番上のメニューを表示する状態に戻る
			/*
	$(".header .header__nav > ul > li:first-child").hover(function () {
		$(".third-wrap").hide();
		$(".product .gnavi-2nd-block > li:first-child .third-wrap").show();
	  }
	);
	*/
		})();

		(function () {
			document
				.querySelectorAll(".header__nav > ul > li > a")
				.forEach(function (anchor) {
					anchor.addEventListener("click", function () {
						if (window.getComputedStyle(anchor).display === "block") {
							//sp
							let nextElement = anchor.nextElementSibling;
							if (nextElement) {
								if (window.getComputedStyle(nextElement).display === "none") {
									slideDown(nextElement, 400);
									anchor.classList.add("is-open");
								} else {
									slideUp(nextElement, 400);
									anchor.classList.remove("is-open");
								}
							}
						}
					});
				});
		})();

		//スクロールトップのフェイドインアウト
		(function () {
			const pageTop = document.querySelector(".page-top");
			const footer = document.querySelector("#footer");

			function fadeIn(element) {
				if (element.style.display === "block") return;
				element.style.display = "block";
				element.style.opacity = 0;
				let last = +new Date();
				const tick = function () {
					element.style.opacity =
						+element.style.opacity + (new Date() - last) / 400;
					last = +new Date();
					if (+element.style.opacity < 1) {
						(window.requestAnimationFrame && requestAnimationFrame(tick)) ||
							setTimeout(tick, 16);
					}
				};
				tick();
			}

			function fadeOut(element) {
				if (element.style.display === "none") return;
				element.style.opacity = 1;
				let last = +new Date(); // ここを修正
				const tick = function () {
					element.style.opacity =
						+element.style.opacity - (new Date() - last) / 400;
					last = +new Date();
					if (+element.style.opacity > 0) {
						(window.requestAnimationFrame && requestAnimationFrame(tick)) ||
							setTimeout(tick, 16);
					} else {
						element.style.display = "none";
					}
				};
				tick();
			}

			window.addEventListener("scroll", function () {
				if (window.scrollY > 100) {
					fadeIn(pageTop);
				} else {
					fadeOut(pageTop);
				}

				const scrollPos = window.innerHeight + window.scrollY;
				const footPos = footer.offsetTop;
				const fixedPos = scrollPos - footPos + 50;

				if (scrollPos >= footPos) {
					pageTop.style.position = "fixed";
					pageTop.style.bottom = `${fixedPos}px`;
				} else {
					pageTop.style.position = "fixed";
					pageTop.style.bottom = "60px";
				}
			});
		})();

		//SPビジネスリストの開閉
		(function () {
			document
				.querySelectorAll(".business-lists h3")
				.forEach(function (header) {
					header.addEventListener("click", function () {
						const nextElement = header.nextElementSibling;
						if (nextElement) {
							if (window.getComputedStyle(nextElement).display === "none") {
								slideDown(nextElement, 400);
							} else {
								slideUp(nextElement, 400);
							}
							header.classList.toggle("is-open");
						}
					});
				});
		})();

		//キー操作のテスト2
		(function () {
			// メガメニュー内のタブコンテンツ切り替え
			document
				.querySelectorAll(".gnavi-2nd-block > li > a")
				.forEach((anchor) => {
					anchor.addEventListener("focus", function () {
						document.querySelectorAll(".third-wrap").forEach((thirdWrap) => {
							thirdWrap.style.display = "none";
						});
						const nextElement = this.nextElementSibling;
						if (nextElement) {
							nextElement.style.display = "block";
						}
					});
				});

			//虫めがねマークにフォーカスが当たった時
			document
				.querySelector(".header__function__search > a")
				?.addEventListener("focus", function () {
					document
						.querySelectorAll(".header__function__language > div")
						.forEach(function (div) {
							div.style.display = "none";
						});
					this.nextElementSibling.style.display = "block";
				});

			document
				.querySelector(".header__function__search > a")
				?.addEventListener("keydown", function (e) {
					if (e.key === "Tab") {
						if (e.shiftKey) {
							this.nextElementSibling.style.display = "none";
						} else {
							// Focus next input
						}
					}
				});

			document
				.querySelector(".header__function__language > a")
				?.addEventListener("focus", function () {
					document
						.querySelectorAll(".header__function__search > form")
						.forEach(function (form) {
							form.style.display = "none";
						});
					this.nextElementSibling.style.display = "block";
				});

			document
				.querySelector(".header__function__global > a")
				?.addEventListener("focus", function () {
					document
						.querySelectorAll(".header__function__language > div")
						.forEach(function (div) {
							div.style.display = "none";
						});
				});
		})();

		//local-menu-toggle
		(function () {
			document
				.querySelectorAll(".local-navigation p a")
				?.forEach(function (anchor) {
					anchor.addEventListener("click", function () {
						const parent = anchor.parentElement;
						const nextElement = parent.nextElementSibling;
						if (nextElement) {
							if (window.getComputedStyle(nextElement).display === "none") {
								slideDown(nextElement, 400);
							} else {
								slideUp(nextElement, 400);
							}
						}
						anchor.closest(".local-navigation").classList.toggle("is-open");
					});
				});
		})();

		//footer select country
		(function () {
			const regionSelect = document.getElementById("region");
			if (regionSelect) {
				regionSelect.addEventListener("change", function () {
					const url = regionSelect.value;
					if (url.match(/http/)) {
						window.open(url, "_blank");
					} else if (url !== "") {
						window.location = url;
					}
					return false;
				});
			}
		})();

		//アコーディオンパーツ
		(function () {
			var ytapi = "enablejsapi=1";
			var $accordionFunction = document.querySelectorAll(".accordion-function");
			var $iframeAll = document.querySelectorAll(".accordion-function iframe");
			var $accordionObj = {};
			if ($accordionFunction.length) {
				var i = 0;
				while (i < $accordionFunction.length) {
					var tObj = $accordionFunction[i];
					$accordionObj.i = {};
					$accordionObj.i = new accordionProc(tObj);
					i++;
				}
			}

			if ($iframeAll.length) {
				var f = 0;
				while (f < $iframeAll.length) {
					var yObj = $iframeAll[f];
					var ysrc = $iframeAll[f].src;
					if (
						ysrc.indexOf("www.youtube.com") !== -1 &&
						ysrc.indexOf(ytapi) === -1
					) {
						if (ysrc.indexOf("?") === -1) {
							ysrc = ysrc + "?" + ytapi;
						} else {
							ysrc = ysrc + "&" + ytapi;
						}
						$iframeAll[f].src = ysrc;
					}
					f++;
				}
			}

			function accordionProc($obj) {
				var $rootObj = $obj;
				var $accordionControlButton = $rootObj.querySelector(
					".accordion--control__button",
				);
				var $accordionItems = $rootObj.querySelectorAll(".accordion--item");

				if ($accordionControlButton && $accordionItems.length > 1) {
					$accordionControlButton.addEventListener(
						"click",
						function (e) {
							var allMode = false;
							this.querySelector("button").setAttribute(
								"style",
								"outline :none",
							);
							if ($accordionControlButton.classList.contains("allOpen")) {
								$accordionControlButton.classList.remove("allOpen");
							} else {
								allMode = true;
							}

							var i = 0;
							var j = 0;
							while (i < $accordionItems.length) {
								setTimeout(
									function (obj, j, allMode) {
										itemOpen(
											obj.querySelector(".accordion--item__title"),
											allMode,
										);
										j++;
									},
									10 + 300 * j,
									$accordionItems[i],
									j,
									allMode,
								);
								i++;
							}
						},
						false,
					);
					$accordionControlButton.addEventListener(
						"keypress",
						function (e) {
							if (e.keyCode == "13") {
								this.querySelector("button").removeAttribute(
									"style",
									"outline :none",
								);
							}
						},
						false,
					);
					$accordionControlButton.addEventListener(
						"focusin",
						function () {
							this.querySelector("button").removeAttribute(
								"style",
								"outline :none",
							);
						},
						false,
					);
					$accordionControlButton.addEventListener(
						"focusout",
						function () {
							this.querySelector("button").removeAttribute(
								"style",
								"outline :none",
							);
						},
						false,
					);
				} else {
					$accordionControlButton.classList.add("hidden-lg");
					$accordionControlButton.classList.add("hidden-sm");
				}

				if ($accordionItems.length) {
					var i = 0;
					while (i < $accordionItems.length) {
						var $accordionBtn = $accordionItems[i].querySelector(
							".accordion--item__title",
						);
						var $accordionItems_conent = $accordionItems[i].querySelector(
							".accordion--item__conent",
						);
						$accordionItems_conent.style.display = "none";

						if ($accordionBtn) {
							$accordionBtn.tabIndex = 0;
							$accordionBtn.addEventListener(
								"click",
								function () {
									itemOpen(this, null);
									this.setAttribute("style", "outline :none");
								},
								false,
							);
							$accordionBtn.addEventListener(
								"keypress",
								function (e) {
									if (e.keyCode == "13") {
										itemOpen(this, null);
									}
								},
								false,
							);
							$accordionBtn.addEventListener(
								"focusin",
								function () {
									this.removeAttribute("style", "outline :none");
								},
								false,
							);
							$accordionBtn.addEventListener(
								"focusout",
								function () {
									this.removeAttribute("style", "outline :none");
								},
								false,
							);
						}
						i++;
					}
				}

				function itemOpen(tObj, allMode) {
					var pObj = tObj.parentElement.parentElement;
					var youtubes = pObj.querySelectorAll(".accordion--video iframe");
					var videos = pObj.querySelectorAll(".accordion--video video");
					var $accordionItems_conent = pObj.querySelector(
						".accordion--item__conent",
					);

					if (pObj.classList.contains("open")) {
						if (!allMode || allMode === null) {
							pObj.classList.remove("open");
							setTimeout(
								function (obj) {
									obj.style.display = "none";
								},
								300,
								$accordionItems_conent,
							);
						}
					} else {
						if (allMode || allMode === null) {
							$accordionItems_conent.removeAttribute("style");
							setTimeout(
								function (obj) {
									obj.classList.add("open");
								},
								50,
								pObj,
							);
						}
					}

					setTimeout(
						function ($rootObj, youtubes, videos, pObj) {
							if (!pObj.classList.contains("open")) {
								videoPause(youtubes, videos);
							}
							allOpenCheck($rootObj);
						},
						300,
						$rootObj,
						youtubes,
						videos,
						pObj,
					);
				}

				function allOpenCheck(rObj) {
					var rtLength = rObj.querySelectorAll(".accordion--item").length;
					var opLength = rObj.querySelectorAll(".accordion--item.open").length;
					var clContain = $accordionControlButton.classList.contains("allOpen");
					if (opLength >= rtLength && !clContain) {
						$accordionControlButton.classList.add("allOpen");
					} else if (opLength === 0 && clContain) {
						$accordionControlButton.classList.remove("allOpen");
					}
				}

				function videoPause(yts, vs) {
					if (yts.length) {
						var y = 0;
						while (y < yts.length) {
							yts[y].contentWindow.postMessage(
								'{"event":"command","func":"pauseVideo","args":""}',
								"*",
							);
							y++;
						}
					}
					if (vs.length) {
						var b = 0;
						while (b < vs.length) {
							vs[b].pause();
							b++;
						}
					}
				}
			}
		})();

		/*
        【標準テンプレート】オフスクリーン画像の遅延読込
        (jQuery unuse)
    	First Entry: 2019-07-xx
    */

		(function () {
			var setCnt = 0;
			var delayImages = document.querySelectorAll(".delayedImg");
			if (delayImages.length) {
				mainProc();
			}

			function mainProc() {
				imgSetter();
				window.addEventListener("scroll", imgSetter, false);
			}

			function imgSetter() {
				if (setCnt < delayImages.length) {
					var sta = window.pageYOffset;
					var eda = sta + window.innerHeight;
					var i = 0;
					while (i < delayImages.length) {
						var iObj = delayImages[i];
						var rect = iObj.getBoundingClientRect();
						var sy = rect.top + sta;
						var datasrc = iObj.getAttribute("data-src");
						var imgsrc = iObj.getAttribute("src");
						if (imgsrc === null && sy >= sta - 10 && sy <= eda + 10) {
							iObj.setAttribute("src", datasrc);
							//iObj.classList.add('delayedActive');
							setTimeout(
								function (obj) {
									obj.classList.add("delayedActive");
								},
								250,
								iObj,
							);
							setCnt++;
						}
						i++;
					}
				} else {
					window.removeEventListener("scroll", imgSetter, false);
				}
			}
		})();

		/*
		KMJ_CODING-355 【サイト内検索】流入元判別タグ（JSによる動的取得）
	*/
		inputReferrer(".l-header__block__search form");
		inputReferrer(".header__function__search__form div");
		inputReferrer(".newsroom-pc-form div");

		function inputReferrer(sel) {
			var searchBlocks = document.querySelectorAll(sel);
			var refURL = "";
			var refInput = "";
			var refs = [];

			if (searchBlocks.length) {
				var canonicalLink = document.querySelector('link[rel="canonical"]');
				var ogUrlMeta = document.querySelector('meta[property="og:url"]');

				if (canonicalLink) {
					refURL = canonicalLink.getAttribute("href");
				} else if (ogUrlMeta) {
					refURL = ogUrlMeta.getAttribute("content");
				} else {
					refURL = location.href;
				}

				refInput = '<input name="ref" value="' + refURL + '" type="hidden">';

				searchBlocks.forEach(function (searchBlock) {
					refs = searchBlock.querySelectorAll('input[name="ref"]');
					if (refs.length === 0) {
						searchBlock.insertAdjacentHTML("beforeend", refInput);
					} else {
						refs.forEach(function (ref) {
							ref.setAttribute("value", refURL);
						});
					}
				});
			}
		}
	})();
})();

// menuaim vanilla js
class MenuAim {
	constructor(menu, options) {
		this.menu = menu;
		this.options = Object.assign(
			{
				rowSelector: "li",
				submenuSelector: "*",
				submenuDirection: "right",
				tolerance: 75,
				enter: () => {},
				exit: () => {},
				activate: () => {},
				deactivate: () => {},
				exitMenu: () => {},
			},
			options,
		);

		this.activeRow = null;
		this.mouseLocs = [];
		this.lastDelayLoc = null;
		this.timeoutId = null;

		this.MOUSE_LOCS_TRACKED = 3;
		this.DELAY = 300;

		this.init();
	}

	init() {
		if (!this.menu) {
			// console.error("Menu element is null");
			return;
		}
		this.menu.addEventListener("mouseleave", this.mouseleaveMenu.bind(this));
		document.addEventListener("mousemove", this.mousemoveDocument.bind(this));
		const rows = Array.from(this.menu.children).filter((child) =>
			child.matches(this.options.rowSelector),
		);

		rows.forEach((row) => {
			row.addEventListener("mouseenter", this.mouseenterRow.bind(this));
			row.addEventListener("mouseleave", this.mouseleaveRow.bind(this));
			row.addEventListener("click", this.clickRow.bind(this));
		});
	}

	mousemoveDocument(e) {
		this.mouseLocs.push({ x: e.pageX, y: e.pageY });

		if (this.mouseLocs.length > this.MOUSE_LOCS_TRACKED) {
			this.mouseLocs.shift();
		}
	}

	mouseleaveMenu() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		if (this.options.exitMenu(this.menu)) {
			if (this.activeRow) {
				this.options.deactivate(this.activeRow);
			}

			this.activeRow = null;
		}
	}

	mouseenterRow(e) {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		this.options.enter(e.currentTarget);
		this.possiblyActivate(e.currentTarget);
	}

	mouseleaveRow(e) {
		this.options.exit(e.currentTarget);
	}

	clickRow(e) {
		this.activate(e.currentTarget);
	}

	activate(row) {
		if (row === this.activeRow) {
			return;
		}

		if (this.activeRow) {
			this.options.deactivate(this.activeRow);
		}

		this.options.activate(row);
		this.activeRow = row;
	}

	possiblyActivate(row) {
		const delay = this.activationDelay();

		if (delay) {
			this.timeoutId = setTimeout(() => {
				this.possiblyActivate(row);
			}, delay);
		} else {
			this.activate(row);
		}
	}

	activationDelay() {
		if (
			!this.activeRow ||
			!this.activeRow.matches(this.options.submenuSelector)
		) {
			return 0;
		}

		const offset = this.menu.getBoundingClientRect();
		const upperLeft = {
			x: offset.left,
			y: offset.top - this.options.tolerance,
		};
		const upperRight = {
			x: offset.left + this.menu.offsetWidth,
			y: upperLeft.y,
		};
		const lowerLeft = {
			x: offset.left,
			y: offset.top + this.menu.offsetHeight + this.options.tolerance,
		};
		const lowerRight = {
			x: offset.left + this.menu.offsetWidth,
			y: lowerLeft.y,
		};
		const loc = this.mouseLocs[this.mouseLocs.length - 1];
		const prevLoc = this.mouseLocs[0] || loc;

		if (!loc) {
			return 0;
		}

		if (
			prevLoc.x < offset.left ||
			prevLoc.x > lowerRight.x ||
			prevLoc.y < offset.top ||
			prevLoc.y > lowerRight.y
		) {
			return 0;
		}

		if (
			this.lastDelayLoc &&
			loc.x === this.lastDelayLoc.x &&
			loc.y === this.lastDelayLoc.y
		) {
			return 0;
		}

		const decreasingCorner =
			this.options.submenuDirection === "left" ? lowerLeft : upperRight;
		const increasingCorner =
			this.options.submenuDirection === "left" ? upperLeft : lowerRight;

		const decreasingSlope = this.slope(loc, decreasingCorner);
		const increasingSlope = this.slope(loc, increasingCorner);
		const prevDecreasingSlope = this.slope(prevLoc, decreasingCorner);
		const prevIncreasingSlope = this.slope(prevLoc, increasingCorner);

		if (
			decreasingSlope < prevDecreasingSlope &&
			increasingSlope > prevIncreasingSlope
		) {
			this.lastDelayLoc = loc;
			return this.DELAY;
		}

		this.lastDelayLoc = null;
		return 0;
	}

	slope(a, b) {
		return (b.y - a.y) / (b.x - a.x);
	}
}

// 使用例
const menuBlock = document.querySelector(".gnavi-2nd-block");
const options = {
	activate: (row) => {
		function imgDatasrc(element) {
			const dataImgs = element.querySelectorAll("img[data-src]");
			dataImgs.forEach((img) => {
				const src = img.getAttribute("data-src");
				img.setAttribute("src", src);
				img.removeAttribute("data-src");
			});
		}
		var $row = row;
		var $third_wrap_active = $row.querySelector(".third-wrap");
		if ($third_wrap_active) {
			$third_wrap_active.style.display = "block";
			imgDatasrc($third_wrap_active);
		}
	},
	deactivate: (row) => {
		var $third_wrap = row.querySelector(".third-wrap");
		if ($third_wrap) {
			$third_wrap.style.display = "none";
		}
	},
};

new MenuAim(menuBlock, options);
