/*jslint devel: true, vars: true, plusplus: true*/
/*global $, jQuery, ol, OGDSM*/

var openGDSMObj;
function mapSelectUI(openGDSMObj) {
    'use strict';
    var ui = new OGDSM.eGovFrameUI();
    ui.baseMapCheckBox(openGDSMObj, 'mapSelect', 'OSM VWorld'); //현재.... 데이터 체크...
}
function vworldWMSUI() {
    'use strict';
    $('#vworldSelect').empty();
    var ui = new OGDSM.eGovFrameUI();
    var externalServer = new OGDSM.externalConnection('vworldWMS');
    var wmsListIds = ui.vworldWMSList('vworldSelect');
    var processBtn = ui.processButton('vworldSelect', 'a');
    processBtn.click(function () {
        var i, data = new Array();
        for (i = 0; i < wmsListIds.length; i++) {
            var tmpData = $('#' + wmsListIds[i] + ' option:selected').val();
            if (tmpData !== '') {
                data.push(tmpData);
            }
        }

        var wmsData = externalServer.vworldWMSLoad("9E21E5EE-67D4-36B9-85BB-E153321EEE65", "http://localhost", data);
        openGDSMObj.addMap(wmsData);
    });
}
function wfsLoad(str) {
    'use strict';
    var r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256);
    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
    var addr = 'http://113.198.80.9';
    var externalServer = new OGDSM.externalConnection();
    externalServer.geoServerWFSLoad(openGDSMObj, addr, 'opengds', str);
}

$(function () {
    'use strict';
    openGDSMObj = new OGDSM.visualization('map');
    openGDSMObj.olMapView([127.010031, 37.582200], 'OSM'); //VWorld
    openGDSMObj.trackingGeoLocation(true);
    mapSelectUI(openGDSMObj);
});

