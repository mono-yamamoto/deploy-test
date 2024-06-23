/*= =========================================================
	2018-08-03 #4900【不具合修正】ナビ仕様変更に伴う修正
	2018-08-03 #5349【不具合修正】ローカルナビ（タブレット時）
	2018-11-28 #4936【不具合修正】アンカーリンク
========================================================== */
(function localNavigationLight () {

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
		elem.closest('li').classList.add("light-open");
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
			elem.closest('li').classList.remove("light-open");
	
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
	
	let $navigationLight = [];
	let currentInd = -1;
	let clickEvent = 'click';
	let overEvent = 'mouseover';
	let naviTimeout = 0;

	const {document} = window;
	const css = document.createElement('style');
	const styles = document.createTextNode('.right-navigation__list li:not(.light-current) ul{display:none}');
	const styles2 = document.createTextNode('.right-navigation__list li.current ul{display:block}');
	const styles3 = document.createTextNode('.right-navigation__list li.light-current ul{display:block}');
	css.type = 'text/css';
	if (css.styleSheet) {
		css.styleSheet.cssText = styles.nodeValue;
	} else {
		css.appendChild(styles);
	}
	css.appendChild(styles2);
	css.appendChild(styles3);
	document.querySelector('head').appendChild(css);

	// タッチデバイスの時 #5349
	if (window.ontouchstart === null) {
		clickEvent = 'touchend';
		overEvent = 'touchstart';
	}

	function mainProc() {
				/*---------------------------------------
		currentをリセット -> 付け直し	
		---------------------------------------*/
		function currentRepositioning() {
			let navMatch = false;
			let navigationLight = [];
			let $rowLgRightNav = [];
			let $navigationLightCurrent = [];
			let $rowLgRightNavCurrent = [];
			let $navigationLightA = [];
			let $rowLgRightNavA = [];
			const orgURl = window.location.href;
			let loc1 = orgURl;
			
			loc1 = loc1.replace('https://', '');
			loc1 = loc1.replace('http://', '');
			loc1 = loc1.replace(/#.+$/,"");
			loc1 = loc1.replace(/\?.+$/,"");

			const loc2 = loc1.replace(/\/.+$/, "");
			let locAddr1 = loc1.replace(loc2, ''); // 現在地
			if(locAddr1.indexOf('.html') ===-1){
				locAddr1 += 'index.html';	
			}
			const locAddr2 = locAddr1.substring(locAddr1.lastIndexOf('/')+1,-1);
			const locArr = locAddr2.split('/');
			locArr.shift();
			locArr.pop();

			navigationLight = document.querySelector('.navigation-light>ul');
			$rowLgRightNav = document.querySelector('.row-lg-right-nav__nav');

			if (navigationLight) {
				$navigationLightCurrent = navigationLight.querySelectorAll('.current, .light-current, .light-open');
				$navigationLightA = navigationLight.querySelectorAll('a');
			}
			if ($rowLgRightNav) {
				$rowLgRightNavCurrent = $rowLgRightNav.querySelectorAll('.current');
				$rowLgRightNavA = $rowLgRightNav.querySelectorAll('a');
			}

			/*-------------------
				Local関数
			--------------------*/

			// 静的currentを削除
			function staticCurrentDelete() {
				if ($navigationLightCurrent) {
					for (let ca = 0; ca < $navigationLightCurrent.length; ca += 1) {
						const a = $navigationLightCurrent[parseInt(ca, 10)];
						a.classList.remove('current');
						a.classList.remove('light-current');
						a.classList.remove('light-open');
					}
				}

				if ($rowLgRightNavCurrent) {
					for (let cb = 0; cb < $rowLgRightNavCurrent.length; cb += 1) {
						const b = $rowLgRightNavCurrent[parseInt(cb, 10)];
						b.classList.remove('current');
					}
				}

			}

			// $navigationLight 第2階層 (＊a) 一致
			function navigationLightSet(url) {
				let lUrl = "";
				for (let ca = 0; ca < $navigationLightA.length; ca += 1) {
					lUrl = url;
					const aa = $navigationLightA[parseInt(ca, 10)];
					let tName = aa.pathname;
					if (tName.indexOf('.html') === -1) {
						tName += 'index.html';	
					}
					// console.log(lUrl + '===' +  tName);
					if (tName === lUrl) {
						const he2 = aa.parentNode.parentNode;
						he2.classList.add('current');
						he2.classList.add('light-current');
						navMatch = true;

						// 親Liまで遡る(max99)
						let he3 = aa.parentNode;
						for (let rt = 0; rt <= 99; rt += 1) {
							if (he3.tagName.toLowerCase() === 'li') {
								he3.classList.add('current');
								he3.classList.add('light-current');
							}

							he3 = he3.parentNode;
							if (he3.tagName.toLowerCase() === 'nav') {
								break;
							}
						}
					}
				}	
			}

			// 右ナビ 第2階層 (＊a) 一致
			function rowLgRightNavSet(url) {
				for (let ca = 0; ca < $rowLgRightNavA.length; ca += 1) {
					const lUrl = url;
					const aa = $rowLgRightNavA[parseInt(ca, 10)];
					const he3 = aa.parentNode.parentNode;
					let tName = aa.pathname;
					if (tName.indexOf('.html') === -1) {
						tName += 'index.html';	
					}

					if (tName === lUrl) {
						const he2 = aa.parentNode;
						he2.classList.add('current');						
						if(he3.tagName.toLowerCase()  === 'ul'){
							he3.parentNode.classList.add('light-current');
						}
						
					}
				}
			}

			staticCurrentDelete(); // 静的currentを削除
			document.querySelectorAll('.row-lg-right-nav__nav * li.current').forEach(el => el.classList.remove('current'));

			if ($rowLgRightNavA) {
				rowLgRightNavSet(locAddr1); // 右ナビ 第2階層 (＊a) 一致
				/*
				if(!rmatch) {	//index.htmlで検索
					var rAddr = locAddr1.replace(/[^\/]+\.html/,'index.html');
					rowLgRightNavSet(rAddr);
				}
				*/
			}
			if($rowLgRightNav){
				$rowLgRightNav.classList.add('active');
			}

			if ($navigationLightA) {
				navigationLightSet(locAddr1); // $navigationLight 第2階層 (＊a) 一致
				if(!navMatch) {	// index.htmlで検索
					locAddr1 = locAddr1.replace(/[^/]+\.html/,'index.html');
					navigationLightSet(locAddr1);
				}
				if(!navMatch && locArr.length) {
					let turl = locAddr1;
					while(locArr.length > 0) {
						turl = turl.replace(`${locArr[locArr.length-1]  }/`,'');
						navigationLightSet(turl); // $navigationLight 第2階層 (＊a) 一致
						locArr.pop();
						if(navMatch) {
							break;
						}
					}
				}
			}
		}
		
		currentRepositioning(); // currentをリセット -> 付け直し

		$navigationLight.style.zIndex = 1;
		/*---------------------------------------
		上層 mouseover -> 下層のtop計算
		----------------------------------------*/
		function lheaderNavigationHierarchyMouseover(obj) {

			const lng = obj.length;
			const obj01 = obj;
			for (let i = 0; i < lng; i += 1) {
				(function lheaderNavigationMouseover(n) {
					let nId = 0;
					let tObj = [];

					obj01[parseInt(n, 10)].addEventListener("mouseover", function handleMouseOver(e) {
						tObj = this;
						if (window.matchMedia('(min-width:720px)').matches) {
							clearTimeout(nId);
							const obj01ParentRect = tObj.parentNode.getBoundingClientRect();
							// var obj01Rect = tObj.getBoundingClientRect();
							const obj02 = tObj.querySelector('dl>dd');
							if (obj02) {
								// obj02.style.top = (obj01ParentRect.top +  obj01ParentRect.height + tObj.clientHeight - 1) + 'px';
								obj02.style.top = `${obj01ParentRect.height  }px`;
							}
							nId = setTimeout(() => {
								tObj.classList.add('light-open');
							}, 300, n);
						}
						e.preventDefault();
						
					}, false);

					obj01[parseInt(n, 10)].addEventListener("mouseout", (e) => {
						if (window.matchMedia('(min-width:720px)').matches) {
							clearTimeout(nId);
							// console.log(obj01[n].parentNode);								
							nId = setTimeout((nn) => {
								obj01[parseInt(nn, 10)].classList.remove('light-open');
							}, 300, n);
						}

						e.preventDefault();

					}, false);

				})(i);

				if (obj01[parseInt(i, 10)].querySelectorAll("dl>dd>ul>li").length) {
					lheaderNavigationHierarchyMouseover(obj01[parseInt(i, 10)].querySelectorAll("dl>dd>ul>li"));
				}

			}

		}

		const lheaderNavigationHierarchy01 = document.querySelectorAll(".l-header__navigation.navigation-light>ul>li");
		if (lheaderNavigationHierarchy01) {
			lheaderNavigationHierarchyMouseover(lheaderNavigationHierarchy01);
		}

		document.querySelectorAll('.navigation-light ul li').forEach((tobj, index) => {
			if (tobj.classList.contains('light-current')) {
				currentInd = index;
			}

			tobj.addEventListener(overEvent, (e) => {
				if (window.matchMedia('(min-width:720px)').matches) {
					clearTimeout(naviTimeout);
					naviTimeout = setTimeout(() => {
						if (overEvent !== 'touchstart') { // #5349
							document.querySelectorAll('.navigation-light ul li').forEach(el => el.classList.remove('light-open'));
							tobj.classList.add('light-open');
						} else if (tobj.classList.contains('light-open')) {
							tobj.classList.remove('light-open');
						} else {
							document.querySelectorAll('.navigation-light ul li').forEach(el => el.classList.remove('light-open'));
							tobj.classList.add('light-open');
						}

						if (index !== currentInd) {
							document.querySelectorAll('.navigation-light ul li')[parseInt(currentInd, 10)].classList.add('light-current-hide');
						} else {
							document.querySelectorAll('.light-current-hide').forEach(el => el.classList.remove('light-current-hide'));
						}
					}, 300);

					if (overEvent !== 'touchstart') { // #5349
						e.preventDefault();
					}
				}
			});

			tobj.addEventListener('mouseout', (e) => {
				if (window.matchMedia('(min-width:720px)').matches) {
					clearTimeout(naviTimeout);
					naviTimeout = setTimeout(() => {
						document.querySelectorAll('.navigation-light ul li').forEach(el => el.classList.remove('light-open'));
						document.querySelectorAll('.light-current-hide').forEach(el => el.classList.remove('light-current-hide'));
					}, 300);

					e.preventDefault();
				}
			});

			// スマホ
			if(tobj.querySelector('dl dt')){
				tobj.querySelector('dl dt').addEventListener(clickEvent, () => {
					let tobjDlDd = [];
					if (window.matchMedia('(max-width:719px)').matches) {
						tobjDlDd = tobj.querySelector('dl dd');
						if (tobj.classList.contains('light-open')) {
							if (tobjDlDd) {
									slideUp(tobjDlDd, 200)
							}
						} else if (tobjDlDd) {
							slideDown(tobjDlDd, 200)
						}
					}

					return false;
				});
			}
		});
	}
	
	function mainProcRun() {
		$navigationLight = document.querySelector('.navigation-light');
		if ($navigationLight) {
			mainProc();
		}
	}

	document.addEventListener("DOMContentLoaded", mainProcRun, false);

})();