/*jslint devel: true, vars : true */
/*global $, jQuery, ol, OGDSM, d3*/

OGDSM.namesapce('visualization');
(function (ol, OGDSM) {
    "use strict";
    var mapObj;
    /**
    * OpenLayers3 Map Control Class
    * @class OGDSM.visualization
    * @constructor
    * @param {ol.Map} map
    */
    OGDSM.visualization = function (map) {
        mapObj = map;
    };
    OGDSM.visualization.prototype = {
        constructor : OGDSM.olMap,
        /**
         * getMap Method get map object about OpenLayers3.
         * @method getMap
         * @return {ol.Map} Retrun is OpenLayers object.
         */
        getMap : function () {
            return mapObj;
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
        }
        
    };
    return OGDSM.visualization;
}(ol, OGDSM));

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
        map = this.getMap(),
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
            zoom : mapZoom
        });
    } else {
        console.error('Not Map Style "OSM" | "VWorld"');
        return null;
    }
    if (baseLayer !== null) {
        map.setView(view);
        baseLayer.setSource(TMS);
    }
    /*
    map.addLayer(new ol.layer.Tile({
        title : 'basemap',
        source : TMS
    }));
    */
};
/**
 * WMS/WFS Map Add
 * @method addMap
 * @param {ol Map Object} data (OpenLayers WMS/WFS/ Object)
 */
OGDSM.visualization.prototype.addMap = function (data) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    if (chkData !== null) {
        this.getMap().removeLayer(chkData);
    }
    this.getMap().addLayer(data);
};
/**
 *
 *
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    this.getMap().removeLayer(obj);
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
