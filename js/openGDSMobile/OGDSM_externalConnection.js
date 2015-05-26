/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true, vars : true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    /**
     * 외부 데이터 접속 요청 객체
     * @class OGDSM.externalConnection
     * @constructor
     */
    OGDSM.externalConnection = function () {

    };
    OGDSM.externalConnection.prototype = {
        constructor : OGDSM.externalConnection
    };
    return OGDSM.externalConnection;
}(OGDSM));

/**
 * GeoServer WFS 데이터 요청 (OpenLayers3 ol.source.GeoJSON)
 * @method geoServerWFSLoad
 * @param {OGDSM Obj} obj - OpenGDS Mobile 시각화 객체
 * @param {String} addr - 주소
 * @param {String} workspace - 워크스페이스
 * @param {String} layerName - 레이어 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{type='polygon', color='rgba(0, 0, 0, 0.0)', callback : function () {}}
  type(String) : 레이어 타입( polygon | point)
  color(String) : 색상 rgba
  callback(Function) : 요청 후 색상 변경시 콜백 함수
 */
OGDSM.externalConnection.prototype.geoServerWFSLoad = function (obj, addr, workspace, layerName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var fullAddr = addr + '/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeNames=' + workspace + ':' + layerName +
        '&outputFormat=json&srsname=' + obj.baseProj;
    var objStyles, name;
    var defaults = {
        type : 'polygon',
        color : 'rgba(0, 0, 0, 0.0)',
        callback : function (wfslayer) {}
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    if (defaults.type === 'polygon') {
        objStyles = [
            new ol.style.Style({
                fill : new ol.style.Fill({
                    color : defaults.color
                }),
                stroke : new ol.style.Stroke({
                    color : 'rgba(0, 0, 0, 1.0)',
                    width : 1
                })
            })];
    } else if (defaults.type === 'point') {
        objStyles = [
            new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({
                        color : defaults.color
                    }),
                    stroke : new ol.style.Stroke({
                        color : 'rgba(0, 0, 0, 1.0)',
                        width : 1
                    })
                })
            })
        ];
    }
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    layerName = layerName.replace(/[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi,'');
    $.ajax({
        type : 'POST',
        url : fullAddr,
        crossDomain: true,
        dataType : 'json',
        success : function (msg) {
            var wfsLayer = new ol.layer.Vector({
                title : layerName,
                source : new ol.source.GeoJSON({
                    object: msg
                }),
                style : objStyles
            });
            obj.addMap(wfsLayer, defaults.type);
            $.mobile.loading('hide');
            defaults.callback(wfsLayer);
        },
        error : function (e) {
            console.log(e);
        }
    });
};
/**
 * GeoServer WFS 요청 (OpenLayers3 ol.source.ServerVector)
 * @method geoServerWFS
 * @param {String} addr - 주소
 * @param {String} ws - 워크스페이스
 * @param {String} layerName - 레이어 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{type='polygon', epsg='epsg3857'}
  type(String) : 레이어 타입( polygon | point)
  epsg(String) : EPSG
 * @return {ol.layer.Vector} vectorSource - OpenLayers3 백터 객체
 */
OGDSM.externalConnection.prototype.geoServerWFS = function (addr, ws, layerName, options) {
    options = (typeof (options) !== 'undefined') ? options : {};
    var vectorSource, styles, resultData, name;

    var defaults = {
        type : 'polygon',
        epsg : 'epsg3857'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}

    vectorSource = new ol.source.ServerVector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
            var fullAddr = addr + '/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature' +
                '&typeNames=' + ws + ':' + layerName +
                '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
                '&srsname=' + defaults.epsg + '&bbox=' + extent.join(',') + ',' + defaults.epsg;
            $.ajax({
                url : fullAddr,
                dataType: 'jsonp'
            });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
            maxZoom: 19
        })),
        projection: 'EPSG:3857'
    });
    if (defaults.type === 'polygon') {
        styles = [
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#ff0000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            })
        ];
    } else if (defaults.type === 'point') {
        styles = [
            new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({color : '#ff0000'}),
                    stroke : new ol.style.Stroke({color : '#ff0000', width : 1})
                })
            })
        ];
    }
    loadFeatures = function (response) {
        vectorSource.addFeatures(vectorSource.readFeatures(response));
    };
    resultData = new ol.layer.Vector({
        title : layerName,
        source : vectorSource,
        style: styles
    });
    return resultData;
};
/**
 * VWorld WMS 데이터 요청
 * @method vworldWMSLoad
 * @param {String} apiKey - api 키
 * @param {String} domain - 도메인
 * @param {String} data - WMS 레이어 이름
 * @return {ol.layer.Tile} OpenLayers 타일 객체
 */
OGDSM.externalConnection.prototype.vworldWMSLoad = function (apiKey, domain, data) {
    'use strict';
    data = data.join(',');
    var resultData = new ol.layer.Tile({
        title : 'VWorldWMS',
        source : new ol.source.TileWMS(({
            url : 'http://map.vworld.kr/js/wms.do',
            params : {
                apiKey : apiKey,
                domain : domain,
                LAYERS : data,
                STYLES : data,
                FORMAT : 'image/png',
                CRS : 'EPSG:900913',
                EXCEPTIONS : 'text/xml',
                TRANSPARENT : true
            }
        }))
    });
    return resultData;
};

/**
 * 서울 열린 데이터 광장 환경 데이터 요청
 * @method seoulEnvironmentLoad
 * @param {String} addr - 주소
 * @param {String} apiKey - api 키
 * @param {String} envType - 환경 정보 이름
 * @param {date} date - 날짜
 * @param {time} time - 시간
 * @param {function} callback - 성공 콜백 함수
 */
OGDSM.externalConnection.prototype.seoulEnvironmentLoad = function (addr, apiKey, envType, date, time, callback) {
    'use strict';
    var parm = '{"serviceName":"TimeAverageAirQuality",' +
        '"keyValue":"' + apiKey + '",' +
        '"dateValue":"' + date + '", ' +
        '"envType":' + '"' + envType + '",' +
        '"timeValue":"' + time + '"} ';
    var resultData;
    parm = JSON.parse(parm);
    console.log(parm);
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    $.ajax({
        type : 'POST',
        url : addr,
        data : JSON.stringify(parm),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            resultData = JSON.parse(msg.data);
            $.mobile.loading('hide');
            callback(resultData);
        },
        error : function (e) {
            console.log(e);
            $.mobile.loading('hide');
        }
    });
};


/**
 * 데이터 포털 환경 데이터 요청
 * @method seoulEnvironmentLoad
 * @param {String} addr - 주소
 * @param {String} apiKey - api 키
 * @param {String} envType - 환경 정보 이름
 * @param {date} date - 날짜
 * @param {time} time - 시간
 * @param {function} callback - 성공 콜백 함수
 */
OGDSM.externalConnection.prototype.dataPortalEnvironmentLoad = function (addr, apiKey, envType, area, callback) {
    'use strict';
    var parm = '{"serviceName":"ArpltnInforInqireSvc",' +
            ' "keyValue":"' + apiKey + '",' +
            '"areaType":' + '"' + encodeURIComponent(area) + '",' +
            '"envType":' + '"' + envType + '"}';
    var resultData;
    parm = JSON.parse(parm);
    console.log(parm);
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    $.ajax({
        type : 'POST',
        url : addr,
        data : JSON.stringify(parm),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            resultData = JSON.parse(msg.data);
            $.mobile.loading('hide');
            callback(resultData);
        },
        error : function (e) {
            console.log(e);
            $.mobile.loading('hide');
        }
    });
};
