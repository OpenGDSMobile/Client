goog.provide('openGDSMobile.MapManager');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');


/**
 * CSS Values..
 */
openGDSMobile.MapManager.listStyle = 'openGDSMobile-Manager-list';

openGDSMobile.MapManager.typeStyle = 'openGDSMobile-Manager-type';

openGDSMobile.MapManager.titleStyle = 'openGDSMobile-Manager-title';

openGDSMobile.MapManager.settingStyle = 'openGDSMobile-Manager-setting';

/**
 * @constructor
 * @param {String} _mapDIV - 지도 DIV 객체
 * @param {Object} _options - 지도 관련 옵션 (JSON 객체)
 * {
 *
 * }
 */
openGDSMobile.MapManager = function (_layerDIV, _visObj, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        width : '100%',
        height : '100%'

    };
    this.rootDOM = goog.dom.getElement(_layerDIV);
    this.mapObj = _visObj;
    defaultOptions.width = this.rootDOM.style.width;
    defaultOptions.height = this.rootDOM.style.width;

    /**
     * 리스트 현황 JSON 객체
     * @type {{length: number, objs: [{floor: number, obj : object}, ...]}
     */
    this.status = {
        length : 0,
        objs : []
    };

    console.log(this.rootDOM);
};

openGDSMobile.MapManager.prototype.addLayer = function (_layerName) {
    if (typeof (_layerName) === 'undefined') {
        console.error('Please input layer name. If you want all the layers that have not been added, Use the addLayers function');
        return -1;
    }
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);


    
};

openGDSMobile.MapManager.prototype.addLayers = function (_options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        //fillColor : null
    };

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    this.mapObj.getLayers();



}
