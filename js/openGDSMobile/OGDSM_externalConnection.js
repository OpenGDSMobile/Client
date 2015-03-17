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
    console.log(this.baseAddr);
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
