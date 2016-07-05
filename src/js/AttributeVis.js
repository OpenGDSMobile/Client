goog.provide('openGDSMobile.AttributeVis');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.ui.LabelInput');


openGDSMobile.Attribute = {};

openGDSMobile.Attribute.PANEL_STYLE = 'openGDSMobile-attr-panel';

openGDSMobile.Attribute.PANEL_INPUT_STYLE = 'openGDSMobile-attr-textInput';


openGDSMobile.attrListStatus = {
    length : 0,
    objs : []
};

openGDSMobile.AttributeVis = function (_addr, _mapObj, _options) {
    _mapObj = (typeof (_mapObj) !== 'undefined') ? _mapObj : null;
    _options = (typeof (_options) !== 'undefined') ? _options : {};

    var defaultOptions = {
        attrKey : null,
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        strokeWidth : 1,
        radius : 5,
        opt : 1.0
    };

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    this.options = options;
    this.addr = _addr;

    if (_mapObj === null) {
        console.log("Only attribute visualization. Not linked map.");
    } else {
        var attrPanelDOM = goog.dom.createDom('div',{
            'id' : 'openGDSMobileAttr',
            'class' : openGDSMobile.Attribute.PANEL_STYLE
        });
        document.body.appendChild(attrPanelDOM);
        this.mapObj = _mapObj.mapObj;

        this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element : attrPanelDOM,
            autoPan : true,
            autoPanAnimation: {
                duration: 250
            }
        }));
        this.mapObj.addOverlay(this.overlay);
    }
};


openGDSMobile.AttributeVis.textStyleFunction = function (feature, resolution, attrKey) {
    return new ol.style.Text({
        text : resolution < 76 ? feature.get(attrKey) : ''
    });
};

openGDSMobile.AttributeVis.styleFunction = function (feature, resolution, options) {
    var type = feature.getGeometry().getType();
    if (type === 'MultiPolygon') {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: options.strokeColor,
                width: options.strokeWidth
            }),
            fill: new ol.style.Fill({
                color: options.fillColor
            }),
            text: openGDSMobile.AttributeVis.textStyleFunction(feature, resolution, options.attrKey)
        });
    } else if (type === 'line') {

    } else if (type === 'point') {
        return new ol.style.Style({
            image : new ol.style.Circle({
                radius : options.radius,
                stroke : new ol.style.Stroke({
                    color: options.strokeColor,
                    width: options.strokeWidth
                }),
                fill : new ol.style.Fill({
                    color : options.fillColor
                }),
                text: openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
            })
        })
    }
}

openGDSMobile.AttributeVis.prototype.addAttr = function (_layerName) {
    var addr = this.addr;
    var mapObj = this.mapObj;
    var options = this.options;
    var overlay = this.overlay;
    var layer = openGDSMobile.util.getOlLayer(mapObj, _layerName);
    console.log(layer);
    options.attrKey = layer.get('attrKey');
    /***
     * 모든 객체...
     */
    var obj = {
        layerName : _layerName
    };
    /*
     ++openGDSMobile.attrListStatus;
     console.log(openGDSMobile.attrListStatus);
     openGDSMobile.attrListStatus.objs.push({
     layerName : _layerName
     });
     */

    var select = new ol.interaction.Select({
        condition: ol.events.condition.click,
        style : (function (feature, resolution) {
            return openGDSMobile.AttributeVis.styleFunction(feature, resolution, options);
        })
    });

    mapObj.addInteraction(select);
    select.on('select', function(e) {
        // 여기에다가 ......
        if (e.selected.length !== 0) {
            overlay.setPosition(e.mapBrowserEvent.coordinate);
            //console.log(e.selected[0]);
            var obj = e.selected[0].getProperties();
            var keys = [];
            for (var k in obj) {
                if (k !== 'geometry') {
                    keys.push(k);
                }
            }
            var attrDOM = goog.dom.getElement('openGDSMobileAttr');
            attrDOM.innerHTML = null;
            var titleDOM = goog.dom.createDom('h4', {
                'style' : 'text-align:center; margin:0px;'
            }, obj[options.attrKey]);

            attrDOM.appendChild(titleDOM);
            var tableDOM = goog.dom.createDom('table', {
                //style 적용

            });
            var theadDOM = goog.dom.createDom('thead', {
                //style 적용

            });
            var tbodyDOM = goog.dom.createDom('tbody', {
                //style 적용

            });
            tableDOM.appendChild(theadDOM);
            tableDOM.appendChild(tbodyDOM);
            attrDOM.appendChild(tableDOM);
            var theadTrDOM = goog.dom.createDom('tr', {
                //style 적용
            });
            var tbodyTrDOM = goog.dom.createDom('tr', {
                //style 적용
            });
            theadDOM.appendChild(theadTrDOM);
            tbodyDOM.appendChild(tbodyTrDOM);
            for (var j = 0; j < keys.length; j++){
                var thDOM = goog.dom.createDom('th', {
                    //style 적용
                }, keys[j]);
                var tdDOM = goog.dom.createDom('td', {
                    //style 적용
                });
                var inputDOM = new goog.ui.LabelInput('');
                inputDOM.render(tdDOM);
                inputDOM.setValue(obj[keys[j]]);
                goog.dom.classlist.add(inputDOM.getElement(), openGDSMobile.Attribute.PANEL_INPUT_STYLE);
                inputDOM.setEnabled(false);

                theadTrDOM.appendChild(thDOM);
                tbodyTrDOM.appendChild(tdDOM);
            }
            //모든 객체 저장..??
        } else {
            overlay.setPosition(undefined);
        }
    });
};
/*
 openGDSMobile.AttributeVis.prototype.addAttr = function (_tableName, _layerName) {
 var addr = this.addr;
 var mapObj = this.mapObj;
 var options = this.options;
 var overlay = this.overlay;
 var data = {
 tableName : _tableName
 }
 var layer = openGDSMobile.util.getOlLayer(mapObj, _layerName);
 options.attrKey = layer.get('attrKey');
 console.log(openGDSMobile.attrListStatus.objs);
 var statusObj = openGDSMobile.attrListStatus.objs;
 $.ajax({
 type : 'POST',
 url : addr,
 data : JSON.stringify(data),
 contentType : "application/json;charset=UTF-8",
 dataType : 'json',
 success : function (msg) {
 console.log(msg);
 ++openGDSMobile.attrListStatus;
 var obj = {
 attrObj : msg.data,
 tableName : _tableName,
 layerName : _layerName
 }

 statusObj.push(obj);
 var select = new ol.interaction.Select({
 condition: ol.events.condition.click,
 style : (function (feature, resolution) {
 return openGDSMobile.AttributeVis.styleFunction(feature, resolution, options);
 })
 });
 mapObj.addInteraction(select);
 select.on('select', function(e) {
 // 여기에다가 ......
 console.log(e.selected);
 if (e.selected.length !== 0) {
 overlay.setPosition(e.mapBrowserEvent.coordinate);
 console.log(e.selected[0].getProperties());
 console.log(openGDSMobile.attrListStatus.objs);

 } else {
 overlay.setPosition(undefined);
 }
 });

 },
 error : function (error) {
 console.log(error);
 }
 });
 };
 */
openGDSMobile.AttributeVis.prototype.removeAttr = function (_tableName, _layerName) {

};

openGDSMobile.AttributeVis.prototype.allDisplay = function (_layerName) {


};