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
	/**  // F65FC751-4918-3760-9218-318D5E3577E0   //60
	 * Vworld WMS API User Interface 
	 * Parameter : divName -> UI div Name, apiKey->Vworld APIKey
	 **/
	openGDSM.wmsMapUI.vworld = function(divName, apiKey, domain, olMap){
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
			openGDSM.vWorld.wmsAPI(olMap, apiKey, domain, selectedData);
		}; 
		//apiKey = vWorldKey;

		var rootDiv = $('#'+divName);
		var html = 'Select Max 5<br><fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        var styles = [
        'LP_PA_CBND_BUBUN,LP_PA_CBND_BONBUN',
        'LT_C_UQ111','LT_C_UQ112','LT_C_UQ113','LT_C_UQ114',
        'LT_C_UQ121','LT_C_UQ122','LT_C_UQ123','LT_C_UQ124','LT_C_UQ125',
        'LT_C_UQ126','LT_C_UQ127','LT_C_UQ128','LT_C_UQ129','LT_C_UQ130',
        'LT_C_UQ141','LT_C_UQ162','LT_C_UD801',
        'LT_L_MOCTLINK','LT_P_MOCTNODE',
        'LT_C_LHZONE','LT_C_LHBLPN',
        'LT_P_MGPRTFA','LT_P_MGPRTFB','LT_P_MGPRTFC','LT_P_MGPRTFD',
        'LT_L_SPRD','LT_C_SPBD',
        'LT_C_ADSIDO','LT_C_ADSIGG','LT_C_ADEMD','LT_C_ADRI',
        'LT_C_TDWAREA',
        'LT_C_DAMDAN','LT_C_DAMYOD','LT_C_DAMYOJ','LT_C_DAMYUCH',
        'LT_C_RIRSV','LT_P_RIFCT',
        'LT_P_UTISCCTV','LT_C_USFSFFB',
        'LT_L_FRSTCLIMB','LT_P_CLIMBALL','LT_L_TRKROAD','LT_P_TRKROAD',
        'LT_C_WKMBBSN','LT_C_WKMMBSN','LT_C_WKMSBSN','LT_C_WKMSTRM',
        'LT_C_ASITSOILDRA','LT_C_ASITDEEPSOIL','LT_C_ASITSOILDEP','LT_C_ASITSURSTON',
        'LT_L_AISROUTEU','LT_L_AISPATH','LT_C_AISALTC','LT_C_AISRFLC','LT_C_AISACMC','LT_C_AISCTRC',
        'LT_C_AISMOAC','LT_C_AISADZC','LT_C_AISPRHC','LT_C_AISFIRC','LT_C_AISRESC','LT_C_AISDNGC',
        'LT_C_AISTMAC','LT_C_AISCATC','LT_P_AISBLDG40F','LT_L_AISSEARCHL,LT_P_AISSEARCHP',
        'LT_L_AISVFRPATH,LT_P_AISVFRPATH','LT_P_AISVFRPT,LT_P_AISVFRPT_SW,LT_P_AISVFRPT_SN',
        'LT_L_AISCORRID_YS,LT_L_AISCORRID_GJ,LT_P_AISCORRID_YS,LT_P_AISCORRID_GJ','LT_P_AISHCSTRIP'];
        var stylesText = [
        '지적도',
        '도시지역','관리지역','농립지역','자연환경보전지역',
        '경관지구','미관지구','고도지구','방화지구','방재지구',
        '보존지구','시설보호지구','취락지구','개발진흥지구','특정용도제한지구',
        '국토계획구역','도시자연공원구역','개발제한구역',
        '교통링크','교통노드',
        '사업지구경계도','토지이용계획도',
        '아동안전지킴이집','노인복지시설','아동복지시설','기타보호시설',
        '새주소도로','새주소건물',
        '광역시도','시군구','읍면동','리',
        '보행우선구역',
        '단지경계','단지용도지역','단지시설용지','단지유치업종',
        '저수지','수리시설',
        '교통CCTV','소방서관할구역',
        '등산로','등산로시설','둘레길링크','산책로분기점',
        '대권역','중권역','표준권역','하천망',
        '배수등급','심토토성','유효토심','자갈함량',
        '제한고도','항공로','경계구역','공중급유구역','공중전투기동훈련장','관제권',
        '군작전구역','방공식별구역','비행금지구역','비행정보구역','비행제한구역','위험구역',
        '접근관제구역','훈련구역','건물군(40층이상)','수색비행장비행구역',
        '시계비행로','시계비행보고지점',
        '한강회랑','헬기장'
        ];

/*
		var styles = ['LT_C_UQ111','LT_C_UQ112','LT_C_UQ113','LT_C_UQ114',
		              'LT_C_UQ121','LT_C_UQ122','LT_C_UQ123','LT_C_UQ124',
		              'LT_C_UQ125','LT_C_UQ126','LT_C_UQ127','LT_C_UQ128',
		              'LT_C_UQ129','LT_C_UQ130','LT_C_WKMBBSN','LT_C_TDWAREA','LT_L_FRSTCLIMB'];
		var stylesText = ['도시지역','관리지역','농립지역','자연환경보전지역','경관지구','미관지구',
		                  	  '고도지구','방화지구','방재지구','보존지구','시설보호지구','취락지구',
		                  	  '개발진흥지구','특정용도제한지구','수자원[대권역]','보행우선구역','등산로']; 

*/
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
	 * Pulbic OpenData User Interface
	 */ 
	openGDSM.PublicDataUI = {  
			 visualTypeRadioBtn : function(rootDiv, mapSW){ 
				mapSW = (typeof(mapSW) !== 'undefined') ? mapSW : true;
				var html = '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
//				var arr = ['map','chart','chartMap'];
//              var arrText = ['맵','차트','맵&차트'];
                var arr = ['map','chart'];
              var arrText = ['맵','차트'];
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
             seoulEnvType : function(rootDiv){
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
             },
			 mapSelect : function(obj){
				 var mapSelect = $('#wfsMap'); 
				 if(mapSelect.is(':empty')){
					 if(obj.val()=='map' || obj.val()=='chartMap'){
						 var html = '<div data-role="fieldcontain">'+
						 			'<select name="geoServerMap" id="geoserverSelectBox">';
						 for(var i=0; i<openGDSM.openGDSMGeoserver.mapLayers.length; i++){
							 html += '<option value="'+openGDSM.openGDSMGeoserver.mapLayers[i]+'"';
							 if(i==0) html+=' selected';							 
							 html += '>'+openGDSM.openGDSMGeoserver.mapLayers[i]+'</option>';
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
	 openGDSM.seoulPublicData = {
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
						this.apiKey, visType, envType, Map.map,
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

                openGDSM.PublicDataUI.seoulEnvType(rootDiv);

				openGDSM.PublicDataUI.processBtn(rootDiv,'seoulPublicData', "TimeAverageAirQuality");
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

                    openGDSM.PublicDataUI.seoulEnvType(rootDiv);

					openGDSM.PublicDataUI.processBtn(rootDiv,'seoulPublicData', "RealtimeRoadsideStation");
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
						this.apiKey, visType, envType, areaType, Map.map,
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
        openGDSM.openGDSMGeoserver.wfs(Map.map, url, workspace, layerName, color, width);
    };
})();




