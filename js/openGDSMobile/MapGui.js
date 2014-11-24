var Gui = {};

Gui.initialLoad = true;
Gui.selectedLayer = null;
Gui.tracking = true;

Gui.updateLayout = function(){ 
	var footer = $("div[data-role='footer']:visible"),
	header = $("div[data-role='header']:visible"),
    content = $("div[data-role='content']:visible:visible"), 
    viewHeight = $(window).height(),
    contentHeight = viewHeight - (footer.outerHeight()+header.outerHeight() );
	if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
	    contentHeight -= (content.outerHeight() - content.height() + 1);
	    content.height(contentHeight);
	}
    $("#map").width( $(window).width() );
    $("#map").height( contentHeight   );
  
};

//Default Projection : EPSG:900913
Gui.initViewer = function(){
	Gui.updateLayout(); 
	$(window).on('resize',function(){
		Gui.updateLayout();
	}); 
	$(window).on('orientationchange', function(e) {
	    Map.setWindowOrientation(window.orientation);
	});   
	/**
	 * Vworld Projection
	 */
	var projection = new ol.proj.Projection({
		code: 'EPSG:900913',
		extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		units : 'm'
	});
	ol.proj.addProjection(projection);  
	/**
	 * parameter
	 */
	openGDSM.baseMap('map','osm'); 
	Map.centerOnLocation();   
	/**
	 * Geolocation Event(Set Center)
	 **/
	Map.geolocation.once('change:position',function(){
		Map.map.getView().setCenter(Map.geolocation.getPosition());
	}); 
	/**
	 * Layers Event
	 **/
	$(Map.map.getViewport()).bind('tap',function(evt){
		var pixel = Map.map.getEventPixel(evt.originalEvent);
		Layer.displayFeatureInfo(pixel);
	}); 
	Gui.updateLayout();
};

$(document).ready(function(e){
	Gui.initViewer();  
});