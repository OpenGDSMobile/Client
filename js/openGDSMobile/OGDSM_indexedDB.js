/*jslint devel: true, vars : true plusplus : true es5 : true */
/*global $, jQuery, OGDSM, mappingDB, IDBTransaction*/



/* Single Object Store */
/**
* OGDSM indexedDB 모듈
*
* - 사용 방법 (Use)
*       OGDSM.indexedDB('dbName'. {options});
* - Options
*   옵션 JSON 객체 키 값<br>
{type:'new', storeName:dbName, insertKey:null, insertData:null,
searchKey: null, searchData: null, editData: null, deleteKey: null, success: false, dbFile : false}<br>
<p style="font-weight:bold;">
type (String) : 모듈 실행 타입 설정 (필요 파라미터)
</p>
<p style="padding-left:2em; background-color:#FFFFFF;">new : DB 생성/ 데이터 삽입 (dbName, storeName, insertData, insertKey)<br>
    insert / forceInsert: 데이터 삽입 / 데이터 강제 삽입 (dbName, storeName, insertData, insertKey)<br>
    searchAll / removeAll : 모든 데이터 검색 / 삭제 (dbName, storeName)<br>
    search: DB 데이터 검색 (dbName, storeName, searchKey, searchData)<br>
    remove: DB 데이터 삭제 (dbName, storeName, deleteKey)<br>
    edit: DB 데이터 수정 (dbName, storeName, searchKey, searchData, editData)<br>
    deleteDB: DB 삭제 (dbName)
</p>
<p style="font-weight:bold;">
storeName (String) : 스토어<br>
insertKey (String) : 삽입 대상 키<br>
insertData (String) : 삽입 데이터<br>
searchKey (String) : 검색 대상 키<br>
searchData (String) : 검색할 데이터<br>
editData (String) : 수정할 데이터<br>
deleteKey (String) : 삭제할 키 데이터<br>
success (function) : 성공 콜백 함수 (데이터 검색일 경우 데이터 파라미터로 보내짐)<br>
dbFail (function) : 실패 콜백 함수<br>
</p>
* @module OGDSM.indexedDB
**/
OGDSM.indexedDB = function (dbName, options) { //dbName_ StoreName, storeName, success, fail
    'use strict';
    var dbObject = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var iDB = {};
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        type : 'new',
        storeName : dbName,
        insertKey : null,
        insertData : null,
        searchKey : null,
        searchData : null,
        editData : null,
        deleteKey : null,
        success : false,
        fail : false
    };
    defaults = OGDSM.applyOptions(defaults, options);
    if (typeof (Storage) !== 'undefined') {
        if (localStorage.openGDSMobileDBVersion) {
            //localStorage.openGDSMobileDBVersion = Number(localStorage.openGDSMobileDBVersion) + 1;
            localStorage.openGDSMobileDBVersion = localStorage.openGDSMobileDBVersion = 1;
        } else {
            localStorage.openGDSMobileDBVersion = localStorage.openGDSMobileDBVersion = 1;
        }
    }
    function insertData(dbName, storeName, data, keyColumn) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
            var request = trans.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                var chkKey = false;
                if (cursor) {
                    var field;
                    if (cursor.key === keyColumn) {
                        chkKey = true;
                    } else {
                        cursor.continue();
                    }
                }
                if (chkKey === false) {
                    trans.put(data, keyColumn);
                    trans.onsuccess = function (e) {
                        if (defaults.success) {
                            defaults.success(data);
                        } else {
                            console.log('Success Insert Data. Please call the second parameter of the callback function');
                        }
                        iDB.db.close();
                    };
                } else {
                    console.log('Fail Insert Data.');
                }
            };
        };
        req.onerror = function (e) {
            console.log(e);
            console.log("Database error: ", e.target.error);
        };
    }
    function updateData(dbName, storeName, data, keyColumn) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
            trans.put(data, keyColumn);
            trans.onsuccess = function (e) {
                if (defaults.success) {
                    defaults.success(data);
                } else {
                    console.log('Success Update Data. Please call the second parameter of the callback function');
                }
                iDB.db.close();
            };
        };
        req.onerror = function (e) {
            console.log(e);
            console.log("Database error: ", e.target.error);
        };
    }
    function search(type, dbName, storeName, searchKey, searchData, editData) {
        searchKey = (typeof (searchKey) !== 'undefined') ? searchKey : null;
        searchData = (typeof (searchData) !== 'undefined') ? searchData : null;
        editData = (typeof (editData) !== 'undefined') ? editData : null;
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        console.log(req);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            if (iDB.db.objectStoreNames.length === 0) {
                console.log('Not Object Store');
                return -1;
            }
            var trans = iDB.db.transaction(storeName, 'readonly');
            var resultAll = [];
            var result = null;
            trans.oncomplete = function (evt) {
                var searchResult = null;
                var srcResult = null, dstResult = null;
                if (type === 'searchAll') {
                    if (defaults.success) {
                        if (resultAll.length !== 0) {
                            defaults.success(resultAll);
                        } else {
                            console.error('Not data');
                            defaults.fail(resultAll);
                        }
                    } else {
                        console.log('Success search Data. Please call the second parameter of the callback function');
                    }
                } else if (type === 'search' || type === 'edit') {
                    if (result !== null) {
                        if (searchData === null) {
                            console.log('OGDSM log : Not input search data. So search result based On Key');
                            defaults.success(result);
                            return -1;
                        }
                        var value;
                        if (Object.prototype.toString.call(result) === '[object Array]') {
                            var keys = Object.keys(result[0]);
                            var searchkeys = Object.keys(searchData);
                            var i, key;
                            srcResult = JSON.parse(JSON.stringify(result));
                            dstResult = JSON.parse(JSON.stringify(result));
                            for (value in result) {
                                if (result.hasOwnProperty(value)) {
                                    if (result[value][searchkeys[0]] === searchData[searchkeys[0]]) {
                                        searchResult = result[value];
                                        if (type === 'edit') {
                                            dstResult[value][searchkeys[0]] = editData;
                                            updateData(dbName, storeName, dstResult, searchKey);
                                        }
                                        break;
                                    }
                                }
                            }
                            if (defaults.success) {
                                if (searchResult !== null) {
                                    if (type === 'edit') {
                                        defaults.success(srcResult, dstResult);
                                    } else {
                                        defaults.success(result, srcResult);
                                    }
                                } else {
                                    console.error('OGDSM Error : Not data');
                                }
                            } else {
                                console.log('Success search Data. Please call the second parameter of the callback function');
                            }
                        } else if (Object.prototype.toString.call(result) === '[object Object]') {
                            console.log(result);
                            console.log('object object');
                        }
                    } else {
                        console.error('OGDSM Error : Not data key');
                    }
                }
            };
            var request = trans.objectStore(storeName).openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var field;
                    var obj = {};
                    obj.key = cursor.key;
                    obj.value = cursor.value;
                    resultAll.push(obj);
                    if (cursor.key === searchKey) {
                        result = cursor.value;
                    } else {
                        cursor.continue();
                    }
                }
            };
        };
        req.onupgradeneeded = function (event) {
            iDB.db = event.target.result;
            console.log("new DB in search");
            if (storeName !== null) {
                if (iDB.db.objectStoreNames.contains(storeName)) {
                    console.log('Exist Store Name.');
                    //iDB.db.deleteObjectStore(storeName);

                } else {
                    iDB.db.createObjectStore(storeName);
                }
            }
        };
    }
    function edit(dbName, storeName, srcKey, srcData, dstData) {
        search('edit', dbName, storeName, srcKey, srcData, dstData);
    }
    function openDBInsertData(dbName, storeName, data, key) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;

            if (data !== null) {
                insertData(dbName, storeName, data, key);
            } else {
                if (defaults.success) {
                    defaults.success(iDB.db);
                } else {
                    console.log('Success Open / Create Indexed. Please call the second parameter of the callback function');
                }
            }
            iDB.db.close();
        };
        req.onupgradeneeded = function (event) {
            iDB.db = event.target.result;
            console.log("new DB in openDB");
            if (storeName !== null) {
                if (iDB.db.objectStoreNames.contains(storeName)) {
                    console.log('Exist Store Name.');
                  //  iDB.db.deleteObjectStore(storeName);
                } else {
                    iDB.db.createObjectStore(storeName);
                }
            }
        };
        req.onerror = function (e) {
            console.log("Database error: ", e.target.error);
        };
    }
    function removeData(dbName, storeName, key) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite');
            trans.objectStore(storeName).delete(key);
        };
    }
    function clearObjectStore(dbName, storeName) {
        var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
        req.onsuccess = function (event) {
            iDB.db = event.target.result;
            var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
            trans.clear();
        };
    }
    if (defaults.type === 'new') {
        openDBInsertData(dbName, defaults.storeName, defaults.insertData, defaults.insertKey);
    } else if (defaults.type === 'insert') {
        insertData(dbName, defaults.storeName, defaults.insertData, defaults.insertKey);
    } else if (defaults.type === 'forceInsert') {
        updateData(dbName, defaults.storeName, defaults.insertData, defaults.insertKey);
    } else if (defaults.type === 'remove') {
        removeData(dbName, defaults.storeName, defaults.deleteKey);
        return -1;
    } else if (defaults.type === 'removeAll') {
        clearObjectStore(dbName, defaults.storeName);
        return -1;
    } else if (defaults.type === 'search') {
        search(defaults.type, dbName, defaults.storeName, defaults.searchKey, defaults.searchData);
    } else if (defaults.type === 'searchAll') {
        search(defaults.type, dbName, defaults.storeName);
    } else if (defaults.type === 'edit') {
        search(defaults.type, dbName, defaults.storeName, defaults.searchKey, defaults.searchData, defaults.editData);
    } else if (defaults.type === 'deleteDB') {
        dbObject.deleteDatabase(dbName);
    }
    return this;
};





