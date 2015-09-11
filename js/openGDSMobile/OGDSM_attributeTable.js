/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM, mappingDB*/

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
        this.rootDiv = rootDiv;
        this.addr = addr;
        this.editMode = false;
        this.visualObj = visualObj;
        this.attrSelected = false;
        this.indexedDB_SW = indexedDB_SW;
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

        /**
         * 수정 모드 여부 받기
         * @method getEidtMode
         * @return {Boolean} True | False
         */
        getEditMode : function () {
            return this.editMode;
        },
        /**
         * 현재 선택 객체 받기 (테이블)
         * @method getSelectObj
         * @return {Object}
         */
        getSelectObj : function () {
            return this.attrSelected;
        },
        /**
         * 현재 선택 객체 설정 (테이블)
         * @method setSelectObj
         * @param {Object} obj - 테이블 객체
         **/
        setSelectObj : function (obj) {
            this.attrSelected = obj;
        },
        /**
         * 현재 선택 객체 설정 (오픈레이어)
         * @method getolSelectObj
         * @return {Ol Feature Object}
         */
        getolSelectObj : function (obj) {
            return this.olSelectObj;
        },
        setolSelectObj : function (obj) {
            this.olSelectObj = obj;
        }
    };
    return OGDSM.attributeTable;
}(OGDSM));

/**
 * 속성 정보 추가
 * @method addAttribute
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
 */
OGDSM.attributeTable.prototype.addAttribute = function (layerName) {
    'use strict';
    var attrObj = this,
        addr = this.addr,
        rootDiv = this.rootDiv,
        indexedDB_SW = this.indexedDB_SW,
        tabs = $('#' + rootDiv + 'Tab'),
        contents = $('#' + rootDiv + 'Contents'),
        visualObj = this.visualObj,
        attrSelected = this.attrSelected,
        tableObj = null;
    var aBaseCSS = 'display:block; padding:6px 15px; text-decoration:none; border-right:1px solid #000;' +
                   'border-top:1px solid #000; margin:0;',
        backgroundNotSelected = '#fff',
        backgroundSelected = '#ffd89b',
        colorSelected = '#344385',
        borderSelected = '1px solid #fff',
        textInputCSS = 'background-color: transparent; border:0px solid; font-size:15px;';
    function tabClickEvent(e) {
        $('#' + rootDiv + 'Tab a').css('border-bottom', '');
        $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
        $(e.currentTarget).css('border-bottom', borderSelected);
        $(e.currentTarget).css('background', backgroundSelected);
        $('.attrTable').hide();
        $('#attrContent' + layerName).css('display', 'block');
        $('.attrTable tr.selected').removeClass('selected');
    }
    function createTableCol(attrContents, i, tableBody, tableTh) {
        $.each(attrContents, function (key, value) {
            if (key === 'geom') {
                return true;
            }
            if (i === 0) {
                tableTh.append('<th data-value="' + key + '">' + key + '</th>');
            }
            var newCell = tableBody.find('tr:last').attr('data-row', i + 1);
            newCell.append('<td>' +
                           '<input type="text" value="' + value + '" class="editSW" style="' + textInputCSS + '"' +
                           'data-key="' + key + '" data-label="' + layerName + '" disabled=true>' +
                           '</td>');
        });
    }
    var featureOverlay = null;
    if (visualObj !== null) {
        featureOverlay = new ol.FeatureOverlay({
            map : visualObj.getMap(),
            style : function (feature, resolution) {
                var styleStroke = new ol.style.Stroke({
                    color : 'rgba(255, 0, 0, 1.0)',
                    width : 3
                });
                return [new ol.style.Style({
                    fill : feature.get('styleFill'),
                    stroke : styleStroke,
                    text : feature.get('styleText')
                })];
            }
        });
        this.featureOverlay = featureOverlay;
    }
    function tableEvent(evtLayerName) {
        /*tr select*/
        $('#attrTable' + evtLayerName + ' tbody').on('click', 'tr', function () {
            var i = 0;
            tableObj.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            // selected layer color change...
            if (visualObj !== null) {
                var eachFeatures = visualObj.layerCheck(evtLayerName).getSource().getFeatures();
                featureOverlay.removeFeature(attrObj.getSelectObj());
                for (i = 0; i < eachFeatures.length; i++) {
                    var vectorObj = eachFeatures[i];
                    var num = vectorObj.Z.split('.');
                    if (num[1] === $(this).attr('data-row')) {
                        featureOverlay.addFeature(vectorObj);
                        attrObj.setSelectObj(vectorObj);
                    }
                }
                attrObj.getolSelectObj().getFeatures().clear();
            }
        });

        /*page change*/
        $('#attrTable' + evtLayerName).on('page.dt', function (e, settings) {
            setTimeout(function () {
                attrObj.editAttribute(attrObj.getEditMode());
            }, 200);
        });
    }

    function indexedDBEvent(layerName, data) {
        OGDSM.indexedDB('webMappingDB', {
//            insertKey : layerName + '--Local',
            insertKey : layerName,
            insertData : data,
            success : function () {
                console.log("success");
            },
            fail : function () {
                console.log("fail");
            }
        });
    }

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

    var parm = {};
    parm.tableName = layerName;

    function visTableAttr(attrContents) {
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
        tableObj = $('#attrTable' + layerName).DataTable({
            'bFilter' : false,
            'bLengthChange' : 10,
            'bPaginate' : true,
            "dom": 'rt<"bottom"ip><"clear">'
        });
        tableEvent(layerName);
    }

    function requestAttr(addr) {
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
                console.log('indexedDB Data OK');
                //indexed 에 있는 걸 불러올건지.... 아님 요청할껀지....에 대한.... 확인메시지
                //확인시.... 기존 저장 데이터 삭제 후 다시 저장....
                visTableAttr(attrContents);
            },
            fail : function (result) {
                console.log('indexedDB Data Not request Data');
                requestAttr(addr);
            }
        });
    } else {
        console.log('indexedDB SW false request Data');
        requestAttr(addr);
    }
};

