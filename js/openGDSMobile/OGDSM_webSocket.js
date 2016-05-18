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
OGDSM.webSocket.prototype.send = function (data) {
    'use strict';
    var ws = this.ws;
    ws.send(data);
};

OGDSM.webSocket.prototype.webSocketClose = function () {
    'use strict';
    var ws = this.ws;
    ws.close();
};
/*
OGDSM.webSocket.prototype.received = function (evt) {
    'use strict';

};
*/
