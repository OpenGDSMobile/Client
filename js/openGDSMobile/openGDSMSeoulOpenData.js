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
			url:'EnvironmentSeoulData.do',
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
		openGDSMGeoserver.wfs(Map.map, 'http://113.198.80.9/','opengds',this.mapLayer);
		
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
