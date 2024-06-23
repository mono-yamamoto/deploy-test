(function ($) {
	/*
		2018-07-23	#4855 【標準テンプレ追加】トップページ用スライダー
	*/

	'use strict';
	var $keyvisualGeneral = [];
	var $keyvisualGeneral_slickSlide = [];

	document.addEventListener('DOMContentLoaded', mainProc ,false);

	function mainProc(){
		var $keyvisualGeneral = $('.keyvisual-general');		
		
		if ($keyvisualGeneral.length) {
			$keyvisualGeneral_slickSlide = $(".keyvisual-general > div");
			$keyvisualGeneral.addClass('lazyStill');
			$keyvisualGeneral.slick({
				lazyLoad: 'ondemand',
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
			});
			$keyvisualGeneral.on('setPosition', function(slick){
				$keyvisualGeneral.removeClass('lazyStill');
				$keyvisualGeneral_slickSlide.eq(0).addClass('lazyOk');
			});
			$keyvisualGeneral.on('beforeChange', function(event, slick, currentSlide, nextSlide){
				if(!$keyvisualGeneral_slickSlide.eq(nextSlide).hasClass('lazyOk')){
					$keyvisualGeneral.addClass('lazyStill');
				} 
			});
			$keyvisualGeneral.on('afterChange', function(event, slick, currentSlide){
				if(!$keyvisualGeneral_slickSlide.eq(currentSlide).hasClass('lazyOk')){
					$keyvisualGeneral.removeClass('lazyStill');
					$keyvisualGeneral_slickSlide.eq(currentSlide).addClass('lazyOk');
				}
			});
			$(document.body).on('click', '.slick-pause', function(event, slick, currentSlide, nextSlide) {
				var $pauseBtn = $(this);
				if ($pauseBtn.hasClass('paused')){
					$keyvisualGeneral.slick('slickPlay');
					$keyvisualGeneral.slick('setOption', 'autoplay', true, true);
					$pauseBtn.removeClass('paused');
				} else {
					$keyvisualGeneral.slick('slickPause');
					$keyvisualGeneral.slick('setOption', 'autoplay', false, false);
					$pauseBtn.addClass('paused');
				}
			});
		}

	}

})(jQuery);
