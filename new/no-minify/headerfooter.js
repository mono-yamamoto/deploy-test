/* --------------------------------------------------------------------------------------
	2021/08/10 KMJ_CODING-355 【サイト内検索】流入元判別タグ（JSによる動的取得）

	#4128 【サイト内検索】SP時画像リンク切れ修正(2018-03-30)
	#4918 【ランプロ】Facebookからのリンク不具合対応(2018-07-26)
	#5202 旧サイトへのcookieアラート表示(2018-10-09)
	#5197 【パーツ追加】画像上で右クリックをさせない
	#7391 【パーツ追加】アコーディオンパーツ作成 (2018-7-05)
 	#7535 【IR】【CGW】表示速度改善施策（追加施策）
 	#9465 【調査依頼】【HC】IEでのアコーディオンの挙動
 	#10369 フェーズ4（グロナビの遅延読み込み全体実装）
-------------------------------------------------------------------------------------- */
(function ($) {
  var $cookieMessage = {};
  var $cookieMessageObject = {};

  var $window = {};
  var $body = {};
  var $header = {};
  var $header_header__nav = {};
  var $header_header__nav_ul = {};
  var $header_header__nav_ul_li = {};

  var $header__function__search = {};
  var $header__function__search__form = {};
  var $header__function__language = {};
  var $header__function__language_languageWrapper = {};
  var $header__function__menu_span_img = {};
  var _header__function__menu_span_img_orgPass = '';
  var $closeSecondWrap_span = {};
  var $contentWrapper = {};
  var $pageTop = {};

  var clickEvent = 'click';
  var overEvent = 'mouseover focusin';
  var outEvent = 'mouseout focusout';
  var revent = 'resize'; //#4918 

  var uas = navigator.userAgent;
  var toucDevice = false;
  if (uas.search(/iPhone|iPod|iPad|Android|Windows.*Phone/i) !== -1) {
    toucDevice = true;
  }

  if ("ontouchstart" in window) {
    clickEvent = 'touchend';
    overEvent = 'touchend focusin';
    outEvent = 'focusout';
  } else if ((uas.search(/Edge/) !== -1) || (uas.search(/Tablet/) !== -1)) { //win系tablet or Edge
    clickEvent = 'click touchend';
    overEvent = 'mouseover focusin';
    outEvent = null;
  }
  if (uas.search(/iPhone|iPod|iPad/i) !== -1) {
    revent = 'orientationchange'; //#4918 
  }

  // Dom ready で実行
  $(function () {

    $cookieMessage = $('.cookie-message');
    $cookieMessageObject = $('.cookie-message-object');
    $window = $(window);
    $body = $('body');
    $header = $("header");
    $header_header__nav = $(".header .header__nav");
    $header_header__nav_ul = $(".header .header__nav > ul");
    $header_header__nav_ul_li = $(".header .header__nav > ul > li");

    $header__function__search = $(".header__function__search");
    $header__function__search__form = $(".header__function__search__form");
    $header__function__language = $(".header__function__language");
    $header__function__language_languageWrapper = $(".header__function__language .language-wrapper");
    $header__function__menu_span_img = $('.header__function__menu button img');

    $closeSecondWrap_span = $(".header__nav > ul > li .second-wrap .close-second-wrap span");

    $contentWrapper = $('.content-wrapper');
    $pageTop = $(".page-top");

    //#4128
    if (decodeURI(location.href).search('search.x') !== -1) {

      var int__header__function__menu_span_img = setInterval(function () {
        if ($('.header__function__menu button img').length) {
          $header__function__menu_span_img = $('.header__function__menu button img');
          var _src = $header__function__menu_span_img.attr('src');
          if (_src.indexOf('//') === 0 || _src.indexOf('http') === 0) {
            var srcArr = _src.split('/');
            _header__function__menu_span_img_orgPass = _src.replace(srcArr[srcArr.length - 1], '');
            clearInterval(int__header__function__menu_span_img);
          }
        }
      }, 100);

    } else {
      if ($header__function__menu_span_img) {
        var srcX = $header__function__menu_span_img.attr('src');
        if (srcX) {
          var srcArr = srcX.split('/');
          _header__function__menu_span_img_orgPass = srcX.replace(srcArr[srcArr.length - 1], '');
        }
      }
    }

    function set__header__function__menu_span_img(imgpass) {
      if (_header__function__menu_span_img_orgPass !== "") {
        $header__function__menu_span_img.attr('src', _header__function__menu_span_img_orgPass + imgpass);
        //console.log($header__function__menu_span_img.attr('src'));
      }
    }

    //#5197　コンテキストメニュー禁止 
    (function () {
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

    })();

    //cookie-messageの期限管理
    (function () {
      var ckMax = 7000000; //有効期限7日（秒まで判定）
      var cookieItem = localStorage.getItem('cookieMessage');
      var cDate = new Date();
      var cyy = toStringcv2(cDate.getFullYear());
      var cmm = toStringcv2(cDate.getMonth() + 1);
      var cdd = toStringcv2(cDate.getDate());
      var chh = toStringcv2(cDate.getHours());
      var cmn = toStringcv2(cDate.getMinutes());
      var csc = toStringcv2(cDate.getSeconds());
      var cdn = Number(cyy + cmm + cdd + chh + cmn + csc);
      var csb = 0;

      if ($cookieMessage.length) {
        if (cookieItem === null) {
          csb = ckMax;
        } else {
          csb = Math.abs(cdn - cookieItem);
        }

        if ('.cookie-message-object')

          if (csb >= ckMax) { //有効期限7日以上の時表示
            $cookieMessage.addClass('is-open');

            //#5202
            if ($cookieMessageObject.length) {
              $cookieMessageObject.find('span').eq(0).css('top', $cookieMessage.height() + 'px');
              $window.on('resize', function () {
                $cookieMessageObject.find('span').eq(0).css('top', $cookieMessage.height() + 'px');
              });
            }

            $cookieMessage.find('button').on('click', function () {
              $cookieMessage.removeClass('is-open');
              //$contentWrapper.css("border-top-width", "");
              localStorage.setItem('cookieMessage', cdn);

              //#5202
              if ($cookieMessageObject.length) {
                $cookieMessageObject.find('span').removeAttr('style');
                $window.off('resize', function () {
                  $cookieMessageObject.find('span').eq(0).css('top', $cookieMessage.height() + 'px');
                });
                $window.on('resize', function () {
                  $cookieMessageObject.find('span').eq(0).removeAttr('style');
                });
              }
            });
          }
      }

      function toStringcv2(nn) {
        if (nn <= 9) {
          nn = '0' + nn;
        } else {
          nn = nn.toString();
        }
        return nn;
      }

    })();

    // padding内側の高さを取得し、変数に格納
    (function () {
      $window.on('load resize', function () {
        var h = $cookieMessage.height();
        var pch = h + 60;
        //alert(pch);
        if ($cookieMessage.hasClass('is-open')) {
          //$contentWrapper.css("border-top-width", h);
          if ($('.header__function__menu').css("display") === "none") {
            $(".cookie-message.is-open + .header .header__nav > ul > li .second-wrap").css("top", pch);
            $(".cookie-message.is-open + .header .header__function .header__function__search .header__function__search__form").css("top", pch);
            $(".cookie-message.is-open + .header .header__function .header__function__language .language-wrapper").css("top", pch);

          }
        }

        // コンソールログに表示
        //console.log(h);
        //alert(h);
      });
    })();

    //sp ハンバーガーメニュー, sp&pc検索窓、, sp&pc言語セレクター
    (function () {
      var current_scrollY = 0;

      //SP　ハンバーガーメニュー開閉
      $(".header__function__menu").on("click", function () {

        //サーチウィンドウとランゲージセレクターをクローズ
        $header__function__search.removeClass("is-open");
        $header__function__language.removeClass("is-open");
        $header__function__search__form.attr('style', 'display:none');
        $header__function__language_languageWrapper.attr('style', 'display:none');

        $header.toggleClass("is-absolute");
        $header_header__nav.toggleClass("is-open");
        $contentWrapper.css({
          'position': '',
          'width': '',
          'top': ''
        });

        if ($header_header__nav.is(":hidden")) {
          set__header__function__menu_span_img('btn_sp_menu.png');
          //$header__function__menu_span_img.attr('src', '/shared/unchangeable/img/btn_sp_menu.png');

          if (current_scrollY) {
            //$( '.content-wrapper' ).attr( { style: '' } );
            $('html, body').prop({
              scrollTop: current_scrollY
            });
            delete current_scrollY;
          }

        } else {
          //if(!current_scrollY) {

          current_scrollY = $window.scrollTop();
          $contentWrapper.css({
            position: 'fixed',
            width: '100%',
            top: -1 * current_scrollY
          });
          //}
          set__header__function__menu_span_img('btn_sp_menu_close.png');
          //$header__function__menu_span_img.attr('src', '/shared/unchangeable/img/btn_sp_menu_close.png');

        }
      });

      //ドロップダウンメニュー内のクローズボタン
      $(".header__nav__close").on("click", function () {
        $header_header__nav.removeClass("is-open");
        $header.removeClass("is-absolute");
        set__header__function__menu_span_img('btn_sp_menu.png');
        //$header__function__menu_span_img.attr('src', '/shared/unchangeable/img/btn_sp_menu.png');
        //$( '.content-wrapper' ).attr( { style: '' } );
        $contentWrapper.css({
          'position': '',
          'width': '',
          'top': ''
        });
        $('html, body').prop({
          scrollTop: current_scrollY
        });
        delete current_scrollY;
      });

      //sp&pcヘッダーのサーチ展開
      $(".header__function__search button").on("click", function () {
        //ナビとランゲージセレクターをクローズ
        $header_header__nav.removeClass("is-open");
        $header__function__language.removeClass("is-open");

        $header.removeClass("is-absolute");
        set__header__function__menu_span_img('btn_sp_menu.png');
        //$header__function__menu_span_img.attr('src', '/shared/unchangeable/img/btn_sp_menu.png');

        $header__function__search.toggleClass("is-open");
        $header__function__search__form.attr({
          style: ''
        });
        $header__function__language_languageWrapper.attr({
          style: ''
        });

        if ($header__function__search.hasClass('is-open')) { //検索窓 open-close
          $contentWrapper.css({
            'position': '',
            'width': '',
            'top': ''
          });
          if (current_scrollY) {
            $('html, body').prop({
              scrollTop: current_scrollY
            });
          }
          current_scrollY = $window.scrollTop();

          $header__function__search__form.attr('style', 'display:block');
        } else {
          $header__function__search__form.attr('style', 'display:none');
        }

      });

      //sp langage select open close
      $(".header__function__language button").on("click", function () {
        //ナビとサーチをクローズ
        $header_header__nav.removeClass("is-open");
        $header__function__search.removeClass("is-open");

        $header.removeClass("is-absolute");
        set__header__function__menu_span_img('btn_sp_menu.png');
        //$header__function__menu_span_img.attr('src', '/shared/unchangeable/img/btn_sp_menu.png');

        $header__function__language.toggleClass("is-open");
        $header__function__search__form.attr({
          style: ''
        });
        $header__function__language_languageWrapper.attr({
          style: ''
        });

        if ($header__function__language.hasClass('is-open')) { //language selector open-close
          $contentWrapper.css({
            'position': '',
            'width': '',
            'top': ''
          });
          if (current_scrollY) {
            $('html, body').prop({
              scrollTop: current_scrollY
            });
          }
          current_scrollY = $window.scrollTop();

          $header__function__language_languageWrapper.attr('style', 'display:block');
        } else {
          $header__function__language_languageWrapper.attr('style', 'display:none');
        }

      });

    })();

    //pcドロップダウンメニュー処理
    (function () {

      var $open = null;
      var $this = {};

      var megaTm = 0;

      if ("ontouchstart" in window) {
        $closeSecondWrap_span.css('user-select', 'none');
      } else if ((uas.search(/Edge/) !== -1) || (uas.search(/Tablet/) !== -1)) { //win系tablet or Edge
        $closeSecondWrap_span.css('user-select', 'none');
      }

      //グルナビ #のみはクリックスルー 2017-05-22
      $header_header__nav_ul_li.each(function () {
        var $this_a = $(this).find('a').eq(0);
        $this_a.href = $this_a.attr('href');
        if (($this_a.href === "#") || ($this_a.href === "")) {
          $this_a.click(function (e) {
            $this_a.parent().removeClass('is-open');
            e.preventDefault();
          });
        }
      });

      //SP→PC時にグローバルナビの状態をリセット
      headerChange();

      $window.on(revent, function () {
        headerChange();
      });

      function headerChange() {

        if ($body.hasClass('pc')) {
          $('.header *').removeClass("is-open");
          $contentWrapper.css({
            'position': '',
            'width': '',
            'top': ''
          });
          $header.removeClass("is-absolute");
        } else {
          $body.removeClass('sp').addClass('pc');
        }

        if (toucDevice) {
          droppdownSet('sp');
        } else if (window.matchMedia('(min-width:720px)').matches && window.matchMedia('(max-width:1239px)').matches) {
          //console.log($header_header__nav.width() + "/" + $header_header__nav_ul.width());
          if (($header_header__nav.width() !== 0) && ($header_header__nav_ul.width() !== 0)) {
            if (($header_header__nav.width() - $header_header__nav_ul.width()) > 2) {
              droppdownSet('pc');
            } else {
              droppdownSet('sp');
            }
          } else {
            droppdownSet('sp');
          }
        } else if (window.matchMedia('(max-width:719px)').matches) {
          droppdownSet('sp');
        } else {
          droppdownSet('pc');
        }

      }

      function droppdownSet(mode) {
        if (mode === 'pc') {
          if (!$body.hasClass('pc')) {
            $body.removeClass('sp').addClass('pc');
          }
          pcDroppdown();
        } else if (mode === 'sp') {
          if (!$body.hasClass('sp')) {
            $body.removeClass('pc').addClass('sp');
            if ($header_header__nav.hasClass('is-open')) { //#4128
              set__header__function__menu_span_img('btn_sp_menu_close.png');
              //$header__function__menu_span_img.attr('src', '/shared/unchangeable/img/btn_sp_menu.png');
            } else {
              set__header__function__menu_span_img('btn_sp_menu.png');
            }
          }
          pcDroppdownCancell();
        }
      }

      //PCドロップダウン
      function pcDroppdown() {

        $header_header__nav_ul_li.find('.second-wrap').addClass("is-close").attr('style', 'display:none!important');

        $header_header__nav_ul_li.on(overEvent, function () {
          $this = $(this);
          if (megaTm) {
            clearTimeout(megaTm);
          }

          if ($this.find('.second-wrap').length) {
            if (!$this.hasClass('is-open')) {
              megaTm = setTimeout(function () {
                secondWrapClose(); //before close
                secondWrapOpen($this); // target open
              }, 400);
            }
          } else {
            secondWrapClose(); //now close
            return false;
          }
        });

        $header_header__nav_ul_li.on(outEvent, function () {
          $this = $(this);

          if ($this.find('.second-wrap').length) {
            if (megaTm) {
              clearTimeout(megaTm);
            }
            megaTm = setTimeout(function () {
              secondWrapClose(); //all close
            }, 500);
          }
        });

        //PCドロップダウンメニュークローズボタン
        $closeSecondWrap_span.on(clickEvent, function () {
          secondWrapClose(); //target close
        });
        $(".header__nav >ul >li").hover( //もう一度ホバーしたら元に戻す
          function () {
            $(this).children('.second-wrap').removeClass("is-close");
          });

        //PCドロップダウン open
        function secondWrapOpen(obj) {
          $open = obj;

          var $menu = [];
          var $second_wrap = $open.find('.second-wrap');
          var $third_wrap = $second_wrap.find('.third-wrap');
          var $third_wrap_active = {};

          $header__function__search.removeClass("is-open"); //search & language selector remove
          $header__function__language.removeClass("is-open");
          $(".header__function__search > form").hide();
          $(".header__function__language .language-wrapper").hide();

          $open.addClass('is-open');

          $second_wrap.removeClass("is-close").attr('style', 'display:block!important');

          if ($third_wrap.length) {
            $third_wrap.hide();
            $third_wrap_active = $third_wrap.eq(0);
            $third_wrap_active.show(); //third_wrap 一番上のメニューを表示する
			imgDatasrc($third_wrap_active);
			  
            $menu = $second_wrap.find('.gnavi-2nd-block'); //third_wrap open 処理
            $menu.menuAim({
              activate: activateSubmenu,
              deactivate: deactivateSubmenu
            });
          }

          function activateSubmenu(row) {
            var $row = $(row);
			$third_wrap_active = $row.find('.third-wrap');
            $third_wrap_active.show();
			imgDatasrc($third_wrap_active);
          }

          function deactivateSubmenu(row) {
            //var $row = $('row');
            $third_wrap.hide();
          }
			function imgDatasrc(_active_third_wrap){
				var _dataImg = _active_third_wrap.find('img[data-src]');
				if(_dataImg.length) {
					_dataImg.each(function(){
						var $this = $(this);
						var _src = $this.attr('data-src');
						$this.attr('src',_src);
						$this.removeAttr('data-src');
					})
				}
			}

        }
        //PCドロップダウン close
        function secondWrapClose() {
          if ($open !== null) {
            $open.removeClass('is-open');
            $open.find('.second-wrap').addClass("is-close").attr('style', 'display:none!important');
            $open.find('.third-wrap').hide();
            $open = null;
          }
        }

      }

      function pcDroppdownCancell() {
        if (megaTm) {
          clearTimeout(megaTm);
        }
        $header_header__nav_ul_li.off(overEvent);
        $header_header__nav_ul_li.off(outEvent);
      }

      //ホバーした最後のブロックを表示
      /*
	$(".gnavi-2nd-block > li").hover(function () {
		$(this).siblings().children('.third-wrap').hide();
		$(this).children('.third-wrap').show();
	});
	*/

      //全体をマウスアウトしたら、一番上のメニューを表示する状態に戻る
      /*
	$(".header .header__nav > ul > li:first-child").hover(function () {
		$(".third-wrap").hide();
		$(".product .gnavi-2nd-block > li:first-child .third-wrap").show();
	  }
	);
	*/

    })();

    //SPドロップダウンメニュー
    (function () {
      $(".header__nav >ul >li >a").on("click", function () {
        var $this = $(this);
        if ($this.css("display") === "block") { //sp
          $this.next().slideToggle();
          $this.toggleClass("is-open");
        }

      });
    })();

    //スクロールトップのフェイドインアウト
    (function () {
      $window.bind("scroll", function () {
        if ($(this).scrollTop() > 100) {
          $pageTop.fadeIn();
        } else {
          $pageTop.fadeOut();
        }
        //var pageTopHeight = $('.page-top').height() / 2;
        var scrollPos = $window.height() + $window.scrollTop();

        //var footPos = $('#footer').offset().top + pageTopHeight + 20;
        var footPos = $('#footer').offset().top;
        var fixedPos = scrollPos - footPos + 50;

        if (scrollPos >= footPos) {
          $pageTop.css({
            'position': 'fixed',
            'bottom': fixedPos
          });
        } else {
          $pageTop.css({
            'position': 'fixed',
            'bottom': '60px'
          });
        }
      });
    })();

    //SPビジネスリストの開閉
    (function () {
      $(".business-lists h3").on("click", function () {
        var $this = $(this);
        $this.next().slideToggle();
        $this.toggleClass("is-open");
      });
    })();

    //キー操作のテスト2
    (function () {
      //大カテゴリにフォーカスが当たった時にドロップダウンメニューオープン
      $(".header .header__nav > ul > li >a").focus(function () {
        $header_header__nav_ul_li.removeClass("is-open");
        $(this).parent().addClass("is-open");
      });
      //大カテゴリにフォーカスをクリック時はドロップダウンメニューを動作させない
      /*
	$(".header .header__nav > ul > li >a").click(function(e) {
       $(this).parent().removeClass("is-open");
    });
	*/
      //shift + tabでフォーカスを外れたとき
      $(".header__nav >ul >li >a").keydown(function (e) {
        if (e.which === 9) {
          if (e.shiftKey) {
            $(this).parent().removeClass("is-open");
          } else {
            //Focus next input
          }
        }
      });

      $(".gnavi-2nd-block > li > a").focus(function () {
        $('.third-wrap').hide();
        $(this).next().show();
      });

      //虫めがねマークにフォーカスが当たった時
      $(".header__function__search >a").focus(function () {
        $(".header__function__language >div").hide();
        $(this).next().show();
      });

      $(".header__function__search >a").keydown(function (e) {
        if (e.which === 9) {
          if (e.shiftKey) {
            $(this).next().hide();
          } else {
            //Focus next input
          }
        }
      });

      $(".header__function__language >a").focus(function () {
        $(".header__function__search >form").hide();
        $(this).next().show();

      });

      $(".header__function__global >a").focus(function () {
        $(".header__function__language >div").hide();
      });

    })();

    //local-menu-toggle
    (function () {
      $(".local-navigation p a").on("click", function () {
        $(this).parent().next().slideToggle();
        $(this).parents(".local-navigation").toggleClass("is-open");
      });
    })();

    //footer select country
    (function () {
      $('#region').bind('change', function () { // bind change event to select
        var url = $(this).val(); // get selected value
        if (url.match(/http/)) { // require a URL

          window.open(url, "_blank");
        } else if (url !== '') { // require a URL
          window.location = url; // redirect
        }
        return false;
      });
    })();


    //アコーディオンパーツ
    (function () {
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
          var yObj = $iframeAll[f];
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

    })();

    /*
        【標準テンプレート】オフスクリーン画像の遅延読込
        (jQuery unuse)
    	First Entry: 2019-07-xx
    */

    (function () {

      var setCnt = 0;
      var delayImages = document.querySelectorAll('.delayedImg');
      if (delayImages.length) {
        mainProc();
      }

      function mainProc() {
        imgSetter();
        window.addEventListener('scroll', imgSetter, false);
      }

      function imgSetter() {
        if (setCnt < delayImages.length) {
          var sta = window.pageYOffset;
          var eda = sta + window.innerHeight;
          var i = 0;
          while (i < delayImages.length) {
            var iObj = delayImages[i];
            var rect = iObj.getBoundingClientRect();
            var sy = rect.top + sta;
            var datasrc = iObj.getAttribute('data-src');
            var imgsrc = iObj.getAttribute('src');
            if (imgsrc === null && (sy >= (sta - 10)) && (sy <= (eda + 10))) {
              iObj.setAttribute('src', datasrc);
              //iObj.classList.add('delayedActive');
              setTimeout(function (obj) {
                obj.classList.add('delayedActive');
              }, 250, iObj);
              setCnt++;
            }
            i++;
          }

        } else {
          window.removeEventListener('scroll', imgSetter, false);
        }
      }

    })();


	/*
		KMJ_CODING-355 【サイト内検索】流入元判別タグ（JSによる動的取得）
	*/
	inputReferrer('.l-header__block__search form');
	inputReferrer('.header__function__search__form div');
	inputReferrer('.newsroom-pc-form div');

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

  }); //dom ready end

})($);


