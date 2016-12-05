/**
 * Created by intruder on 2016-11-11.
 */
var curShowMenu = null;
$(function(){
  $(".menu-event").click(function(){
    var clickMenuDOM = $(this)[0];
    var id = $(clickMenuDOM).attr('id');
    var container = $('#container');
    var content = $('#content');

    var panel = $('#openDataPanel');
    if (panel.hasClass('menu-show')) {
      panel.removeClass('menu-show');
      panel.addClass('menu-hide');
    }

    if (curShowMenu === id) {
      container.removeClass('menu-show');
      container.addClass('menu-hide');
      curShowMenu = null;
    } else {
      if ($('#mapList').hasClass('menu-show')){
        $('#mapList').removeClass('menu-show');
        $('#mapList').addClass('menu-hide');
      }
      if (!container.hasClass('menu-show')){
        container.removeClass('menu-hide');
        container.addClass('menu-show');
      }
      if (!content.hasClass('list-group')){
        content.addClass('list-group');
      }
      
      if (id === 'vectorMapVis') {
        content.empty();
        loadingGeoServerData();
      } else if (id === 'openDataVis') {
        content.empty();
        loadingOpenData()
      } else if (id === 'fusionVis') {
        content.removeClass('list-group');
        content.empty();
        loadingFusionData();
      } else if (id === 'layerManager') {
        container.removeClass('menu-show');
        container.addClass('menu-hide');
        $('#mapList').removeClass('menu-hide');
        $('#mapList').addClass('menu-show');

      } else if (id === 'zoomIn') {
        map.zoomIn();
      } else if (id === 'zoomOut') {
        map.zoomOut();
      }
      curShowMenu = id;
    }
  });
  $('#selectMap select').on('changed.bs.select', function(e){
    var value = $(this).val();
    if (value.indexOf('SeoulMap') != -1){
      map.changeBgMap(value, '51b32cf8444d4b6592a290bc64a88dc8');
    } else if (value.indexOf('VWorld') != -1){
      map.changeBgMap(value, '')
    }
    else {
      map.changeBgMap(value, '80E403B5-D3F1-377E-A24D-A7143492B2F3');
    }
  });
});
/**
 * 지오서버 데이터 리스트 요청
 * @param callback
 */
function loadingGeoServerData(callback){
  callback = (typeof (callback) !== 'undefined') ? callback : null;
  var requestAddr = baseAddr + publicDataContextName;
  var viewContent = $('#content');
  $.ajax({
    url : requestAddr + '/api/GeoServer/' + geoServerWS,
    dataType : 'json',
    success : function (res){
      if (callback !== null) {
        callback(res);
        return 0;
      }
      $(viewContent).css('overflow', 'auto');
      var objs = res.names;
      for (var i=0; i < objs.length; i++){
        $(viewContent).append('<button type="button" class="list-group-item list-group-item-action layer-btn" data-val="' + objs[i] + '">' +
            objs[i] +
          '</button>');
      }
    },
    error : function(err){
      console.error(err);
    }
  });
}
/**
 * 공공 데이터 요청
 * @param callback
 */
function loadingOpenData(callback){
  callback = (typeof (callback) !== 'undefined') ? callback : null;
  var requestAddr = baseAddr + publicDataContextName;
  var viewContent = $('#content');
  $.ajax({
    url : requestAddr + '/api/Collected',
    type : 'get',
    success : function(res){
      if (callback !== null) {
        callback(res);
        return 0;
      }
      for (var i=0; i<res.length; i++) {
        $(viewContent).css('overflow', 'auto');
        var visName = res[i].visname;
        var name = res[i].name;
        var comment = res[i].comment;
        var provider = res[i].provider;
        $(viewContent).append('<a href="#" class="list-group-item list-group-item-action openData-btn" data-val="' + name + '" data-type="' + res[i].type + '">' +
            '<span style="font-size:1.7rem; font-weight:bold;">' + visName + '</span>' +
            '<br><span style="font-size:1.5rem; margin-left:4px; font-weight:bold;">provider : ' + provider + '</span>' +
            '<br><span style="font-size:1.2rem">' + comment +'</span>' +
          '</a>');
      }
    },
    error : function(err){
      console.error(err);
    }
  });
}
/**
 * 융합 시각화 메뉴 패널 (menu panel - fusion visualization)
 */
