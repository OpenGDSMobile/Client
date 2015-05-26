/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3*/
OGDSM.namesapce('visualization');
(function (OGDSM) {
    "use strict";
    var mapObj;
    /**
    * 오픈레이어3 지도 시각화 객체 (OpenLayers3 Map Visualization Class)
    * @class OGDSM.visualization
    * @constructor
    * @param {String} mapDiv - 지도 DIV 아이디 이름 (Map div id)
    * @param {JSON Object} options - 옵션 JSON 객체 키 값{layerListDiv=null, attrTableDiv=null, attrAddr=''}<br>
  layerListDiv : 레이어 관리 리스트 DIV 아이디 이름<br>
  attrTableDiv : 속성 시각화 DIV 아이디 이름<br>
  attrAddr : 속성 시각화 서버 주소<br>
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
            attrAddr : ''
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
        if (defaults.layerListDiv !== null) {
            this.layerListObj = new OGDSM.mapLayerList(this, defaults.layerListDiv);
        }
        if (defaults.attrTableDiv !== null) {
            this.attrTableObj = new OGDSM.attributeTable(defaults.attrTableDiv, defaults.attrAddr);
        }
        // Orientation...
    };
    OGDSM.visualization.prototype = {
        constructor : OGDSM.visualization,
        /**
         * 지도 객체 받기(Get map object about OpenLayers3)
         * @method getMap
         * @return {ol.Map} 오픈레이어3 객체
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * 지도 레이어 존재 여부 확인(Current layers check)
         * @method layerCheck
         * @param {String} layerName - 레이어 타이틀
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
         * 지도 레이어 인덱스 값(Current layers index value)
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
        }
    };
    return OGDSM.visualization;
}(OGDSM));

/**
 * OpenGDS 모바일 맵 초기화(OGDSM Mobile map view)
 * @method olMapView
 * @param {Array}  latlng  - 지도 초기 위,경도 값 (옵션) [default : [37.582200, 127.010031] ]
 * @param {String} mapType - 배경 지도 초기 값 (옵션) [default : 'OSM']
 * @param {String} baseProj  - 지도 투영 값 (옵션)   [default : 'EPSG:3857']
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
    return this.mapObj;
};


/**
 * 배경지도 변경(Base map change)
 * @method changeBaseMap
 * @param {String} mapStyle - 지도 스타일 ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
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
 * 지도 GPS 트래킹 스위치(Map geolocation tracking)
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
 * 모바일 해상도에 맞는 지도 레이아웃 업데이트(OGDSM Mobile screen update layout)
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
 * WMS 및 WFS 맵 레이어 추가(Add map layer WMS/WFS)
 * @method addMap
 * @param {ol Map Object} data - 오픈레이어3 지도 객체
 * @param {String} type - WFS 객체 타입 [polygon(default) | point]
 */
OGDSM.visualization.prototype.addMap = function (data, type) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    if (chkData === false) {
        this.getMap().addLayer(data);
        if (typeof (this.layerListObj) !== 'undefined') {
            var color;
            if (typeof data.getStyle !== 'undefined') {
                if (type === 'polygon') {
                    color = data.getStyle()[0].getFill().getColor();
                } else if (type === 'point') {
                    color = data.getStyle()[0].getImage().getFill().getColor();
                }

            } else {
                color =  'rgb(0, 0, 0)';
            }
            this.layerListObj.listManager(data, data.get('title'), color, type);
        }
        if (typeof (this.attrTableObj) !== 'undefined') {
            this.attrTableObj.addAttribute(data.get('title'));
        }
    } else {
        console.log("Layer is existence");
    }
};
/**
 * 이미지 레이어 시각화(Image layer visualization)
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
 * 맵 레이어 삭제(Remove map layer)
 * @method removeMap
 * @param {String} layerName - 레이어 타이틀
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
        if (typeof (this.layerListObj) !== 'undefined') {
            this.layerListObj.removelist(layerName);
        }
    }
};
/**
 * 맵 레이어 시각화 여부(Map layer visualization flag)
 * @method setVisible
 * @param {String} layerName - 레이어 타이틀
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
 * WFS 스타일 변경(WFS style change)
 * @method changeWFSStyle
 * @param {String} layerName - 오픈레이어3 레이어 타이틀
 * @param {Hex Color, String or Array} colors ( Hex color )
 * @param {JSON Object} options - 옵션 JSON 객체 키 값 {type:'polygon', opt : '0.5', attr: null, range: null, xyData: null}
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
        xyData : null
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
    map.setStyle(function (f, r) {
        var i,
            j,
            color = '#FFFFFF',
            text = r < 5000 ? f.get(defaults.attr) : '';
        if (!styleCache[text]) {
            if (Array.isArray(colors)) {
                for (i = 0; i < defaults.xyData[1].length; i += 1) {
                    if (text === defaults.xyData[1][i]) {
                        for (j = 0; j < defaults.range.length; j += 1) {
                            if (defaults.xyData[0][i] <= defaults.range[j]) {
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
/**
 * 가로 막대 차트 시각화(Bar Chart Visualization based on D3.js)
 * @method barChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Array} data - 데이터 값 2차원 배열 (0 : x, 1 : y)
 * @param {Array} range - 데이터 범위 1차원 배열
 * @param {Array} color - 데이터 색 범위 1차원 배열 default : #000000 (range와 배열 길이 같아야함)
 */
OGDSM.visualization.prototype.barChart = function (divId, data, range, color) {
    'use strict';
    range = (typeof (range) !== 'undefined') ? range : [];
    color = (typeof (color) !== 'undefined') ? color : ['#000000'];
    var barHeight = 18,
        minusWidth = 0,
        rootDiv = $('#' + divId),
        maxData = d3.max(data[0]),
        barChartDiv = null,
        x = null,
        y = null,
        z = null;
    rootDiv.empty();
    barChartDiv = d3.select("#" + divId).append('svg')
        .attr('id', 'barchart')
        .attr('width', rootDiv.width())
        .attr('height', barHeight * data[0].length);
    x = d3.scale.linear().domain([0, maxData]).range([0, rootDiv.width() - 50]);
    barChartDiv.selectAll("rect").data(data[0]).enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * barHeight;
        })
        .attr('width', function (d) {
            if (d === '-' || d === '0') {
                return x(20);
            }
			return x(d) - minusWidth;
        })
        .attr('height', barHeight - 2)
		.attr('fill', function (d, i) {
            if (d === '-' || d === '0') {
                return '#AAAAAA';
            }
            if (range.length !== 0) {
                for (z = 0; z < range.length; z += 1) {
                    if (data[0][i] <= range[z]) {
                        return color[z];
                    }
                }
            }
            return color[color.length];
        });
    
    barChartDiv.selectAll('g').data(data[1])
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return i * barHeight + barHeight - 5;
        })
        .attr('font-weight', 'bold')
        .attr('font-size', '0.8em')
        .text(function (d) {
            return d;
        });
    
	barChartDiv.selectAll('g').data(data[0])
        .enter()
        .append('text')
        .attr('x', function (d) {
            if (d === '-' || d === '0') {
                return x(10);
            }
			return x(d) - minusWidth;
        })
        .attr('y', function (d, i) {
            return i * barHeight + barHeight - 5;
        })
        .attr('dy', '.15em')
        .attr('fill', 'black')
        .attr('font-size', '0.8em')
        .attr('font-weight', 'bold')
        .text(function (d) {
            if (d === '-' || d === '0') {
                return '점검중';
            }
            return d;
        });
};
