YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "OGDSM",
        "OGDSM.attributeTable",
        "OGDSM.eGovFrameUI",
        "OGDSM.externalConnection",
        "OGDSM.mapLayerList",
        "OGDSM.visualization"
    ],
    "modules": [
        "OGDSM.applyOptions",
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
            "displayName": "OGDSM.jsontoArray",
            "name": "OGDSM.jsontoArray",
            "description": "OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)\n- 사용 방법(Use)\n      OGDSM.jsonToArray(jsonData, array[0], array[1]);"
        },
        {
            "displayName": "OGDSM.namespace",
            "name": "OGDSM.namespace",
            "description": "OGDSM 네임스페이스 모듈 (OGDSM 'namespace' module)\n\n- 사용 방법 (Use)\n      OGDSM.namesace('example');\n      OGDSM.example=(function(){\n        //Source Code\n      }());"
        }
    ]
} };
});
