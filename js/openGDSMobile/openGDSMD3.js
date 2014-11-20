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
