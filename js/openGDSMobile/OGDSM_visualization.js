/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3*/
OGDSM.namesapce('visualization');
(function (OGDSM) {
    "use strict";
    var mapObj;
    /**
    * 오픈레이어3 지도 시각화 객체
    * OpenLayers3 Map Visualization Class
    * @class OGDSM.visualization
    * @constructor
    * @param {String} mapDiv - Map div id
    * @param {ol.Map} layerlistDiv - Layer list div view (option)
    */
    OGDSM.visualization = function (mapDiv, layerlistDiv) {
        layerlistDiv = (typeof (layerlistDiv) !== 'undefined') ? layerlistDiv : null;
        this.updateLayoutSetting(mapDiv);
        this.mapDiv = mapDiv;
        this.geoLocation = null;
        OGDSM.visualization = this;
        $(window).on('resize', function () {
            OGDSM.visualization.updateLayoutSetting();
        });
        if (layerlistDiv !== null) {
            this.layerListObj = new OGDSM.mapLayerList(this, 'layerList');
        }
        // Orientation...
    };
    OGDSM.visualization.prototype = {
        constructor : OGDSM.visualization,
        /**
         * 지도 객체 받기
         * Get map object about OpenLayers3
         * @method getMap
         * @return {ol.Map} Retrun is OpenLayers object
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * 지도 레이어 존재 여부 확인
         * Current layers check about OpenLayers3
         * @method layerCheck
         * @param {String} layerName - Search layer title
         * @return {OpenLayer3 Layer Object} Retrun is OpenLayers object
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
         * Current layers index value about OpenLayers3
         * @method indexOf
         * @param {ol3 layers object} layers - Layer objects
         * @return {Number} Retrun is index number
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
 * OpenGDS 모바일 맵 초기화
 * OGDSM Mobile map view
 * @method olMapView
 * @param {Array}  latlng   - Map init center latitude, longitude (option) [default : [37.582200, 127.010031] ]
 * @param {String} mapType - Background map (option) [default : 'OSM']
 * @param {String} baseProj  - Map base projection (option) [default : 'EPSG:3857']
 * @return {ol.Map} Return is openlayers3 ol.Map object
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
 * 배경지도 변경
 * Base map change
 * @method changeBaseMap
 * @param {String} mapStyle - Map style ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
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
 * Map geolocation tracking
 * @method trackingGeoLocation
 * @param {boolean} sw - Geolocation switch (true | false
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
 * 모바일 해상도에 맞는 지도 레이아웃 업데이트
 * OGDSM Mobile screen update layout
 * @method updateLayoutSetting
 * @param {String} mapDiv - Map div name
 **/
OGDSM.visualization.prototype.updateLayoutSetting = function (mapDiv) {
    'use strict';
    mapDiv = (typeof (mapDiv) !== 'undefined') ? mapDiv : this.mapDiv;
    $('#' + mapDiv).width(window.innerWidth);
    $('#' + mapDiv).height(window.innerHeight);
    if (typeof (this.mapObj) !== 'undefined') {
        this.mapObj.updateSize();
    }

    /*******************/
/*    $("#d3View").attr('width', $(window).width() - 100);
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);

	$('#layersList').css('height', $(window).height() - 400);
	$('#layersList').css("overflow-y", "auto");*/
    /********************/
};
/**
 * WMS 및 WFS 맵 레이어 추가
 * WMS/WFS map layer add
 * @method addMap
 * @param {ol Map Object} data - Openlayers map object (OpenLayers WMS/WFS/ Object)
 */
OGDSM.visualization.prototype.addMap = function (data, type) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    if (chkData === false) {
        this.getMap().addLayer(data);
        console.log(type);
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
            console.log(color);
            this.layerListObj.addList(data, data.get('title'), color, type);
        }
    } else {
        console.log("Layer is existence");
    }
};
/**
 * 이미지 레이어 시각화
 * Image Layer Visualization
 * @method imageLayer
 * @param {String} imgURL (Image URL)
 * @param {String} imgTitle (Image title)
 * @param {Array} imgSize (Image size [width, height] )
 * @param {Array} imgExtent (Image extent [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top])
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
 * WMS/WFS/ImageLayer map layer remove
 * @method removeMap
 * @param {String} layerName - Layer title
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
    }
};
/**
 * 맵 레이어 시각화 여부
 * Map layer visualization flag
 * @method setVisible
 * @param {String} layerName - Layer title
 * @param {Boolean} flag - visualization switch true or false
 */
OGDSM.visualization.prototype.setVisible = function (layerName, flag) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        obj.setVisible(flag);
    }
};
/**
 * WFS 스타일 변경  (수정중....)
 * WFS style change
 * @method changeWFSStyle
 * @param {String} layerName (OpenLayers layer name)
 * @param {Hex Color, String or Array} colors ( Hex color )
 * @param {String} type (Vector type)
 * @param {Number} opt (Opacity number) - option, Default value : 0.5
 * @param {String} attr (Map attribute name) - option, Default value : null
 * @param {String} range (Colors range) - option, Default value : null
 * @param {String} xyData (attr value data) - option, Default value : null
 */
OGDSM.visualization.prototype.changeWFSStyle = function (layerName, colors, type, opt, attr, range, xyData) {
    'use strict';
    opt = (typeof (opt) !== 'undefined') ? opt : 0.5;
    attr = (typeof (attr) !== 'undefined') ? attr : null;
    range = (typeof (attr) !== 'undefined') ? range : null;
    xyData = (typeof (attr) !== 'undefined') ? xyData : null;
    var i = null,
        map = this.layerCheck(layerName),
        styleCache = {},
        style = null;

    if (map === false) {
        console.error('Not Map Layer');
        return -1;
    }
    map.setStyle(function (f, r) {
        var i,
            j,
            color = '#FFFFFF',
            text = r < 5000 ? f.get(attr) : '';
        if (!styleCache[text]) {
            if (Array.isArray(colors)) {
                for (i = 0; i < xyData[1].length; i += 1) {
                    if (text === xyData[1][i]) {
                        for (j = 0; j < range.length; j += 1) {
                            if (xyData[0][i] <= range[j]) {
                                color = colors[j];
                                break;
                            }
                        }
                    }
                }
            } else {
                color = colors;
            }
            if (type === 'polygon') {
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
            } else if (type === 'point') {
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
    map.setOpacity(opt);
};
/**
 * Bar Chart Visualization based on D3.js
 * range length = color length
 * @method barChart
 * @param {String} divId (Div name to visualize)
 * @param {Array} data (2 dim array about x, y - data is null 0 or -)
 * @param {Array} range (1 dim array about bar range) - option based )
 * @param {Array} color (1 dun array about bar fill color of range  - option ['#00000'])
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

/*
OGDSM.visualization.prototype.changeWFSzIndex = function (layerName, color, type, zIndex) {
    'use strict';
    var map = this.layerCheck(layerName);
    if (map === false) {
        return -1;
    }

    console.log(layerName + ' ' + zIndex);
    map.setStyle(function (f, r) {
        var style = null;
        if (type === 'polygon') {
            style = [new ol.style.Style({
                fill : new ol.style.Fill({
                    color : color
                }),
                stroke : new ol.style.Stroke({
                    color : '#00000',
                    width : 1
                }),
                zIndex : zIndex
            })];

        } else if (type === 'point') {
            style = [new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({
                        color : color
                    }),
                    stroke : new ol.style.Stroke({
                        color : '#000000',
                        width : 1
                    })
                }),
                zIndex : zIndex
            })];

        }
        return style;
    });
};
*/
