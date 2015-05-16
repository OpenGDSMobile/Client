YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "OGDSM",
        "OGDSM.attributeTable",
        "OGDSM.eGovFramUI",
        "OGDSM.externalConnection",
        "OGDSM.mapLayerList",
        "OGDSM.visualization"
    ],
    "modules": [
        "OGDSM.jsontoArray",
        "OGDSM.namespace",
        "Sortable.create(...)"
    ],
    "allModules": [
        {
            "displayName": "OGDSM.jsontoArray",
            "name": "OGDSM.jsontoArray",
            "description": "OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)\n- 사용 방법(Use)\n      OGDSM.jsonToArray(jsonData, array[0], array[1]);"
        },
        {
            "displayName": "OGDSM.namespace",
            "name": "OGDSM.namespace",
            "description": "OGDSM 네임스페이스 모듈 (OGDSM 'namespace' module)\n\n- 사용 방법 (Use)\n      OGDSM.namesace('example');\n      OGDSM.example=(function(){\n        //Source Code\n      }());"
        },
        {
            "displayName": "Sortable.create(...)",
            "name": "Sortable.create(...)",
            "description": "OGDSM Layer list sorting open source\nSortable\nauthor\tRubaXa   <trash@rubaxa.org>\nlicense MIT"
        }
    ]
} };
});
