/*jslint devel: true */
/*global $, jQuery, ol*/

/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM Super Class.<br>
* --
* Classes
*  - eGovFrameUI
*  - externalConnection
*  - olMap
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    "use strict";
    OGDSM.prototype = {
        constructor : OGDSM,
        version : "1.0"
    };
    return OGDSM;
}(window, jQuery));

/**
* OGDSM 'namespace' module(Create New Object)
*
* - Use
*       OGDSM.namesace('example');
* - Developer
*       OGDSM.example=(function(){
*         //Source Code
*       }());
*
* @module OGDSM.namespace
*/
OGDSM.namesapce = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;

    if (parent[0] === 'OGDSM') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }
    return parent;
};
/**
 * OGDSM json to Array module 
 * - Use
 *       OGDSM.jsonToArray(jsonData, array[0], array[1]);
 *
 * @module OGDSM.jsontoArray
 */

OGDSM.jsonToArray = function (obj, x, y) {
    'use strict';
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
	xyAxis[1] = [];
    $.each(row, function (idx) {
        xyAxis[0].push(row[idx][x]);
        xyAxis[1].push(row[idx][y]);
    });
    return xyAxis;
};

/*jslint devel: true */
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
        version : "1.0",
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
    var TMS,
        map = this.getMap(),
        maplayers = map.getLayers();

    maplayers.forEach(function (obj, i) {
        var layerTitle = obj.get('title');
        if (layerTitle === 'basemap') {
            map.removeLayer(obj);
        }
    });
    if (mapStyle === 'OSM') {
        TMS = new ol.source.OSM();
    } else if (mapStyle === 'VWorld') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
        }));
    } else {
        console.log('Not Map Style');
    }
    map.addLayer(new ol.layer.Tile({
        title : 'basemap',
        source : TMS
    }));
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
 * @param {String or Array} Map color
 * @param {Number} Opacity number
 * @param {String} Map attribute name - option
 */
OGDSM.visualization.prototype.changeWFSStyle = function (layerName, colors, opt, attr, range, xyData) {
    'use strict';
    colors = (typeof (colors) !== 'undefined') ? colors : null;
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
