OGDSM.namesapce('mapLayerList');

(function (OGDSM) {
    "use strict";
    var arrlayerObjs = [], arrlabels = [];
    var attrObj = null;
    /**
     * 오픈레이어 맵 레이어 목록 객체
     * @class OGDSM.mapLayerList
     * @constructor
     * @param {OGDSM.visualization} obj - OGDSM 시각화 객체
     * @param {String} listDiv - 생성할 list DIV 이름
     * @param {Object} options - 옵션 JSON 객체 키 값<br>
     {listWidthSize:200, buttonSize:100, btnType:'img', btnHTML:'레이어', bgColor: 'rgb(255, 255, 255, 0.0), <br>
        <ul>
            <li>listColor: 'rgba(255,255,255, 0.0)', titleColor: 'rgba(255, 255, 255, 1.0)', titleHTML: '레이어 목록', attrObj: null}</li>
            <li>listWidthSize : 리스트 너비</li>
            <li>buttonSize: 리스트 On/Off 버튼 사이즈</li>
            <li>btnSW : true</li>
            <li>btnType : 버튼 타입 (text | img)</li>
            <li>bgColor : 전체 배경 색 </li>
            <li>listColor : 리스트 배경 색</li>
            <li>titleColor : 타이틀 배경 색 </li>
            <li>titleHTML : 타이틀 내용 </li>
            <li>attrObj : 속성정보 시각화 객체 </li>
        </ul>
     */
    OGDSM.mapLayerList = function (obj, listDiv, options) {
        options = (typeof (options) !== 'undefined') ? options : {};
        var defaults = {
            listWidthSize : 200,
            buttonSize : 100,
            btnSW : true, //향후 추가...
            btnType : 'img',
            btnHTML : '<span style="font-size:15">레이어</span>',
            bgColor : 'rgba(255, 255, 255, 0.0)',
            listColor : 'rgba(255, 255, 255, 0.0)',
            titleColor : 'rgba(255, 255, 255, 1.0)',
            titleHTML : '<span style="font-weight:bold;">레이어 목록</span>',
            attrObj : null
        };
        defaults = OGDSM.applyOptions(defaults, options);
        this.listDiv = listDiv;
        this.visualizationObj = obj;
        this.attrObj = defaults.attrObj;
        var thisObj = this;
        var handleList = null,
            rootElement = document.getElementById(listDiv),
            buttonElement = document.createElement('div'),
            listTitleElement = document.createElement('div'),
            listRootElement = document.createElement('div'),
            listUlElement = document.createElement('ul'),
            rootElementCSS = 'position : absolute; top: 0px;  z-index : 1; background : ' + defaults.bgColor + ';',
            buttonCSS = 'cursor:pointer; position : absolute; left :' +
                            defaults.listWidthSize + 'px;' + 'width : ' + defaults.buttonSize + 'px;',
            listRootCSS = 'float : left; padding : 1px;	background : ' +
                            defaults.listColor + ';' + 'width : ' + defaults.listWidthSize + 'px;',
            listTitleCSS = 'width: 100%; margin-bottom:10px; margin-top:10px; text-align:center; background :' + defaults.titleColor + ';',
            listUlCSS = 'list-style:none; padding:0; margin:0;',
            listSlideHideCSS = ' left: ' + -(defaults.listWidthSize) + 'px; transition: left 0.1s ease;',
            listSlideShowCSS = ' left: 0px; transition: left 0.1s ease;';

        var buttonSlideShowCSS = 'left:' + (defaults.listWidthSize) + 'px; ' + 'transition : background 0.1s ease, left 0.1s ease;',
            buttonSlideHideCSS = 'left:' + (defaults.listWidthSize - 25) + 'px; ' + 'transition : background 0.1s ease, left 0.1s ease;';


        handleList = function (e) {
            if (this.value === 'hide') {
                this.value = 'show';
                rootElement.style.cssText = rootElementCSS + listSlideShowCSS;
                buttonElement.style.cssText = buttonCSS + buttonSlideHideCSS;
            } else {
                this.value = 'hide';
                rootElement.style.cssText = rootElementCSS + listSlideHideCSS;
                buttonElement.style.cssText = buttonCSS + buttonSlideShowCSS;
            }
        };
        buttonElement.value = 'hide';
        buttonElement.id = listDiv + 'Button';
        buttonElement.style.cssText = buttonCSS + buttonSlideShowCSS;
        if (defaults.btnType === 'text') {
            buttonElement.innerHTML = defaults.btnHTML;
        } else {
            buttonElement.innerHTML = '<a href="#" data-role="button" data-icon="grid" data-iconpos="notext" data-corners="false"></a>';
        }
        buttonElement.addEventListener('click', handleList, false);
        buttonElement.addEventListener('touchstart', handleList, false);



        listTitleElement.style.cssText = listTitleCSS;
        listTitleElement.innerHTML = defaults.titleHTML;
        listUlElement.id = listDiv + 'Contents';
        listUlElement.style.cssText = listUlCSS;


        listRootElement.id = listDiv + 'Root';
        listRootElement.style.cssText = listRootCSS;
        listRootElement.appendChild(listTitleElement);
        listRootElement.appendChild(listUlElement);

        rootElement.style.cssText = rootElementCSS + listSlideHideCSS;
        rootElement.appendChild(buttonElement);
        rootElement.appendChild(listRootElement);

        $('#' + listDiv + 'Button').trigger('create');
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
                    layers.pop();
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
        /**
         * 레이어 객체 받기
         * @return {Object}
         */
        getLayersObj : function () {
            return arrlayerObjs;
        },
        /**
         * 레이어 객체 설정
         * @param {Object} obj - 레이어 객체
         */
        setLayerObj : function (obj) {
            arrlayerObjs.push(obj);
        },
        /**
         * 레이어 객체 받기 (복수)
         * @return {Array}
         */
        setLayersObj : function (objs) {
            arrlayerObjs = objs;
        },
        /**
         * 레이어 라벨 받기
         * @return {Array}
         */
        getLabels : function () {
            return arrlabels;
        },
        /**
         * 레이어 라벨 추가
         * @param {String} label - 레이어 라벨
         */
        setLabel : function (label) {
            arrlabels.push(label);
        },
        /**
         * 레이어 라벨 추가
         * @param {Array} labels - 레이어 라벨 배열
         */
        setLabels : function (labels) {
            arrlabels = labels;
        },
        /**
         * 시각화 객체 받아오기
         * @return {Object}
         */
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
 * 레이어 목록 추가
 * @param {Object} obj - 레이어 목록에 추가할 Openlayers3 레이어 객체
 * @param {String} label - 목록 이름
 * @param {String} color - 레이어 색상 (ex: rgb(255,255,255))
 * @param {String} type - 객체 타입 (polygon | point | line)
 */
OGDSM.mapLayerList.prototype.addList = function (obj, label, color, type) {
    'use strict';
    type = (typeof (type) !== 'undefined') ? type : null;
    var i, olList = $('#' + this.listDiv + 'Contents'),
        thisObj = this,
        labels = this.getLabels(),
        objs = this.getLayersObj(),
        ogdsmObj = this.visualizationObj,
        attrObj = this.attrObj;
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
        $('#popup' + layerName).remove();
        //$('#popup' + layerName + '-screen').remove();
        //$('#popup' + layerName + '-popup').remove();
        if (attrObj !==  null) {
            attrObj.removeAttribute(layerName);
        }
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
    if (label.length > 10) {
        sublabel = sublabel.substr(0, 10) + '...';
    }
    olList.prepend('<li id="layer' + label + '" style="float:left;">' +
                   '<fieldset data-role="controlgroup" data-type="horizontal" style="margin:0px">' +
                   '<div style="width:15%; float:left;">' +
                   '<canvas id="' + label + 'canvas" width="100%" height=30px; class="drag-handle" ></canvas>' +
                   '</div> <div id="chkRoot' + label + '" style="width:60%; float:left; padding:0px; margin:0px;">' +
                   '<input type="checkbox" name="listCheckBox" data-corners="false" data-mini="true" class="custom" ' +
                   'id="' + 'visualSW' + thisObj.getLabels().length + '" data-label="' + label + '" checked/>' +
                   '<label for="' + 'visualSW' + thisObj.getLabels().length + '" style="width:100%">' + sublabel + '</label>' +
                   '</div> <div style="width:25%; float:left;">' +
                   '<a id="hrefRoot' + label + '" data-role="button" data-rel="popup" data-theme="b" data-icon="gear"' +
                   'data-corners="false" data-transition="pop" data-iconpos="notext"  data-mini="true" ' +
                   'data-label="' + label + '" href="#popup' + label + '" style="width:25%; height:6px;"></a>' +
                   '</div>' +
                   '</fieldset>' +
                   '<div data-role="popup" id="popup' + label + '" style="width:' + 200 + 'px">' +
                   '<input type="range" value="100" min="0" max="100" data-highlight="true" class="layer-manager"' +
                   'id="' + label + 'slider" data-label="' + label + '">' +
                   '<a data-role="button" data-theme="f" data-mini="true"' +
                   'id="' + label + 'delete" data-label="' + label + '">Delete</a>' +
                   '</div>' +
                   '</li>'); //　   style="width:25%;"
    var labelCanvas = document.getElementById(label + 'canvas').getContext('2d');
    if (type === 'MultiPolygon') {
        labelCanvas.fillStyle = color;
        labelCanvas.fillRect(5, 5, 20, 20);
        labelCanvas.strokeRect(5, 5, 20, 20);
    } else if (type === 'Point') {
        labelCanvas.beginPath();
        labelCanvas.arc(15, 15, 12, 0, 2 * Math.PI);
        labelCanvas.fillStyle = color;
        labelCanvas.fill();
        labelCanvas.stroke();
    } else if (type === 'Line') {
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
    $('#' + label + 'slider').on('change', sliderEvent);
    $('#' + label + 'delete').on('click', deleteEvent);
    $('input[name=listCheckBox]').on('click', checkBoxEvent);
    $('#chkRoot' + label + ' > div').css('width', '80%');
    //$('#hrefRoot' + label + ' > span').css('margin', '-1.5px');
};

/**
 * 레이어 목록 삭제
 * @param {String} layerName - 레이어 이름
 */
OGDSM.mapLayerList.prototype.removeList = function (layerName) {
    'use strict';
    var labels = this.getLabels(),
        objs = this.getLayersObj();
    var layerNum = $.inArray(layerName, labels);

    labels.splice(layerNum, 1);
    objs.splice(layerNum, 1);
    $('#layer' + layerName).remove();
    $('#popup' + layerName).remove();
};