function loadingFusionData(){
  var content = $('#content');
  /**GeoServer data select**/
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Geo-spatial(GeoServer/Open Data)</legend>' +
    '<select class="selectpicker" data-style="btn-info" id="fusionGeoData" data-width="100%" title="Select Geo-Data" data-size=6>' +
    '<optgroup label="GeoServer" id="optGeoServer"></optgroup>' +
    '<optgroup label="Open Data" id="optOpenData"></optgroup>' +
    '</select>'+
    '</fieldset>');
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Open Data</legend>' +
    '<select class="selectpicker open-data-select" data-style="btn-info" id="fusionOpenData" data-width="100%" title="Select Open Data" data-size=6></select>'+
    '</fieldset>');
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Matching Attribute</legend>' +
    '<select class="selectpicker col-sm-6 col-md-6 col-lg-6" data-style="btn-success" id="geoKey" data-width="50%" title="Select Geo Key" data-size=6></select>'+
    '<select class="selectpicker col-sm-6 col-md-6 col-lg-6 open-data-select" data-style="btn-success" id="openKey" data-width="50%" title="Select Open Key" data-size=6></select>'+
    '</fieldset>');
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Value</legend>' +
    '<select class="selectpicker open-data-select" data-style="btn-success" id="valueKey" data-width="100%" title="Select Value" data-size=6></select>'+
    '</fieldset>');
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Day</legend>' +
    '<select class="selectpicker open-data-select data-view" data-style="btn-success" id="dateKey" data-width="100%" title="Select Day" data-size=6></select>'+
    '</fieldset>');
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Preset</legend>' +
    '<select class="selectpicker data-view" data-style="btn-success" id="preset" data-width="100%" title="Select Day" data-size=6>' +
    '<option value="PM10">PM10</option>' +
    '<option value="PM25">PM2.5</option>' +
    '<option value="SO2">SO2</option>' +
    '<option value="O3">O3</option>' +
    '<option value="NO2">NO2</option>' +
    '<option value="CO">CO</option>' +
    '<option value="Wind">Wind Flow</option>' +
    '<option value="Temperatures">Temperatiures</option>' +
    '</select>'+
    '<div id="rangeSpectrum" style="width:100%; height:20px;"></div>'+
    '</fieldset>');
  $(content).append('<fieldset class="well">' +
    '<legend class="well-legend">Data</legend>' +
    '<pre id="dataPreView" class="scroll-style" style="height:100px;  overflow-y: scroll;">' +
    '</pre>'+
    '</fieldset>');
  $('#preset').selectpicker('refresh');
  loadingGeoServerData(function(data){
    var layerNames = data.names;
    for (var i=0; i<layerNames.length; i++){
      $('#optGeoServer').append('<option value="' + layerNames[i] +'">' + layerNames[i] + '</option>');
    }
    $('#fusionGeoData').selectpicker('refresh');
  });
  loadingOpenData(function(data){
    for (var i=0; i<data.length; i++){
      $('#optOpenData').append('<option value="' + data[i].name +'">' + data[i].name + '</option>');
      $('#fusionOpenData').append('<option value="' + data[i].name +'">' + data[i].name + '</option>');
    }
    $('#fusionGeoData').selectpicker('refresh');
    $('#fusionOpenData').selectpicker('refresh');
  });
}
/**
 * 지도 시각화 함수 (Layer visulization)
 */
$(document).on('click', '.layer-btn', function(evt){
  var dataVal = $(this).data('val');
  var requestVector = baseAddr + '/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&outputFormat=json&srsname=EPSG:3857';
  var layerName = geoServerWS + ':' + dataVal;
  requestVector += '&typeNames=' + layerName;
  var key = dataVal.split('_');
  if (key[key.length - 1] == 'sig'){
    key = 'sig_kor_nm';
  } else {
    key = 'emd_kor_nm';
  }
  $.ajax({
    type : 'POST',
    url : requestVector,
    crossDomain: true,
    dataType : 'json',
    success : function (evt) {
      map.addGeoJSONLayer(evt, 'polygon', dataVal, {
        attrKey : key
      });
      mapManager.addItem(dataVal);
    },
    error : function (err) {

    }
  });
});


function enToko(name){

}
function idToen(name){

}