/* ==================================
    newsroom js
		Built with AngularJS 1.5
	
	2018.03.07 newsroom 非掲載は除外
	2018-03-22 #3964[#13] 日本語、各国語サイトのIRニュース 修正
	2018-12-26 #6161 【ニュースルーム】2019年対応
	2019-02-22 #6548 【Kentico移行PJ】Newsoomのjsonの改修
===================================== */

(function () {

'use strict';

var yy = 2021; // The latest year

var yyMax = yy;
var yyMin = yy-1;
var pageMax = 0;
var allMax = 0;
var saveQuery = "";
var pressPass = "https://www.konicaminolta.jp/pressroom/kmhd/";
var releaseDomain = "https://www.konicaminolta.com";
var defaultCnt = [0,0,0,0,0,0,0];
var contObj = [];
var excRrs = false;
var excPic = false;
var dataObj = [];
var ajaxCnt = 0;

//creation
var localUrl = decodeURI(location.href).replace(/\?.+$/, "");
localUrl = decodeURI(location.href).replace(/\#.+$/, "");

var locArr = localUrl.split('/');
var localFolder = "/";
for (var r in locArr){
	if ((r> 2) && (r < (locArr.length - 1)) && (locArr[r] !== "")) {
		localFolder += (locArr[r] + "/");
		if(locArr[r] === 'newsroom'){
			break;
		}
	}
}

var catDefs = {1:['category/service.html','service','製品・サービス'],
2:['category/management.html','management','経営・決算･財務'],
3:['category/csr.html','csr','CSR(社会・環境活動）'],
4:['category/research.html','research','研究開発'],
5:['category/event.html','event','宣伝･イベント'],
6:['category/other.html','other','その他']
};
var pdfDef = 'PDF';
var imgDef = '画像';

if(localUrl.search('\/jp-ja\/') === -1){
	catDefs = {1:['category/service.html','service','Products &amp; Services'],
2:['category/management.html','management','Management'],
3:['category/csr.html','csr','Sustainability'],
4:['category/research.html','research','R&amp;D'],
5:['category/event.html','event','Event'],
6:['category/other.html','other','Others']
};

	pdfDef = 'PDF';
	imgDef = 'Image';
}

//main controler
function mainCont() {
	this.yyc = 0;
	this.outputList = new Array();
	this.dYear = 0;
	this.dType = "";
	this.limit = [];
	this.sq = "";
}
mainCont.prototype.mainConttoller = function ($http, $attrs, $scope) {
	var insObj = [];
	//var listLabel = "";
	var fname = "";
	var tData;
	//var x = 0;
	var obj = [];
	var tObj = this;

	insObj = this;
	if ($attrs) {
		contObj.dType = $attrs.type;
		
	} else {
		return false; // non type -> break
	}

	pageMax = 24;
	if ($attrs.pagemax !== undefined) {
		pageMax = parseInt($attrs.pagemax);
	}
	allMax = -1;
	if ($attrs.max !== undefined) {
		allMax = $attrs.max;
	}
	if ($attrs.year !== undefined){
		yy = $attrs.year;
		insObj.yyc = yy;
	}
	if ($attrs.minyear !== undefined){
		yyMin = $attrs.minyear;
	}
	if (insObj.yyc===0) {
		insObj.yyc = yy;
	}
	
	yyMax = yy;

	//listLabel = 'listDatas_' + yy;
	tObj.listDatas = [];

	fname = localFolder + 'json/newsroom-' + (insObj.yyc) + '.json';

	if (insObj.yyc > yyMin) {
		insObj.yyc--;
		insObj.mainConttoller($http, $attrs, $scope);
	}

	return $http.post(fname)
		.success(function (data, status, headers, config) {
			var yar = fname.split('/');
			var yys = yar[yar.length-1].replace('.json','');
			yys = yys.replace('newsroom-','');
			dataObj[yys] = [];
			dataObj[yys] = data;
			ajaxCnt++;
			if(ajaxCnt > (yyMax-yyMin)){

				tdataSet();
				$scope.facts = contObj.outputList;
				return false;
			}

		})
		.error(function (data, status, headers, config) {
			ajaxCnt++;
			if(ajaxCnt >= (yyMax-yyMin)){

				tdataSet();
				$scope.facts = contObj.outputList;
				
				return false;
			}

		});

	
	function tdataSet(){
		var yc = yyMax;

		while(yc>=yyMin){
		
		
		if(dataObj[yc]){
		
			obj = dataObj[yc];
			
			var x = 0;
			if (tObj.listDatas) {
				x = tObj.listDatas.length;
			}
			
			var i= 0;
			while(obj[i]){
			
				tData = obj[i];

				//2018.03.07 newsroom 非掲載は除外
				if(tData['No-newsroom'] !== undefined && tData['No-newsroom'] !== ''){
				
				//newsroom topの時、最新ニュースリリース and pickupは除外
				} else if(contObj.dType === "top"){
				
					if(tData['Category-1'] === "0" && tData['Category-2'] === "0" && tData['Category-3'] === "0"){
						/*
						if(!excPic && tData.Pickup !== "" && tData.Pickup !== undefined){
							excPic = true;
						}
						outputAdd(x,obj[i],tObj.listDatas, contObj.outputList);
						*/
						if(!excPic && tData.Pickup !== "" && tData.Pickup !== undefined){
							excPic = true;
						} else {
							outputAdd(x,obj[i],tObj.listDatas, contObj.outputList);
						}
					} else {
						/*
						if(!excRrs){
							excRrs = true;
						}
						outputAdd(x,obj[i],tObj.listDatas, contObj.outputList);
						*/
						if(!excRrs){
							excRrs = true;
						} else {
							outputAdd(x,obj[i],tObj.listDatas, contObj.outputList);
						}
					}
				} else {
					outputAdd(x,obj[i],tObj.listDatas, contObj.outputList);
				}
				
				i++;
			}	//while(obj[i])
		
		}	//if(dataObj[yc])
		
		yc--;
		}	//while(yc>=yyMin)

	}

	function outputAdd(x,tObj , obj, sObj) {
		var tempDate = [];
		var fileIDTemp = [];
		var fileYY = "";
		var fileID = ""; 
		var ctCnt = 0;
		var stCnt = 1;
		var thumbDef = false;
		var modalSym = '';
	
		obj[x] = [];
		
		if (!tObj.Date || !tObj.Url || !tObj.Title) {
			return false;
		} else {
		
		if (tObj.Date) {
			obj[x].date = tObj.Date.replace('/', '.');
			obj[x].date = obj[x].date.replace('/', '.');
			

		}
		if (tObj.Title) {
			obj[x].title = tObj.Title;
		}
		
		if(tObj.Thumbnail.charAt(0) === '/' || tObj.Thumbnail.search('http') !==-1) {
			obj[x].thumbnail = tObj.Thumbnail;
		} else {
			if(tObj.Thumbnail !=='') {
				tempDate = obj[x].date.split('.');
				obj[x].thumbnail = localFolder + tempDate[0] + '/img/' + tObj.Thumbnail;
			} else {
				thumbDef = true;
			}
		}
			
		if (tObj.Url) {
			obj[x].urls = tObj.Url;

			if(obj[x].urls.search(/\/xx-xx\//) !==-1){	//#3964[#13]
				obj[x].urls = obj[x].urls.replace('\/xx-xx\/','\/us-en\/');
				obj[x].trg = "_blank";
			} else if(obj[x].urls.search('.pdf') !== -1 || obj[x].urls.search('.xls') !== -1 || obj[x].urls.search('.doc') !== -1 || obj[x].urls.search('.ppt') !== -1){
				obj[x].trg = "_blank";
			} else if((obj[x].urls.search('konicaminolta.com') !== -1 || obj[x].urls.search('konicaminolta.jp') !== -1)) {
				obj[x].trg = "_self";
			} else if(obj[x].urls.indexOf('http') === 0){
				obj[x].trg = "_blank";
			} else {
				obj[x].trg = "_self";
			}
		}

		obj[x].category = [];
		while(tObj['Category-' + stCnt]){
			var stta = 	parseInt(tObj['Category-' + stCnt]);
			if (stta !== 0) {
				obj[x].category[ctCnt] = [];
				obj[x].category[ctCnt].stat = stta;
				obj[x].category[ctCnt].active = 'release';
				if(stta === 5){
					obj[x].category[ctCnt].active = 'event';
				}
				obj[x].category[ctCnt].url = localFolder + catDefs[stta][0];
				obj[x].category[ctCnt].cls = catDefs[stta][1];
				obj[x].category[ctCnt].title = catDefs[stta][2];

				ctCnt++;
			}
			
			if(thumbDef){
				//obj[x].thumbnail = localFolder + 'img/default_thumbnail_' + stta + '_' + defaultCnt[stta] + '.jpg';
				obj[x].thumbnail = releaseDomain + localFolder + 'img/default_thumbnail_' + stta + '_' + defaultCnt[stta] + '.jpg';
				
				if(defaultCnt[stta] < 3){
					defaultCnt[stta]++;
				} else {
					defaultCnt[stta] = 0;
				}
				
				thumbDef = false;
			}
			
			stCnt++;
		}
		
		obj[x].pdf = [];
		obj[x].pdf.active = 'no-active';
		if (tObj.PDF !=="") {
			obj[x].pdf.active = 'active';
			obj[x].pdf.url = tObj.PDF;
			obj[x].pdf.title = pdfDef;
		}
		
		obj[x].image = [];
		obj[x].image.active = 'no-active';

		fileIDTemp = tObj.Url.split('/');
		fileYY = fileIDTemp[fileIDTemp.length-2];
		fileID = fileIDTemp[fileIDTemp.length-1];
		fileID = fileID.replace('.html','');
		
		if(locArr[locArr.length-2] === 'newsroom'){
			modalSym = '#modalTop-';
		} else {
			modalSym = '#modal-';
		}

		if (tObj.Image ==="1") {	//Image Modal
			obj[x].image.active = 'active';
			obj[x].image.title = imgDef;	
			obj[x].image.urls = '#';	
			obj[x].image.modal = 'modal';	
			obj[x].image.trg = '_self';	
		} else if (tObj.Image ==="2") {	//Press Room
			obj[x].image.active = 'active';
			obj[x].image.title = imgDef;	
			obj[x].image.urls = pressPass + fileYY + "/pop" + fileID + '.html';	
			obj[x].image.modal = 'newwin';	
			obj[x].image.trg = '_blank';	
		}
		
		if ((tObj.Image ==="1")||(tObj.Image ==="2")) {	//Image Modal
			if(tObj.Url.search('\/jp-ja\/') === -1){
				fileID = fileID + '_en';
			}
			obj[x].image.ids = modalSym + fileYY + fileID;
		}

		sObj.push(obj[x]);
		
		}
	}
};

function NewsRoomController($http, $attrs, $scope) {
	contObj.mainConttoller($http, $attrs, $scope);
	$scope.updateLimit = function() {
    	contObj.limit[saveQuery] += pageMax;
		$('body,html').stop().animate({scrollTop: $(window).scrollTop() + 8}, 333);
	};
}

function fnControll() {}
fnControll.prototype.fnController = function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs, timeout) {
			/*
			if (scope.$last === true) {
				element.ready(function () {
				});
			}
			*/
		}
	};
};

function filterControll() {}
filterControll.prototype.categoryFilter = function () {

    return function (list,searchQuery) {
		/*
		var element = document.getElementById("angularElem");
		var $scope = angular.element(element).scope();
		*/
		var setCnt = 0;
		var filteredList = [];
		var sq = "";
		var cat = 'category';
		var pg = 0;
		var am = 0;
		//var moreMax = 0;
		var moreFixed = "";
		var tmID = [];
		var $seemoreViewNext = $('.seemore-view-next');
		var $seemoreViewLink = $('.seemore-view-link');

		if(searchQuery === undefined){
			if(contObj.dType === 'top'){
				sq = 'release';
			} else {
				sq = contObj.dType;
			}
		} else if(searchQuery !== 'seemore'){
			sq = searchQuery;
			if(contObj.dType === 'top'){
				sq = searchQuery;
			} else {
				sq = contObj.dType;
			}
		} else if(searchQuery === 'seemore'){
			sq = saveQuery;
		}
		
		if(contObj.limit[sq] === undefined){
			contObj.limit[sq] = pageMax;
		}
		saveQuery = sq;

		if(list){

			for(var r in list){
				var listObj = list[r][cat];
				var lcnt = 0;
				var mFlg = false;

				if(listObj.length){
					while(listObj[lcnt]){
						
						if(sq === 'release' || sq === 'event') {
							if(listObj[lcnt].active === sq){
								mFlg = true;
								break;
							}
						} else {
							if(listObj[lcnt].cls === sq) {
								mFlg = true;
								break;
							}
						}
					
						lcnt++;
					}

				} else {
					if(sq === 'topics') {
						if(listObj[0] === undefined) {
							mFlg = true;
						}
					}
				}

				if(mFlg){
					pageDataControll(r);
				}
				
				if(r>=list.length-1 || setCnt >= allMax){
					moreFixed = 'fin';
					break;
				} else if(setCnt >= contObj.limit[sq]){
					moreFixed = 'break';
					break;
				} else {
					moreFixed = '';
				}
			}

			if(moreFixed !== ''){
			
				$('.newsroom-release-list:not(.ngActive)').each(function(i){	//ここで明細を表示
					tmID[i] = setTimeout(function(obj,i){
						$(obj).addClass('ngActive');
						clearTimeout(tmID[i]);
					},50+(i*50),this,i);
				});
				
				if(moreFixed === 'fin') {

					$seemoreViewNext.removeClass('active');
				
					if(contObj.dType === 'top'){
						$seemoreViewLink.addClass('active');
						if(sq === 'event'){
							$seemoreViewLink.find('a').attr('href',localFolder + "category/" + sq + ".html");
							$seemoreViewLink.find('a').attr('ng-href',localFolder + "category/" + sq + ".html");
						} else {
							$seemoreViewLink.find('a').attr('href',localFolder + sq + "/");
							$seemoreViewLink.find('a').attr('ng-href',localFolder + sq + "/");
						}
					} else {
						$seemoreViewLink.removeClass('active');
					}
				
				} else {
					$seemoreViewNext.addClass('active');
					$seemoreViewLink.removeClass('active');
					
					$seemoreViewNext.click(function(e){
						e.stopPropagation();
					});
					
				}

				if($('.ngReady').length){
					$('.ngReady').removeClass('ngReady');
					$('.ngLoading').remove();
				}
				return filteredList;
			} 
		}

		function pageDataControll(r){
			filteredList.push(list[r]);
			setCnt++;
			pg = Math.floor(setCnt/pageMax);
			am = setCnt % pageMax;
		}

	};
};



// dom ready
document.addEventListener('DOMContentLoaded', readyHandler, false);

function readyHandler() {
	$('.ngReady').append('<div class="ngLoading"></div>');
}

//  angular init
var excelHnd = angular.module('excelcmsApp', ['ngSanitize']);
contObj = new mainCont();
contObj.newsFn = new fnControll();
contObj.newsFilter = new filterControll();
excelHnd.controller("newsRoomController", NewsRoomController);
excelHnd.directive('onFinishRenderNews', contObj.newsFn.fnController);
excelHnd.filter("categoryFilter", contObj.newsFilter.categoryFilter);

})();
