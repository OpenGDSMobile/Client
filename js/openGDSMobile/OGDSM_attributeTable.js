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
     * @param {String} RootDiv - eGovframework theme a~g (default c)
     */
    OGDSM.attributeTable = function (rootDiv) {
        this.rootDiv = rootDiv;
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
        $('#' + rootDiv + 'Contents table').css('display', 'none');
        $('#attrTable' + $(e.currentTarget).text()).css('display', 'block');
    }
    tabs.prepend('<li id="attrTab' + layerName + '" style="float:left;"><a href="#" style="' + aBaseCSS + '">' + layerName + '</a></li>');
    $('#' + rootDiv + 'Tab a').css('border-bottom', '');
    $('#' + rootDiv + 'Tab a').css('color', colorNotSelected);
    $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
    $('#attrTab' + layerName + ' a').css('border-bottom', borderSelected);
    $('#attrTab' + layerName + ' a').css('background', backgroundSelected);
    $('#attrTab' + layerName + ' a').css('color', colorSelected);

    contents.prepend('<table id="attrTable' + layerName + '" style="width:100%">' +
                     '<thead><tr><th>' + layerName + '</th></tr></thead>' +
                     '<tbody></tbody>');
    $('#' + rootDiv + 'Contents table').css('display', 'none');
    $('#attrTable' + layerName).css('display', 'block');
    $('#attrTab' + layerName + ' a').bind('click', tabClickEvent);



    $.ajax({
        type : 'POST',
        url : 'http://113.198.80.60:8087/mobile/attrTable.do',
        crossDomain: true,
        dataType : 'jsonp',
        success : function (msg) {
            console.log(msg);
        },
        error : function (e) {
            console.log(e);
        }
    });





};
