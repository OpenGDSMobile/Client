goog.provide('openGDSMobile.IndexedDB');


openGDSMobile.IndexedDB = function () {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    //_number = (typeof (_version) !== 'undefined') ? _number : 1.0;

    if (!window.indexedDB) {
        window.alert('Your borwser does not support a stable version of IndexedDB.');
        this.avabile = false;
        return -1;
    }
    this.avabile = true;
    this.num = 0;
    /*
    this.request = window.indexedDB.open('OpenGDSMobileDB', _version ,
    );
    this.db = null;

    this.request.onsuccess = function (evt) {
        this.db = evt.target.result;
        console.log('success');
    };
    this.request.onerror = function (error) {
        console.error(error);
    };

    this.request.onupgradeneeded = function (evt) {
        this.db = evt.target.result;
        console.log('upgraded');
    }
    */
};

openGDSMobile.IndexedDB.prototype.createDatabaseObject = function (_objString, obj) {
    this.request = window.indexedDB.open('OpenGDSMobileDB', ++this.num);
    this.db = null;
    this.request.onsuccess = function (evt) {
        this.db = evt.target.result;
    };
    this.request.onerror = function (error) {
        console.error(error);
    };

    this.request.onupgradeneeded = function (evt) {
        this.db = evt.target.result;
        var objectStore = this.db.createObjectStore(_objString, {keyPath : 'id'});
        //objectStore.add(obj);
    }
};

openGDSMobile.IndexedDB.prototype.addData = function (_objString, obj) {
    var transaction = this.db.transaction([_objString], 'readwrite');
    var objectStore = transaction.objectStore(_objString);
    objectStore.put({
        key : 'eee',
        value : 'wwwww'
    })
}

openGDSMobile.IndexedDB.prototype.deleteDB = function () {
    window.indexedDB.deleteDatabase('OpenGDSMobileDB');
}