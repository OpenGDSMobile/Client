
/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM
* --
* 객체(Classes)
*  - attributeTable
*  - eGovFrameUI
*  - externalConnection
*  - mapLayerList
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    'use strict';
    /**
    * OGDS Mobile Super Class
    * @class OGDSM
    * @constructor
    */
    OGDSM.prototype = {
        constructor : OGDSM,
        version : '1.2'
    };
    return OGDSM;
}(window, jQuery));

/**
* OGDSM 네임스페이스 모듈 (OGDSM 'namespace' module)
*
* - 사용 방법 (Use)
*       OGDSM.namesace('example');
*       OGDSM.example=(function(){
*         //Source Code
*       }());
* @module OGDSM.namespace
*/
OGDSM.namesapce = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;
    var test;

    if (parent[0] === 'OGDSM') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }
    return parent;
};
/**
 * OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)
 * - 사용 방법(Use)
 *       OGDSM.jsonToArray(jsonData, array[0], array[1]);
 *
 * @module OGDSM.jsontoArray
 */

OGDSM.jsonToArray = function (obj, x, y) {
    'use strict';
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
	xyAxis[1] = [];
    $.each(row, function (idx) {
        xyAxis[0].push(row[idx][x]);
        xyAxis[1].push(row[idx][y]);
    });
    return xyAxis;
};


/**
 * OGDSM options 파라미터 적용 모듈
 * - 사용 방법(Use)
 *       OGDSM.applyOptions(defaults, options);
 *
 * @module OGDSM.applyOptions
 */
OGDSM.applyOptions = function (defaults, options) {
    'use strict';
    var name = null;
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    return defaults;
};

OGDSM.namesapce('attributeTable');
(function (OGDSM) {
    'use strict';
    /**
     * 속성정보 시각화 객체
     * @class OGDSM.attributeTable
     * @constructor
     * @param {String} RootDiv - 속성 테이블 DIV 이름
     * @param {String} addr - PostgreSQL 접속 주소
     */
    OGDSM.attributeTable = function (rootDiv, addr, visualObj, indexedDB_SW) {
        visualObj = (typeof (visualObj) !== 'undefined') ? visualObj : null;
        this.rootDiv = rootDiv;         //속성정보 테이블 최상위 엘리먼트
        this.visualObj = visualObj;     //OpenGDS Mobile Visualization 객체
        this.addr = addr;               //속성정보 PostgreSQL 접속 주소 (ApplicationServer)
        this.indexedDB_SW = indexedDB_SW;   //indexedDB 여부
        this.attrTableObjs = [];            //속성정보 객체 배열
        this.curTab = null;                 //현재 시각화되고 있는 속성정보 탭
        this.wsObj = null;                  //webSocket 객체
        this.editMode = false;          //속성정보 편집 모드
        this.attrSelected = false;      //속성정보 테이블 선택 여부
        this.storeEditTable = [];
        var rootElement = document.getElementById(rootDiv),
            ulElement = document.createElement('ul'),
            contentsElement = document.createElement('div');
        var contentsCSS = 'width: 100%; height: 100%; background: rgba(255, 255, 255, 0.0); margin: 0px;',
            ulCSS = 'list-style: none; position: relative; margin: 0px; z-index: 2; top: 1px; display: table; border-left: 1px solid #f5ab36;';
        ulElement.id = rootDiv + 'Tab';
        ulElement.style.cssText = ulCSS;

        contentsElement.id = rootDiv + 'Contents';
        contentsElement.style.cssText = contentsCSS;

        rootElement.appendChild(ulElement);
        rootElement.appendChild(contentsElement);
    };
    OGDSM.attributeTable.prototype = {
        constructor : OGDSM.attributeTable,
        /**this object get and set function***/
        /**
         * 수정 모드 여부 받기
         * @return {Boolean} true | false
         */
        getEditMode : function () { return this.editMode; },
        /**
         * 현재 선택 객체 여부
         * @return {Boolean} true | false (Editing)
         */
        getSelectObj : function () { return this.attrSelected; },
        /**
         * 현재 선택 객체 설정 (테이블)
         * @param {Object} obj - 테이블 객체 (Editing)
         **/
        setSelectObj : function (obj) { this.attrSelected = obj; },
        /**
         * 현재 시각화되고 있는 속성정보 탭 설정
         * @param {Object} obj - 테이블 객체  (Editing)
         */
        setCurTab : function (obj) { this.curTab = obj; },
        /**
         * 현재 시각화되고 있는 속성정보 탭 받기
         * @return {String} - 현재 보여지고 있는 레이어 이름
         */
        getCurTab : function () { return this.curTab; },
        /**
         * WebSocket 객체 받기
         * @return {Object} - Editing
         */
        getWsObj : function () {            return this.wsObj;        },
        /**
         * Editing
         * @return {Object} - Editing
         */
        getStoreEditTable : function () {
            return this.storeEditTable;
        }
    };
    return OGDSM.attributeTable;
}(OGDSM));

/**
 * 속성 정보 추가
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
 */
OGDSM.attributeTable.prototype.addAttribute = function (layerName) {
    'use strict';
    var attrObj = this, addr = this.addr, rootDiv = this.rootDiv,
        indexedDB_SW = this.indexedDB_SW, visualObj = this.visualObj,
        attrSelected = this.attrSelected, attrTableObjs = this.attrTableObjs,
        curTab = this.curTab,   wsObj = this.wsObj;
    var tabs = $('#' + rootDiv + 'Tab'), contents = $('#' + rootDiv + 'Contents'),
        featureOverlay = null, tableObj = null;
    var aBaseCSS = 'display:block; padding:6px 15px; text-decoration:none;' +
                   'border-right:1px solid #000; border-top:1px solid #000; margin:0;',
        backgroundNotSelected = '#fff',
        backgroundSelected = '#ffd89b',
        colorSelected = '#344385',
        borderSelected = '1px solid #fff',
        textInputCSS = 'background-color: transparent; border:0px solid; font-size:15px; margin:0px;';
    //탭 클릭시 탭 배경 / 테이블 시각화 변경
    function tabClickEvent(e) {
        $('#' + rootDiv + 'Tab a').css('border-bottom', '');
        $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
        $(e.currentTarget).css('border-bottom', borderSelected);
        $(e.currentTarget).css('background', backgroundSelected);
        $('.attrTable').hide();
        $('#attrContent' + layerName).css('display', 'block');
        $('.attrTable tr.selected').removeClass('selected');
        attrObj.setCurTab(layerName);
    }
    //속성정보 테이블 내용 생성
    function createTableCol(attrContents, i, tableBody, tableTh) {
        /*var newCell = tableBody.find('tr:last').attr('data-row', i + 1);*/
        var newCell = tableBody.find('tr:last');
        var summary = {};
        $.each(attrContents, function (key, value) {
            if (i === 0) {
                tableTh.append('<th data-value="' + key + '">' + key + '</th>');
            }
            newCell.append('<td data-key="' + key + '" data-label="' + layerName +
                           //'" class="editSW" id="' + layerName + key + (i + 1) + '">' +
                           '" class="editSW ' + layerName + key + value + '">' +
                           value + '</td>');
            summary[key] = value;
        });
        newCell.attr('data-summary', JSON.stringify(summary));
    }
    //속성정보 테이블 클릭 이벤트/*tr select*/
    function tableEvent(evtLayerName) {

        $('#attrTable' + evtLayerName + ' tbody').on('click', 'td', function () {
            var i = 0, j = 0, z = 0;
            var tr = $(this).parent();
            var tds = $(tr).children();
            var tableKeyContent = {}, tableKeys = [];
            for (i = 0; i < tds.length; i++) {
                tableKeys.push($(tds[i]).attr('data-key'));
                tableKeyContent[$(tds[i]).attr('data-key')] = $(tds[i]).html();
            }
            if (visualObj !== null) {
                var eachFeatures = visualObj.layerCheck(evtLayerName).getSource().getFeatures();
                visualObj.getFeatureOverlay().getFeatures().clear();
                for (i = 0; i < eachFeatures.length; i++) {
                    var vectorObj = eachFeatures[i];
                    var property = vectorObj.getProperties();
                    for (j = 0; j < tableKeys.length; j++) {
                        if (typeof (property[tableKeys[j]]) !== 'undefined') {
                            if (tableKeyContent[tableKeys[j]] !== property[tableKeys[j]]) {
                                break;
                            }
                            if (j === tableKeys.length - 1) {
                                visualObj.getFeatureOverlay().addFeature(vectorObj);
                                attrObj.selectAttribute(evtLayerName, $(this).attr('data-key'), $(this).html(), attrObj);
                            }
                        }
                    }
                }

            }
        });
        /*page change*/
        $('#attrTable' + evtLayerName).on('page.dt', function (e, settings) {
            var selectJSON = attrObj.getSelectObj();
            setTimeout(function () {
                attrObj.editAttributeMode(attrObj.getEditMode(), attrObj.getCurTab(), attrObj.getWsObj());
                if (selectJSON !== false) {
                    attrObj.selectAttribute(selectJSON.tableName, selectJSON.key, selectJSON.value, attrObj);
                }
                if (attrObj.getStoreEditTable().length !== 0) {
                    var i = 0;
                    var objs = attrObj.getStoreEditTable();
                    console.log(objs);
                    for (i = 0; i < objs.length; i++) {
                        var obj = objs[i];
                        var wh = attrObj.editValueAttribute(obj.tableName, obj.header, obj.value, obj.editValue);
                        if (wh !== -1) {
                            objs.splice(i, 1); //향후수정......
                        }
                    }
                }
            }, 200);
        });
    }
    //indexedDB 데이터 저장
    function indexedDBEvent(layerName, data) {
        OGDSM.indexedDB('webMappingDB', {
            insertKey : layerName,
            insertData : data,
            success : function () {
                console.log('OpenGDS Mobile : ' + layerName + ', indexedDB save success');
            },
            fail : function () {
                console.log('OpenGDS Mobile : ' + layerName + ', indexedDB save fail');
            }
        });
    }
    //테이블 시각화 jQuery Table plugin 사용
    function visTableAttr(attrContents) {
        function addTab() {
            attrObj.setCurTab(layerName);
            /*Add tab*/
            tabs.prepend('<li id="attrTab' + layerName + '" style="float:left;">' +
                         '<a href="#" style="' + aBaseCSS + '">' + layerName + '</a></li>');
            $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
            $('#attrTab' + layerName + ' a').css('border-bottom', borderSelected);
            $('#attrTab' + layerName + ' a').css('background', backgroundSelected);
            $('#attrTab' + layerName + ' a').css('color', colorSelected);

            /*Add Content*/
            var attrDivHeight = $('#' + rootDiv + 'Contents').height();
            contents.prepend('<div id="attrContent' + layerName + '" class="attrTable">' +
                             '<table id="attrTable' + layerName + '" class="display compact" cellspacing="0" width="100%">' +
                             '<thead style="width:100%;"><tr></tr></thead>' +
                             '<tbody style="text-align:center"></tbody></table></div>');

            /*Event*/
            $('.attrTable').hide();
            $('#attrContent' + layerName).css('display', 'block');
            $('#attrTab' + layerName + ' a').on('click', tabClickEvent);
        }
        addTab();
        var i = 0;
        var tableDiv = $('#attrContent' + layerName),
            tableTh = tableDiv.find('thead').find('tr'),
            tableBody = tableDiv.find('tbody');
        for (i = 0; i < attrContents.length; i++) {
            tableBody.append('<tr>');
            createTableCol(attrContents[i], i, tableBody, tableTh);
            tableBody.append('</tr>');
        }

        var thHeight = $('thead').height() + 7;
        var obj = {};
        tableObj = $('#attrTable' + layerName).DataTable({
            'bFilter' : false,
            'bLengthChange' : 10,
            'bPaginate' : true,
            "dom": 'rt<"bottom"ip><"clear">'
        });
        obj.attrName = layerName;
        obj.attrObj = tableObj;
        attrTableObjs.push(obj);
        tableEvent(layerName);
    }

    function requestAttr(addr) {
        var parm = {};
        parm.tableName = layerName;
        $.ajax({
            type : 'POST',
            url : addr,
            data : JSON.stringify(parm),
            contentType : "application/json;charset=UTF-8",
            dataType : 'json',
            success : function (msg) {
                var attrContents = msg.data, i = 0;
                if (attrContents === null) {
                    console.log('Not attribute information');
                    return -1;
                }
                visTableAttr(attrContents);
                if (indexedDB_SW === true) {
                    indexedDBEvent(layerName, attrContents);
                }
            },
            error : function (error) {
                console.log(error);
            }
        });
    }

    if (indexedDB_SW === true) {
        OGDSM.indexedDB('webMappingDB', {
            type : 'search',
            storeName : 'webMappingDB',
            searchKey : layerName,
            success : function (attrContents) {
                console.log('OpenGDS Mobile : indexedDB 데이터 O');
                //indexed 에 있는 걸 불러올건지.... 아님 요청할껀지....에 대한.... 확인메시지
                //확인시.... indexedDB 저장 데이터 삭제 후 다시 저장....
                visTableAttr(attrContents);
            },
            fail : function (result) {
                console.log('OpenGDS Mobile : indexedDB 데이터 X, 서버 요청');
                requestAttr(addr);
            }
        });
    } else {
        console.log('OpenGDS Mobile : indexedDB 설정 X, 서버 요청');
        requestAttr(addr);
    }
};

