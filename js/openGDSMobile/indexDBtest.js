/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, mappingDB, IDBTransaction*/
var mappingDB = {};
mappingDB.version = 0;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

mappingDB.onerror = function (e) {
    'use strict';
    console.log("Database error: ", e.target.errorCode);
};
mappingDB.createDatabase = function (dbName, layerName, data, keyColumn) {
    'use strict';
    var req = indexedDB.open(dbName, mappingDB.version);
    console.log(mappingDB.version);
    req.onsuccess = function (e) {
        mappingDB.db = e.target.result;
        console.log('success');
        if (mappingDB.hasToPopulate) {
            mappingDB.addData(dbName, layerName, data, keyColumn);
        } else {
            mappingDB.addData(dbName, layerName, data, keyColumn);
        }
        mappingDB.db.close();
    };
    req.onupgradeneeded = function (e) {
        mappingDB.db = e.target.result;
        console.log('upgrade');
        if (mappingDB.db.objectStoreNames.contains(layerName)) {
            mappingDB.db.deleteObjectStore(layerName);
        }
        mappingDB.db.createObjectStore(layerName);
        mappingDB.hasToPopulate = true;
    };
    req.onerror = mappingDB.onerror;

};

mappingDB.readDB = function (dbName, layerName, callback) {
    'use strict';
    var req = mappingDB.db.transaction(dbName).objectStore(layerName).getAll();
    req.onsuccess = function (e) {
        var result = e.target.result;

        console.log(result);
    };
    req.onerror = mappingDB.onerror;
};

mappingDB.addData = function (dbName, layerName, data, keyColumn) {
    'use strict';
    var req = mappingDB.db.transaction(layerName, 'readwrite').objectStore(layerName);
    var keys = Object.keys(data[0]);
    console.log(req);
    var i = 0, j = 0;
    for (i = 0; i < data.length; i++) {
        req.put(data[i], data[i][keyColumn]);
    }
    req.onsuccess = function (e) {

    };
    req.onerror = mappingDB.onerror;
};
