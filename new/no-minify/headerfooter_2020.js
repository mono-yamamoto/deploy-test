/*==================================================

  headerfooter.js (For 2020 renewal)
 
  2021/08/10 KMJ_CODING-355 【サイト内検索】流入元判別タグ（JSによる動的取得）
  2021 #13106 【個別対応】リサイズ時の挙動

==================================================*/
(function ($) {
  var $cookieMessage = {};
  var $cookieMessageObject = {};

  var $window = {};
  var $body = {};
  var $header = {};
  var $km_Header = {};
  var $lHeader = {};
  var $lHeaderNavigation = {};

  var $contentWrapper = {};

  var rsInt = 0;

  var revent = 'resize'; //#4918 

  var uas = navigator.userAgent;
/*
  var toucDevice = false;
  if (uas.search(/iPhone|iPod|iPad|Android|Windows.*Phone/i) !== -1) {
    toucDevice = true;
  }
*/
  if (uas.search(/iPhone|iPod|iPad/i) !== -1) {
    revent = 'orientationchange'; //#4918 
  }

  // Dom ready で実行
  document.addEventListener('DOMContentLoaded', function () {

    $cookieMessage = $('.cookie-message');
    $cookieMessageObject = $('.cookie-message-object');
    $window = $(window);
    $body = $('body');
    $header = $("header");
    $km_Header = $('#km_Header');
    $lHeader = $('.l-header');
    $lHeaderNavigation = $('.l-header__navigation');

    $contentWrapper = $('.content-wrapper');

	localNavigation();
    dropdownMenu();
    contextDisable();
    accordions();
	marsflagPatch();

	inputReferrer('.cct-search form');
	inputReferrer('.l-header__block__search form');
	inputReferrer('.header__function__search__form div');
	inputReferrer('.newsroom-pc-form div');

  }, false); //dom ready end


  /*
    pcドロップダウンメニュー処理
  */
  function dropdownMenu() {
    //SP→PC時にグローバルナビの状態をリセット
    headerChange();
    headerScrollChange();

    $window.on(revent, function () {
      //clearTimeout(rsInt);
      //rsInt = setTimeout(function () {
        headerChange();
      //}, 200);
    });
    $window.on('scroll', function () {
      clearTimeout(rsInt);
      rsInt = setTimeout(function () {
        headerScrollChange();
      }, 200);
    });

    function headerChange() {
      if (window.matchMedia('(max-width:719px)').matches) {
        $body.removeClass('pc').addClass('sp');
      } else {
        $body.removeClass('sp').addClass('pc');
      }

	/*
      if ($body.hasClass('pc')) {
        $header.removeClass("is-absolute");
        if ($lHeaderNavigation.length) {
          $lHeaderNavigation.css('height', $lHeaderNavigation.find('ul').height() + 'px');
        }
      } else {
        $contentWrapper.css('margin-top', '0px');
      }
	 */

      if ($lHeader.length === 0 && !$km_Header.hasClass('km_Header-static')) {
        $km_Header.css('position', 'fixed');
        $contentWrapper.css('padding-top', $km_Header.height() + 'px');
      } else if ($km_Header.hasClass('km_Header-static')) {
        $contentWrapper.css('padding-top', '0px');
      }

    }

    function headerScrollChange() {
      if ($lHeader.length && window.matchMedia('(min-width: 720px)').matches) {
        var lhTop = parseInt($lHeader.css('top'));
        if (!isNaN(lhTop)) {
          if (lhTop < 0) {
            $lHeader.css('marginTop', '-1px');
          } else {
            $lHeader.css('marginTop', '0px');
          }
        } else {
          $lHeader.css('marginTop', '0px');
        }
      }

    }

  }
	
	/*
    local-navigation
	*/
    function localNavigation() {
		var localNavigation_p_a = $(".local-navigation p a");
		if(localNavigation_p_a.length){
			localNavigation_p_a.on("click", function () {
				var $this = $(this);
        		$this.parent().next().slideToggle();
        		$this.parents(".local-navigation").toggleClass("is-open");
      		});
		}
    }

  /*
  #5197　コンテキストメニュー禁止
  */
  function contextDisable() {
    var $imgContextDisable = $('img.img-context-disable'); //静的画像

    var $contextDisableSlick = $('.img-context-disable-keyvisual'); //キービジュアル系
    var $contextDisableSlickObj = [];
    var slicInt = [];
    var slicIntCnt = [];

    var $contextDisableSlider = $('.img-context-disable-slider'); //製品系
    var $contextDisableSliderObj = [];
    var slidInt = [];
    var slidIntCnt = [];
    var props = {
      "-webkit-touch-callout": "none",
      "user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select": "none"
    }

    //静的画像
    if ($imgContextDisable.length) {
      $imgContextDisable.css(props);
      $imgContextDisable.on('contextmenu', function (e) {
        return false
      });
      $imgContextDisable.on('dragstart', function (e) {
        return false
      });
    }

    //キービジュアル系
    if ($contextDisableSlick.length) {
      $.each($contextDisableSlick, function (i) {
        $contextDisableSlickObj[i] = $(this);
        $contextDisableSlickObj[i].find('img').css(props);
        slicIntCnt[i] = 0;
        slicInt[i] = setInterval(function (i) {

          if ($contextDisableSlickObj[i].hasClass('slick-initialized')) {
            clearInterval(slicInt[i]);
            $contextDisableSlickObj[i].find('img').css(props);
            $contextDisableSlickObj[i].find('img').on('contextmenu', function (e) {
              return false;
            });
            $contextDisableSlickObj[i].find('img').on('dragstart', function (e) {
              return false
            });

          } else {
            slicIntCnt[i]++;
            if (slicIntCnt[i] >= 80) { //timeout 10sec
              clearInterval(slicInt[i]);
            }
          }

        }, 250, i);

      })

    }

    //製品系
    if ($contextDisableSlider.length) {
      $.each($contextDisableSlider, function (i) {
        $contextDisableSliderObj[i] = $(this);
        $contextDisableSliderObj[i].find('.swiper-container img, .swiper-pagination-bullet').css(props);
        slidIntCnt[i] = 0;
        slidInt[i] = setInterval(function (i) {

          if ($contextDisableSliderObj[i].hasClass('active')) {
            clearInterval(slidInt[i]);
            $contextDisableSliderObj[i].find('.swiper-container img, .swiper-pagination-bullet').css(props);
            $contextDisableSliderObj[i].find('.swiper-container img, .swiper-pagination-bullet').on('contextmenu', function (e) {
              return false;
            });
            $contextDisableSliderObj[i].find('.swiper-container img, .swiper-pagination-bullet').on('dragstart', function (e) {
              return false;
            });
          } else {
            slidIntCnt[i]++;
            if (slidIntCnt[i] >= 80) { //timeout 10sec
              clearInterval(slidInt[i]);
            }
          }
        }, 250, i);

      })

    }

  }

  /*
        アコーディオンパーツ
    */
  function accordions() {
    var ytapi = 'enablejsapi=1';
    var $accordionFunction = document.querySelectorAll('.accordion-function');
    var $iframeAll = document.querySelectorAll('.accordion-function iframe');
    var $accordionObj = {};
    if ($accordionFunction.length) {
      var i = 0;
      while (i < $accordionFunction.length) {
        var tObj = $accordionFunction[i];
        $accordionObj.i = {};
        $accordionObj.i = new accordionProc(tObj);
        i++;
      }
    }

    if ($iframeAll.length) {
      var f = 0;
      while (f < $iframeAll.length) {
        //var yObj = $iframeAll[f];
        var ysrc = $iframeAll[f].src;
        if (ysrc.indexOf('www.youtube.com') !== -1 && ysrc.indexOf(ytapi) === -1) {
          if (ysrc.indexOf('?') === -1) {
            ysrc = ysrc + '?' + ytapi;
          } else {
            ysrc = ysrc + '&' + ytapi;
          }
          $iframeAll[f].src = ysrc;
        }
        f++;
      }
    }

    function accordionProc($obj) {
      var $rootObj = $obj;
      var $accordionControlButton = $rootObj.querySelector('.accordion--control__button');
      var $accordionItems = $rootObj.querySelectorAll('.accordion--item');

      if ($accordionControlButton && $accordionItems.length > 1) {
        $accordionControlButton.addEventListener('click', function (e) {
          var allMode = false;
          this.querySelector('button').setAttribute('style', 'outline :none');
          if ($accordionControlButton.classList.contains("allOpen")) {
            $accordionControlButton.classList.remove("allOpen");
          } else {
            allMode = true;
          }

          var i = 0;
          var j = 0;
          while (i < $accordionItems.length) {
            setTimeout(function (obj, j, allMode) {
              itemOpen(obj.querySelector('.accordion--item__title'), allMode);
              j++;
            }, 10 + 300 * j, $accordionItems[i], j, allMode);
            i++;
          }

        }, false);
        $accordionControlButton.addEventListener('keypress', function (e) {
          if (e.keyCode == '13') {
            this.querySelector('button').removeAttribute('style', 'outline :none');
          }
        }, false);
        $accordionControlButton.addEventListener('focusin', function () {
          this.querySelector('button').removeAttribute('style', 'outline :none');
        }, false);
        $accordionControlButton.addEventListener('focusout', function () {
          this.querySelector('button').removeAttribute('style', 'outline :none');
        }, false);

      } else {
        $accordionControlButton.classList.add('hidden-lg');
        $accordionControlButton.classList.add('hidden-sm');
      }

      if ($accordionItems.length) {
        var i = 0;
        while (i < $accordionItems.length) {
          var $accordionBtn = $accordionItems[i].querySelector('.accordion--item__title');
          var $accordionItems_conent = $accordionItems[i].querySelector('.accordion--item__conent');
          $accordionItems_conent.style.display = 'none';

          if ($accordionBtn) {
            $accordionBtn.tabIndex = 0;
            $accordionBtn.addEventListener('click', function () {
              itemOpen(this, null);
              this.setAttribute('style', 'outline :none');
            }, false);
            $accordionBtn.addEventListener('keypress', function (e) {
              if (e.keyCode == '13') {
                itemOpen(this, null);
              }
            }, false);
            $accordionBtn.addEventListener('focusin', function () {
              this.removeAttribute('style', 'outline :none');
            }, false);
            $accordionBtn.addEventListener('focusout', function () {
              this.removeAttribute('style', 'outline :none');
            }, false);
          }
          i++;
        }
      }

      function itemOpen(tObj, allMode) {
        var pObj = tObj.parentElement.parentElement;
        var youtubes = pObj.querySelectorAll('.accordion--video iframe');
        var videos = pObj.querySelectorAll('.accordion--video video');
        var $accordionItems_conent = pObj.querySelector('.accordion--item__conent');

        if (pObj.classList.contains("open")) {
          if (!allMode || allMode === null) {
            pObj.classList.remove("open");
            setTimeout(function (obj) {
              obj.style.display = 'none';
            }, 300, $accordionItems_conent);
          }
        } else {
          if (allMode || allMode === null) {
            $accordionItems_conent.removeAttribute('style');
            setTimeout(function (obj) {
              obj.classList.add("open");
            }, 50, pObj);
          }
        }

        setTimeout(function ($rootObj, youtubes, videos, pObj) {
          if (!pObj.classList.contains("open")) {
            videoPause(youtubes, videos);
          }
          allOpenCheck($rootObj);
        }, 300, $rootObj, youtubes, videos, pObj);

      }

      function allOpenCheck(rObj) {
        var rtLength = rObj.querySelectorAll('.accordion--item').length;
        var opLength = rObj.querySelectorAll('.accordion--item.open').length;
        var clContain = $accordionControlButton.classList.contains("allOpen");
        if (opLength >= rtLength && !clContain) {
          $accordionControlButton.classList.add("allOpen");
        } else if (opLength === 0 && clContain) {
          $accordionControlButton.classList.remove("allOpen");
        }
      }

      function videoPause(yts, vs) {
        if (yts.length) {
          var y = 0;
          while (y < yts.length) {

            yts[y].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            y++;
          }
        }
        if (vs.length) {
          var b = 0;
          while (b < vs.length) {
            vs[b].pause();
            b++;
          }
        }
      }

    }
  }

	function marsflagPatch(){
		var $mf_marsfinder_pageTop = $('#mf_marsfinder #page-top');
		if($mf_marsfinder_pageTop.length){
			$mf_marsfinder_pageTop.remove();	
		}
	}


	/*
		KMJ_CODING-355 【サイト内検索】流入元判別タグ（JSによる動的取得）
	*/
	function inputReferrer(sel){
		var $searchBlock = $(sel);
		var refURL = "";
		var refInput = "";
		var $refs = [];
		if($searchBlock.length){
			if ($('link[rel="canonical"]').length !== 0){
				refURL = $('link[rel="canonical"]').attr('href');
			} else if ($('meta[property="og:url"]').length !== 0){
				refURL = $('meta[property="og:url"]').attr('content');	
			} else {
				refURL = location.href;	
			}		
			refInput = '<input name="ref" value="' + refURL + '" type="hidden">';
			$refs = $(sel + ' input[name="ref"]');
			if($refs.length===0) {
				$searchBlock.each(function() {
					var $this = $(this);
					$this.append(refInput);
				});
			} else {
				$refs.each(function() {
					$(this).attr('value',refURL);
				});
			}
		}
	}

})(jQuery);
