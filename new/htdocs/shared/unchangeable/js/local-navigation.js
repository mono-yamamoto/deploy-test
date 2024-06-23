/* ====================================================
local-navigation.js
2018-02-16 #3031: グロナビの箇所のjs制御実装
2018-03-09 #4002 グロナビ・右ナビのカレント表示とディレクトリ書き換え用のjsの開発
2018-03-20 #4002-#4 グロナビ・右ナビのカレント表示とディレクトリ書き換え用のjsの開発
2018-04-20 #4282 sp時のページ最下部までスクロールした時の挙動【js修正対応その2】
2018-04-23 #4281 第３階層以下のカレント表示の見直し【js修正対応その１】
2018-04-24 #4283 右ナビの子ページを含む場合の表示・非表示制御【js修正対応その3】
2018-04-27 #4305 サイト表示時のナビの段階的表示の調査
2018-05-01 #4307 ウィンドウ幅が狭い時のグロナビの第３階層ホバー表示の仕様
2018-08-07 #4900 【不具合修正】ナビ仕様変更に伴う修正
2018-11-14 #5869 【不具合修正】ローカルナビのカレント表示
2018-11-22 #4936【不具合修正】アンカーリンク
2018-11-22 #5311 パンクズがないページでナビがうまく動かない
2018-11-26 #5795 【不具合修正】グロナビを開いたときのコンテンツ
2018-11-28 #4936【不具合修正】アンカーリンク
2018-12-05 #6032【不具合修正】IR各国のパスの書き換え
2024-07-01 全体を非Query化
==================================================== */

let localNavigationScroll = false; // l-header transition flg

