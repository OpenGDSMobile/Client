goog.provide('openGDSMobile.VWorld');

goog.require('openGDSMobile.util.applyOptions');

/**
 *
 * @param _test
 * @param _apiKey
 * @param _domain
 * @constructor
 */
openGDSMobile.VWorld = function (_test, _apiKey, _domain) {
    this.mapObj = _test.mapObj;
    this.apiKey = _apiKey;
    this.domain = _domain;
}


/**
 *
 * @param title
 * @param _layers
 * @param _styles
 * @returns {ol.layer.Tile}
 * @constructor
 */
openGDSMobile.VWorld.prototype.WMSRequest = function (title, _layers, _styles) {
    var apiKey = this.apiKey;
    var domain = this.domain;
    return new ol.layer.Tile({
        title : title,
        source : new ol.source.TileWMS(({
            url : 'http://map.vworld.kr/js/wms.do',
            params : {
                apiKey : apiKey,
                domain : domain,
                LAYERS : _layers,
                STYLES : _styles,
                FORMAT : 'image/png',
                CRS : 'EPSG:900913',
                EXCEPTIONS : 'text/xml',
                TRANSPARENT : true
            }
        }))
    });
}


/**
 * 
 * @param _title
 * @param _layers
 * @param _styles
 * @param _options
 * @returns {ol.layer.Vector}
 * @constructor
 */
openGDSMobile.VWorld.prototype.WFSRequest = function (_title, _layers, _styles, _options) {
    var apiKey = this.apiKey;
    var domain = this.domain;
    var parameter = 'SERVICE=WFS&' +
                    'REQUEST=GetFeature&' +
                    'TYPENAME=' + _layers + '&' +
                    'BBOX=13987670,3912271,14359383,4642932&' +
                    'VERSION=1.1.0&' +
                    'MAXFEATURES=4000&' +
                    'SRSNAME=EPSG:900913&' +
                    'OUTPUT=text/xml;subType=gml/3.1.1/profiles/gmlsf/1.0.0/0&' +
                    'EXCEPTIONS=text/xml&' +
                    'APIKEY=' + apiKey + '&' +
                    'DOMAIN=' + domain;
    console.log('http://map.vworld.kr/js/wfs.do?' + parameter);
    return new ol.layer.Vector({
        title: _title,
        source: new ol.source.Vector({
                format: new ol.format.WFS(),
                url : function (extent) {
                    return '../test.xml'
                     return 'http://map.vworld.kr/js/wfs.do?' + parameter;
                },
        strategy: ol.loadingstrategy.bbox
        })
    });
}