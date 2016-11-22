/**
 * Created by intruder on 16. 11. 17.
 */
var geoAttr = '';
var openLabel = '';
var openValue = '';
var lyName = 'fusion-Geospatial';
var jsonStr;


$(function(){



});
$(document).on('changed.bs.select', '#fusionGeoData', fusionVisGeoData);
$(document).on('changed.bs.select', '#fusionOpenData', fusionVisOpenData);
$(document).on('click', '.open-data-select', previewData);
$(document).on('changed.bs.select', '.data-view', dataView);
$(document).on('changed.bs.select', '#preset', preset);

function fusionVisGeoData(evt){
  var selectObj = $(this).val();
  var requestVector = baseAddr + '/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&outputFormat=json&srsname=EPSG:3857';
  var layerName = geoServerWS + ':' + selectObj;
  requestVector += '&typeNames=' + layerName;

  if (openGDSMobile.util.getOlLayer(map.getMapObj(), lyName) != false){
    mapManager.removeItem(lyName);
    map.removeLayer(lyName);
  }

  var key = selectObj.split('_');
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
      map.addGeoJSONLayer(evt, 'polygon', lyName, {
        attrKey : key
      });
      mapManager.addItem(lyName);
      var keyList = map.getAttribute(lyName);
      $('#geoKey').empty();

      for (var i=0; i<keyList.length; i++){
        $('#geoKey').append('<option value="' + keyList[i] + '">' + keyList[i] + '</option>');
      }
      $('#geoKey').selectpicker('refresh');

    },
    error : function (err) {

    }
  });

}
function fusionVisOpenData(evt){
  var collection = $(this).val();
  var publicRequestUrl = baseAddr + publicDataContextName
  //key list
  $.ajax({
    url: publicRequestUrl + '/api/MongoDB/selectOne/' + collection,
    type: 'GET',
    success: function (evt) {
      var keyList = [];
      openGDSMobile.util.getJsonKey(evt, keyList);
      $('#openKey').empty();
      $('#valueKey').empty();
      for (var i=0; i<keyList.length; i++) {
        $('#openKey').append('<option value="' + keyList[i] + '">' + keyList[i] + '</option>');
        $('#valueKey').append('<option value="' + keyList[i] + '">' + keyList[i] + '</option>');
      }
      $('#openKey').selectpicker('refresh');
      $('#valueKey').selectpicker('refresh');
    }
  });
  //dateKey
  $.ajax({
    url: publicRequestUrl + '/api/MongoDB/' + collection + '/saveTime',
    type: 'GET',
    success: function (evt) {
      var selectObj = $('#dateKey');
      selectObj.empty();
      $.each(evt, function(key, value){
        var t = value.saveTime;
        var stringTime = t.substr(0, 4) + '/' + t.substr(4,2) + '/' + t.substr(6,2) + '  '
          + t.substr(8,2) + ':' + t.substr(10,2);
        selectObj.append('<option value="' + collection + ',' +value.saveTime + '">' +
          stringTime +'</option>');
      });
      selectObj.selectpicker('refresh');
    }
  });
}

function previewData(){
  var publicRequestUrl = baseAddr + publicDataContextName
  var openData = $('#fusionOpenData').val();
  var geoKey = $('#geoKey').val();
  var key = $('#openKey').val();
  var valueKey = $('#valueKey').val();
  var day = $('#dateKey').val();
  var subFields = 'row.' + valueKey +',' + 'row.' + key;

  geoAttr = geoKey;
  openLabel = key;
  openValue = valueKey;

  if (openData != null && key != null && day != null && valueKey != null && valueKey != '' && key != '' && day != ''){
    var jsonQuery = {
      queryType : '=',
      field : 'saveTime',
      value : day.split(',')[1],
      unwind : 'row',
      sFields : subFields
    };
    $.ajax({
      url: publicRequestUrl + '/api/MongoDB/query/' + openData,
      data :jsonQuery,
      type: 'GET',
      success: function (evt) {
        var result = $('#dataPreView');
        result.empty();
        jsonStr = evt[0];
        var jsonHTML = JSON.stringify(evt, undefined, 1);
        jsonHTML = syntaxHighlight(jsonHTML);
        result.html(jsonHTML);
      }
    });
  }
}

function getJsonKey(_json, _array){
  for (key in _json){
    if (_json[key].constructor === Array){
      getJsonKey(_json[key][0], _array);
    }else if (_json[key].constructor === Object){
      getJsonKey(_json[key], _array);
    }else {
      _array.push(key);
    }
  }
  return 0;
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function dataView(){
  var value = $('#preset').val();
 // var colors = ['#0090ff', '#008080', '#4cff4c', '#99ff99', '#FFFF00', '#FFFF99', '#FF9900', '#FF0000'];
  var colors = ['#0000FF', '#00FF00', '#FFFF00', '#FF0000'];
  var range;
  if (value === 'PM25') {
//    range = [15, 30, 55, 80, 100, 120, 200];
    range = [15, 50, 100, 500];
  } else if (value === 'PM10') {
    range = [30, 80, 150, 600]
  } else if (value === 'CO') {
    //range = [1, 2, 5.5, 9, 10.5, 12, 15];
    range = [2.0, 9.0, 15.0, 50.0];
  } else if (value === 'NO2') {
    //range = [0.01, 0.02, 0.035, 0.05, 0.075, 0.1, 0.15];
    range = [0.03, 0.06, 0.2, 2];
  } else if (value === 'O3') {
    //range = [0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.3];
    range = [0.03, 0.08, 0.151, 0.6];
  } else if (value === 'SO2') {
    range = [0.02, 0.051, 0.151, 1];
  } else if (value === 'Wind') {
    range = [4.0, 5.0, 6.0, 7.0];
  } else if (value === 'Temperatures') {
    color = ['#000899', '#00eaff', '#0baa33', 'FFEE00'];
    range = [20.0, 25.0, 30.0, 40.0];
  }

  var obj = openGDSMobile.util.getOlLayer(map.getMapObj(), lyName);
  if (obj === false) {
    alert('Not visualization Geo data');
    return 0;
  }

    map.changeVectorStyle(lyName, {
      fillColor: colors,
      range: range,
      attrKey: geoAttr,
      labelKey: openLabel,
      valueKey: openValue,
      data: jsonStr.row
    });

}
function preset(){
  var colors = ['#0000FF', '#00FF00', '#FFFF00', '#FF0000'];
  var presetHTML = $('#rangeSpectrum');
  presetHTML.empty();
  if ($('#preset').val() === 'Temperatures') {
    color = ['#000899', '#00eaff', '#0baa33', 'FFEE00'];
    presetHTML.append(
      '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[0] + '">Below 20</div>' +
      '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[1] + '">Below 25</div>' +
      '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[2] + '">Below 30</div>' +
      '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[3] + '">Below 40</div>'
    );
    return 0;
  }
  presetHTML.append(
    '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[0] + '">Good</div>' +
    '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[1] + '">Normal</div>' +
    '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[2] + '">Bad</div>' +
    '<div style="color : #FFFFFF; float : left; width: 25%; height:100%; background:' + colors[3] + '">Very Bad</div>'
  );

}