/*jslint devel: true, vars : true */
/*global $, jQuery, ol*/
/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM Super Class.<br>
* --
* Classes
*  - eGovFrameUI
*  - externalConnection
*  - olMap
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    'use strict';
    /**
    * OGDS Mobile Layout / Map Setting Super Class
    * @class OGDSM
    * @constructor
    */
    OGDSM = function (mapDiv) {
        this.updateLayoutSetting(mapDiv);
        this.mapDiv = mapDiv;
        this.geoLocation = null;
        OGDSM = this;
        $(window).on('resize', function () {
            OGDSM.updateLayoutSetting();
        });
        // Orientation...
    };
    OGDSM.prototype = {
        constructor : OGDSM,
        version : '1.1'
    };
    return OGDSM;
}(window, jQuery));

/**
 * OGDSM Mobile Map View
 *
 *
 */
OGDSM.prototype.olMapView = function (latlng, baseProj, mapType) {
    'use strict';
    latlng = (typeof (latlng) !== 'undefined') ? latlng : [37.582200, 127.010031];
    mapType = (typeof (mapType) !== 'undefined') ? mapType : 'OSM';
    baseProj = (typeof (baseProj) !== 'undefined') ? baseProj : 'EPSG:3857';
    var map = null, baseMapLayer = null, geolocation;

    if (mapType === 'OSM') {
        baseMapLayer = new ol.source.OSM();
    } else if (mapType === 'VWorld') {
        baseMapLayer = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
        }));
    } else {
        console.error('Not Map Style "OSM" | "VWorld"');
        return null;
    }

    map = new ol.Map({
        target : this.mapDiv,
        layers : [
            new ol.layer.Tile({
                title : 'basemap',
                source : baseMapLayer
            })
        ],

        view : new ol.View({
            projection : ol.proj.get(baseProj),
            center : ol.proj.transform(latlng, 'EPSG:4326', baseProj),
            zoom : 15
        }),
        controls: []
    });
    this.mapObj = map;

 /*
    geolocation = new ol.Geolocation({
		projection:	map.getView().getProjection(),
		tracking : true
	});
    geolocation.once('change:position', function () {
		map.getView().setCenter(geolocation.getPosition());
	});
*/
    return map;
};
/**
 *
 *
 *
 **/
OGDSM.prototype.trackingGeoLocation = function () {
    'use strict';
    var geolocation, mapObj = this.mapObj;
    if (typeof (this.mapObj) === 'undefined') {
        console.error('Not Create Map!!');
        return null;
    }
    geolocation = new ol.Geolocation({
		projection:	mapObj.getView().getProjection(),
		tracking : true
	});

    geolocation.once('change:position', function () {
		mapObj.getView().setCenter(geolocation.getPosition());
	});

};
/**
 * OGDSM Mobile Screen Update Layout
 *
 *
 **/
OGDSM.prototype.updateLayoutSetting = function (mapDiv) {
    'use strict';
    mapDiv = (typeof (mapDiv) !== 'undefined') ? mapDiv : this.mapDiv;
    $('#' + mapDiv).width(window.innerWidth);
    $('#' + mapDiv).height(window.innerHeight);
    if (typeof (this.mapObj) !== 'undefined') {
        this.mapObj.updateSize();
    }

    /*******************/
    $("#d3View").attr('width', $(window).width() - 100);
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);
	//beforeProcess.popupSize("#dataSelect");
	//beforeProcess.popupSize("#vworldList", "300px");
	$('#layersList').css('height', $(window).height() - 400);
	$('#layersList').css("overflow-y", "auto");
    /********************/
};

/**
* OGDSM 'namespace' module(Create New Object)
*
* - Use
*       OGDSM.namesace('example');
* - Developer
*       OGDSM.example=(function(){
*         //Source Code
*       }());
*
* @module OGDSM.namespace
*/
OGDSM.namesapce = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;
    var test;

    if (parent[0] === 'OGDSM') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }
    return parent;
};
/**
 * OGDSM json to Array module 
 * - Use
 *       OGDSM.jsonToArray(jsonData, array[0], array[1]);
 *
 * @module OGDSM.jsontoArray
 */

OGDSM.jsonToArray = function (obj, x, y) {
    'use strict';
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
	xyAxis[1] = [];
    $.each(row, function (idx) {
        xyAxis[0].push(row[idx][x]);
        xyAxis[1].push(row[idx][y]);
    });
    return xyAxis;
};
