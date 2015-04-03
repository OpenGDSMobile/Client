/*jslint devel: true, vars : true */
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
        var handleList = null,
            listSize = 200,
            buttonSize = 60,
    //        element = document.createElement('div'),
            element = document.getElementById(listDiv),
            listElement = document.createElement('div'),
            listTitleElement = document.createElement('p'),
            listOlElement = document.createElement('ul'),
            buttonElement = document.createElement('div'),
            btnText = '레이어<br>목록<br>보이기',
            elementCSS = 'position : absolute; background : rgba(255,255,255,0.0); top: 0px; height : 99%;  z-index : 999;',
            olCustomListCSS = 'float : left; padding : 1px;	background : rgba(255,255,255,0.3); height : 100%;' +
                           'width : ' + listSize + 'px;',
            listTitleCSS = 'width : 100%; height: 20px; padding-top:8px; text-align:center; background : rgba(255,255,255,0.7);' +
                             'font-size : 75%; font-weight : bold; color : #1c94c4;',
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
        listElement.id = listDiv + 'Div';
        listElement.style.cssText = olCustomListCSS;

        listTitleElement.style.cssText = listTitleCSS;
        listTitleElement.innerHTML = '레이어 목록';
        listOlElement.id = listDiv + 'Contents';
        listOlElement.setAttribute('data-role', 'listview');
        listOlElement.setAttribute('data-inset', 'true');

        listElement.appendChild(listTitleElement);
        listElement.appendChild(listOlElement);

        buttonElement.id = listDiv + 'Button';
        buttonElement.className = 'ol-unselectable';
        buttonElement.style.cssText = buttonSlideShowCSS;
        buttonElement.innerHTML = btnText;

        element.appendChild(listElement);
        element.appendChild(buttonElement);
        this.ulObj = Sortable.create(document.getElementById(this.listDiv + 'Contents'), {
            animation: 150,
            store : {
                get: function (sortable) {
                    var order = localStorage.getItem(sortable.options.group);
                    return order ? order.split('|') : [];
                },
                set: function (sortable) {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group, order.join('|'));
                }
            },
            onAdd: function (evt) { console.log('onAdd.foo:', [evt.item, evt.from]); },
            onUpdate: function (evt) { console.log('onUpdate.foo:', [evt.item, evt.from]); },
            onRemove: function (evt) { console.log('onRemove.foo:', [evt.item, evt.from]); },
            onStart: function (evt) { console.log('onStart.foo:', [evt.item, evt.from]); },
            onSort: function (evt) { console.log('onStart.foo:', [evt.item, evt.from]); },
            onEnd: function (evt) { console.log('onEnd.foo:', [evt.item, evt.from]); }
        });
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
        getLayerObjs : function () {
            return arrlayerObjs;
        },
        setLayerObj : function (obj) {
            arrlayerObjs.push(obj);
        },
        getLabels : function () {
            return arrlabels;
        },
        setLabel : function (label) {
            arrlabels.push(label);
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
    var olObj = $('#' + this.listDiv + 'Contents');
    $('#' + this.listDiv + 'Contents').empty();
    this.setLayerObj(obj);
    this.setLabel(label);
    var el = document.createElement('li');
    el.innerHTML = label;
    this.ulObj.el.appendChild(el);
    $('#' + this.listDiv + 'Div').trigger("create");
    /*
    this.getLabels().forEach(function (obj, i) {
        olObj.append('<li>' + obj + '</li>');
      //  $('#' + this.listDiv + 'Div').trigger("create");
    });
    //olObj.append('<li class="ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child"> ' + label + '</li>');

    $('#' + this.listDiv + 'Div').trigger("update");
    //$('#' + this.listDiv + 'Contents').trigger("create");
    */
};