/**
 * 속성 정보 삭제
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
 */
OGDSM.attributeTable.prototype.removeAttribute = function (layerName) {
    'use strict';
    $('#' + 'attrTab' + layerName).remove();
    $('#' + 'attrContent' + layerName).remove();
};
/**
 * 속성 정보 수정
 * @param {boolean}  sw   - 수정 스위치
 */
OGDSM.attributeTable.prototype.editAttributeMode = function (sw, layer, wsObj) {
    'use strict';
    wsObj = this.wsObj = (typeof (wsObj) !== 'undefined')  ? wsObj : null;
    var attrLayer = (typeof (layer) !== 'undefined')  ? '#attrTable' + layer + ' ' : '';
    var textInput = $(attrLayer + '.editSW');
    var thisObj = this;
    var oldValue = null;
    var searchData = {};
    var popupDIV = 'editValueTextDIV';
    var editInputId = 'editValueTextId';
    this.editMode = sw;
    function editDataResult(edit, src, dst) {
        var jsonObj = {};
        function addArrayJSON(arrJSON) {
            jsonObj.tableName = layer;
            jsonObj.column = Object.keys(searchData)[0];
            jsonObj.srcData = oldValue;
            jsonObj.dstData = edit;
            arrJSON.push(jsonObj);
            console.log(arrJSON);
            if (wsObj !== null) {
                console.log("실시간 편집중입니다");
                wsObj.send(JSON.stringify(arrJSON));
                OGDSM.indexedDB('webMappingDB', {
                    type : 'remove',
                    deleteKey : 'editedData'
                });
            } else {
                console.log("실시간 편집중이 아니므로 디비에 저장합니다");
                thisObj.editValueAttribute(jsonObj.tableName, jsonObj.column, jsonObj.srcData, jsonObj.dstData);
                OGDSM.indexedDB('webMappingDB', {
                    type : 'forceInsert',
                    insertKey : 'editedData',
                    insertData : arrJSON
                });
            }
        }
        OGDSM.indexedDB('webMappingDB', {
            type : 'search',
            searchKey : 'editedData',
            success : function (result) {
                addArrayJSON(result);
            },
            fail : function () {
                addArrayJSON([]);
            }
        });
    }
    if ($('#' + popupDIV).length === 0) {
        var bodyObj = $('body');
        var html = '<div data-role="popup" id="' + popupDIV + '">' +
                   '<input type="text" value="' + oldValue + '" id="' + editInputId + '">' +
                   '</div>';
        bodyObj.append(html);
        bodyObj.trigger("create");
    }
    if (sw === true) {
        this.editMode = true;
        var tableObjs = this.attrTableObjs;
        textInput.off('click');
        textInput.on('click', function () {
            oldValue = $(this).html();
            var dataKey = $(this).attr('data-key');
            var dataLabel = $(this).attr('data-label');
            $('#' + editInputId).val(oldValue);
            $('#' + popupDIV).popup('open');
            $('#' + popupDIV).off();
            $('#' + popupDIV).on({
                popupafterclose : function (event, ui) {
                    searchData = {};
                    var textInputObj = $('#' + editInputId);
                    if (oldValue === textInputObj.val()) {
                        return -1;
                    }
                    searchData[dataKey] = oldValue;
                    if (thisObj.indexedDB_SW === true) {
                        console.log(dataLabel + ' ' + searchData + ' ' + textInputObj.val());
                        OGDSM.indexedDB('webMappingDB', {
                            type : 'edit',
                            searchKey : dataLabel,
                            searchData : searchData,
                            editData : textInputObj.val(),
                            success : editDataResult
                        });
                    }
                }
            });
        });
    } else {
        console.log("click event 해지");
        this.editMode = false;
        $('#' + popupDIV).off();
        $('#' + popupDIV).remove();
        $('#' + editInputId).off('change');
        $('#' + editInputId).off('focus');
    }
    //page 동기화 안됨... 버그...
};

/**
 * 속성 정보 검색
 * @param {String}  tableName   - 테이블 이름
 * @param {String}  header   - 검색 컬럼
 * @param {String}  value   - 검색 값
 * @return {Number}  테이블 인덱스
 */
OGDSM.attributeTable.prototype.searchAttribute = function (tableName, header, value) {
    'use strict';
    var searchClassName = tableName + header + value;
    var trObj = $('.' + searchClassName).parent();
    return trObj;
};

/**
 * 속성 정보 수정
 * @param {String}  tableName   - 테이블 이름
 * @param {String}  header   - 검색 컬럼
 * @param {String}  value   - 검색 값
 * @param {String}  edit   - 변경 값
 * @return {Number}
 */
OGDSM.attributeTable.prototype.editValueAttribute = function (tableName, header, value, editValue) {
    'use strict';
    editValue = (typeof (editValue) !== 'undefined')  ? editValue : null;
    var searchClassName = tableName + header + value;
    var reClassName = tableName + header + editValue;
    var trObj = $('.' + searchClassName);
    var returnValue = null;
    if (trObj.length === 0) {
        var tmpStore = this.storeEditTable;
        var i = 0;
        for (i = 0; i < tmpStore.length; i++) {
            var obj = tmpStore[i];
            if (obj.value === value) {
                if (obj.editValue === editValue) {
                    console.log("OpenGDS Mobile : ext");
                    return -1;
                }
            }
        }
        var tmpStoreObj = {};
        tmpStoreObj.tableName = tableName;
        tmpStoreObj.header = header;
        tmpStoreObj.value = value;
        tmpStoreObj.editValue = editValue;
        this.storeEditTable.push(tmpStoreObj);
    } else {
        trObj.html(editValue);
        trObj.removeClass(searchClassName);
        trObj.addClass(reClassName);
    }
    if (this.indexedDB_SW === true) {
        console.log('update indexedDB : ' + tableName + ' ' + value + ' ' + editValue);
        var searchData = {};
        searchData[header] = value;
        console.log(searchData);
        OGDSM.indexedDB('webMappingDB', {
            type : 'edit',
            searchKey : tableName,
            searchData : searchData,
            editData : editValue,
            success : function () {
                console.log("indexedDB edit");
            },
            fail : function () {
                console.log("fail");
            }
        });
    }
};
/**
 * 속성 정보 선택
 * @param {String}  tableName   - 테이블 이름
 * @param {String}  trNum   - 테이블 인덱스
 */
OGDSM.attributeTable.prototype.selectAttribute = function (tableName, key, value, attrObj) {
    'use strict';
    attrObj = (typeof (attrObj) !== 'undefined') ? attrObj : this;
    var searchClassName = tableName + key + value;
    var trObj = $('.' + searchClassName).parent();
    var selectJSON = {};
    selectJSON.tableName = tableName;
    selectJSON.key = key;
    selectJSON.value = value;
    attrObj.unSelectAttribute(attrObj);
    trObj.addClass('selected');
    attrObj.setSelectObj(selectJSON);
};
/**
 * 속성 정보 선택 해제
 * @param {String}  tableName   - 테이블 이름
 */
OGDSM.attributeTable.prototype.unSelectAttribute = function (attrObj) {
    'use strict';
    attrObj = (typeof (attrObj) !== 'undefined') ? attrObj : this;
    if (attrObj.getSelectObj() !== false) {
        var selectJSON = attrObj.getSelectObj();
        var searchClassName = selectJSON.tableName + selectJSON.key + selectJSON.value;
        var trObj = $('.' + searchClassName).parent();
        trObj.removeClass('selected');
        attrObj.setSelectObj(false);
    }
};

OGDSM.namesapce('chartVisualization');
(function (OGDSM) {
    "use strict";
    /**
    * D3.js 기반 시각화 객체
    * @class OGDSM.chartVisualization
    * @constructor
    * @param {Array} jsonData - JSON 기반 데이터
    * @param {Object} options - 옵션 JSON 객체 키 값<br>
      {rootKey : null, labelKey : null, valueKey : null, <br>
       max:jsonData min value (based on valueKey), min:jsonData max value (based on valueKey)}<br>
    */
    OGDSM.chartVisualization = function (jsonData, options) {
        function isInt(n) {
            return n % 1 === 0;
        }
        options = (typeof (options) !== 'undefined') ? options : {};
        this.defaults = {
            rootKey : null,
            labelKey : null,
            valueKey : null,
            max : null,
            min : null
        };
        this.defaults = OGDSM.applyOptions(this.defaults, options);
        if (typeof (jsonData) !== 'undefined') {
            if (typeof (options.rootKey) === 'undefined' ||
                    typeof (options.labelKey) === 'undefined' ||
                    typeof (options.valueKey) === 'undefined') {
                console.error('Please input option values : rootKey, label, value');
                return null;
            }
	        this.jsonData = jsonData;
	        this.data = jsonData[options.rootKey];
	        this.defaults = OGDSM.applyOptions(this.defaults, options);
	        var d = null;
	        this.defaults.max = this.defaults.min = this.data[0][options.valueKey];
	        for (d in this.data) {
	            if (this.data.hasOwnProperty(d)) {
	                this.defaults.max = Math.max(this.data[d][options.valueKey], this.defaults.max);
	                this.defaults.min = Math.min(this.data[d][options.valueKey], this.defaults.min);
                    if (!isInt(Number(this.data[d][options.valueKey]))) {
                        this.data[d][options.valueKey] = Number(this.data[d][options.valueKey]).toFixed(3);
                    }
	            }
	        }
	        this.defaults.max = (typeof (options.max) !== 'undefined') ? options.max : this.defaults.max;
	        this.defaults.min = (typeof (options.min) !== 'undefined') ? options.min : this.defaults.min;
        } else {
            console.log('kMap function Mode');
        }
    };
    OGDSM.chartVisualization.prototype = {
        constructor : OGDSM.chartVisualization,
        /**
         * 지도 객체 받기
         * @return {ol.Map} 오픈레이어3 객체
         */
        getMap : function () {
            return null;
        },
        max : function () {

        }
    };
    return OGDSM.chartVisualization;
}(OGDSM));


