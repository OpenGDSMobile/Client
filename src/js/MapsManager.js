goog.provide('openGDSMobile.MapManager');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.events');
goog.require('goog.events.EventType');



/**
 * CSS / ID Values..
 */
openGDSMobile.Manager = {};

openGDSMobile.Manager.SORTABLE_STYLE = 'drag-handle';

openGDSMobile.Manager.MANAGER_ID = 'openGDSMobileManager';

openGDSMobile.Manager.MANAGER_STYLE = 'openGDSMobile-manager';

openGDSMobile.Manager.MANAGER_LIST_STYLE = 'openGDSMobile-manager-list';

openGDSMobile.Manager.MANAGER_ITEM_TYPE_STYLE = 'openGDSMobile-manager-type';

openGDSMobile.Manager.MANAGER_ITEM_TYPE_CANVAS_STYLE = 'openGDSMobile-manager-canvas';

openGDSMobile.Manager.MANAGER_ITEM_TITLE_STYLE = 'openGDSMobile-manager-title';

openGDSMobile.Manager.MANAGER_ITEM_SETTING_STYLE = 'openGDSMobile-manager-setting';

openGDSMobile.Manager.MANAGER_SETTING_BTN_STYLE = 'openGDSMobile-manager-setting-btn'

openGDSMobile.Manager.MANAGER_SETTING_PANEL = 'openGDSMobile-manager-setting-panel'

openGDSMobile.Manager.MANAGER_SETTING_PANEL_TITLE = 'openGDSMobile-manager-setting-panel-title';

openGDSMobile.Manager.MANAGER_SETTING_PANEL_CLOSE = 'openGDSMobile-manager-setting-panel-close';



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
        'id' : openGDSMobile.Manager.MANAGER_ID,
        'class' : openGDSMobile.Manager.MANAGER_STYLE,
        'style' : 'background-color:' + options.fillColor
    });
    this.visObj = _visObj;
    goog.dom.append(this.rootDOM, this.listDOM);
    options.width = this.rootDOM.style.width;
    options.height = this.rootDOM.style.width;


    this.sortObj = Sortable.create(document.getElementById('openGDSMobileManager'), {
        animation: 150,
        handle: '.' + openGDSMobile.SORTABLE_STYLE,
        onUpdate : function (evt) {
            var length = openGDSMobile.listStatus.length - 1;
            var targetObj = openGDSMobile.listStatus.objs[length - evt.oldIndex];
            var layers = _visObj.mapObj.getLayers().getArray();

            if (evt.oldIndex > evt.newIndex) {  // up
                for (var i = length - evt.oldIndex; i < length - evt.newIndex; i++) {
                    openGDSMobile.listStatus.objs[i] = openGDSMobile.listStatus.objs[i + 1];
                    openGDSMobile.listStatus.objs[i].obj.setZIndex(i + 1);
                }
            } else {  // down
                for (var i = length - evt.oldIndex; i > length - evt.newIndex; i--) {
                    openGDSMobile.listStatus.objs[i] = openGDSMobile.listStatus.objs[i - 1];
                    openGDSMobile.listStatus.objs[i].obj.setZIndex(i + 1);
                }
            }
            openGDSMobile.listStatus.objs[length - evt.newIndex] = targetObj;
            openGDSMobile.listStatus.objs[length - evt.newIndex].obj.setZIndex( (length - evt.newIndex) + 1);


        }
    });
};

/**
 *
 * @param _canvasID
 * @param _type
 * @param _fillColor
 * @param _x
 * @param _y
 */
