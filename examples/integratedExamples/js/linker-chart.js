/**
 * Created by intruder on 16. 11. 17.
 */
var publicRequestUrl = baseAddr + publicDataContextName
var collection = null;
$(function(){

  $('#collectStartTime').on('changed.bs.select', endTimeEnable);
  $('#collectEndTime').on('changed.bs.select', keyEnable);
  $('#visStart').click(visStartFunc);
  $('#GeoVisStart').click(geoVisStartFunc);
});
$(document).on('click', '.openData-btn', function(evt){
  $('#settingPanel').css('height', '100%');
  collection = $(this).data('val');
  var panel = $('#openDataPanel');
  if (!panel.hasClass('menu-show')){
    panel.removeClass('menu-hide');
    panel.addClass('menu-show');
  } else {
    //panel.empty();
  }

  var selectObj;
  var dataKey, key2, key3;
  if ($(this).data('type') === 'GeoData'){
    $('#settingPanelGeoData').css('display', "block");
    $('#settingPanel').css('display', "none");
    selectObj = $('#collectTime');
    dataKey = $('#geoCollectDataKey');

    $('#collectTime').empty().selectpicker('refresh');
    $('#lat').empty().selectpicker('refresh');
    $('#lon').empty().selectpicker('refresh');
  } else {
    $('#settingPanelGeoData').css('display', "none");
    $('#settingPanel').css('display', "block");
    selectObj = $('#collectStartTime');
    dataKey = $('#collectDataKey');

    $('#collectStartTime').empty().attr('disabled', true).selectpicker('refresh');
    $('#collectEndTime').empty().attr('disabled', true).selectpicker('refresh');
    $('#collectDataKey').empty().attr('disabled', true).selectpicker('refresh');
    $('#collectSearchKey').empty().attr('disabled', true).selectpicker('hide');
    $('#collectSearchValue').empty().attr('disabled', true).selectpicker('hide');
    $('#collectKey').empty().empty().attr('disabled', true).selectpicker('refresh');
    $('#collectValue').empty().empty().attr('disabled', true).selectpicker('refresh');
    $('#chartVis').empty();
  }
  /**
   * 저장 시간 시각화
   */
  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/' + collection + '/saveTime',
    type  : 'GET',
    success : function (evt){
      //var selectObj = $('#collectStartTime');
      selectObj.empty();
      $.each(evt, function(key, value){
        var t = value.saveTime;
        var stringTime = t.substr(0, 4) + '/' + t.substr(4,2) + '/' + t.substr(6,2) + '  '
          + t.substr(8,2) + ':' + t.substr(10,2);
        selectObj.append('<option value="' + collection + ',' +value.saveTime + '">' +
          stringTime +'</option>');
      });
      selectObj.attr('disabled', false);
      selectObj.selectpicker('refresh');
    },
    error : function(evt){
      console.log(evt);
    }
  });
  var type = $(this).data('type');
  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/selectOne/' + collection,
    type : 'GET',
    success : function (evt){
      var searchKeySelect = null;
      var keySelect, valueSelect;

      if (type === 'GeoData'){
        keySelect = $('#lat');
        valueSelect = $('#long');
      } else {
        keySelect = $('#collectKey');
        valueSelect = $('#collectValue');

        searchKeySelect = $('#collectSearchKey');
        searchKeySelect.empty();
      }
      keySelect.empty();
      valueSelect.empty();

      for(key in evt) {
        dataKey.append('<option value="' + key + '">' + key + '</option>');
        if (searchKeySelect !=null){
          searchKeySelect.append('<option value="' + key + '">' + key + '</option>');
        }
      }

      dataKey.attr('disabled', false);
      dataKey.selectpicker('refresh');
      dataKey.off('changed.bs.select');
      dataKey.on('changed.bs.select', function () {
        var selectedVal = $(this).find("option:selected").val();
        if (selectedVal == ''){
          return 0;
        }
        var obj = evt[selectedVal][0];
        if (obj == null){
          return 0;
        }
        keySelect.empty();
        valueSelect.empty();
        for(key in obj) {
          if (searchKeySelect !=null){
            searchKeySelect.append('<option value="' + key + '">' + key + '</option>');
          }
          keySelect.append('<option value="' + key + '">' + key + '</option>');
          valueSelect.append('<option value="' + key + '">' + key + '</option>');
        }

        var timeArray = $('#collectEndTime').find('option:selected').val().split(',');
        if (timeArray[1] != timeArray[2]){
          searchKeySelect.attr('disabled', false);
          searchKeySelect.selectpicker('refresh');
          searchKeySelect.on('changed.bs.select', searchKeyEvt);
        } else {
          keySelect.attr('disabled', false);
          keySelect.selectpicker('refresh');
        }
        valueSelect.attr('disabled', false);
        valueSelect.selectpicker('refresh');
      });

    },
    error: function(evt){
      console.log(evt);
    }
  });

});