function localNavigationInitialization(){


/*= =========================
	css追加
	#4283
	#4305
========================== */
const {document} = window;
	const css = document.createElement('style');
	const styles = document.createTextNode('.right-navigation__list li:not(.current) ul{display:none};');	// #4283
	const styles2 = document.createTextNode('.l-header__navigation:not(.active) > ul > li > dl > dd{visibility:hidden};');	// #4305

css.type = 'text/css';
if (css.styleSheet) {
	css.styleSheet.cssText = styles.nodeValue;
} else {
	css.appendChild(styles);
}
css.appendChild(styles2);
// css.appendChild(styles3);
document.querySelector('head').appendChild(css);

/*= =========================
 Global variables
========================== */
const $win = window;

// var $body = [];
let $header = {};
let lhElem = {};
let $breadcrumb = {};
let $main = {};
let $mainMain = {};
let $mainMainContainer = {};
let $contentWrapper = {};
let $lheader = {};
let $lheaderNavigation ={};
let $lheaderBlockSmMenuBtn = {};
let $containerFluid = {};
let $footer = {};
let savewTop = 0;
let savelheaderTop = 0;
let hnOpen = false;
const ua = navigator.userAgent;
const ios = /(iPhone|iPod|iPad).+ OS ([0-9]+)_.+ Safari/i;
let isIE = false;
let revents = 'resize'; // resize event
const loadEvent = 'load';
const fixedClearCss = {
	position: '',
	top: ''
};
const locURL = decodeURI(window.location.href);
let locArr = [];
let lcURL = locURL;
let lcURLpass = "";
let lcDomain = "";
let matchOk = false;
let rightMatchObj = null;

if (ua.match(ios)) {
	revents = 'orientationchange';
}

if (ua.match(/MSIE/i) || ua.match(/Trident/)) {
	isIE = true;
}

lcURL = lcURL.replace(/#.+$/,"");
lcURL = lcURL.replace(/\?.+$/,"");
lcURL = lcURL.replace('https://', '');
lcURL = lcURL.replace('http://', '');

if (lcURL.charAt(lcURL.length - 1) === '/') {
	lcURL += 'index.html';
}

locArr = lcURL.split('/');
[lcDomain] = locArr;
lcURL = lcURL.replace(lcDomain, '');

// #4281
lcURLpass = lcURL;
if (locArr[locArr.length - 1].indexOf('.html') !== -1) {
	lcURLpass = lcURLpass.replace(locArr[locArr.length - 1], '');
}

/*= =========================
 static fucntion
========================== */
/*---------------------------------------
#4307 第3階層 mouseover -> 第4階層のtop計算
----------------------------------------*/
function lheaderNavigationHierarchy03Mouseover(obj) {
	if (document.body.classList[0].indexOf('sp') === -1) {

		const lng = obj.length;
		const obj03 = obj;

		for (let i = 0; i < lng; i+= 1) {
			(function handleMouseover(n) {
				obj03[parseInt(n, 10)].addEventListener('mouseover', () => {
					const obj03ParentRect = obj03[parseInt(n, 10)].parentNode.getBoundingClientRect();
					const obj03Rect = obj03[parseInt(n, 10)].getBoundingClientRect();
					const obj04 = obj03[parseInt(n, 10)].querySelector('dl>dd');
					if (obj04) {
						obj04.style.top = `${obj03Rect.top - obj03ParentRect.top + obj03[parseInt(n, 10)].clientHeight -1  }px`;
					}
				}, false);
			})(i);
		}
	}
}

/*--------------------------------
#4002 locationから現在地表示
#4281 第5階層から現在地表示
---------------------------------*/
function locationSetting(tObj, depth) {
	let ptObj = [];
	let parObj = [];
	let tgURL = "";
	let lccURL = lcURL;
	matchOk = false;

	if (depth === 5) { // #4281
		lccURL = lcURLpass;
		ptObj = tObj.parentNode.parentNode.parentNode.parentNode.parentNode;
	} else {
		ptObj = tObj.parentNode;
		if (ptObj.tagName !== 'LI') {
			ptObj = ptObj.parentNode;
			if (ptObj.tagName !== 'LI') {
				ptObj = ptObj.parentNode;
			}
		}
	}

	if (depth === 2 && rightMatchObj !== null) {
		parObj = rightMatchObj.parentNode.parentNode.querySelector('a');
		if (parObj.attributes.href.nodeValue) {
			lccURL = parObj.attributes.href.nodeValue;
		}
	}

	if (tObj.href) {
		tgURL = tObj.href;
		if (tgURL.indexOf('http:') !== -1) {
			tgURL = tgURL.replace('http://', '');
		} else if (tgURL.indexOf('https:') !== -1) {
			tgURL = tgURL.replace('https://', '');
		}
		tgURL = tgURL.replace(lcDomain, '');
			
		if(tgURL === lccURL) { // #5869
		// if (tgURL.indexOf(lccURL) === 0) { //#4281
		// if(tgURL.match(lccURL)){

			ptObj.classList.add('current');

			// 親liにもcurrnet 設定 #5869					
			const parentObj = ptObj.parentNode.parentNode.parentNode.parentNode;
			if(parentObj){
				// console.log(parentObj.tagName);
				if(parentObj.tagName === "LI"){
					parentObj.classList.add('current');
				}
			}

			if (depth === 1) {
				rightMatchObj = ptObj;
			}

			matchOk = true;

		}
	}
}

/* --------------------------------
  #4002 国別ディレクトリ書き換え -> 現在地表示
  #4002-#4 
--------------------------------- */
function countryDirectoryCreation(targetObj, depth) {
	let i = 0;
	const tlength = targetObj.length;

	const [, countryDir] = locArr;

	while (i < tlength) {
		let thisURL = targetObj[parseInt(i, 10)].attributes.href.nodeValue;
		const thisArr = thisURL.split('/');
		if (thisURL.charAt(0) === '/' && thisURL.indexOf('/us-en/') !== -1) {
			thisURL = thisURL.replace(thisArr[1], countryDir);
			const targetElement = targetObj[parseInt(i, 10)];
			targetElement.href = thisURL;
			if (depth === 1) {
				locationSetting(targetElement, depth);
				/*
				if(matchOk){
					break;
				}
				*/
			}

		}
		i = Math.floor(i + 1);
	}

}

function lheaderLocationSetting(targetObj, depth) {
	let i = 0;
	const tlength = targetObj.length;

	while (i < tlength) {
		locationSetting(targetObj[parseInt(i, 10)], depth);
		if (matchOk) {
			break;
		}
		i = Math.floor(i + 1);
	}
}

/* ----------------------------------------
    Breakpoint controll
    window.innerWidth
    0: 719px or less (for sp)
    1: 720px or more (for pc)
---------------------------------------- */
function getBreakPointIndex() {

	const bp = [720]; // min-width
	const winW = window.innerWidth;
	const bplen = bp.length;
	let bpi = 0;
	while (bpi < bplen) {
		if (winW < bp[parseInt(bpi, 10)]) {
			break;
		}
		bpi += 1;
	}

	return bpi;
}

function controllBreakPoint() {

	let lastbpi = getBreakPointIndex();
	
	function checkBreakPoint() {
		const currentbpi = getBreakPointIndex();
		if (lastbpi !== currentbpi) {
			lastbpi = currentbpi;
		}
		lastbpi = currentbpi;
	}
	
	$win.addEventListener(revents, () => {
		checkBreakPoint();
	});

	$win.addEventListener(loadEvent, () => {
		checkBreakPoint();
	});
}

/* ----------------------------------------
   set fixed subheader
---------------------------------------- */
function setFixedSubHeader() {
  const $contents = document.querySelector('.content-wrapper');
  const $lheaderBlock = document.querySelector('.l-header__block');
  let events = ['load', 'scroll', 'resize'];
  
  if (ua.match(ios)) {
    events = ['load', 'scroll', 'orientationchange'];
  }

  hnOpen = $lheaderNavigation.classList.contains("is-open");

  function controll(bpi) {
    const headerWrapH = $lheader.offsetHeight;
    const headerTtlH = $lheaderBlock.offsetHeight;
    const headerY = $lheader.getBoundingClientRect().top;
    let startPos = 0;
    const confixedCss = {
      position: 'fixed',
      width: '100%',
      zIndex: 65535,
      top: 0,
      backgroundColor: '#fff',
      transition: 'top .4s ease-in-out'
    };

    if (!hnOpen) {
      $lheader.removeAttribute('style');
      $contents.removeAttribute('style');
    }

    function positionClear() {
      if ($lheader.style.position !== "" && !localNavigationScroll) {
        Object.assign($lheader.style, fixedClearCss);
        Object.assign($contents.style, { 'margin-top': '0' });
      }
    }

    function handleScrollEvent() {
      const winScrollY = window.scrollY;

      if (!hnOpen && (winScrollY < document.body.clientHeight - window.innerHeight) /* && !window_init_Scroll */) { // eslint-disable-line
        localNavigationScroll = false;
        $lheader.style.transition = 'top .4s ease-in-out';

        if (winScrollY > headerY && !localNavigationScroll) {
          localNavigationScroll = false;
          Object.assign($lheader.style, confixedCss);
          $contents.style.marginTop = `${headerWrapH}px`;
          if (bpi === 0) {
            if (!document.body.classList.contains('is-localmenu-open')) {
              if (winScrollY + Math.ceil($lheader.offsetHeight / 3) > document.body.clientHeight - $footer.offsetHeight) {
                positionClear();
              } else if (winScrollY > startPos) {
                $contents.style.marginTop = '0';
                $lheader.style.top = `-${headerWrapH}px`;
              } else {
                $lheader.style.top = '0';
              }
            }
          } else if (bpi === 1) {
            if (winScrollY > startPos) {
              $lheader.style.top = `-${headerTtlH}px`;
            } else {
              $lheader.style.top = '0';
            }
          }
          startPos = winScrollY;
        } else {
          positionClear();
        }
      }
    }

		events.forEach(event => {
      window.removeEventListener(event, handleScrollEvent);
    });


		// イベントリスナーを追加
		events.forEach(event => {
			window.addEventListener(event, handleScrollEvent);
		});
  }


  const bpi = getBreakPointIndex();

  if (!localNavigationScroll) {
    controll(bpi);
  } else {
    lhElem.addEventListener('transitionend', () => {
      controll(bpi);
      lhElem.removeEventListener('transitionend', () => {
        controll(bpi);
      }, false);
    }, false);
  }

	window.addEventListener("resize", () => {
		if (bpi === 0) {
			controll(bpi);
		}else {
			controll(bpi);
		}
	});
}

/*----------------
 sp menu open
----------------*/
function spOpenClose() {
  $lheaderBlockSmMenuBtn.classList.toggle("is-open");
  $lheaderNavigation.classList.toggle("is-open");

  spMenuBackground(); // eslint-disable-line
}

function spMenuOpen() {
  $lheaderBlockSmMenuBtn.addEventListener("click", spOpenClose);
}

/*------------------
 sp search open
------------------*/
function spSearchOpen() {
  const searchBtn = document.querySelector(".l-header__block__sm-search-btn");
  const searchBlock = document.querySelector(".l-header__block__search");

  searchBtn.addEventListener("click", () => {
    searchBtn.classList.toggle("is-open");
    searchBlock.classList.toggle("is-open");
  });
}

/*----------------
 sp menu background
----------------*/
function spMenuBackground() {
  const bp = getBreakPointIndex();
  const ovelayCss = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 50,
    top: 0,
    left: 0,
    background: '#000',
    opacity: 0.7,
    borderTop: 'none',
    cursor: 'pointer'
  };
  const fixedCss = {
    position: 'fixed',
    zIndex: 0
  };

  function overlayRemove() {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
overlay.remove();
}
    Object.assign($header.style, fixedClearCss);
    Object.assign($contentWrapper.style, fixedClearCss);
    Object.assign($mainMainContainer.style, fixedClearCss);
		$containerFluid = document.querySelectorAll('main>section');
		$containerFluid.forEach(element => {
			Object.assign(element.style, fixedClearCss);
		});
    Object.assign($footer.style, fixedClearCss);
  }

  hnOpen = $lheaderNavigation.classList.contains("is-open");

  $lheader.style.transition = 'top .4s ease-in-out';

  if (bp === 0 && hnOpen && !document.querySelector('.overlay')) { // 背景がない時
    savewTop = $win.scrollY;
    savelheaderTop = $lheader.style.top;

    Object.assign($lheader.style, { position: 'relative', zIndex: 65535 });
    Object.assign($header.style, { position: 'relative', zIndex: 100 });
    Object.assign($contentWrapper.style, { position: 'relative', width: '100%', marginTop: '0' });

    document.querySelectorAll('main > section, main > div').forEach((element) => {
			// 元の条件分岐（下記コメント）の書き方が誤っているため常にfalseを返す。そのため今回の条件分岐もあえて誤った形にしてfalseを返すようにしている
			// if($(this).hasClass('l-header') === -1)
      if (element.classList.contains('l-header') === -1) {
        Object.assign(element.style, fixedCss, { top: `${element.getBoundingClientRect().top}px` });
      }
    });
    $win.scrollTo(0, 0);

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    Object.assign(overlay.style, ovelayCss);
    $mainMain.appendChild(overlay);

    overlay.addEventListener("click", spOpenClose);
  } else if (bp === 0 && !hnOpen) {
    const overlay = document.querySelector('.overlay');
    if (overlay) {
      overlay.removeEventListener("click", spOpenClose);
      overlayRemove();

      $lheader.style.top = savelheaderTop;

      setFixedSubHeader();
      window.scrollTo(0, savewTop);
    }
  } else if (bp === 1 && document.querySelector('.overlay')) {
    $lheaderBlockSmMenuBtn.classList.toggle("is-open");
    $lheaderNavigation.classList.toggle("is-open");

    const overlay = document.querySelector('.overlay');
    overlay.removeEventListener("click", spOpenClose);
    overlayRemove();
  }
}

