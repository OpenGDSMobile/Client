goog.provide('openGDSMobile');
goog.provide('openGDSMobile.listStatus');
goog.provide('openGDSMobile.attrListStatus');



openGDSMobile.IndexedDBSW = false;

/**
 *
 * @type {{length: number, objs: Array}}
 * [{attrKey: String, type: String, layerName : string, obj : GeoJSON}]
 */
openGDSMobile.geoJSONStatus = {
    length : 0,
    objs : [],
    getContent : function (_layerName) {
        for (var i = 0; i < this.length; i++) {
            if (this.objs[i].layerName == _layerName) {
                return this.objs[i];
            }
        }
        return false;
    }
}

/**
 * 리스트 현황 JSON 객체
 * @type {{length: number, objs: [{title: string, obj : object}, ...]}
     */
openGDSMobile.listStatus = {
    length : 0,
    objs : []
};


/**
 *
 * @type {{length: number, objs: Array}}
 * [{layerName : string, obj : Object, attr: Object }]
 */
openGDSMobile.attrListStatus = {
   length : 0,
    objs : [],
    getObjs : function () {
        return this.objs;
    },
    setObj : function (index, obj) {
        this.objs[index] = obj;
    },
    searchAttrContent : function (_layerName, _attrKey, _content) {
        for (var i = 0; i < this.length; i++) {
            if (this.objs[i].layerName == _layerName) {
                for (var j = 0; j < this.objs[i].attr.length; j++) {
                    if (this.objs[i].attr[j].getProperties()[_attrKey] == _content) {
                        return {
                            obj: this.objs[i].attr[j],
                            i : i,
                            j : j
                        }
                    }
                }
            }
        }
        return false;
    },
    changeAttrContent : function (_layerName, _attrKey, _content, _changeValue) {
        var resultObj = this.searchAttrContent(_layerName, _attrKey, _content);
        resultObj.obj[_attrKey] = _changeValue;
        this.objs[resultObj.i].attr[resultObj.j].setProperties(resultObj.obj);
    },
    getContent : function (_layerName) {
        for (var i = 0; i < this.length; i++) {
            if (this.objs[i].layerName == _layerName) {
                return this.objs[i];
            }
        }
        return false;
    }
};


goog.exportSymbol('openGDSMobile', openGDSMobile);
goog.exportSymbol('openGDSMobile.listStatus', openGDSMobile.listStatus);
goog.exportSymbol('openGDSMobile.attrListStatus', openGDSMobile.attrListStatus);


