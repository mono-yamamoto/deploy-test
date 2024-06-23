/*****************************************************
	Go to uncontrolled site alert
	2020/09/30	#11004
******************************************************/

(function () {
"use strict";

var uaResult = navigator.userAgent;
var loc = decodeURI(location.href);	//現在地URL
var cookieInit = false;
var $curScript = document.$curScript || (function () {
	var nodeList = document.getElementsByTagName('script');
	return nodeList.item(nodeList.length - 1);
}());
var alertURL = "";
var alertDate = 1000000;
if($curScript.getAttribute('data-alertURL')){
	alertURL = $curScript.getAttribute('data-alertURL');
}
if($curScript.getAttribute('data-alertDate')){
	alertDate = $curScript.getAttribute('data-alertDate');
}

if(alertURL && uaResult.indexOf('Googlebot') ===-1 && uaResult.indexOf('dbot') ===-1) {
//if(alertURL){
	// localstrage 判定 -> 更新
	localstrageAnalyze(parseFloat(alertDate) * 1000000);

	// 期限切れの時 alert画面に推移
	if(cookieInit){
		alertExecProc();
	}

}


/*===================
	alert-exec Class
====================*/
function localstrageAnalyze(adate) {
	var ckMax = adate; //有効期限（秒まで判定）
	var cookieItem = localStorage.getItem(alertURL);
	var cDate = new Date();
	var cyy = toStringcv2(cDate.getFullYear());
	var cmm = toStringcv2(cDate.getMonth() + 1);
	var cdd = toStringcv2(cDate.getDate());
	var chh = toStringcv2(cDate.getHours());
	var cmn = toStringcv2(cDate.getMinutes());
	var csc = toStringcv2(cDate.getSeconds());
	var cdn = Number(cyy + cmm + cdd + chh + cmn + csc);
	var csb = 0;

	if (cookieItem === null) {
		csb = ckMax;
	} else {
		csb = Math.abs(cdn - cookieItem);
	}

	if (csb >= ckMax) { //有効期限xx日以上の時
		cookieInit = true;
	}

	function toStringcv2(nn) {
		if (nn <= 9) {
			nn = '0' + nn;
		} else {
			nn = nn.toString();
		}
		return nn;
	}

}

function alertExecProc(){
	var exportUrl = alertURL + '?exUrl_1=' + encodeURIComponent(loc) + '&exUrl_2=' + encodeURIComponent(document.referrer) + '&exUrl_3=' + alertURL;
	location.href = exportUrl;
}


})();
