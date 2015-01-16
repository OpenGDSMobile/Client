/*jslint devel: true */
/*global $, jQuery, ol*/

/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM Super Class.<br>
* --
* Classes
*  - eGovFrameUI
*  - externalConnection
*  - olMap
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    "use strict";
    OGDSM.prototype = {
        constructor : OGDSM,
        version : "1.0"
    };
    return OGDSM;
}(window, jQuery));

/**
* OGDSM 'namespace' module(Create New Object)
*
* - Use
*       OGDSM.namesace('example');
* - Developer
*
*       OGDSM.example=(function(){
*         //Source Code
*       }());
*
* @module OGDSM.namespace
*/
OGDSM.namesapce = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;

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
 * OGDSM json to Array module 
 * @module OGDSM.jsontoArray
 *
 *
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
