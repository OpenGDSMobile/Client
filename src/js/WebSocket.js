goog.provide('openGDSMobile.WebSocket');


goog.require('openGDSMobile.util.applyOptions');

/**
 *
 * @type {null}
 */
/*openGDSMobile.WebSocket.ws = null;*/

/**
 *
 * @param _addr
 * @param _data
 * @returns {number}
 * @constructor
 */
openGDSMobile.WebSocket = function (_addr, _data) {
    _data = (typeof (_data) !== 'undefined') ? _data : null;
    if (typeof (window.WebSocket) === 'undefined') {
        console.error('WebSocket is not supported by your browser!');
        return -1;
    }


    openGDSMobile.WebSocket.ws = new WebSocket(_addr);

    openGDSMobile.WebSocket.ws.onopen = function () {
        openGDSMobile.WebSocket.ws.send(JSON.stringify(_data));
        console.log('WebSocket Complete and Send : ' + JSON.stringify(_data));
    };

    openGDSMobile.WebSocketSW = true;
};

/**
 *
 * @param _data
 */
openGDSMobile.WebSocket.prototype.send = function (_data) {
    openGDSMobile.WebSocket.ws.send(_data);
};

/**
 *
 */
openGDSMobile.WebSocket.prototype.close = function () {
    openGDSMobile.WebSocket.ws.close();
};