/*----------------
 pc autoheight
 2018-02-16 #3031:
-----------------*/
function autoHeightRun() {
  const h = document.querySelector('.l-header__navigation > ul').offsetHeight;
  const currentUl = document.querySelector('.l-header__navigation > ul > li.current dl dd > ul');
  let i = currentUl ? currentUl.offsetHeight : 0;
  const currentDd = document.querySelector(".l-header__navigation > ul > li.current > dl > dd");
  if (currentDd) {
    currentDd.style.top = `${h}px`;
  }
  $lheaderNavigation.style.height = `${h + i}px`; // #4900

  if (document.querySelector('.navigation-light') && document.querySelector('.l-header__navigation > ul > li.light-current > dl > dd')) {
    const ti = document.querySelector('.l-header__navigation > ul > li.light-current > dl > dd').getBoundingClientRect();
    i = ti.height;
    $lheaderNavigation.style.height = `${h + i}px`; // #4900
  }

  spMenuBackground();
}

function pcAutoheight() {
  autoHeightRun();
	localnavigation_height = true;  // eslint-disable-line
  $win.addEventListener(revents, () => {
    autoHeightRun();
    spMenuBackground();
  });
	$win.addEventListener(loadEvent, () => {
    autoHeightRun();
    spMenuBackground();
  });
}

