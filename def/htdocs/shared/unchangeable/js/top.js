$(function(){//パネル全体リンクと一部リンク
	largelink();
	function largelink() {
		$('.js-link-panel-wrap').on("click", function() {
			var $url = $(this).find('.js-link-panel-url').attr("href");
			
			if($(this).find('.js-link-panel-url').attr("target") ){
				window.open($url, "_blank" ) ;
			}else{
			   document.location.href=$url;
			}
		});
		$('.js-link-panel-url, .support-download li a').click(function(e){
		   e.stopPropagation();

		});
	}
});


$(function () {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        // sp
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        // tab
		//alert("tab");
    } else {
        // pc
//		/alert("pc");
		$(".product-service").addClass("is-pc");
		$(".innovation-industries").addClass("is-pc");
		$(".innovation-industries >div >div").addClass("is-pc");
		//$("body").addClass("is-pc");
    }
});

/*
$(function() {
    $('.brand-area').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		infinite: true,
		autoplay: true,
		dots: true,
		arrows: false,
		pauseOnHover : false
		
	});
	
	$(document.body).on('click', '.slick-pause', function() {
	//$('.slick-pause').live('click', function(){
		var $pauseBtn = $(this);
		if ($pauseBtn.hasClass('paused')){
			$(".brand-area").slick('slickPlay');
			$(".brand-area").slick('setOption', 'autoplay', true, true);
			$pauseBtn.removeClass('paused');
		} else {
			$(".brand-area").slick('slickPause');
			$(".brand-area").slick('setOption', 'autoplay', false, false);
			$pauseBtn.addClass('paused');
		}
	});
	
});
*/