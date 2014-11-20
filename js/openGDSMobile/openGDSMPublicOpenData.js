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
			url:'EnvironmentPublicData.do',
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
			openGDSMGeoserver.wfs(Map.map, 'http://113.198.80.60/','opengds',this.mapLayer);
			
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