/*------------------------
	#4283
-------------------------*/
function rightNavigationList() {
	const $rightNavigationList = document.querySelector('.right-navigation__list');
	if ($rightNavigationList) {
		const $rightNavigationListLiCurrent = document.querySelector('.right-navigation__list>li.current');
		const $rightNavigationListLiUlLiCurrent = document.querySelector('.right-navigation__list li ul>li.current');
		if (!$rightNavigationListLiCurrent && $rightNavigationListLiUlLiCurrent) {
			$rightNavigationListLiUlLiCurrent.parentNode.style.display = "block";
		}
	}
}

function lHeaders() {
  if ($lheader) {

    $header = document.querySelector('header');
    $main = document.getElementById('main');
    $mainMain = $main.querySelector('main');
    $mainMainContainer = $mainMain.querySelector('.container');
    $contentWrapper = document.querySelector('.content-wrapper');
    $lheaderNavigation = document.querySelector(".l-header__navigation");
    $lheaderBlockSmMenuBtn = document.querySelector(".l-header__block__sm-menu-btn");
    $containerFluid = document.querySelectorAll('main>section'); // #4900
    $footer = document.querySelector('footer');

    if ($lheaderNavigation && !document.querySelector('.navigation-light')) { // #4900
      const $lheaderNavigationA = document.querySelectorAll(".l-header__navigation a");
      const $lheaderNavigationDdLiA = document.querySelectorAll(".l-header__navigation dd li a");

      if ($lheaderNavigationA.length) {
        countryDirectoryCreation($lheaderNavigationA, 0);
        lheaderLocationSetting($lheaderNavigationDdLiA, 0);

        if (!matchOk && rightMatchObj !== null) {
          lheaderLocationSetting($lheaderNavigationDdLiA, 2);
        }

        const liCurrentDlDdUlLiA = document.querySelectorAll(".l-header__navigation>ul>li.current>dl>dd>ul>li>dl>dd>ul>li>a");
        if (liCurrentDlDdUlLiA.length) {
          lheaderLocationSetting(liCurrentDlDdUlLiA, 5);
        }
      }
    }

    pcAutoheight();
    spMenuOpen();
    spSearchOpen();
    controllBreakPoint();
    setFixedSubHeader();

    $lheaderNavigation.classList.add('active');
  }
}

