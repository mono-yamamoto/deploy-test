var window_init_Scroll=!1;!function($){"use strict";var $htmlBody={},$header={},$lHeader={},$lHeaderBlock={},$page_link_list_li_a={},offsetHeight=0,locURL=decodeURI(location.href),locArr=locURL.split("#"),lhint_1=0,intSc=0,oldHeader=!1,anchorInit=!1;function pageLinkistScroll(tObj,mode){var ids="",tgt=0,tgtmt=0,$ids={};if("l"===mode){var idst=locURL.split("#");tgt=tObj.offset().top,ids=idst[1],$ids=$(ids)}else{if(ids=tObj.attr("href"),!($ids=$(ids)).length)return!1;var nst=$(window).scrollTop(),tmt=parseInt($ids.css("margin-top"),10);(tgt=$ids.offset().top)>nst&&window.matchMedia("(min-width: 720px)").matches&&(tgt+=tmt)}var speed=500+Math.floor(Math.sin(1e4*tgt));function pageScrollRunner(){function offsetHeightSet(){var lHeader_top=0;offsetHeight=0,$(".l-header").length&&!window_init_Scroll?("auto"!==$lHeader.css("top")&&(lHeader_top=parseInt($lHeader.css("top")))>0&&(lHeader_top*=-1),offsetHeight=0===lHeader_top?$lHeader.height():window.matchMedia("(max-width: 719px)").matches?$lHeader.height():lHeader_top+$lHeader.height()):offsetHeight=$header.height(),window.matchMedia("(min-width: 720px)").matches&&(offsetHeight+=$header.height())}$htmlBody.clearQueue(),$htmlBody.finish(),window_init_Scroll=!0,oldHeader||offsetHeightSet(),tgtmt=$ids.outerHeight(!0)-$ids.height(),$lHeader.length&&!oldHeader?window.matchMedia("(min-width: 720px)").matches?($lHeaderBlock.length&&(tgtmt+=$lHeaderBlock.height()),tgt=tgt-offsetHeight-tgtmt,$lHeader.css("top",-1*$lHeader.height()+"px")):tgt-=offsetHeight:oldHeader&&(tgt-=tgtmt,window.matchMedia("(min-width: 720px)").matches&&(tgt-=$header.height())),$htmlBody.stop().animate({scrollTop:tgt},speed,"easeOutQuint",(function(){$lHeader.length&&!oldHeader&&($htmlBody.stop(),window.matchMedia("(min-width: 720px)").matches?setTimeout((function(){$htmlBody.scrollTop(tgt-2),window_init_Scroll=!1}),400):window_init_Scroll=!1)}))}"l"===mode?lhint_1=setTimeout((function(){pageScrollRunner()}),500):oldHeader?pageScrollRunner():lhint_1=setInterval((function(){localnavigation_Scroll||(clearInterval(lhint_1),pageScrollRunner())}),50)}-1!==locURL.search("#")&&(window_init_Scroll=!0,anchorInit=!0,window.addEventListener("load",(function(){document.addEventListener("scroll",(function(){anchorInit&&(window_init_Scroll=!1)}),!1)}),!1)),$((function(){if($htmlBody=$("html,body"),$header=$("header"),$lHeaderBlock=$(".l-header__block"),$page_link_list_li_a=$('.page-link-list li a[href^="#"]'),$(".l-header").length&&($lHeader=$(".l-header")),!$lHeader.length){var localnavigation_Scroll=!1,localnavigation_height=!1;oldHeader=!0}if($('a[href="#top"]').click((function(e){return lhint_1&&clearTimeout(lhint_1),intSc&&clearInterval(intSc),$htmlBody.clearQueue(),$htmlBody.finish(),$htmlBody.stop().animate({scrollTop:0},500,"easeOutQuint",(function(){window_init_Scroll=!1})),e.preventDefault(),!1})),$page_link_list_li_a.length&&$page_link_list_li_a.on("click",(function(e){return intSc&&clearInterval(intSc),pageLinkistScroll($(this),"a"),e.preventDefault(),!1})),locArr[1]&&"top"!==locArr[1])if($lHeader.length&&!oldHeader)intSc=setInterval((function(){if(localnavigation_height&&!localnavigation_Scroll){clearInterval(intSc);var tObj=$("#"+locArr[1]);$htmlBody.clearQueue(),$htmlBody.finish(),pageLinkistScroll(tObj,"l")}}),50);else{var tObj=$("#"+locArr[1]);$htmlBody.clearQueue(),$htmlBody.finish(),pageLinkistScroll(tObj,"l")}})),document.addEventListener("touchmove",(function(){$htmlBody.stop(),$htmlBody.clearQueue(),$htmlBody.finish()}),!1)}(jQuery),jQuery.easing.jswing=jQuery.easing.swing,jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){return(t/=d/2)<1?c/2*t*t+b:-c/2*(--t*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){return(t/=d/2)<1?c/2*t*t*t+b:c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){return(t/=d/2)<1?c/2*t*t*t*t+b:-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){return(t/=d/2)<1?c/2*t*t*t*t*t+b:c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return 0==t?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return t==d?b+c:c*(1-Math.pow(2,-10*t/d))+b},easeInOutExpo:function(x,t,b,c,d){return 0==t?b:t==d?b+c:(t/=d/2)<1?c/2*Math.pow(2,10*(t-1))+b:c/2*(2-Math.pow(2,-10*--t))+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){return(t/=d/2)<1?-c/2*(Math.sqrt(1-t*t)-1)+b:c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158,p=0,a=c;if(0==t)return b;if(1==(t/=d))return b+c;if(p||(p=.3*d),a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158,p=0,a=c;if(0==t)return b;if(1==(t/=d))return b+c;if(p||(p=.3*d),a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158,p=0,a=c;if(0==t)return b;if(2==(t/=d/2))return b+c;if(p||(p=d*(.3*1.5)),a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return t<1?a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*-.5+b:a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){return null==s&&(s=1.70158),c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){return null==s&&(s=1.70158),c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){return null==s&&(s=1.70158),(t/=d/2)<1?c/2*(t*t*((1+(s*=1.525))*t-s))+b:c/2*((t-=2)*t*((1+(s*=1.525))*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){return(t/=d)<1/2.75?c*(7.5625*t*t)+b:t<2/2.75?c*(7.5625*(t-=1.5/2.75)*t+.75)+b:t<2.5/2.75?c*(7.5625*(t-=2.25/2.75)*t+.9375)+b:c*(7.5625*(t-=2.625/2.75)*t+.984375)+b},easeInOutBounce:function(x,t,b,c,d){return t<d/2?.5*jQuery.easing.easeInBounce(x,2*t,0,c,d)+b:.5*jQuery.easing.easeOutBounce(x,2*t-d,0,c,d)+.5*c+b}});