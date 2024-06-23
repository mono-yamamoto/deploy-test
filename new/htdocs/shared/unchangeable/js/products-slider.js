// JavaScript Document

function initializeSwiper($sw){
	/*
		swiper構築クラス
	*/
	function SwiperClass(){
	}

	/*
		スクロール制御クラス
	*/
	function ScrollClass(doms,inst){
		this.buildGo = [];
		this.buildCnt = 0;
		this.targetDoms = doms;
		this.targetInstance = inst;
	}

	let $productsSlider = [];
	let $relatedLinks = [];
	const productsSliderInstance = [];
	const relatedLinksInstance = [];
	const scrollRunner = [];

	// dom content register
	document.addEventListener("DOMContentLoaded", () => {
	
		// products-slider
		$productsSlider = document.getElementsByClassName('products-slider');
		if($productsSlider.length !==0){
		
			// products-slider インスタンス生成
			let i = 0;
			while(i < $productsSlider.length){
				productsSliderInstance[parseInt(i, 10)] = new SwiperClass();
				i += 1;
			}
			
			// スクロール制御 インスタンス生成
			scrollRunner[0] =  new ScrollClass($productsSlider,productsSliderInstance);
			scrollRunner[0].scrollRun('products');
			document.addEventListener( 'scroll', () => {
				scrollRunner[0].scrollRun('products');
			}, false);
		}

		// related-links
		$relatedLinks = document.getElementsByClassName('related-links');
		if($relatedLinks.length !==0){
		
			// related-links インスタンス生成
			let j = 0;
			while(j < $relatedLinks.length){
				relatedLinksInstance[parseInt(j, 10)] = new SwiperClass();
				j += 1;
			}
			
			// スクロール制御 インスタンス生成
			scrollRunner[1] =  new ScrollClass($relatedLinks,relatedLinksInstance);
			scrollRunner[1].scrollRun('related');
			document.addEventListener( 'scroll', () => {
				scrollRunner[1].scrollRun('related');
			}, false);
		}
	
	});

	ScrollClass.prototype.scrollRun = function scrollRun(type){

		if(this.buildCnt < this.targetInstance.length) {
		
			for(let i=0; i< this.targetInstance.length; i += 1) {
			
				const rect = this.targetDoms[parseInt(i, 10)].getBoundingClientRect() ;
				const sh = Math.ceil(rect.height/4);
				
				// console.log((rect.top + rect.height) + "/"+  sh);
				if(typeof this.buildGo[parseInt(i, 10)] === "undefined" && ((rect.top + sh) <= window.innerHeight) && ((rect.top + rect.height- sh) >= 0)){

					// 該当位置でswper構築メソッド実行
					if(type === 'products'){
						this.targetInstance[parseInt(i, 10)].productsSliderBuild(this.targetDoms[parseInt(i, 10)]);
					} else if(type === 'related'){
						this.targetInstance[parseInt(i, 10)].relatedLinksBuild(this.targetDoms[parseInt(i, 10)]);
					}
					
					this.buildGo[parseInt(i, 10)] = true;
					this.buildCnt += 1;

				}
			}

			if(this.buildCnt >= this.targetInstance.length) {
				const obj = this;
				document.removeEventListener( 'scroll', () =>{
					obj.scrollRun();
				}, false);
			}
		
		}
		
	};




	// productsSlide構築メソッド
	SwiperClass.prototype.productsSliderBuild = function productsSliderBuild(sobj){
		const $swiperContainer = sobj.getElementsByClassName('swiper-container')[0];
		const $swiperContainerSwiperWrapper = $swiperContainer.getElementsByClassName('swiper-wrapper')[0];
		const $swiperWrapperSwiperSlide = $swiperContainerSwiperWrapper.getElementsByClassName('swiper-slide');
		const $swiperPagenation = sobj.getElementsByClassName('swiper-pagenation')[0];
		const $swiperPagenationImg = $swiperPagenation.getElementsByTagName('img');
		const $swiperButtonNext = sobj.getElementsByClassName('swiper-button-next')[0];
		const $swiperButtonPrev = sobj.getElementsByClassName('swiper-button-prev')[0];
		const thubImages = [];

		function swiperBuild(){
			let i = 0;
			while(i < $swiperPagenationImg.length){
				thubImages[parseInt(i, 10)] = $swiperPagenationImg[parseInt(i, 10)].src;
				i += 1;
			}
		
			const slider = new $sw($swiperContainer , { // eslint-disable-line no-unused-vars
				preloadImages: false,
				autoResize: true,
				autoHeight: true,
				nextButton: $swiperButtonNext,
				prevButton: $swiperButtonPrev,
				pagination: $swiperPagenation,
				paginationClickable: true,
				paginationElement: 'div',
				paginationBulletRender(index, cls){
					return `<div class="swiper-pagination-bullet" style="background-image:url(${  thubImages[parseInt(cls, 10)]  })"></div>`; 
				},
				onInit(){
					sobj.classList.add('active');
				}
			});
		}
		
		if($swiperWrapperSwiperSlide.length >= 2){	// 2件以上の時swiper構築
      		swiperBuild();
		} else {
			$swiperPagenation.style.display = 'none';
			$swiperButtonNext.style.display = 'none';
			$swiperButtonPrev.style.display = 'none';
			sobj.classList.add('active');
		}
	};


	// related-links 構築メソッド
	SwiperClass.prototype.relatedLinksBuild = function relatedLinksBuild(sobj){
		const $swiperContainer = sobj.getElementsByClassName('swiper-container')[0];
		const $swiperContainerSwiperWrapper = $swiperContainer.getElementsByClassName('swiper-wrapper')[0];
		const $swiperWrapperSwiperSlide = $swiperContainerSwiperWrapper.getElementsByClassName('swiper-slide');
		const $swiperNaviarea = sobj.getElementsByClassName('swiper-naviarea')[0];
		const $swiperPagenation = $swiperNaviarea.getElementsByClassName('swiper-pagenation')[0];
		const $swiperButtonNext = $swiperNaviarea.getElementsByClassName('swiper-button-next')[0];
		const $swiperButtonPrev = $swiperNaviarea.getElementsByClassName('swiper-button-prev')[0];

		function swiperBuild(){
			const slider = new $sw($swiperContainer , { // eslint-disable-line no-unused-vars
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
				onInit(){
					sobj.classList.add('active');
				}
			});
		}

		if($swiperWrapperSwiperSlide.length >= 2){	// 2件以上の時swiper構築
      		swiperBuild();
		} else {
			$swiperNaviarea.style.display = 'none';
			sobj.classList.add('active');
		}
	};
	
}

initializeSwiper(Swiper); // eslint-disable-line no-undef