/*= =========================
 Document ready
========================== */
document.addEventListener('DOMContentLoaded', () => {
	// breadcrumb
	if(document.querySelectorAll('.breadcrumb').length !== 0){	// #5311
		$breadcrumb = document.querySelector('.breadcrumb');
		$breadcrumb.style.visibility = 'hidden';
	}

	// #4002 右ナビ各国ディレクトリ書き換え / 現在地表示
	const rightNavigationA = document.querySelectorAll(".row-lg-right-nav__nav a");
	if (rightNavigationA.length) {
		countryDirectoryCreation(rightNavigationA, 1);
	}

	/*--------
		#4283
	---------*/
  $lheader = document.querySelector('.l-header');

	if (isIE) {
		lHeaders();
		if(document.querySelectorAll('.breadcrumb').length !== 0){
			$breadcrumb.style.visibility = '';
		}
		rightNavigationList();
	} else {
		Promise.resolve().then(() => {
			lHeaders();
			if(document.querySelectorAll('.breadcrumb').length !== 0){
				$breadcrumb.style.visibility = '';
			}
		});
		Promise.resolve().then(() => {
			rightNavigationList();
		});
	}

	/*--------
		#4307
	---------*/
	if(document.querySelectorAll('.navigation-light').length === 0){	// #4900
		const lheaderNavigationHierarchy03 = document.querySelectorAll(".l-header__navigation>ul>li>dl>dd>ul>li");
		if (lheaderNavigationHierarchy03.length) {
			lheaderNavigationHierarchy03Mouseover(lheaderNavigationHierarchy03);
		}
	}

	/*----------------------------------------
		transition control
	---------------------------------------- */
	if ($lheader) {
		lhElem = document.querySelector('.l-header');
		lhElem.addEventListener('transitionstart', () => {
			localNavigationScroll = true;
		},false);
		lhElem.addEventListener('transitionend', () => {
			localNavigationScroll = false;
		},false);
	}

}, false);





/* ----------------------------------------
   sp slide toggle
---------------------------------------- */
/*
function spSlideToggle(){
	$(".l-header__navigation > ul > li.current > dl > dt > a").on("click", function() {
		$(this).parent().next().slideToggle();
		$(this).toggleClass("is-open");
	});
}
*/
};

localNavigationInitialization();

