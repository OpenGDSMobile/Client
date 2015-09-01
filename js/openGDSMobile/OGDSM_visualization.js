/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3*/
OGDSM.namesapce('visualization');
(function (OGDSM) {
    "use strict";
    var mapObj;
    /**
     * 오픈레이어3 지도 시각화 객체
     * @class OGDSM.visualization
     * @constructor
     * @param {String} mapDiv - 지도 DIV 아이디 이름
     * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
    {layerListDiv:null, attrTableDiv:null, attrAddr:'', indexedDB:true}<br>
    layerListDiv : 레이어 관리 리스트 DIV<br>
    attrTableDiv : 속성 시각화 DIV 아이디 이름<br>
    attrAddr : 속성 시각화 서버 주소<br>
    indexedDB : 속성 정보 모바일 데이터베이스 저장 / 수정<br>
    */
    OGDSM.visualization = function (mapDiv, options) {
        options = (typeof (options) !== 'undefined') ? options : {};
        var name;
        this.updateLayoutSetting(mapDiv);
        this.mapDiv = mapDiv;
        this.geoLocation = null;
        OGDSM.visualization = this;
        var defaults = {
            layerListDiv : null,
            attrTableDiv : null,
            attrAddr : '',
            indexedDB : true
        };

        for (name in defaults) {
            if (defaults.hasOwnProperty(name)) {
                if (options.hasOwnProperty(name)) {
                    defaults[name] = options[name];
                }
            }
        }

        $(window).on('resize', function () {
            OGDSM.visualization.updateLayoutSetting();
        });
        if (defaults.attrTableDiv !== null) {
            this.attrTableObj = new OGDSM.attributeTable(defaults.attrTableDiv, defaults.attrAddr, this, defaults.indexedDB);
        }
        if (defaults.layerListDiv !== null) {
            this.layerListObj = new OGDSM.mapLayerList(this, defaults.layerListDiv, {
                attrObj : this.attrTableObj
            });
        }
        // Orientation...


    };
    OGDSM.visualization.prototype = {
        constructor : OGDSM.visualization,
        /**
         * 지도 객체 받기
         * @method getMap
         * @return {ol.Map} 오픈레이어3 객체
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * 지도 레이어 존재 여부 확인
         * @method layerCheck
         * @param {String} layerName - 레이어 이름
         * @return {OpenLayer3 Layer Object | Boolean} 레이어가 있을 경우 : 레이어 객체, 없을 경우 : false
         */
        layerCheck : function (layerName) {
            var i,
                maps = this.getMap().getLayers().getArray();
            for (i = 0; i < maps.length; i += 1) {
                if (maps[i].get('title') === layerName) {
                    return maps[i];
                }
            }
            return false;
        },
        /**
         * 지도 레이어 인덱스 값
         * @method indexOf
         * @param {ol3 layers object} layers - 레이어 객체
         * @return {Number} 레이어 인덱스 값
         */
        indexOf : function (layers, layer) {
            var length = layers.getLength(), i;
            for (i = 0; i < length; i++) {
                if (layer === layers.item(i)) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 속성정보 객체
         * @method getAttrObj
         * @return {attributeTable Object} 속성정보 객체
         */
        getAttrObj : function () {
            return this.attrTableObj;
        }
    };
    return OGDSM.visualization;
}(OGDSM));

/**
 * OpenGDS 모바일 맵 초기화
 * @method olMapView
 * @param {Array}  latlng  - 지도 초기 위,경도 값 (옵션) [default=[37.582200, 127.010031] ]
 * @param {String} mapType - 배경 지도 초기 값 (옵션) [default='OSM']
 * @param {String} baseProj  - 지도 투영 값 (옵션)   [default='EPSG:3857']
 * @return {ol.Map} openlayers3 ol.Map 객체
 */
OGDSM.visualization.prototype.olMapView = function (latlng, mapType, baseProj) {
    'use strict';
    latlng = (typeof (latlng) !== 'undefined') ? latlng : [37.582200, 127.010031];
    mapType = (typeof (mapType) !== 'undefined') ? mapType : 'OSM';
    baseProj = (typeof (baseProj) !== 'undefined') ? baseProj : 'EPSG:3857';
    var map = null, baseMapLayer = null, geolocation;
    var epsg5181 = new ol.proj.Projection({
        code : 'EPSG:5181',
        extent : [-219825.99, -535028.96, 819486.07, 777525.22],
        units : 'm'
    });
    var epsg5179 = new ol.proj.Projection({
        code : 'EPSG:5179',
        extent : [531371.84, 967246.47, 1576674.68, 2274021.31],
        units : 'm'
    });
    ol.proj.addProjection(epsg5181);
    ol.proj.addProjection(epsg5179);
    var baseView = new ol.View({
        projection : ol.proj.get(baseProj),
        center : ol.proj.transform(latlng, 'EPSG:4326', baseProj),
        zoom : 12,
        maxZoom : 18,
        minZoom : 6
    });
    map = new ol.Map({
        target : this.mapDiv,
        layers : [
            new ol.layer.Tile({
                title : 'basemap',
                source : baseMapLayer
            })
        ],
        view : baseView,
        controls: []
    });
    this.mapObj = map;
    this.baseProj = baseProj;
    this.changeBaseMap(mapType);
    this.mapObj.updateSize();
    return this.mapObj;
};


/**
 * 배경지도 변경
 * @method changeBaseMap
 * @param {String} mapStyle - 지도 스타일 이름 ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
 */
OGDSM.visualization.prototype.changeBaseMap = function (mapStyle) {
    "use strict";
    var TMS = null, view = null, baseLayer = null, map = this.mapObj, maplayers = map.getLayers(),
        mapCenter = map.getView().getCenter(), mapZoom = map.getView().getZoom(), mapProj = map.getView().getProjection();

    maplayers.forEach(function (obj, i) {
        var layerTitle = obj.get('title');
        if (layerTitle === 'basemap') {
            baseLayer = obj;
        }
    });
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
    } else {
        console.error('Not Map Style "OSM" | "VWorld" | "VWorld_m" | "VWorld_h"');
        return null;
    }
    if (baseLayer !== null) {
        map.setView(view);
        baseLayer.setSource(TMS);
    }
};

/**
 * 지도 GPS 트래킹 스위치
 * @method trackingGeoLocation
 * @param {boolean} sw - Geolocation 스위치 (true | false)
 **/
OGDSM.visualization.prototype.trackingGeoLocation = function (sw) {
    'use strict';
    var geolocation = this.geoLocation, mapObj = this.mapObj;
    if (typeof (this.mapObj) === 'undefined') {
        console.error('Not Create Map!!');
        return null;
    }
    if (geolocation === null) {
        geolocation = new ol.Geolocation({
            projection:	mapObj.getView().getProjection(),
            tracking : true
        });
    }

    if (sw === true) {
        geolocation.once('change:position', function () {
            mapObj.getView().setCenter(geolocation.getPosition());
        });
    }
};
/**
 * 해상도에 맞는 지도 레이아웃
 * @method updateLayoutSetting
 * @param {String} mapDiv - 지도 DIV 아이디 이름
 **/
OGDSM.visualization.prototype.updateLayoutSetting = function (mapDiv) {
    'use strict';
    mapDiv = (typeof (mapDiv) !== 'undefined') ? mapDiv : this.mapDiv;
    if (typeof (this.mapObj) !== 'undefined') {
        this.mapObj.updateSize();
    }
};


/**
 * WMS 및 WFS 맵 레이어 추가
 * @method addMap
 * @param {ol Map Object} data - 오픈레이어3 지도 객체
 */
OGDSM.visualization.prototype.addMap = function (data) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    var interaction;
    if (chkData === false) {
        this.getMap().addLayer(data);
        this.mapObj.removeInteraction(this.mapObj.getInteractions());
        /*interaction*/
        interaction = new ol.interaction.Select({
            layers : function (layer) {
                return true;
            },
            style : (function () {
                var styleStroke = new ol.style.Stroke({
                    color : 'rgba(255, 0, 0, 1.0)',
                    width : 3
                });
                return function (feature, resolution) {
                    var type = feature.getGeometry().getType();
                    var styleCircle = new ol.style.Circle({
                        radius : 10,
                        fill : feature.get('styleCircle').getFill(),
                        stroke : styleStroke
                    });
                    if (type === 'MultiPolygon') {
                        return [new ol.style.Style({
                            fill : feature.get('styleFill'),
                            stroke : styleStroke,
                            text : feature.get('styleText')
                        })];
                    } else if (type === 'Point') {
                        return [new ol.style.Style({
                            image : styleCircle,
                            text : feature.get('styleText')
                        })];
                    }
                };
            }())
        });
        this.mapObj.addInteraction(interaction);
        this.mapObj.removeLayer(interaction);
        //console.log(interaction.deselected(null));
        /*layer list On*/
        if (typeof (this.layerListObj) !== 'undefined') {
            var color;
            var geometryObj = data.getSource().getFeatures()[0].getGeometry();
            var geoType = geometryObj.getType();
            if (typeof data.getStyle !== 'undefined') {
                color = data.get('styleFill');
            } else {
                color =  'rgb(0, 0, 0)';
            }
            this.layerListObj.addList(data, data.get('title'), color, geoType);
        }
        /*attribute On*/
        if (typeof (this.attrTableObj) !== 'undefined') {
            var attrTableObj = this.attrTableObj;
            this.attrTableObj.addAttribute(data.get('title'));
            this.attrTableObj.setolSelectObj(interaction);
            interaction.getFeatures().on('add', function (event) {
                attrTableObj.unSelectAttribute(data.get('title'));
                var obj = event.target.item(0);
                var label = event.target.item(0).get('label');
                var selectValue = event.target.item(0).get(label);
                var trNumber = attrTableObj.searchAttribute(data.get('title'), label, selectValue);
                attrTableObj.selectAttribute(data.get('title'), trNumber);
            });
            interaction.getFeatures().on('remove', function (event) {
                attrTableObj.unSelectAttribute(data.get('title'));
            });
        }
    } else {
        console.log("Layer is existence");
    }
};
/**
 * 이미지 레이어 시각화
 * @method imageLayer
 * @param {String} imgURL - 이미지 주소
 * @param {String} imgTitle - 이미지 타이틀
 * @param {Array} imgSize - 이미지 사이즈 [width, height]
 * @param {Array} imgExtent - 이미지 위치 [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top]
 */
