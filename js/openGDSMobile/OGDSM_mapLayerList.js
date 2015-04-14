/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM, d3, Sortable*/
OGDSM.namesapce('mapLayerList');

(function (OGDSM) {
    "use strict";
    var arrlayerObjs = [], arrlabels = [];
    /**
    * OpenLayers3 Map Layer List Class
    * @class OGDSM.mapLayerList
    * @constructor
    * @param {OGDSM.visualization} OGDSM.visualization Object
    */
    OGDSM.mapLayerList = function (obj, listDiv) {
        this.listDiv = listDiv;
        this.visualizationObj = obj;
        var handleList = null,
            listSize = 200,
            buttonSize = 120,
    //        element = document.createElement('div'),
            element = document.getElementById(listDiv),
            listElement = document.createElement('div'),
            listTitleElement = document.createElement('div'),
            listContentsElement = document.createElement('div'),
            listOlElement = document.createElement('ul'),
            buttonElement = document.createElement('div'),
            btnText = '레이어목록 보이기',
            elementCSS = 'position : absolute; background : rgba(255,255,255,0.0); top: 0px; height : 99%;  z-index : 1;',
            olCustomListCSS = 'float : left; padding : 1px;	background : rgba(255,255,255,0.0); height : 100%;' +
                           'width : ' + listSize + 'px;',
            listTitleCSS = 'width: 100%; text-align:center;',
            listSlideHideCSS = elementCSS + ' left: ' + -(listSize + 5) + 'px; transition: left 0.1s ease;',
            listSlideShowCSS = elementCSS + ' left: 0px; transition: left 0.1s ease;',
            olCustomButtonCSS = 'cursor:pointer; position : absolute; width:' + buttonSize + 'px; height: 50px;',
            buttonFontShowCSS = 'font-size : 90%; font-weight : bold; color : rgba(0, 0, 0,1.0); text-align:center;',
            buttonFontHideCSS = 'font-size : 90%; font-weight : bold; color : rgba(0, 0, 0,.5); text-align:center;',
            buttonSlideShowCSS = olCustomButtonCSS + 'background: rgba(255, 255, 255, 0.5); left:' + (listSize + 2) + 'px; ' +
                                 'transition : background 0.1s ease, left 0.1s ease;' + buttonFontShowCSS,
            buttonSlideHideCSS = olCustomButtonCSS + 'background: rgba(0, 0, 0, .0); left:' + (listSize - buttonSize) + 'px; ' +
                                 'transition : background 0.1s ease, left 0.1s ease;' + buttonFontHideCSS;

        handleList = function (e) {
            var listControl = document.getElementById('listControl');
            if (btnText === '레이어목록 보이기') {
                btnText = '레이어목록 숨기기';
                element.style.cssText = listSlideShowCSS;
                buttonElement.style.cssText = buttonSlideHideCSS;

            } else {
                btnText = '레이어목록 보이기';
                element.style.cssText = listSlideHideCSS;
                buttonElement.style.cssText = buttonSlideShowCSS;
            }
            buttonElement.innerHTML = btnText;
        };

        buttonElement.addEventListener('click', handleList, false);
        buttonElement.addEventListener('touchstart', handleList, false);

        element.style.cssText = listSlideHideCSS;
        //element.id = 'listControl';
        listElement.id = listDiv + 'Root';
        listElement.style.cssText = olCustomListCSS;

        listTitleElement.style.cssText = listTitleCSS;
        listTitleElement.setAttribute('class', 'ui-body-a');
        listTitleElement.innerHTML = '<h4>레이어 목록</h4>';

        listContentsElement.id = listDiv + 'Div';
        listOlElement.id = listDiv + 'Contents';
        listOlElement.setAttribute('data-role', 'listview');
        listOlElement.setAttribute('data-inset', 'true');

        listElement.appendChild(listTitleElement);
        listElement.appendChild(listContentsElement);
        listContentsElement.appendChild(listOlElement);

        buttonElement.id = listDiv + 'Button';
        buttonElement.className = 'ol-unselectable';
        buttonElement.style.cssText = buttonSlideShowCSS;
        buttonElement.innerHTML = btnText;
        buttonElement.setAttribute('data-role', 'button');

        element.appendChild(listElement);
        element.appendChild(buttonElement);
    };
    OGDSM.mapLayerList.prototype = {
        constructor : OGDSM.mapLayerList,
        /**
         * getMap Method get map object about OpenLayers3.
         * @method getMap
         * @return {ol.Map} Retrun is OpenLayers object.
         */
        tmp : function () {
            return null;
        },
        getLayersObj : function () {
            return arrlayerObjs;
        },
        setLayerObj : function (obj) {
            arrlayerObjs.push(obj);
        },
        setLayersObj : function (objs) {
            arrlayerObjs = objs;
        },
        getLabels : function () {
            return arrlabels;
        },
        setLabel : function (label) {
        //    arrlabels.push(label);
            arrlabels.push(label);
        },
        setLabels : function (labels) {
            arrlabels = labels;
        },
        getVisualizationObj : function () {
            return this.visualizationObj;
        }
    };
    return OGDSM.mapLayerList;
}(OGDSM));
/**
 * Add List.
 * @method addList
 * @return {ol.Map} Retrun is OpenLayers object.
 */
