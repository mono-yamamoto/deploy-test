//タブ切り替え
$(function(){
	var current = $('.tab-navigation > li');
	var content = $('.tab-content');
	
	$(current).on("click", function() {
		$(current).removeAttr('class');
		$(this).addClass('current');
		var index = $(current).index(this);
		
		$(content).hide();
		$(content).eq(index).fadeIn();
		
	});
});
