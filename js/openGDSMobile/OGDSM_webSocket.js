/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM, mappingDB, WebSocket*/

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
    OGDSM.webSocket = function (addr, userName) {
        if (typeof (window.WebSocket) === 'undefined') {
            console.error("webSocket is not supported by your browser!");
            return -1;
        }
        var ws = new WebSocket(addr);
        this.ws = ws;
        ws.onopen = function () {
            ws.send('Connent');
        };

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log('message is receiced...');
            var p = document.createElement("p");
            p.setAttribute("class", "server");
            p.innerHTML = evt.data;
            var container = document.getElementById("container");
            container.appendChild(p);
        };

        ws.onclose = function () {
            console.log('Connection is closed...');
        };
    };
    OGDSM.webSocket.prototype = {
        constructor : OGDSM.webSocket,

        /**
         * 수정 모드 여부 받기
         * @method getEidtMode
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
 * @method addAttribute
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
 */
OGDSM.webSocket.prototype.close = function () {
    'use strict';
    var ws = this.ws;
};