/**
 * 수직 막대 차트 시각화
 * @param {String} div id - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
      {range : null, color : ['#4AAEEA']}<br>
 */
OGDSM.chartVisualization.prototype.vBarChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            color : ['#4AAEEA'],
            top : 20,
            right : 25,
            bottom : 70,
            left : 45,
            tick : 10
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.05);
    var values = d3.scale.linear().range([barHeight, 0]);
    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left').ticks(chartOptions.tick);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');
    console.log(data);
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);
    chartSVG.append('g')
            .attr('class', 'y axis')
            .call(valueAxis)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('shape-rendering', 'crispEdges')
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 7)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '0.7em')
            .text(options.valueKey);
    chartSVG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + barHeight + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });

    chartSVG.selectAll('bar').data(data).enter().append('rect')
        .attr('fill', function (d) {
            if ($.isArray(chartOptions.range) === true) {
                var z = 0;
                for (z = 0; z < chartOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= chartOptions.range[z]) {
                        return chartOptions.color[z];
                    }
                }
            } else {
                return chartOptions.color;
            }
        })
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('width', labels.rangeBand())
        .attr('y', function (d) {
            if (isNaN(values(d[options.valueKey]))) {
                return 0;
            }
            return values(d[options.valueKey]);
        })
        .attr('height', function (d) {
            if (isNaN(values(d[options.valueKey]))) {
                return 0;
            }
            return barHeight - values(d[options.valueKey]);
        });
    chartSVG.selectAll('bar').data(data).enter().append('text')
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .attr('y', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('dx', '-5')
        .attr('dy', '.75em')
        .style('font-size', '0.75em')
        .attr('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        });
};



/**
 * 수평 막대 차트 시각화
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
      {range : [], color : ['#4AAEEA']}<br>
 */
OGDSM.chartVisualization.prototype.hBarChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            color : ['#4AAEEA'],
            top : 20,
            right : 60,
            bottom : 20,
            left : 80,
            tick : 10
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barHeight], 0.02);
    var values = d3.scale.linear().range([0, barWidth]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    var labelAxis = d3.svg.axis().scale(labels).orient('left');
    var valueAxis = d3.svg.axis().scale(values).orient('top');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    chartSVG.append('g').attr('class', 'y axis')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.75em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');
    chartSVG.append('g')
        .attr('class', 'x axis')
        .call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .style('font-size', '0.75em')
        .attr('shape-rendering', 'crispEdges')
        .append('text')
        .attr('x', barWidth)
        .attr('dy', '1.2em')
        .style('text-anchor', 'end')
        .style('font-size', '0.75em')
        .text(options.valueKey);
    chartSVG.selectAll('bar').data(data).enter().append('rect')
        .attr('x', function (d, i) {
            return 0.5;
        })
        .attr('y', function (d) {
            return labels(d[options.labelKey]);
        })
        .attr('height', labels.rangeBand() - 0.5)
        .attr('width', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('fill', function (d) {
            if ($.isArray(chartOptions.range) === true) {
                var z = 0;
                for (z = 0; z < chartOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= chartOptions.range[z]) {
                        return chartOptions.color[z];
                    }
                }
            } else {
                return chartOptions.color;
            }
        });
    chartSVG.selectAll('bar').data(data).enter().append('text')
        .attr('x', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('y', function (d) {
            return labels(d[options.labelKey]);
        })
        .attr('dy', '.75em')
        .style('font-size', '0.75em')
        .attr('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        });
};



/**
 * 라인 차트 시각화
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
      {stroke : ['#4AAEEA'], width : 2,<br>
       circleSize : 3, circleColor : ['#AAAAAA']}<br>
 */
OGDSM.chartVisualization.prototype.lineChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            stroke : ['#4AAEEA'],
            width : 2,
            circleSize : 3,
            circleColor : ['#AAAAAA'],
            top : 20,
            right : 25,
            bottom : 100,
            left : 45
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.05);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'line')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var lineXY = d3.svg.line()
        .x(function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .y(function (d, i) {
            return values(d[options.valueKey]);
        });

    chartSVG.append('path').attr('d', lineXY(data))
        .attr('stroke', chartOptions.stroke)
        .attr('stroke-width', chartOptions.stroke)
        .attr('fill', 'none');
    chartSVG.append('g').attr('class', 'x axis').call(labelAxis)
        .attr('transform', 'translate(0, ' + barHeight + ')')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });
    chartSVG.append('g').attr('class', 'y axis').call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 7)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .text(options.valueKey);

    var textCircle = chartSVG.selectAll('circle').data(data).enter().append('g');
    textCircle.append('circle')
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor)
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        });
    textCircle.append('text')
        .attr('dy', '-.5em')
        .style('font-size', '0.55em')
        .style('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        })
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]);
        });
};

/**
 * 영역 차트 시각화
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
      {fill : ['#4AAEEA'], circleSize : 3, circleColor : ['#AAAAAA']}<br>
 */
OGDSM.chartVisualization.prototype.areaChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            fill : ['#4AAEEA'],
            circleSize : 3,
            circleColor : ['#AAAAAA'],
            top : 20,
            right : 0,
            bottom : 100,
            left : 45
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var areaXY = d3.svg.area()
        .x(function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .y0(barHeight)
        .y1(function (d, i) {
            return values(d[options.valueKey]);
        });
    chartSVG.append('path').attr('d', areaXY(data))
        .attr('class', 'area')
        .attr('fill', chartOptions.fill);

    var textCircle = chartSVG.selectAll('circle').data(data).enter().append('g');
    textCircle.append('circle')
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor)
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        });
    textCircle.append('text')
        .attr('dy', '-.5em')
        .style('font-size', '0.55em')
        .style('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        })
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]);
        });

    chartSVG.append('g').attr('class', 'x axis').call(labelAxis)
        .attr('transform', 'translate(0, ' + barHeight + ')')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });
    chartSVG.append('g').attr('class', 'y axis').call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 7)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .text(options.valueKey);
};


/**
 * 한국 지도 시각화
 * @param {String} rootDiv - 막대 차트 시각화할 DIV 아이디 이름
 * @param {String} serverAddr - 저장되어 있는 서버 주소
 * @param {String} geodata - 공간 데이터 이름 (파일)
 * @param {Object} subOptions - 옵션 JSON 객체 키 값<br>
    {center_lat : 34.0, center_lon : 131.0, map_scale : 3500, top:0, <br>
     right: 0, bottom: 0, left: 0 }<br>
 */
OGDSM.chartVisualization.prototype.kMap = function (rootDiv, serverAddr, geodata, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        mapOptions = {
            center_lat : 34.0,
            center_lon : 131.0,
            map_scale : 3500,
            top : 0,
            right : 0,
            bottom : 0,
            left : 0
        };
    mapOptions = OGDSM.applyOptions(mapOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + mapOptions.left + mapOptions.right,
        contentHeight = rootDivObj.height() + mapOptions.top + mapOptions.bottom,
        barWidth = rootDivObj.width() - mapOptions.left - mapOptions.right,
        barHeight = rootDivObj.height() - mapOptions.top - mapOptions.bottom,
        objNames = [
            { geoName : 'SIDO', objName : 'All_TL_SCCO_CTPRVN_4326', propEnName : 'CTP_ENG_NM'},
            { geoName : 'GU', objName : 'All_TL_SCCO_SIG_4326', propEnName : 'SIG_ENG_NM'},
            { geoName : 'DONG', objName : 'All_TL_SCCO_EMD_4326', propEnName : 'EMD_ENG_NM'}
        ],
        paramData = {};
    paramData.jsonName = geodata;
    rootDivObj.empty();
    var svg = d3.select('#' + rootDiv)
                .append('svg')
                .attr("width", contentWidth)
                .attr("height", contentHeight);
    var projection = d3.geo.mercator()
                .center([mapOptions.center_lon, mapOptions.center_lat])
                .scale(mapOptions.map_scale)
                .rotate([2, 2.5])
                .translate([barWidth / 2, barHeight / 2]);
    var path = d3.geo.path().projection(projection);
    var curObj = null, curPropEn = null;
    $.each(objNames, function (i, d) {
        if (d.geoName === geodata) {
            curObj = d.objName;
            curPropEn = d.propEnName;
        }
    });
    if (curObj === null) {
        console.log('Not support Map');
        return -1;
    }
    $.ajax({
        type : 'POST',
        url : serverAddr,
        data : JSON.stringify(paramData),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var topology = JSON.parse(msg.data);
            var objs = topology.objects;
            svg.selectAll("path")
                .data(topojson.feature(topology, objs[curObj]).features)
                .enter().append("path")
                .attr('data-prop', function (d) {
                    return JSON.stringify(d.properties);
                })
                .style("fill", function (d) { return "#" + Math.random().toString(16).slice(2, 8); })
                .style('fill-opacity', 0.5)
                .attr("d", path);
        },
        error : function (e) {
            console.log(e);
            $('#result').text(e);
        }
    });
};
OGDSM.namesapce('eGovFrameUI');
(function (OGDSM) {
    'use strict';
    /**
     * 전자정부표준프레임워크 UX 컴포넌트 자동 생성 객체
     * @class OGDSM.eGovFrameUI
     * @constructor
     * @param {String} theme - eGovframework 테마 a~g (default c)
     */
    OGDSM.eGovFrameUI = function (theme) {
        theme = (typeof (theme) !== 'undefined') ? theme : null;
        if (theme !== null) {
            this.dataTheme = theme;
        } else {
            this.dataTheme = "c";
        }
    };
    OGDSM.eGovFrameUI.prototype = {
        constructor : OGDSM.eGovFrameUI
    };
    return OGDSM.eGovFrameUI;
}(OGDSM));


/**
 * 버튼 자동 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} linkId - 생성될 버튼 아이디 이름
 * @param {String} buttonTitle - 버튼 이름
 * @param {String} url - 링크 주소
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {theme:this.dataTheme, corners:true, inline:false, mini:false}<br>
    <ul>
        <li>theme(String) : 테마</li>
        <li>corners(Boolean) : 모서리 둥글게 여부</li>
        <li>inline(Boolean) : 가로 정렬 여부</li>
        <li>mini(Boolean) : 버튼 크기</li>
    <ul>
 * @return {Object} 제이쿼리 아이디 버튼 객체
 */
OGDSM.eGovFrameUI.prototype.autoButton = function (rootDivId, linkId, buttonTitle, url, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '<a data-role="button" id="' + linkId + '" href="' + url + '" ',
        i = 0,
        name = null;

    var defaults = {
        theme : this.dataTheme,
        corners : true,
        inline : false,
        mini : false
    };

    defaults = OGDSM.applyOptions(defaults, options);
    html += 'data-theme="' + defaults.theme + '" data-corners="' + defaults.corners + '" data-inline="' + defaults.inline + '" data-mini="' + defaults.mini + '"';
    html += '>' + buttonTitle + '</a>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $("#" + linkId);
};