/*
Multiplue Object Store.. But....  iOS bug..
https://gist.github.com/nolanlawson/08eb857c6b17a30c1b26
*/
/*
OGDSM.indexedDB = function (dbName, options) { //dbName, storeName, success, fail
    'use strict';
    var dbObject = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var iDB = {};
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        type : 'create',
        storeName : null,
        dataKey : null,
        insertData : null,
        searchValue : null,
        dbSuccess : false,
        dbFail : false
    };
    defaults = OGDSM.applyOptions(defaults, options);
    if (defaults.dataKey === null) {
        var keys = Object.keys(defaults.insertData[0]);
        defaults.dataKey = keys[0];
    }
    if (typeof (Storage) !== 'undefined') {
        if (localStorage.openGDSMobileDBVersion) {
            localStorage.openGDSMobileDBVersion = Number(localStorage.openGDSMobileDBVersion) + 1;
        } else {
            localStorage.openGDSMobileDBVersion = localStorage.openGDSMobileDBVersion = 1;
        }
    }
    if (defaults.type === 'searchAll') {
        //OGDSM.indexedDB.search(dbName, defaults.storeName, defaults.dataKey, defaults.searchValue);
        OGDSM.indexedDB.searchAll(dbName, defaults.storeName);
        return -1;
    }
    var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
    req.onsuccess = function (event) {
        iDB.db = event.target.result;
        OGDSM.indexedDB.addData(dbName, defaults.storeName, defaults.insertData, defaults.dataKey);
        if (defaults.dbSuccess) {
            defaults.dbSuccess(iDB.db);
        } else {
            console.log('Success Open / Create Indexed. Please call the second parameter of the callback function');
        }
        iDB.db.close();
    };
    req.onupgradeneeded = function (event) {
        iDB.db = event.target.result;
        if (defaults.storeName !== null) {
            if (iDB.db.objectStoreNames.contains(defaults.storeName)) {
                console.log('Exist Store Name. Therefore New Create After Remove');
                iDB.db.deleteObjectStore(defaults.storeName);
            }
            iDB.db.createObjectStore(defaults.storeName);
        }
    };
    req.onerror = function (e) {
        console.log("Database error: ", e.target.error);
    };
};
OGDSM.indexedDB.createStore = function (dbName, storeName, success) {
    'use strict';
    var iDB = {};
    var newdbVersion = Number(localStorage.openGDSMobileDBVersion) + 1;
    var req = this.dbObject.open(this.dbName, newdbVersion);
    req.onupgradeneeded = function (event) {
        iDB.db = event.target.result;
        if (iDB.db.objectStoreNames.contains(storeName)) {
            console.log('Exist Store Name. Therefore New Create After Remove');
            iDB.db.deleteObjectStore(storeName);
        }
        iDB.db.createObjectStore(storeName);
        localStorage.openGDSMobileDBVersion = Number(localStorage.openGDSMobileDBVersion) + 1;
    };
    req.onsuccess = function (event) {
        iDB.db = event.target.result;
        if (success) {
            success(iDB.db);
        }
        iDB.db.close();
    };
};
OGDSM.indexedDB.addData = function (dbName, storeName, data, keyColumn) {
    'use strict';
    var iDB = {};
    var dbObject = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var req = dbObject.open(dbName, localStorage.openGDSMobileDBVersion);
    req.onsuccess = function (event) {
        iDB.db = event.target.result;
        var trans = iDB.db.transaction(storeName, 'readwrite').objectStore(storeName);
        var i = 0, j = 0;
        for (i = 0; i < data.length; i++) {
            trans.put(data[i], data[i][keyColumn]);
        }
        trans.onsuccess = function (e) {
            iDB.db.close();
        };
        iDB.db.close();
    };
    req.onerror = function (e) {
        console.log(e);
        console.log("Database error: ", e.target.error);
    };
};
*/
