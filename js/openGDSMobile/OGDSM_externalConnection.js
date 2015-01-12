/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    var values = [], setVWorld, loadFeatures;
    /**
     * externalConnection Class
     * @class OGDSM.externalConnection
     * @constructor
     * @param {String} serverName - External Server Name (vworldWMS/geoServer/publicData)
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
    var resultData,
        values,
        jsonData,
        vectorSource,
        loadFeatures,
        addr = this.baseAddr;
    values = this.getValues();
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
            console.log("getLayers");
            jsonData = {WorkspaceName : values[0] };
            console.log(jsonData);
            $.ajax({
                type : 'POST',
                url : this.baseAddr,
                data : JSON.stringify(jsonData),
                contentType : "application/json;charset=UTF-8",
                dataType : 'json',
                success : function (msg) {
                    resultData = msg;
                    console.log(resultData);
                },
                error : function (e) {
                    console.log(e);
                }

            });

        } else if (this.subName === 'WFS') {//workspace, layerName
            console.log("WFS");
            vectorSource = new ol.source.ServerVector({
                format: new ol.format.GeoJSON(),
                loader: function (extent, resolution, projection) {
                    var fullAddr = addr + 'geoserver/wfs?service=WFS&' +
                        'version=1.1.0&request=GetFeature' +
                        '&typeNames=' + values[0] + ':' + values[1] +
                        '&outputFormat=text/javascript&format_options=callback:loadFeatures1' +
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
            loadFeatures = function (response) {
                vectorSource.addFeatures(vectorSource.readFeatures(response));
            };
            resultData = new ol.layer.Vector({
                title:values[1],
                source: vectorSource
              });
        }
    }

    return resultData;
};

/*
        var styles = [
                    new ol.style.Style({
                      fill: new ol.style.Fill({
                        color: color,
                      }),
                      stroke: new ol.style.Stroke({
                        color: '#000000',
                        width: 1
                      })
                    })];
        var curLayers = olmap.getLayers().getArray();
        for(var i=0; i<curLayers.length; i++){
            if( curLayers[i].get('title') == layername){
                olmap.removeLayer(curLayers[i]);
            }
        }
        var vectorTemp = new ol.layer.Vector({
            title:layername,
            source: vectorSource,
            style: styles
          });
        olmap.addLayer(vectorTemp);
    }
};
*/
