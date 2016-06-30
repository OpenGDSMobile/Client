goog.provide('openGDSMobile.MapManager');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');


/**
 * CSS Values..
 */
openGDSMobile.MANAGER_ROOT = 'openGDSMobile-manager';

openGDSMobile.MANAGER_LIST_STYLE = 'openGDSMobile-manager-list';

openGDSMobile.MANAGER_ITEM_TYPE_STYLE = 'openGDSMobile-manager-type';

openGDSMobile.MANAGER_ITEM_TITLE_STYLE = 'openGDSMobile-manager-title';

openGDSMobile.MANAGER_ITEM_SETTING_STYLE = 'openGDSMobile-manager-setting';

openGDSMobile.SORTABLE_STYLE = 'drag-handler';

openGDSMobile.MANAGER_ITEM_TYPE_CANVAS_STYLE = 'openGDSMobile-manager-canvas';
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
        height : '100%',
        fillColor : 'rgba(255, 255, 255, 0.5)'
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    this.rootDOM = goog.dom.getElement(_layerDIV);
    this.listDOM = goog.dom.createDom('ul', {
        'id' : 'openGDSMobileManager',
        'class' : openGDSMobile.MANAGER_ROOT,
        'style' : 'background-color:' + options.fillColor
    });
    this.visObj = _visObj;
    goog.dom.append(this.rootDOM, this.listDOM);
    options.width = this.rootDOM.style.width;
    options.height = this.rootDOM.style.width;


    /**
     * 리스트 현황 JSON 객체
     * @type {{length: number, objs: [{floor: number, obj : object}, ...]}
     */
    this.status = {
        length : 0,
        objs : []
    };
};

openGDSMobile.MapManager.drawCanvas = function (_canvasID, _type, _fillColor, _x, _y) {

    var padding = 20;
    var startX = 0 + padding;
    var startY = 0 + padding;
    _x = _x - (padding*2);
    _y = _y - (padding*2);

    var labelCanvas = document.getElementById(_canvasID).getContext('2d');
    if (_type === 'polygon') {
        labelCanvas.fillStyle = _fillColor;
        labelCanvas.fillRect(startX, startY, _x, _y);
        labelCanvas.lineWidth = 5;
        labelCanvas.strokeStyle = 'rgb(0, 0, 0)';
        labelCanvas.strokeRect(startX, startY, _x, _y);
    } else if (_type === 'point') {
        labelCanvas.beginPath();
        labelCanvas.arc(15, 15, 12, 0, 2 * Math.PI);
        labelCanvas.fillStyle = _fillColor;
        labelCanvas.fill();
        labelCanvas.stroke();
    } else if (_type === 'line') {
        labelCanvas.moveTo(startX, startY);
        labelCanvas.lineTo(_x, _y);
        labelCanvas.strokeStyle = _fillColor;
        labelCanvas.lineWidth = 10;
        labelCanvas.stroke();
    } else {
        labelCanvas.fillStyle = 'rgb(0, 0, 0)';
        labelCanvas.fillRect(startX, startY, _x, _y);
        labelCanvas.strokeRect(startX, startY, _x, _y);
    }

    /***
        향후 리사이즈 되었을 때... 같이 줄어드는 내용.. 추가 예정
     */

};

openGDSMobile.MapManager.prototype.addLayer = function (_layerName) {
    if (typeof (_layerName) === 'undefined') {
        console.error('Please input layer name. If you want all the layers that have not been added, Use the addLayers function');
        return -1;
    }
    var layerObj = openGDSMobile.util.getOlLayer(this.visObj.mapObj, _layerName);

    var type = layerObj.get('type');
    var title = layerObj.get('title');
    var fillColor = layerObj.get('fillColor');

    var itemDOM = goog.dom.createDom('li',{
        'class' : openGDSMobile.MANAGER_LIST_STYLE
    });
    if (this.status.length === 0) {
        this.listDOM.appendChild(itemDOM);
    } else {
        this.listDOM.insertBefore(itemDOM, this.listDOM.firstChild);
    }
    var typeDOM = goog.dom.createDom('div',{
        'class' : openGDSMobile.MANAGER_ITEM_TYPE_STYLE
    });
    var titleDOM = goog.dom.createDom('div', {
        'class' : openGDSMobile.MANAGER_ITEM_TITLE_STYLE
    }, title);
    var settingDOM = goog.dom.createDom('div', {
        'class' : openGDSMobile.MANAGER_ITEM_SETTING_STYLE
    });

    itemDOM.appendChild(typeDOM);
    itemDOM.appendChild(titleDOM);
    itemDOM.appendChild(settingDOM);

    var canvasDOM = goog.dom.createDom('canvas', {
        'id' : 'canvas-' + title,
        'class' : ' '+ openGDSMobile.MANAGER_ITEM_TYPE_CANVAS_STYLE +' ' + openGDSMobile.SORTABLE_STYLE
    });
    typeDOM.appendChild(canvasDOM);
    //type = 'line';
    openGDSMobile.MapManager.drawCanvas('canvas-' + title, type, fillColor, canvasDOM.width, canvasDOM.height);


    this.status.objs.push({
       floor : this.status.length,
       obj : layerObj
    });
    this.status.length++;

};

openGDSMobile.MapManager.prototype.addLayers = function (_options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        //fillColor : null
    };

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    this.mapObj.getLayers();



}
