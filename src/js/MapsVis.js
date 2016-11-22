goog.provide('openGDSMobile.MapVis');
goog.require('openGDSMobile.util.applyOptions');



/**
 * @constructor
 * @param {String} _mapDIV - 지도 DIV 객체
 * @param {Object} _options - 지도 관련 옵션 (JSON 객체)
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

    /**
     * @type {boolean} GPS 객체
     * @private
     */
    this.geoLocation = false;

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

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

    /**
     * @type {ol.Map} OpenLayers 지도 객체
     * @private
     */
    this.mapObj = new ol.Map({
        target : _mapDIV,
        layers : [baseLayer],
        view : baseView
    });
    this.baseProj = options.baseProj;


    proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs");
}

/**
 * 지도 객체 호출 함수
 * @returns {ol.Map} OpenLayers 3 지도 객체
 */
openGDSMobile.MapVis.prototype.getMapObj = function () {
    return this.mapObj;
};

/**
 * 지도 좌표계 호출
 * @returns {string|*}
 */
openGDSMobile.MapVis.prototype.getBaseProj = function () {
    return this.baseProj;
}


/**
 * 텍스트 스타일 적용 함수
 * @private
 * @param {ol.Feature} feature  Vector 단위 객체
 * @param {Number} resolution 지도 해상도
 * @param {String }attrKey 속성정보 키값
 * @returns {ol.style.Text} OpenLayers 3 텍스트 스타일 객체
 */
openGDSMobile.MapVis.textStyleFunction = function (feature, resolution, attrKey) {
    return new ol.style.Text({
        text : resolution < 76 ? feature.get(attrKey) : ''
    });
};

/**
 * 스타일 적용 함수
 * @param {ol.Feature} feature  Vector 단위 객체
 * @param {Number} resolution 지도 해상도
 * @param {String} type 지도 타입(Polygon, Line, Point)
 * @param {Object} options 스타일 선 및 채우기 색상, 선 굵기, 속성 키 값 투명도  
 * @returns {ol.style.Style} OpenLayers 3 스타일 객체
 */
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
 * @param {String} _mapType - 지도 스타일 이름 (OSM | Stamen-water | VWorld)
 */
openGDSMobile.MapVis.prototype.changeBgMap = function (_mapType, _key) {
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
    } else if (_mapType === 'Stamen-water'){
      bgMapLayer.setSource(
        new ol.source.Stamen({
          layer: 'watercolor'
        })
      );
    } else if (_mapType === 'Stamen-terrain'){
      bgMapLayer.setSource(
        new ol.source.Stamen({
          layer: 'terrain'
        })
      );
    } else if (_mapType === 'Stamen-toner'){
      bgMapLayer.setSource(
        new ol.source.Stamen({
          layer: 'toner'
        })
      );
    } else if (_mapType === 'VWorld') {
        bgMapLayer.setSource(
            new ol.source.XYZ(({
                url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
            }))
        );
    } else if (_mapType === 'korSeoulMap') {
      var proj5179 = new ol.proj.Projection({code : "EPSG:5179"});
      var korNorMap = openGDSMobile.util.seoulMapInfo.tileMapInfos.tileMapInfo[15];
      var tileGridObj = new ol.tilegrid.TileGrid({
        origin : [korNorMap.originX, korNorMap.originY],
        extent: [korNorMap.mbr.minx, korNorMap.mbr.miny, korNorMap.mbr.maxx, korNorMap.mbr.maxy],
        resolutions: [128,64,32,16,8,4,2,1,0.5,0.25],
        tileSize : [256, 256]
      });

      //proj5179.setDefaultTileGrid(tileGridObj);
      if (typeof (_key) === 'undefined' ) {
        console.error('must map key parameter');
        return -1;
      }
      var mapUrlBase =
        'http://map.seoul.go.kr/smgis/apps/mapsvr.do?cmd=getTileMap&key='
        + _key
        + '&URL=';
      var xyz = new ol.source.XYZ({
        projection: proj5179,
        tileUrlFunction : function (coordinate, pixelRatio, projection) {
          var url = mapUrlBase + korNorMap.url;
          var z = coordinate[0];
          var x = coordinate[1];
          var y = ((coordinate[2]));
          var xHalf = parseInt(x / 50);
          var yHalf = parseInt(y / 50);
          url = url + z + '/' + xHalf + '/' + yHalf + '/' + x + '_' + y + '.png';
          return url;
        },
        tileGrid : tileGridObj
      });
      var center = ol.proj.fromLonLat([ 127.00767, 37.55720]);
      var view = new ol.View({
        center: center,
        minZoom : 10,
        maxZoom : 19,
        zoom: zoom,
        extent : ol.proj.transformExtent(
          [korNorMap.mbr.minx, korNorMap.mbr.miny, korNorMap.mbr.maxx, korNorMap.mbr.maxy],
          "EPSG:5179", "EPSG:3857")
      });
      this.mapObj.setView(view);
      bgMapLayer.setSource(xyz);
    }
};


/**
 * 일반적인 지도 추가 함수
 * @param {Object}   _layerObj 레이어 객체
 * @param {String}      _type     레이어 타입 ('raster', 'image' ...)
 * @param {String}      _title    레이어 제목
 * @returns {*}
 */
openGDSMobile.MapVis.prototype.addLayer = function (_layerObj, _type, _title) {

    _layerObj.set('type', _type);
    _layerObj.set('title', _title);

    this.mapObj.addLayer(_layerObj);
    return _layerObj;
};


