// JavaScript Document

(function($sw){
 	'use strict';

	var $productsSlider = [];
	var $relatedLinks = [];
	var productsSliderInstance = [];
	var relatedLinksInstance = [];
	var scrollRunner = [];

	//dom content register
	document.addEventListener("DOMContentLoaded", function() {
	
		//products-slider
		$productsSlider = document.getElementsByClassName('products-slider');
		if($productsSlider.length !==0){
		
			//products-slider インスタンス生成
			var i = 0;
			while(i < $productsSlider.length){
				productsSliderInstance[i] = new swiperClass();
				i++;
			}
			
			//スクロール制御 インスタンス生成
			scrollRunner[0] =  new scrollClass($productsSlider,productsSliderInstance);
			scrollRunner[0].scrollRun('products');
			document.addEventListener( 'scroll', function(){
				scrollRunner[0].scrollRun('products');
			}, false);
		}

		//related-links
		$relatedLinks = document.getElementsByClassName('related-links');
		if($relatedLinks.length !==0){
		
			//related-links インスタンス生成
			var j = 0;
			while(j < $relatedLinks.length){
				relatedLinksInstance[j] = new swiperClass();
				j++;
			}
			
			//スクロール制御 インスタンス生成
			scrollRunner[1] =  new scrollClass($relatedLinks,relatedLinksInstance);
			scrollRunner[1].scrollRun('related');
			document.addEventListener( 'scroll', function(){
				scrollRunner[1].scrollRun('related');
			}, false);
		}
	
	});


	/*
		スクロール制御　クラス
	*/
	function scrollClass(doms,inst){
		this.buildGo = [];
		this.buildCnt = 0;
		this.targetDoms = doms;
		this.targetInstance = inst;
	}
	
	scrollClass.prototype.scrollRun = function(type){

		if(this.buildCnt < this.targetInstance.length) {
		
			for(var i=0; i< this.targetInstance.length; i++) {
			
				var rect = this.targetDoms[i].getBoundingClientRect() ;
				var sh = Math.ceil(rect.height/4);
				
				//console.log((rect.top + rect.height) + "/"+  sh);
				if(typeof this.buildGo[i] === "undefined" && ((rect.top + sh) <= window.innerHeight) && ((rect.top + rect.height- sh) >= 0)){

					//該当位置でswper構築メソッド実行
					if(type === 'products'){
						this.targetInstance[i].productsSliderBuild(this.targetDoms[i]);
					} else if(type === 'related'){
						this.targetInstance[i].relatedLinksBuild(this.targetDoms[i]);
					}
					
					this.buildGo[i] = true;
					this.buildCnt++;

				}
			}

			if(this.buildCnt >= this.targetInstance.length) {
				var obj = this;
				document.removeEventListener( 'scroll', function(){
					obj.scrollRun();
				}, false);
			}
		
		}
		
	};


	/*
		swoper構築クラス
	*/
	function swiperClass(){
	}


	// productsSlide構築メソッド
	swiperClass.prototype.productsSliderBuild = function(sobj){
		var slider = {};
		var $swiperContainer = sobj.getElementsByClassName('swiper-container')[0];
		var $swiperContainer_swiperWrapper = $swiperContainer.getElementsByClassName('swiper-wrapper')[0];
		var $swiperWrapper_swiperSlide = $swiperContainer_swiperWrapper.getElementsByClassName('swiper-slide');
		var $swiperPagenation = sobj.getElementsByClassName('swiper-pagenation')[0];
		var $swiperPagenation_img = $swiperPagenation.getElementsByTagName('img');
		var $swiperButtonNext = sobj.getElementsByClassName('swiper-button-next')[0];
		var $swiperButtonPrev = sobj.getElementsByClassName('swiper-button-prev')[0];
		var thubImages = [];
		
		if($swiperWrapper_swiperSlide.length >= 2){	// 2件以上の時swiper構築
      		swiperBuild();
		} else {
			$swiperPagenation.style.display = 'none';
			$swiperButtonNext.style.display = 'none';
			$swiperButtonPrev.style.display = 'none';
			sobj.classList.add('active');
		}
		
		function swiperBuild(){
			var i = 0;
			while(i < $swiperPagenation_img.length){
				thubImages[i] = $swiperPagenation_img[i].src;
				i++;
			}
		
			slider = new $sw($swiperContainer , {
				preloadImages: false,
				autoResize: true,
				autoHeight: true,
				nextButton: $swiperButtonNext,
				prevButton: $swiperButtonPrev,
				pagination: $swiperPagenation,
				paginationClickable: true,
				paginationElement: 'div',
				paginationBulletRender: function(index, cls){
					return '<div class="swiper-pagination-bullet" style="background-image:url(' + thubImages[cls] + ')"></div>'; 
				},
				onInit: function(){
					sobj.classList.add('active');
				}
			});
		
		}
		
	};


	//related-links 構築メソッド
	swiperClass.prototype.relatedLinksBuild = function(sobj){
		var slider = null;
		var $swiperContainer = sobj.getElementsByClassName('swiper-container')[0];
		var $swiperContainer_swiperWrapper = $swiperContainer.getElementsByClassName('swiper-wrapper')[0];
		var $swiperWrapper_swiperSlide = $swiperContainer_swiperWrapper.getElementsByClassName('swiper-slide');
		var $swiperNaviarea = sobj.getElementsByClassName('swiper-naviarea')[0];
		var $swiperPagenation = $swiperNaviarea.getElementsByClassName('swiper-pagenation')[0];
		var $swiperButtonNext = $swiperNaviarea.getElementsByClassName('swiper-button-next')[0];
		var $swiperButtonPrev = $swiperNaviarea.getElementsByClassName('swiper-button-prev')[0];

		if($swiperWrapper_swiperSlide.length >= 2){	// 2件以上の時swiper構築
      		swiperBuild();
		} else {
			$swiperNaviarea.style.display = 'none';
			sobj.classList.add('active');
		}

		function swiperBuild(){
			slider = new $sw($swiperContainer , {
				calculateHeight: true,
				slidesPerView: 1,
				centeredSlides : true,
				loop: true,
				autoResize: true,
				autoHeight: true,
				nextButton: $swiperButtonNext,
				prevButton: $swiperButtonPrev,
				pagination: $swiperPagenation,
				paginationClickable: true,
				onInit: function(){
					sobj.classList.add('active');
				}
			});
		
		}

		
	};
	
})(Swiper);
