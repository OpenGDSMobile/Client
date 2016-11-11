/**
 * Created by intruder on 2016-11-11.
 */

$(function(){
  $(".menu-event").click(function(){
    var clickMenuDOM = $(this)[0];
    var id = $(clickMenuDOM).attr('id');
    console.log(id);
    if (id === 'vectorMapVis') {
      loadingGeoServerData();
    } else if (id === 'openDataVis') {
      loadingOpenData()
    } else if (id === 'fusionVis') {

    } else if (id === 'zoomIn') {
      map.zoomIn();
    } else if (id === 'zoomOut') {
      map.zoomOut();
    } else if (id === 'layerManager') {

    }
  });
});

function loadingGeoServerData(){
  var requestAddr = baseAddr + publicDataContextName;
  $.ajax({
    url : requestAddr + '/api/GeoServer/' + geoServerWS,
    dataType : 'json',
    success : function (res){
      console.log(res);
    },
    error : function(err){
      console.error(err);
    }

  });
}

function loadingOpenData(){
  var requestAddr = baseAddr + publicDataContextName;

  $.ajax({
    url : requestAddr + '/api/Collected',
    type : 'get',
    success : function(res){
      console.log(res);
    },
    error : function(err){
      console.error(err);
    }

  })
}