/**
 * 체크박스 자동 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} chkId - 생성될 체크박스 아이디 이름
 * @param {String | Array} labels - 체크박스 라벨
 * @param {String | Array} values - 체크박스 값
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
 *  {theme:this.dataTheme, horizontal:true, checkName:chkId + 'Name'}<br>
    <ul>
        <li>theme(String) : 테마</li>
        <li>horizontal(Boolean) : 체크박스 수평 여부</li>
        <li>checkName(String) : 체크박스 그룹 이름</li>
    </ul>
 * @return {Object} 제이쿼리 체크박스 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoCheckBox = function (rootDivId, chkId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '',
        i = 0,
        name = null,
        defaults = {
            checkName : chkId + 'Name',
            theme : this.dataTheme,
            horizontal : false
        };
    defaults = OGDSM.applyOptions(defaults, options);
    html = '';
    if (Array.isArray(labels)) {
        html += '<fieldset data-role="controlgroup" ';
        if (defaults.horizontal) {
            html += 'data-type="horizontal">';
        } else {
            html += '>';
        }
        for (i = 0; i < labels.length; i += 1) {
            html += '<input type="checkbox" name="' + defaults.checkName + '" id="' + chkId + i + '" value="' + values[i] + '" ';
            html += 'data-theme="' + defaults.theme + '" class="custom"/>';
            html += '<label for="' + chkId + i + '">' + labels[i] + '</label>';
        }
        html += '</fieldset>';
    } else {
        html += '<input type="checkbox" name="' + defaults.checkName + '" id="' + chkId + '" value="' + values[i] + '" ';
        html += 'data-theme="' + defaults.theme + '" class="custom"/>';
        html += '<label for="' + chkId + '">' + labels + '</label>';
    }
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('input[name=' + defaults.checkName + ']:checkbox');
};

/**
 * 라디오 박스 자동 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} radioId - 생성될 라디오박스 아이디 이름
 * @param {String | Array} labels - 라디오박스 라벨
 * @param {String | Array} values - 라디오박스 값
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
    {theme:this.dataTheme, horizontal:true, radioName:radioId + 'Name'}<br>
    <ul>
        <li>theme(String) : 테마</li>
        <li>horizontal(Boolean) : 라디오박스 수평 여부</li>
        <li>radioName(String) : 라디오박스 그룹 이름</li>
    </ul>
 * @return {Object} 제이쿼리 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoRadioBox = function (rootDivId, radioId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '<fieldset data-role="controlgroup" style="margin:0px; align:center;"',
  //      optionName = ['data-type', 'data-theme'],
  //      optionData = ['', this.dataTheme],
        i = 0,
        name = 0;

    var defaults = {
        radioName : radioId + 'Name',
        horizontal : false,
        theme : this.dataTheme
    };
    defaults = OGDSM.applyOptions(defaults, options);
    if (defaults.horizontal) {
        html += 'data-theme="' + defaults.theme + '" data-type="horizontal">';
    } else {
        html += 'data-theme="' + defaults.theme + '">';
    }

    for (i = 0; i < labels.length; i += 1) {
        html += '<input type="radio"name="' + defaults.radioName + '" id="' + radioId + i + '" value="' + values[i] + '" ';
        html += 'data-theme="' + defaults.theme + '" class="custom" ';
        if (i === 0) {
            html += 'checked="checked" />';
        } else {
            html += '/>';
        }
        html += '<label for="' + radioId + i + '">' + labels[i] + '</label>';
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('input[name=' + defaults.radioName + ']:radio');

};

/**
 * 셀렉트 자동 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} selectId - 생성될 선택 아이디 이름
 * @param {String | Array} text - 선택 라벨 텍스트
 * @param {String | Array} values - 선택 값
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {firstName:'', theme:this.dataTheme, corners:true, inline:false, selected:0}<br>
    <ul>
        <li>firstName(String) : 첫번째 값</li>
        <li>theme(String) : 테마</li>
        <li>corners(Boolean) : 테두리 둥글게 여부</li>
        <li>inline(Boolean) : 가로 정렬 여부</li>
        <li>selected(Boolean) : 처음 선택된 인덱스 값</li>
    </ul>
 * @return {Object} 제이쿼리 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoSelect = function (rootDivId, selectId, selectName, text, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), html = null, i = 0, name = null;
    var defaults = {
        firstName : '',
        theme : this.dataTheme,
        corners : true,
        inline : false,
        selected : 0,
        mini : false
    };
    defaults = OGDSM.applyOptions(defaults, options);
    html = '<select name="' + selectName + '" id="' + selectId + '" ' + 'data-mini="' + defaults.mini +
           '" data-theme="' + defaults.theme + '" data-corners="' + defaults.corners + '" data-inline="' + defaults.inline + '">';
    html += '<option value=""> ' + defaults.firstName + '</option>';

    for (i = 0; i < text.length; i += 1) {
        html += '<option value="' + values[i] + '">' + text[i] + '</option>';
    }
    html += '</select>';
    html += '</fieldset>';
    rootDiv.append(html);
    $('#' + selectId).val(defaults.selected);
    rootDiv.trigger('create');
    return $('#' + selectId);
};

/**
 * 스위치 자동 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} switchId - 생성될 스위치 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {theme:this.dataTheme, track_theme:this.dataTheme, switchName:switchId+'Name'}<br>
    <ul>
        <li>theme(String) : 테마</li>
        <li>track-theme(String) : 버튼 테마</li>
        <li>switchName(String) : 스위치 그룹 이름</li>
    </ul>
 * @return {Object} 제이쿼리 아이디 객체
 */
OGDSM.eGovFrameUI.prototype.autoSwitch = function (rootDivId, switchId, switchName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), name,
        html = '',
   //     optionName = ['data-theme', 'data-track-theme'],
    //    optionData = [this.dataTheme, this.dataTheme],
        i = 0;

    var defaults = {
        theme : this.dataTheme,
        track_theme : this.dataTheme,
        switchName : switchId + 'Name'
    };
    defaults = OGDSM.applyOptions(defaults, options);
    html = '<select name="' + defaults.switchName + '" id="' + switchId + '" data-theme="' + defaults.theme +
           '" data-track-theme="' + defaults.track_theme + '" data-role="slider" data-inline="true">';
    html += '<option value="off">Off</option>';
    html += '<option value="on">On</option>';
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('#' + switchId);
};


/**
 * 리스트 뷰 자동 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} listViewId - 생성될 스위치 아이디 이름
 * @param {String} item - 리스트 아이템
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {inset:true, link:null}<br>
    <ul>
        <li>inset(Boolean) : 동근 모서리</li>
        <li>link(Boolean) : 오른쪽 화살표 여부</li>
    </ul>
 * @return {Object} 제이쿼리 li 객체
 */
OGDSM.eGovFrameUI.prototype.autoListView = function (rootDivId, listViewId, item, options) {
    'use strict';
    //item = (typeof (item) !== 'undefined') ? item : {};
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), name,
        html = '',
        i = 0;

    var defaults = {
        inset : true,
        link : true,
        itemKey : 'title',
        divide : '',
        noDataTitle : '데이터 없음'
    };
    defaults = OGDSM.applyOptions(defaults, options);
    html = '<ul id="' + listViewId + '" data-role="listview" data-inset="' + defaults.inset + '">';
    if (defaults.divide !== '') {
        html += '<li data-role="list-divider">' + defaults.divide + '</li>';
    }
    if (item ===  null || item.length === 0) {
        html += '<li>' + defaults.noDataTitle + '</li>';
    }
    for (i in item) {
        if (item.hasOwnProperty(i)) {
            html += '<li data-title="' + item[i][defaults.itemKey] + '">';
            if (defaults.link) {
                html += '<a href="#">';
                html += item[i][defaults.itemKey] + '</a>';
            } else {
                html += item[i][defaults.itemKey];
            }
            html += '</li>';
        }
    }
    html += '</ul>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('#' + listViewId + ' li');
};
/**
 * 시간 태그 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @return {Object} 제이쿼리 아이디 이름 객체
 */
OGDSM.eGovFrameUI.prototype.timeInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<input type="time" id="timeValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#timeValue');
};

/**
 * 날짜 태그 생성
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} option - 년, 월, 일 옵션 (month || week) [option]
 * @return {Object} 제이쿼리 아이디 이름 객체 (Date YYYY/MM/DD)
 */
OGDSM.eGovFrameUI.prototype.dateInput = function (divId, option) {
    'use strict';
    option = (typeof (option) !== 'undefined') ? option : 'date';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<input type="' + option + '" id="dateValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#dateValue');
};

/*Custom UI Create*/

/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성: 라디오 박스
 * @param {Object} OGDSMObj - OpenGDS모바일 시각화 객체
 * @param {String}       rootDiv - 최상위 DIV 아이디 이름
 * @param {String}       options - 제공할 지도 타입 (스페이스바로 타입 구분) [OSM VWorld VWorld_m VWorld_s VWorld_g]
 */
OGDSM.eGovFrameUI.prototype.baseMapRadioBox = function (OGDSMObj, rootDiv, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var mapRadioNameObj,
        supportMap;

    if (options !== null) {
        supportMap = options.split(' ');
    }
    mapRadioNameObj = this.autoRadioBox(rootDiv, 'mapType', supportMap, supportMap, {
        horizontal : true
    });
    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};
/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성: 셀렉트 박스
 * @param {Object} OGDSMObj - OpenGDS모바일 시각화 객체
 * @param {String}       rootDiv - 최상위 DIV 아이디 이름
 * @param {String}       options - 제공할 지도 타입 (스페이스바로 타입 구분) [OSM VWorld VWorld_m VWorld_s VWorld_g]
 */
OGDSM.eGovFrameUI.prototype.baseMapSelect = function (OGDSMObj, rootDiv, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var mapRadioNameObj,
        supportMap;

    if (options !== null) {
        supportMap = options.split(' ');
    }
    mapRadioNameObj = this.autoSelect(rootDiv, 'mapType', 'selectMapType', supportMap, supportMap, {
        firstName : '맵 선택',
        selected : supportMap[0],
        inline : true,
        mini : true
    });
    OGDSMObj.changeBaseMap(supportMap[0]);
    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};

/**
 * 브이월드 WMS API 리스트 요청 인터페이스
 * @method vworldWMSList
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} theme - 테마 default : this.dataTheme
 * @return {Array} 선택 박스 아이디 이름 배열 ('vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5')
 */
