/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
/**
* Comming Soon...
* @class OGDSM.externalConnection
*/
OGDSM.externalConnection = (function (OGDSM) {
    'use strict';
    var serverName, baseAddr, values = [], setVWorld, setFunc;
    /**
     * externalConnection Class constructor
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
        }
    };
    return OGDSM.externalConnection;
}(OGDSM));
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
    var resultData, values;
    values = this.getValues();
    if (this.serverName === 'vworldWMS') {
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
        return resultData;
    }
};
/*

openGDSM.openGDSMGeoserver = {
	mapLayers : [],
    getLayers : function(){
         data = {WorkspaceName:'opengds'};
		 if(this.mapLayers){
			 $.ajax({
					type:'POST',
					url:serverURL+serverFolder+'getLayerNames.do',
					data: JSON.stringify(data),
					contentType : "application/json;charset=UTF-8",
					dataType : 'json',
					success:function(msg){
						openGDSM.openGDSMGeoserver.mapLayers = msg.data;
					},
					error:function(){
						console.log("err");
					}
			});
		 }
    },
    wfs : function(olmap,url,workspace,layername,color,width,epsg){
        color = (typeof(color) !== 'undefined') ? color : "rgba(255,255,255,0.5)";
        width = (typeof(width) !== 'undefined') ? width : "1";
        epsg = (typeof(espg) !== 'undefined') ? epsg : "EPSG:900913";
        vectorSource = new ol.source.ServerVector({
                    format: new ol.format.GeoJSON(),
                    loader: function(extent, resolution, projection){
                        var urls = url+'geoserver/wfs?service=WFS&' +
                        'version=1.1.0&request=GetFeature' +
                        '&typeNames='+workspace+':'+layername+
                        '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
                        '&srsname='+epsg+'&bbox=' + extent.join(',') + ','+epsg;
                        $.ajax({
                            url : urls,
                            dataType: 'jsonp'
                        });
                    },
                    strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
                        maxZoom: 19
                    })),
                    projection: epsg
                });
                loadFeatures = function(response){
                    vectorSource.addFeatures(vectorSource.readFeatures(response));
                };
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
