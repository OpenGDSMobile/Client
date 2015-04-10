/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3*/
OGDSM.namesapce('visualization');
(function (OGDSM) {
    "use strict";
    var mapObj;
    /**
    * OpenLayers3 Map Control Class
    * @class OGDSM.visualization
    * @constructor
    * @param {ol.Map} map
    */
    OGDSM.visualization = function (mapDiv, layerlistDiv) {
        layerlistDiv = (typeof (layerlistDiv) !== 'undefined') ? layerlistDiv : null;

//      mapObj = map;
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
         * getMap Method get map object about OpenLayers3.
         * @method getMap
         * @return {ol.Map} Retrun is OpenLayers object.
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * Current Layers Check about OpenLayers3.
         * @method layerCheck
         * @param {String} layerName - Search layer name
         * @return {OpenLayer3 Layer Object} Retrun is OpenLayers object.
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
 * OGDSM Mobile Map View
 * @method olMapView
 * @param {Array}  latlng   - Map init center latitude, longitude (option) [default : [37.582200, 127.010031] ]
 * @param {String} mapType - Background map (option) [default : 'OSM']
 * @param {String} baseProj  - Map base projection (option) [default : 'EPSG:3857']
 *
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
        zoom : 12
    });


    if (mapType === 'OSM') {
        baseMapLayer = new ol.source.OSM();
    } else if (mapType === 'VWorld') {
        baseMapLayer = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Base/201411/{z}/{x}/{y}.png"
        }));
        baseView = new ol.View({
            projection : ol.proj.get(baseProj),
            center : ol.proj.transform(latlng, 'EPSG:4326', baseProj),
            zoom : 12,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapType === 'Naver') {
        baseMapLayer = new ol.source.XYZ(({
            urls : [
                'http://onetile1.map.naver.net/get/109/0/0/{z}/{x}/{-y}/bl_vc_bg/ol_vc_an',
                'http://onetile2.map.naver.net/get/109/0/0/{z}/{x}/{-y}/bl_vc_bg/ol_vc_an',
                'http://onetile3.map.naver.net/get/109/0/0/{z}/{x}/{-y}/bl_vc_bg/ol_vc_an',
                'http://onetile4.map.naver.net/get/109/0/0/{z}/{x}/{-y}/bl_vc_bg/ol_vc_an'
            ]
        }));
        baseView = new ol.View({
            projection : ol.proj.get(baseProj),
            center : [953920.3, 1951999.6],
            zoom : 3,
            maxResolution : 2048,
            minResolution : 0.5,
            resolutions : [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]
        });
    } else if (mapType === 'Daum') {
        baseMapLayer = new ol.source.XYZ(({
            urls : [
                'http://i0.maps.daum-img.net/map/image/G03/i/2015yellow/L{z}/{y}/{x}.png',
                'http://i1.maps.daum-img.net/map/image/G03/i/2015yellow/L{z}/{y}/{x}.png',
                'http://i2.maps.daum-img.net/map/image/G03/i/2015yellow/L{z}/{y}/{x}.png',
                'http://i3.maps.daum-img.net/map/image/G03/i/2015yellow/L{z}/{y}/{x}.png'
            ]
        }));
    } else {
        console.error('Not Map Style "OSM" | "VWorld"');
        return null;
    }
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
    return map;
};
/**
 * Map GeoLocation Tracking
 * @method trackingGeoLocation
 * @param {boolean} sw
 *
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
 * OGDSM Mobile Screen Update Layout
 * @method updateLayoutSetting
 * @param {String}
 * @return {Array}
 *
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
    $("#d3View").attr('width', $(window).width() - 100);
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);
	//beforeProcess.popupSize("#dataSelect");
	//beforeProcess.popupSize("#vworldList", "300px");
	$('#layersList').css('height', $(window).height() - 400);
	$('#layersList').css("overflow-y", "auto");
    /********************/
};




/**
 * changeBaseMap Method is base map Change.
 * @method changeBaseMap
 * @param {String} mapStyle ('VWorld' or 'OSM')
 */
OGDSM.visualization.prototype.changeBaseMap = function (mapStyle) {
    "use strict";
    var TMS = null,
        view = null,
        baseLayer = null,
        map = this.mapObj,
        maplayers = map.getLayers(),
        mapCenter = map.getView().getCenter(),
        mapZoom = map.getView().getZoom(),
        mapProj = map.getView().getProjection();

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
    } else {
        console.error('Not Map Style "OSM" | "VWorld"');
        return null;
    }
    if (baseLayer !== null) {
        map.setView(view);
        baseLayer.setSource(TMS);
    }
};
/**
 * WMS/WFS Map Add
 * @method addMap
 * @param {ol Map Object} data (OpenLayers WMS/WFS/ Object)
 */
OGDSM.visualization.prototype.addMap = function (data) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    if (chkData === false) {
       // this.getMap().removeLayer(chkData);
        this.getMap().addLayer(data);
        this.layerListObj.addList(data, data.get('title'));
    } else {
        console.log("Layer is existence");
    }
};
/**
 *
 *
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
    }
};
/**
 *
 *
 */
OGDSM.visualization.prototype.setVisible = function (layerName, flag) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        obj.setVisible(flag);
    }
};
/**
 *
 *
 */
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
/**
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

/**
 * Image Layer Visualization based on OpenLayers3
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

