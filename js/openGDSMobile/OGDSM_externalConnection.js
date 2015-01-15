/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    var values = [], responseData = [], serviceFunc = null;
    /**
     * externalConnection Class
     * @class OGDSM.externalConnection
     * @constructor
     * @param {String} serverName - External Server Name (vworldWMS/geoServer/seoulOpen/airKorea)
     */
    OGDSM.externalConnection = function (name, addr) {
        addr = (typeof (addr) !== 'undefined') ? addr : 'undefined';
        this.serverName = name;
        if (name === 'vworldWMS') {
            this.baseAddr = "http://map.vworld.kr/js/wms.do";
        } else {
            this.baseAddr = addr;
        }

    };
    OGDSM.externalConnection.prototype = {
        constructor : OGDSM.externalConnection,
        getValues : function () {
            return values;
        },
        setValues : function (arr) {
            values = arr;
        },
        removeValues : function () {
            values = [];
        },
        getResponseData : function () {
            return responseData;
        },
        setResponseData : function (arr) {
            responseData = arr;
        },
        setSubName : function (name) {
            this.subName = name;
        }
    };
    return OGDSM.externalConnection;
}(OGDSM));

/**
 *
 *
 *
 */
OGDSM.externalConnection.prototype.changeServer = function (name, addr) {
    'use strict';
    addr = (typeof (addr) !== 'undefined') ? addr : 'undefined';
    this.serverName = name;
    this.baseAddr = addr;
};
/**
 *
 *
 *
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
 *
 *
 *
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
                source : new ol.source.TileWMS(({
                    url : this.baseAddr,
                    params : {
                        apiKey : values[0],
                        domain : values[1],
                        LAYERS : values[2],
                        STYLES : values[2],
                        FORMAT : 'image/png',
                        CRS : 'EPSG:900913',
                        EXCEPTIONS : 'text/xml',
                        TRANSPARENT : true
                    }
                }))
            });
        } else {
            console.log("Not check out data values");
        }
    } else if (this.serverName === 'geoServer') {
        if (this.subName === 'undefined') {
            console.log('Please setting subName');
            return -1;
        } else if (this.subName === 'getLayers') {
            jsonData = {WorkspaceName : values[0] };
            $.ajax({
                type : 'POST',
                url : this.baseAddr,
                crossDomain: true,
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
            console.log(values[0] + ', ' + values[1]);
            resultData = this.geoServerWFS(this.baseAddr, values[0], values[1]);
            return resultData;
        }
    } else if (this.serverName === 'publicData') {
        if (this.subName === 'TimeAverageAirQuality' ||
                this.subName === 'RealtimeRoadsideStation' ||
                this.subName === 'ArpltnInforInqireSvc') {
            this.publicDataEnv(values[0], values[1], values[2], values[3]);
        }
    }
    
    //return resultData;
};
/**
 *
 *
 *
 */
OGDSM.externalConnection.prototype.geoServerWFS = function (addr, ws, name) {
    var vectorSource, styles, resultData;
    vectorSource = new ol.source.ServerVector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
            var fullAddr = addr + 'geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature' +
                '&typeNames=' + ws + ':' + name +
                '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
                '&srsname=' + 'EPSG:900913' + '&bbox=' + extent.join(',') + ',' + 'EPSG:900913';
            $.ajax({
                url : fullAddr,
                dataType: 'jsonp'
            });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
            maxZoom: 19
        })),
        projection: 'EPSG:900913'
    });
    styles = [
        new ol.style.Style({
            fill: new ol.style.Fill({
                color: '#ff0000'
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 1
            })
        })];
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
 *
 * 1. apikey, 2, vistype, 3. .....
 *
 */
OGDSM.externalConnection.prototype.publicDataEnv = function (apikey, envType, dateOrArea, time) {
    'use strict';
    dateOrArea = (typeof (dateOrArea) !== 'undefined') ? dateOrArea : 'undefined';
    time = (typeof (time) !== 'undefined') ? time : 'undefined';

    var colorRange =
        ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
        range = [],
        jsonData = "",
        setResponseData = this.setResponseData;
    /*
    if (envType === 'PM10' || envType === 'PM25') {
        range = [15, 30, 55, 80, 100, 120, 200];
    } else if (envType === 'CO') {
        range = [1, 2, 5.5, 9, 10.5, 12, 15];
    } else if (envType === 'NO2') {
        range = [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2];
    } else if (envType === 'SO2') {
        range = [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15];
    } else if (envType === 'O3') {
        range = [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3];
    }
    */
    if (this.subName === 'TimeAverageAirQuality') { //envType add... server change...
        jsonData = '{"serviceName":"' + this.subName + '",' +
            ' "keyValue":"' + apikey + '",' +
            '"dateValue":' + '"' + dateOrArea + '",' +
            '"timeValue":' + '"' + time + '"}';

    } else if (this.subName === 'ArpltnInforInqireSvc') {
        jsonData = '{"serviceName":"' + this.subName + '",' +
            ' "keyValue":"' + apikey + '",' +
            '"areaType":' + '"' + encodeURIComponent(dateOrArea) + '",' +
            '"envType":' + '"' + envType + '",' +
            '"provider":' + '"' + 'airkorea' + '"}';
    }
    jsonData = JSON.parse(jsonData);
    $.ajax({
        type : 'POST',
        url : this.baseAddr,
        data : JSON.stringify(jsonData),
        async : false,
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var resultData = msg;
            setResponseData(resultData.data);
        },
        error : function (e) {
            console.log(e);
        }
    });
};
