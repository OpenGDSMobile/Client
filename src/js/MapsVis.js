

/**
 * Created by intruder on 16. 6. 22.
 */

goog.provide('openGDSMobile.MapVis');
goog.require('openGDSMobile.util.applyOptions');

/**
 * @constructor
 */
openGDSMobile.MapVis = function (_mapDIV, _options) {
    _options = (typeof (options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        lat: 37.582200,
        long: 127.010031,
        mapType: 'OSM',
        baseProj: 'EPSG:3857',
        zoom: 12,
        maxZoom : 17,
        minZoom : 5,
        list : null,
        attribute : null,
        indexedDB : true
    };

    this.mapDIV = _mapDIV;
    this.geoLocation = null;
    this.featureOverlay = null;
    this.attrObj = null;
    this.listObj = null;

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);


    if (options.attribute !== null) {
        //this.attrObj =
    }
    if (options.list !== null) {
        //this.listObj =
    }

    if (typeof (ol) === 'undefined') {
        console.error("Not Import OpenLayers 3 Library....");
        return -1;
    }

    var baseView = new ol.View({
        projection : ol.proj.get(options.baseProj),
        center : ol.proj.transform([options.long, options.lat], 'EPSG:4326', options.baseProj),
        zoom : options.zoom,
        maxZoom : options.maxZoom,
        minZoom : options.minZoom
    });
    this.mapObj = new ol.Map({
        target : _mapDIV,
        layers : [
            new ol.layer.Tile({
                title : 'backgroundMap',
                source : new ol.source.OSM()
            })
        ],
        view : baseView
    });
}