/**
 * 속성 정보 삭제
 * @method removeAttribute
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
 */
OGDSM.attributeTable.prototype.removeAttribute = function (layerName) {
    'use strict';
    $('#' + 'attrTab' + layerName).remove();
    $('#' + 'attrContent' + layerName).remove();
};
/**
 * 속성 정보 수정
 * @method removeAttribute
 * @param {boolean}  sw   - 수정 스위치
 */
OGDSM.attributeTable.prototype.editAttribute = function (sw, layer, wsObj) {
    'use strict';
    wsObj = (typeof (wsObj) !== 'undefined')  ? wsObj : null;
    var attrLayer = (typeof (layer) !== 'undefined')  ? '#attrTable' + layer + ' ' : '';
    var textInput = $(attrLayer + '.editSW');
    var thisObj = this;
    var oldValue = null;
    var searchData = {};
    function editDataResult(edit, src, dst) {
        var jsonObj = {};
        console.log('Update data');
        function addArrayJSON(arrJSON) {
            jsonObj.tableName = layer;
            jsonObj.column = Object.keys(searchData)[0];
            jsonObj.srcData = oldValue;
            jsonObj.dstData = edit;
            arrJSON.push(jsonObj);
            if (wsObj !== null) {
                wsObj.send(JSON.stringify(arrJSON));
                OGDSM.indexedDB('webMappingDB', {
                    type : 'remove',
                    deleteKey : 'editedData'
                });
            } else {
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


    if (sw === true) {
        textInput.attr('disabled', false);
        console.log(textInput);
        textInput.on('focus', function () {
            oldValue = $(this).val();
        });
        textInput.on('change', function () {
            searchData = {};
            if (oldValue === $(this).val()) {
                return -1;
            }
            searchData[$(this).attr('data-key')] = oldValue;
            console.log(searchData);
            if (thisObj.indexedDB_SW === true) {
                OGDSM.indexedDB('webMappingDB', {
                    type : 'edit',
                    searchKey : $(this).attr('data-label'),
                    searchData : searchData,
                    editData : $(this).val(),
                    success : editDataResult
                });
            }
        });
        this.editMode = true;
    } else {
        textInput.attr('disabled', true);
        textInput.off('change');
        textInput.off('focus');
        this.editMode = false;
    }
};

/**
 * 속성 정보 검색
 * @method selectAttribute
 * @param {String}  tableName   - 테이블 이름
 * @param {String}  header   - 검색 컬럼
 * @param {String}  value   - 검색 값
 * @return {Number}  테이블 인덱스
 */
OGDSM.attributeTable.prototype.searchAttribute = function (tableName, header, value) {
    'use strict';
    var tableObj = $('#attrTable' + tableName).DataTable();
    var searchIdx = 0;
    var resultIdx = null;
    //console.log(tableName + ' ' + header + ' ' + value);
    tableObj.columns().header().each(function (data, i) {
        var tableHeader = $(data).attr('data-value');
        if (header === tableHeader) {
            searchIdx = i;
            return false;
        }
    });

    tableObj.columns(searchIdx).every(function () {
        $(this.data()).each(function (i, data) {
            if ($(this).val() === value) {
                resultIdx = i;
            }
        });
    });
    console.log('search Attr: ' + resultIdx);
    return resultIdx;
};

/**
 * 속성 정보 선택
 * @method selectAttribute
 * @param {String}  tableName   - 테이블 이름
 * @param {String}  trNum   - 테이블 인덱스
 */
OGDSM.attributeTable.prototype.selectAttribute = function (tableName, trNum) {
    'use strict';
    var tableObj = $('#attrTable' + tableName).DataTable();
    tableObj.$('tr.selected').removeClass('selected');
    tableObj.$('tr').eq(trNum).addClass('selected');
};
/**
 * 속성 정보 선택 해제
 * @method selectAttribute
 * @param {String}  tableName   - 테이블 이름
 */
OGDSM.attributeTable.prototype.unSelectAttribute = function (tableName) {
    'use strict';
    var tableObj = $('#attrTable' + tableName).DataTable();
    tableObj.$('tr.selected').removeClass('selected');
    // selected layer color change...
    if (this.getSelectObj() !== false) {
        this.featureOverlay.removeFeature(this.getSelectObj());
        this.attrSelected = false;
    }
};