function endTimeEnable(){
  $('#collectEndTime').empty();
  $('#chartVis').empty();
  var selectedVal = $(this).find("option:selected").val().split(',');
  var jsonData = {
    queryType : '>=',
    field : 'saveTime',
    value : selectedVal[1],
    sFields : 'saveTime'
  };
  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/query/' + selectedVal[0],
    data : jsonData,
    type : 'GET',
    success : function (evt){
      var selectObj = $('#collectEndTime');
      selectObj.empty();
      $.each(evt, function(key, value){
        var t = value.saveTime;
        var stringTime = t.substr(0, 4) + '/' + t.substr(4,2) + '/' + t.substr(6,2) + '  '
          + t.substr(8,2) + ':' + t.substr(10,2);
        selectObj.append('<option value="' + selectedVal[0] + ',' + selectedVal[1] + ',' +value.saveTime + '">' +
          stringTime +'</option>');
      });
      selectObj.attr('disabled', false);
      selectObj.selectpicker('refresh');
    },
    error : function(evt){
      humane.log('Error Loading Collected Public Data. Please, confirm database connect.',{
        addnCls : 'humane-libnotify-error'
      });
      console.log(evt);
    }
  });
}

function keyEnable(){
  var startVal = $(this).find('option:selected').val().split(',')[1];
  var endVal = $(this).find('option:selected').val().split(',')[2];
  var dataKey =$('#collectDataKey');
  var searchKey = $('#collectSearchKey');
  var searchValue = $('#collectSearchValue');
  var chartLabel = $('#collectKey');
  var chartValue = $('#collectValue');

  if (startVal == endVal){
    searchKey.selectpicker('deselectAll');
    searchKey.selectpicker('refresh');
    searchValue.empty();
    searchValue.attr('disabled', true);
    searchValue.selectpicker('refresh');

    searchKey.selectpicker('hide');
    searchValue.selectpicker('hide');

    chartLabel.attr('disabled', false);
    chartLabel.selectpicker('deselectAll');
    chartLabel.selectpicker('refresh');

    chartValue.attr('disabled',false);
    chartValue.selectpicker('deselectAll');
    chartValue.selectpicker('refresh');

    dataKey.selectpicker('deselectAll');
    dataKey.selectpicker('refresh');


    return 0;
  }
  searchKey.selectpicker('show');
  searchValue.selectpicker('show');

  chartLabel.attr('disabled', false);
  chartLabel.append('<option value="saveTime">saveTime</option>');
  chartLabel.selectpicker('refresh');
  chartLabel.selectpicker('val', 'saveTime');
  chartLabel.attr('disabled', true);
  chartLabel.selectpicker('refresh');
}

function searchKeyEvt(){
  var name = collection;
  var dataKey = $('#collectDataKey').find("option:selected").val();
  var keyValue = $(this).find("option:selected").val();
  var jsonData = {
    name: name,
    key : dataKey + '.' + keyValue
  };
  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/getValues',
    type : 'GET',
    data : jsonData,
    success: function(evt){
      var searchValue = $('#collectSearchValue');
      searchValue.empty();
      $.each(evt, function(index, value){
        searchValue.append('<option value="' + value + '">' + value +'</option>');
      });
      searchValue.attr('disabled', false);
      searchValue.selectpicker('refresh');
    },
    error : function (evt){
      console.log(evt);
    }

  });
};


