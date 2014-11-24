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
