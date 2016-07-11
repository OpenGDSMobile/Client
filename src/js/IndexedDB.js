goog.provide('openGDSMobile.IndexedDB');

goog.require('openGDSMobile.util.applyOptions');


openGDSMobile.IndexedDB.db = null;

openGDSMobile.IndexedDB = function (_options) {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        dbName : 'OpenGDSMobileDB',
        storeName : 'vectorStore',
        version : 1.0,
        keyPath : 'layerName'
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    if (!window.indexedDB) {
        window.alert('Your borwser does not support a stable version of IndexedDB.');
        this.avabile = false;
        return -1;
    }
    this.request = window.indexedDB.open(options.dbName, options.version);
    openGDSMobile.IndexedDB.db = null;

    this.request.onsuccess = function (evt) {
        openGDSMobile.IndexedDB.db = evt.target.result;
    };
    this.request.onerror = function (error) {
        console.error(error);
    };

    this.request.onupgradeneeded = function (evt) {
        openGDSMobile.IndexedDB.db = evt.target.result;
        var objectStore = openGDSMobile.IndexedDB.db.createObjectStore(options.storeName, {keyPath : 'layerName'});
        console.log('upgraded');
    };
    openGDSMobile.IndexedDBSW = true;
};


openGDSMobile.IndexedDB.prototype.addData = function (_layerName, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        storeName: 'vectorStore'
    }
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var trans = openGDSMobile.IndexedDB.db.transaction([options.storeName], 'readwrite');
    var objectStore = trans.objectStore(options.storeName);

    /**
     * Vector Layer...
     */
    if (openGDSMobile.geoJSONStatus.length !== 0) {
        var contentObj = openGDSMobile.geoJSONStatus.getContent(_layerName);
        if (contentObj !== false) {
            objectStore.add(contentObj);
        }
    }
};

openGDSMobile.IndexedDB.prototype.removeData = function (_layerName) {

};

openGDSMobile.IndexedDB.prototype.getData = function (_layerName, successCallback, errorCallback) {
    
};

openGDSMobile.IndexedDB.prototype.deleteObjStore = function (_objStoreName) {

};

openGDSMobile.IndexedDB.prototype.deleteDB = function () {
    window.indexedDB.deleteDatabase('OpenGDSMobileDB');
};