/*jslint devel: true, vars: true, plusplus: true*/
/*global $, jQuery, ol, OGDSM, geoServerAddr, serverAddr*/
var openGDSMObj;

//배경지도 라디오 버튼 사용자 인터페이스 생성 함수
function mapSelectUI(openGDSMObj) {
    'use strict';
    var ui = new OGDSM.eGovFrameUI();
    ui.baseMapSelect(openGDSMObj, 'mapSelect', 'OSM VWorld VWorld_m VWorld_s VWorld_g'); //현재.... 데이터 체크...
}
//데이터 라디오 버튼 사용자 인터페이스 생성 함수
function mapAttrUI() {
    'use strict';
    var attrChk = $('#attrChk');
    var attrEditChk = $('#attrEditChk');
    attrChk.click(function () {
        var chk = $(this).is(':checked');
        if (chk === true) {
            $('#dataViewCheckBox').removeClass('OGDSPosTransLeftHide');
            $('#dataViewCheckBox').addClass('OGDSPosTransLeftShow');

            $('#attributeTable').removeClass('OGDSPosTransTopDownHide');
            $('#attributeTable').addClass('OGDSPosTransTopDownShow');

        } else {
            $('#dataViewCheckBox').removeClass('OGDSPosTransLeftShow');
            $('#dataViewCheckBox').addClass('OGDSPosTransLeftHide');

            $('#attributeTable').removeClass('OGDSPosTransTopDownShow');
            $('#attributeTable').addClass('OGDSPosTransTopDownHide');
        }
    });
    attrEditChk.click(function () {
        var chk = $(this).is(':checked'),
            attrObj = openGDSMObj.getAttrObj();
        if (chk === true) {
            attrObj.editAttribute(true);
        } else {
            attrObj.editAttribute(false);

        }

    });
}
//브이월드 WMS 데이터 선택 사용자 인터페이스 생성 / 시각화 함수
function vworldWMSUI() {
    'use strict';
    $('#vworldSelect').empty();
    var ui = new OGDSM.eGovFrameUI();
    var externalServer = new OGDSM.externalConnection('vworldWMS');
    var wmsListIds = ui.vworldWMSList('vworldSelect');
    var processBtn = ui.autoButton('vworldSelect', 'vworldProcess', '시각화', '#', {
        theme : 'a'
    });
    processBtn.click(function () {
        var i, data = [];
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
//지오서버 WFS 데이터 시각화 함수
function wfsLoad(str, label) {
    'use strict';
    label = (typeof (label) !== 'undefined') ? label : null;
    var r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256);
    var color = 'rgb(' + r + ',' + g + ',' + b + ')';
    var externalServer = new OGDSM.externalConnection();
    var ui = new OGDSM.eGovFrameUI();
    externalServer.geoServerGeoJsonLoad(openGDSMObj, geoServerAddr, 'opengds', str, {
        color : color,
        label : label
    });
}
//서울 열린데이터 광장 데이터 선택 사용자 인터페이스 생성 / 시각화 함수
function createSeoulPublicAreaEnvUI() {
    'use strict';
    $('#setting').empty();
    var ui = new OGDSM.eGovFrameUI();
    var envIds = ui.seoulEnvironment('setting');
    var processBtn = ui.autoButton('setting', 'process', '시각화', '#', {
        theme : 'a'
    });
    var externalServer = new OGDSM.externalConnection();
    var colors = ['#0090ff', '#008080', '#4cff4c', '#99ff99', '#FFFF00', '#FFFF99', '#FF9900', '#FF0000'],
        ranges = [ [15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                  [1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                  [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                  [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                  [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
    processBtn.click(function () {
        $('#setting').popup("close");
        var apiKey = '6473565a72696e7438326262524174',
            addr = serverAddr + '/SeoulOpenData.do';
        var visualType = $('input[name=' + envIds[0].attr('name') + ']:checked').val(),
            environmentType = $('input[name=' + envIds[3].attr('name') + ']:checked').val(),
            date = envIds[1].val().split('-').join(''),
            time = envIds[2].val().substr(0, 2).concat('00');
        switch (environmentType) {
        case 'PM10':
            ranges = ranges[0];
            break;
        case 'PM25':
            ranges = ranges[0];
            break;
        case 'CO':
            ranges = ranges[1];
            break;
        case 'NO2':
            ranges = ranges[2];
            break;
        case 'SO2':
            ranges = ranges[3];
            break;
        case 'O3':
            ranges = ranges[4];
            break;
        }
        externalServer.seoulEnvironmentLoad(addr, apiKey, environmentType, date, time, function (resultData) {
            var xyData = OGDSM.jsonToArray(resultData, environmentType, 'MSRSTE_NM');
            if (visualType === 'map') {
                externalServer.geoServerWFSLoad(openGDSMObj, geoServerAddr, 'opengds', 'seoul_sig', {
                    callback : function (layer) {
                        openGDSMObj.changeWFSStyle('seoul_sig', colors, {
                            opt : 0.6,
                            attr : 'sig_kor_nm',
                            range : ranges,
                            xyData : xyData ////////////////// JSON DATA .... edit....
                        });
                    }
                });
            } else if (visualType === 'chart') {
                var d3Chart = new OGDSM.chartVisualization(resultData, {
                    rootKey : 'row',
                    labelKey : 'MSRSTE_NM',
                    valueKey : environmentType,
                    min : ranges[0],
                    max : ranges[6]
                });

                $("#d3View").css('width', ($(window).width() - 50) + 'px');
                $("#d3View").css('height', ($(window).height() - 200) + 'px');
                d3Chart.hBarChart("d3View", {
                    range : ranges,
                    color : colors
                });
                $('#dataSelect').popup('open');
            }
        });
    });
}
function createPublicPortalUI(service) {
    'use strict';
    $('#setting').empty();
    var ui = new OGDSM.eGovFrameUI();
    var externalServer = new OGDSM.externalConnection();
    var customUI = null, processBtn = null;
    console.log(service);
    if (service === 'greengas') {
        customUI = ui.dataPortalGreenGas('setting');
        processBtn = ui.autoButton('setting', 'process', '시각화', '#', {
            theme : 'a'
        });
        processBtn.click(function () {
            $('#setting').popup('close');
            var apiKey = 'kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D',
                addr = serverAddr + '/PublicDataPortal.do';
            var visualType = $('input[name=' + customUI[0].attr('name') + ']:checked').val(),
                date = customUI[1].val().split('-').join('');
            console.log(addr + ' ' + date);
            externalServer.greenGasEmissionLoad(addr, apiKey, date, date, function (resultData) {
                console.log(resultData);
                if (visualType === 'chart') {
                    var d3Chart = new OGDSM.chartVisualization(resultData, {
                        rootKey : 'row',
                        labelKey : 'brNm',
                        valueKey : 'totEmTco2eq',
                        min : 0
                    });
                    $("#d3View").css('width', ($(window).width() - 100) + 'px');
                    $("#d3View").css('height', ($(window).height() - 200) + 'px');
                    d3Chart.areaChart("d3View");
                    $("#d3View").css('overflow-y', 'scroll');
                    $("#d3View").css('max-height', ($(window).height() - 200) + 'px');
                    $('#dataSelect').popup('open');
                }
            });

        });
    } else if (service === 'nuclear') {
        customUI = ui.dataPortalNuclear('setting');
        processBtn = ui.autoButton('setting', 'process', '시각화', '#', {
            theme : 'a'
        });
        processBtn.click(function () {
            $('#setting').popup('close');
            var apiKey = 'kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D',
                addr = serverAddr + '/PublicDataPortal.do';
            var visualType = $('input[name=' + customUI[0].attr('name') + ']:checked').val(),
                nuclearPos = $('input[name=' + customUI[1].attr('name') + ']:checked').val();
            console.log(addr + ' ' + visualType + ' ' + nuclearPos);
            externalServer.realTimeLevelofRadiationLoad(addr, apiKey, nuclearPos, function (resultData) {
                console.log(resultData);
                if (visualType === 'chart') {
                    var d3Chart = new OGDSM.chartVisualization(resultData, {
                        rootKey : 'row',
                        labelKey : 'expl',
                        valueKey : 'value',
                        min : 0
                    });
                    $("#d3View").css('width', ($(window).width() - 100) + 'px');
                    $("#d3View").css('height', ($(window).height() - 200) + 'px');
                    d3Chart.lineChart("d3View");
                    $("#d3View").css('overflow-y', 'scroll');
                    $("#d3View").css('max-height', ($(window).height() - 200) + 'px');
                    $('#dataSelect').popup('open');
                }
            });
        });
    } else if (service === 'airKorea') {
        customUI = ui.dataPortalEnvironment('setting');
        processBtn = ui.autoButton('setting', 'process', '시각화', '#', {
            theme : 'a'
        });
        var colors = ['#0090ff', '#008080', '#4cff4c', '#99ff99', '#FFFF00', '#FFFF99', '#FF9900', '#FF0000'],
            ranges = [ [15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                      [1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                      [0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                      [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                      [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
        processBtn.click(function () {
            $('#setting').popup('close');
            var apiKey = 'kCxEhXiTf1qmDBlQFOOmw%2BemcPSxQXn5V5%2Fx8EthoHdbSojIdQvwX%2BHtWFyuJaIco0nUJtu12e%2F9acb7HeRRRA%3D%3D',
                addr = serverAddr + '/PublicDataPortal.do';
            var visualType = $('input[name=' + customUI[0].attr('name') + ']:checked').val(),
                environmentType = $('input[name=' + customUI[2].attr('name') + ']:checked').val(),
                area = $('input[name=' + customUI[1].attr('name') + ']:checked').val();
            console.log(addr + ' ' + visualType + ' ' + environmentType + ' ' + area);
            switch (environmentType) {
            case 'pm10Value':
                ranges = ranges[0];
                break;
            case 'pm25Value':
                ranges = ranges[0];
                break;
            case 'coValue':
                ranges = ranges[1];
                break;
            case 'no2Value':
                ranges = ranges[2];
                break;
            case 'so2Value':
                ranges = ranges[3];
                break;
            case 'o3Value':
                ranges = ranges[4];
                break;
            }
            externalServer.dataPortalEnvironmentLoad(addr, apiKey, environmentType, area, function (resultData) {
                var xyData = OGDSM.jsonToArray(resultData, environmentType, 'stationName');
                if (visualType === 'map') {
                    externalServer.geoServerWFSLoad(openGDSMObj, geoServerAddr, 'opengds', 'seoul_sig', {
                        callback : function (layer) {
                            openGDSMObj.changeWFSStyle('seoul_sig', colors, {
                                opt : 0.6,
                                attr : 'sig_kor_nm',
                                range : ranges,
                                xyData : xyData
                            });
                        }
                    });
                } else if (visualType === 'chart') {
                    var d3Chart = new OGDSM.chartVisualization(resultData, {
                        rootKey : 'row',
                        labelKey : 'stationName',
                        valueKey : environmentType,
                        min : ranges[0],
                        max : ranges[6]
                    });
                    console.log(d3Chart);
                    $("#d3View").css('width', ($(window).width() - 100) + 'px');
                    $("#d3View").css('height', ($(window).height() - 200) + 'px');
                    d3Chart.vBarChart("d3View", {
                        range : ranges,
                        color : colors
                    });
                    $("#d3View").css('overflow-y', 'scroll');
                    $("#d3View").css('max-height', ($(window).height() - 200) + 'px');
                    $('#dataSelect').popup('open');
                }
            });
        });
    }
}
function deleteDB() {
    'use strict';
    OGDSM.indexedDB('webMappingDB', {
        type : 'removeAll',
        storeName : 'webMappingDB'
    });
    $('#NotData').show();
    $('#attrList').empty();
}
function searchDB() {
    'use strict';
    OGDSM.indexedDB('webMappingDB', {
        type : 'searchAll',
        storeName : 'webMappingDB',
        success : function (data) {
            if (data.length !== 0) {
                console.log(data);
                $('#NotData').hide();
                var attrList = $('#attrList');
                $.each(data, function (i, d) {
                    var label = d.key.split('--')[0];
                    var sp = label.split('_')[1];
                    if (sp === 'sig' || sp === 'emd') {
                        attrList.prepend(
                            '<li data-label="' + label + '">' +
                                '<a href="#" onclick="wfsLoad(\'' + d.key + '\', \'' + sp + '_kor_nm\')">' +
                                label + '</li>'
                        );
                    }
                });
                attrList.prepend(
                    '<li data-label="delete">' +
                        '<a href="#" onclick="deleteDB()">모두 삭제</li>'
                );
            }
            $('#attrList').listview('refresh');
        },
        fail : function (result) {
            console.log("Not data");
        }
    });
}
$(function () {
    'use strict';
    openGDSMObj = new OGDSM.visualization('map', {
        layerListDiv : 'layerList',
        attrTableDiv : 'attributeTable',
        attrAddr : serverAddr + '/attrTable.do'
    }); //map div, layerList switch
    openGDSMObj.olMapView([127.010031, 37.582200], 'OSM', 'EPSG:900913'); //VWorld
    //openGDSMObj.trackingGeoLocation(true);
    mapSelectUI(openGDSMObj);
    mapAttrUI();
    searchDB();
    /***************************************************/
    $("#d3View").attr('width', $(window).width() - 100);
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);

    $('#dataSelect').attr('width', $(window).width() - 50);
    $('#dataSelect').attr('height', $(window).height() - 200);
    /***************************************************/
  //  testfunction();
});

function testfunction() {
    'use strict';
/*wfsLoad*/
    /*wfsLoad('seoul_sig');*/
/*db key Delete */
    /*OGDSM.indexedDB('webMappingDB', {
        type : 'remove',
        deleteKey : 'seoul_sig:DB'
    });*/
/*db All delete */
/*
    OGDSM.indexedDB('webMappingDB', {
        type : 'removeAll',
        storeName : 'webMappingDB'
    });
    */
/*delete DB*/
    OGDSM.indexedDB('webMappingDB', {
        type : 'deleteDB'
    });
}
