/*
	IR Local js
	2019-08-29	First Entry	
*/

(function($){
var jsNewsroomToggleButton = {};
var jsNewsroomToggleList = {};

// selector setting
function selectorSetting(){
	if($(".js-newsroom-toggle-list").length) {
		if($(".js-newsroom-toggle-button").length){
			jsNewsroomToggleButton = $(".js-newsroom-toggle-button");
			spToggle();	//toggle open/close
		}
	
	}
}

//SP form
function spToggle(){
	//SP slide toggle menu
	jsNewsroomToggleButton.click(function () {
		var $this = $(this);
		if ($this.css('cursor') === 'pointer'){
			$this.parent().next(".js-newsroom-toggle-list").slideToggle();
			$this.toggleClass("is-open");
		}
	});
}

 // Document ready
$(function() {
	selectorSetting()
});

})(jQuery);
