var Layer = {};
var	LayerSources =null;
	Layer.vectorSource = null;
	Layer.jsonfile = null;
//192.168.0.9
//113.198.80.60:8080
Layer.createLayer = function(obj,color,width){
	obj  = $(obj).attr('data-id'); 
	Layer.vectorSource = new ol.source.ServerVector({
		format: new ol.format.GeoJSON(),
		loader: function(extent, resolution, projection){
			//console.log('Loading Data: '+data);
			var url = 'http://113.198.80.9/geoserver/wfs?service=WFS&' +
			'version=1.1.0&request=GetFeature' +  
			'&typeNames=opengds:'+obj+ 
			'&outputFormat=text/javascript&format_options=callback:loadFeatures' +
			'&srsname=EPSG:900913&bbox=' + extent.join(',') + ',EPSG:900913'; 
			$.ajax({ 
				url : url,
				dataType: 'jsonp' 
			});  
		},
		strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
			maxZoom: 19
		})),
		projection: 'EPSG:900913'
	}); 
	loadFeatures = function(response){   
		Layer.vectorSource.addFeatures(Layer.vectorSource.readFeatures(response));  
	};  
	var styleArray = [
	    new ol.style.Style({
		  fill: new ol.style.Fill({
		    color: '#111111'
		  }),
		  stroke: new ol.style.Stroke({
		    color: '#319FD3',
		    width: 1
		  }) 
		})]; 
	var vectorTemp = new ol.layer.Vector({
    	title:obj,
 	   	source: Layer.vectorSource,
 	   	style: function(f,r){ 
 	   		
 	   		if(f.get('SIG_KOR_NM')=='은평구'){
 	 	   		console.log('은평구');
 	 	   		console.log(styleArray[0]);
 	   			return styleArray;
 	   		}
 	   		else{
 	   			return styleArray;
 	   		} 
 	   	} 
    });
    Map.map.addLayer(vectorTemp); 
	
};

Layer.removeLayer = function(data){
	Map.map.removeLayer(data);
};
/*
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
*/