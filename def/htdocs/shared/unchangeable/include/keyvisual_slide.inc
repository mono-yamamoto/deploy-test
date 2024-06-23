<section class="brand-area" data-type="keyvisual" data-max="3" data="slides" ng-controller="keyvisualController" on-finish-render-keyvisual>

<div><img src="/shared/unchangeable/img/branding_sample_pc.png" alt="Giving Shape to Ideas"/><img src="/shared/unchangeable/img/branding_sample_sp.png" alt="Giving Shape to Ideas"/></div>

<div ng-repeat="item in facts" keyData class="ngReady"><a ng-href={{item.urls}} target={{item.trg}} class={{item.displayAlert}}><img ng-src={{item.filename1}} alt={{item.alt}} /><img ng-src={{item.filename2}} alt={{item.alt}} /></a></div>
<!--/brand-area--></section>

<!-- original source
<section class="brand-area">
<div><a href="#"><img src="/shared/unchangeable/img/branding_01_pc.jpg" alt=""/><img src="/shared/unchangeable/img/branding_01_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_02_pc.jpg" alt=""/><img src="json/branding_02_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_03_pc.jpg" alt=""/><img src="json/branding_03_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_04_pc.jpg" alt=""/><img src="json/branding_04_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_05_pc.jpg" alt=""/><img src="json/branding_05_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_06_pc.jpg" alt=""/><img src="json/branding_06_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_07_pc.jpg" alt=""/><img src="json/branding_07_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_08_pc.jpg" alt=""/><img src="json/branding_08_sp.jpg" alt=""/></a></div>
<div><a href="#"><img src="json/branding_09_pc.jpg" alt=""/><img src="json/branding_09_sp.jpg" alt=""/></a></div>
</section>-->