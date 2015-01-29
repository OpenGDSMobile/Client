YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "OGDSM",
        "OGDSM.eGovFramUI",
        "OGDSM.externalConnection",
        "OGDSM.visualization"
    ],
    "modules": [
        "OGDSM.jsontoArray",
        "OGDSM.namespace"
    ],
    "allModules": [
        {
            "displayName": "OGDSM.jsontoArray",
            "name": "OGDSM.jsontoArray",
            "description": "OGDSM json to Array module \n- Use\n      OGDSM.jsonToArray(jsonData, array[0], array[1]);"
        },
        {
            "displayName": "OGDSM.namespace",
            "name": "OGDSM.namespace",
            "description": "OGDSM 'namespace' module(Create New Object)\n\n- Use\n      OGDSM.namesace('example');\n- Developer\n      OGDSM.example=(function(){\n        //Source Code\n      }());"
        }
    ]
} };
});