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
            //map.removeLayer(obj);
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
        console.log('Not Map Style');
    }
    console.log(TMS);
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
/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    var values = [], responseData = null, serviceFunc = null;
    /**
     * externalConnection Class
     * vworldWMS address http://map.vworld.kr/js/wms.do
     * @class OGDSM.externalConnection
     * @constructor
     * @param {String} serverName - External Server Name (vworldWMS/geoServer/publicData/airKorea)
     * @param {String} addr option(default: null) - External Server Address
     */
    OGDSM.externalConnection = function (name, addr) {
        addr = (typeof (addr) !== 'undefined') ? addr : 'null';
        this.serverName = name;
        this.asyncValue = false;
        if (name === 'vworldWMS') {
            this.baseAddr = "http://map.vworld.kr/js/wms.do";
        } else {
            this.baseAddr = addr;
        }

    };
    OGDSM.externalConnection.prototype = {
        constructor : OGDSM.externalConnection,
        /**
         * Get external server parameter
         * @method getValues
         * @return {Array} values
         */
        getValues : function () {
            return values;
        },
        /**
         * Set external server parameter
         * @method setValues
         * @param {Array} data values
         */
        setValues : function (arr) {
            values = arr;
        },
        /**
         * Remove external server parameter
         * @method removeValues
         */
        removeValues : function () {
            values = [];
        },
        /**
         * Get external server ajax result value
         * @method getResponseData
         * @return {JSON or Array} responseData
         */
        getResponseData : function () {
            return responseData;
        },
        /**
         * Set external server ajax result value
         * @method setResponseData
         * @param {JSON or Array} obj
         */
        setResponseData : function (obj) {
            responseData = null;
            responseData = obj;
        },
        /**
         * Set external server sub name
         * @method setSubName
         * @param {String} name
         */
        setSubName : function (name) {
            this.subName = name;
        }
    };
    return OGDSM.externalConnection;
}(OGDSM));
/**
 * Change external server name and address
 * @method changeServer
 * @param {String} serverName - External Server Name (vworldWMS/geoServer/publicData/airKorea)
 * @param {String} addr option(default: null) - External Server Address
 */
OGDSM.externalConnection.prototype.changeServer = function (name, addr) {
    'use strict';
    addr = (typeof (addr) !== 'undefined') ? addr : 'undefined';
    this.serverName = name;
    if (name === 'vworldWMS') {
        this.baseAddr = "http://map.vworld.kr/js/wms.do";
    } else {
        this.baseAddr = addr;
    }
};
/**
 * Setting data for connection
 * @method setData
 * @param {Array} arguments
 */
OGDSM.externalConnection.prototype.setData = function () {
    'use strict';
    var parm, i, values;
    parm = arguments;
    this.removeValues();
    values = this.getValues();
    for (i = 0; i < parm.length; i += 1) {
        values.push(parm[i]);
    }
    this.setValues(values);
};
/**
 * vworldWMS, geoServer(getLayers, WFS), publicData(environment) data loading
 * @method dataLoad
 * @return {JSON or Array} save values(responseData) through setResponseData()
 */
