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
