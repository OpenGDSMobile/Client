/**
 * Created by intruder on 16. 11. 17.
 */
var geoAttr = '';
var openAttr = '';



$(function(){


});
$(document).on('changed.bs.select', '#fusionGeoData', fusionVisGeoData);
$(document).on('changed.bs.select', '#fusionOpenData', fusionVisOpenData);

function fusionVisGeoData(evt){
  var selectObj = $(this).val();
  var lyName = 'fusion-Geospatial';
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
  $.ajax({
    url: publicRequestUrl + '/api/MongoDB/selectOne/' + collection,
    type: 'GET',
    success: function (evt) {
      var keyList = [];
      openGDSMobile.util.getJsonKey(evt, keyList);
      $('#openKey').empty();
      for (var i=0; i<keyList.length; i++) {
        $('#openKey').append('<option value="' + keyList[i] + '">' + keyList[i] + '</option>');
      }
      $('#openKey').selectpicker('refresh');
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
//content
//fusionGeoData
//fusionOpenData