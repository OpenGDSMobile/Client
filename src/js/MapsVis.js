goog.provide('openGDSMobile.MapVis');
goog.require('openGDSMobile.util.applyOptions');

/**
 * @constructor
 * @param {String} _mapDIV - 지도 DIV 객체
 * @param {Object} _options - 지도 관련 옵션 (JSON 객체)
 * {
 *
 * }
 */
openGDSMobile.MapVis = function (_mapDIV, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
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


openGDSMobile.MapVis.textStyleFunction = function (feature, resolution, attrKey) {
    return new ol.style.Text({
        text : resolution < 76 ? feature.get(attrKey) : ''
    });
};

openGDSMobile.MapVis.styleFunction = function (feature, resolution, options) {

    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color : options.strokeColor,
            width : options.strokeWidth
        }),
        fill : new ol.style.Fill({
            color : options.fillColor
        }),
        text : openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
    });
}


/**
 * 배경지도 변경
 * @param {String} _mapType - 지도 스타일 이름 (OSM | VWorld)
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
};

/**
 * GeoJSON 레이어 추가
 * @param {Object} _geoJSON - 벡터 GeoJSON 객체
 * @param {String} _type - 벡터 타입 (Point | Line | Polygon)
 * @param {String} _title - 레이어 제목
 * @param {Object} _options -
 */
openGDSMobile.MapVis.prototype.addGeoJSONLayer = function (_geoJSON, _type, _title, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        attrKey : null,
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        strokeWidth : 1,
        opt : 0.7
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var geoJSONLayer;
    geoJSONLayer = new ol.layer.Vector({
        title: 'seoul_vector',
        source : new ol.source.Vector({
            features : (new ol.format.GeoJSON()).readFeatures(_geoJSON)
        }),
        style : (function (feature, resolution) {
            return openGDSMobile.MapVis.styleFunction(feature, resolution, options);
        })
    });
    geoJSONLayer.set('type', _type);
    if (typeof (openGDSMobile.util.getOlLayer(this.mapObj, geoJSONLayer.get(_title))) === false) {
        console.error('Layer is existence');
        return -1;
    }
    geoJSONLayer.setOpacity(options.opt);
    this.mapObj.addLayer(geoJSONLayer);
};

/**
 * 벡터 스타일 변경
 * @param {String} layerName - 오픈레이어3 레이어 이름
 * @param {Object} colors - 변경할 색상(Hex Color, String or Array)
 * @param {Object} options - 옵션 JSON 객체 키 값 <br>
 *     {type:'polygon', opt : '0.5', attr: null, range: null, xyData: null}<br>
 <ul>
 <li>type(String) : 객체 타입 (polygon, point)</li>
 <li>opt(Number) : 레이어 투명도 </li>
 <li>attr(String) : 속성 이름</li>
 <li>range(Array) : 색상 범위</li>
 <li>xyData(Array) : 색상 데이터</li>
 </ul>
 */
openGDSMobile.MapVis.prototype.changeVectorStyle = function (_layerName, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        strokeWidth : 1,
        opt : 0.7,
        attrKey : null,
        range : null,
        labelKey : null,
        valueKey : null,
        data : null
    }
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is existence');
        return -1;
    }
    console.log("test");
    layerObj.setStyle(function(feature, resolution){
        if (options.data === null) {
            return openGDSMobile.MapVis.styleFunction(feature, resolution, options);
        }

    });
};
/*

 var i,
 j,
 color = '#FFFFFF',
 text = r < 5000 ? f.get(defaults.attr) : '';
 if (!styleCache[text]) {
 if (Array.isArray(colors)) {
 for (i = 0; i < data.length; i += 1) {
 if (text === data[i][defaults.labelKey]) {
 for (j = 0; j < defaults.range.length; j += 1) {
 if (data[i][defaults.valueKey] <= defaults.range[j]) {
 color = colors[j];
 break;
 }
 }
 }
 }
 } else {
 color = colors;
 }
 if (defaults.type === 'polygon') {
 styleCache[text] = [new ol.style.Style({
 fill : new ol.style.Fill({
 color : color
 }),
 stroke : new ol.style.Stroke({
 color : '#00000',
 width : 1
 }),
 text : new ol.style.Text({
 font : '9px Calibri,sans-serif',
 text : text,
 fill : new ol.style.Fill({
 color : '#000000'
 })
 })
 })];
 } else if (defaults.type === 'point') {
 styleCache[text] = [new ol.style.Style({
 image : new ol.style.Circle({
 radius : 5,
 fill : new ol.style.Fill({
 color : color
 }),
 stroke : new ol.style.Stroke({
 color : '#000000',
 width : 1
 })
 })
 })];
 }


 }
 return styleCache[text];
 */
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