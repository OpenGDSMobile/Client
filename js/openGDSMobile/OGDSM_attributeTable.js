/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM*/

OGDSM.namesapce('attributeTable');
(function (OGDSM) {
    'use strict';
    /**
     * 속성정보 시각화 객체
     *
     * @class OGDSM.attributeTable
     * @constructor
     * @param {String} RootDiv - Attribute table div name
     * @param {String} addr - PostgreSQL connect address
     */
    OGDSM.attributeTable = function (rootDiv, addr) {
        this.rootDiv = rootDiv;
        this.addr = addr;
        var rootElement = document.getElementById(rootDiv),
            ulElement = document.createElement('ul'),
            contentsElement = document.createElement('div');
        var contentsCSS = 'width: 100%; height: 100%; background: rgba(255, 255, 255, 1); margin: 0px;',
            ulCSS = 'list-style: none; position: relative; margin: 0px; z-index: 2; top: 1px; display: table; border-left: 1px solid #f5ab36;';

        ulElement.id = rootDiv + 'Tab';
        ulElement.style.cssText = ulCSS;

        contentsElement.id = rootDiv + 'Contents';
        contentsElement.style.cssText = contentsCSS;

        rootElement.appendChild(ulElement);
        rootElement.appendChild(contentsElement);
    };
    OGDSM.attributeTable.prototype = {
        constructor : OGDSM.attributeTable
    };
    return OGDSM.attributeTable;
}(OGDSM));

/**
 * 속성 정보 추가
 * Add attribute table (Connect PostgreSQL)
 * @method addAttribute
 * @param {String}  layerName   - Database table name
 */
OGDSM.attributeTable.prototype.addAttribute = function (layerName) {
    'use strict';
    var rootDiv = this.rootDiv,
        tabs = $('#' + rootDiv + 'Tab'),
        contents = $('#' + rootDiv + 'Contents');
    var aBaseCSS = 'background:#ffd89b; color: #222; display:block; padding:6px 15px; text-decoration:none; border-right:1px solid #f5ab36;' +
               'border-top:1px solid #f5ab36; border-right:1px solid #f5ab36; margin:0;',
        backgroundNotSelected = '#ffd89b',
        colorNotSelected = '#222',
        backgroundSelected = '#fff',
        colorSelected = '#344385',
        borderSelected = '1px solid #fff';
    function tabClickEvent(e) {
        $('#' + rootDiv + 'Tab a').css('border-bottom', '');
        $('#' + rootDiv + 'Tab a').css('color', colorNotSelected);
        $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
        $(e.currentTarget).css('border-bottom', borderSelected);
        $(e.currentTarget).css('background', backgroundSelected);
        $(e.currentTarget).css('color', colorSelected);
        $('.attrTable').hide();
        $('#divAttrTable' + layerName).css('display', 'block');
    }
    tabs.prepend('<li id="attrTab' + layerName + '" style="float:left;"><a href="#" style="' + aBaseCSS + '">' + layerName + '</a></li>');
    $('#' + rootDiv + 'Tab a').css('border-bottom', '');
    $('#' + rootDiv + 'Tab a').css('color', colorNotSelected);
    $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
    $('#attrTab' + layerName + ' a').css('border-bottom', borderSelected);
    $('#attrTab' + layerName + ' a').css('background', backgroundSelected);
    $('#attrTab' + layerName + ' a').css('color', colorSelected);

    var attrDivHeight = $('#' + rootDiv + 'Contents').height();
    contents.prepend('<div id="divAttrTable' + layerName + '" class="attrTable"><table id="attrTable' + layerName + '" class="display compact" cellspacing="0" width="100%">' +
                     '<thead style="width:100%;"><tr></tr></thead>' +
                     '<tbody></tbody></table></div>');

    $('.attrTable').hide();
    $('#divAttrTable' + layerName).css('display', 'block');
    $('#attrTab' + layerName + ' a').bind('click', tabClickEvent);
    var parm = '{"tableName":"' + layerName + '"}';
    parm = JSON.parse(parm);
    function createTableCol(attrContents, i, tableBody, tableTh) {
        $.each(attrContents, function (key, value) {
            if (key === 'geom') {
                return true;
            }
            if (i === 0) {
                tableTh.append('<th>' + key + '</th>');
            }
            var newCell = tableBody.find('tr:last');
            newCell.append('<td>' + value + '</td>');
        });
    }
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
            var tableDiv = $('#attrTable' + layerName),
                tableTh = tableDiv.find('thead').find('tr'),
                tableBody = tableDiv.find('tbody');
            for (i = 0; i < attrContents.length; i++) {
                tableBody.append('<tr>');
                createTableCol(attrContents[i], i, tableBody, tableTh);
                tableBody.append('</tr>');
            }

            var thHeight = $('thead').height() + 7;
            $('#attrTable' + layerName).DataTable({
                'paging' : false,
                'scrollY' : attrDivHeight - thHeight,
                'scrollX' : true,
                'scrollCollapse' : true,
                'bFilter' : false
            });

            $(window).on('resize', function () {
                var attrDivHeight = $('#' + rootDiv + 'Contents').height();
                var thHeight = $('thead').height() + 7;
                $('.divAttrTable table').DataTable({
                    'paging' : false,
                    'scrollY' : attrDivHeight - thHeight,
                    'scrollX' : true,
                    'scrollCollapse' : true,
                    'bFilter' : false
                });
            });
        },
        error : function (e) {
            console.log(e);
        }
    });
};
