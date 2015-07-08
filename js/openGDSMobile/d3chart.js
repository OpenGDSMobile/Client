/**
 * OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)
 * - 사용 방법(Use)
 *       OGDSM.jsonToArray(jsonData, x string, y string);
 *
 * @module OGDSM.jsontoArray
 */
jsonToArray = function (obj, x, y) {
    'use strict';
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
	xyAxis[1] = [];
    $.each(row, function (idx) {
        xyAxis[0].push(row[idx][x]);
        xyAxis[1].push(row[idx][y]);
    });
    return xyAxis;
};
/**
 * 가로 막대 차트 시각화
 * @method barChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Array} data - 데이터 값 2차원 배열 (0 : x, 1 : y)
 * @param {Array} range - 데이터 범위 1차원 배열
 * @param {Array} color - 데이터 색 범위 1차원 배열 [default=#000000 (range와 배열 길이 같아야함)]
 */
barChart = function (divId, data, range, color) {
    'use strict';
    range = (typeof (range) !== 'undefined') ? range : [];
    color = (typeof (color) !== 'undefined') ? color : ['#000000'];

    if( typeof(data[0][0]) === 'string'){
    	$.each(data[0], function (idx){
    		data[0][idx] = Number(data[0][idx]);
    	});
    }
    var barHeight = 18,
        minusWidth = 0,
        rootDiv = $('#' + divId),
        maxData = d3.max(data[0]),
        barChartDiv = null,
        x = null,
        z = null,
        barMargin = 90;
    rootDiv.empty();
    barChartDiv = d3.select("#" + divId).append('svg')
        .attr('id', 'barchart')
        .attr('width', rootDiv.width())
        .attr('height', barHeight * data[0].length);
    x = d3.scale.linear().domain([0, maxData]).range([0, rootDiv.width() - 50]);
    barChartDiv.selectAll("rect").data(data[0]).enter()
        .append("rect")
        .attr("x", barMargin)
        .attr("y", function (d, i) {
            return i * barHeight;
        })
        .attr('width', function (d) {
            if (d === '-' || d === '0') {
                return x(20);
            }
			return x(d) - minusWidth;
        })
        .attr('height', barHeight - 2)
		.attr('fill', function (d, i) {
            if (d === '-' || d === '0') {
                return '#AAAAAA';
            }
            if (range.length !== 0) {
                for (z = 0; z < range.length; z += 1) {
                    if (data[0][i] <= range[z]) {
                        return color[z];
                    }
                }
            }
            return color[color.length];
        });
    
    barChartDiv.selectAll('g').data(data[1])
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return i * barHeight + barHeight - 5;
        })
        .attr('font-weight', 'bold')
        .attr('font-size', '0.8em')
        .text(function (d) {
            return d;
        });
    
	barChartDiv.selectAll('g').data(data[0])
        .enter()
        .append('text')
        .attr('x', function (d) {
            if (d === '-' || d === '0') {
                return x(10);
            }
			return x(d) - minusWidth + barMargin;
        })
        .attr('y', function (d, i) {
            return i * barHeight + barHeight - 5;
        })
        .attr('dy', '.15em')
        .attr('fill', 'black')
        .attr('font-size', '0.8em')
        .attr('font-weight', 'bold')
        .text(function (d) {
            if (d === '-' || d === '0') {
                return '점검중';
            }
            return d;
        });
};

vbarChart = function (divId, data, scale, range, color) {
    'use strict';
    range = (typeof (range) !== 'undefined') ? range : [];
    color = (typeof (color) !== 'undefined') ? color : ['#000000'];

    if( typeof(data[0][0]) === 'string'){
    	$.each(data[0], function (idx){
    		data[0][idx] = Number(data[0][idx]);
    	});
    }
    var rootDiv = $('#' + divId),
        maxData = d3.max(data[0]),
        vbarChartDiv = null,
        y = null,
        z = null;
        
    rootDiv.empty();
    
    vbarChartDiv = d3.select("#" + divId).append('svg')
        .attr('id', 'vbarchart')
        .attr('width', rootDiv.width())
        .attr('height', rootDiv.height());
    
    y = d3.scale.linear().domain([0, maxData]).range([0, rootDiv.height() - 50]);
    
    var barWidth = rootDiv.width() / data[0].length;
    
    vbarChartDiv.selectAll("rect").data(data[0]).enter()
        .append("rect")
        .attr("y", function (d,i) {
			return rootDiv.height()-(data[0][i]*scale); 
        })
        .attr("x", function (d,i) {
            return i * barWidth;
        })
        .attr('width',barWidth-1)
        .attr('height', function (d,i) {
			return data[0][i]*scale; 
        })
		.attr('fill', function (d, i) {
            if (d === '-' || d === '0') {
                return '#AAAAff';
            }
            if (range.length !== 0) {
                for (z = 0; z < range.length; z += 1) {
                    if (data[0][i] <= range[z]) {
                        return color[z];
                    }
                }
            }
            return color[color.length];
        });
    
    vbarChartDiv.selectAll('g').data(data[1])
    	.enter()
    	.append('text')
    	.attr('x',function (d,i) {
    		return i * barWidth;
    	})
    	.attr('y', function (d, i) {
    		return rootDiv.height()-(data[0][i]*scale)-20;
    	})
    	.attr('font-weight', 'bold')
    	.attr('font-size', '0.6em')
    	.text(function (d) {
    		return d;
    	});
    vbarChartDiv.selectAll('g').data(data[0])
	    .enter()
	    .append('text')
	    .attr('x',function (d,i) {
    		return i * barWidth;
    	})
    	.attr('y', function (d, i) {
    		return rootDiv.height()-(data[0][i]*scale)-10;
    	})
	    .attr('dy', '.15em')
	    .attr('fill', 'black')
	    .attr('font-size', '0.8em')
	    .attr('font-weight', 'bold')
	    .text(function (d) {
	        if (d === '-' || d === '0') {
	            return '점검중';
	        }
	        return d;
	    });
};



