/*--------------------------------------------------------------------------------------
	2021-07-30 KMJ_CODING-327 【DBC】標準テンプレ修正（アンカーリンクのヘッダの挙動）
	2020-03-04 #8730 企業情報 Global Network 修正依頼 (Brasil HC)
	2020-02-27 #7937 標準テンプレパーツ・アンカーリンクの挙動修正
	2019-10-23 #7937 標準テンプレパーツ・アンカーリンクの挙動修正
	2019-08-27 #7535 【IR】【CGW】表示速度改善施策（追加施策）
	2019-03-11 #6619: 【パーツ追加】JS絞り込み機能 で発見した不具合修正
	2018-11-28 #4936【不具合修正】アンカーリンク
	2018-11-26 #5795 【不具合修正】グロナビを開いたときのコンテンツ
	2018-11-22 #4936【不具合修正】アンカーリンク
	2018-07-26 #4918 【ランプロ】Facebookからのリンク不具合対応
	2018/03/26 #3244-#10
	2018/02/01 page-link-listのスムーススクロール、ヘッダーサブナビゲーション可変対応 (Yoshida)
	2017/02/23 page-link-listのスムーススクロール追加 (Yoshida)
-------------------------------------------------------------------------------------- */
var window_init_Scroll = false; //anchor location flg

