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
    });/*
    attrEditChk.click(function () {
        var chk = $(this).is(':checked'),
            attrObj = openGDSMObj.getAttrObj();
        if (chk === true) {
            attrObj.editAttribute(true);
        } else {
            attrObj.editAttribute(false);

        }
    });*/
}
//실시간 통신
function realTimeFunc() {
    'use strict';
    var allTitle = null, localListView = null, attrObj = null,
        ui = new OGDSM.eGovFrameUI(),
        exConnect = new OGDSM.externalConnection();
    var realEditChk = $('input[name=editFlag]');
    var jsonData = {};
    jsonData.subject = null;
    jsonData.userid = $('#idTextInput').val();
    function listClickEvt(data) {
        $('#curList').popup('close');
        setTimeout(function () {
            $('#idInputDiv').popup('open');
        }, 1000);
    }
    $('#idTextInput').change(function () {
        jsonData.userid = $(this).val();
    });
    realEditChk.change(function () {
        var val = $(this).val();
        if (val === 'online') {
            $('#localCurView').empty();
            $('#remoteCurView').empty();
            allTitle = openGDSMObj.getLayersTitle();
            localListView = ui.autoListView('localCurView', 'curListView', allTitle, { divide : '현재 장치 시각화 목록'});
            var parm = {column : 'subject'};

            exConnect.ajaxRequest(serverAddr + '/realtimeInfoSearch.do', {
                data : parm,
                callback : function (data) {
                    var subject = data.data;
                    var remoteListView = ui.autoListView('remoteCurView', 'curRemoteListView', subject, {divide : '실시간 편집 목록', itemKey : 'subject'});
                    remoteListView.click(function (e) {
                        var title = $(this).attr('data-title');
                        jsonData.subject = title;
                        if (typeof title !== 'undefined') {
                            listClickEvt($(this).attr('data-title'));
                        }
                    });
                }
            });

            $('#curList').popup('open', {
                positionTo : 'window'
            });
            localListView.click(function (e) {
                var title = $(this).attr('data-title');
                jsonData.subject = title;
                if (typeof title !== 'undefined') {
                    listClickEvt($(this).attr('data-title'));
                }
            });
            ////////////아이디 입력 후 요청//////////////////////////
            exConnect.ajaxRequest(serverAddr + '/realtimeInfoInsert.do', {
                submitBtn : 'realTimeBtn',
                data : jsonData,
                callback : function (data) {
                    if (data.data === -1) {
                        alert("같은 아이디가 있습니다. 아이디를 다시 입력해주시기 바랍니다");
                    } else if (data.data === 0) {
                        $('#idInputDiv').popup('close');
                        alert("시스템 오류 관리자에게 문의하시기 바랍니다");
                    } else if (data.data === 1) {
                        $('#idInputDiv').popup('close');
                        console.log("실시간 편집을 시작합니다");
                        //편집 모드 활성화... 그 해당 속성정보에게만...
                        //session storage에 저장
                        // webSocket 연결....
                    }

                }
            });
        } else if (val === 'offline') {
            $('#localCurView').empty();
            $('#remoteCurView').empty();
            $('#curList').popup('open', {
                positionTo : 'window'
            });
            allTitle = openGDSMObj.getLayersTitle();
            localListView = ui.autoListView('localCurView', 'curListView', allTitle, { divide : '현재 장치 시각화 목록'});
            localListView.click(function (e) {
                var title = $(this).attr('data-title');
                if (typeof title !== 'undefined') {
                    $('#curList').popup('close');
                    attrObj = openGDSMObj.getAttrObj();
                    attrObj.editAttribute(true, title);
                }
            });
            //session storage 확인 있을 경우 삭제
            //리스트 뷰 ..... 생성 이땐 로컬만..
            //클릭 하면 해당 속성정보만 편집 기능 활성화...
            console.log("websocket cancel");
        } else {
            attrObj = openGDSMObj.getAttrObj();
            //webSocket 접속의 경우 끊음
            //session storage 내용 삭제
            attrObj.editAttribute(false);
            console.log('exit');
        }
    });
    /*
    $('#curList').on({
        popupafterclose : function (evt, ui) {
            console.log("test");
            //session Storage 검사 후... 널일 경우에는... 편집모드(실시간) -> 편집모드(종료)
        }
    });*/

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
function kMapLoad(str) {
    'use strict';
    $('#opendataList').popup('close');
    $("#d3View").css('width', ($(window).width() - 300) + 'px');
    $("#d3View").css('height', ($(window).height() + 200) + 'px');
    $("#d3View").css('max-height', ($(window).height() + 200) + 'px');
    setTimeout(function () {
        var chartObj = new OGDSM.chartVisualization();
        $('.range').hide();
        chartObj.kMap('d3View', serverAddr + '/geojson.do', str, {
            map_scale : 8000
        });
        $("#d3View").css('overflow-y', 'scroll');
        $("#d3View").css('max-height', ($(window).height() - 200) + 'px');
        console.log($("#dataSelect").css('height'));
        $('#dataSelect').popup('open');
    }, 1000);
}
//서울 열린데이터 광장 데이터 선택 사용자 인터페이스 생성 / 시각화 함수
function createSeoulPublicAreaEnvUI(str) {
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
            if (visualType === 'map') {
                externalServer.geoServerGeoJsonLoad(openGDSMObj, geoServerAddr, 'opengds', 'seoul_sig', {
                    callback : function (layer) {
                        console.log(layer);
                        openGDSMObj.changeWFSStyle('seoul_sig', colors, {
                            attr : 'sig_kor_nm',
                            range : ranges,
                            data : resultData,
                            rootKey : 'row',
                            labelKey : 'MSRSTE_NM',
                            valueKey : environmentType
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

                $("#d3View").css('width', ($(window).width()) - 100 + 'px');
                $("#d3View").css('height', ($(window).height()) + 'px');
                $("#d3View").css('max-height', ($(window).height()) + 'px');
                d3Chart.hBarChart("d3View", {
                    range : ranges,
                    color : colors
                });
                $("#d3View").css('overflow-y', 'scroll');
                $("#d3View").css('max-width', ($(window).width() - 100) + 'px');
                $("#d3View").css('max-height', ($(window).height() - 200) + 'px');
                $('.range').show();
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
                    $('.range').hide();
                    $("#d3View").css('width', ($(window).width() - 100) + 'px');
                    $("#d3View").css('height', ($(window).height() - 200) + 'px');
                    $("#d3View").css('max-height', ($(window).height()) + 'px');
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
                    $('.range').hide();
                    $("#d3View").css('width', ($(window).width() - 100) + 'px');
                    $("#d3View").css('height', ($(window).height() - 200) + 'px');
                    $("#d3View").css('max-height', ($(window).height()) + 'px');
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
        var colors = ['#0090ff', '#0090ff', '#008080', '#4cff4c', '#99ff99', '#FFFF00', '#FFFF99', '#FF9900', '#FF0000'],
            ranges = [ [0, 15, 30, 55, 80, 100, 120, 200],    //PM10, PM25
                      [0, 1, 2, 5.5, 9, 10.5, 12, 15],        //CO
                      [0, 0.015, 0.03, 0.05, 0.06, 0.1045, 0.15, 0.2],    //NO2
                      [0, 0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15],     //SO2
                      [0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3] ];     //O3
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
                    externalServer.geoServerGeoJsonLoad(openGDSMObj, geoServerAddr, 'opengds', 'seoul_sig', {
                        callback : function (layer) {
                            console.log(resultData);
                            openGDSMObj.changeWFSStyle('seoul_sig', colors, {
                                attr : 'sig_kor_nm',
                                range : ranges,
                                data : resultData,
                                rootKey : 'row',
                                labelKey : 'stationName',
                                valueKey : environmentType
                            });
                        }
                    });
                } else if (visualType === 'chart') {
                    var d3Chart = new OGDSM.chartVisualization(resultData, {
                        rootKey : 'row',
                        labelKey : 'stationName',
                        valueKey : environmentType,
                        min : ranges[0],
                        max : ranges[7]
                    });
                    console.log(d3Chart);
                    $('.range').show();
                    $("#d3View").css('width', ($(window).width()) - 100 + 'px');
                    $("#d3View").css('height', ($(window).height()) - 200  + 'px');
                    $("#d3View").css('max-height', ($(window).height()) + 'px');
                    d3Chart.vBarChart("d3View", {
                        range : ranges,
                        color : colors
                    });
                    $("#d3View").css('overflow-y', 'scroll');
                    $("#d3View").css('max-width', ($(window).width() - 100) + 'px');
                    $("#d3View").css('max-height', ($(window).height() - 200) + 'px');
                    $('#dataSelect').popup('open');
                }
            });
        });
    }
}
function popupCloseEvent(service, param) {
    'use strict';
    $('#opendataList').popup('close');
    setTimeout(function () {
        if (service === 'seoul') {
            createSeoulPublicAreaEnvUI(param);
        } else if (service === 'public') {
            createPublicPortalUI(param);
        }
        $('#setting').popup('open');
    }, 1000);
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

    $('#map').height($(window).height());

    openGDSMObj = new OGDSM.visualization('map', {
        layerListDiv : 'layerList',
        attrTableDiv : 'attributeTable',
        attrAddr : serverAddr + '/attrTable.do'
    }); //map div, layerList switch
    openGDSMObj.olMapView([127.010031, 37.582200], 'OSM', 'EPSG:900913'); //VWorld
    //openGDSMObj.trackingGeoLocation(true);
    mapSelectUI(openGDSMObj);
    mapAttrUI();
    realTimeFunc();
    searchDB();
    /***************************************************/
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);

/*    $('#dataSelect').attr('width', $(window).width() - 50);
    $('#dataSelect').attr('height', $(window).height() - 200);*/
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
