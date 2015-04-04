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
            listSize = 220,
            buttonSize = 60,
    //        element = document.createElement('div'),
            element = document.getElementById(listDiv),
            listElement = document.createElement('div'),
            listTitleElement = document.createElement('div'),
            listContentsElement = document.createElement('div'),
            listOlElement = document.createElement('ul'),
            buttonElement = document.createElement('div'),
            btnText = '레이어<br>목록<br>보이기',
            elementCSS = 'position : absolute; background : rgba(255,255,255,0.0); top: 0px; height : 99%;  z-index : 1;',
            olCustomListCSS = 'float : left; padding : 1px;	background : rgba(255,255,255,0.0); height : 100%;' +
                           'width : ' + listSize + 'px;',
            /*listTitleCSS = 'width : 100%; height: 20px; padding-top:8px; text-align:center; background : rgba(255,255,255,0.7);' +
                             'font-size : 75%; font-weight : bold; color : #1c94c4;',*/
            listTitleCSS = 'width: 96.5%; text-align:center;',
            listSlideHideCSS = elementCSS + ' left: ' + -(listSize + 5) + 'px; transition: left 0.1s ease;',
            listSlideShowCSS = elementCSS + ' left: 0px; transition: left 0.1s ease;',
            olCustomButtonCSS = 'cursor:pointer; position : absolute; border-radius : 2px; width:' + buttonSize + 'px; height: 8%; top:91%;',
            buttonFontShowCSS = 'font-size : 75%; font-weight : bold; color : rgba(255, 255, 255,.5); text-align:center; padding-top:12px;',
            buttonFontHideCSS = 'font-size : 75%; font-weight : bold; color : rgba(255, 255, 255,.5); text-align:center; padding-top:12px;',
            buttonSlideShowCSS = olCustomButtonCSS + 'background: rgba(0,60,136,.5); left:' + (listSize + 2) + 'px; ' +
                                 'transition : background 0.1s ease, left 0.1s ease;' + buttonFontShowCSS,
            buttonSlideHideCSS = olCustomButtonCSS + 'background: rgba(0,60,136,.5); left:' + (listSize - buttonSize) + 'px; ' +
                                 'transition : background 0.1s ease, left 0.1s ease;' + buttonFontHideCSS;

        handleList = function (e) {
            var listControl = document.getElementById('listControl');
            if (btnText === '레이어<br>목록<br>보이기') {
                btnText = '레이어<br>목록<br>숨기기';
                element.style.cssText = listSlideShowCSS;
                buttonElement.style.cssText = buttonSlideHideCSS;

            } else {
                btnText = '레이어<br>목록<br>보이기';
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
            arrlabels.unshift(label);
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
    //for (i = labels.length - 1; i >= 0; i--) {
    for (i = 0; i < labels.length; i++) {
        var text = (labels[i].length > 7) ? labels[i].substring(0, 6) + '...' : labels[i];
        olList.prepend('<li style="width:95%; height:40px; padding:0px; top:18px;">' +
                      '<div data-role="controlgroup" data-type="horizontal" style="padding:0px; margin:0px;">' +
                      '<a data-role="button" data-theme="c">' + text + '</a>' +
                      '<a data-role="button" data-icon="arrow-d" data-iconpos="notext" data-theme="d" data-mini="true" class="layer-manager"' +
                      'data-label="' + labels[i] + '" style="background:#7dac2c;">ONOFF</a>' +
                      '<a data-role="button" data-icon="delete" data-iconpos="notext" data-theme="f" data-mini="true" class="layer-manager">' +
                      labels[i] + '</a>' +
                      '</div></li>');
    }
    listRootDiv.trigger("create");
    console.log(labels);
    this.ulObj = Sortable.create(document.getElementById(this.listDiv + 'Contents'), {
        animation: 150,
        filter : '.layer-manager',
        onFilter: function (evt) {
            var type = evt.srcElement.getAttribute('data-icon'),
                labels = thisObj.getLabels(),
                length = labels.length - 1,
                objs = thisObj.getLayersObj(),
                srcNum = Math.abs(length - evt.oldIndex);
            if (type === 'arrow-d') {
                var onoff = evt.srcElement.style.background;
                var layerName = evt.srcElement.getAttribute('data-label');
                if (onoff === 'rgb(125, 172, 44)') {
                    evt.srcElement.style.background = 'rgb(255, 255, 255)';
                    ogdsmObj.setVisible(layerName, false);
                } else {
                    evt.srcElement.style.background = 'rgb(125, 172, 44)';
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
        onUpdate: function (evt) { console.log('onUpdate.foo:', [evt.item, evt.from]); },
        onEnd: function (evt) {
            var labels = thisObj.getLabels(), i,
                objs = thisObj.getLayersObj(),
                ogdsmObj = thisObj.getVisualizationObj(),
                length = labels.length - 1;
            //    srcNum = Math.abs(length - evt.oldIndex),
            //    tarNum = Math.abs(length - evt.newIndex);
            //    tmpLabel = labels[tarNum],
            //    tmpObj = objs[tarNum];
            //labels[srcNum] = labels[tarNum];
            //labels[tarNum] = tmpLabel;
            //objs[srcNum] = objs[tarNum];
            //objs[tarNum] = tmpObj;
            console.log(evt.oldIndex + ' ' + evt.newIndex);

            console.log(labels[evt.oldIndex] + ' ' + labels[evt.newIndex]);
            console.log(labels);
            if (evt.oldIndex > evt.newIndex) {
                /*labels[tarNum] = labels[srcNum];
                var tmp = null;
                for (i = srcNum; i <= tarNum; i++) {
                    if (i === tarNum) {
                        labels[i] = tmpLabel;
                    } else {
                        labels[i] = tmp;
                    }
                    tmp = labels[i];
                }*/
                var changeValue = labels[evt.newIndex];
                console.log(changeValue);
                var tmpValue = null;
                for (i = evt.newIndex; i < evt.oldIndex; i++) {
                    //var tmp = labels[i + 1];
                    labels[i] = labels[i + 1];
                }
                labels[evt.oldIndex] = changeValue;
            } else {
                console.log('down');
            }
            console.log(labels);


            thisObj.setLayersObj(objs);
            thisObj.setLabels(labels);
            /*var srcObj = ogdsmObj.layerCheck(labels[srcNum]);
            var tarObj = ogdsmObj.layerCheck(labels[tarNum]);
            var srcIndex = ogdsmObj.indexOf(ogdsmObj.getMap().getLayers(), srcObj);
            var tarIndex = ogdsmObj.indexOf(ogdsmObj.getMap().getLayers(), tarObj);
            ogdsmObj.getMap().getLayers().setAt(srcIndex, tarObj);
            ogdsmObj.getMap().getLayers().setAt(tarIndex, srcObj);
            for (i = 0; i < objs.length; i++) {
                console.log(ogdsmObj.indexOf(ogdsmObj.getMap().getLayers(), ogdsmObj.layerCheck(labels[i])) + ' ' + labels[i]);
            }
            console.log(labels);*/
        }
    });
};