lineChart = function (divId, data, scale, range, color) {
    'use strict';
    range = (typeof (range) !== 'undefined') ? range : [];
    color = (typeof (color) !== 'undefined') ? color : ['#000000'];

    if( typeof(data[0][0]) === 'string'){
    	$.each(data[0], function (idx){
    		data[0][idx] = Number(data[0][idx]);
    	});
    }
    var rootDiv = $('#' + divId),
        maxData = d3.max(data[0]),
        lineChartDiv = null,
        y = null, yRange =null, xRange=null, xAxis=null, yAxis=null, ySlice=null,
        z = null;
        
    rootDiv.empty();
    
    lineChartDiv = d3.select("#" + divId).append('svg')
        .attr('id', 'linechart')
        .attr('width', rootDiv.width())
        .attr('height', rootDiv.height());
    
    ySlice = 50;
    console.log(data[0]);
    console.log(maxData);
    console.log(rootDiv.height());
    
    yRange = d3.scale.linear().domain([maxData, 0]).range([0, rootDiv.height() - ySlice]);
    xRange = d3.scale.ordinal().domain(data[1]).rangePoints([0, rootDiv.width()-100]);
    
    xAxis = d3.svg.axis()
	        .scale(xRange)
	        .tickSize(3)
	        .orient('bottom');
    yAxis = d3.svg.axis()
	        .scale(yRange)
	        .tickSize(3)
	        .orient('left')
	        .tickSubdivide(true);
    
    var linePointInterval = (rootDiv.width()) / data[1].length;
    
    var lineFunc = d3.svg.line()
    .x(function(d,i) { 
		return (linePointInterval*i); 
	})
    .y(function (d,i) {
    	return (data[0][i]*scale)-ySlice; 
    });
    
    lineChartDiv.append('g')
	    .attr('class', 'x axis')
	    .attr('transform', 'translate(30,' + (rootDiv.height()-ySlice) + ')')
	    .call(xAxis)
	    .selectAll("text")
	      .attr('transform', function(d){return "rotate(-55)";})
	    ;
    
    lineChartDiv.append('g')
	    .attr('class', 'y axis')
	    .attr('transform', 'translate(30,0)')
	    .call(yAxis);
    
    lineChartDiv.append("path").attr("d", lineFunc(data[0]))
	    .attr('stroke', 'red')
	    .attr('stroke-width', 2)
	    .attr('transform', 'translate(30,0)')
	    .attr('fill', 'none');
    
    lineChartDiv.selectAll("circle").data(data[0]).enter()
	    .append("circle")
	    .attr("cy", function(d,i) {return (data[0][i]*scale)-ySlice; })
	    .attr("cx", function(d,i) {return i * linePointInterval;})
	    .attr("r",  function(d)   {return 6;})
	    .attr('transform', 'translate(30,0)');
    
    lineChartDiv.selectAll('g').data(data[0])
	    .enter()
	    .append('text')
	    .attr('x',function (d,i) {
	    	return (linePointInterval*i);
		})
		.attr('y', function (d, i) {
			return rootDiv.height()-(data[0][i]*scale);
		})
	    .attr('dy', '.15em')
	    .attr('fill', 'black')
	    .attr('font-size', '0.8em')
	    .attr('font-weight', 'bold')
	    .text(function (d) {
	        if (d === '-' || d === '0') {
	            return '점검중';
	        }
	        return d;
	    });
    
};


