goog.provide('openGDSMobile.util.jsonToArray');
goog.provide('openGDSMobile.util.applyOptions');
goog.provide('openGDSMobile.util.getOlLayer');
goog.require('goog.array');

openGDSMobile.util.jsonToArray = function (obj, x, y) {
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
    xyAxis[1] = [];
    goog.array.forEach(row, function (position, index, arr) {
        xyAxis[0].push(row[index][x]);
        xyAxis[1].push(row[index][y]);
    });
    return xyAxis;
}
openGDSMobile.util.applyOptions = function (defaults, options) {
    var name = null;
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    return defaults;
}

openGDSMobile.util.getOlLayer = function (_olObj, _name) {
    var mapArray = _olObj.getLayers().getArray();
    var result = false;
    goog.array.forEach(mapArray, function (obj, index, arr) {
        if (obj.get('title') === _name) {
            result = obj;
        }
    });
    return result;
}



