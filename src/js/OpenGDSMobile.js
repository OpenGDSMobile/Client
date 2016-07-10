goog.provide('openGDSMobile');
goog.provide('openGDSMobile.listStatus');
goog.provide('openGDSMobile.attrListStatus');



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
 */
openGDSMobile.attrListStatus = ({
   length : 0,
    objs : [],
    getObjs : function () {
        return this.objs;
    },
    setObj : function (index, obj) {
        this.objs[index] = obj;
    },
    searchContent : function (_layerName, _attrKey, _content) {
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
    changeContent : function (_layerName, _attrKey, _content, _changeValue) {
        var resultObj = this.searchContent(_layerName, _attrKey, _content);
        resultObj.obj[_attrKey] = _changeValue;
        this.objs[resultObj.i].attr[resultObj.j].setProperties(resultObj.obj);
    }
});


goog.exportSymbol('openGDSMobile', openGDSMobile);
goog.exportSymbol('openGDSMobile.listStatus', openGDSMobile.listStatus);
goog.exportSymbol('openGDSMobile.attrListStatus', openGDSMobile.attrListStatus);


