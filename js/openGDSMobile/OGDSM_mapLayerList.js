/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM, d3, Sortable*/
OGDSM.namesapce('mapLayerList');

(function (OGDSM) {
    "use strict";
    var arrlayerObjs = [], arrlabels = [];
    /**
     * 오픈레이어 맵 레이어 목록 객체
     * OpenLayers3 Map layer list class
     * @class OGDSM.mapLayerList
     * @constructor
     * @param {OGDSM.visualization} obj - OGDSM visualization object
     * @param {String} listDiv - List div name
     */
    OGDSM.mapLayerList = function (obj, listDiv) {
        this.listDiv = listDiv;
        this.visualizationObj = obj;
        var thisObj = this;
        var handleList = null, listSize = 200, buttonSize = 120,
            element = document.getElementById(listDiv),
            listElement = document.createElement('div'),
            buttonElement = document.createElement('div'),
            listTitleElement = document.createElement('div'),
            listRootElement = document.createElement('div'),
            listUlElement = document.createElement('ul'),
            btnText = '레이어목록 보이기',
            elementCSS = 'position : absolute; background : rgba(255,255,255,0.0); top: 0px;  z-index : 1;',
            olCustomListCSS = 'float : left; padding : 1px;	background : rgba(255,255,255,0.0); ' +
            'width : ' + listSize + 'px;',
            olCustomButtonCSS = 'cursor:pointer; position : absolute; width:' + buttonSize + 'px; height: 50px;',
            listTitleCSS = 'width: 100%; text-align:center;',
            listUlCSS = 'list-style:none; padding:0; margin:0;',
            listSlideHideCSS = elementCSS + ' left: ' + -(listSize + 3) + 'px; transition: left 0.1s ease;',
            listSlideShowCSS = elementCSS + ' left: 0px; transition: left 0.1s ease;',
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
        listElement.id = listDiv + 'Root';
        listElement.style.cssText = olCustomListCSS;

        listTitleElement.style.cssText = listTitleCSS;
        listTitleElement.setAttribute('class', 'ui-body-a');
        listTitleElement.innerHTML = '<h4>레이어 목록</h4>';

        listRootElement.id = listDiv + 'Div';
        listUlElement.id = listDiv + 'Contents';
        listUlElement.style.cssText = listUlCSS;

        listElement.appendChild(listTitleElement);
        listElement.appendChild(listRootElement);
        listRootElement.appendChild(listUlElement);

        buttonElement.id = listDiv + 'Button';
        buttonElement.className = 'ol-unselectable';
        buttonElement.style.cssText = buttonSlideShowCSS;
        buttonElement.innerHTML = btnText;
        buttonElement.setAttribute('data-role', 'button');

        element.appendChild(listElement);
        element.appendChild(buttonElement);


        this.ulObj = Sortable.create(document.getElementById(this.listDiv + 'Contents'), {
            animation: 150,
            handle: '.drag-handle',
            onUpdate : function (evt) {
                var labels = thisObj.getLabels(), i,
                    objs = thisObj.getLayersObj(),
                    ogdsmObj = thisObj.getVisualizationObj(),
                    length = labels.length - 1,
                    layers = ogdsmObj.getMap().getLayers(),
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
    OGDSM.mapLayerList.prototype = {
        constructor : OGDSM.mapLayerList,
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
            arrlabels.push(label);
        },
        setLabels : function (labels) {
            arrlabels = labels;
        },
        getVisualizationObj : function () {
            return this.visualizationObj;
        },
        getThis : function () {
            return this;
        }
    };
    return OGDSM.mapLayerList;
}(OGDSM));
/**
 * 레이어 목록 관리 - (이름 변경 및 레이어 내용 변경...)
 * list Management.
 * @method listManager
 * @param {ol3 layer object} obj - openlayers3 layer object to be added
 * @param {String} label - list name
 * @param {String} color - rgb color (ex: rgb(255,255,255))
 * @param {String} type - object type (polygon | point | line)
 */
OGDSM.mapLayerList.prototype.listManager = function (obj, label, color, type) {
    'use strict';
    type = (typeof (type) !== 'undefined') ? type : null;
    var i, olList = $('#' + this.listDiv + 'Contents'),
        thisObj = this,
        labels = this.getLabels(),
        objs = this.getLayersObj(),
        ogdsmObj = this.visualizationObj;
    this.setLayerObj(obj);
    this.setLabel(label);
    function sliderEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label'),
            opacityValue = e.currentTarget.value,
            layerObj = ogdsmObj.layerCheck(layerName);
        layerObj.setOpacity(opacityValue / 100.0);
    }
    function deleteEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label');
        var labels = thisObj.getLabels();
        var layerNum = $.inArray(layerName, labels);
        ogdsmObj.removeMap(layerName);
        labels.splice(layerNum, 1);
        objs.splice(layerNum, 1);
        thisObj.setLayersObj(objs);
        thisObj.setLabels(labels);
        $('#layer' + layerName).remove();
        $('#popup' + layerName).hide();
    }
    function checkBoxEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label');
        if (!e.currentTarget.checked) {
            ogdsmObj.setVisible(layerName, false);
        } else {
            ogdsmObj.setVisible(layerName, true);
        }
    }
    var sublabel = label;
    if (label.length > 8) {
        sublabel = sublabel.substr(0, 8) + '...';
    }

    olList.prepend('<li id="layer' + label + '" style="float:left">' +
                   '<div style="width:15%; float:left; margin-top:4px;">' +
                   '<canvas id="' + label + 'canvas" width="100%" height=30px; class="drag-handle" ></canvas>' +
                   '</div> <div style="width:70%; float:left; padding:0px; margin:0px;">' +
                   '<input type="checkbox" name="listCheckBox" data-corners="false" data-mini="true" style="width:100px;" class="custom" ' +
                   'id="' + 'visualSW' + thisObj.getLabels().length + '" data-label="' + label + '" checked/>' +
                   '<label for="' + 'visualSW' + thisObj.getLabels().length + '">' + sublabel + '</label>' +
                   '</div> <div style="width:15%; float:left; padding:0px; margin:0px;">' +
                   '<a data-role="button" data-rel="popup" data-theme="b" data-corners="false" data-mini="true" data-transition="pop"' +
                   'data-label="' + label + '" href="#popup' + label + '">　</a>' +
                   '</div>' +
                   '<div data-role="popup" id="popup' + label + '" style="width:' + 200 + 'px">' +
                   '<input type="range" value="100" min="0" max="100" data-highlight="true" class="layer-manager"' +
                   'id="' + label + 'slider" data-label="' + label + '">' +
                   '<a data-role="button" data-theme="f" data-mini="true"' +
                   'id="' + label + 'delete" data-label="' + label + '">Delete</a>' +
                   '</div>' +
                   '</li>');

    var labelCanvas = document.getElementById(label + 'canvas').getContext('2d');
    if (type === 'polygon') {
        labelCanvas.fillStyle = color;
        labelCanvas.fillRect(5, 5, 20, 20);
        labelCanvas.strokeRect(5, 5, 20, 20);
    } else if (type === 'point') {
        labelCanvas.beginPath();
        labelCanvas.arc(15, 15, 12, 0, 2 * Math.PI);
        labelCanvas.fillStyle = color;
        labelCanvas.fill();
        labelCanvas.stroke();
    } else if (type === 'line') {
        labelCanvas.moveTo(5, 5);
        labelCanvas.lineTo(20, 20);
        labelCanvas.strokeStyle = color;
        labelCanvas.stroke();
    } else {
        labelCanvas.fillStyle = 'rgb(0, 0, 0)';
        labelCanvas.fillRect(5, 5, 20, 20);
        labelCanvas.strokeRect(5, 5, 20, 20);
    }
    $('#layer' + label).trigger('create');
    $('#' + label + 'slider').bind('change', sliderEvent);
    $('#' + label + 'delete').bind('click', deleteEvent);
    $('input[name=listCheckBox]').bind('click', checkBoxEvent);
};
