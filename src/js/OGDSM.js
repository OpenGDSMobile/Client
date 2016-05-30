/*jslint devel: true, vars : true */
/*global $, jQuery, ol*/
/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM
* --
* 객체(Classes)
*  - attributeTable
*  - eGovFrameUI
*  - externalConnection
*  - mapLayerList
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    'use strict';
    /**
    * OGDS Mobile Super Class
    * @class OGDSM
    * @constructor
    */
    OGDSM.prototype = {
        constructor : OGDSM,
        version : '1.2'
    };
    return OGDSM;
}(window, jQuery));

/**
* OGDSM 네임스페이스 모듈 (OGDSM 'namespace' module)
*
* - 사용 방법 (Use)
*       OGDSM.namesace('example');
*       OGDSM.example=(function(){
*         //Source Code
*       }());
* @module OGDSM.namespace
*/
OGDSM.namesapce = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;
    var test;

    if (parent[0] === 'OGDSM') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }
    return parent;
};
/**
 * OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)
 * - 사용 방법(Use)
 *       OGDSM.jsonToArray(jsonData, array[0], array[1]);
 *
 * @module OGDSM.jsontoArray
 */

OGDSM.jsonToArray = function (obj, x, y) {
    'use strict';
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
	xyAxis[1] = [];
    $.each(row, function (idx) {
        xyAxis[0].push(row[idx][x]);
        xyAxis[1].push(row[idx][y]);
    });
    return xyAxis;
};


/**
 * OGDSM options 파라미터 적용 모듈
 * - 사용 방법(Use)
 *       OGDSM.applyOptions(defaults, options);
 *
 * @module OGDSM.applyOptions
 */
OGDSM.applyOptions = function (defaults, options) {
    'use strict';
    var name = null;
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    return defaults;
};
