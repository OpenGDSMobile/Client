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

    this.geoLocation = null;
    this.featureOverlay = null;
    this.attrObj = null;
//    this.mapDIV = _mapDIV;
//    this.listObj = null;

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
    var baseLayer = new ol.layer.Tile({
            title : 'backgroundMap',
            source : new ol.source.OSM(),
    });
    baseLayer.setZIndex(0);
    this.mapObj = new ol.Map({
        target : _mapDIV,
        layers : [baseLayer],
        view : baseView
    });
}


openGDSMobile.MapVis.textStyleFunction = function (feature, resolution, attrKey) {
    return new ol.style.Text({
        text : resolution < 76 ? feature.get(attrKey) : ''
    });
};

openGDSMobile.MapVis.styleFunction = function (feature, resolution, type, options) {
    if (type === 'polygon') {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: options.strokeColor,
                width: options.strokeWidth
            }),
            fill: new ol.style.Fill({
                color: options.fillColor
            }),
            text: openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
        });
    } else if (type === 'line') {

    } else if (type === 'point') {
        return new ol.style.Style({
            image : new ol.style.Circle({
                radius : options.radius,
                stroke : new ol.style.Stroke({
                    color: options.strokeColor,
                    width: options.strokeWidth
                }),
                fill : new ol.style.Fill({
                    color : options.fillColor
                }),
                text: openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
            })
        })
    }
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
        radius : 5,
        opt : 0.7
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var geoJSONLayer;
    geoJSONLayer = new ol.layer.Vector({
        title: _title,
        source : new ol.source.Vector({
            features : (new ol.format.GeoJSON()).readFeatures(_geoJSON)
        }),
        style : (function (feature, resolution) {
            return openGDSMobile.MapVis.styleFunction(feature, resolution, _type , options);
        })
    });
    geoJSONLayer.set('type', _type);
    geoJSONLayer.set('attrKey', options.attrKey);
    geoJSONLayer.set('fillColor', options.fillColor);
    geoJSONLayer.set('strokeColor', options.strokeColor);
    geoJSONLayer.set('strokeWidth', options.strokeWidth);
    geoJSONLayer.set('opt', options.opt);
    if (typeof (openGDSMobile.util.getOlLayer(this.mapObj, geoJSONLayer.get(_title))) === false) {
        console.error('Layer is not existence');
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
        radius : 5,
        strokeWidth : 1,
        opt : 0.7,
        attrKey : null,
        range : null,
        labelKey : null,
        valueKey : null,
        data : null
    }
    var styleCache = {};
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is existence');
        return -1;
    }
    defaultOptions.attrKey = layerObj.get('attrKey');
    defaultOptions.fillColor = layerObj.get('fillColor');
    defaultOptions.strokeColor = layerObj.get('strokeColor');
    defaultOptions.strokeWidth = layerObj.get('strokeWidth');
    defaultOptions.opt = layerObj.get('opt');
    var type = layerObj.get('type');
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    layerObj.set('attrKey', options.attrKey);
    layerObj.set('fillColor', options.fillColor);
    layerObj.set('strokeColor', options.strokeColor);
    layerObj.set('strokeWidth', options.strokeWidth);
    
    layerObj.setStyle(function(feature, resolution){
        if (options.data === null) {
            return openGDSMobile.MapVis.styleFunction(feature, resolution, type, options);
        } else {
            var i, j;
            var tmpColor = '#FFFFFF';
            var text = resolution < 76 ? feature.get(options.attrKey) : '';
            if (!styleCache[text]){
                if (Array.isArray(options.fillColor)) {
                    for (i = 0; i < data.length; i += 1) {
                        if (text == data[i][options.labelKey]) {
                            for (j = 0; j < options.range.length; j += 1) {
                                if (data[i][options.valueKey] <= options.range[j]){
                                    tmpColor = options.fillColor[j];
                                }
                            }
                        }
                    }
                } else {
                    console.error('Color is not array.')
                }
                styleCache[text] = [openGDSMobile.MapVis.styleFunction(feature, resolution, type, options)];
            }
            return styleCache[text];
        }
    });
    layerObj.setOpacity(options.opt);
};
////////// 이벤트 ...
////////// 레이어 삭제 ...
////////// 레이어 시각화 여부 설정


/**
 * 맵 레이어 삭제
 * @param {String} layerName - 레이어 이름
 */
openGDSMobile.MapVis.prototype.removeLayer = function (_layerName) {
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is not existence');
        return -1;
    }
    this.mapObj.removeLayer(layerObj);
    /*
     if (typeof (this.layerListObj) !== 'undefined') {
        this.layerListObj.removeList(layerName);
     }
     */
}



/**
 * 맵 레이어 시각화 여부
 * @param {String} layerName - 레이어 이름
 * @param {Boolean} flag - 시각화 스위치 [true | false}
 */
openGDSMobile.MapVis.prototype.setVisible = function (_layerName, _flag) {
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is not existence');
        return -1;
    }
    layerObj.setVisible(_flag);

};


/**
 * 이미지 레이어 시각화
 * @param {String} imgURL - 이미지 주소
 * @param {String} imgTitle - 이미지 타이틀
 * @param {Array} imgSize - 이미지 사이즈 [width, height]
 * @param {Array} imgExtent - 이미지 위치 [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top]
 */
openGDSMobile.MapVis.prototype.addImageLayer = function (_imgUrl, _imgTitle, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        opt : 0.7,
        extent : [],
        size: 256
    }
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var imgLayer = new ol.layer.Image({
        opacity : options.opt,
        title : _imgTitle,
        source : new ol.source.ImageStatic({
            url : _imgUrl + '?' + Math.random(),
            imageSize : options.size,
            projection : this.mapObj.getView().getProjection(),
            imageExtent : options.extent
        })
    });

    this.mapObj.addLayer(imgLayer);
}
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