OGDSM.eGovFrameUI.prototype.vworldWMSList = function (divId, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup" id="vworldWMS">',
        OGDSM = this.OGDSM,
        selectName = ['vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5'],
        selectState = [0, 0, 0, 0, 0],
        styles,
        stylesText,
        i,
        j,
        btnObj;

    styles = [
        'LP_PA_CBND_BUBUN,LP_PA_CBND_BONBUN',
        'LT_C_UQ111', 'LT_C_UQ112', 'LT_C_UQ113', 'LT_C_UQ114',
        'LT_C_UQ121', 'LT_C_UQ122', 'LT_C_UQ123', 'LT_C_UQ124', 'LT_C_UQ125',
        'LT_C_UQ126', 'LT_C_UQ127', 'LT_C_UQ128', 'LT_C_UQ129', 'LT_C_UQ130',
        'LT_C_UQ141', 'LT_C_UQ162', 'LT_C_UD801',
        'LT_L_MOCTLINK', 'LT_P_MOCTNODE',
        'LT_C_LHZONE', 'LT_C_LHBLPN',
        'LT_P_MGPRTFA', 'LT_P_MGPRTFB', 'LT_P_MGPRTFC', 'LT_P_MGPRTFD',
        'LT_L_SPRD', 'LT_C_SPBD',
        'LT_C_ADSIDO', 'LT_C_ADSIGG', 'LT_C_ADEMD', 'LT_C_ADRI',
        'LT_C_TDWAREA',
        'LT_C_DAMDAN', 'LT_C_DAMYOD', 'LT_C_DAMYOJ', 'LT_C_DAMYUCH',
        'LT_C_RIRSV', 'LT_P_RIFCT',
        'LT_P_UTISCCTV', 'LT_C_USFSFFB',
        'LT_L_FRSTCLIMB', 'LT_P_CLIMBALL', 'LT_L_TRKROAD', 'LT_P_TRKROAD',
        'LT_C_WKMBBSN', 'LT_C_WKMMBSN', 'LT_C_WKMSBSN', 'LT_C_WKMSTRM',
        'LT_C_ASITSOILDRA', 'LT_C_ASITDEEPSOIL', 'LT_C_ASITSOILDEP', 'LT_C_ASITSURSTON',
        'LT_L_AISROUTEU', 'LT_L_AISPATH', 'LT_C_AISALTC', 'LT_C_AISRFLC', 'LT_C_AISACMC', 'LT_C_AISCTRC',
        'LT_C_AISMOAC', 'LT_C_AISADZC', 'LT_C_AISPRHC', 'LT_C_AISFIRC', 'LT_C_AISRESC', 'LT_C_AISDNGC',
        'LT_C_AISTMAC', 'LT_C_AISCATC', 'LT_P_AISBLDG40F', 'LT_L_AISSEARCHL,LT_P_AISSEARCHP',
        'LT_L_AISVFRPATH,LT_P_AISVFRPATH', 'LT_P_AISVFRPT,LT_P_AISVFRPT_SW,LT_P_AISVFRPT_SN',
        'LT_L_AISCORRID_YS,LT_L_AISCORRID_GJ,LT_P_AISCORRID_YS,LT_P_AISCORRID_GJ', 'LT_P_AISHCSTRIP'];
    stylesText = [
        '지적도',
        '도시지역', '관리지역', '농립지역', '자연환경보전지역',
        '경관지구', '미관지구', '고도지구', '방화지구', '방재지구',
        '보존지구', '시설보호지구', '취락지구', '개발진흥지구', '특정용도제한지구',
        '국토계획구역', '도시자연공원구역', '개발제한구역',
        '교통링크', '교통노드',
        '사업지구경계도', '토지이용계획도',
        '아동안전지킴이집', '노인복지시설', '아동복지시설', '기타보호시설',
        '새주소도로', '새주소건물',
        '광역시도', '시군구', '읍면동', '리',
        '보행우선구역',
        '단지경계', '단지용도지역', '단지시설용지', '단지유치업종',
        '저수지', '수리시설',
        '교통CCTV', '소방서관할구역',
        '등산로', '등산로시설', '둘레길링크', '산책로분기점',
        '대권역', '중권역', '표준권역', '하천망',
        '배수등급', '심토토성', '유효토심', '자갈함량',
        '제한고도', '항공로', '경계구역', '공중급유구역', '공중전투기동훈련장', '관제권',
        '군작전구역', '방공식별구역', '비행금지구역', '비행정보구역', '비행제한구역', '위험구역',
        '접근관제구역', '훈련구역', '건물군(40층이상)', '수색비행장비행구역',
        '시계비행로', '시계비행보고지점',
        '한강회랑', '헬기장'];

    rootDiv.append(html);
    for (j = 0; j < selectName.length; j += 1) {
        this.autoSelect("vworldWMS", selectName[j], selectName[j], stylesText, styles, {
            firstName : (j + 1) + '번째 레이어 선택'
        });
    }

    $("#" + selectName[0]).change(function () {
        selectState[0] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[1]).change(function () {
        selectState[1] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[2]).change(function () {
        selectState[2] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[3]).change(function () {
        selectState[3] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[4]).change(function () {
        selectState[4] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    return selectName;
};

/**
 * 서울 열린 데이터 광장 환경정보 요청 인터페이스
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {theme:this.dataTheme, path:'./images/'}<br>
    <ul>
        <li>theme(String) : 테마</li>
        <li>path(String) : 이미지 위치</li>
    </ul>
 * @return {String} 생성된 객체 배열 [visualType, date, time, environmentType]
 */
OGDSM.eGovFrameUI.prototype.seoulEnvironment = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name;
    var defaults = {
        theme : this.dataTheme,
        path : './images/openGDSMobile/'
    };
    defaults = OGDSM.applyOptions(defaults, options);
    var environmentImages = [
        '<img src="' + defaults.path + 'input_bt_pm10.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_pm25.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_so2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_o3.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_no2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_co.png" width=30>'
    ],
        environmentValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        date = this.dateInput(divId),
        time = this.timeInput(divId),
        environmentType,
        i;
    for (i = 0; i < environmentValues.length; i += 3) {
        environmentType = this.autoRadioBox(divId, 'envTypeRadio' + i,
                                      [environmentImages[i], environmentImages[i + 1], environmentImages[i + 2]],
                                      [environmentValues[i], environmentValues[i + 1], environmentValues[i + 2]],
                                      {horizontal : true, radioName : 'envTypeName'});
    }
    return [visualType, date, time, environmentType];
};


/**
 * 데이터 포털 환경정보 요청 인터페이스
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {theme:this.dataTheme, path:'./images/'}<br>
    <ul>
        <li>theme(String) : 테마</li>
        <li>path(String) : 이미지 위치</li>
    </ul>
 * @return {String} 생성된 객체 배열 [visualType, areaType, environmentType]
 */
OGDSM.eGovFrameUI.prototype.dataPortalEnvironment = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name, i;
    var defaults = {
        theme : this.dataTheme,
        path : './images/openGDSMobile/'
    };
    defaults = OGDSM.applyOptions(defaults, options);
    var environmentImages = [
        '<img src="' + defaults.path + 'input_bt_pm10.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_pm25.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_so2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_o3.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_no2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_co.png" width=30>'
    ],
        environmentValues = ['pm10Value', 'pm25Value', 'so2value', 'o3Value', 'no2Value', 'coValue'],
        areaTypes = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'],
        areaValues = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'];
        //areaValues = ['incheon', 'seoul', 'gyeonggi', 'gangwon', 'chungnam', 'sejong', 'chungbuk', 'daejeon', 'gyeongbuk', 'jeonbuk', 'daegu', 'ulsan', 'jeonnam', 'gwangju', 'gyeongnam', 'busan', 'jeju'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        areaRadio,
        environmentType;

    for (i = 0; i < areaTypes.length - 2; i += 3) {
        areaRadio = this.autoRadioBox(divId, 'areaType' + i,
                                      [areaTypes[i], areaTypes[i + 1], areaTypes[i + 2]],
                                      [areaValues[i], areaValues[i + 1], areaValues[i + 2]],
                                      {horizontal : true, radioName : 'areaTypeName'});
    }
    areaRadio = this.autoRadioBox(divId, 'areaType',
                                  [areaTypes[areaTypes.length - 2], areaTypes[areaTypes.length - 1]],
                                  [areaValues[areaValues.length - 2], areaValues[areaValues.length - 1]],
                                  {horizontal : true, radioName : 'areaTypeName'});
    for (i = 0; i < environmentValues.length; i += 3) {
        environmentType = this.autoRadioBox(divId, 'envType' + i,
                                      [environmentImages[i], environmentImages[i + 1], environmentImages[i + 2]],
                                      [environmentValues[i], environmentValues[i + 1], environmentValues[i + 2]],
                                      {horizontal : true, radioName : 'envRadioName'});
    }
    return [visualType, areaRadio, environmentType];
};

/**
 * 데이터 포털 원자력발전소 실시간 주변 방사선량 인터페이스
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {theme:this.dataTheme}<br>
  theme(String) : 테마<br>
 * @return {String} 생성된 객체 배열 [visualType, nuclearPos]
 */
OGDSM.eGovFrameUI.prototype.dataPortalNuclear = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name, i;
    var defaults = {
        theme : this.dataTheme
    };
    defaults = OGDSM.applyOptions(defaults, options);
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['차트'], ['chart'], {horizontal : true}),
        nuclearPos = this.autoRadioBox(divId, 'nuclearPos1', ['월성', '고리'], ['WS', 'KR'],
                                       {horizontal : true, radioName: 'nuclearName'});

    nuclearPos = this.autoRadioBox(divId, 'nuclearPos2', ['한빛', '한울'], ['YK', 'UJ'],
                                        {horizontal : true, radioName: 'nuclearName'});
    return [visualType, nuclearPos];
};

/**
 * 데이터 포털 온실가스배출량 조회 서비스 인터페이스
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {theme:this.dataTheme}<br>
  theme(String) : 테마<br>
 * @return {String} 생성된 객체 배열 [visualType, nuclearPos]
 */
OGDSM.eGovFrameUI.prototype.dataPortalGreenGas = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name, i;
    var defaults = {
        theme : this.dataTheme
    };
    defaults = OGDSM.applyOptions(defaults, options);
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['차트'], ['chart'], {horizontal : true}),
        date = this.dateInput(divId, 'month');
    return [visualType, date];
};

/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    /**
     * 외부 데이터 접속 요청 객체
     * @class OGDSM.externalConnection
     * @constructor
     */
    OGDSM.externalConnection = function () {

    };
    OGDSM.externalConnection.prototype = {
        constructor : OGDSM.externalConnection
    };
    return OGDSM.externalConnection;
}(OGDSM));

/**
 * 폼 타입 에이젝스 요청
 * @param {String} addr - 서버 주소
 * @param {String} formID - form ID
 * @param {String} submitID - 전송 버튼 아이디<input type="button">
 * @param {function} callback - 콜백 함수 function (resultData) {...}
 */
OGDSM.externalConnection.prototype.formAjaxRequest = function (addr, formID, submitBtnID, callback) {
    'use strict';
    $('#' + submitBtnID).click(function () {
        var formData = $('#' + formID).serialize();
        console.log(formData);
        $.mobile.loading('show', {
            text : 'Loading',
            textVisible : 'true',
            theme : 'c',
            textonlt : 'false'
        });
        $.ajax({
            type : 'POST',
            url : addr,
            cache : false,
            data : formData,
            success : function (msg) {
                callback(msg);
            },
            error : function (e) {
                console.log(e);
            }
        });
    });
};

/**
 * JSON 기반 에이젝스 요청
 * @param {String} addr - 서버 주소
 * @param {Object} options - 콜백 함수 function (resultData) {...}
 *
 *
 *
 */
OGDSM.externalConnection.prototype.ajaxRequest = function (addr, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        data : null,
        submitBtn : null,
        callback : function (data) { console.log("Please create callback function"); }
    };
    defaults = OGDSM.applyOptions(defaults, options);
    function ajax() {
        $.mobile.loading('show', {
            text : 'Loading',
            textVisible : 'true',
            theme : 'c',
            textonlt : 'false'
        });
        $.ajax({
            type : 'POST',
            url : addr,
            cache : false,
            data : JSON.stringify(defaults.data),
            contentType : 'application/json;charset=UTF-8',
            dataType : 'json',
            success : function (msg) {
                defaults.callback(msg);
                $.mobile.loading('hide');
            },
            error : function (e) {
                //console.log(e);
                console.log("OpenGDS Mobile Log : Server Error");
                $.mobile.loading('hide');
            }
        });
    }

    if (defaults.submitBtn !== null) {
        $('#' + defaults.submitBtn).click(function () {
            ajax();
        });
    } else {
        ajax();
    }
};

/**
 * GeoServer WFS 데이터 요청 (OpenLayers3 ol.source.GeoJSON)
 * @param {Object} obj - OpenGDS Mobile 시각화 객체
 * @param {String} addr - 주소
 * @param {String} workspace - 워크스페이스
 * @param {String} layerName - 레이어 이름
 * @param {Object} options - 옵션 JSON 객체 키 값<br>
  {color:'rgba(0, 0, 0, 0.0)', callback:function () {}}<br>
    <ul>
        <li>color(String) : 색상 rgba</li>
        <li>label(String) : 라벨<br></li>
        <li>callback(Function) : 콜백 함수 function (resultData) {...}</li>
    </ul>
 */