function visStartFunc(){
    $('#settingPanel').css('height', '30%');
    var name = collection;
    var startTime = $('#collectStartTime').find('option:selected').val().split(',')[1];
    var endTime = $('#collectEndTime').find('option:selected').val().split(',')[2];
    var dataKey = $('#collectDataKey').find('option:selected').val();
    var chartKey = $('#collectKey').find('option:selected').val();
    var chartValue = $('#collectValue').find('option:selected').val();
    var chartType = $('#chartType').find('option:selected').val();
    if (name == '' || startTime =='' || endTime =='' || dataKey =='' || chartKey=='' || chartValue =='' || chartType ==''){
      humane.log('Error visualization processing. Because you did not enter value(s).',{
        addnCls : 'humane-libnotify-error'
      });
      return -1;
    }
    var searchWhere = startTime;
    var queryType = '=';
    var searchField = 'saveTime';
    var unwind = null;
    var sFields = dataKey + '.' + chartKey + ',' + dataKey + '.'  + chartValue;

    if (startTime != endTime) {
      searchWhere = searchWhere + ',' + endTime;
      searchWhere = searchWhere + ',' + $('#collectSearchValue').find('option:selected').val();
      queryType ='>=,<=,=';
      searchField = searchField + ',saveTime,' + dataKey + '.' + $('#collectSearchKey').find('option:selected').val();
      unwind = dataKey;
      sFields = 'saveTime,' + dataKey + '.' + chartValue
      chartKey = 'saveTime';
    }

    var jsonData = {
      name: name,
      unwind : unwind,
      queryType : queryType,
      field : searchField,
      value : searchWhere,
      sFields : sFields
    }
    $.ajax({
      url : publicRequestUrl + '/api/MongoDB/query/' + name,
      data : jsonData,
      success : function(evt){
        $('#chartVis').empty();

        var json = JSON.stringify(evt[0]);
        var chart = new openGDSMobile.ChartVis(json, {
          rootKey : dataKey,
          labelKey : chartKey,
          valueKey : chartValue
        });
        console.log(chartKey + ' ' + chartValue);
        if (chartType =='vBar') {
          chart.vBarChart('chartVis');
        } else if(chartType =='hBar'){
          chart.hBarChart('chartVis');
        } else if(chartType =='line'){
          chart.lineChart('chartVis');
        } else if(chartType =='area'){
          chart.areaChart('chartVis');
        }
      },
      error : function(evt){
        console.log(evt);
      }
    });
}

function geoVisStartFunc(){
  var name = collection;
  var collectionTime = $('#collectTime').find('option:selected').val().split(',')[1];
  var collectionDataKey = $('#geoCollectDataKey').find('option:selected').val();
  var lat = $('#lat').find('option:selected').val();
  var lon = $('#long').find('option:selected').val();
  var dataType = $('#dataType').find('option:selected').val();
  var coordType = $('#coordType').find('option:selected').val();


  var searchWhere = collectionTime;
  var queryType = '=';
  var searchField = 'saveTime';
  var unwind = null;
  var sFields = collectionDataKey + '.' + lat + ',' + collectionDataKey + '.'  + lon;

  var jsonData = {
    name: name,
    unwind : unwind,
    queryType : queryType,
    field : searchField,
    value : searchWhere,
    sFields : sFields
  }
  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/query/' + name,
    data : jsonData,
    success : function(evt){
      var data = evt[0][collectionDataKey];
      console.log(data);
      for (var key in data) {
        for (var subKey in data[key]){
          data[key][subKey] = Number(data[key][subKey]);
        }
      }
      var geoJsonData = GeoJSON.parse(data, {Point: [lat, lon]});

      map.addGeoJSONLayer(geoJsonData, dataType, collectionTime, {
        dataProj : coordType
      });
      mapManager.addItem(name + collectionTime);

      $('#openDataPanel').addClass('menu-hide').removeClass('menu-show');

    },
    error : function(evt){
      console.log(evt);
    }
  });

}