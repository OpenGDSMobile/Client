/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM*/

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
    OGDSM.attributeTable = function (rootDiv, addr) {
        this.rootDiv = rootDiv;
        this.addr = addr;
        this.editMode = false;
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
        getEditMode : function () {
            return this.editMode;
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
        rootDiv = this.rootDiv,
        tabs = $('#' + rootDiv + 'Tab'),
        contents = $('#' + rootDiv + 'Contents'),
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
    }
    function createTableCol(attrContents, i, tableBody, tableTh) {
        $.each(attrContents, function (key, value) {
            if (key === 'geom') {
                return true;
            }
            if (i === 0) {
                tableTh.append('<th>' + key + '</th>');
            }
            var newCell = tableBody.find('tr:last');
            newCell.append('<td>' +
                           '<input type="text" value="' + value + '" class="editSW" style="' + textInputCSS + '"' +
                           'disabled=true>' +
                           '</td>');
        });
    }
    function tableEvent() {
        /**********tr select ****************/
        $('#attrTable' + layerName + ' tbody').on('click', 'tr', function () {
            tableObj.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        /**********page change **************/
        $('#attrTable' + layerName).on('page.dt', function (e, settings) {
            setTimeout(function () {
                attrObj.editAttribute(attrObj.getEditMode());
            }, 200);
        });
    }
    /******* Add tab ***********/
    tabs.prepend('<li id="attrTab' + layerName + '" style="float:left;">' +
                 '<a href="#" style="' + aBaseCSS + '">' + layerName + '</a></li>');
    $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
    $('#attrTab' + layerName + ' a').css('border-bottom', borderSelected);
    $('#attrTab' + layerName + ' a').css('background', backgroundSelected);
    $('#attrTab' + layerName + ' a').css('color', colorSelected);

    /******* Add Content ***********/
    var attrDivHeight = $('#' + rootDiv + 'Contents').height();
    contents.prepend('<div id="attrContent' + layerName + '" class="attrTable">' +
                     '<table id="attrTable' + layerName + '" class="display compact" cellspacing="0" width="100%">' +
                     '<thead style="width:100%;"><tr></tr></thead>' +
                     '<tbody style="text-align:center"></tbody></table></div>');

    /******* Event *******************/
    $('.attrTable').hide();
    $('#attrContent' + layerName).css('display', 'block');
    $('#attrTab' + layerName + ' a').bind('click', tabClickEvent);

    var parm = {};
    parm.tableName = layerName;
    $.ajax({
        type : 'POST',
        url : this.addr,
        data : JSON.stringify(parm),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var attrContents = msg.data, i = 0;
            if (attrContents === null) {
                console.log('Not attribute information');
                return -1;
            }
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
            tableEvent();
            /*
            $(window).on('resize', function () {
                var attrDivHeight = $('#' + rootDiv + 'Contents').height();
                var thHeight = $('thead').height() + 7;
            });
            */
        },
        error : function (error) {
            console.log(error);
        }
    });
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
OGDSM.attributeTable.prototype.editAttribute = function (sw) {
    'use strict';
    var textInput = $('.editSW');
    if (sw === true) {
        textInput.attr('disabled', false);
        this.editMode = true;
    } else {
        textInput.attr('disabled', true);
        this.editMode = false;
    }
};
