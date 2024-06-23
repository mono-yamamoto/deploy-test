// JavaScript Document

(function($){
 	'use strict';
 /* ----------------------------------------
 register Event
 ---------------------------------------- */
 // Document ready
$(function() {
	spForm();	//SP form
});

function spForm(){

	//SP slide toggle menu
	$(".footer-toggle-menu__ttl--parent").click(function () {
		if ($(this).css('cursor') === 'pointer'){
			//$(this).parent().next(".js-newsroom-toggle-list").slideToggle();
			$(this).next().slideToggle();
			$(this).toggleClass("is-open");
		}
	});

}
	
})(jQuery);
	
//(function() {
//  $(".footer-toggle-menu__ttl--parent").on("click", function() {
//	var $this = $(this);
//	$this.next().slideToggle();
//	$this.toggleClass("is-open");
//  });
//})