OGDSM.visualization.prototype.imageLayer = function (imgURL, imgTitle, imgSize, imgExtent) {
    'use strict';
    var imgLayer = null,
        title = imgTitle;

    imgLayer = new ol.layer.Image({
        opacity : 1.0,
        title : title,
        source : new ol.source.ImageStatic({
            url : imgURL + '?' + Math.random(),
            imageSize : imgSize,
            projection : new ol.proj.Projection({code : 'EPSG:3857'}),
            imageExtent : imgExtent

        })
    });
    this.getMap().addLayer(imgLayer);
};
/**
 * 맵 레이어 삭제
 * @method removeMap
 * @param {String} layerName - 레이어 이름
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
        if (typeof (this.layerListObj) !== 'undefined') {
            this.layerListObj.removeList(layerName);
        }
    }
};
/**
 * 맵 레이어 시각화 여부
 * @method setVisible
 * @param {String} layerName - 레이어 이름
 * @param {Boolean} flag - 시각화 스위치 [true | false}
 */
OGDSM.visualization.prototype.setVisible = function (layerName, flag) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        obj.setVisible(flag);
    }
};
/**
 * WFS 스타일 변경
 * @method changeWFSStyle
 * @param {String} layerName - 오픈레이어3 레이어 이름
 * @param {Hex Color, String or Array} colors - 변경할 색상
 * @param {JSON Object} options - 옵션 JSON 객체 키 값 {type:'polygon', opt : '0.5', attr: null, range: null, xyData: null}<br>
  type(String) : 객체 타입 (polygon, point)<br>
  opt(Number) : 레이어 투명도 <br>
  attr(String) : 속성 이름 <br>
  range(Array) : 색상 범위<br>
  xyData(Array) : 색상 데이터<br>
 */
OGDSM.visualization.prototype.changeWFSStyle = function (layerName, colors, options) {
    'use strict';
    var i = null, name,
        map = this.layerCheck(layerName),
        styleCache = {},
        style = null;
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        type : 'polygon',
        opt : 0.5,
        attr : null,
        range : null,
        data : null,
        rootKey : null,
        labelKey : null,
        valueKey : null
    };

    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    if (map === false) {
        console.error('Not Map Layer');
        return -1;
    }
    var data = defaults.data[defaults.rootKey];
    map.setStyle(function (f, r) {
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
    });
    map.setOpacity(defaults.opt);
};