OGDSM.mapLayerList.prototype.addList = function (obj, label) {
    'use strict';
    var i, listRootDiv = $('#' + this.listDiv + 'Div'),
        thisObj = this,
        listOlElement = document.createElement('ul'),
        labels = this.getLabels(),
        objs = this.getLayersObj(),
        ogdsmObj = this.visualizationObj;
    listRootDiv.empty();
    this.setLayerObj(obj);
    this.setLabel(label);
    listOlElement.id = this.listDiv + 'Contents';
    listOlElement.setAttribute('data-role', 'listview');
    listRootDiv.append(listOlElement);
    var olList = $('#' + this.listDiv + 'Contents');
    function test() {

    }
    /*
    olList.prepend('<li style="width:95%; height:80px; padding:0px; top:18px; padding-left:5px;">' +
                      '<div data-role="controlgroup" data-type="horizontal" style="padding:0px; margin:0px; padding-left:10px;">' +
                      '<a data-role="button" data-theme="c" data-mini="true" >' + text + '</a>' +
                      '<a data-role="button" data-icon="arrow-d" data-iconpos="notext" data-theme="d" data-mini="true" class="layer-manager"' +
                      'data-label="' + labels[i] + '" style="background:#7dac2c;">ONOFF</a>' +
                      '<a data-role="button" data-icon="delete" data-iconpos="notext" data-theme="f" data-mini="true" class="layer-manager">' +
                      labels[i] + '</a>' +
                      '</div>' +
                      '<div  style="padding:0px; margin:0px; padding-left:10px;">' +
                      '<input type="range" id="' + labels[i] + 'slider" value="100" min="0" max="100" data-highlight="true">' +
                      '</div>' +
                      '</li>');
                      */
    function sliderEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label'),
            opacityValue = e.currentTarget.value,
            layerObj = ogdsmObj.layerCheck(layerName);
        layerObj.setOpacity(opacityValue / 100.0);
    }
    for (i = 0; i < labels.length; i++) {
        var text = (labels[i].length > 9) ? labels[i].substring(0, 9) + '...' : labels[i];
        olList.prepend('<li style="width:94%; height:72px; padding:0px; top:18px; padding-top:4px;">' +
                      '<div data-role="controlgroup" data-type="horizontal" style="margin:0px; padding-left:18px;">' +
                      '<a data-role="button" data-theme="c" data-mini="true" style="width:85px;">' + text + '</a>' +
                      '<a data-role="button" data-theme="d" data-mini="true" class="layer-manager" data-value="onoff"' +
                      'data-label="' + labels[i] + '" style="background:#7dac2c;">ON</a>' +
                      '<a data-role="button" data-theme="f" data-mini="true" class="layer-manager" data-value="delete"' +
                      'data-label="' + labels[i] + '">Delete</a>' +
                      '</div>' +
                      '<div  style="padding:0px; margin:0px; padding-left:18px;">' +
                      '<input type="range" value="100" min="0" max="100" data-highlight="true"' +
                      'id="' + labels[i] + 'slider" data-label="' + labels[i] + '">' +
                      '</div>' +
                      '</li>');
    }
    listRootDiv.trigger("create");
    for (i = 0; i < labels.length; i++) {
        $('#' + labels[i] + 'slider').bind('change', sliderEvent);
    }
    this.ulObj = Sortable.create(document.getElementById(this.listDiv + 'Contents'), {
        animation: 150,
        filter : '.layer-manager',
        onFilter: function (evt) {
            var type = evt.srcElement.getAttribute('data-value'),
                labels = thisObj.getLabels(),
                length = labels.length - 1,
                objs = thisObj.getLayersObj(),
                srcNum = Math.abs(length - evt.oldIndex);
            if (type === 'onoff') {
                var onoff = evt.srcElement.style.background;
                var layerName = evt.srcElement.getAttribute('data-label');
                if (onoff === 'rgb(125, 172, 44)') {
                    evt.srcElement.style.background = 'rgb(255, 255, 255)';
                    evt.srcElement.childNodes[0].childNodes[0].innerHTML = 'OFF';
                    ogdsmObj.setVisible(layerName, false);
                } else {
                    evt.srcElement.style.background = 'rgb(125, 172, 44)';
                    evt.srcElement.childNodes[0].childNodes[0].innerHTML = 'ON';
                    ogdsmObj.setVisible(layerName, true);
                }
            } else if (type === 'delete') {
                ogdsmObj.removeMap(labels[srcNum]);
                evt.item.parentNode.removeChild(evt.item);
                labels.splice(srcNum, 1);
                objs.splice(srcNum, 1);
                thisObj.setLayersObj(objs);
                thisObj.setLabels(labels);
            }
        },
        onUpdate : function (evt) {
            var labels = thisObj.getLabels(), i,
                objs = thisObj.getLayersObj(),
                ogdsmObj = thisObj.getVisualizationObj(),
                length = labels.length - 1,
                layers = ogdsmObj.getMap().getLayers(),
                layerObj = null,
                changeValue = labels[length - evt.oldIndex],
                changeObj = objs[length - evt.oldIndex];
            if (evt.oldIndex > evt.newIndex) {
                for (i = length - evt.oldIndex; i < length - evt.newIndex; i++) {
                    labels[i] = labels[i + 1];
                    objs[i] = objs[i + 1];
                }
                labels[length - evt.newIndex] = changeValue;
                objs[length - evt.newIndex] = changeObj;
            } else {
                for (i = length - evt.oldIndex; i > length - evt.newIndex; i--) {
                    labels[i] = labels[i - 1];
                    objs[i] = objs[i - 1];
                }
                labels[length - evt.newIndex] = changeValue;
                objs[length - evt.newIndex] = changeObj;
            }
            for (i = 0; i < objs.length; i++) {
                layers.setAt(i + 1, objs[i]);
            }
            thisObj.setLayersObj(objs);
            thisObj.setLabels(labels);
        }
    });
};

