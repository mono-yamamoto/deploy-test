(function ($) {
	/*
		2018-07-23	#4855 【標準テンプレ追加】トップページ用スライダー
	*/

	'use strict';
	var $keyvisual_general = [];

	document.addEventListener('DOMContentLoaded', mainProc ,false);

	function mainProc(){
		var $brandArea = $('.brand-area');
		$keyvisual_general = $(".keyvisual-general");
		
		if ($keyvisual_general.length) {
			$brandArea.slick({
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
		
			$(document.body).on('click', '.slick-pause', function(event, slick, currentSlide, nextSlide) {
				var $pauseBtn = $(this);
				if ($pauseBtn.hasClass('paused')){
					$keyvisual_general.slick('slickPlay');
					$keyvisual_general.slick('setOption', 'autoplay', true, true);
					$pauseBtn.removeClass('paused');
				} else {
					$keyvisual_general.slick('slickPause');
					$keyvisual_general.slick('setOption', 'autoplay', false, false);
					$pauseBtn.addClass('paused');
				}
			});
		}
	}

})(jQuery);