/**
 * GeoJSON 레이어 추가
 * @param {Object} _geoJSON 벡터 GeoJSON 객체
 * @param {String} _type 벡터 타입 (Point | Line | Polygon)
 * @param {String} _title 레이어 제목
 * @param {Object} _options 속성 값, 색상 채우기, 선 색상, 선 너비, 투명도 값 설정
 */
openGDSMobile.MapVis.prototype.addGeoJSONLayer = function (_geoJSON, _type, _title, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        attrKey : null,
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        strokeWidth : 1,
        radius : 5,
        opt : 0.7,
        dataProj : 'EPSG:3857'
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    var baseProj = this.getBaseProj();

    
    var geoJSONLayer;
    geoJSONLayer = new ol.layer.Vector({
        title: _title,
        source : new ol.source.Vector({
            features : (new ol.format.GeoJSON()).readFeatures(_geoJSON, {
                dataProjection : options.dataProj,
                featureProjection : baseProj
            })
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
    var id = null;
    if (typeof(_geoJSON.features[0].id) === 'undefined'){
        id = _title;
    } else {
        id = _geoJSON.features[0].id.split('.')[0]
    }
    var extent = geoJSONLayer.getSource().getExtent();
    var center = new Array(2);
    center[0] = (extent[0] + extent[2]) / 2;
    center[1] = (extent[1] + extent[3]) / 2;
    this.mapObj.getView().setCenter(center);
    ++openGDSMobile.geoJSONStatus.length;
    openGDSMobile.geoJSONStatus.objs.push({
        layerName : _title,
        attrKey : options.attrKey,
        type : _type,
        id : id,
        obj : _geoJSON
    });
    return geoJSONLayer;
};


/**
 * 벡터 스타일 변경
 * @param {String} _layerName - 시각화 된 레이어 제목
 * @param {Object} options - 옵션 JSON 객체 키 값 <br>
 *     {
 *       fillColor : '#FFFFFF',
 *       strokeColor : '#000000',
 *       radius : 5,
 *       strokeWidth : 1,
 *       opt : 0.7,
 *       attrKey : null,
 *       range : null,
 *       labelKey : null,
 *       valueKey : null,
 *       data : null
 *     }
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
                    for (i = 0; i < options.data.length; i += 1) {
                     //   if (text == options.data[i][options.labelKey]) {
                        if (text.indexOf(options.data[i][options.labelKey]) != -1) {
                            for (j = 0; j < options.range.length; j += 1) {
                                if (options.data[i][options.valueKey] <= options.range[j]){
                                    tmpColor = options.fillColor[j];
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    console.error('Color is not array.')
                }
                var tmpOpt = {
                  fillColor : tmpColor,
                  strokeColor : options.strokeColor,
                  radius : options.radius,
                  strokeWidth : options.strokeWidth,
                  opt : options.opt,
                  attrKey : options.attrKey,
                };
                styleCache[text] = [openGDSMobile.MapVis.styleFunction(feature, resolution, type, tmpOpt)];
            }
            return styleCache[text];
        }
    });
    layerObj.setOpacity(options.opt);
};

/**
 * 맵 레이어 삭제
 * @param {String} _layerName 레이어 제목
 */
openGDSMobile.MapVis.prototype.removeLayer = function (_layerName) {
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is not existence');
        return -1;
    }
    this.mapObj.removeLayer(layerObj);
    //--openGDSMobile.geoJSONStatus;
    if (openGDSMobile.geoJSONStatus.removeContentLayerName(_layerName) != false){
        openGDSMobile.geoJSONStatus.length--;

    }

    //////////////////////////
     if (typeof (this.layerListObj) !== 'undefined') {
        this.layerListObj.removeList(layerName);
     }

}



/**
 * 맵 레이어 시각화 여부
 * @param {String} _layerName - 레이어 이름
 * @param {Boolean} _flag - 시각화 값 설정 [true | false}
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
 * @param {String} _imgURL 이미지 주소
 * @param {String} _imgTitle - 이미지 타이틀
 * @param {Object} _options - 옵션
 * {
 *       opt : 0.7,
 *       extent : [],       [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top]
 *       size: [256,256]    [width, height]
 * }
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
 * @param {Boolean} sw - Geolocation 설정
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

/**
 * 지도 확대
 */
openGDSMobile.MapVis.prototype.zoomIn = function () {
  'use strict';
  var view = this.mapObj.getView();
  var newZoom = 0.5;
  var zoom = ol.animation.zoom({
    resolution : this.mapObj.getView().getResolution()
  });
  this.mapObj.beforeRender(zoom);
  this.mapObj.getView().setResolution(this.mapObj.getView().getResolution() * newZoom);
}

/**
 * 지도 축소
 */
openGDSMobile.MapVis.prototype.zoomOut = function () {
  'use strict';
  var view = this.mapObj.getView();
  var newZoom = 2;
  var zoom = ol.animation.zoom({
    resolution : this.mapObj.getView().getResolution()
  });
  this.mapObj.beforeRender(zoom);
  this.mapObj.getView().setResolution(this.mapObj.getView().getResolution() * newZoom);
}
/**
 * 레이어 속성 정보 받아오기
 * @param _layerName
 * @returns {Array}
 */
openGDSMobile.MapVis.prototype.getAttribute = function (_layerName) {
  var layer = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
  if (layer ==false){
    console.error('Not exist layer');
  }
  var obj = layer.getSource().getFeatures()[0];
  obj = obj.getProperties();
  var keys = [];
  for (var k in obj) {
    if (k !== 'geometry') {
      keys.push(k);
    }
  }
  return keys;
}


goog.exportSymbol('openGDSMobile.MapVis', openGDSMobile.MapVis);