/*
    【標準テンプレート】絞り込み機能
    (jQuery unuse)

	2021-06-10：#12355
	2021-01-13：#12355
	2019-03-xx：First Entry
*/

(function () {
  /*
  	variables
  */
  var filteringObj = [];
  var filtering_function = [];
  var locationHref = decodeURI(location.href);
  locationHref = locationHref.replace(/\#.+$/, "");
  var param0 = [];
  var param1 = [];
  var param2 = [];
  var paramLabel = [];
  var no_results_msg = '';

  param0 = locationHref.split('?');
  if (param0[1]) {
    param1 = param0[1].split('&');
    var cp = 0;
    while (cp < param1.length) {
      param2[cp] = [];
      param2[cp] = param1[cp].split('+');
      paramLabel[cp] = param2[cp][0].replace(/\=.+$/, "");
      param2[cp][0] = param2[cp][0].replace(paramLabel[cp] + '=', '');
      cp++;
    }
  }

  /*
  	Function group
  */
  function mainProc() {
    var i = 0;
    while (i < filtering_function.length) {
      filteringObj.push(new filtering());
      filteringObj[i].filmainProc(i);
      i++;
    }

  }

  function filtering() {}
  filtering.prototype.filmainProc = function (i) {
    var filObj = filtering_function[i];
    var conNavi = filObj.querySelectorAll('.filterring--condition');
    var results = filObj.querySelectorAll('.filterring--result');
    var moreWrapper = filObj.querySelector('.filterring--result--more');
    var moreBtn = moreWrapper.querySelector('.filterring--result--more a');
    var condition = filObj.getAttribute('data-condition');
    var viewsNumber = parseInt(filObj.getAttribute('data-viewsnumber'));
    var viewCnt = 0;

    if (results.length) {
      if (viewsNumber === 0) {
        viewsNumber = results.length;
      }

      var r = 0;
      while (r < results.length) {
        results[r].classList.add('target-result');
        r++;
      }
      moreController(0);

      moreBtn.addEventListener('click', function (e) {
        e.preventDefault(viewCnt);
        moreController(viewCnt);
      });

    }

    if (conNavi.length) {

      var j = 0;
      while (j < conNavi.length) {
        var conNaviA = conNavi[j].querySelectorAll('a');
        if (conNaviA.length) {
          var k = 0;
          while (k < conNaviA.length) {
            conNaviA[k].addEventListener('click', function (e) {
              e.preventDefault();
              viewCnt = 0;
			
			 var nrElem = filObj.getElementsByClassName('no-results-msg');
              if(nrElem.length){
				 nrElem.item(0).parentNode.removeChild(nrElem.item(0));  
              }

              if (this.parentNode.parentNode.classList.contains('filterring--condition--reset')) {
                resetProc(conNaviA, results);
                moreController(0);
				this.parentNode.classList.remove('selecting');
              } else {

                if (!this.parentNode.classList.contains('current')) {
                  if (condition === "and") { //andは兄弟クリア																
                    var n = 0;
                    var pnodes = this.parentNode.parentNode.querySelectorAll('a');
                    while (n < pnodes.length) {
                      pnodes[n].parentNode.classList.remove('current');
                      pnodes[n].classList.remove('choice');
                      n++;
                    }
                    this.parentNode.classList.add('current');
                    this.classList.add('choice');
                  } else if (condition === "or") {
                    this.parentNode.classList.add('current');
                    this.classList.add('choice');
                  }

                } else {
                  this.parentNode.classList.remove('current');
                  this.classList.remove('choice');
                }

                //console.log(filObj.querySelectorAll('.choice').length);
                if (!filObj.querySelectorAll('.choice').length) {
                  resetProc(conNaviA, results);
                  moreController(0);
                } else {

                if (condition === "and") {
                    filteringRun(this, filObj, 'and');
                    moreController(0);
                  } else if (condition === "or") {
                    filteringRun(this, filObj, 'or');
                    moreController(0);
                  }

                }

                if(!filObj.querySelectorAll('.filterring--result.active').length) {
					filObj.insertAdjacentHTML('beforeend', '<p class="no-results-msg">' + no_results_msg + '</p>');
                }

				var resetObj = filObj.querySelectorAll('.filterring--condition--reset li');
				if(resetObj.length) {
					if(filObj.querySelectorAll('li.current').length) {
						resetObj[0].classList.add('selecting');
					} else {
						resetObj[0].classList.remove('selecting');
					}
                }

              }			

            }, false);
            k++;
          }
        }
        j++;
      }		

      if (param1.length > 0) {
        initFilter();
      }

    }

    function initFilter() {
      if (filObj.getAttribute('data-condition') === param2[0][0]) {
        var fcList = filObj.querySelectorAll('.filterring--condition--list');
        if (fcList.length > 0) {
          var fcList_li = [];
          var cp2 = 0;

          var r = 0;
          while (r < results.length) {
            results[r].classList.remove('target-result');
            results[r].classList.remove('active');
            r++;
          }

          while (cp2 < fcList.length) {
            fcList_li = fcList[cp2].querySelectorAll('li');
            var cp3 = 0;
            while (cp3 < fcList_li.length) {
              var cp4 = 1;
              var cList_li_a = fcList_li[cp3].querySelector('a');
              var cList_li_a_value = cList_li_a.getAttribute('data-value');
              while (cp4 < param2.length) {
                if (param2[cp4].indexOf(cList_li_a_value) !== -1) {
                  fcList_li[cp3].classList.add('current');
                  cList_li_a.classList.add('choice');
                  filteringRun(cList_li_a, filObj, param2[0][0]);
                  moreController(0);
                }
                cp4++;
              }
              cp3++;
            }
            cp2++;
          }

        }
		  
		if(filObj.querySelectorAll('.filterring--condition .current').length){
			filObj.querySelector('.filterring--condition--reset>li').classList.add('selecting');
		}
		if(!filObj.querySelectorAll('.filterring--result.active').length) {
			filObj.insertAdjacentHTML('beforeend', '<p class="no-results-msg">' + no_results_msg + '</p>');
		}

        /*
        setTimeout(function () { //filterring-functionの先頭に移動
          var actives = filObj.querySelectorAll('.current');
          var lHeight = {};
          var scy = 0;
          if (actives.length) {
            scy = actives[0].parentNode.parentNode.getBoundingClientRect().top + window.pageYOffset;
            lHeight = actives[0].parentNode.parentNode.getBoundingClientRect().height;
          } else {
            scy = document.querySelector('.filterring-function').getBoundingClientRect().top + window.pageYOffset;
            lHeight = document.querySelector('.filterring-function').getBoundingClientRect().height;
          }
          window.scrollTo(0, scy - lHeight);
        }, 250);
        */

      }

    }


    function moreController(sta) {
      var r = sta;
      var rst = filObj.querySelectorAll('.target-result');

      if (r < rst.length) {

        while (r < rst.length) {
          rst[r].classList.add('active');
          r++;
          if (r >= rst.length) {
            moreWrapper.classList.remove('active');
          } else if (r % viewsNumber === 0) {
            moreWrapper.classList.add('active');
            break;
          }
        }
        viewCnt = r;
      } else {
        moreWrapper.classList.remove('active');
      }
		
    }

    function resetProc(conA, result) {
      var m = 0;
      var r = 0;
      while (m < conA.length) {
        conA[m].parentNode.classList.remove('current');
        conA[m].classList.remove('choice');
        m++;
      }
      while (r < result.length) {
        result[r].classList.add('target-result');
        result[r].classList.remove('active');
        r++;
      }
    }

    function filteringRun(aObj, rtObj, ctype) {
      var selCondition = rtObj.querySelectorAll('.filterring--condition');
      var selResults = rtObj.querySelectorAll('.filterring--result');
      var tAttr = [];
      var cArr = [];
      var c = 0;
      var s = 0;

      // 条件生成
      while (c < selCondition.length) {
        var ca = 0;
        var selCondition_a = selCondition[c].querySelectorAll('a');
        while (ca < selCondition_a.length) {
          if (selCondition_a[ca].classList.contains('choice')) {
            var ccn = selCondition_a[ca].getAttribute('data-value').replace(/^\s+|\s+$/g, ""); //前後の空白削除
            cArr.push(ccn);
          }
          ca++;
        }
        c++;
      }
      cArr.sort();

      //条件で絞り込み
      //selResults.style.display = "none";	//いったん全て非表示			
      while (s < selResults.length) {
        tAttr = selResults[s].getAttribute('data-value').split(',');
        var k = 0;
        while (k < tAttr.length) { //前後の空白削除
          tAttr[k] = tAttr[k].replace(/^\s+|\s+$/g, "");
          k++;
        }

        tAttr.sort();

        //条件マッチング
        k = 0;
        var mac = 0;
        while (k < cArr.length) {
          var j = 0;
          while (j < tAttr.length) {

            if (cArr[k] === tAttr[j]) {
              mac++;
            }
            j++;
          }
          k++;
        }

        selResults[s].classList.remove('target-result');
        selResults[s].classList.remove('active');
        if (ctype === 'and') {
          if (cArr.length === mac) { //AND -> 条件がすべて一致は表示

            selResults[s].classList.add('target-result');
            viewCnt++;
          }
        } else if (ctype === 'or') {
          if (mac > 0) { //OR -> 条件がいずれか一致は表示
            selResults[s].classList.add('target-result');
            viewCnt++;
          }
        }
        s++;
      }

    }
  }

  /* DOM構築で実行 */
  document.addEventListener("DOMContentLoaded", function () {
    filtering_function = document.querySelectorAll('.filterring-function');
    if (document.querySelector('html').getAttribute('lang') === 'ja') {
		no_results_msg = '検索条件に合致する情報は見つかりませんでした。';
    } else {
		no_results_msg = 'No information was found that matches your search criteria.';
    }
    mainProc();
  });

})();