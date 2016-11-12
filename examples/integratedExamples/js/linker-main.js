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
    if (curShowMenu === id) {
      container.removeClass('menu-show');
      container.addClass('menu-hide');
      curShowMenu = null;
    } else {
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
    if (value === 'korSeoulMap'){
      map.changeBgMap(value, '51b32cf8444d4b6592a290bc64a88dc8');
    } else {
      map.changeBgMap(value);
    }
  });
  
  
  
});

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
        $(viewContent).append('<button type="button" class="list-group-item list-group-item-action" data-val="' + objs[i] + '">' +
            objs[i] +
          '</button>');
      }
    },
    error : function(err){
      console.error(err);
    }
  });
}

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
        var name = res[i].name;
        var comment = res[i].comment;
        var provider = res[i].provider;
        $(viewContent).append('<a href="#" class="list-group-item list-group-item-action" data-val="' + name + '">' +
            '<span style="font-size:1.7rem; font-weight:bold;">' + name + '</span>' +
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
function loadingFusionData(){
  // select box....로 데이터 선택..
  // json 데이터 불러와 동적으로 데이터... 선택할 수 있는 
  loadingGeoServerData(function(data){
    console.log(data);
    
    
  });
  loadingOpenData(function(data){
    console.log(data);
  });

}

function enToko(name){

}
function idToen(name){

}