OGDSM.externalConnection.prototype.geoServerGeoJsonLoad = function (obj, addr, workspace, layerName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    console.log(layerName);
    var fullAddr = addr + '/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeNames=' + workspace + ':' +
        layerName.split('--')[0] + '&outputFormat=json&srsname=' + obj.baseProj;
    var objStyles, name;
    console.log(fullAddr);
    var defaults = {
        color : 'rgba(0, 0, 0, 0.0)',
        label : null,
        callback : function (wfslayer) {}
    };
    defaults = OGDSM.applyOptions(defaults, options);
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    layerName = layerName.replace(/[ \{\}\[\]\/?.,;:|\)*~`!\+┼<>@\#$%&\'\"\\\(\=]/gi);
    $.ajax({
        type : 'POST',
        url : fullAddr,
        crossDomain: true,
        dataType : 'json',
        success : function (msg) {
            var wfsLayer = new ol.layer.Vector({
                title : layerName,
                source : new ol.source.Vector({
                    features : (new ol.format.GeoJSON()).readFeatures(msg)
                }),
                style : (function () {
                    var styleFill = new ol.style.Fill({
                        color : defaults.color
                    });
                    var styleStroke = new ol.style.Stroke({
                        color : 'rgba(0, 0, 0, 1.0)',
                        width : 1
                    });
                    var styleCircle = new ol.style.Circle({
                        radius : 10,
                        fill : styleFill,
                        stroke : styleStroke
                    });
                    return function (feature, resolution) {
                        var type = feature.getGeometry().getType();
                        var styleText = null;
                        if (defaults.label !== null) {
                            styleText = new ol.style.Text({
                                font : '12px Calibri, sans-serif',
                                text : feature.get(defaults.label),
                                fill : new ol.style.Fill({
                                    color : '#000'
                                }),
                                stroke : new ol.style.Stroke({
                                    color : '#fff',
                                    width : 3
                                })
                            });
                            feature.set('label', defaults.label);
                        }
                        //console.log(defaults.label);
                        feature.set('styleFill', styleFill);
                        feature.set('styleStroke', styleStroke);
                        feature.set('styleCircle', styleCircle);
                        feature.set('styleText', styleText);
                        if (type === 'MultiPolygon') {
                            return [new ol.style.Style({
                                fill : styleFill,
                                stroke : styleStroke,
                                text : styleText
                            })];
                        } else if (type === 'Point') {
                            return [new ol.style.Style({
                                image : styleCircle,
                                text : styleText
                            })];
                        }
                    };
                }())
            });
            wfsLayer.set('styleFill', defaults.color);
            obj.addMap(wfsLayer, defaults.type);
            $.mobile.loading('hide');
            defaults.callback(wfsLayer);
        },
        error : function (e) {
            console.log(e);
            $.mobile.loading('hide');
        }
    });
};
/**
 * VWorld WMS 데이터 요청
 * @param {String} apiKey - API 키
 * @param {String} domain - 도메인
 * @param {String} data - WMS 레이어 이름
 * @return {ol.layer.Tile} OpenLayers 타일 객체
 */
OGDSM.externalConnection.prototype.vworldWMSLoad = function (apiKey, domain, data) {
    'use strict';
    console.log(data);
    var layers = '';
    for (var i = 0; i<data.length; i++) {
    	if (typeof(data[i]) !== 'undefined') {
    		if (i != 0) {
    			layers = layers + ',';
    		}
    		layers = layers + data[i];
    	}
    }
    console.log(layers);
    var resultData = new ol.layer.Tile({
        title : 'VWorldWMS',
        source : new ol.source.TileWMS(({
            url : 'http://map.vworld.kr/js/wms.do',
            params : {
                apiKey : apiKey,
                domain : domain,
                LAYERS : layers,
                STYLES : layers,
                FORMAT : 'image/png',
                CRS : 'EPSG:900913',
                EXCEPTIONS : 'text/xml',
                TRANSPARENT : true
            }
        }))
    });
    return resultData;
};

/**
 * 공공 데이터 요청 인터페이스
 * @param {String} addr - 어플리케이션 서버 요청 주소
 * @param {Object} jsonData - 데이터 요청 파라미터 {serviceName : ??(필수), serviceKey ??(필수), ...}
 * @param {function} callback - 콜백 함수 function (resultData) {...}
 *
 */
OGDSM.externalConnection.prototype.publicDataInterface = function (addr, jsonData, callback) {
    'use strict';
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    console.log(JSON.stringify(jsonData));
    $.ajax({
        type : 'POST',
        url : addr,
        data : JSON.stringify(jsonData),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (jsonResult) {
            $.mobile.loading('hide');
            if (jsonResult.result === 'OK') {
                callback(JSON.parse(jsonResult.data));
            } else {
                alert("데이터를 불러오는데 실패하였습니다");
            }
        },
        error : function (error) {
            $.mobile.loading('hide');
            console.error(error);
        }
    });
};


/**
 * 서울 열린 데이터 광장 환경 데이터 요청
 * @param {String} addr - 주소
 * @param {String} apiKey - api 키
 * @param {String} envType - 환경 정보 이름
 * @param {date} date - 날짜 (YYYYMMDD)
 * @param {time} time - 시간 (HH00)
 * @param {function} callback - 콜백 함수 function (resultData) {...}
 */
OGDSM.externalConnection.prototype.seoulEnvironmentLoad = function (addr, apiKey, envType, date, time, callback) {
    'use strict';
    var jsonData = {};
    jsonData.serviceKey = apiKey;
    jsonData.returnType = 'json';
    jsonData.serviceName = 'TimeAverageAirQuality';
    jsonData.amount = '1/100';
    jsonData.dateTimeValue = date + time;
    jsonData.envType = envType;
    this.publicDataInterface(addr, jsonData, function (resultData) {
        callback(resultData);
    });
};


/**
 * 데이터 포털 환경 데이터 요청
 * @param {String} addr - 주소
 * @param {String} apiKey - API 키
 * @param {String} envType - 환경 정보 이름
 * @param {String} area - 지역
 * @param {function} callback - 콜백 함수 function (resultData) {...}
 */
OGDSM.externalConnection.prototype.dataPortalEnvironmentLoad = function (addr, apiKey, envType, area, callback) {
    'use strict';
    var jsonData = {};
    jsonData.serviceName = 'ArpltnInforInqireSvc';
    jsonData.numOfRows = '100';
    jsonData.serviceKey = apiKey;
    jsonData.envType = envType;
    jsonData.sidoName = encodeURIComponent(area);

    this.publicDataInterface(addr, jsonData, function (resultData) {
        callback(resultData);
    });
};


/**
 * 데이터 포털 온실가스배출량 조회 서비스
 * @param {String} addr - 주소
 * @param {String} apiKey - API 키
 * @param {String} startDate - 시작 날짜 (YYYYMM 200701 ~ 201412 까지만 데이터 존재)
 * @param {String} endDate - 종료 날짜 (YYYYMM 200701 ~ 201412 까지만 데이터 존재)
 * @param {function} callback - 성공 콜백 함수
 */
OGDSM.externalConnection.prototype.greenGasEmissionLoad = function (addr, apiKey, startDate, endDate, callback) {
    'use strict';
    var jsonData = {};
    jsonData.serviceName = 'GreenGasEmissionReport';
    jsonData.numOfRows = '100';
    jsonData.serviceKey = apiKey;
    jsonData.startDate = startDate;
    jsonData.endDate = endDate;

    this.publicDataInterface(addr, jsonData, function (resultData) {
        callback(resultData);
    });
};


/**
 * 원자력발전소 실시간 주변 방사선량
 * @param {String} addr - 주소
 * @param {String} apiKey - API 키
 * @param {String} genName - 원자력 발전소 이름 (WS, KR, YK, Plant)
 * @param {function} callback - 성공 콜백 함수
 */
OGDSM.externalConnection.prototype.realTimeLevelofRadiationLoad = function (addr, apiKey, genName, callback) {
    'use strict';
    var jsonData = {};
    jsonData.serviceName = 'NuclearPowerPlantRealtimeLevelofRadiation';
    jsonData.serviceKey = apiKey;
    jsonData.startDate = genName;

    this.publicDataInterface(addr, jsonData, function (resultData) {
        callback(resultData);
    });
};

/**
 * geoServer 데이터 리스트 요청
 * @param {String} addr - 서버 주소
 * @param {String} wsName - 워크스페이스 이름
 * @param {Function} callback - 콜백 함수 function (resultData) {...}
 */
OGDSM.externalConnection.prototype.getLayersGeoServer = function (addr, wsName, callback) {
    'use strict';
    var parm = { wsName : wsName };
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    $.ajax({
        type : 'POST',
        url : addr,
        data : JSON.stringify(parm),
        contentType : 'application/json;charset=UTF-8',
        dataType : 'json',
        success : function (msg) {
            var resultData = msg.data;
            $.mobile.loading('hide');
            callback(resultData);
        },
        error : function (error) {
            console.error(error);
        }
    });
};


/**
* OGDSM indexedDB 모듈
*
* - 사용 방법 (Use)
*       OGDSM.indexedDB('dbName'. {options});
* - Options
*   옵션 JSON 객체 키 값<br>
{type:'new', storeName:dbName, insertKey:null, insertData:null,
searchKey: null, searchData: null, editData: null, deleteKey: null, success: false, file : false}<br>
<p style="font-weight:bold;">
type (String) : 모듈 실행 타입 설정 (필요 파라미터)
</p>
<p style="padding-left:2em; background-color:#FFFFFF;">new : DB 생성/ 데이터 삽입 (dbName, storeName, insertData, insertKey)<br>
    insert / forceInsert: 데이터 삽입 / 데이터 강제 삽입 (dbName, storeName, insertData, insertKey)<br>
    searchAll / removeAll : 모든 데이터 검색 / 삭제 (dbName, storeName)<br>
    search: DB 데이터 검색 (dbName, storeName, searchKey, searchData)<br>
    remove: DB 데이터 삭제 (dbName, storeName, deleteKey)<br>
    edit: DB 데이터 수정 (dbName, storeName, searchKey, searchData, editData)<br>
    deleteDB: DB 삭제 (dbName)
</p>
<p style="font-weight:bold;">
storeName (String) : 스토어<br>
insertKey (String) : 삽입 대상 키<br>
insertData (String) : 삽입 데이터<br>
searchKey (String) : 검색 대상 키<br>
searchData (String) : 검색할 데이터<br>
editData (String) : 수정할 데이터<br>
deleteKey (String) : 삭제할 키 데이터<br>
success (function) : 성공 콜백 함수 (데이터 검색일 경우 데이터 파라미터로 보내짐)<br>
fail (function) : 실패 콜백 함수<br>
</p>
* @module OGDSM.indexedDB
**/
OGDSM.indexedDB = function (dbName, options) { //dbName_ StoreName, storeName, success, fail
    'use strict';
    var dbObject = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var iDB = {};
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        type : 'new',
        storeName : dbName,
        insertKey : null,
        insertData : null,
        searchKey : null,
        searchData : null,
        editData : null,
        deleteKey : null,
        success : false,
        fail : false
    };
    defaults = OGDSM.applyOptions(defaults, options);
    if (typeof (Storage) !== 'undefined') {
        if (localStorage.openGDSMobileDBVersion) {
            localStorage.openGDSMobileDBVersion = localStorage.openGDSMobileDBVersion = 1;
        } else {
            localStorage.openGDSMobileDBVersion = localStorage.openGDSMobileDBVersion = 1;
        }
    }
    function insertData(dbName, storeName, data, keyColumn) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
            var request = trans.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                var chkKey = false;
                if (cursor) {
                    var field;
                    if (cursor.key === keyColumn) {
                        chkKey = true;
                    } else {
                        cursor.continue();
                    }
                }
                if (chkKey === false) {
                    trans.put(data, keyColumn);
                    trans.onsuccess = function (e) {
                        if (defaults.success) {
                            defaults.success(data);
                        } else {
                            console.log('Success Insert Data. Please call the second parameter of the callback function');
                        }
                        iDB.db.close();
                    };
                } else {
                    console.log('Fail Insert Data.');
                }
            };
        };
        req.onerror = function (e) {
            console.log(e);
            console.log("Database error: ", e.target.error);
        };
    }
    function updateData(dbName, storeName, data, keyColumn) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
            trans.put(data, keyColumn);
            trans.onsuccess = function (e) {
                console.log("test");
                if (defaults.success) {
                    defaults.success(data);
                } else {
                    console.log('Success Update Data. Please call the second parameter of the callback function');
                }
                iDB.db.close();
            };
        };
        req.onerror = function (e) {
            console.log(e);
            console.log("Database error: ", e.target.error);
        };
    }
    function search(type, dbName, storeName, searchKey, searchData, editData) {
        searchKey = (typeof (searchKey) !== 'undefined') ? searchKey : null;
        searchData = (typeof (searchData) !== 'undefined') ? searchData : null;
        editData = (typeof (editData) !== 'undefined') ? editData : null;
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
//        console.log(req);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            if (iDB.db.objectStoreNames.length === 0) {
                console.log('Not Object Store');
                return -1;
            }
            var trans = iDB.db.transaction(storeName, 'readonly');
            var resultAll = [];
            var result = null;
            trans.oncomplete = function (evt) {
                var searchResult = null;
                var srcResult = null, dstResult = null;
                if (type === 'searchAll') {
                    if (defaults.success) {
                        if (resultAll.length !== 0) {
                            defaults.success(resultAll);
                        } else {
                            console.error('Not data');
                            defaults.fail(resultAll);
                        }
                    } else {
                        console.log('Success search Data. Please call the second parameter of the callback function');
                    }
                } else if (type === 'search' || type === 'edit') {
                    if (result !== null) {
                        if (searchData === null) {
                            console.log('OGDSM log : All search result based On Key');
                            defaults.success(result);
                            return -1;
                        }
                        var value;
                        if (Object.prototype.toString.call(result) === '[object Array]') {
                            var keys = Object.keys(result[0]);
                            var searchkeys = Object.keys(searchData);
                            var i, key;
                            srcResult = JSON.parse(JSON.stringify(result));
                            dstResult = JSON.parse(JSON.stringify(result));
                            for (value in result) {
                                if (result.hasOwnProperty(value)) {
                                    if (result[value][searchkeys[0]] === searchData[searchkeys[0]]) {
                                        searchResult = result[value];
                                        if (type === 'edit') {
                                            dstResult[value][searchkeys[0]] = editData;
                                            updateData(dbName, storeName, dstResult, searchKey);
                                        }
                                        break;
                                    }
                                }
                            }
                            if (defaults.success) {
                                if (searchResult !== null) {
                                    if (type === 'edit') {
                                        defaults.success(editData, srcResult, dstResult);
                                    } else {
                                        defaults.success(result, srcResult);
                                    }
                                } else {
                                    console.log('OGDSM Error : Not data');
                                    return -1;
                                }
                            } else {
                                console.log('Success search Data. Please call the second parameter of the callback function');
                            }
                        } else if (Object.prototype.toString.call(result) === '[object Object]') {
                            console.log(result);
                            console.log('object object');
                        }
                    } else {
                        console.log('OGDSM Error : Not data key');
                        defaults.fail('Not');
                    }
                }
            };
            var request = trans.objectStore(storeName).openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var field;
                    var obj = {};
                    obj.key = cursor.key;
                    obj.value = cursor.value;
                    resultAll.push(obj);
                    if (cursor.key === searchKey) {
                        result = cursor.value;
                    } else {
                        cursor.continue();
                    }
                }
            };
        };
        req.onupgradeneeded = function (event) {
            iDB.db = event.target.result;
            console.log("new DB in search");
            if (storeName !== null) {
                if (iDB.db.objectStoreNames.contains(storeName)) {
                    console.log('Exist Store Name.');
                    //iDB.db.deleteObjectStore(storeName);

                } else {
                    iDB.db.createObjectStore(storeName);
                }
            }
        };
    }
    function edit(dbName, storeName, srcKey, srcData, dstData) {
        search('edit', dbName, storeName, srcKey, srcData, dstData);
    }
    function openDBInsertData(dbName, storeName, data, key) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;

            if (data !== null) {
                insertData(dbName, storeName, data, key);
            } else {
                if (defaults.success) {
                    defaults.success(iDB.db);
                } else {
                    console.log('Success Open / Create Indexed. Please call the second parameter of the callback function');
                }
            }
            iDB.db.close();
        };
        req.onupgradeneeded = function (event) {
            iDB.db = event.target.result;
            console.log("new DB in openDB");
            if (storeName !== null) {
                if (iDB.db.objectStoreNames.contains(storeName)) {
                    console.log('Exist Store Name.');
                  //  iDB.db.deleteObjectStore(storeName);
                } else {
                    iDB.db.createObjectStore(storeName);
                }
            }
        };
        req.onerror = function (e) {
            console.log("Database error: ", e.target.error);
        };
    }
    function removeData(dbName, storeName, key) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite');
            trans.objectStore(storeName).delete(key);
        };
    }
    function clearObjectStore(dbName, storeName) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
            trans.clear();
        };
    }
    if (defaults.type === 'new') {
        openDBInsertData(dbName, defaults.storeName, defaults.insertData, defaults.insertKey);
    } else if (defaults.type === 'insert') {
        insertData(dbName, defaults.storeName, defaults.insertData, defaults.insertKey);
    } else if (defaults.type === 'forceInsert') {
        updateData(dbName, defaults.storeName, defaults.insertData, defaults.insertKey);
    } else if (defaults.type === 'remove') {
        removeData(dbName, defaults.storeName, defaults.deleteKey);
        return -1;
    } else if (defaults.type === 'removeAll') {
        clearObjectStore(dbName, defaults.storeName);
        return -1;
    } else if (defaults.type === 'search') {
        search(defaults.type, dbName, defaults.storeName, defaults.searchKey, defaults.searchData);
    } else if (defaults.type === 'searchAll') {
        search(defaults.type, dbName, defaults.storeName);
    } else if (defaults.type === 'edit') {
        search(defaults.type, dbName, defaults.storeName, defaults.searchKey, defaults.searchData, defaults.editData);
    } else if (defaults.type === 'deleteDB') {
        dbObject.deleteDatabase(dbName);
    }
    return this;
};

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

OGDSM.namesapce('visualization');
(function (OGDSM) {
    "use strict";
    var mapObj;
    /**
     * 지도 시각화 객체(OpenLayers3 활용)
     * @class OGDSM.visualization
     * @constructor
     * @param {String} mapDiv - 지도 DIV 아이디 이름
     * @param {Object} options - 옵션 JSON 객체 키 값<br>
        {layerListDiv:null, attrTableDiv:null, attrAddr:'', indexedDB:true}<br>
        <ul>
            <li>layerListDiv : 레이어 관리 리스트 DIV</li>
            <li>attrTableDiv : 속성 시각화 DIV 아이디 이름</li>
            <li>attrAddr : 속성 시각화 서버 주소</li>
            <li>indexedDB : 속성 정보 모바일 데이터베이스 저장 / 수정</li>
        </ul>
    */
    OGDSM.visualization = function (mapDiv, options) {
        options = (typeof (options) !== 'undefined') ? options : {};
        var name;
        this.updateLayoutSetting(mapDiv);
        this.mapDiv = mapDiv;
        this.geoLocation = null;
        this.featureOverlay = null;
        OGDSM.visualization = this;
        var defaults = {
            layerListDiv : null,
            attrTableDiv : null,
            attrAddr : '',
            indexedDB : true
        };

        for (name in defaults) {
            if (defaults.hasOwnProperty(name)) {
                if (options.hasOwnProperty(name)) {
                    defaults[name] = options[name];
                }
            }
        }

        $(window).on('resize', function () {
            OGDSM.visualization.updateLayoutSetting();
        });
        if (defaults.attrTableDiv !== null) {
            this.attrTableObj = new OGDSM.attributeTable(defaults.attrTableDiv, defaults.attrAddr, this, defaults.indexedDB);
        }
        if (defaults.layerListDiv !== null) {
            this.layerListObj = new OGDSM.mapLayerList(this, defaults.layerListDiv, {
                attrObj : this.attrTableObj
            });
        }
    };
    OGDSM.visualization.prototype = {
        constructor : OGDSM.visualization,
        /**
         * 지도 객체 받기
         * @return {ol3} 오픈레이어 3 객체
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * 현재 레이어 이름 받기
         * @return {Array} 레이어 이름 
         */
        getLayersTitle : function () {
            var i,
                maps = this.getMap().getLayers().getArray(),
                arrObjs = [];
            for (i = 1; i < maps.length; i += 1) {
                var objs = {};
                objs.id = i;
                objs.title = maps[i].get('title');
                arrObjs.push(objs);
            }
            return arrObjs;
        },
        /**
         * 지도 레이어 존재 여부 확인
         * @param {String} layerName - 레이어 이름
         * @return {Object} 레이어가 있을 경우 -> 레이어 객체, 없을 경우 -> false
         */
        layerCheck : function (layerName) {
            var i,
                maps = this.getMap().getLayers().getArray();
            for (i = 0; i < maps.length; i += 1) {
                if (maps[i].get('title') === layerName) {
                    return maps[i];
                }
            }
            return false;
        },
        /**
         * 지도 레이어 인덱스 값  (Editing...)
         * @param {Object} layers - OpenLayers 3 객체
         * @return {Number} 레이어 인덱스 값
         */
        indexOf : function (layers, layer) {
            var length = layers.getLength(), i;
            for (i = 0; i < length; i++) {
                if (layer === layers.item(i)) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 속성정보 객체 받기
         * @return {Object} 속성정보 객체
         */
        getAttrObj : function () {
            return this.attrTableObj;
        },
        /**
         * ...?
         * @return {Object} 속성정보 객체
         */
        getFeatureOverlay : function () {
            return this.featureOverlay;
        }
    };
    return OGDSM.visualization;
}(OGDSM));

/**
 * OpenGDS 모바일 맵 초기화
 * @param {Array}  latlng  - 지도 초기 위,경도 값 (옵션) [default=[37.582200, 127.010031] ]
 * @param {String} mapType - 배경 지도 초기 값 (옵션) [default='OSM']
 * @param {String} baseProj  - 지도 투영 값 (옵션)   [default='EPSG:3857']
 * @return {ol.Map} openlayers3 ol.Map 객체
 */
OGDSM.visualization.prototype.olMapView = function (latlng, mapType, baseProj) {
    'use strict';
    latlng = (typeof (latlng) !== 'undefined') ? latlng : [37.582200, 127.010031];
    mapType = (typeof (mapType) !== 'undefined') ? mapType : 'OSM';
    baseProj = (typeof (baseProj) !== 'undefined') ? baseProj : 'EPSG:3857';
    var map = null, baseMapLayer = null, geolocation;
    var epsg5181 = new ol.proj.Projection({
        code : 'EPSG:5181',
        extent : [-219825.99, -535028.96, 819486.07, 777525.22],
        units : 'm'
    });
    var epsg5179 = new ol.proj.Projection({
        code : 'EPSG:5179',
        extent : [531371.84, 967246.47, 1576674.68, 2274021.31],
        units : 'm'
    });
    ol.proj.addProjection(epsg5181);
    ol.proj.addProjection(epsg5179);
    var baseView = new ol.View({
        projection : ol.proj.get(baseProj),
        center : ol.proj.transform(latlng, 'EPSG:4326', baseProj),
        zoom : 12,
        maxZoom : 18,
        minZoom : 6
    });
    map = new ol.Map({
        target : this.mapDiv,
        layers : [
            new ol.layer.Tile({
                title : 'basemap',
                source : baseMapLayer
            })
        ],
        view : baseView,
        controls: []
    });
    this.featureOverlay = new ol.FeatureOverlay({
        map : map,
        style : (function () {
            var styleStroke = new ol.style.Stroke({
                color : 'rgba(255, 0, 0, 1.0)',
                width : 3
            });
            return function (feature, resolution) {
                var type = feature.getGeometry().getType();
                var styleCircle = new ol.style.Circle({
                    radius : 10,
                    fill : feature.get('styleCircle').getFill(),
                    stroke : styleStroke
                });
                if (type === 'MultiPolygon') {
                    return [new ol.style.Style({
                        fill : feature.get('styleFill'),
                        stroke : styleStroke,
                        text : feature.get('styleText')
                    })];
                } else if (type === 'Point') {
                    return [new ol.style.Style({
                        image : styleCircle,
                        text : feature.get('styleText')
                    })];
                }
            };
        }())
    });
    var featureOverlay = this.featureOverlay;
    this.interaction = new ol.interaction.Select({
        layers : function (layer) {
            return true;
        },
        style : (function () {
            var styleStroke = new ol.style.Stroke({
                color : 'rgba(255, 0, 0, 1.0)',
                width : 3
            });
            return featureOverlay.getStyle();
        }())
    });
    map.addInteraction(this.interaction);
        /*
        function (feature, resolution) {
            var styleStroke = new ol.style.Stroke({
                color : 'rgba(255, 0, 0, 1.0)',
                width : 3
            });
            return [new ol.style.Style({
                fill : feature.get('styleFill'),
                stroke : styleStroke,
                text : feature.get('styleText')
            })];
        */
    this.mapObj = map;
    this.baseProj = baseProj;
    this.changeBaseMap(mapType);
    this.mapObj.updateSize();
    return this.mapObj;
};


/**
 * 배경지도 변경
 * @param {String} mapStyle - 지도 스타일 이름 ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
 */
OGDSM.visualization.prototype.changeBaseMap = function (mapStyle) {
    "use strict";
    var TMS = null, view = null, baseLayer = null, map = this.mapObj, maplayers = map.getLayers(),
        mapCenter = map.getView().getCenter(), mapZoom = map.getView().getZoom(), mapProj = map.getView().getProjection();

    maplayers.forEach(function (obj, i) {
        var layerTitle = obj.get('title');
        if (layerTitle === 'basemap') {
            baseLayer = obj;
        }
    });
    if (mapStyle === 'OSM') {
        TMS = new ol.source.OSM();
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom
        });
    } else if (mapStyle === 'VWorld') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === 'VWorld_s') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Satellite/201301/{z}/{x}/{y}.jpeg"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === 'VWorld_g') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/gray/201411/{z}/{x}/{y}.png"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === 'VWorld_m') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/midnight/201411/{z}/{x}/{y}.png"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === '') {
        TMS = null;
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else {
        console.error('Not Map Style "OSM" | "VWorld" | "VWorld_m" | "VWorld_h"');
        return null;
    }
    if (baseLayer !== null) {
        map.setView(view);
        baseLayer.setSource(TMS);
    }
};

/**
 * 지도 GPS 트래킹
 * @param {boolean} sw - Geolocation 스위치 (true | false)
 **/
OGDSM.visualization.prototype.trackingGeoLocation = function (sw) {
    'use strict';
    var geolocation = this.geoLocation, mapObj = this.mapObj;
    if (typeof (this.mapObj) === 'undefined') {
        console.error('Not Create Map!!');
        return null;
    }
    if (geolocation === null) {
        geolocation = new ol.Geolocation({
            projection:	mapObj.getView().getProjection(),
            tracking : true
        });
    }

    if (sw === true) {
        geolocation.once('change:position', function () {
            mapObj.getView().setCenter(geolocation.getPosition());
        });
    }
};
/**
 * 지도 해상도에 최적화 이벤트
 * @param {String} mapDiv - 지도 DIV 아이디 이름
 **/
OGDSM.visualization.prototype.updateLayoutSetting = function (mapDiv) {
    'use strict';
    mapDiv = (typeof (mapDiv) !== 'undefined') ? mapDiv : this.mapDiv;
    if (typeof (this.mapObj) !== 'undefined') {
        this.mapObj.updateSize();
    }
};

/**
 * WMS 및 WFS 맵 레이어 추가
 * @param {Object} data - 오픈레이어3 지도 객체
 */
OGDSM.visualization.prototype.addMap = function (data) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    var featureOverlay = this.featureOverlay;
    var interaction = this.interaction;
    var mapObj = this.getMap();
    if (chkData === true) {
        console.log("OpenGDS Mobile : Layer is existence");
        return -1;
    }
    mapObj.addLayer(data);
    featureOverlay.getFeatures().clear();
    /*layer list On*/
    var geoType = '';
    if (typeof (this.layerListObj) !== 'undefined') {
        var color;
        if (typeof data.getStyle !== 'undefined') {
            var geometryObj = data.getSource().getFeatures()[0].getGeometry();
            geoType = geometryObj.getType();
            color = data.get('styleFill');
        } else {
            color =  'rgb(0, 0, 0)';
        }
        this.layerListObj.addList(data, data.get('title'), color, geoType);
    }
    /*attribute On*/
    if (geoType != '') {
	    if (typeof (this.attrTableObj) !== 'undefined') {
	        var attrTableObj = this.attrTableObj;
	        attrTableObj.addAttribute(data.get('title'));
	        interaction.getFeatures().on('add', function (event) {
	            var label = event.target.item(0).get('label');
	            var selectValue = event.target.item(0).get(label);
	            featureOverlay.getFeatures().clear();
	            attrTableObj.selectAttribute(data.get('title'), label, selectValue, attrTableObj);
	        });
	        featureOverlay.getFeatures().on('add', function (event) {
	            attrTableObj.unSelectAttribute(attrTableObj);
	            mapObj.removeInteraction(interaction);
	            mapObj.addInteraction(interaction);
	        });
	    }
    }

};
/**
 * 이미지 레이어 시각화
 * @param {String} imgURL - 이미지 주소
 * @param {String} imgTitle - 이미지 타이틀
 * @param {Array} imgSize - 이미지 사이즈 [width, height]
 * @param {Array} imgExtent - 이미지 위치 [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top]
 */
OGDSM.visualization.prototype.imageLayer = function (imgURL, imgTitle, imgSize, imgExtent) {
    'use strict';
    var imgLayer = null,
        title = imgTitle;

    imgLayer = new ol.layer.Image({
        opacity : 1.0,
        title : title,
        source : new ol.source.ImageStatic({
            url : imgURL + '?' + Math.random(),
            imageSize : imgSize,
            projection : new ol.proj.Projection({code : 'EPSG:3857'}),
            imageExtent : imgExtent

        })
    });
    this.getMap().addLayer(imgLayer);
};
/**
 * 맵 레이어 삭제
 * @param {String} layerName - 레이어 이름
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
        if (typeof (this.layerListObj) !== 'undefined') {
            this.layerListObj.removeList(layerName);
        }
    }
};
/**
 * 맵 레이어 시각화 여부
 * @param {String} layerName - 레이어 이름
 * @param {Boolean} flag - 시각화 스위치 [true | false}
 */
OGDSM.visualization.prototype.setVisible = function (layerName, flag) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        obj.setVisible(flag);
    }
};
/**
 * WFS 스타일 변경
 * @param {String} layerName - 오픈레이어3 레이어 이름
 * @param {Object} colors - 변경할 색상(Hex Color, String or Array)
 * @param {Object} options - 옵션 JSON 객체 키 값 <br>
 *     {type:'polygon', opt : '0.5', attr: null, range: null, xyData: null}<br>
        <ul>
            <li>type(String) : 객체 타입 (polygon, point)</li>
            <li>opt(Number) : 레이어 투명도 </li>
            <li>attr(String) : 속성 이름</li>
            <li>range(Array) : 색상 범위</li>
            <li>xyData(Array) : 색상 데이터</li>
        </ul>
 */
OGDSM.visualization.prototype.changeWFSStyle = function (layerName, colors, options) {
    'use strict';
    var i = null, name,
        map = this.layerCheck(layerName),
        styleCache = {},
        style = null;
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        type : 'polygon',
        opt : 0.5,
        attr : null,
        range : null,
        data : null,
        rootKey : null,
        labelKey : null,
        valueKey : null
    };

    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    if (map === false) {
        console.error('Not Map Layer');
        return -1;
    }
    var data = defaults.data[defaults.rootKey];
    map.setStyle(function (f, r) {
        var i,
            j,
            color = '#FFFFFF',
            text = r < 5000 ? f.get(defaults.attr) : '';
        if (!styleCache[text]) {
            if (Array.isArray(colors)) {
                for (i = 0; i < data.length; i += 1) {
                    if (text === data[i][defaults.labelKey]) {
                        for (j = 0; j < defaults.range.length; j += 1) {
                            if (data[i][defaults.valueKey] <= defaults.range[j]) {
                                color = colors[j];
                                break;
                            }
                        }
                    }
                }
            } else {
                color = colors;
            }
            if (defaults.type === 'polygon') {
                styleCache[text] = [new ol.style.Style({
                    fill : new ol.style.Fill({
                        color : color
                    }),
                    stroke : new ol.style.Stroke({
                        color : '#00000',
                        width : 1
                    }),
                    text : new ol.style.Text({
                        font : '9px Calibri,sans-serif',
                        text : text,
                        fill : new ol.style.Fill({
                            color : '#000000'
                        })
                    })
                })];
            } else if (defaults.type === 'point') {
                styleCache[text] = [new ol.style.Style({
                    image : new ol.style.Circle({
                        radius : 5,
                        fill : new ol.style.Fill({
                            color : color
                        }),
                        stroke : new ol.style.Stroke({
                            color : '#000000',
                            width : 1
                        })
                    })
                })];
            }


        }
        return styleCache[text];
    });
    map.setOpacity(defaults.opt);
};

OGDSM.namesapce('webSocket');
(function (OGDSM) {
    'use strict';
    /**
     * 속성정보 시각화 객체
     * @class OGDSM.attributeTable
     * @constructor
     * @param {String} RootDiv - 속성 테이블 DIV 이름
     * @param {String} addr - PostgreSQL 접속 주소
     */
    OGDSM.webSocket = function (addr, userName, options) {
        if (typeof (window.WebSocket) === 'undefined') {
            console.error("webSocket is not supported by your browser!");
            return -1;
        }
        var defaults = {
            data : null,
            subject : null,
            callback : function (evt) { console.log("Plase create callback function"); }
        };
        defaults = OGDSM.applyOptions(defaults, options);
        var ws = new WebSocket(addr);
        this.ws = ws;
        /**
         * JSON Object {userid : '', subject : ''} based on ApplicationServer
         */
        ws.onopen = function () {
            var jsonObj = {};
            jsonObj.userid = userName;
            jsonObj.subject = defaults.subject;
            console.log(jsonObj);
            ws.send(JSON.stringify(jsonObj));
        };
        ws.onmessage = defaults.callback;
    };
    OGDSM.webSocket.prototype = {
        constructor : OGDSM.webSocket,

        /**
         * 수정 모드 여부 받기
         * @return {Boolean} True | False
         */
        getEditMode : function () {
            return this.editMode;
        }
    };
    return OGDSM.webSocket;
}(OGDSM));


/**
 * 속성 정보 추가
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
 */
OGDSM.webSocket.prototype.send = function (data) {
    'use strict';
    var ws = this.ws;
    ws.send(data);
};

/**
 * 연결 종료
 */
OGDSM.webSocket.prototype.webSocketClose = function () {
    'use strict';
    var ws = this.ws;
    ws.close();
};