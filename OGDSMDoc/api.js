YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "OGDSM",
        "OGDSM.attributeTable",
        "OGDSM.chartVisualization",
        "OGDSM.eGovFrameUI",
        "OGDSM.externalConnection",
        "OGDSM.mapLayerList",
        "OGDSM.visualization"
    ],
    "modules": [
        "OGDSM.applyOptions",
        "OGDSM.indexedDB",
        "OGDSM.jsontoArray",
        "OGDSM.namespace"
    ],
    "allModules": [
        {
            "displayName": "OGDSM.applyOptions",
            "name": "OGDSM.applyOptions",
            "description": "OGDSM options 파라미터 적용 모듈\n- 사용 방법(Use)\n      OGDSM.applyOptions(defaults, options);"
        },
        {
            "displayName": "OGDSM.indexedDB",
            "name": "OGDSM.indexedDB",
            "description": "OGDSM indexedDB 모듈\n\n- 사용 방법 (Use)\n      OGDSM.indexedDB('dbName'. {options});\n- Options\n  옵션 JSON 객체 키 값<br>\n   {type:'new', storeName:dbName, insertKey:null, insertData:null,\n    searchKey: null, searchData: numm, editData: numm, success: false, dbFile : false}<br>\n   type (String) : 모듈 실행 타입 설정<br>\n    > new : DB 생성/ 데이터 삽입 (dbName, storeName, insertData, insertKey)<br> \n    > insert: 데이터 삽입 (dbName, storeName, insertData, insertKey)<br>\n    > forceInsert: 데이터 강제 삽입 (dbName, storeName, insertData, insertKey)<br>\n    > remove: DB 데이터 삭제 ( --- )<br>\n    > removeAll: DB 데이터 모두 삭제 ( --- )<br>\n    > search: DB 데이터 검색 (dbName, storeName, searchKey, searchData)<br>\n    > searchAll: DB 데이터 모두 검색 (dbName, storeName)<br>\n    > edit: DB 데이터 수정 (dbName, storeName, searchKey, searchData, editData)<br>\n    > deleteDB: DB 삭제 (dbName)<br>\n   storeName (String) : 스토어<br>\n   insertKey (String) : 삽입 대상 키<br>\n   insertData (String) : 삽입 데이터<br>\n   searchKey (String) : 검색 대상 키<br>\n   searchData (String) : 검색할 데이터<br>\n   editData (String) : 수정할 데이터<br>\n   success (function) : 성공 콜백 함수 (데이터 검색일 경우 데이터 파라미터로 보내짐)<br>\n   dbFail (function) : 실패 콜백 함수<br>"
        },
        {
            "displayName": "OGDSM.jsontoArray",
            "name": "OGDSM.jsontoArray",
            "description": "OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)\n- 사용 방법(Use)\n      OGDSM.jsonToArray(jsonData, x string, y string);"
        },
        {
            "displayName": "OGDSM.namespace",
            "name": "OGDSM.namespace",
            "description": "OGDSM 네임스페이스 모듈 (OGDSM 'namespace' module)\n\n- 사용 방법 (Use)\n      OGDSM.namesace('example');\n      OGDSM.example=(function(){\n        //Source Code\n      }());"
        }
    ]
} };
});
