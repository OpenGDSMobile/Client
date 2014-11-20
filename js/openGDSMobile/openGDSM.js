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
		apiKey = "9E21E5EE-67D4-36B9-85BB-E153321EEE65";
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
		var url = "http://113.198.80.60/",
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
				this.apiKey = '6473565a72696e7438326262524174'; 
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
					this.apiKey = '4b56506967696e7437317348694371';
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