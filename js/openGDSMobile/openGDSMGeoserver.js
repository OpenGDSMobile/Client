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
					url:'getLayerNames.do',
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





Layer.displayFeatureInfo = function(pixel){
	var feature = Map.map.forEachFeatureAtPixel(pixel, function(feature, layer){
		return feature;
	});
	
	if(feature){
		console.log(feature.get('EMD_KOR_NM'));
	}		
	else{
		
	}	
}; 