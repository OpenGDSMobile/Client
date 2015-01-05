/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
var WEBAPP = WEBAPP || {};
WEBAPP = (function ($) {
    'use strict';
    var map, divName, minResolution = null,
        windowOrientation = null,
        deviceOrientation = null;
    WEBAPP = function (divName) {
        this.divName = divName;

        this.map = new ol.Map({
            target : divName,
            layers : [
                new ol.layer.Tile({
                    title : 'basemap',
                    source : new ol.source.OSM()
                })
            ],
            view: new ol.View({
                projection : ol.proj.get('EPSG:900913'),
                center : [0, 0],
                zoom : 10
            })
        });

		this.map.getView().on('change:rotation', function () {
			$.event.trigger({
                type : 'maprotation',
                rotation : this.getRotation()
            });
		});
		this.map.getView().on('change:resolution', function () {
			if (this.getResolution() < minResolution) {
				this.setResolution(minResolution);
			}
		});
    };
    WEBAPP.prototype = {
        constructor : WEBAPP
    };
    return WEBAPP;
}(jQuery));

var beforeProcess = {
    popupSize: function (obj, width, height) {
        'use strict';
        width = (typeof (width) !== 'undefined') ? width : $(window).width() - 50;
        height = (typeof (height) !== 'undefined') ? height : "300px";
        $(obj).css("width", width / 2);
        $(obj).css("height", height);
        $(obj).css("overflow-y", "auto");
        $(obj).css("overflow-x", "hidden");
    },
    popupOpen: function (obj) {
        'use strict';
        $('#serviceName').attr('data-value', $(obj).attr('data-value'));
    }
};
WEBAPP.prototype.getMap = function () {
    'use strict';
    return this.map;
};
WEBAPP.prototype.updateLayout = function () {
    'use strict';
    var footer = $("div[data-role='footer']:visible"),
        header = $("div[data-role='header']:visible"),
        content = $("div[data-role='content']:visible:visible"),
        viewHeight = $(window).height(),
        contentHeight = viewHeight - (footer.outerHeight() + header.outerHeight());
	if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
	    contentHeight -= (content.outerHeight() - content.height() + 1);
	    content.height(contentHeight);
	}
    $("#map").width($(window).width());
    $("#map").height(contentHeight);

    $("#d3View").attr('width', $(window).width() - 100);
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);
	beforeProcess.popupSize("#dataSelect");
	beforeProcess.popupSize("#vworldList", "300px");
	$('#layersList').css('height', $(window).height());
	$('#layersList').css("overflow-y", "auto");

};


WEBAPP.prototype.setRotation = function (rotation) {
    'use strict';
    this.map.getView.setRotation(rotation);
};
WEBAPP.prototype.setWindowOrientation = function (orientation) {
    'use strict';
	this.windowOrientation = orientation;
	if (this.deviceOrientation !== null && WEBAPP.deviceOrientation.getTracking()
            && this.deviceOrientation.getHeading() !== undefined) {
		this.setRotation(this.adjustedHeading(-this.deviceOrientation.getHeading()));
	}
};
WEBAPP.prototype.initViewer = function () {
    'use strict';
    var map,
        projection,
        geolocation,
        obj;
    map = this.map;
    obj = this;
	this.updateLayout();
	$(window).on('resize', function () {
		obj.updateLayout();
	});
    /*
	$(window).on('orientationchange', function (e) {
        WEBAPP.setWindowOrientation(window.orientation);
	});
    */
	projection = new ol.proj.Projection({
		code: 'EPSG:900913',
		extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		units : 'm'
	});
	ol.proj.addProjection(projection);

    geolocation = new ol.Geolocation({
		projection:	map.getView().getProjection(),
		tracking : true
	});
    /**
	 * Geolocation Event(Set Center)
	 **/
	geolocation.once('change:position', function () {
		map.getView().setCenter(geolocation.getPosition());
	});
	/**
	 * Layers Event
	 **/
	$(map.getViewport()).bind('tap', function (evt) {
		var pixel = map.getEventPixel(evt.originalEvent);
	//	Layer.displayFeatureInfo(pixel);
	});
	this.updateLayout();
};

var styleChange = function (obj) {
    'use strict';
	$('#wmsButton').attr('data-layer', $(obj).attr('value'));
};
$(document).ready(function (e) {
    'use strict';
    /*
     *
     */
    var webAppObj,
        openGDSMObj,
        openGDSMUI;
    webAppObj = new WEBAPP('map');
    webAppObj.initViewer();
    /*
    $(document).on("pageinit", function () {
        $.mobile.loader.prototype.options.text = "loading";
        $.mobile.loader.prototype.options.textVisible = false;
        $.mobile.loader.prototype.options.theme = "a";
        $.mobile.loader.prototype.options.html = "";
    });
    */
	//openGDSM.openGDSMGeoserver.getLayers();
    openGDSMObj = new OGDSM(webAppObj.getMap());
    console.log(openGDSMObj);
    this.baseMap = function (style) {
        openGDSMObj.changeBaseMap(style);
    };

    openGDSMUI = new OGDSM.UI(openGDSMObj);
    console.log(openGDSMUI);
    this.createVWorldUI = function () {
        openGDSMUI.VWorldWMS('vworldList');
        openGDSMUI.setVWorldKey('9E21E5EE-67D4-36B9-85BB-E153321EEE65');
        //openGDSM.wmsMapUI.vworld('vworldList',vWorldKey,'http://localhost',Map.map);
    };

});