OGDSM.externalConnection.prototype.dataLoad = function () {
    'use strict';
    var resultData = null,
        jsonData = null,
        values = this.getValues(),
        setResponseData = this.setResponseData;
    if (this.serverName === 'vworldWMS') {
        if (values.length === 3) {
            resultData = new ol.layer.Tile({
                title : this.serverName,
                source : new ol.source.TileWMS(({
                    url : this.baseAddr,
                    params : {
                        apiKey : values[0],
                        domain : values[1],
                        LAYERS : values[2],
                        STYLES : values[2],
                        FORMAT : 'image/png',
                        //CRS : 'EPSG:900913',
                        CRS : 'EPSG:3857',
                        EXCEPTIONS : 'text/xml',
                        TRANSPARENT : true
                    }
                }))
            });
            setResponseData(resultData);
        } else {
            console.log("Not check out data values");
        }
    } else if (this.serverName === 'geoServer') {
        if (this.subName === 'undefined') {
            console.log('Please setting subName');
            return false;
        } else if (this.subName === 'getLayers') {
            jsonData = {WorkspaceName : values[0] };
            $.ajax({
                type : 'POST',
                url : this.baseAddr,
                crossDomain: true,
    //            async : this.asyncValue,
                data : JSON.stringify(jsonData),
                contentType : "application/json;charset=UTF-8",
                dataType : 'json',
                success : function (msg) {
                    resultData = msg;
                    setResponseData(resultData.data);
                },
                error : function (e) {
                    console.log(e);
                }
            });

        } else if (this.subName === 'WFS') {//workspace, layerName
            console.log(values[0] + ', ' + values[1] + ',' + values[2]);
            resultData = this.geoServerWFS(this.baseAddr, values[0], values[1], values[2]);
            setResponseData(resultData);
        }
    } else if (this.serverName === 'publicData') {
        if (this.subName === 'TimeAverageAirQuality' ||
                this.subName === 'RealtimeRoadsideStation' ||
                this.subName === 'ArpltnInforInqireSvc') {
            this.publicDataEnv(values[0], values[1], values[2], values[3]);
        }
    }

    if (this.getResponseData() === null) {
        return false;
    } else {
        return true;
    }
};
/**
 * GeoServer WFS data load (OpenLayers3 ol.source.ServerVector)
 * @method geoServerWFS
 * @param {String} addr - GeoServer Address
 * @param {String} ws - GeoServer Workspace
 * @param {String} name - GeoServer Layer Name
 * @param {String} type - GeoServer Layer Type (Default : polygon)
 * @return {ol.source.ServerVector} vectorSource - OpenLayers3 Vector Object
 */
OGDSM.externalConnection.prototype.geoServerWFS = function (addr, ws, name, type) {
    type = (typeof (type) !== 'undefined') ? type : 'polygon';
    var vectorSource, styles, resultData;
    vectorSource = new ol.source.ServerVector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
            var fullAddr = addr + '/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature' +
                '&typeNames=' + ws + ':' + name +
                '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
                '&srsname=' + 'EPSG:3857' + '&bbox=' + extent.join(',') + ',' + 'EPSG:3857';
            $.ajax({
                url : fullAddr,
                dataType: 'jsonp'
            });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
            maxZoom: 19
        })),
        projection: 'EPSG:3857'
    });
    if (type === 'polygon') {
        styles = [
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#ff0000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            })
        ];
    } else if (type === 'point') {
        styles = [
            new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({color : '#ff0000'}),
                    stroke : new ol.style.Stroke({color : '#ff0000', width : 1})
                })
            })
        ];
    }
    loadFeatures = function (response) {
        vectorSource.addFeatures(vectorSource.readFeatures(response));
    };
    resultData = new ol.layer.Vector({
        title : name,
        source : vectorSource,
        style: styles
    });
    return resultData;
};
/**
 * Get Environment Data (Seoul Open Data and Public Data Portal)
 * @method publicDataEnv
 * @param {String} apikey - Key Value
 * @param {String} envType - Environment Value (Seoul : PM10, PM25, CO, NO2, O3, SO2   Public : pm10value, covalue, no2value, o3value, so2value
 * @param {String} dateOrArea (option) - environment date or area
 * @param {String} time (option) - environment time
 * @return {JSON} save values(responseData) through setResponseData()
 */
OGDSM.externalConnection.prototype.publicDataEnv = function (apikey, envType, dateOrArea, time) {
    'use strict';
    dateOrArea = (typeof (dateOrArea) !== 'undefined') ? dateOrArea : 'null';
    time = (typeof (time) !== 'undefined') ? time : 'null';

    var colorRange =
        ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
        range = [],
        jsonData = "",
        setResponseData = this.setResponseData;
    $("#setting").popup("close");
    if (this.subName === 'TimeAverageAirQuality') { //envType add... server change...
        jsonData = '{"serviceName":"' + this.subName + '",' +
            ' "keyValue":"' + apikey + '",' +
            '"dateValue":' + '"' + dateOrArea + '",' +
            '"envType":' + '"' + envType + '",' +
            '"timeValue":' + '"' + time + '"}';

    } else if (this.subName === 'ArpltnInforInqireSvc') {
        jsonData = '{"serviceName":"' + this.subName + '",' +
            ' "keyValue":"' + apikey + '",' +
            '"areaType":' + '"' + encodeURIComponent(dateOrArea) + '",' +
            '"envType":' + '"' + envType + '"}';
    }
    console.log(jsonData);
    jsonData = JSON.parse(jsonData);
    $.ajax({
        type : 'POST',
        url : this.baseAddr,
        data : JSON.stringify(jsonData),
        async : this.asyncValue,
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var resultData = msg;
            setResponseData(JSON.parse(resultData.data));
        },
        error : function (e) {
            console.log(e);
        }
    });
};

