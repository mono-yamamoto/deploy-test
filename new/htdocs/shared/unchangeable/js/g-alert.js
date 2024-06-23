/*****************************************************
	Go to uncontrolled site alert	

******************************************************/
(function() {
	"use strict";

	var url = "";
	var orgUrl = "";
	var alertURL = "";
	var loc = decodeURI(location.href);
	
	loc = loc.toString();

	if(loc.indexOf('?exUrl_1=') !== -1) {
		var tmp1 = loc.split('?');
		var tmp2 = tmp1[1].split('&');
		url = tmp2[0].replace('exUrl_1=','');
		orgUrl = tmp2[1].replace('exUrl_2=','');
		alertURL = tmp2[2].replace('exUrl_3=','');
		if(!orgUrl) {
			orgUrl = 'https://www.konicaminolta.com/';
		}
		
	}

	function readyexUrl(){
		genericAlert.alertURL = alertURL;
		genericAlert.locationURL = decodeURIComponent(url);
		document.querySelectorAll('.exLinkbtn')[0].setAttribute('href','javascript:genericAlert.alertLcation();');
		document.querySelectorAll('.exRetbtn')[0].setAttribute('href',decodeURIComponent(orgUrl));		
	}


	if(url) {
		document.addEventListener('DOMContentLoaded', readyexUrl, false);
	}
	
})();

var genericAlert = [];
genericAlert.alertURL = "";
genericAlert.locationURL = "";
genericAlert.alertLcation = function(){
	var cDate = new Date();
	var cyy = toStringcv2(cDate.getFullYear());
	var cmm = toStringcv2(cDate.getMonth() + 1);
	var cdd = toStringcv2(cDate.getDate());
	var chh = toStringcv2(cDate.getHours());
	var cmn = toStringcv2(cDate.getMinutes());
	var csc = toStringcv2(cDate.getSeconds());
	var cdn = Number(cyy + cmm + cdd + chh + cmn + csc);	
	
	localStorage.setItem(genericAlert.alertURL, cdn);
	location.href = genericAlert.locationURL;
	
	function toStringcv2(nn) {
		if (nn <= 9) {
			nn = '0' + nn;
		} else {
			nn = nn.toString();
		}
		return nn;
	}

}
