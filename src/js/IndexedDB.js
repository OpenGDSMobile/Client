goog.provide('openGDSMobile.IndexedDB');

goog.require('openGDSMobile.util.applyOptions');


openGDSMobile.IndexedDB.db = null;

openGDSMobile.IndexedDB = function (_options) {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        dbName : 'OpenGDSMobileDB',
        storeName : 'vectorStore',
        keyPath : 'id',
        version : 1.0
    };
    this.options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    var options = this.options;

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
        var objectStore = openGDSMobile.IndexedDB.db.createObjectStore(options.storeName, {keyPath : options.keyPath});
        objectStore.createIndex(options.keyPath, options.keyPath, {unique: true});
        console.log('upgraded');
    };
    openGDSMobile.IndexedDBSW = true;
};

openGDSMobile.IndexedDB.prototype.setStoreName = function (_name) {
    this.options.storeName = _name;
};
openGDSMobile.IndexedDB.prototype.getStoreName = function (_name) {
    return this.options.storeName;
};
openGDSMobile.IndexedDB.prototype.setKeyPath = function (_key) {
    this.options.keyPath = _key;
};
openGDSMobile.IndexedDB.prototype.getKeyPath = function (){
    return this.options.keyPath;
};


openGDSMobile.IndexedDB.prototype.addData = function (_key, _onsuccess, _onerror) {
    _onsuccess = (typeof (_onsuccess) !== 'undefined') ? _onsuccess : null;
    _onerror = (typeof (_onerror) !== 'undefined') ? _onerror : null;
    var options = this.options;

    var trans = openGDSMobile.IndexedDB.db.transaction([options.storeName], 'readwrite');
    var objectStore = trans.objectStore(options.storeName);
    var searchResult = objectStore.get(_key);

    searchResult.onsuccess = function (evt) {
        if (typeof (evt.target.result) === 'undefined' ) {
            console.log('Not Exist record');
        } else {
            console.log('Exist record');
        }
        /**
         * Vector Layer...
         */
        if (options.storeName === 'vectorStore') {
            if (openGDSMobile.geoJSONStatus.length !== 0) {
                var contentObj = openGDSMobile.geoJSONStatus.getContentId(_key);
                if (contentObj !== false) {
                    objectStore.put(contentObj);
                    console.log('Add Complate vectorStore');
                }
            }
        }
        /**
         * Other data...
         */
        else {
            objectStore.put(contentObj);
            console.log('Add Complate ' + options.storeName);
        }

        if (_onsuccess !== null){
            return _onsuccess(evt);
        }
    };
    searchResult.onerror = function (evt) {
        console.error("IndexedDB objectstore data get fail");
        if (onerror !== null) {
            return _onerror(evt);
        }
    };
};

openGDSMobile.IndexedDB.prototype.removeData = function (_key, _onsuccess, _onerror) {
    _onsuccess = (typeof (_onsuccess) !== 'undefined') ? _onsuccess : null;
    _onerror = (typeof (_onerror) !== 'undefined') ? _onerror : null;

    var options = this.options;

    var trans = openGDSMobile.IndexedDB.db.transaction([options.storeName], 'readwrite');
    var objectStore = trans.objectStore(options.storeName);
    var deleteResult = objectStore.delete(_key);
    deleteResult.onsuccess = function (evt) {
        console.log(_layerName + ' record delete complete.');
        if (_onsuccess !== null) {
            return _onsuccess(evt);
        }
    };
    deleteResult.onerror = function (evt) {
        console.error(_layerName + ' record not delete complete.');
        if (_onerror !== null) {
            return _onerror(evt);
        }
    };
};

openGDSMobile.IndexedDB.prototype.clearData = function (_onsuccess, _onerror) {
    _onsuccess = (typeof (_onsuccess) !== 'undefined') ? _onsuccess : null;
    _onerror = (typeof (_onerror) !== 'undefined') ? _onerror : null;

    var options = this.options;
    var trans = openGDSMobile.IndexedDB.db.transaction([options.storeName], 'readwrite');
    var objectStore = trans.objectStore(options.storeName);
    var clearResult = objectStore.clear();

    clearResult.onsuccess = function (evt) {
        console.log(options.storeName + ' object store all records delete complete.');
        if (_onsuccess !== null) {
            return _onsuccess(evt);
        }
    };
    clearResult.onerror = function (evt) {
        console.error(options.storeName + ' object store all records not delete complete.');
        if (_onerror !== null) {
            return _onerror(evt);
        }
    };
};

openGDSMobile.IndexedDB.prototype.getData = function (_key, _onsuccess, _onerror) {
    _onsuccess = (typeof (_onsuccess) !== 'undefined') ? _onsuccess : null;
    _onerror = (typeof (_onerror) !== 'undefined') ? _onerror : null;

    var options = this.options;
    console.log(openGDSMobile.IndexedDB.db);
    var trans = openGDSMobile.IndexedDB.db.transaction([options.storeName], 'readwrite');
    var objectStore = trans.objectStore(options.storeName);
    var searchResult = objectStore.get(_key);

    searchResult.onsuccess = function (evt) {
        if (typeof (evt.target.result) !== 'undefined' ) {
            if (_onsuccess !== null) {
                return _onsuccess(evt.target.result);
            } else {
                console.error('Please callback function call');
                console.error('ex: getData("key", function(successData) { ... }, function (error) { ... });');
            }

        } else {
            console.log('Not Exist record');
            return _onsuccess(null);
        }
    };
    searchResult.onerror = function (evt) {
        console.error("IndexedDB objectstore data get fail");
        if (onerror !== null) {
            return _onerror(evt);
        }
    };
};

openGDSMobile.IndexedDB.prototype.deleteObjStore = function (_objStoreName) {

};

openGDSMobile.IndexedDB.prototype.deleteDB = function () {
    window.indexedDB.deleteDatabase('OpenGDSMobileDB');
};