/*====================================================
local-navigation.js
	2018-02-16 #3031: グロナビの箇所のjs制御実装
	2018-03-09 #4002 グロナビ・右ナビのカレント表示とディレクトリ書き換え用のjsの開発
	2018-03-20 #4002-#4 グロナビ・右ナビのカレント表示とディレクトリ書き換え用のjsの開発
	2018-04-20 #4282 sp時のページ最下部までスクロールした時の挙動　【js修正対応その2】
	2018-04-23 #4281 第３階層以下のカレント表示の見直し　【js修正対応その１】
	2018-04-24 #4283 右ナビの子ページを含む場合の表示・非表示制御　【js修正対応その3】
	2018-04-27 #4305 サイト表示時のナビの段階的表示の調査
	2018-05-01 #4307 ウィンドウ幅が狭い時のグロナビの第３階層ホバー表示の仕様
	2018-08-07 #4900 【不具合修正】ナビ仕様変更に伴う修正
	2018-11-14 #5869 【不具合修正】ローカルナビのカレント表示
	2018-11-22 #4936【不具合修正】アンカーリンク
	2018-11-22 #5311 パンクズがないページでナビがうまく動かない
	2018-11-26 #5795 【不具合修正】グロナビを開いたときのコンテンツ
	2018-11-28 #4936【不具合修正】アンカーリンク
	2018-12-05 #6032【不具合修正】IR各国のパスの書き換え
====================================================*/
var localnavigation_height = false;	//l-header height set flg
var localnavigation_Scroll = false; //l-header transition flg
	
