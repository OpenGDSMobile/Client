/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
/**
* OpenLayers3 Map Control Class
* @class OGDSM.olMap
* @constructor
* @param {ol.Map} map
*/

OGDSM.namesapce('olMap');
(function (ol, OGDSM) {
    "use strict";
    /**
     * OGDSM Constructor OpenLayers3
     */
    OGDSM.olMap = function (map) {
        this.map = map;
    };
    OGDSM.olMap.prototype = {
        constructor : OGDSM.olMap,
        version : "1.0"
    };
    return OGDSM.olMap;
}(ol, OGDSM));
/**
 * changeBaseMap Method is base map Change.
 * @method changeBaseMap
 * @param {String} mapStyle ('VWorld' or 'OSM')
 */
OGDSM.olMap.prototype.changeBaseMap = function (mapStyle) {
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
/**
 * getMap Method get map object about OpenLayers3.
 * @method getMap
 * @return {ol.Map} Retrun is OpenLayers object.
 */
OGDSM.olMap.prototype.getMap = function () {
    "use strict";
    return this.map;
};
