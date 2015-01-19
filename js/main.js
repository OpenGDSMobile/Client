/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
var WEBAPP = WEBAPP || {};
WEBAPP = (function ($) {
    'use strict';
    var map, divName, minResolution = null,
        windowOrientation = null,
        deviceOrientation = null;
    WEBAPP = function () {

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
WEBAPP.prototype.mapInit = function (divName) {
    'use strict';
    var map, obj;
    obj = this;
    map = new ol.Map({
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
    return map;
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
WEBAPP.prototype.adjustedHeading = function (heading) {
    'use strict';
	if (this.windowOrientation !== undefined) {
		// include window orientation (0, 90, -90 or 180)
		heading -= this.windowOrientation * Math.PI / 180.0;
	}
	return heading;
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
//    map = this.map;
    obj = this;
	obj.updateLayout();
	$(window).on('resize', function () {
		obj.updateLayout();
	});
    /*
	$(window).on('orientationchange', function (e) {
        obj.setWindowOrientation(window.orientation);
	});
    */
	projection = new ol.proj.Projection({
		extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		units : 'm'
	});
	ol.proj.addProjection(projection);

    map = this.mapInit('map');
    this.map = map;
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
    /*
	$(map.getViewport()).bind('tap', function (evt) {
		var pixel = map.getEventPixel(evt.originalEvent);
	//	Layer.displayFeatureInfo(pixel);
	});
    */
	this.updateLayout();
};

var styleChange = function (obj) {
    'use strict';
	$('#wmsButton').attr('data-layer', $(obj).attr('value'));
};
//            addr = 'http://113.198.80.9/OpenGDSMobileApplicationServer1.0';
//            addr = 'http://61.102.113.183:8080/mobile';
$(document).ready(function (e) {
    'use strict';
    var webAppObj,
        checked,
        layersArr,
        addr = 'http://61.106.113.122:8080',
//        addr = 'http://113.198.80.60:8087',
//      addr = 'http://113.198.80.9',
        geoServerAddr = 'http://113.198.80.60/',
        folderName = '/mobile',
//      folderName = '/OpenGDSMobileApplicationServer1.0',

        openGDSMObj,
        uiObj,

        vworldList,
        vworldProcessBtn,

        mapList,
        
        EnvVis,
        EnvDate,
        EnvTime,
        EnvType,
        EnvArea,
        ProcessBtn,

        externalServer;

    webAppObj = new WEBAPP();
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


    openGDSMObj = new OGDSM.visualization(webAppObj.getMap());
    this.baseMap = function (style) {
        openGDSMObj.changeBaseMap(style);
    };

    uiObj = new OGDSM.eGovFrameUI();
    this.createVWorldUI = function () {
        var selectedData = "", VWorldWMSData;
        externalServer.changeServer("vworldWMS");
        vworldList = uiObj.vworldWMSCheck('vworldList');
        vworldProcessBtn = uiObj.processButton('vworldList');
        vworldProcessBtn.click(function () {
            vworldList.each(function (i) {
                if ($(this).is(":checked")) {
                    selectedData += $(this).attr("value");
                    selectedData += ",";
                }
            });
            selectedData = selectedData.slice(0, -1);
            externalServer.setData("9E21E5EE-67D4-36B9-85BB-E153321EEE65", "http://localhost", selectedData);
            VWorldWMSData = externalServer.dataLoad();

            webAppObj.getMap().addLayer(VWorldWMSData);
        });
    };
    //113.198.80.60/OpenGDSMobileApplicationServer1.0/
    externalServer = new OGDSM.externalConnection('vworldWMS');
    this.getLayers = function () {
        externalServer.changeServer("geoServer", addr + folderName + "/getLayerNames.do");
        externalServer.setSubName("getLayers");
        externalServer.setData("opengds");
        checked = externalServer.dataLoad();
    };
    this.getLayers();
    this.viewWFSMap = function (str) {
        var wfsData;
        externalServer.changeServer("geoServer", geoServerAddr);
        externalServer.setSubName("WFS");
        externalServer.setData("opengds", str);
        checked = externalServer.dataLoad();
        //webAppObj.getMap().addLayer(wfsData);
        console.log(checked);
        if (checked === true) {
            openGDSMObj.addMap(externalServer.getResponseData());
        } else {
            console.log("error");
        }
        
    };
    this.createSeoulPublicAreaEnvUI = function () {
        $('#setting').empty();
        EnvVis = uiObj.visTypeRadio("setting");
        mapList = uiObj.mapListSelect("setting", externalServer.getResponseData());
        EnvDate = uiObj.dateInput("setting");
        EnvTime = uiObj.timeInput("setting");
        EnvType = uiObj.envTypeRadio("setting");
        ProcessBtn = uiObj.processButton("setting");
        ProcessBtn.click(function () {
            var apikey = "6473565a72696e7438326262524174",
                visType = $('input[name=' + EnvVis + ']:checked').val(),
                envType = $('input[name=' + EnvType + ']:checked').val(),
                mapType = $("#" + mapList + " option:selected").text(),
                date = EnvDate.val(),
                time = EnvTime.val(),
                mapName = "",
                resultData = null,
                attribute = null,
                xyData = null,
                range = null,
                /** AirKorea information **/
                colors = ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
                ranges = [ [15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                          [1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                          [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                          [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                          [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
            if (visType === 'map') {
                mapName = $('#' + mapList + ' option:selected').text();
            }
            $('#setting').popup("close");
            externalServer.changeServer("publicData", addr + folderName + '/SeoulOpenData.do');
            externalServer.setSubName("TimeAverageAirQuality");
            externalServer.setData(apikey, envType, date, time);
            checked = externalServer.dataLoad();
            if (checked === true) {
                console.log(externalServer.getResponseData());
                xyData = OGDSM.jsonToArray(externalServer.getResponseData(), envType, 'MSRSTE_NM');
                if (envType === "PM10" || envType === "PM25") {
                    range = ranges[0];
                } else if (envType === "CO") {
                    range = ranges[1];
                } else if (envType === "NO2") {
                    range = ranges[2];
                } else if (envType === "SO2") {
                    range = ranges[3];
                } else if (envType === "O3") {
                    range = ranges[4];
                }
                if (visType === 'chart') {
                    openGDSMObj.barChart("d3View", xyData, range, colors);
                    setTimeout(function () {
                        $('#dataSelect').popup('open');
                    }, 2000);
                } else if (visType === 'map') {
                    console.log(mapType);
                    if (mapType === 'Seoul_si' || mapType === 'Seoul_dong') {
                        attribute = 'SIG_KOR_NM';
                    } else {
                        attribute = 'EMD_KOR_NM';
                    }
                    resultData = externalServer.geoServerWFS(geoServerAddr, "opengds", mapType);
                    openGDSMObj.addMap(resultData);
                    openGDSMObj.changeWFSStyle(mapType, colors, 0.6, attribute, range, xyData);
                }
            } else {
                console.log("error");
            }
        });
    };
    this.createSeoulPublicRoadEnvUI = function () {
        $('#setting').empty();
        EnvVis = uiObj.visTypeRadio("setting", false);
        EnvType = uiObj.envTypeRadio("setting");
        ProcessBtn = uiObj.processButton("setting");
        ProcessBtn.click(function () {
            console.log("test");
        });
    };
    this.createPublicPortalUI = function () {
        var xyData,
            range = null;
        $('#setting').empty();
        EnvVis = uiObj.visTypeRadio("setting");
        mapList = uiObj.mapListSelect("setting", externalServer.getResponseData());
        EnvArea = uiObj.areaTypeRadio("setting");
        EnvType = uiObj.envTypeRadio("setting", "public");
        ProcessBtn = uiObj.processButton("setting");
        ProcessBtn.click(function () {
            var apikey = 'kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D',
                visType = $('input[name=' + EnvVis + ']:checked').val(),
                areaType = $('input[name=' + EnvArea + ']:checked').val(),
                envType = $('input[name=' + EnvType + ']:checked').val(),
                mapType = $("#" + mapList + " option:selected").text(),
                resultData = null,
                attribute = null,
                xyData = null,
                /** AirKorea information **/
                colors = ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
                ranges = [ [15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                          [1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                          [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                          [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                          [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
            $('#setting').popup("close");
            externalServer.changeServer("publicData", addr + folderName + '/PublicDataPortal.do');
            externalServer.setSubName("ArpltnInforInqireSvc");
            externalServer.setData(apikey, envType, areaType);
            checked = externalServer.dataLoad();
            if (checked === true) {
                console.log(externalServer.getResponseData());
                xyData = OGDSM.jsonToArray(externalServer.getResponseData(), envType, 'stationName');
                if (envType === "pm10Value" || envType === "pm25Value") {
                    range = ranges[0];
                } else if (envType === "coValue") {
                    range = ranges[1];
                } else if (envType === "no2Value") {
                    range = ranges[2];
                } else if (envType === "so2Value") {
                    range = ranges[3];
                } else if (envType === "o3Value") {
                    range = ranges[4];
                }
                if (visType === 'chart') {
                    openGDSMObj.barChart("d3View", xyData, range, colors);
                    setTimeout(function () {
                        $('#dataSelect').popup('open');
                    }, 2000);
                } else if (visType === 'map') {
                    console.log(mapType);
                    if (mapType === 'Seoul_si' || mapType === 'Seoul_dong') {
                        attribute = 'SIG_KOR_NM';
                    } else {
                        attribute = 'EMD_KOR_NM';
                    }
                    resultData = externalServer.geoServerWFS(geoServerAddr, "opengds", mapType);
                    openGDSMObj.addMap(resultData);
                    openGDSMObj.changeWFSStyle(mapType, colors, 0.6, attribute, range, xyData);
                   // openGDSMObj.changeWFSStyle(mapType, '#ffffff', 0.5, attribute, range, xyData);
                }
            } else {
                console.log("error");
            }
        });
    };
});
