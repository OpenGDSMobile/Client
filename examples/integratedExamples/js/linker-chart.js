/**
 * Created by intruder on 16. 11. 17.
 */
var publicRequestUrl = baseAddr + publicDataContextName
var collection = null;
$(function(){

  $('#collectStartTime').on('changed.bs.select', endTimeEnable);
  $('#collectEndTime').on('changed.bs.select', keyEnable);
  $('#visStart').click(visStartFunc);
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
  $('#collectEndTime').empty().attr('disabled', true).selectpicker('refresh');
  $('#collectDataKey').empty().attr('disabled', true).selectpicker('refresh');
  $('#collectSearchKey').empty().attr('disabled', true).selectpicker('hide');
  $('#collectSearchValue').empty().attr('disabled', true).selectpicker('hide');
  $('#collectKey').empty().empty().attr('disabled', true).selectpicker('refresh');
  $('#collectValue').empty().empty().attr('disabled', true).selectpicker('refresh');
  $('#chartVis').empty();

  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/' + collection + '/saveTime',
    type  : 'GET',
    success : function (evt){
      var selectObj = $('#collectStartTime');
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

  $.ajax({
    url : publicRequestUrl + '/api/MongoDB/selectOne/' + collection,
    type : 'GET',
    success : function (evt){
      var selectObj = $('#collectDataKey');
      var searchKey = $('#collectSearchKey');

      for(key in evt) {
        selectObj.append('<option value="' + key + '">' + key + '</option>');
        searchKey.append('<option value="' + key + '">' + key + '</option>');
      }
      selectObj.attr('disabled', false);
      selectObj.selectpicker('refresh');
      $('#collectDataKey').off('changed.bs.select');
      $('#collectDataKey').on('changed.bs.select', function () {
        var selectedVal = $(this).find("option:selected").val();
        if (selectedVal == ''){
          return 0;
        }


        var selectObj1 = $('#collectValue');
        var resultTag = $('#jsonResult');
        var obj = evt[selectedVal][0];
        selectObj1.empty();
        resultTag.empty();
        if (obj == null){
          return 0;
        }
        if (typeof(obj) === 'undefined'){
          humane.log('Not Visualization Key',{
            addnCls : 'humane-libnotify-error'
          });
          return -1;
        }

        for(key in obj) {
          selectObj1.append('<option value="' + key + '">' + key + '</option>');
          searchKey.append('<option value="' + key + '">' + key + '</option>');
        }

        var timeArray = $('#collectEndTime').find('option:selected').val().split(',');
        if (timeArray[1] == timeArray[2]){
          var selectObj = $('#collectKey');
          selectObj.empty();
          for(key in obj) {
            selectObj.append('<option value="' + key + '">' + key + '</option>');
          }
          selectObj.attr('disabled', false);
          selectObj.selectpicker('refresh');
        }

        searchKey.on('changed.bs.select', searchKeyEvt);

        selectObj1.attr('disabled', false);
        selectObj1.selectpicker('refresh');
        searchKey.selectpicker('refresh');
/*
        var JsonStr = JSON.stringify(obj, undefined, 4);
        var resultStr = syntaxHighlight(JsonStr);
        resultTag.html(resultStr + '<br> ...');
*/
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
    searchKey.selectpicker('hide');
    searchValue.selectpicker('hide');

    chartLabel.attr('disabled', true);
    chartLabel.selectpicker('deselectAll');
    chartLabel.selectpicker('refresh');

    chartValue.attr('disabled',true);
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