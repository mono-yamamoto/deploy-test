// JavaScript Document


$(function(){
	//liの個数確認
	//var size = $('.brand-area .wrap ul li').length;
	//alert(size);
	
	//最初のアイテムを最後にコピー
	var liclone = $('.brand-area .wrap ul li:first').clone(false);
	$('.brand-area .wrap ul').append(liclone);
	
	//var i = 1;
	
	setTimeout(function(){
		loop();
	},3000);
	
	
	
	function loop() {
		//現在のクラス名を取得
		$('.brand-area .wrap ul').removeClass('pause');
		var classname =  $('.brand-area .wrap ul').attr('class');
		//クラス名を変数化
		var i = classname.replace( /item-0/g , "" ) ;
		var $distance = i*-100 +"%";
		
		//liの個数確認(実際には一つ多い)
		var size = $('.brand-area .wrap ul li').length;
		//alert(size);
		
		$('.brand-area .wrap ul').animate({
			'marginLeft': $distance
		}, {
			duration: 'slow',
			complete: function() {
				//iに1足して
				i++;
				
				$(this).removeClass().addClass('item-0' + i);
				
				if(i == size){
					i =  1;
					$('.brand-area .wrap ul').css('margin-left','');
					$(this).removeClass().addClass('item-01');
				}
				
				setTimeout(function(){
					loop();
				},3000);
			}
		});
	}
	
	
	
	$('.scroll-01').click(function(){
		
		$('.brand-area .wrap ul').not(':animated').animate({
			'marginLeft': ''
		}, {
			
			duration: 'slow',
			complete: function() {
				$('.brand-area .wrap ul').removeClass().addClass('item-01');
				$('.brand-area .wrap ul').addClass('pause');
				//setTimeout(function(){
				//	$('.brand-area .wrap ul').removeClass().addClass('item-01');
				//	$('.brand-area .wrap ul').css('margin-left','');
				//},1000);
				
			}
		});
		
	});
	$('.scroll-02').click(function(){
		$('.brand-area .wrap ul').not(':animated').animate({'marginLeft': '-100%'},{duration: 'slow'});
		setTimeout(function(){
			$('.brand-area .wrap ul').removeClass().addClass('item-02');
		},1000);
	});
	$('.scroll-03').click(function(){
		$('.brand-area .wrap ul').not(':animated').animate({'marginLeft': '-200%'},{duration: 'slow'});
		setTimeout(function(){
			$('.brand-area .wrap ul').removeClass().addClass('item-03');
		},1000);
	});
	
});