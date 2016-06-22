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
        maxZoom : 18,
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

/**
 * 배경지도 변경
 * @param {String} mapStyle - 지도 스타일 이름 ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
 */
openGDSMobile.MapVis.prototype.changeBgMap = function (_mapType) {
    if (typeof (_mapType) === 'undefined' ) {
        console.error('Input map type parameter');
        return -1;
    }
    var bgMapLayers = this.mapObj.getLayers();
    var center = this.mapObj.getView().getCenter();
    var zoom = this.mapObj.getView().getZoom();
    var proj = this.mapObj.getView().getProjection();
    var bgMapLayer = null;
    bgMapLayers.forEach(function(_obj, _i){
        var title = _obj.get('title');
        if (title === 'backgroundMap') {
            bgMapLayer = _obj;
        }
    });
    var view = new ol.View({
        projection : proj,
        center : center,
        zoom : zoom,
        maxZoom : 18,
        minZoom : 5
    });
    this.mapObj.setView(view);
    if (_mapType === 'OSM') {
        bgMapLayer.setSource(new ol.source.OSM());
    } else if (_mapType === 'VWorld') {
        bgMapLayer.setSource(
            new ol.source.XYZ(({
                url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
            }))
        );
    }

    /*
     if (mapStyle === 'OSM') {
     TMS = new ol.source.OSM();
     view = new ol.View({
     projection : mapProj,
     center : mapCenter,
     zoom : mapZoom
     });
     } else if (mapStyle === 'VWorld') {
     TMS = new ol.source.XYZ(({
     url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
     }));
     view = new ol.View({
     projection : mapProj,
     center : mapCenter,
     zoom : mapZoom,
     maxZoom : 18,
     minZoom : 6
     });
     } else if (mapStyle === 'VWorld_s') {
     TMS = new ol.source.XYZ(({
     url : "http://xdworld.vworld.kr:8080/2d/Satellite/201301/{z}/{x}/{y}.jpeg"
     }));
     view = new ol.View({
     projection : mapProj,
     center : mapCenter,
     zoom : mapZoom,
     maxZoom : 18,
     minZoom : 6
     });
     } else if (mapStyle === 'VWorld_g') {
     TMS = new ol.source.XYZ(({
     url : "http://xdworld.vworld.kr:8080/2d/gray/201411/{z}/{x}/{y}.png"
     }));
     view = new ol.View({
     projection : mapProj,
     center : mapCenter,
     zoom : mapZoom,
     maxZoom : 18,
     minZoom : 6
     });
     } else if (mapStyle === 'VWorld_m') {
     TMS = new ol.source.XYZ(({
     url : "http://xdworld.vworld.kr:8080/2d/midnight/201411/{z}/{x}/{y}.png"
     }));
     view = new ol.View({
     projection : mapProj,
     center : mapCenter,
     zoom : mapZoom,
     maxZoom : 18,
     minZoom : 6
     });
     } else if (mapStyle === '') {
     TMS = null;
     view = new ol.View({
     projection : mapProj,
     center : mapCenter,
     zoom : mapZoom,
     maxZoom : 18,
     minZoom : 6
     });
     }
     */
};



/**
 * WMS 및 WFS 맵 레이어 추가
 * @param {Object} data - 오픈레이어3 지도 객체
 */
openGDSMobile.MapVis.prototype.addLayer = function (_type, _data) {
    if (typeof (openGDSMobile.util.getOlLayer(this.mapObj, _data.get('title'))) === false) {
        console.error('Layer is existence');
        return -1;
    }
    this.mapObj.addLayer(_data);
};
////////// 이벤트 ...
////////// 스타일 최초 설정 및 변경...
////////// 레이어 삭제 ...
////////// 레이어 시각화 여부 설정


/**
 * 지도 GPS 트래킹
 * @param {boolean} sw - Geolocation 스위치 (true | false)
 **/
openGDSMobile.MapVis.prototype.trackingGeoLocation = function (_sw) {
    'use strict';
    var location = this.geoLocation
    if (location === null) {
        location = new ol.Geolocation({
            projection:	this.mapObj.getView().getProjection(),
            tracking : true
        });
    }
    if (sw === true) {
        location.once('change:position', function () {
            this.mapObj.getView().setCenter(location.getPosition());
        });
    } else {
        location.un('change:position');
    }
};