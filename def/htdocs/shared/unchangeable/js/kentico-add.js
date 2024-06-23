/******************************************************************
	js for kentico js
	(Don't use jQuery)
	
	2019-02-xx:	Initial construction
	2019-09-04: #7696【Kentico】サイト内検索不具合対応（Enterキー無効）
	2019-09-05: #7703【Kentico】サイト内検索引数追加
*******************************************************************/

(function () {
	"use strict";

	/*
		Main processing
	*/
	function mainProc() {
		dataActionSearch();

	}

	/*
		Search processing	
	*/
	function dataActionSearch() {
		var exTags = [];
		var buttons = [];
		var $label_input = {};

		exTags = document.querySelectorAll('.search2-searchx');

		var i = 0;

		if (exTags.length) {

			while (i < exTags.length) {
				if (exTags[i].getAttribute('data-action')) {
					buttons[i] = [];
					buttons[i] = exTags[i].querySelectorAll('button');
					if (buttons[i].length) {
						var k = 0;
						while (k < buttons[i].length) {
							if (buttons[i][k].getAttribute('name') === 'search') {
								buttons[i][k].addEventListener("click", serchRun, false);
							}
							k++;
						}
					}

				}

				$label_input = exTags[i].querySelector('label input');
				if ($label_input) {
					$label_input.addEventListener("keydown", function(e){
						var keyCode = e.which || e.keyCode;
						if (keyCode && keyCode === 13) {
							e.stopPropagation();
							e.preventDefault();
						} 
					}, false);
				}
				i++;
			}

		}

		function serchRun() {
			var thisButton = this;
			var rtDiv = thisButton.parentNode.parentNode;
			var dataAction = rtDiv.getAttribute('data-action');
			var thisButtonName = thisButton.getAttribute('name');
			var thisButtonValue = thisButton.value;
			var rDiv_div = rtDiv.querySelector('div');
			
			var rDiv_div_input = rDiv_div.querySelectorAll('input');
			
			var rtDiv_label = rDiv_div.querySelector('label');
			var rtDiv_label_input = rtDiv_label.querySelector('input');
			var rtDiv_label_inputName = rtDiv_label_input.getAttribute('name');
			var rtDiv_label_input_val = rtDiv_label_input.value;

			var rDiv_div_input1 = rDiv_div_input[1].getAttribute('name');
			var rDiv_div_input1_val = rDiv_div_input[1].value;
			
			var searchQuerry = "";

			if(rDiv_div_input.length === 3){
				var rDiv_div_input2 = rDiv_div_input[2].getAttribute('name');
				var rDiv_div_input2_val = rDiv_div_input[2].value;
				searchQuerry = dataAction + '?' + rtDiv_label_inputName + '=' + rtDiv_label_input_val + '&' + rDiv_div_input1 + '=' + rDiv_div_input1_val + '&' + rDiv_div_input2 + '=' + rDiv_div_input2_val + '&' + thisButtonName + '=' + thisButtonValue;
			} else {
				searchQuerry = dataAction + '?' + rtDiv_label_inputName + '=' + rtDiv_label_input_val + '&' + rDiv_div_input1 + '=' + rDiv_div_input1_val + '&' + thisButtonName + '=' + thisButtonValue;
			}		
			
			location.href = encodeURI(searchQuerry);
		}
	}


	document.addEventListener('DOMContentLoaded', function () {
		mainProc();
	}, false);

})();