/*jslint devel: true*/
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('eGovFrameUI');
(function (OGDSM) {
    'use strict';
    /**
    * e-Goverement Framework UX Component Automatic Create.
    * @class OGDSM.eGovFramUI
    * @constructor
    * @param {String} theme - eGovframework theme a~g (default c)
    */
    OGDSM.eGovFrameUI = function (theme) {
        theme = (typeof (theme) !== 'undefined') ? theme : null;
        if (theme !== null) {
            this.dataTheme = theme;
        } else {
            this.dataTheme = "c";
        }

    };
    OGDSM.eGovFrameUI.prototype = {
        constructor : OGDSM.eGovFrameUI
    };
    return OGDSM.eGovFrameUI;
}(OGDSM));
/**
 * VWorld WMS API List (CheckBox).
 * @method vworldWMSCheck
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {Array} User Interface selectbox Name, id array ('vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5')
 */
OGDSM.eGovFrameUI.prototype.vworldWMSCheck = function (divId, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup">',
        OGDSM = this.OGDSM,
        selectName = ['vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5'],
        selectState = [0, 0, 0, 0, 0],
        styles,
        stylesText,
        i,
        j,
        btnObj;

    styles = [
        'LP_PA_CBND_BUBUN,LP_PA_CBND_BONBUN',
        'LT_C_UQ111', 'LT_C_UQ112', 'LT_C_UQ113', 'LT_C_UQ114',
        'LT_C_UQ121', 'LT_C_UQ122', 'LT_C_UQ123', 'LT_C_UQ124', 'LT_C_UQ125',
        'LT_C_UQ126', 'LT_C_UQ127', 'LT_C_UQ128', 'LT_C_UQ129', 'LT_C_UQ130',
        'LT_C_UQ141', 'LT_C_UQ162', 'LT_C_UD801',
        'LT_L_MOCTLINK', 'LT_P_MOCTNODE',
        'LT_C_LHZONE', 'LT_C_LHBLPN',
        'LT_P_MGPRTFA', 'LT_P_MGPRTFB', 'LT_P_MGPRTFC', 'LT_P_MGPRTFD',
        'LT_L_SPRD', 'LT_C_SPBD',
        'LT_C_ADSIDO', 'LT_C_ADSIGG', 'LT_C_ADEMD', 'LT_C_ADRI',
        'LT_C_TDWAREA',
        'LT_C_DAMDAN', 'LT_C_DAMYOD', 'LT_C_DAMYOJ', 'LT_C_DAMYUCH',
        'LT_C_RIRSV', 'LT_P_RIFCT',
        'LT_P_UTISCCTV', 'LT_C_USFSFFB',
        'LT_L_FRSTCLIMB', 'LT_P_CLIMBALL', 'LT_L_TRKROAD', 'LT_P_TRKROAD',
        'LT_C_WKMBBSN', 'LT_C_WKMMBSN', 'LT_C_WKMSBSN', 'LT_C_WKMSTRM',
        'LT_C_ASITSOILDRA', 'LT_C_ASITDEEPSOIL', 'LT_C_ASITSOILDEP', 'LT_C_ASITSURSTON',
        'LT_L_AISROUTEU', 'LT_L_AISPATH', 'LT_C_AISALTC', 'LT_C_AISRFLC', 'LT_C_AISACMC', 'LT_C_AISCTRC',
        'LT_C_AISMOAC', 'LT_C_AISADZC', 'LT_C_AISPRHC', 'LT_C_AISFIRC', 'LT_C_AISRESC', 'LT_C_AISDNGC',
        'LT_C_AISTMAC', 'LT_C_AISCATC', 'LT_P_AISBLDG40F', 'LT_L_AISSEARCHL,LT_P_AISSEARCHP',
        'LT_L_AISVFRPATH,LT_P_AISVFRPATH', 'LT_P_AISVFRPT,LT_P_AISVFRPT_SW,LT_P_AISVFRPT_SN',
        'LT_L_AISCORRID_YS,LT_L_AISCORRID_GJ,LT_P_AISCORRID_YS,LT_P_AISCORRID_GJ', 'LT_P_AISHCSTRIP'];
    stylesText = [
        '지적도',
        '도시지역', '관리지역', '농립지역', '자연환경보전지역',
        '경관지구', '미관지구', '고도지구', '방화지구', '방재지구',
        '보존지구', '시설보호지구', '취락지구', '개발진흥지구', '특정용도제한지구',
        '국토계획구역', '도시자연공원구역', '개발제한구역',
        '교통링크', '교통노드',
        '사업지구경계도', '토지이용계획도',
        '아동안전지킴이집', '노인복지시설', '아동복지시설', '기타보호시설',
        '새주소도로', '새주소건물',
        '광역시도', '시군구', '읍면동', '리',
        '보행우선구역',
        '단지경계', '단지용도지역', '단지시설용지', '단지유치업종',
        '저수지', '수리시설',
        '교통CCTV', '소방서관할구역',
        '등산로', '등산로시설', '둘레길링크', '산책로분기점',
        '대권역', '중권역', '표준권역', '하천망',
        '배수등급', '심토토성', '유효토심', '자갈함량',
        '제한고도', '항공로', '경계구역', '공중급유구역', '공중전투기동훈련장', '관제권',
        '군작전구역', '방공식별구역', '비행금지구역', '비행정보구역', '비행제한구역', '위험구역',
        '접근관제구역', '훈련구역', '건물군(40층이상)', '수색비행장비행구역',
        '시계비행로', '시계비행보고지점',
        '한강회랑', '헬기장'];
    for (j = 0; j < selectName.length; j += 1) {
        html += '<select name="' + selectName[j] + '" id="' + selectName[j] + '" data-theme=' + selectTheme + '>';
        html += '<option value="">' + (j + 1) + '번째 레이어 선택 </option>';
        for (i = 0; i < styles.length; i += 1) {
            html += '<option value="' + styles[i] + '">' + stylesText[i] + '</option>';
        }
        html += '</select>';
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");

    $("#" + selectName[0]).change(function () {
        selectState[0] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[1]).change(function () {
        selectState[1] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[2]).change(function () {
        selectState[2] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[3]).change(function () {
        selectState[3] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[4]).change(function () {
        selectState[4] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    return selectName;
};
/**
 * User Interface Create about visualization type (Radio Button).
 * @method visTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Name (visualType)
 */
OGDSM.eGovFrameUI.prototype.visTypeRadio = function (divId, theme) {
    'use strict';
    var radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        arr = ['map', 'chart'],
        arrText = ['맵', '차트'],
        i;
    for (i = 0; i < arr.length; i += 1) {
        html += '<input type="radio" name="visualType" class="custom" data-theme=' + radioTheme +
								' id="id-' + arr[i] + '" value="' + arr[i] + '" ';
        html += '>' + '<label for="id-' + arr[i] + '">' + arrText[i] + '</label>';
    }
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'visualType';
};
/**
 * User Interface Create about visualization type (Date Input).
 * @method DateInput
 * @param {String} divId - div id about HTML tag attribute
 * @return {jQuery Object} User Interface Date Input Object (Date YYYY/MM/DD)
 */
OGDSM.eGovFrameUI.prototype.dateInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<label for="dateValue">날짜 : </label>' +
			'<input type="date" id="dateValue"/>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#dateValue');
};
/**
 * User Interface Create about time input (Time Input).
 * @method timeInput
 * @param {String} divId - div id about HTML tag attribute
 * @return {jQuery Object} User Interface Time Input Object (Time)
 */
OGDSM.eGovFrameUI.prototype.timeInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html =  '<label for="timeValue">시간 : </label>' +
			'<input type="time" id="timeValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#timeValue');
};
/**
 * User Interface Create about Environment Type (Radio Button).
 * @method envTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} provider - public data provider ('seoul' or 'public') (default : seoul)
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Name (envTypeRadio)
 */
OGDSM.eGovFrameUI.prototype.envTypeRadio = function (divId, prov, theme) {
    'use strict';
    var provider = (typeof (prov) !== 'undefined') ? prov : "seoul",
        radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<label for="envValue">환경정보:</label>' +
            '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        envTypes = ['pm10', 'pm25', 'so2', 'o3', 'no2', 'co'],
        envTypeValues,
        i;
    if (provider === 'seoul') {
        envTypeValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    } else if (provider === 'public') {
        envTypeValues = ['pm10Value', 'pm25Value', 'so2Value', 'o3Value', 'no2Value', 'coValue'];
    }
    for (i = 0; i < envTypes.length; i += 1) {
        html += '<input type="radio" name="envTypeRadio" class="custom" data-theme=' + radioTheme +
            ' id="id-' + envTypeValues[i] + '" value="' + envTypeValues[i] + '"/>' +
            '<label for="id-' + envTypeValues[i] + '">' +
            '<img src="images/input_bt_' + envTypes[i] + '.png" width=30>' +
            '</label>';
        if (i !== 0 && (i + 1) % 3 === 0) {
            html += '</fieldset>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'envTypeRadio';
};
/**
 * User Interface Create about Area Type (Radio Button).
 * @method areaTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Attribute Name Value (areaTypeRadio)
 */
OGDSM.eGovFrameUI.prototype.areaTypeRadio = function (divId, theme) {
    'use strict';
    var radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<label for="areaValue">지역:</label>' +
            '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        areaTypes = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'],
        i;
    for (i = 0; i < areaTypes.length; i += 1) {
        html += '<input type="radio" name="areaTypeRadio" class="custom" data-theme=' + this.dataTheme +
            ' id="id-' + areaTypes[i] + '" value="' + areaTypes[i] + '"/>' +
            '<label for="id-' + areaTypes[i] + '">' + areaTypes[i] + '</label>';
        if (i !== 0 && (i + 1) % 3 === 0) {
            html += '</fieldset>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'areaTypeRadio';
};
/**
 * User Interface Create about Map List (Select).
 * @method mapListSelect
 * @param {String} divId - div id about HTML tag attribute
 * @param {Array} arr - Select Box Option List
 * @return {String} Select Box Id Value
 */
OGDSM.eGovFrameUI.prototype.mapListSelect = function (divId, arr) {
    'use strict';
    var html, i,
        rootDiv = $('#' + divId);
    console.log(arr);
    html =
        '<select name="geoServerSelectBox" id="geoServerSelectBox" data-theme=' + this.dataTheme + '>' +
        '<option value=""></option>';
    for (i = 0; i < arr.length; i += 1) {
        html += '<option value="' + arr[i] + '">' +
            arr[i] + '</option>';
    }
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'geoServerSelectBox';
};
/**
 * User Interface Create about Process (Button).
 * @method processButton
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {jQuery Object} User Interface Button Object (Process)
 */
OGDSM.eGovFrameUI.prototype.processButton = function (divId, theme) {
    'use strict';
    var butTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv,
        html;
    rootDiv = $('#' + divId);
    html = '<a href="#" id="processBtn" data-role="button" data-theme="' + butTheme + '">시각화</a>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#processBtn');
};

/**
 * User Interface Create about SelectBox
 * @method selectBox
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} name - selectbox name about HTML tag attribute
 * @param {String} id - selectbox id about HTML tag attribute
 * @param {Array} data - selectbox option data
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {jQuery Object} div id Object
 */
OGDSM.eGovFrameUI.prototype.selectBox = function (divId, name, id, data, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup">',
        OGDSM = this.OGDSM,
        styles,
        stylesText,
        i,
        j,
        btnObj;

    html += '<select name="' + name + '" id="' + id + '" data-theme=' + selectTheme + '>';
    html += '<option value="">  </option>';
    for (i = 0; i < data.length; i += 1) {
        html += '<option value="' + data[i] + '">' + data[i] + '</option>';
    }
    html += '</select>';
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $("#" + id);
};