/* --------------------------------------------------------------------------------------
 * jquery.menu-aim.jsを取り込み
-------------------------------------------------------------------------------------- */
/**
 * menu-aim is a jQuery plugin for dropdown menus that can differentiate
 * between a user trying hover over a dropdown item vs trying to navigate into
 * a submenu's contents.
 *
 * menu-aim assumes that you have are using a menu with submenus that expand
 * to the menu's right. It will fire events when the user's mouse enters a new
 * dropdown item *and* when that item is being intentionally hovered over.
 *
 * __________________________
 * | Monkeys  >|   Gorilla  |
 * | Gorillas >|   Content  |
 * | Chimps   >|   Here     |
 * |___________|____________|
 *
 * In the above example, "Gorillas" is selected and its submenu content is
 * being shown on the right. Imagine that the user's cursor is hovering over
 * "Gorillas." When they move their mouse into the "Gorilla Content" area, they
 * may briefly hover over "Chimps." This shouldn't close the "Gorilla Content"
 * area.
 *
 * This problem is normally solved using timeouts and delays. menu-aim tries to
 * solve this by detecting the direction of the user's mouse movement. This can
 * make for quicker transitions when navigating up and down the menu. The
 * experience is hopefully similar to amazon.com/'s "Shop by Department"
 * dropdown.
 *
 * Use like so:
 *
 *      $("#menu").menuAim({
 *          activate: $.noop,  // fired on row activation
 *          deactivate: $.noop  // fired on row deactivation
 *      });
 *
 *  ...to receive events when a menu's row has been purposefully (de)activated.
 *
 * The following options can be passed to menuAim. All functions execute with
 * the relevant row's HTML element as the execution context ('this'):
 *
 *      .menuAim({
 *          // Function to call when a row is purposefully activated. Use this
 *          // to show a submenu's content for the activated row.
 *          activate: function() {},
 *
 *          // Function to call when a row is deactivated.
 *          deactivate: function() {},
 *
 *          // Function to call when mouse enters a menu row. Entering a row
 *          // does not mean the row has been activated, as the user may be
 *          // mousing over to a submenu.
 *          enter: function() {},
 *
 *          // Function to call when mouse exits a menu row.
 *          exit: function() {},
 *
 *          // Selector for identifying which elements in the menu are rows
 *          // that can trigger the above events. Defaults to "> li".
 *          rowSelector: "> li",
 *
 *          // You may have some menu rows that aren't submenus and therefore
 *          // shouldn't ever need to "activate." If so, filter submenu rows w/
 *          // this selector. Defaults to "*" (all elements).
 *          submenuSelector: "*",
 *
 *          // Direction the submenu opens relative to the main menu. Can be
 *          // left, right, above, or below. Defaults to "right".
 *          submenuDirection: "right"
 *      });
 *
 * https://github.com/kamens/jQuery-menu-aim
*/
(function ($) {

  $.fn.menuAim = function (opts) {
    // Initialize menu-aim for all elements in jQuery collection
    this.each(function () {
      init.call(this, opts);
    });

    return this;
  };

  function init(opts) {
    var $menu = $(this),
      activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = $.extend({
        rowSelector: "> li",
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75,  // bigger = more forgivey when entering submenu
        enter: $.noop,
        exit: $.noop,
        activate: $.noop,
        deactivate: $.noop,
        exitMenu: $.noop
      }, opts);

    var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
      DELAY = 300;  // ms delay when user appears to be entering submenu


    /**
     * Keep track of the last few locations of the mouse.
     */
    var mousemoveDocument = function (e) {
      mouseLocs.push({ x: e.pageX, y: e.pageY });

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function () {
      if (timeoutId) {
        // Cancel any previous activation delays
        clearTimeout(timeoutId);
      }

      options.enter(this);
      possiblyActivate(this);
    },
      mouseleaveRow = function () {
        options.exit(this);
      };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function () {
      activate(this);
    };

    /**
     * Activate a menu row.
     */
    var activate = function (row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function (row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function () {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function () {
      if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      var offset = $menu.offset(),
        upperLeft = {
          x: offset.left,
          y: offset.top - options.tolerance
        },
        upperRight = {
          x: offset.left + $menu.outerWidth(),
          y: upperLeft.y
        },
        lowerLeft = {
          x: offset.left,
          y: offset.top + $menu.outerHeight() + options.tolerance
        },
        lowerRight = {
          x: offset.left + $menu.outerWidth(),
          y: lowerLeft.y
        },
        loc = mouseLocs[mouseLocs.length - 1],
        prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
        prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc &&
        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      }

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope &&
        increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    /**
     * Hook up initial menu events
     */
    $menu
      .mouseleave(mouseleaveMenu)
      .find(options.rowSelector)
      .mouseenter(mouseenterRow)
      .mouseleave(mouseleaveRow)
      .click(clickRow);

    $(document).mousemove(mousemoveDocument);

  }
})(jQuery);

