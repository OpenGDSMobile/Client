goog.provide('openGDSMobile');
goog.provide('openGDSMobile.listStatus');
goog.provide('openGDSMobile.attrListStatus');




/**
 * @type {boolean} IndexedDB 사용 상태. 기본값: 'false'.
 */
openGDSMobile.IndexedDBSW = false;

/**
 * @type {boolean} WebSocket 사용 상태. 기본값: 'false'.
 */
openGDSMobile.WebSocketSW = false;


/**
 * @type {{length: number, objs: Array}} 지도 객체 관리 JSON 객체
 * Array <br>
 *   [
 *      {
 *      layerName : String,
 *      attrKey: String,
 *      type: String,
 *      id : string,
 *      obj : GeoJSON
 *      },
 *      ...
 *   ]
 */
openGDSMobile.geoJSONStatus = {
    length : 0,
    objs : [],
    getContentLayerName : function (_layerName) {
        for (var i = 0; i < this.length; i++) {
            if (this.objs[i].layerName == _layerName) {
                return this.objs[i];
            }
        }
        return false;
    },
    getContentId : function (_id) {
        for (var i = 0; i < this.length; i++) {
            if (this.objs[i].id == _id) {
                return this.objs[i];
            }
        }
        return false;
    },
    removeContentLayerName : function (_layerName) {
        for (var i = 0; i < this.length; i++) {
            if (this.objs[i].layerName == _layerName) {
                this.objs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}

/**
 * @type {{length: number, objs: Array}} 지도 관리 리스트 현황 JSON 객체
 * Array <br>
 *  [
 *      {
 *      title: string,
 *      obj : ol.Vector Object
 *      },
 *      ...
 *  ]
 */
openGDSMobile.listStatus = {
    length : 0,
    objs : [],
    removeContentLayerName : function (_layerName) {
      for (var i = 0; i < this.length; i++) {
        if (this.objs[i].title == _layerName) {
          this.objs.splice(i, 1);
          this.length--;
          return true;
        }
      }
      return false;
    }
};

/**
 * @type {{length: number, objs: Array}} 속성 목록 현황 JSON 객체
 * {length : number, objs : Array }]
 * Array <br>
 *  [
 *      {
 *      layerName: String,
 *      obj : ol.layer.Vector(),
 *      attr : ol.Features()
 *      },
 *      ...
 *  ]
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


