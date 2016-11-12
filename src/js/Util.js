goog.provide('openGDSMobile.util.jsonToArray');
goog.provide('openGDSMobile.util.applyOptions');
goog.provide('openGDSMobile.util.getOlLayer');
goog.require('goog.array');

/**
 * JSON 데이터 2차원 배열 변환
 * @param obj
 * @param x
 * @param y
 * @returns {Array}
 */
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

/**
 * 메서드 옵션 적용
 * @param defaults
 * @param options
 * @returns {*}
 */
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

/**
 * 오픈레이어 레이어 객체 받
 * @param _olObj
 * @param _name
 * @returns {boolean}
 */
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

/**
 * 서울 지도 정보 (업데이트날짜: 2016. 11. 12.)
 * @type {{header: {code: number, serviceName: string, format: string}, tileMapInfos: {tileMapInfo: *[]}}}
 */
openGDSMobile.util.seoulMapInfo = {
  "header": {"code": 100,"serviceName": "TileMapInfos","format": "JSON"},
  "tileMapInfos": {
    "tileMapInfo": [
      {
        "name": "oldmap1",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=oldmap1/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "oldmap2",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=oldmap2/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "kor_web_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=kor_web_normal/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "kor_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=kor_normal/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "eng_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=eng_normal/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "jan_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=jan_normal/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "chinag_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=chinag_normal/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "chinab_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=chinab_normal/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "kor_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=kor_air/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "eng_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=eng_air/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "jan_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=jan_air/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "chinag_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=chinag_air/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "chinab_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=chinab_air/",
        "mbr": {
          "minx": 155467,
          "miny": 418809,
          "maxx": 241430,
          "maxy": 477468
        },
        "imageSize": 256,
        "originX": 95646.1421300001,
        "originY": 354131.618785,
        "levelInfos": [
          {
            "levelId": 10,
            "scale": 0.264583862501058
          },
          {
            "levelId": 9,
            "scale": 0.661459656252646
          },
          {
            "levelId": 8,
            "scale": 1.32291931250529
          },
          {
            "levelId": 7,
            "scale": 2.64583862501058
          },
          {
            "levelId": 6,
            "scale": 3.96875793751588
          },
          {
            "levelId": 5,
            "scale": 7.93751587503175
          },
          {
            "levelId": 4,
            "scale": 13.2291931250529
          },
          {
            "levelId": 3,
            "scale": 26.4583862501058
          },
          {
            "levelId": 2,
            "scale": 39.6875793751588
          },
          {
            "levelId": 1,
            "scale": 79.3751587503175
          },
          {
            "levelId": 0,
            "scale": 198.437896875794
          }
        ]
      },
      {
        "name": "emap_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_air/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_normal/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_kor_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_kor_normal/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_eng_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_eng_normal/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_jan_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_jan_normal/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_chinag_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_chinag_normal/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_chinab_normal",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_chinab_normal/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_kor_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_kor_air/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_eng_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_eng_air/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_jan_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_jan_air/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_chinag_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_chinag_air/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_chinab_air",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_chinab_air/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap1",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap1/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap2",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap2/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap3",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap3/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap4",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap4/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap5",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap5/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap6",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap6/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap7",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap7/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap8",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap8/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap9",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap9/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap10",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap10/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap11",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap11/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap12",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap12/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap13",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap13/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap14",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap14/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap15",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap15/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap16",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap16/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap17",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap17/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      },
      {
        "name": "emap_oldmap18",
        "url": "http://98.33.0.82:5556/MapAppServer/Service?timg=emap_oldmap18/",
        "mbr": {
          "minx": 910966,
          "miny": 1919499,
          "maxx": 997207,
          "maxy": 1977678
        },
        "imageSize": 256,
        "originX": 90112,
        "originY": 1192896,
        "levelInfos": [
          {
            "levelId": 0,
            "scale": 128
          },
          {
            "levelId": 1,
            "scale": 64
          },
          {
            "levelId": 2,
            "scale": 32
          },
          {
            "levelId": 3,
            "scale": 16
          },
          {
            "levelId": 4,
            "scale": 8
          },
          {
            "levelId": 5,
            "scale": 4
          },
          {
            "levelId": 6,
            "scale": 2
          },
          {
            "levelId": 7,
            "scale": 1
          },
          {
            "levelId": 8,
            "scale": 0.5
          },
          {
            "levelId": 9,
            "scale": 0.25
          }
        ]
      }
    ]
  }
}


goog.exportSymbol('openGDSMobile.util.jsonToArray', openGDSMobile.util.jsonToArray);
goog.exportSymbol('openGDSMobile.util.applyOptions', openGDSMobile.util.applyOptions);
goog.exportSymbol('openGDSMobile.util.getOlLayer', openGDSMobile.util.getOlLayer);
goog.exportSymbol('openGDSMobile.util.seoulMapInfo', openGDSMobile.util.seoulMapInfo);