/*
$(document).ready(function (e) {
    'use strict';
    var webAppObj,
        checked,
        layersArr,
//        addr = 'http://61.106.113.122:8080',
//        addr = 'http://113.198.80.60:8087',
        addr = 'http://113.198.80.60',
//        geoServerAddr = 'http://113.198.80.60/',
        geoServerAddr = 'http://113.198.80.9',
//        folderName = '/mobile',
        folderName = '/OpenGDSMobileApplicationServer1.0',

        openGDSMObj,
        uiObj,

        vworldList,
        vworldProcessBtn,

        mapList,
        
        EnvVis,
        EnvDate,
        EnvTime,
        EnvType,
        EnvArea,
        ProcessBtn,

        externalServer;

    webAppObj = new WEBAPP();
    webAppObj.initViewer();

    openGDSMObj = new OGDSM.visualization(webAppObj.getMap());
    this.baseMap = function (style) {
        openGDSMObj.changeBaseMap(style);
    };

    uiObj = new OGDSM.eGovFrameUI();
    this.createVWorldUI = function () {
        var selectedData = "", VWorldWMSData, i, tmp;
        externalServer.changeServer("vworldWMS");
        vworldList = uiObj.vworldWMSCheck('vworldList');
        vworldProcessBtn = uiObj.processButton('vworldList', 'e');
        vworldProcessBtn.click(function () {
            for (i = 0; i < vworldList.length; i += 1) {
                tmp = $('#' + vworldList[i] + ' option:selected').val();
                if (tmp !== "") {
                    selectedData += $('#' + vworldList[i] + ' option:selected').val();
                    selectedData += ",";
                }
            }
            selectedData = selectedData.slice(0, -1);
            externalServer.setData("9E21E5EE-67D4-36B9-85BB-E153321EEE65", "http://localhost", selectedData);
            externalServer.dataLoad();
            openGDSMObj.addMap(externalServer.getResponseData());
        });
    };
    //113.198.80.60/OpenGDSMobileApplicationServer1.0/
    externalServer = new OGDSM.externalConnection('vworldWMS');
    this.getLayers = function () {
        externalServer.changeServer("geoServer", addr + folderName + "/getLayerNames.do");
        externalServer.setSubName("getLayers");
        externalServer.setData("opengds");
        checked = externalServer.dataLoad();
    };
    this.viewWFSMap = function (str) {
        var wfsData,
			r = Math.floor(Math.random() * 256),
			g = Math.floor(Math.random() * 256),
			b = Math.floor(Math.random() * 256),
            color = 'rgb(' + r + ',' + g + ',' + b + ')',
            attr = null;
        if (str.indexOf("sig") !== -1) {
            attr = "sig_kor_nm";
        } else if (str.indexOf("emd") !== -1) {
            attr = "emd_kor_nm";
        }
        externalServer.changeServer("geoServer", geoServerAddr);
        externalServer.setSubName("WFS");
        externalServer.setData("opengds", str);
        checked = externalServer.dataLoad();
        //webAppObj.getMap().addLayer(wfsData);
        if (checked === true) {
            openGDSMObj.addMap(externalServer.getResponseData());
            openGDSMObj.changeWFSStyle(str, color, 'polygon', 0.7, attr);
        } else {
            console.log("error");
        }
        
    };
    this.createSeoulPublicAreaEnvUI = function () {
        $('#setting').empty();
        var getLayers = this.getLayers();
        EnvVis = uiObj.visTypeRadio("setting");
        //externalServer.changeServer("geoServer", addr + folderName + "/getLayerNames.do");
        externalServer.setSubName("getLayers");
        externalServer.setData("opengds");
        checked = externalServer.dataLoad();
        //$('#setting').append('<div id="geomapList"></div>');
        //$('#setting').trigger("create");
        EnvDate = uiObj.dateInput("setting");
        EnvTime = uiObj.timeInput("setting");
        EnvType = uiObj.envTypeRadio("setting");
        ProcessBtn = uiObj.processButton("setting", 'e');
        ProcessBtn.click(function () {
            var apikey = "6473565a72696e7438326262524174",
                visType = $('input[name=' + EnvVis + ']:checked').val(),
                envType = $('input[name=' + EnvType + ']:checked').val(),
                mapType = $("#" + mapList + " option:selected").text(),
                date = EnvDate.val(),
                time = EnvTime.val(),
            //    mapName = "",
                resultData = null,
                attribute = null,
                xyData = null,
                range = null,
                // AirKorea information
                colors = ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
                ranges = [ [15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                          [1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                          [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                          [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                          [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
            $('#setting').popup("close");
            externalServer.changeServer("publicData", addr + folderName + '/SeoulOpenData.do');
            externalServer.setSubName("TimeAverageAirQuality");
            externalServer.setData(apikey, envType, date, time);
            checked = externalServer.dataLoad();
            if (checked === true) {
                console.log(externalServer.getResponseData());
                xyData = OGDSM.jsonToArray(externalServer.getResponseData(), envType, 'MSRSTE_NM');
                if (envType === "PM10" || envType === "PM25") {
                    range = ranges[0];
                } else if (envType === "CO") {
                    range = ranges[1];
                } else if (envType === "NO2") {
                    range = ranges[2];
                } else if (envType === "SO2") {
                    range = ranges[3];
                } else if (envType === "O3") {
                    range = ranges[4];
                }
                if (visType === 'chart') {
                    openGDSMObj.barChart("d3View", xyData, range, colors);
                    setTimeout(function () {
                        $('#dataSelect').popup('open');
                    }, 2000);
                } else if (visType === 'map') {
                    console.log(mapType);
                    $('#d3viewonMap').show();
                    $("#d3viewonMap").height(50);
                    $('#d3viewonMap').css('top', $(window).height() - 50);
                    //resultData = externalServer.geoServerWFS(geoServerAddr, "opengds", mapType);
                    resultData = externalServer.geoServerWFS(geoServerAddr, "opengds", "seoul_sig");
                    openGDSMObj.addMap(resultData);
                    openGDSMObj.changeWFSStyle("seoul_sig", colors, 'polygon', 0.6, "sig_kor_nm", range, xyData);
                }
            } else {
                console.log("error");
            }
        });
    };
    this.createSeoulPublicRoadEnvUI = function () {
        $('#setting').empty();
        EnvVis = uiObj.visTypeRadio("setting", false);
        EnvType = uiObj.envTypeRadio("setting");
        ProcessBtn = uiObj.processButton("setting");
        ProcessBtn.click(function () {
            console.log("test");
        });
    };
    this.createPublicPortalUI = function () {
        var xyData, i,
            range = null,
            areaName = ['인천', '서울', '경기', '강원',
                        '충남', '세종', '충북',
                        '대전', '경북',
                        '전북', '대구', '울산',
                        '전남', '광주', '경남', '부산',
                        '제주'],
            geoServerName = ['incheon', 'seoul', 'gyeonggi', 'gangwon',
                             'chungnam', 'sejong', 'chungbuk',
                             'daejong', 'gyeongbuk',
                             'jeonbuk', 'daegu', 'ulsan',
                             'jeonnam', 'gwangju', 'gyeongnam', 'busan',
                             'jeju'];
        $('#setting').empty();
        EnvVis = uiObj.visTypeRadio("setting");
        externalServer.changeServer("geoServer", addr + folderName + "/getLayerNames.do");
        externalServer.setSubName("getLayers");
        externalServer.setData("opengds");
        checked = externalServer.dataLoad();
        //$('#setting').append('<div id="geomapList"></div>');
        //$('#setting').trigger("create");
        EnvArea = uiObj.areaTypeRadio("setting");
        EnvType = uiObj.envTypeRadio("setting", "public");
        ProcessBtn = uiObj.processButton("setting", 'e');
        ProcessBtn.click(function () {
            var apikey = 'kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D',
                visType = $('input[name=' + EnvVis + ']:checked').val(),
                areaType = $('input[name=' + EnvArea + ']:checked').val(),
                envType = $('input[name=' + EnvType + ']:checked').val(),
                //mapType = $("#" + mapList + " option:selected").text(),
                mapType,
                resultData = null,
                attribute = null,
                xyData = null,
                ////// AirKorea information
                colors = ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
                ranges = [ [15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                          [1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                          [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                          [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                          [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
            $('#setting').popup("close");
            externalServer.changeServer("publicData", addr + folderName + '/PublicDataPortal.do');
            externalServer.setSubName("ArpltnInforInqireSvc");
            externalServer.setData(apikey, envType, areaType);
            checked = externalServer.dataLoad();
            if (checked === true) {
                console.log(externalServer.getResponseData());
                xyData = OGDSM.jsonToArray(externalServer.getResponseData(), envType, 'stationName');
                if (envType === "pm10Value" || envType === "pm25Value") {
                    range = ranges[0];
                } else if (envType === "coValue") {
                    range = ranges[1];
                } else if (envType === "no2Value") {
                    range = ranges[2];
                } else if (envType === "so2Value") {
                    range = ranges[3];
                } else if (envType === "o3Value") {
                    range = ranges[4];
                }
                if (visType === 'chart') {
                    openGDSMObj.barChart("d3View", xyData, range, colors);
                    setTimeout(function () {
                        $('#dataSelect').popup('open');
                    }, 2000);
                } else if (visType === 'map') {
                    for (i = 0; i < areaName.length; i += 1) {
                        if (areaType === areaName[i]) {
                            if (areaType === '서울') {
                                mapType = geoServerName[i] + '_sig';
                            } else {
                                mapType = geoServerName[i] + '_emd';
                            }
                        }
                    }
                    $('#d3viewonMap').show();
                    $("#d3viewonMap").height(50);
                    $('#d3viewonMap').css('top', $(window).height() - 50);
                    if (mapType === 'seoul_sig' || mapType === 'seoul_emd') {
                        attribute = 'sig_kor_nm';
                    } else {
                        attribute = 'emd_kor_nm';
                    }
                    resultData = externalServer.geoServerWFS(geoServerAddr, "opengds", mapType);
                    openGDSMObj.addMap(resultData);
                    openGDSMObj.changeWFSStyle(mapType, colors, 'polygon', 0.6, attribute, range, xyData);
                }
            } else {
                console.log("error");
            }
        });
    };
    */
//});
