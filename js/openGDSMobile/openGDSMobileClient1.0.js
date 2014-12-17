//var serverURL = "http://113.198.80.60/";
//var serverFolder = "OpenGDSMobileApplicationServer1.0/";
var serverURL = "http://113.198.80.60:8081/";
var serverFolder = "mobile/";
var geoServerURL = "http://113.198.80.9/";
var vWorldKey = "9E21E5EE-67D4-36B9-85BB-E153321EEE65";
var publicDatakey = "kCxEhXiTf1qmDBlQFOOmw+emcPSxQXn5V5/x8EthoHdbSojIdQvwX+HtWFyuJaIco0nUJtu12e/9acb7HeRRRA==";
var seoulAreaEnvkey = "6473565a72696e7438326262524174";
var seoulRoadEnvkey = "4b56506967696e7437317348694371";

Config = {};
Config.map = {};
Config.map.init = {
		center:[0,0],
		zoom: 10
};
Config.map.projection = ol.proj.get('EPSG:900913');
Config.map.viewOptions = {
	projection: Config.map.projection,
	center: Config.map.init.center,
	zoom: Config.map.init.zoom
};

Config.map.minScaleDenom = {
	map: 1000, // if topic.minscale is not set
	geolocation: 10000, // on location following
	search: 10000 // jump to search results
};

//limit min zoom to this scale on the initial geolocation update (null to disable)
Config.map.initialGeolocationMaxScale = null;

var styleCache = {};
var Map = {};
	Map.map = null;
	Map.addMap = {};
	Map.minResolution = null;
	Map.layers = {};

	Map.deviceOrientation = null;
	Map.windowOrientation = undefined;
	Map.geolocation = null;
/**
 * Create Base Map based on OL3
 * parameter : div-> Map div Name , mapStyle -> map style(new ol.source.*)
 */
Map.createBaseMap = function(div,mapStyle){
	if(Map.map==null){
		Map.layers.baselayer = new ol.layer.Tile({
								title: 'basemap',
								source: mapStyle
								});
		Map.map = new ol.Map({
			layers:[Map.layers.baselayer],
			target: div,
			view : new ol.View(Config.map.viewOptions)
		});
		Map.map.getView().on('change:rotation',function(){
			$.event.trigger({type:'maprotation',rotation:Map.map.getView().getRotation()});
		});
		Map.map.getView().on('change:resolution',function(){
			if(Map.map.getView().getResolution() < Map.minResolution){
				Map.map.getView().setResolution(Map.minResolution);
			}
		});
	}else{
		Map.map.removeLayer(Map.layers.baselayer);
		Map.map.addLayer(Map.layers.baselayer=new ol.layer.Tile({
			title:'basemap',
			source : mapStyle
		}));
	}
};

Map.adjustedHeading = function(heading) {
	if (Map.windowOrientation != undefined) {
		// include window orientation (0, 90, -90 or 180)
		heading -= Map.windowOrientation * Math.PI / 180.0;
	}
	return heading;
};

Map.setRotation = function(rotation) {
	Map.map.getView().setRotation(rotation);
};

Map.setWindowOrientation = function(orientation) {
	Map.windowOrientation = orientation;
	if (Map.deviceOrientation != null && Map.deviceOrientation.getTracking() && Map.deviceOrientation.getHeading() != undefined) {
		Map.setRotation(Map.adjustedHeading(-Map.deviceOrientation.getHeading()));
	}
};
//adjust max zoom
Map.clampToScale = function(scaleDenom) {
	var minRes = Map.scaleDenomToResolution(scaleDenom, true);
	if (Map.map.getView().getResolution() < minRes) {
		Map.map.getView().setResolution(minRes);
	}
};

Map.scaleDenomToResolution = function(scaleDenom, closest) {
	// resolution = scaleDenom / (metersPerUnit * dotsPerMeter)
	var res = scaleDenom / (Map.map.getView().getProjection().getMetersPerUnit() * (Config.map.dpi / 0.0254));
	if (closest) {
	  return Map.map.getView().constrainResolution(res);
	}
	else {
	  return res;
	}
};
/**
 * GeoLocation
 */
Map.centerOnLocation = function(){
	Map.geolocation = new ol.Geolocation({
		projection:	Map.map.getView().getProjection(),
		tracking : true
	});
};

var Gui = {};

Gui.initialLoad = true;
Gui.selectedLayer = null;
Gui.tracking = true;

Gui.updateLayout = function(){
	var footer = $("div[data-role='footer']:visible"),
	header = $("div[data-role='header']:visible"),
    content = $("div[data-role='content']:visible:visible"),
    viewHeight = $(window).height(),
    contentHeight = viewHeight - (footer.outerHeight()+header.outerHeight() );
	if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
	    contentHeight -= (content.outerHeight() - content.height() + 1);
	    content.height(contentHeight);
	}
    $("#map").width( $(window).width() );
    $("#map").height( contentHeight   );

};

