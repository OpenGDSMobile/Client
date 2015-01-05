/*jslint devel: true */
/*global $, jQuery, ol*/
/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};

OGDSM = (function (window, ol) {
    "use strict";
    var map;
    OGDSM = function (map) {
        this.map = map;
    };

    OGDSM.prototype = {
        constructor : OGDSM,
        version : "1.0"
    };
    return OGDSM;
}(window, jQuery));

/**
 *
 *
 */
OGDSM.prototype.getMap = function () {
    "use strict";
    return this.map;
};
/**
 *
 *
 */
OGDSM.prototype.changeBaseMap = function (mapStyle) {
    "use strict";
    var TMS,
        map = this.map,
        maplayers = map.getLayers();

    maplayers.forEach(function (obj, i) {
        var layerTitle = obj.get('title');
        if (layerTitle === 'basemap') {
            map.removeLayer(obj);
        }
    });
    if (mapStyle === 'OSM') {
        TMS = new ol.source.OSM();
    } else if (mapStyle === 'VWorld') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
        }));
    } else {
        console.log('Not Map Style');
    }
    map.addLayer(new ol.layer.Tile({
        title : 'basemap',
        source : TMS
    }));
};

OGDSM.ns = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;

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