openGDSMobile.MapManager.drawCanvas = function (_canvasID, _type, _fillColor, _x, _y) { var padding = 20;
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

/**
 *
 * @param _layerName
 * @returns {number}
 */
openGDSMobile.MapManager.prototype.addItem = function (_layerName) {
    if (typeof (_layerName) === 'undefined') {
        console.error('Please input layer name. If you want all the layers that have not been added, Use the addLayers function');
        return -1;
    }
    for(var i = 0; i < openGDSMobile.listStatus.length; i++) {
        if (openGDSMobile.listStatus.objs[i].title === _layerName) {
            console.log('exist layer in list. Therefore not is added');
            return -1;
        }
    }

    var layerObj = openGDSMobile.util.getOlLayer(this.visObj.mapObj, _layerName);

    var type = layerObj.get('type');
    var title = layerObj.get('title');
    var fillColor = layerObj.get('fillColor');

    var itemDOM = goog.dom.createDom('li',{
        'class' : openGDSMobile.Manager.MANAGER_LIST_STYLE
    });
    if (openGDSMobile.listStatus.length === 0) {
        this.listDOM.appendChild(itemDOM);
    } else {
        this.listDOM.insertBefore(itemDOM, this.listDOM.firstChild);
    }

    /*Type Root**/
    var typeDOM = goog.dom.createDom('div',{
        'class' : openGDSMobile.Manager.MANAGER_ITEM_TYPE_STYLE
    });
    itemDOM.appendChild(typeDOM);
    /*Title Root**/
    var titleRootDOM = goog.dom.createDom('div', {
        'id' : 'openGDSMobileWrapper'
    });
    var titleCellDOM = goog.dom.createDom('div', {
        'id' : 'openGDSMobileCell'
    });
    titleRootDOM.appendChild(titleCellDOM);
    itemDOM.appendChild(titleRootDOM);
    /*Setting Root**/
    var settingDOM = goog.dom.createDom('div', {
        'class' : openGDSMobile.Manager.MANAGER_ITEM_SETTING_STYLE
    });
    itemDOM.appendChild(settingDOM);


    /*Type Content**/
    var canvasDOM = goog.dom.createDom('canvas', {
        'id' : 'canvas-' + title,
        'class' : ' '+ openGDSMobile.Manager.MANAGER_ITEM_TYPE_CANVAS_STYLE +' ' + openGDSMobile.SORTABLE_STYLE
    });
    typeDOM.appendChild(canvasDOM);
    //type = 'line';
    openGDSMobile.MapManager.drawCanvas('canvas-' + title, type, fillColor, canvasDOM.width, canvasDOM.height);
    /*Title Content**/
    var titleDOM = goog.dom.createDom('div', {
        'class' : openGDSMobile.Manager.MANAGER_ITEM_TITLE_STYLE
    }, title);
    titleCellDOM.appendChild(titleDOM);

    /*Setting Content**/
    var setBtnDOM = new goog.ui.Button('Setting');
    setBtnDOM.render(settingDOM);
    setBtnDOM.addClassName(openGDSMobile.Manager.MANAGER_SETTING_BTN_STYLE);
    setBtnDOM.setTooltip(title + ' setting Button');
    setBtnDOM.setValue(title);
    goog.events.listen(setBtnDOM,
        goog.ui.Component.EventType.ACTION,
        function (e) {
            //console.log(e.target.getValue());
            var settingBtns = goog.dom.getElementsByTagNameAndClass('button', openGDSMobile.Manager.MANAGER_SETTING_BTN_STYLE);
            goog.array.forEach(settingBtns, function (obj){
                var tmpBtn = new goog.ui.Button();
                tmpBtn.decorate(obj);
                tmpBtn.setEnabled(false);
            });
            var title =  e.target.getValue();
            //중앙 DIV 패널
            var panelDOM = goog.dom.createDom('div', {
                'id' : 'settingPanel',
                'class' : openGDSMobile.Manager.MANAGER_SETTING_PANEL
            });
            document.body.appendChild(panelDOM);
            //Title
            var titleDOM = goog.dom.createDom('h2', {
                'class' : openGDSMobile.Manager.MANAGER_SETTING_PANEL_TITLE
            }, title);
            panelDOM.appendChild(titleDOM);
            //투명도 슬라이드..
            //색상 변경
            //두깨 변경
            //글자 크기 변경
            //종료 버튼
            var closeBtnDOM = new goog.ui.Button('Close');
            closeBtnDOM.render(panelDOM);
            closeBtnDOM.addClassName(openGDSMobile.Manager.MANAGER_SETTING_PANEL_CLOSE);
            goog.events.listen(closeBtnDOM,
                goog.ui.Component.EventType.ACTION,
                function (e) {
                    document.body.removeChild(panelDOM);
                    goog.array.forEach(settingBtns, function (obj){
                        var tmpBtn = new goog.ui.Button();
                        tmpBtn.decorate(obj);
                        tmpBtn.setEnabled(true);
                    });
                });
        }
    );

    

    /*********************/
    openGDSMobile.listStatus.objs.push({
       title : title,
       obj : layerObj
    });
    layerObj.setZIndex(++openGDSMobile.listStatus.length);
};

/**
 *
 */
openGDSMobile.MapManager.prototype.addItems = function () {
    var allLayers = this.visObj.mapObj.getLayers().getArray();

    for(var i = 1; i < allLayers.length; i++) {
        this.addLayer(allLayers[i].get('title'));
    }
};

/**
 *
 * @param _layerName
 * @returns {number}
 */
openGDSMobile.MapManager.prototype.removeItem = function (_layerName) {
    if (typeof (_layerName) === 'undefined') {
        console.error('Please input layer name. ' +
            'If you want all the layers that have not been removed, ' +
            'Use the removeLayers function');
        return -1;
    }
    var layerObj = openGDSMobile.util.getOlLayer(this.visObj.mapObj, _layerName);
    //console.log(layerObj);
    if (layerObj === false) {
        console.error('Not exist layer in list. Therefore not is removed');
        return -1;
    }
    this.visObj.mapObj.removeLayer(layerObj);

    var ulDOM = goog.dom.getElement(openGDSMobile.Manager.MANAGER_ID);
    var items = ulDOM.getElementsByTagName('li');
    goog.array.forEach(items, function (obj, index, arr) {
        var el = goog.dom.getElementsByTagNameAndClass(
            'div',
            openGDSMobile.Manager.MANAGER_ITEM_TITLE_STYLE,
            obj);
        if (el[0].innerHTML === _layerName) {
            obj.parentNode.removeChild(obj);
            openGDSMobile.listStatus.objs.splice(openGDSMobile.listStatus.length - index, 1);
        }
    });
}


/**
 * 
 */
openGDSMobile.MapManager.prototype.removeItems = function () {
    var allLayers = this.visObj.mapObj.getLayers().getArray();
    for(var i = 1; i < allLayers.length; i++) {
        this.removeLayer(allLayers[i].get('title'));
    }
}

goog.exportSymbol('openGDSMobile.MapManager', openGDSMobile.MapManager);