(function($){
'use strict';

/*==========================
	css追加
	#4283
	#4305
==========================*/
var document = window.document,
	css = document.createElement('style'),
	styles = document.createTextNode('.right-navigation__list li:not(.current) ul{display:none};'),	//#4283
	styles2 = document.createTextNode('.l-header__navigation:not(.active) > ul > li > dl > dd{visibility:hidden};');	//#4305

css.type = 'text/css';
if (css.styleSheet) {
	css.styleSheet.cssText = styles.nodeValue;
} else {
	css.appendChild(styles);
}
css.appendChild(styles2);
//css.appendChild(styles3);
document.querySelector('head').appendChild(css);

/*==========================
 Global variables
==========================*/
var $win = [];

//var $body = [];
var $header = {};
var lhElem = {};
var $breadcrumb = {};
var $main = {};
var $main_main = {};
var $main_main_container = {};
var $contentWrapper = {};
var $lheader = {};
var $lheader__block = {};
var $lheader__navigation ={};
var $lheader__block__smMenuBtn = {};
var $containerFluid = {};
var $footer = {};
var savewTop = 0;
var savelheaderTop = 0;
var hnOpen = false;
var ua = navigator.userAgent;
var ios = new RegExp('(iPhone|iPod|iPad).+ OS ([0-9]+)_.+ Safari', "i");
var isIE = false;
var revents = 'load resize'; //resize event
var fixedClearCss = {
	position: '',
	top: ''
};
var locURL = decodeURI(location.href);
var locArr = [];
var lcURL = locURL;
var lcURLpass = "";
var lcDomain = "";
var countryDir = "";
var matchOk = false;
var rightMatchObj = null;

if (ua.match(ios)) {
	revents = 'load orientationchange';
}

if (ua.match(/MSIE/i) || ua.match(/Trident/)) {
	isIE = true;
}

lcURL = lcURL.replace(/#.+$/,"");
lcURL = lcURL.replace(/\?.+$/,"");
lcURL = lcURL.replace('https:\/\/', '');
lcURL = lcURL.replace('http:\/\/', '');

if (lcURL.charAt(lcURL.length - 1) === '/') {
	lcURL += 'index.html';
}

locArr = lcURL.split('/');
lcDomain = locArr[0];
lcURL = lcURL.replace(lcDomain, '');

// #4281
lcURLpass = lcURL;
if (locArr[locArr.length - 1].indexOf('.html') !== -1) {
	lcURLpass = lcURLpass.replace(locArr[locArr.length - 1], '');
}


/*==========================
 Document ready
==========================*/
document.addEventListener('DOMContentLoaded', function () {
	//breadcrumb
	if(document.querySelectorAll('.breadcrumb').length !== 0){	//#5311
		$breadcrumb = document.querySelector('.breadcrumb');
		$breadcrumb.style.visibility = 'hidden';
	}

	//#4002 右ナビ各国ディレクトリ書き換え / 現在地表示
	var rightNavigation_a = document.querySelectorAll(".row-lg-right-nav__nav a");
	if (rightNavigation_a.length) {
		countryDirectoryCreation(rightNavigation_a, 1);
	}

	/*--------
		#4283
	---------*/
	$lheader = $('.l-header');

	if (isIE) {
		lHeaders();
		if(document.querySelectorAll('.breadcrumb').length !== 0){
			$breadcrumb.style.visibility = '';
		}
		rightNavigation__list();
	} else {
		new Promise(function (resolve, reject) {
			lHeaders();
			if(document.querySelectorAll('.breadcrumb').length !== 0){
				$breadcrumb.style.visibility = '';
			}
		});
		new Promise(function (resolve, reject) {
			rightNavigation__list();
		});
	}

	/*--------
		#4307
	---------*/
	if(document.querySelectorAll('.navigation-light').length === 0){	//#4900
		var lheader__navigation_hierarchy_03 = document.querySelectorAll(".l-header__navigation>ul>li>dl>dd>ul>li");
		if (lheader__navigation_hierarchy_03.length) {
			lheaderNavigation_hierarchy03_mouseover(lheader__navigation_hierarchy_03);
		}
	}

	/*----------------------------------------
		transition control
	---------------------------------------- */
	if ($lheader.length) {
		lhElem = document.querySelector('.l-header');
		lhElem.addEventListener('transitionstart', function () {
			localnavigation_Scroll = true;
		},false);
		lhElem.addEventListener('transitionend', function () {
			localnavigation_Scroll = false;
		},false);
	}

}, false);


/*==========================
 static fucntion
==========================*/
/*---------------------------------------
#4307 第3階層 mouseover -> 第4階層のtop計算
----------------------------------------*/
function lheaderNavigation_hierarchy03_mouseover(obj) {
	if (document.body.classList[0].indexOf('sp') === -1) {

		var lng = obj.length;
		var obj03 = obj;
		for (var i = 0; i < lng; i++) {
			(function (n) {
				obj03[n].addEventListener('mouseover', function () {
					var obj03ParentRect = obj03[n].parentNode.getBoundingClientRect();
					var obj03Rect = obj03[n].getBoundingClientRect();
					var obj04 = obj03[n].querySelector('dl>dd');
					if (obj04) {
						obj04.style.top = (obj03Rect.top - obj03ParentRect.top + obj03[n].clientHeight -1) + 'px';
					}
				}, false);
			})(i);
		}

	}

}

/*------------------------
	#4283
-------------------------*/
function rightNavigation__list() {
	var $rightNavigation__list = document.querySelector('.right-navigation__list');
	if ($rightNavigation__list) {
		var $rightNavigation__list_liCurrent = document.querySelector('.right-navigation__list>li.current');
		var $rightNavigation__list_li_ul_liCurrent = document.querySelector('.right-navigation__list li ul>li.current');
		if (!$rightNavigation__list_liCurrent && $rightNavigation__list_li_ul_liCurrent) {
			$rightNavigation__list_li_ul_liCurrent.parentNode.style.display = "block";
		}
	}
}

function lHeaders() {

	if ($lheader.length) {

		$win = $(window);
		//$body = $('body');
		$header = $('header');
		$main = $('#main');
		$main_main = $main.find('main');
		$main_main_container = $main_main.find('.container');
		$contentWrapper = $('.content-wrapper');
		$lheader__block = $('.l-header__block');
		$lheader__navigation = $(".l-header__navigation");
		$lheader__block__smMenuBtn = $(".l-header__block__sm-menu-btn");
		//$containerFluid = $('.container-fluid');
		$containerFluid = $('main>section');	//#4900
		$footer = $('footer');

		if ($lheader__navigation.length && document.querySelectorAll('.navigation-light').length === 0) {	//#4900

			var $lheader__navigation_a = document.querySelectorAll(".l-header__navigation a");
			var $lheader__navigation_dd_li_a = document.querySelectorAll(".l-header__navigation dd li a");
			if ($lheader__navigation_a.length) {
				countryDirectoryCreation($lheader__navigation_a, 0);
				lheaderLocationSetting($lheader__navigation_dd_li_a, 0);

				if (!matchOk && rightMatchObj !== null) {
					lheaderLocationSetting($lheader__navigation_dd_li_a, 2);
				}

				//#4281
				var liCurrent_dl_dd_ul_li_a = document.querySelectorAll(".l-header__navigation>ul>li.current>dl>dd>ul>li>dl>dd>ul>li>a");
				if (liCurrent_dl_dd_ul_li_a.length) {
					lheaderLocationSetting(liCurrent_dl_dd_ul_li_a, 5);
				}

			}

		}

		pcAutoheight();

		spMenuOpen();
		spSearchOpen();

		controllBreakPoint();
		setFixedSubHeader();

		/*--------
			#4305
		---------*/		
		$lheader__navigation.addClass('active');
	}
}


/*--------------------------------
#4002 国別ディレクトリ書き換え　-> 現在地表示
#4002-#4 
---------------------------------*/
function countryDirectoryCreation(targetObj, depth) {
	var i = 0;
	var tlength = targetObj.length;

	countryDir = locArr[1];

	while (i < tlength) {
		var thisURL = targetObj[i].attributes.href.nodeValue;
		var thisArr = thisURL.split('/');
		if (thisURL.charAt(0) === '/' && thisURL.indexOf('\/us-en\/') !== -1) {
			thisURL = thisURL.replace(thisArr[1], countryDir);
			targetObj[i].href = thisURL;
			if (depth === 1) {
				locationSetting(targetObj[i], depth);
				/*
				if(matchOk){
					break;
				}
				*/
			}

		}
		i = (i + 1) | 0;
	}

}

function lheaderLocationSetting(targetObj, depth) {
	var i = 0;
	var tlength = targetObj.length;

	while (i < tlength) {
		locationSetting(targetObj[i], depth);
		if (matchOk) {
			break;
		}
		i = (i + 1) | 0;
	}
}

/*--------------------------------
#4002 locationから現在地表示
#4281 第5階層から現在地表示
---------------------------------*/
function locationSetting(tObj, depth) {
	var ptObj = [];
	var parObj = [];
	var tgURL = "";
	var lccURL = lcURL;
	matchOk = false;

	if (depth === 5) { //#4281
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
			tgURL = tgURL.replace('http:\/\/', '');
		} else if (tgURL.indexOf('https:') !== -1) {
			tgURL = tgURL.replace('https:\/\/', '');
		}
		tgURL = tgURL.replace(lcDomain, '');
			
		if(tgURL === lccURL) { //#5869
		//if (tgURL.indexOf(lccURL) === 0) { //#4281
		//if(tgURL.match(lccURL)){

			ptObj.classList.add('current');

			//親liにもcurrnet 設定 #5869					
			var parentObj = ptObj.parentNode.parentNode.parentNode.parentNode;
			if(parentObj){
				//console.log(parentObj.tagName);
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


/*----------------
 pc autoheight
 2018-02-16 #3031:
-----------------*/
function pcAutoheight() {
	autoHeightRun();
	localnavigation_height = true;
	$win.on(revents, function () {
		autoHeightRun();
		spMenuBackground();
	});
}

function autoHeightRun() {
	//var bp = getBreakPointIndex();
	var h = $('.l-header__navigation > ul').height();
	var i = $('.l-header__navigation > ul > li.current dl dd > ul').height();
	$(".l-header__navigation > ul > li.current > dl > dd").css("top", h);
	//$lheader__navigation.css("height", h + i +1);	//#4307 +1
	$lheader__navigation.css("height", h + i);	//#4900

	//#4900
	if(document.querySelectorAll('.navigation-light').length !== 0 && document.querySelectorAll('.l-header__navigation > ul > li.light-current > dl > dd').length !==0) {	//#4900
		var ti = document.querySelector('.l-header__navigation > ul > li.light-current > dl > dd').getBoundingClientRect();
		i = ti.height;
		//$lheader__navigation.css("height", h + i +1);	//#4307 +1
		$lheader__navigation.css("height", h + i);	//#4900
	}

	spMenuBackground();

}


/*----------------
 sp menu background
----------------*/
function spMenuBackground() {
	var bp = getBreakPointIndex();
	var ovelayCss = {
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
	var fixedCss = {
		position: 'fixed',
		zIndex: 0
	};

	hnOpen = $lheader__navigation.hasClass("is-open");

	$lheader.css({
		transition: 'top .4s ease-in-out'
	});

	if (bp === 0 && hnOpen && $('.overlay').length === 0) { //背景がない時

		savewTop = $win.scrollTop();
		savelheaderTop = $lheader.css('top');

		$lheader.css('position', 'relative').css('z-index', 65535);

		$header.css('position', 'relative').css('z-index', 100);
		$contentWrapper.css('position', 'relative').css('width', '100%').css('marginTop', 0);
		
		//<main>以下の第一階層のタグをfixed化
		$('main').children('section,div').each(function(){
			if($(this).hasClass('l-header') === -1) {
				$(this).css(fixedCss).css('top',$(this).offset().top);
			}
		});
		$win.scrollTop(0);

		$main_main.append('<div class="overlay"></div>');

		$('.overlay').css(ovelayCss);
		$(".overlay").on("click", function () {
			spOpenClose();
		});

	} else if (bp === 0 && !hnOpen) {
		if ($(".overlay").length) {

			$(".overlay").off("click", function () {
				spOpenClose();
			});

			overlayRemove();

			$lheader.css('top', savelheaderTop);

			setFixedSubHeader();

			$win.scrollTop(savewTop);

		}

	} else if (bp === 1 && $('.overlay').length) {
		$lheader__block__smMenuBtn.toggleClass("is-open");
		$lheader__navigation.toggleClass("is-open");

		$(".overlay").off("click", function () {
			spOpenClose();
		});

		overlayRemove();

	}

	function overlayRemove() {
		$('.overlay').remove();
		$header.css(fixedClearCss);
		$contentWrapper.css(fixedClearCss);
		$main_main_container.css(fixedClearCss);
		$containerFluid.css(fixedClearCss);
		$footer.css(fixedClearCss);
	}
}

/*----------------
 sp menu open
----------------*/
function spMenuOpen() {
	$lheader__block__smMenuBtn.on("click", function () {
		spOpenClose();
	});
}

function spOpenClose() {
	$lheader__block__smMenuBtn.toggleClass("is-open");
	$lheader__navigation.toggleClass("is-open");

	spMenuBackground();
}


/*------------------
 sp search open
------------------*/
function spSearchOpen() {
	$(".l-header__block__sm-search-btn").on("click", function () {
		$(this).toggleClass("is-open");
		$(".l-header__block__search").toggleClass("is-open");
	});
}


/* ----------------------------------------
    Breakpoint controll
    window.innerWidth
    0: 719px or less (for sp)
    1: 720px or more (for pc)
---------------------------------------- */
function getBreakPointIndex() {

	var bp = [720]; // min-width
	var winW = window.innerWidth;
	var bplen = bp.length;
	var bpi = 0;
	while (bpi < bplen) {
		if (winW < bp[bpi]) {
			break;
		}
		bpi++;
	}

	return bpi;
}

function controllBreakPoint() {

	var lastbpi = getBreakPointIndex();

	$win.on(revents, function () {
		checkBreakPoint();
	});

	function checkBreakPoint() {
		var currentbpi;
		currentbpi = getBreakPointIndex();
		if (lastbpi !== currentbpi) {
			$win.trigger('break', currentbpi);
		}
		lastbpi = currentbpi;
	}
}




/* ----------------------------------------
   set fixed subheader
---------------------------------------- */
function setFixedSubHeader() {

	var funcName = 'setFixedSubHeader';
	var $contents = $('.content-wrapper');
	var $lheader__block = $('.l-header__block');
	var sevents = 'load.' + funcName + ' scroll.' + funcName + ' resize.' + funcName;
	if (ua.match(ios)) {
		sevents = 'load.' + funcName + ' scroll.' + funcName + ' orientationchange.' + funcName;
	}

	var bpi = getBreakPointIndex();

	hnOpen = $lheader__navigation.hasClass("is-open");
	if(!localnavigation_Scroll){
		controll(bpi);

	} else {
		lhElem.addEventListener('transitionend', function () {
			controll(bpi);
			lhElem.removeEventListener('transitionend', function () {
				controll(bpi);
			},false);
		},false);

	}

	$win.on('break', function (e, bpi) {
		if(!localnavigation_Scroll){
			controll(bpi);
		} else {
			lhElem.addEventListener('transitionend', function () {
				controll(bpi);
				lhElem.removeEventListener('transitionend', function () {
					controll(bpi);
				},false);
			},false);

		}
	});

	function controll(bpi) {
		var headerWrapH = $lheader.outerHeight();
		var headerTtlH = $lheader__block.outerHeight();
		var headerY = $lheader.offset().top;
		var startPos = 0;
		var confixedCss = {
			position: 'fixed',
			width: '100%',
			zIndex: 65535,
			top: 0,
			backgroundColor: '#fff',
			transition: 'top .4s ease-in-out'
		};

		$win.off('.' + funcName);

		if (!hnOpen) {
			$lheader.removeAttr('style');
			$contents.removeAttr('style');
		}


		$win.on(sevents, function () {

			var winScrollY = $(this).scrollTop();

			if (!hnOpen && (winScrollY < document.body.clientHeight - window.innerHeight) && !window_init_Scroll) {
				localnavigation_Scroll = false;
				$lheader.css({
					transition: 'top .4s ease-in-out'
				});

				//console.log((winScrollY + $lheader.height()) + "/" + (document.body.clientHeight-$footer.height()));

				if (winScrollY > headerY && !localnavigation_Scroll) {
					localnavigation_Scroll = false;
					$lheader.css(confixedCss);
					$contents.css('margin-top', headerWrapH);
					if (bpi === 0) {
						if (!$('body').hasClass('is-localmenu-open')) {
							if (winScrollY + Math.ceil($lheader.height() / 3) > document.body.clientHeight - $footer.height()) {
								//footerにかかる時はヘッダーナビ非表示
								positionClear();
							} else if (winScrollY > startPos) {
								$contents.css('margin-top', 0);
								$lheader.css('top', -headerWrapH);
							} else {
								$lheader.css('top', 0);
							}
						}
					} else if (bpi === 1) {
						if (winScrollY > startPos) {
							$lheader.css('top', -headerTtlH);
						} else {
							$lheader.css('top', 0);
						}
					}
					startPos = winScrollY;
				} else {
					positionClear();
				}

			}

		});

		function positionClear() {
			if ($lheader.css('position') !== "" && !localnavigation_Scroll) {
				$lheader.css(fixedClearCss);
				$contents.css('margin-top', 0);
			}
		}

	}
}


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
})(jQuery);