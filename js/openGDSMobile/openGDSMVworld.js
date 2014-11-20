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