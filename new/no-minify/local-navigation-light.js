/*==========================================================
	2018-08-03 #4900【不具合修正】ナビ仕様変更に伴う修正
	2018-08-03 #5349【不具合修正】ローカルナビ（タブレット時）
	2018-11-28 #4936【不具合修正】アンカーリンク
==========================================================*/
(function ($) {
	'use strict';
	var $body = [];
	var $navigationLight = [];
	var $navigationLight_ul = [];
	var $navigationLight_ul_li = [];
	var currentInd = -1;
	var clickEvent = 'click';
	var overEvent = 'mouseover';
	var naviTimeout = 0;

	var document = window.document,
	css = document.createElement('style'),
	styles = document.createTextNode('.right-navigation__list li:not(.light-current) ul{display:none}'),
	styles2 = document.createTextNode('.right-navigation__list li.current ul{display:block}'),
	styles3 = document.createTextNode('.right-navigation__list li.light-current ul{display:block}');
	css.type = 'text/css';
	if (css.styleSheet) {
		css.styleSheet.cssText = styles.nodeValue;
	} else {
		css.appendChild(styles);
	}
	css.appendChild(styles2);
	css.appendChild(styles3);
	document.querySelector('head').appendChild(css);

	//タッチデバイスの時　#5349
	if (window.ontouchstart === null) {
		clickEvent = 'touchend';
		overEvent = 'touchstart';
	}

	document.addEventListener("DOMContentLoaded", mainProcRun, false);

	function mainProcRun() {
		$navigationLight = $('.navigation-light');
		if ($navigationLight) {
			mainProc();
		}
	}

	function mainProc() {
		current_repositioning(); //currentをリセット -> 付け直し

		$body = $('body');
		$navigationLight.css('z-index', 1);
		$navigationLight_ul = $navigationLight.children('ul');
		$navigationLight_ul_li = $navigationLight_ul.children('li');

		var lheader__navigation_hierarchy_01 = document.querySelectorAll(".l-header__navigation.navigation-light>ul>li");
		if (lheader__navigation_hierarchy_01) {
			lheaderNavigation_hierarchy_mouseover(lheader__navigation_hierarchy_01);
		}

		/*---------------------------------------
		currentをリセット -> 付け直し	
		---------------------------------------*/
		function current_repositioning() {
			var navMatch = false;
			var rmatch = false;
			var $navigation_light = [];
			var $rowLgRightNav = [];
			var $navigation_light_current = [];
			var $rowLgRightNav_current = [];
			var $navigation_light_a = [];
			var $rowLgRightNav_a = [];
			var orgURl = location.href;
			var loc1 = orgURl;
			
			loc1 = loc1.replace('https://', '');
			loc1 = loc1.replace('http://', '');
			loc1 = loc1.replace(/#.+$/,"");
			loc1 = loc1.replace(/\?.+$/,"");

			var loc2 = loc1.replace(/\/.+$/, "");
			var locAddr1 = loc1.replace(loc2, ''); //現在地
			if(locAddr1.indexOf('.html') ===-1){
				locAddr1 = locAddr1 + 'index.html';	
			}
			var locAddr2 = locAddr1.substring(locAddr1.lastIndexOf('\/')+1,-1);
			var locArr = locAddr2.split('\/');
			locArr.shift();
			locArr.pop();

			$navigation_light = document.querySelector('.navigation-light>ul');
			$rowLgRightNav = document.querySelector('.row-lg-right-nav__nav');

			if ($navigation_light) {
				$navigation_light_current = $navigation_light.querySelectorAll('.current, .light-current, .light-open');
				$navigation_light_a = $navigation_light.querySelectorAll('a');
			}
			if ($rowLgRightNav) {
				$rowLgRightNav_current = $rowLgRightNav.querySelectorAll('.current');
				$rowLgRightNav_a = $rowLgRightNav.querySelectorAll('a');
			}

			staticCurrent_delete(); //静的currentを削除
			$('.row-lg-right-nav__nav * li.current').removeClass('current');

			if ($rowLgRightNav_a) {
				rowLgRightNav_set(locAddr1); //右ナビ 第2階層 (＊a) 一致
				/*
				if(!rmatch) {	//index.htmlで検索
					var rAddr = locAddr1.replace(/[^\/]+\.html/,'index.html');
					rowLgRightNav_set(rAddr);
				}
				*/
			}
			if($rowLgRightNav){
				$rowLgRightNav.classList.add('active');
			}



			if ($navigation_light_a) {
				navigation_light_set(locAddr1); //$navigation_light 第2階層 (＊a) 一致
				if(!navMatch) {	//index.htmlで検索
					locAddr1 = locAddr1.replace(/[^\/]+\.html/,'index.html');
					navigation_light_set(locAddr1);
				}
				if(!navMatch && locArr.length) {
					var turl = locAddr1;
					while(locArr.length > 0) {
						turl = turl.replace(locArr[locArr.length-1] + '/','');
						navigation_light_set(turl); //$navigation_light 第2階層 (＊a) 一致
						locArr.pop();
						if(navMatch) {
							break;
						}
					}
				}
			}


			/*-------------------
				Local関数
			--------------------*/

			//静的currentを削除
			function staticCurrent_delete() {
				if ($navigation_light_current) {
					for (var ca = 0; ca < $navigation_light_current.length; ca++) {
						var a = $navigation_light_current[ca];
						a.classList.remove('current');
						a.classList.remove('light-current');
						a.classList.remove('light-open');
					}
				}

				if ($rowLgRightNav_current) {
					for (var cb = 0; cb < $rowLgRightNav_current.length; cb++) {
						var b = $rowLgRightNav_current[cb];
						b.classList.remove('current');
					}
				}

			}

			//$navigation_light 第2階層 (＊a) 一致
			function navigation_light_set(url) {
				var lUrl = "";
				for (var ca = 0; ca < $navigation_light_a.length; ca++) {
					lUrl = url;
					var aa = $navigation_light_a[ca];
					var tName = aa.pathname;
					if (tName.indexOf('.html') === -1) {
						tName = tName + 'index.html';	
					}
					//console.log(lUrl + '===' +  tName);
					if (tName === lUrl) {
						var he2 = aa.parentNode.parentNode;
						he2.classList.add('current');
						he2.classList.add('light-current');
						navMatch = true;

						//親Liまで遡る(max99)
						var he3 = aa.parentNode;
						for (var rt = 0; rt <= 99; rt++) {
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

			//右ナビ 第2階層 (＊a) 一致
			function rowLgRightNav_set(url) {
				for (var ca = 0; ca < $rowLgRightNav_a.length; ca++) {
					rmatch = false;
					var lUrl = url;
					var aa = $rowLgRightNav_a[ca];
					var he3 = aa.parentNode.parentNode;
					var tName = aa.pathname;
					if (tName.indexOf('.html') === -1) {
						tName = tName + 'index.html';	
					}

					if (tName === lUrl) {
						var he2 = aa.parentNode;
						he2.classList.add('current');						
						if(he3.tagName.toLowerCase()  === 'ul'){
							he3.parentNode.classList.add('light-current');
						}
						
						rmatch = true;
					}

				}

			}

		}


		/*---------------------------------------
		上層 mouseover -> 下層のtop計算
		----------------------------------------*/
		function lheaderNavigation_hierarchy_mouseover(obj) {

			var lng = obj.length;
			var obj01 = obj;
			for (var i = 0; i < lng; i++) {
				(function (n) {
					var nId = 0;
					var tObj = [];

					obj01[n].addEventListener("mouseover", function (e) {
						tObj = this;
						if (window.matchMedia('(min-width:720px)').matches) {
							clearTimeout(nId);
							var obj01ParentRect = tObj.parentNode.getBoundingClientRect();
							//var obj01Rect = tObj.getBoundingClientRect();
							var obj02 = tObj.querySelector('dl>dd');
							if (obj02) {
								//obj02.style.top = (obj01ParentRect.top +  obj01ParentRect.height + tObj.clientHeight - 1) + 'px';
								obj02.style.top = (obj01ParentRect.height) + 'px';
							}
							nId = setTimeout(function () {
								tObj.classList.add('light-open');
							}, 300, n);
						}
						e.preventDefault();
						
					}, false);

					obj01[n].addEventListener("mouseout", function (e) {
						if (window.matchMedia('(min-width:720px)').matches) {
							clearTimeout(nId);
							//console.log(obj01[n].parentNode);								
							nId = setTimeout(function (n) {
								obj01[n].classList.remove('light-open');
							}, 300, n);
						}

						e.preventDefault();

					}, false);

				})(i);

				if (obj01[i].querySelectorAll("dl>dd>ul>li").length) {
					lheaderNavigation_hierarchy_mouseover(obj01[i].querySelectorAll("dl>dd>ul>li"));
				}

			}

		}

		$navigationLight_ul_li.each(function () {
	
			var tobj = $(this);
			if (tobj.hasClass('light-current')) {
				currentInd = $navigationLight_ul_li.index(tobj);
			}

			tobj.on(overEvent, function (e) {
			
				if (window.matchMedia('(min-width:720px)').matches) {
					var tObj = this;

					clearTimeout(naviTimeout);					
					naviTimeout = setTimeout(function () {
						if(overEvent !== 'touchstart'){	//#5349
							$navigationLight_ul_li.removeClass('light-open');
							tobj.addClass('light-open');
						} else {				
							if(tobj.hasClass('light-open')){
								tobj.removeClass('light-open');
							} else {
								$navigationLight_ul_li.removeClass('light-open');
								tobj.addClass('light-open');
							}
						}

						if ($navigationLight_ul_li.index(tObj) !== currentInd) {
							$navigationLight_ul_li.eq(currentInd).addClass('light-current-hide');
						} else {
							$('.light-current-hide').removeClass('light-current-hide');
						}
					}, 300);

					if(overEvent !== 'touchstart'){	//#5349
						e.preventDefault();
					}

				}
			});

			tobj.on('mouseout', function (e) {
				if (window.matchMedia('(min-width:720px)').matches) {
					clearTimeout(naviTimeout);
					naviTimeout = setTimeout(function () {
						$navigationLight_ul_li.removeClass('light-open');
						$('.light-current-hide').removeClass('light-current-hide');
					}, 300);
					
					e.preventDefault();

				}
			});

			//スマホ
			tobj.children('dl').children('dt').on(clickEvent, function () {
				var tobj_dl_dd = [];
				if (window.matchMedia('(max-width:719px)').matches) {
					tobj_dl_dd = tobj.children('dl').children('dd');
					if (tobj.hasClass('light-open')) {
						if (tobj_dl_dd.length) {
							tobj_dl_dd.slideUp('fast', function () {
								tobj.removeClass('light-open');
							});
						} else {
							tobj.removeClass('light-open');
						}
					} else {
						if (tobj_dl_dd.length) {
							tobj_dl_dd.slideDown('fast', function () {
								tobj.addClass('light-open');
							});
						} else {
							tobj.addClass('light-open');
						}
					}
				}

				return false;
			});

		});

	}

})(jQuery);