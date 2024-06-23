/* ===========================================================================
    topics-list js
		Built with AngularJS 1.5

	2019-05-29 #7158: 【Newsroom】IRニュースにラベル追加
	2019-03-26 #6688 Gomez対策①【JS修正】
	2018-12-26 #6161 【ニュースルーム】2019年対応
	2018-05-15 #4188[#11] カントリーセレクターページの /xx-xx/ -> /us-en/ 変換対応
	2018-03-19 #3964[#13] 日本語、各国語サイトのIRニュース 修正
	2018-03-09 #3859 キービジュアルスライダーの仕様についての確認→改修 / #3964 日本語、各国語サイトのIRニュース
	2018-01-22 IR対応
	2017/11/09 news room collaboration bug fix
	2017/10/27 news room collaboration
	2017/06/27 news for Country selector
	2017/06/22 for Country selector & .com top
	2017/06/03 not-managed for China
	2017/04/10 modal Decision for Japan	
=============================================================================== */

(function () {

'use strict';

var yy = 2021; // *The latest year(newsroom参照用)

var yyMax = 2; // *Maximum number of years in the past (newsroom参照用)
var contObj = [];
var contFin = [];
var contLng = [];
var newsCnt = 0;
var prldm = new Image();
prldm.src = "/shared/unchangeable/img/excelcms_load.gif";
var loadText = '<img src="/shared/unchangeable/img/excelcms_load.gif" alt="Loading...">';

var langs = "";
var localUrl = decodeURI(location.href).replace(/\?.+$/, "");
localUrl = decodeURI(location.href).replace(/\#.+$/, "");

var locArr = localUrl.split('/');

var irIcons = {1:['決算','Financial Results','822700'],
2:['株主総会','Shareholders Meeting','00492f'],
3:['ニュースリリース','News Release','005280'],
4:['IR資料室','IR Materials','6a6a71'],
5:['IRイベント','IR event','b81570'],
6:['株式・債券','Stock &amp; Bonds','9707bb'],
7:['トピックス','Topics','dadcdc']
};

//main controler
function mainCont() {
	this.yyc = 0;
	this.outputList = new Array();
	this.dMax = -1;
	this.dJson = "";	//2018-03-09 #3859
	this.localFolder = "/";
	//this.keyvisualFolder = "";
}
mainCont.prototype.mainConttoller = function ($http, $attrs, $scope) {
	var conObj = [];
	var listLabel = "";
	var fname = "";
	var dType;
	var regNewsroom = false;
	var tData;
	var x = 0;
	var obj = [];
	var tObj = this;
	var loci = 0;

	if ($attrs) {
		dType = $attrs.type;
		conObj = contObj[dType];
	} else {
		return false; // non type -> break
	}
	
	if($attrs.year){
		yy = $attrs.year;
		yyMax = 1;
	}

	locArr.forEach(function (vals) {
		if ((loci > 2) && (loci < (locArr.length - 1)) && (vals !== "") && (conObj.localFolder.search(vals) == -1)) {
			conObj.localFolder += (vals + "/");
		}
		loci++;
	});

	if (conObj.localFolder.match(/\/jp-ja\//)||(conObj.localFolder==='/')) { //2017/10/27 jp-ja,com,selectorはnewsroom参照
		regNewsroom = true;
	} else if(conObj.localFolder.match(/\/selector\//)){	//2017/06/27 news for Country selector
		regNewsroom = true;
		conObj.localFolder = '/';
	}

	if (!contLng[dType]) { //件数情報と終了情報リセット
		contFin[dType] = false;
		contLng[dType] = 0;
	}

	if ($attrs.max) {
		conObj.dMax = $attrs.max;
	}

	if ($attrs.json) {	//2018-03-09 #3859
		conObj.dJson = $attrs.json;
	}
	
	listLabel = 'listDatas_' + yy;
	tObj.listDatas = [];

	if(conObj.dJson !== ""){	//2018-03-09 #3859
		fname = conObj.dJson + dType + '.json';
	
	} else if (dType === 'news' || dType === 'investors') { //2017/10/27 jp-ja,com,selectorはnewsroom参照, 2018-01-22 IR対応

		if(dType === 'investors'){
			regNewsroom = true;
			langs = document.getElementsByTagName('html')[0].getAttribute('lang');
			if(langs === 'ja'){
				conObj.localFolder = '/jp-ja/';
			} else {
				conObj.localFolder = '/';
			}
		}	
			
		
		if (regNewsroom) {
			fname = conObj.localFolder + 'newsroom/json/newsroom-' + (yy - conObj.yyc) + '.json';
		} else {
			fname = conObj.localFolder + 'json/topics.json';
		}
	} else if (dType === 'selector') {
		fname = '/selector/json/selector.json';
	} else {
		fname = conObj.localFolder + 'json/' + dType + '.json';
	}


	return $http.post(fname)
		.success(function (data, status, headers, config) {
			var i=0;
		
			if (regNewsroom && (dType === 'news' || dType === 'investors')) { //2017/10/27 newsroomから変換, 2017/11/09 bug fix, 2018-01-22 IR対応
				var nc = 0;
				obj = [];

				$(data).each(function (r) {
				
					if(dType === 'news' && data[r].Gateway){
						obj[nc] = {};
						obj[nc].Date = data[r].Date;
						obj[nc].Title = data[r].Title;
						obj[nc].Link = data[r].Url;
						obj[nc].Icon = "0";
						obj[nc].Target = "0";
						nc++;
						
					} else if(dType === 'investors' && data[r].IR !=='0'){
					
						var icTyp = data[r].IR.toString();
						
						obj[nc] = {};
						obj[nc].Date = data[r].Date;
						obj[nc].Title = data[r].Title;
						obj[nc].Link = data[r].Url;
						
						obj[nc].iconType = irIcons[icTyp][2];
						if(langs === 'ja'){
							obj[nc].iconTitle = irIcons[icTyp][0];
						} else {
							obj[nc].iconTitle = irIcons[icTyp][1];
						}
						
						obj[nc].Target = "0";
						
						nc++;
						
					}
					
					
				});
				
			} else {
				obj = data;
			}

			x = 0;
			if (tObj.listDatas) {
				x = tObj.listDatas.length;
			}
			
			i =0;
			while(obj[i]) {
			//for (var i in obj) {
				tData = obj[i];
				if ((conObj.dMax !== -1) && (conObj.outputList.length >= conObj.dMax)) {
					break;
				} else {
					outputAdd(x, tObj.listDatas, conObj.outputList);
					contLng[dType]++;
				}
				
				i++;
			}

			if (dType === 'selector') { //2017/06/22 for Country selector & .com top
				$('.region-list a').each(function(){
					var reg = $(this).attr('href');
					reg = reg.replace('#','').replace('-','');
					$scope['facts' + reg] = conObj.outputList[reg];
				});
				contFin[dType] = true;
				return false;

			} else {

				if (conObj.dMax !== -1) {
					if ((dType === 'news' || dType === 'investors') && regNewsroom) { //2018-01-22 new or investorsは規定件数以下の時、前年を取得
						conObj.yyc++;
						if ((conObj.yyc < yyMax) && (conObj.outputList.length < conObj.dMax)) {
							conObj.mainConttoller($http, $attrs, $scope);
						} else if (conObj.outputList.length !== 0) {
							$scope.facts = conObj.outputList;
							contFin[dType] = true;
							return false;
						} else {
							contFin[dType] = true;
							return false;
						}
					} else {
						$scope.facts = conObj.outputList;
						contFin[dType] = true;
						return false;
					}
				} else {
					$scope.facts = conObj.outputList;
					contFin[dType] = true;
					return false;
				}

			}

		})
		.error(function (data, status, headers, config) {

			if ((dType === 'news' || dType === 'investors') && regNewsroom) { //018-01-22 new or investorsは規定件数以下の時、前年を取得
				conObj.yyc++;
				if ((conObj.yyc < yyMax) && (conObj.outputList.length < conObj.dMax)) {
					conObj.mainConttoller($http, $attrs, $scope);
				} else if (conObj.outputList.length !== 0) {
					$scope.facts = conObj.outputList;
					contFin[dType] = true;
					return false;
				} else {
					contFin[dType] = true;
					return false;
				}

			} else {
				contFin[dType] = true;
				return false;
			}

		});


	function outputAdd(x, obj, sObj) {
		obj[x] = [];
		if (tData.Date) {
			obj[x].date = tData.Date.replace('/', '.');
			obj[x].date = obj[x].date.replace('/', '.');
			
			//obj[x].date = obj[x].date.replace('.0', '.');
			//obj[x].date = obj[x].date.replace('.0', '.');
			
			if (dType === 'investors' && langs === 'ja'){	//#3964
				obj[x].date = obj[x].date.replace('.0', '.');
				obj[x].date = obj[x].date.replace('.0', '.');
				obj[x].date = obj[x].date.replace('.', '年');
				obj[x].date = obj[x].date.replace('.', '月');
				obj[x].date += '日';
			}
			
		}
		if (tData.Link) {
			obj[x].urls = tData.Link;
			if (!tData.Target || tData.Target === "0") {
				if ((obj[x].urls.search('konicaminolta.com') !== -1) || (obj[x].urls.charAt(0) === '/')) {
					obj[x].trg = "_self";
				} else {
					obj[x].trg = "_blank";
				}

			} else if (tData.Target === "2") {
				obj[x].trg = "_blank";
			} else {
				obj[x].trg = "_self";
			}
			
			if(obj[x].urls.search(/\/xx-xx\//) !==-1){	//#3964[#13]
				var countryDir = locArr[3];	//#4188[#11]
				if(!countryDir || countryDir === "selector") {
					countryDir = "us-en";
				}	
				obj[x].urls = obj[x].urls.replace('\/xx-xx\/','\/' + countryDir + '\/');
			} 
			
		}

		if (dType === 'selector') { //2017/06/22 for Country selector & .com top
			//obj[x].region = tData.Region;
			obj[x].title = tData['Country-name'];
			if (tData.Language) {
				obj[x].title += ' / ' + tData.Language;
			}
			if (tData['ISO-code']) {
				obj[x].className = 'flag-' + tData['ISO-code'];
			} else {
				obj[x].className = 'other-countries';
			}

			var pp7 = tData['Country-name'];
			if (!tData['ISO-code']) {
				pp7 = 'Other Countries(' + tData.Region + ')';
				pp7 = pp7.replace('-', ' ');
			} else {
				pp7 = pp7.replace(/\'/g, '');
				pp7 = pp7.replace(/^\s+|\s+$/g, '');
				pp7 = pp7.replace('-', '_');
			}
			var pp10 = pp7;
			pp10 = pp10.replace(/ /g, "_");
			
			var pp10_type = 'list_selector';	//selectorページ
			if(conObj.localFolder==='/'){
				pp10_type = 'top_selector';		//.comトップ
			}
			obj[x].appmeasurement = "s.un=\'kmhdkonicaminoltajp10zzglselector,kmhdkonicaminoltajp0000worldwide\';s.linkTrackVars=\'prop10,prop7,products,events\';s.linkTrackEvents=\'scRemove\';s.prop10=\'http:\/\/www.konicaminolta.com\/" + pp10_type + "\/" + pp10 + "/\';s.prop7='" + pp7 + "\';s.products=\';\/" + pp10_type + "/\';s.events=\'scRemove\';s.tl(this,\'o\')";	//AA 計測タグ

		} else {

			if (tData.Title) {
				obj[x].title = tData.Title;
			}
			if (tData.Headlines) {
				obj[x].headlines = tData.Headlines;
			}
			if (tData['File-name-1']) {
				obj[x].filename1 = conObj.localFolder + 'json/' + tData['File-name-1'];
			}
			if (tData['File-name-2']) {
				obj[x].filename2 = conObj.localFolder + 'json/' + tData['File-name-2'];

			}
			if (tData['File-name']) {
				obj[x].filename = conObj.localFolder + 'json/' + tData['File-name'];
			}
			if (tData.Alt) {
				obj[x].alt = tData.Alt;
			}
			if (tData.Icon) {
				if (tData.Icon === "1") {
					obj[x].title = "[Global] " + obj[x].title;
				}
			}

			if (dType === 'keyvisual') {
				if (!obj[x].urls || !obj[x].filename1 || !obj[x].filename2) {
					return false;
				} else {	//2018-03-09 #3859 
					if(conObj.dJson !== ""){
						if (tData['File-name-1']) {
							obj[x].filename1 = conObj.dJson + tData['File-name-1'];
						}
						if (tData['File-name-2']) {
							obj[x].filename2 = conObj.dJson + tData['File-name-2'];
						}
					}
				}

			} else if (dType === 'headlines') {
				if (!obj[x].urls || !obj[x].filename) {
					return false;
				}
			} else if ((dType === 'news') || (dType === 'importantinfo')) {
				if (!obj[x].date || !obj[x].urls || !obj[x].title) {
					return false;
				}
			} else if (dType === 'investors'){	//2018-01-22 IR対応
				if(tData.iconType){	//2018-01-22 IR対応
					obj[x].iconType = tData.iconType;
					obj[x].iconTitle = tData.iconTitle;
				} else {
					return false;	
				}
			
			}
		}

		if (tData['Display-alert']) { // 2017/06/03 not-managed for China
			obj[x].displayAlert = "";
			if (tData['Display-alert'] === "1") {
				obj[x].displayAlert = "not-managed";
			}
		}


		if (dType === 'selector') { //2017/06/22 for Country selector & .com top
			var reg = tData.Region.replace('-', '');
			if (!sObj[reg]) {
				sObj[reg] = [];
			}
			sObj[reg].push(obj[x]);
		} else {
			sObj.push(obj[x]);
		}
	}


};

var KeyvisualController = function ($http, $attrs, $scope) {
	contObj.keyvisual.mainConttoller($http, $attrs, $scope);
};

function HeadlineController($http, $attrs, $scope) {
	contObj.headlines.mainConttoller($http, $attrs, $scope);
}

function ImportantController($http, $attrs, $scope) {
	contObj.importantinfo.mainConttoller($http, $attrs, $scope);
}

function NewsController($http, $attrs, $scope) {
	contObj.news.mainConttoller($http, $attrs, $scope);
}

function InvestorsController($http, $attrs, $scope) {
	contObj.investors.mainConttoller($http, $attrs, $scope);
}

function SelectorController($http, $attrs, $scope) {
	contObj.selector.mainConttoller($http, $attrs, $scope);
}

function fnControll() {}
fnControll.prototype.fnController = function () {
	var tmID = [];
	var selObj = [];
	var modalVideoInit = false;
	var revent = 'resize load';
  	if (navigator.userAgent.search(/iPhone|iPod|iPad/i) !== -1) {
    	revent = 'orientationchange load';
  	}

	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var intID = setInterval(function () {
				var atts = attrs.type;
				var poplng = 0;

				if (contFin[atts]) {
					clearInterval(intID);
					element.ready(function () {
						selObj = $(element);

						if (atts === 'investors') {	//2018-01-22 IR対応
							var $ngInvestors = $('.ngInvestors');
							var $ngInvestors_ngLoading = $ngInvestors.find(".ngLoading");
						
							$ngInvestors_ngLoading.fadeOut(function(){
								$ngInvestors_ngLoading.remove();
								$('.ngInvestors').removeClass("ngReady");
								$('.ngInvestors .date-list:not(.ngActive)').each(function(i){	//ここで明細を表示
									tmID[i] = setTimeout(function(obj,i){
										$(obj).addClass('ngActive');
										clearTimeout(tmID[i]);
									},50+(i*50),this,i);
								});
							});
						
						} else if (atts === 'selector') {	//2017/06/22 for Country selector & .com top
							ngStarter(selObj, atts);
							
							$('.region-list li a').each(function(){
								var oid = $(this).attr('href');
								var rid = oid;
								rid = rid.replace('#','');
								rid = rid.replace('-','');
								var facts = scope["facts" + rid];
								$(oid).find('.country-selector li a').each(function(i){
									$(this).attr('onClick',facts[i].appmeasurement);
								});
							});

						} else if ((atts === 'news') || (atts === 'importantinfo')) {
							newsCnt++;
							if (newsCnt >= 2) {
								ngStarter(selObj, atts);
							}

						} else if (atts === 'keyvisual') {
							var $brand_area = $(".brand-area");

							if (typeof (modalVideoRun) !== "undefined") {	//2017/04/10 modal Decision for Japan
								$brand_area.find('.ngReady').each(function () {
									var tobj = $(this).find('a');
									var att = $(this).find('a').attr('href');
									var attarr = [];
									if ((att.search(/youtu.be/) !== -1) || (att.search(/youtube.com/) !== -1)) { //yutube
										tobj.addClass('modal-youtube');
										attarr = att.split('/');
										tobj.attr('data-video-id',attarr[attarr.length - 1]).attr('href','javascript:void(0)').attr('target','');
										poplng++;
									}
								});

							}

							$brand_area.find(".ngReady").removeClass("ngReady");

							$(window).on(revent, function() {
								if(window.matchMedia('(max-width:719px)').matches){
									if(!$brand_area.hasClass('smp')){
										$brand_area.removeClass('prc').addClass('smp');
										if($('.slick-slide').length > 1){
											$brand_area.addClass('smpRun');
										}

									}
								} else {
									$brand_area.removeClass('smp').removeClass('smpRun').addClass('prc');
								}
							});

							$brand_area.on('init', function(){	// 2017/06/03 not-managed for China
								if (typeof (notManagedOK) !== "undefined") {
									notManagedOK = true;
								}

							});
							$brand_area.slick({
								slidesToShow: 1,
								slidesToScroll: 1,
								autoplaySpeed: 7000,
								speed: 333,
								cssEase: 'linear',
								infinite: true,
								autoplay: true,
								dots: true,
								arrows: true,
								pauseOnHover: true
							}).on(
								{
								'setPosition': function (e, slick) {

									if ((poplng > 0) && (!modalVideoInit)) { //2017/04/10 modal Decision for Japan
										modalVideoRun();

										$('.modal-youtube').on('click', function () {
											$(window).on('touchmove.noScroll', function(e) {
												e.preventDefault();
        									});

											$brand_area.slick('slickPause');
											var $cbtn = $('.modal-video,.modal-video-close-btn');
											$cbtn.on('click', function () {
												$(window).off('.noScroll');
												$brand_area.slick('slickPlay');
												$cbtn.off('click', function () {
													$brand_area.slick('slickPlay');
												});

											});

										});

										modalVideoInit = true;

									}

								},
								"afterChange": function (e, slick) { 	//slide interval 2017/04/10
									if (typeof (slickPlayTimes) !== "undefined") {
										if (slickPlayTimes.length !== 0) {
											$brand_area.slick("setOption", "autoplaySpeed", slickPlayTimes[slick.currentSlide]);
										}
									}
								}
							});

							$(document.body).on('click', '.slick-pause', function () {
								var $pauseBtn = $(this);
								if ($pauseBtn.hasClass('paused')) {
									$brand_area.slick('slickPlay');
									$brand_area.slick('setOption', 'autoplay', true, true);
									$pauseBtn.removeClass('paused');
								} else {
									$brand_area.slick('slickPause');
									$brand_area.slick('setOption', 'autoplay', false, false);
									$pauseBtn.addClass('paused');
								}
							});
						} else {
							ngStarter(selObj, atts);
						}

					});
				}
			}, 100);
		}
	};

	function ngStarter(obj, atts) {
		var tObj = obj;
		if (obj.parent().hasClass('ngReady')) {
			tObj = obj.parent();
		}

		$(tObj).find('.ngLoading').fadeOut(function () {
			tObj.find('.ngLoading').remove();

			setTimeout(function () {
				if ((atts === 'news') || (atts === 'importantinfo')) {
					if ((contLng['news'] === 0) && (contLng['importantinfo'] === 0)) {
						$('section.news').remove();
					} else {
						$('.news .row h2').addClass('active');
						$('.news-list').addClass('active');
						if (contLng['news'] === 0) {
							$('news-component').prev().remove();
							$('news-component').remove();
						} else if (contLng['importantinfo'] === 0) {
							$('importantinfo-component').prev().remove();
							$('importantinfo-component').remove();
						}
					}
				}
				tObj.addClass('ngStart');

				tObj.on('webkitTransitionEnd transitionend', function () {
					tObj.removeClass('ngReady');
					tObj.removeClass('ngStart');
				});
				/*
				setTimeout(function () {
					tObj.removeClass('ngReady');
					tObj.removeClass('ngStart');
				}, 700);
				*/
			}, 250);
		});

	}
};


// dom ready
document.addEventListener('DOMContentLoaded', readyHandler, false);

function readyHandler() {
	$(':not(.brand-area) .ngReady').append('<p class="ngLoading">' + loadText + '</p>');
}

var excelHnd = angular.module('excelcmsApp', ['ngSanitize']);
contObj.news = new mainCont();
contObj.investors = new mainCont();
contObj.importantinfo = new mainCont();
contObj.headlines = new mainCont();
contObj.keyvisual = new mainCont();
contObj.selector = new mainCont();

contObj.newsFn = new fnControll();
contObj.investorsFn = new fnControll();
contObj.importantinfoFn = new fnControll();
contObj.headlinesFn = new fnControll();
contObj.keyvisualFn = new fnControll();
contObj.selectorFn = new fnControll();

excelHnd.controller("keyvisualController", KeyvisualController);
excelHnd.controller("headlineController", HeadlineController);
excelHnd.controller("newsController", NewsController);
excelHnd.controller("investorsController", InvestorsController);
excelHnd.controller("importantController", ImportantController);
excelHnd.controller("selectorController", SelectorController);

excelHnd.directive('onFinishRenderKeyvisual', contObj.keyvisualFn.fnController);
excelHnd.directive('onFinishRenderHeadline', contObj.headlinesFn.fnController);
excelHnd.directive('onFinishRenderNews', contObj.newsFn.fnController);
excelHnd.directive('onFinishRenderInvestors', contObj.investorsFn.fnController);
excelHnd.directive('onFinishRenderImportant', contObj.importantinfoFn.fnController);
excelHnd.directive('onFinishRenderSelector', contObj.selectorFn.fnController);

})();