(function ($) {
	'use strict';
	var $htmlBody = {};
	var $header = {};
	var $lHeader = {};
	var $lHeaderBlock = {};
	var $page_link_list_li_a = {};
	var offsetHeight = 0;
	var locURL = decodeURI(location.href);
	var locArr = locURL.split('#');
	var lhint_1 = 0;
	var intSc = 0;
	var oldHeader = false;
	var anchorInit = false;

	if (locURL.search("#") !== -1) {
		window_init_Scroll = true;
		anchorInit = true;
		window.addEventListener("load",function(){	
			document.addEventListener("scroll",function(){	
				if(anchorInit){
					window_init_Scroll = false;
				}
			},false)
		},false)
	}
	
	$(function () {
		$htmlBody = $('html,body');
		$header = $('header');
		$lHeaderBlock = $('.l-header__block');

		$page_link_list_li_a = $('.page-link-list li a[href^="#"]');
		if ($('.l-header').length) {
			$lHeader = $('.l-header');
		}
		
    	if (!$lHeader.length) {
        	var localnavigation_Scroll = false;
			var localnavigation_height = false;
        	oldHeader = true;
    	}
		
		$('a[href="#top"]').click(function (e) {
			if (lhint_1) {
				clearTimeout(lhint_1);
			}
			if (intSc) {
				clearInterval(intSc);
			}
			$htmlBody.clearQueue();
			$htmlBody.finish();

			$htmlBody.stop().animate({
				scrollTop: 0
			}, 500, 'easeOutQuint', function(){
				window_init_Scroll = false;
			});
			e.preventDefault();
			return false;
		});

		if ($page_link_list_li_a.length) {
			$page_link_list_li_a.on('click', function (e) {
				if (intSc) {
					clearInterval(intSc);
				}
				pageLinkistScroll($(this), 'a');
				e.preventDefault();
				return false;
			});
		}

		if (locArr[1]) {
			if (locArr[1] !== "top") {
				if ($lHeader.length && !oldHeader) {
					intSc = setInterval(function () {
						if (localnavigation_height && !localnavigation_Scroll) {
							clearInterval(intSc);
							var tObj = $('#' + locArr[1]);
							$htmlBody.clearQueue();
							$htmlBody.finish();
							pageLinkistScroll(tObj, 'l');
						}
					}, 50);

				} else {
					var tObj = $('#' + locArr[1]);
					$htmlBody.clearQueue();
					$htmlBody.finish();
					pageLinkistScroll(tObj, 'l');
				}
			}
		}
	});


	/*----------------------------------------
		function
	---------------------------------------- */

	function pageLinkistScroll(tObj, mode) {
		var ids = '';
		var tgt = 0;
        var tgtmt = 0;
        var $ids = {};
	
		if (mode === 'l') {
			var idst = locURL.split('#');
			tgt = tObj.offset().top; // #3244-#10 
			ids = idst[1];
			$ids = $(ids);

		} else {
			ids = tObj.attr('href');
            $ids = $(ids);
			if($ids.length){            
				var nst = $(window).scrollTop();
				var tmt= parseInt($ids.css('margin-top'), 10);
				tgt = $ids.offset().top;
				if(tgt>nst && window.matchMedia( "(min-width: 720px)" ).matches) {
					tgt += tmt;
				}
			} else {
				return false;
			}
		}

		//#4918
		//#4936
		var speed = 500 + Math.floor(Math.sin(tgt*10000));

		if (mode === 'l') {
			lhint_1 = setTimeout(function () {
				pageScrollRunner();
			}, 500);

		} else {
			if(!oldHeader) {
				lhint_1 = setInterval(function () {
					if(!localnavigation_Scroll){
						clearInterval(lhint_1);
						pageScrollRunner();
					}
				}, 50);
			} else {
				pageScrollRunner();
			}
		}

		function pageScrollRunner() {
			$htmlBody.clearQueue();
			$htmlBody.finish();
            window_init_Scroll = true;

			if(!oldHeader) {
				offsetHeightSet();
			}
			
			tgtmt = $ids.outerHeight(true) - $ids.height();                            
			
			if ($lHeader.length && !oldHeader) {
                if (window.matchMedia( "(min-width: 720px)" ).matches) {
                    if($lHeaderBlock.length) {
                        tgtmt = tgtmt + $lHeaderBlock.height();
                    }                   
                    tgt = tgt - offsetHeight - tgtmt;
                    $lHeader.css('top',($lHeader.height()*-1) + 'px');
                } else {
					tgt = tgt - offsetHeight;
				}
			} else if(oldHeader) {
				tgt = tgt  - tgtmt;
				if (window.matchMedia( "(min-width: 720px)" ).matches) {
					tgt = tgt - $header.height();
				} 
			}

			$htmlBody.stop().animate({
				scrollTop: tgt
			}, speed, 'easeOutQuint', function () {

				if($lHeader.length && !oldHeader) {
                    //setTimeout(function(){
                        $htmlBody.stop();
                        if (window.matchMedia( "(min-width: 720px)" ).matches) {
                            setTimeout(function(){
                                $htmlBody.scrollTop(tgt-2);
                                window_init_Scroll = false;
                            },400);
                        } else {
                            window_init_Scroll = false;
                        }
                    //},250);


				}
			});


			function offsetHeightSet() {
				var lHeader_top = 0;
				offsetHeight = 0;		

				if ($('.l-header').length && !window_init_Scroll) {

					if ($lHeader.css('top') !== 'auto') {
						lHeader_top = parseInt($lHeader.css('top'));
						if (lHeader_top > 0) {
							lHeader_top = lHeader_top * -1;
						}
					}

					if (lHeader_top === 0) {
						offsetHeight = $lHeader.height();
					} else {
						if (window.matchMedia( "(max-width: 719px)" ).matches) {
							offsetHeight = $lHeader.height();
						} else {
							offsetHeight = lHeader_top + $lHeader.height();
						}
					}

				} else {
					offsetHeight = $header.height();
				}
				
				if (window.matchMedia( "(min-width: 720px)" ).matches) {		
					offsetHeight += $header.height();
				}
			}

		}
	}

	/*
	function handleTouchMove(e) {
		e.preventDefault();
	}
	
	function scrollDisable(){
		document.addEventListener('touchmove, scroll', handleTouchMove, { passive: false });
	}
	
	function scrollEnable(){
		document.removeEventListener('touchmove, scroll', handleTouchMove, { passive: false });
	}
	*/
	
	document.addEventListener('touchmove',function(){
		$htmlBody.stop();
		$htmlBody.clearQueue();
		$htmlBody.finish();			
	},false);	
	

})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright ﾂｩ 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright ﾂｩ 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */