$(function(){
	$('.cookie-message button').click(function(){
		$('.cookie-message').hide();
		$('.cookie-message').removeClass('is-open');
		$('.content-wrapper').css("border-top-width", ""); 
	});
});

$(function() {
	
        
   
  // padding内側の高さを取得し、変数に格納
	$(window).on('load resize', function(){
		var h = $('.cookie-message').height();
	 if($('.cookie-message').hasClass('is-open')){
		$(".content-wrapper").css("border-top-width", h); 
		  }
  // コンソールログに表示
  //console.log(h);
	//alert(h);
	});
});