//Default Projection : EPSG:900913
Gui.initViewer = function(){
	Gui.updateLayout();
	$(window).on('resize',function(){
		Gui.updateLayout();
	});
	$(window).on('orientationchange', function(e) {
	    Map.setWindowOrientation(window.orientation);
	});
	/**
	 * Vworld Projection
	 */
	var projection = new ol.proj.Projection({
		code: 'EPSG:900913',
		extent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		units : 'm'
	});
	ol.proj.addProjection(projection);
	/**
	 * parameter
	 */
	openGDSM.baseMap('map','osm');
	Map.centerOnLocation();
	/**
	 * Geolocation Event(Set Center)
	 **/
	Map.geolocation.once('change:position',function(){
		Map.map.getView().setCenter(Map.geolocation.getPosition());
	});
	/**
	 * Layers Event
	 **/
	$(Map.map.getViewport()).bind('tap',function(evt){
		var pixel = Map.map.getEventPixel(evt.originalEvent);
	//	Layer.displayFeatureInfo(pixel);
	});
	Gui.updateLayout();
};

$(document).ready(function(e){
	Gui.initViewer();
});

/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var openGDSM = {};
	openGDSM.wmsMapUI = {};
	openGDSM.wfsMap ={};
var date = {};
var cur_date = new Date();
(function(){
	openGDSM.init = function(){
		$(document).on("pageinit",function(){
			$.mobile.loader.prototype.options.text="loading";
			$.mobile.loader.prototype.options.textVisible=false;
			$.mobile.loader.prototype.options.theme="a";
			$.mobile.loader.prototype.options.html="";
		});

	};
	/**
	 * base Map Setting
	 * Parameter : divName -> Map div Name,     mapStyle -> osm , vworld
	 */
	openGDSM.baseMap = function(divName, mapStyle){
		var mapType=null;
		if(mapStyle =='osm'){
			mapType = new ol.source.OSM();
		}
		else if(mapStyle=='vworld'){
			mapType = openGDSM.vWorld.TMS();
		}
		//OpenLayers 3
		Map.createBaseMap(divName, mapType);
	};
	/**  // F65FC751-4918-3760-9218-318D5E3577E0   //60
	 * Vworld WMS API User Interface
	 * Parameter : divName -> UI div Name, apiKey->Vworld APIKey
	 */
	openGDSM.wmsMapUI.vworld = function(divName, apiKey){
		makeData = function(apiKey, chkName){
			var selectedData = "";
			var vworldChk = $("input[name='vworldWMS']:checkbox");
			vworldChk.each(function(i){
				if($(this).is(":checked")){
					selectedData+=$(this).attr("value");
					selectedData+=",";
				}
			});
			selectedData = selectedData.slice(0,-1);

			openGDSM.vWorld.wmsAPI(Map.map, apiKey, selectedData);
		};
		apiKey = vWorldKey;
		var rootDiv = $('#'+divName);
		var html = 'Select Max 5<br><fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
		var styles = ['LT_C_UQ111','LT_C_UQ112','LT_C_UQ113','LT_C_UQ114',
		              'LT_C_UQ121','LT_C_UQ122','LT_C_UQ123','LT_C_UQ124',
		              'LT_C_UQ125','LT_C_UQ126','LT_C_UQ127','LT_C_UQ128',
		              'LT_C_UQ129','LT_C_UQ130','LT_C_WKMBBSN','LT_C_TDWAREA','LT_L_FRSTCLIMB'];
		var stylesText = ['도시지역','관리지역','농립지역','자연환경보전지역','경관지구','미관지구',
		                  	  '고도지구','방화지구','방재지구','보존지구','시설보호지구','취락지구',
		                  	  '개발진흥지구','특정용도제한지구','수자원[대권역]','보행우선구역','등산로'];

		for(var i=0; i<styles.length; i++){
			html += '<input type="checkbox" name="vworldWMS" class="custom" '+
					' id="id-'+styles[i]+'" value="'+styles[i]+'" />'+
					'<label for="id-'+styles[i]+'">'+stylesText[i]+'</label>';
			if(i!=0 && (i+1)%2==0){
				html+='</fieldset>'+
					  '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
			}
		}
		html += '</fieldset>'+
		        '<a href="#" id=wmsButton data-role="button" '+
		        'onclick=makeData("'+apiKey+'","vworldWMS")>지도 추가</a>';
		rootDiv.html(html);
		rootDiv.trigger("create");
	};
	/**
	 * geoServer WFS value Setting
	 * parameter : url, workspace, layername, color, width
	 */
	//openGDSM.wfsMap.geoserver = function(url,workspace,layerName,color,width){
	openGDSM.wfsMap.geoserver = function(layerName){
		var url = geoServerURL,
			workspace = 'opengds',
			//layerName = 'Seoul_si',
			r = Math.floor(Math.random()*256),
			g = Math.floor(Math.random()*256),
			b = Math.floor(Math.random()*256),
			color ='rgba('+r+','+g+','+b+',0.7)',
			width = 1;
		openGDSMGeoserver.wfs(Map.map, url, workspace, layerName, color, width);
	};

	/**
	 * Pulbic OpenData User Interface
	 */
	openGDSM.PublicDataUI = {
			 visualTypeRadioBtn : function(rootDiv, mapSW){
				mapSW = (typeof(mapSW) !== 'undefined') ? mapSW : true;
				var html = '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
				var arr = ['map','chart','chartMap'];
				var arrText = ['맵','차트','맵&차트'];
				for(var i=0; i<arr.length; i++){
						html += '<input type="radio" name="visradio" class="custom" '+
								' id="id-'+arr[i]+'" value="'+arr[i]+'" ';//+\
						if(mapSW==false && arr[i]!='chart') html+='disabled ';
						if(i==0) html+= 'checked';
						html += ' onclick="openGDSM.PublicDataUI.mapSelect($(this))"/>'+
								'<label for="id-'+arr[i]+'">'+arrText[i]+'</label>';
				}
				html += '</fieldset>';		rootDiv.append(html);
				rootDiv.append('<div id="wfsMap"></div>');
			 },
			 inputDate : function(rootDiv){
				var html =  '<label for="dateValue">날짜 : </label>'+
							'<input type="date" id="dateValue"/>';
				rootDiv.append(html);
				this.dateChk = true;
			 },
			 inputTime : function(rootDiv){
					var html =  '<label for="timeValue">시간 : </label>'+
								 '<input type="time" id="timeValue">';
					rootDiv.append(html);
					this.timeChk = true;
				 },
			 inputValueSetting : function(){
				if(this.dateChk) $("#dateValue").attr('value',date.getYYYYMMDD("-"));
				if(this.timeChk) $("#timeValue").attr('value',date.getHour()+":00");
			 },
			 processBtn : function(rootDiv,obj,serviceName, provider){
				 console.log(obj);
				 provider = (typeof(provider) !== 'undefined') ? provider : "";
					var html = '<a href="#" data-role="button" data-provider="'+provider+'" data-serivce="'+serviceName+'" '+
					 			'onclick="openGDSM.'+obj+'.makeData($(this))">시각화</a>';
					rootDiv.append(html);
			 },
			 mapSelect : function(obj){
				 var mapSelect = $('#wfsMap');
				 if(mapSelect.is(':empty')){
					 if(obj.val()=='map' || obj.val()=='chartMap'){
						 var html = '<div data-role="fieldcontain">'+
						 			'<select name="geoServerMap" id="geoserverSelectBox">';
						 for(var i=0; i<openGDSMGeoserver.mapLayers.length; i++){
							 html += '<option value="'+openGDSMGeoserver.mapLayers[i]+'"';
							 if(i==0) html+=' selected';
							 html += '>'+openGDSMGeoserver.mapLayers[i]+'</option>';
						 }
						 html +='</select>';
						 mapSelect.append(html);
						 mapSelect.trigger("create");
					 }
				 }
				 //Only Chart
				 else{
					if(obj.val()=='chart'){
						mapSelect.empty();
					}
				 }
			 },
	};
	/**
	 * Seoul Pulbic OpenData Interface
	 */
	//TimeAverageAirQuality
	 openGDSM.seoulPublic = {
			 divName : '',
			 apiKey : '',
			 dateChk : false,
			 timeChk : false,
			 makeData : function(obj){
				var visType="", envType="";
				var visRadio = $("input[name='visradio']:radio");
				var envRadio = $("input[name='envradio']:radio");
				visRadio.each(function(i){
					if($(this).is(":checked")){
						visType=$(this).val();
					}
				});
				envRadio.each(function(i){
					if($(this).is(":checked")){
						envType=$(this).val();
					}
				});
				$('#'+this.divName).popup("close");
				openGDSM.seoulOpenData.env.dataLoad(
						obj.attr("data-serivce"),
						this.apiKey, visType, envType,
						$("select[name=geoServerMap]").val(),
						$("#dateValue").val(),
						$("#timeValue").val());
			 },
			 /// TimeAverageAirQuality Service...
			 areaEnv : function(divName, apiKey){
				$('#'+divName).empty();
				this.divName = divName;
				this.dateChk = true, this.timeChk = true;
				this.apiKey = seoulAreaEnvkey;
				var rootDiv = $('#'+divName);
				openGDSM.PublicDataUI.visualTypeRadioBtn(rootDiv);
				openGDSM.PublicDataUI.inputDate(rootDiv);
				openGDSM.PublicDataUI.inputTime(rootDiv);

				var html = '<label for="envValue">환경정보:</label>'+
						   '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
				var envType = ['pm10','pm25','so2','o3','no2','co'];
				var envTypeValue = ['PM10','PM25','SO2','O3','NO2','CO'];
				for(var i=0; i<envType.length; i++){
					html += '<input type="radio" name="envradio" class="custom" '+
					' id="id-'+envTypeValue[i]+'" value="'+envTypeValue[i]+'"/>'+
					'<label for="id-'+envTypeValue[i]+'">'+
					//envType[i]+
					'<img src="images/'+envType[i]+'.png" width=30>'+
					'</label>';
					if(i!=0 && (i+1)%3==0){
						html+='</fieldset>'+
							  '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
					}
				}
				html += '</fieldset>';
				rootDiv.append(html);
				openGDSM.PublicDataUI.processBtn(rootDiv,'seoulPublic', "TimeAverageAirQuality");
				rootDiv.trigger("create");
				openGDSM.PublicDataUI.inputValueSetting();
			 },
			 //RealtimeRoadsideStation Service
			 roadEnv : function(divName, apiKey){
					$('#'+divName).empty();
					this.divName = divName;
					this.dateChk = false, this.timeChk = false;
					this.apiKey = seoulRoadEnvkey;
				 	var rootDiv = $('#'+this.divName);
				 	openGDSM.PublicDataUI.visualTypeRadioBtn(rootDiv,false);

					var html = '<label for="envValue">환경정보:</label>'+
							   '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';

					var envType = ['pm10','pm25','so2','o3','no2','co'];
					var envTypeValue = ['PM10','PM25','SO2','O3','NO2','CO'];
					for(var i=0; i<envType.length; i++){
						html += '<input type="radio" name="envradio" class="custom" '+
						' id="id-'+envTypeValue[i]+'" value="'+envTypeValue[i]+'"/>'+
						'<label for="id-'+envTypeValue[i]+'">'+
						//envType[i]+
						'<img src="images/'+envType[i]+'.png" width=30>'+
						'</label>';
						if(i!=0 && (i+1)%3==0){
							html+='</fieldset>'+
								  '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
						}
					}
					html += '</fieldset>';
					rootDiv.append(html);
					openGDSM.PublicDataUI.processBtn(rootDiv,'seoulPublic', "RealtimeRoadsideStation");
					rootDiv.trigger("create");
					openGDSM.PublicDataUI.inputValueSetting();
			 }
	 };

	 openGDSM.PublicDataPortal = {
			 apiKey : '',
			 visualTypeRadioBtn : function(rootDiv, mapSW){
					mapSW = (typeof(mapSW) !== 'undefined') ? mapSW : true;
					var html = '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
					var arr = ['map','chart','chartMap'];
					var arrText = ['맵','차트','맵&차트'];
					for(var i=0; i<arr.length; i++){
							html += '<input type="radio" name="visradio" class="custom" '+
									' id="id-'+arr[i]+'" value="'+arr[i]+'" ';//+
							if(mapSW==false) html+='disabled ';
							if(i==0) html+= 'checked';
							html += ' onclick="openGDSM.PublicDataPortalUI.mapSelect($(this))"/>'+
									'<label for="id-'+arr[i]+'">'+arrText[i]+'</label>';
					}
					html += '</fieldset>';		rootDiv.append(html);
					rootDiv.append('<div id="wfsMap"></div>');
			},
			 makeData : function(obj){
				var visType="", envType="", areaType="";
				var visRadio = $("input[name='visradio']:radio");
				var envRadio = $("input[name='envradio']:radio");
				var areaRadio = $("input[name='arearadio']:radio");
				visRadio.each(function(i){
					if($(this).is(":checked")){
						visType=$(this).val();
					}
				});
				envRadio.each(function(i){
					if($(this).is(":checked")){
						envType=$(this).val();
					}
				});
				areaRadio.each(function(i){
					if($(this).is(":checked")){
						areaType=$(this).val();
					}
				});
				$('#'+this.divName).popup("close");
				openGDSM.publicOpenData.env.dataLoad(
						obj.attr("data-provider"),
						obj.attr("data-serivce"),
						this.apiKey, visType, envType, areaType,
						$("select[name=geoServerMap]").val()
						);
			 },
			 areaEnv : function(divName, apiKey){
				this.apiKey = encodeURIComponent(apiKey);
				$('#'+divName).empty();
				this.divName = divName;
			 	var rootDiv = $('#'+this.divName);
			 	openGDSM.PublicDataUI.visualTypeRadioBtn(rootDiv);

			 	var html = '<label for="areaValue">지역:</label>'+
				   '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
			 	var areaType=['서울','부산','대구','대전','광주','울산','인천','전남','전북','경남','경북','강원','경기','제주'] ;
			 	var areaValues=['서울','부산','대구','대전','광주','울산','인천','전남','전북','경남','경북','강원','경기','제주'] ;
			 	for(var i=0; i<areaType.length; i++){
			 		html += '<input type="radio" name="arearadio" class="custom" '+
			 				' id="id-'+areaType[i]+'" value="'+areaValues[i]+'"/>'+
			 				'<label for="id-'+areaType[i]+'">'+areaType[i]+'</label>';
			 		if(i!=0 && (i+1)%3==0){
			 				html+='</fieldset>'+
			 				'<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
			 		}
			 	}
			 	html += '</fieldset>';

			 	html += '<label for="envValue">환경정보:</label>'+
				   '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
			 	var envType = ['pm10','pm25','so2','o3','no2','co'];
			 	var envValues = ['pm10Value','so2Value','o3Value','no2Value','coValue'];
			 	for(var i=0; i<envType.length; i++){
			 		html += '<input type="radio" name="envradio" class="custom" '+
			 				' id="id-'+envType[i]+'" value="'+envValues[i]+'"/>'+
			 				'<label for="id-'+envType[i]+'">'+
							//envType[i]+
							'<img src="images/'+envType[i]+'.png" width=30>'+
			 				'</label>';
			 		if(i!=0 && (i+1)%3==0){
			 				html+='</fieldset>'+
			 				'<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
			 		}
			 	}
			 	html += '</fieldset>';
				rootDiv.append(html);

				openGDSM.PublicDataUI.processBtn(rootDiv,"PublicDataPortal","ArpltnInforInqireSvc", "airkorea");
			 	rootDiv.trigger("create");
			 }
	 };





	 //////////////////////////////////////////
	createkeyValueJsonString = function(data){
		var str = "{";
		for(var i in data){
			str= str + '"'+data[i].attr('data-key')+'":';
			str= str + '"'+data[i].attr('data-value');
			if((data.length-1)==i)	str +='"}';
			else						str +='",';
		}
		return JSON.parse(str);
	};//JSON {key:value}

/**
 * getDate Module About Public Date
 */
	date.getYear = function(){	return cur_date.getFullYear();	};
	date.getDate = function(){	return cur_date.getDate();		};
	date.getMonth= function(){	return cur_date.getMonth();		};
	date.getHour = function(){
		var hours;
		var minute = cur_date.getMinutes();
			if(minute < 30){
				if(cur_date.getHours()==0){
					hours = leadingZeros(cur_date.getHours()+23,2);
				}else	hours = leadingZeros(cur_date.getHours()-1,2);
			}else{
				hours = leadingZeros(cur_date.getHours(),2);
			}
		return hours;
	};// 30 minute cut line  (30 up) +1
	date.getMin = function(){	return cur_date.getMinutes();	};
	date.getYYYYMMDDHH = function(){
		var year = cur_date.getFullYear();
		var month = leadingZeros(cur_date.getMonth()+1,2);
		var date = leadingZeros(cur_date.getDate(),2);
		var minute = cur_date.getMinutes();
		var hours;
			if(minute < 30){
				if(cur_date.getHours()==0){
					date = leadingZeros(cur_date.getDate()-1,2);
					hours = 23;
				}else	hours = leadingZeros(cur_date.getHours()-1,2);
			}else{
				hours = leadingZeros(cur_date.getHours(),2);
			}
			minute = "00";
		return year+month+date+hours+minute;
	};
	date.getYYYYMMDD = function(plug){
		var year = cur_date.getFullYear();
		var month = leadingZeros(cur_date.getMonth()+1,2);
		var date = leadingZeros(cur_date.getDate(),2);
		if(plug==null)
			return year+month+date;
		else
			return year+plug+month+plug+date;
	};

	leadingZeros = function(n,digits){
		var zero = '';
		n = n.toString();
		if (n.length < digits) {
			for (var i = 0; i < digits - n.length; i++)
				zero += '0';
		}
	  return zero + n;
	};
})();

openGDSM.vWorld ={
		TMS:function(){
			return new ol.source.XYZ(({
				url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
			}));
		},
		wmsAPI : function(olMap, apiKey, mapStyles){
			var wmslayer = new ol.layer.Tile({
				source: new ol.source.TileWMS(({
					url: "http://map.vworld.kr/js/wms.do",
					params: {
						domain:'http://localhost',
	  					apiKey:apiKey,
	  					LAYERS:mapStyles,
	  					STYLES:mapStyles,
	  					FORMAT:'image/png',
	  					CRS:'EPSG:900913',
	  					EXCEPTIONS:'text/xml',
	  					TRANSPARENT:true
	  					}
	  			}))
			});
			olMap.addLayer(wmslayer);
		}
};
openGDSM.seoulOpenData = { };
var styleCache = {};

openGDSM.seoulOpenData.env = {
	key : "6473565a72696e7438326262524174",
	serviceName : '',
	envType : '',
	visType : '',
	mapLayer : '',
	dateValue : '',
	timeValue : '',
	colorRange : ["#4C4Cff","#9999FF","#4cff4c","#99ff99","#FFFF00","#FFFF99","#FF9900","#FF0000"],
	PM10Range : [15,30,55,80,100,120,200],
	PM25Range : [15,30,55,80,100,120,200],
	CORange : [1,2,5.5,9,10.5,12,15],
	NO2Range : [0.015,0.03,0.05,0.06,0.1045,0.15,0.2],
	SO2Range : [0.01,0.02,0.035,0.05,0.075,0.1,0.15],
	O3Range : [0.02,0.04,0.06,0.08,0.10,0.12,0.3],
	dataLoad : function(serviceName,apiKey, visType, envType, mapLayer, dateValue, timeValue){
		mapLayer = (typeof(mapLayer) !== 'undefined') ? mapLayer : "";
		dateValue = (typeof(dateValue) !== 'undefined') ? dateValue : "";
		timeValue = (typeof(timeValue) !== 'undefined') ? timeValue : "";
		this.serviceName = serviceName;
		this.envType = envType;
		this.visType = visType;
		this.mapLayer = mapLayer;
		this.dateValue = dateValue;
		this.timeValue = timeValue;
		var data = '{"serviceName":"'+serviceName+'",'+
		   			' "keyValue":"'+apiKey+'",'+
		   			'"dateValue":'+'"'+dateValue+'",'+
		   			'"timeValue":'+'"'+timeValue+'"}';
			data=JSON.parse(data);
		$.ajax({
			type:'POST',
			url:serverURL+serverFolder+'EnvironmentSeoulData.do',
			data: JSON.stringify(data),
			contentType : "application/json;charset=UTF-8",
			dataType : 'json',
			success:function(msg){
				if(visType=='chart')
					openGDSM.seoulOpenData.env.chartVisual(JSON.parse(msg.data));
				else if(visType=='map')
					openGDSM.seoulOpenData.env.mapVisual(JSON.parse(msg.data));
				else if(visType=='chartMap')
					openGDSM.seoulOpenData.env.chartMapVisual(JSON.parse(msg.data));
			},
			error:function(){
				console.log("err");
			}
		});
	},
	chartVisual : function(data){
		$('#dataSelect').popup("open");
		var envRange=[];
		var xyData=this.xydivision(data[this.serviceName], this.envType, 'MSRSTE_NM');
		if(this.envType=="PM10")
			envRange = this.PM10Range;
		else if(this.envType=="PM25")
			envRange = this.PM25Range;
		else if(this.envType=="CO")
			envRange = this.CORange;
		else if(this.envType=="NO2")
			envRange = this.NO2Range;
		else if(this.envType=="SO2")
			envRange = this.SO2Range;
		else if(this.envType=="O3")
			envRange = this.O3Range;
		openGDSM.d3.barchart('d3View',xyData,this.colorRange,envRange);
	},
	/**
	 * SeoupOpenData Environment Data OpenLayers Style
	 */
	mapVisual: function(data){
		var envRange=[];
		var envMap=null;
		var curMaps=null;
		var xyData=this.xydivision(data[this.serviceName], this.envType, 'MSRSTE_NM');

		if(this.envType=="PM10")
			envRange = this.PM10Range;
		else if(this.envType=="PM25")
			envRange = this.PM25Range;
		else if(this.envType=="CO")
			envRange = this.CORange;
		else if(this.envType=="NO2")
			envRange = this.NO2Range;
		else if(this.envType=="SO2")
			envRange = this.SO2Range;
		else if(this.envType=="O3")
			envRange = this.O3Range;
		//WFS addLayer
		openGDSMGeoserver.wfs(Map.map, serverURL,'opengds',this.mapLayer);

		curMaps = Map.map.getLayers().getArray();
		for(var i=0; i<curMaps.length; i++){
			if( curMaps[i].get('title') == this.mapLayer){
				envMap = curMaps[i];
			}
		}
		styleCache = {};
		envMap.setStyle(function(f,r){
			var text = r < 5000 ? f.get('SIG_KOR_NM') : '';
			if(!styleCache[text]){
				var color = '';
				for(var i=0; i<xyData[1].length; i++){
					if(text==xyData[1][i]){
						for(var j=0; j<envRange.length; j++){
							if( xyData[0][i] <= envRange[j] ){
								color = openGDSM.seoulOpenData.env.colorRange[j];
								break;
							}
						}
					}
				}
				styleCache[text] = [new ol.style.Style({
					fill : new ol.style.Fill({
						color : color
					}),
					stroke : new ol.style.Stroke({
						color : '#000000',
						width : 1
					}),
					text : new ol.style.Text({
			          font: '9px Calibri,sans-serif',
			          text: text,
			          fill: new ol.style.Fill({
			            color: '#000'
			          })
					})
				})];
			}
			return styleCache[text];
		});
		envMap.setOpacity(0.6);
		$('#interpolationMapImage').attr('src','http://113.198.80.60/html/aqm/resultImages/'+this.dateValue.split("-").join("")+this.timeValue.replace(":","")+this.envType+'_result.jpg');
		$('#interpolationMapImage').attr('height','250px');
		$('#interpolationMap').show();
	},
	chartMapVisual: function(data){
		$('#d3viewonMap').show();
		var envRange=[];
		var xyData=this.xydivision(data[this.serviceName], this.envType, 'MSRSTE_NM');
		if(this.envType=="PM10")
			envRange = this.PM10Range;
		else if(this.envType=="PM25")
			envRange = this.PM25Range;
		else if(this.envType=="CO")
			envRange = this.CORange;
		else if(this.envType=="NO2")
			envRange = this.NO2Range;
		else if(this.envType=="SO2")
			envRange = this.SO2Range;
		else if(this.envType=="O3")
			envRange = this.O3Range;
		openGDSM.d3.barchart('d3viewonMap_sub',xyData,this.colorRange,envRange);
		this.mapVisual(data);

	},
	/**
	 * SeoupOpenData Environment Data Division xData,yData
	 * parameter : JSON data
	 * return : 2 dim x axis and y axis   [0]: x Axis, [1] : y Axis
	 */
	xydivision: function(data, envType, yType){
		var xyAxis = new Array();
			xyAxis[0] = new Array();
			xyAxis[1] = new Array();
		var row = data.row;
		$.each(row, function(idx){
			xyAxis[0].push(row[idx][envType]);
			xyAxis[1].push(row[idx]["MSRSTE_NM"]);
		});
		return xyAxis;
	},
};

openGDSM.publicOpenData = {
		urls : {
			airkorea : 'http://openapi.airkorea.or.kr/openapi/service/rest/'
		}
};

openGDSM.publicOpenData.env = {
		visType :'',
		envType :'',
		areaType :'',
		mapLayer : '',
		colorRange : ["#4C4Cff","#9999FF","#4cff4c","#99ff99","#FFFF00","#FFFF99","#FF9900","#FF0000"],
		PM10Range : [15,30,55,80,100,120,200],
		CORange : [1,2,5.5,9,10.5,12,15],
		NO2Range : [0.015,0.03,0.05,0.06,0.1045,0.15,0.2],
		SO2Range : [0.01,0.02,0.035,0.05,0.075,0.1,0.15],
		O3Range : [0.02,0.04,0.06,0.08,0.10,0.12,0.3],
		dataLoad : function(provider,serviceName,apiKey,visType,envType,areaType,mapLayer){
			mapLayer = (typeof(mapLayer) !== 'undefined') ? mapLayer : "";
			//console.log(provider+' '+serviceName+' '+apiKey+' '+visType+' '+envType+' '+areaType+' '+mapLayer);
			this.visType = visType;
			this.envType = envType;
			this.areaType = areaType;
			this.mapLayer = mapLayer;
			var data = '{"serviceName":"'+serviceName+'",'+
			   			'"keyValue":"'+apiKey+'",'+
			   			'"areaType":"'+encodeURIComponent(areaType)+'",'+
			   			'"envType":"'+envType+'",'+
			   			'"provider":'+'"'+provider+'"}';
				data=JSON.parse(data);
		$.ajax({
			type:'POST',
			url:serverURL+serverFolder+'EnvironmentPublicData.do',
			data: JSON.stringify(data),
			contentType : "application/json;charset=UTF-8",
			dataType : 'json',
			success:function(msg){
				if(visType=='chart')
					openGDSM.publicOpenData.env.chartVisual(JSON.parse(msg.data));
				else if(visType=='map')
					openGDSM.publicOpenData.env.mapVisual(JSON.parse(msg.data));
				else if(visType=='chartMap')
					openGDSM.publicOpenData.env.chartMapVisual(JSON.parse(msg.data));

			},
			error:function(){
				console.log("err");
			}
		});
		},
		chartVisual : function(data){
			$('#dataSelect').popup("open");
			var envRange=[];
			var xyData = this.JSONtoArray(data,this.envType,'stationName');
			if(this.envType=="pm10Value")
				envRange = this.PM10Range;
			else if(this.envType=="coValue")
				envRange = this.CORange;
			else if(this.envType=="no2Value")
				envRange = this.NO2Range;
			else if(this.envType=="so2Value")
				envRange = this.SO2Range;
			else if(this.envType=="o3Value")
				envRange = this.O3Range;
			openGDSM.d3.barchart('d3View',xyData,this.colorRange,envRange);
		},
		mapVisual: function(data){
			var envRange=[];
			var envMap=null;
			var curMaps=null;
			var xyData=this.JSONtoArray(data, this.envType, 'stationName');
			if(this.envType=="pm10Value")
				envRange = this.PM10Range;
			else if(this.envType=="coValue")
				envRange = this.CORange;
			else if(this.envType=="no2Value")
				envRange = this.NO2Range;
			else if(this.envType=="so2Value")
				envRange = this.SO2Range;
			else if(this.envType=="o3Value")
				envRange = this.O3Range;
			//WFS addLayer
			openGDSMGeoserver.wfs(Map.map, serverURL,'opengds',this.mapLayer);

			curMaps = Map.map.getLayers().getArray();
			for(var i=0; i<curMaps.length; i++){
				if( curMaps[i].get('title') == this.mapLayer){
					envMap = curMaps[i];
				}
			}
			styleCache = {};
			envMap.setStyle(function(f,r){
				var text ;
				if(openGDSM.publicOpenData.env.mapLayer =='Seoul_si') text =r < 5000 ? f.get('SIG_KOR_NM') : '';
				else text =r < 5000 ? f.get('EMD_KOR_NM') : '';
				if(!styleCache[text]){
					var color = 'rgba(255,255,255,0.5)';
					for(var i=0; i<xyData[1].length; i++){
						if(text==xyData[1][i]){
							for(var j=0; j<envRange.length; j++){
								if( xyData[0][i] <= envRange[j] ){
									color = openGDSM.seoulOpenData.env.colorRange[j];
									break;
								}
							}
						}
					}
					styleCache[text] = [new ol.style.Style({
						fill : new ol.style.Fill({
							color : color
						}),
						stroke : new ol.style.Stroke({
							color : '#000000',
							width : 1
						}),
						text : new ol.style.Text({
				          font: '9px Calibri,sans-serif',
				          text: text,
				          fill: new ol.style.Fill({
				            color: '#000'
				          })
						})
					})];
				}
				return styleCache[text];
			});
			envMap.setOpacity(0.6);
		},
		//d3viewonMap
		chartMapVisual : function(data){
			$('#d3viewonMap').show();

			var envRange=[];
			var xyData = this.JSONtoArray(data,this.envType,'stationName');
			if(this.envType=="pm10Value")
				envRange = this.PM10Range;
			else if(this.envType=="coValue")
				envRange = this.CORange;
			else if(this.envType=="no2Value")
				envRange = this.NO2Range;
			else if(this.envType=="so2Value")
				envRange = this.SO2Range;
			else if(this.envType=="o3Value")
				envRange = this.O3Range;
			openGDSM.d3.barchart('d3viewonMap_sub',xyData,this.colorRange,envRange);
			openGDSM.publicOpenData.env.mapVisual(data);

		},
		JSONtoArray: function(JSONdata,xValue,yValue){
			var xyAxis = new Array();
				xyAxis[0] = new Array();
				xyAxis[1] = new Array();
			var row = JSONdata.row;
			$.each(row, function(idx){
				xyAxis[0].push(row[idx][xValue]);
				xyAxis[1].push(row[idx][yValue]);
			});
			return xyAxis;
		}
};

openGDSM.d3 = {};

/**
 * Create Bar Chart
 * parameter : div id, xyAxis(2 dim Array), color (1 dim Array), range(1 dim Array)
 */
openGDSM.d3.barchart = function(divId, xyData, color, range){
	var barHeight = 17;
	var minusWidth=0;
	$('#'+divId).empty();
	var div = d3.select('#'+divId).append("svg")
				.attr("id","barChart")
				.attr("width",$('#'+divId).width())
				.attr("height",barHeight*xyData[0].length);
//	console.log(div);	console.log(xyData[0]);	console.log(color);	console.log(range);
	var maxData = d3.max(xyData[0]);
	var x = d3.scale.linear()
			.domain([0, maxData])
			.range([0,$('#'+divId).width()]);
	div.selectAll('rect')
				.data(xyData[0])
				.enter()
					.append('rect')
					.attr('x',0)
					.attr('y',function(d,i){
						return i*barHeight;
					})
					.attr('width',function(d){
						return x(d)-minusWidth;
					})
					.attr('height',barHeight-2)
					.attr('fill',function(d,i){
						for(var z=0; z<range.length; z++)
							if(xyData[0][i] <=range[z]){
								return color[z];
							}
						return color[color.length];
					});
	div.selectAll('g')
				.data(xyData[1])
				.enter()
				.append('text')
					.attr('x',0)
					.attr('y',function(d,i){
						return i*barHeight+barHeight-5;
					})
					//.attr('dy','.15em')
					.attr('font-weight','bold')
					.attr('font-size','0.9em')
					.text(function(d){
						return d;
					});
	div.selectAll('g')
					.data(xyData[0])
					.enter()
					.append('text')
						.attr('x',function(d){
							return x(d)-minusWidth;
						})
						.attr('y',function(d,i){
							return i*barHeight+12;
						})
						.attr('dy','.15em')
						.attr('fill','black')
						.attr('font-size','0.8em')
						.attr('font-weight','bold')
						.text(function(d){
							return d;
						});
};


/**
*
*
*/
openGDSM.d3.vectorMap ={
	readVector : function(features){

		var canvasFunction = function(extent,resolution,pixelRatio,size, projection){
			var canvasWidth = size[0];
			var canvasHeight = size[1];

			var canvas = d3.select(document.createElement('canvas'));
			canvas.attr('width',canvasWidth).attr('height',canvasHeight);

			var context = canvas.node().getContext('2d');

			var d3Projection = d3.geo.mercator().scale(1).translate([0,0]);
			var d3Path = d3.geo.path().projection(d3Projection);

			var pixelBounds = d3Path.bounds(features);
			var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
			var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

			var geoBounds = d3.geo.bounds(features);
			var geoBoundsLeftBottom = ol.proj.transform(geoBounds[0], 'EPSG:4326',projection);
		    var geoBoundsRightTop = ol.proj.transform(geoBounds[1], 'EPSG:4326', projection);
		    var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
		    if (geoBoundsWidth < 0) {
		        geoBoundsWidth += ol.extent.getWidth(projection.getExtent());
		    }
		    var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

		    var widthResolution = geoBoundsWidth / pixelBoundsWidth;
		    var heightResolution = geoBoundsHeight / pixelBoundsHeight;
		    var r = Math.max(widthResolution, heightResolution);
		    var scale = r / (resolution / pixelRatio);

		    var center = ol.proj.transform(ol.extent.getCenter(extent), projection, 'EPSG:4326');


		    d3Projection.scale(scale).center(center).translate([canvasWidth / 2, canvasHeight / 2]);
		    d3Path = d3Path.projection(d3Projection).context(context);
		    d3Path(features);
		    context.stroke();

		    return canvas[0][0];
		};
	}


};

/**
 * Geoserver Setting // web.xml
 * <context-param>
 * <param-name>ENABLE_JSONP</param-name>
 * <param-value>true</param-value>
 * </context-param>
 */
var openGDSMGeoserver = {
		mapLayers : []
};

openGDSMGeoserver.getLayers = function(){
		 data = {ws:'opengds'};
		 if(this.mapLayers){
			 $.ajax({
					type:'POST',
					url:serverURL+serverFolder+'getLayerNames.do',
					data: JSON.stringify(data),
					contentType : "application/json;charset=UTF-8",
					dataType : 'json',
					success:function(msg){
						openGDSMGeoserver.mapLayers = msg.data;
					},
					error:function(){
						console.log("err");
					}
			});
		 }
};
openGDSMGeoserver.wfs = function(olmap,url,workspace,layername,color,width,epsg){
	color = (typeof(color) !== 'undefined') ? color : "rgba(255,255,255,0.5)";
	width = (typeof(width) !== 'undefined') ? width : "1";
	epsg = (typeof(espg) !== 'undefined') ? epsg : "EPSG:900913";
	vectorSource = new ol.source.ServerVector({
				format: new ol.format.GeoJSON(),
				loader: function(extent, resolution, projection){
					var urls = url+'geoserver/wfs?service=WFS&' +
					'version=1.1.0&request=GetFeature' +
					'&typeNames='+workspace+':'+layername+
					'&outputFormat=text/javascript&format_options=callback:loadFeatures' +
					'&srsname='+epsg+'&bbox=' + extent.join(',') + ','+epsg;
					$.ajax({
						url : urls,
						dataType: 'jsonp'
					});
				},
				strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
					maxZoom: 19
				})),
				projection: epsg
			});
			loadFeatures = function(response){
				vectorSource.addFeatures(vectorSource.readFeatures(response));
			};
	var styles = [
	      	    new ol.style.Style({
	      		  fill: new ol.style.Fill({
	      		    color: color,
	      		  }),
	      		  stroke: new ol.style.Stroke({
	      		    color: '#000000',
	      		    width: 1
	      		  })
	      		})];
	var curLayers = olmap.getLayers().getArray();
	for(var i=0; i<curLayers.length; i++){
		if( curLayers[i].get('title') == layername){
			olmap.removeLayer(curLayers[i]);
		}
	}
	var vectorTemp = new ol.layer.Vector({
	 	title:layername,
	   	source: vectorSource,
	   	style: styles
	  });
	olmap.addLayer(vectorTemp);
};



/*

openGDSMGeoserver.displayFeatureInfo = function(pixel){
	var feature = Map.map.forEachFeatureAtPixel(pixel, function(feature, layer){
		return feature;
	});

	if(feature){
		console.log(feature.get('EMD_KOR_NM'));
	}
	else{

	}
};
*/
