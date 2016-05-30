/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3, topojson*/

OGDSM.namesapce('chartVisualization');
(function (OGDSM) {
    "use strict";
    /**
    * D3.js 기반 시각화 객체
    * @class OGDSM.chartVisualization
    * @constructor
    * @param {Array} jsonData - JSON 기반 데이터
    * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {rootKey : null, labelKey : null, valueKey : null, <br>
       max:jsonData min value (based on valueKey), min:jsonData max value (based on valueKey)}<br>
    */
    OGDSM.chartVisualization = function (jsonData, options) {
        function isInt(n) {
            return n % 1 === 0;
        }
        options = (typeof (options) !== 'undefined') ? options : {};
        this.defaults = {
            rootKey : null,
            labelKey : null,
            valueKey : null,
            max : null,
            min : null
        };
        this.defaults = OGDSM.applyOptions(this.defaults, options);
        if (typeof (jsonData) !== 'undefined') {
            if (typeof (options.rootKey) === 'undefined' ||
                    typeof (options.labelKey) === 'undefined' ||
                    typeof (options.valueKey) === 'undefined') {
                console.error('Please input option values : rootKey, label, value');
                return null;
            }
	        this.jsonData = jsonData;
	        this.data = jsonData[options.rootKey];
	        this.defaults = OGDSM.applyOptions(this.defaults, options);
	        var d = null;
	        this.defaults.max = this.defaults.min = this.data[0][options.valueKey];
	        for (d in this.data) {
	            if (this.data.hasOwnProperty(d)) {
	                this.defaults.max = Math.max(this.data[d][options.valueKey], this.defaults.max);
	                this.defaults.min = Math.min(this.data[d][options.valueKey], this.defaults.min);
                    if (!isInt(Number(this.data[d][options.valueKey]))) {
                        this.data[d][options.valueKey] = Number(this.data[d][options.valueKey]).toFixed(3);
                    }
	            }
	        }
	        this.defaults.max = (typeof (options.max) !== 'undefined') ? options.max : this.defaults.max;
	        this.defaults.min = (typeof (options.min) !== 'undefined') ? options.min : this.defaults.min;
        } else {
            console.log('kMap function Mode');
        }
    };
    OGDSM.chartVisualization.prototype = {
        constructor : OGDSM.chartVisualization,
        /**
         * 지도 객체 받기
         * @method getMap
         * @return {ol.Map} 오픈레이어3 객체
         */
        getMap : function () {
            return null;
        },
        max : function () {

        }
    };
    return OGDSM.chartVisualization;
}(OGDSM));


/**
 * 수직 막대 차트 시각화
 * @method vBarChart
 * @param {String} div id - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {range : null, color : ['#4AAEEA']}<br>
 */
OGDSM.chartVisualization.prototype.vBarChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            color : ['#4AAEEA'],
            top : 20,
            right : 25,
            bottom : 70,
            left : 45,
            tick : 10
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.05);
    var values = d3.scale.linear().range([barHeight, 0]);
    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left').ticks(chartOptions.tick);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);
    chartSVG.append('g')
            .attr('class', 'y axis')
            .call(valueAxis)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('shape-rendering', 'crispEdges')
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 7)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .style('font-size', '0.7em')
            .text(options.valueKey);
    chartSVG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + barHeight + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });

    chartSVG.selectAll('bar').data(data).enter().append('rect')
        .attr('fill', function (d) {
            if ($.isArray(chartOptions.range) === true) {
                var z = 0;
                for (z = 0; z < chartOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= chartOptions.range[z]) {
                        return chartOptions.color[z];
                    }
                }
            } else {
                return chartOptions.color;
            }
        })
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('width', labels.rangeBand())
        .attr('y', function (d) {
            if (isNaN(values(d[options.valueKey]))) {
                return 0;
            }
            return values(d[options.valueKey]);
        })
        .attr('height', function (d) {
            if (isNaN(values(d[options.valueKey]))) {
                return 0;
            }
            return barHeight - values(d[options.valueKey]);
        });
    chartSVG.selectAll('bar').data(data).enter().append('text')
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .attr('y', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('dx', '-5')
        .attr('dy', '.75em')
        .style('font-size', '0.75em')
        .attr('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        });
};



/**
 * 수평 막대 차트 시각화
 * @method hBarChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {range : [], color : ['#4AAEEA']}<br>
 */
OGDSM.chartVisualization.prototype.hBarChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            color : ['#4AAEEA'],
            top : 20,
            right : 60,
            bottom : 20,
            left : 80,
            tick : 10
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barHeight], 0.02);
    var values = d3.scale.linear().range([0, barWidth]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    var labelAxis = d3.svg.axis().scale(labels).orient('left');
    var valueAxis = d3.svg.axis().scale(values).orient('top');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    chartSVG.append('g').attr('class', 'y axis')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.75em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');
    chartSVG.append('g')
        .attr('class', 'x axis')
        .call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .style('font-size', '0.75em')
        .attr('shape-rendering', 'crispEdges')
        .append('text')
        .attr('x', barWidth)
        .attr('dy', '1.2em')
        .style('text-anchor', 'end')
        .style('font-size', '0.75em')
        .text(options.valueKey);
    chartSVG.selectAll('bar').data(data).enter().append('rect')
        .attr('x', function (d, i) {
            return 0.5;
        })
        .attr('y', function (d) {
            return labels(d[options.labelKey]);
        })
        .attr('height', labels.rangeBand() - 0.5)
        .attr('width', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('fill', function (d) {
            if ($.isArray(chartOptions.range) === true) {
                var z = 0;
                for (z = 0; z < chartOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= chartOptions.range[z]) {
                        return chartOptions.color[z];
                    }
                }
            } else {
                return chartOptions.color;
            }
        });
    chartSVG.selectAll('bar').data(data).enter().append('text')
        .attr('x', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('y', function (d) {
            return labels(d[options.labelKey]);
        })
        .attr('dy', '.75em')
        .style('font-size', '0.75em')
        .attr('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        });
};



/**
 * 라인 차트 시각화
 * @method lineChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {stroke : ['#4AAEEA'], width : 2,<br>
       circleSize : 3, circleColor : ['#AAAAAA']}<br>
 */
OGDSM.chartVisualization.prototype.lineChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            stroke : ['#4AAEEA'],
            width : 2,
            circleSize : 3,
            circleColor : ['#AAAAAA'],
            top : 20,
            right : 25,
            bottom : 100,
            left : 45
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.05);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'line')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var lineXY = d3.svg.line()
        .x(function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .y(function (d, i) {
            return values(d[options.valueKey]);
        });

    chartSVG.append('path').attr('d', lineXY(data))
        .attr('stroke', chartOptions.stroke)
        .attr('stroke-width', chartOptions.stroke)
        .attr('fill', 'none');
    chartSVG.append('g').attr('class', 'x axis').call(labelAxis)
        .attr('transform', 'translate(0, ' + barHeight + ')')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });
    chartSVG.append('g').attr('class', 'y axis').call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 7)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .text(options.valueKey);

    var textCircle = chartSVG.selectAll('circle').data(data).enter().append('g');
    textCircle.append('circle')
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor)
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        });
    textCircle.append('text')
        .attr('dy', '-.5em')
        .style('font-size', '0.55em')
        .style('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        })
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]);
        });
};

/**
 * 영역 차트 시각화
 * @method areaChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {fill : ['#4AAEEA'], circleSize : 3, circleColor : ['#AAAAAA']}<br>
 */
OGDSM.chartVisualization.prototype.areaChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            fill : ['#4AAEEA'],
            circleSize : 3,
            circleColor : ['#AAAAAA'],
            top : 20,
            right : 0,
            bottom : 100,
            left : 45
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .append('g')
        .attr('transform', 'translate(' + chartOptions.left + ', ' + chartOptions.top + ')');

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var areaXY = d3.svg.area()
        .x(function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .y0(barHeight)
        .y1(function (d, i) {
            return values(d[options.valueKey]);
        });
    chartSVG.append('path').attr('d', areaXY(data))
        .attr('class', 'area')
        .attr('fill', chartOptions.fill);

    var textCircle = chartSVG.selectAll('circle').data(data).enter().append('g');
    textCircle.append('circle')
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor)
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        });
    textCircle.append('text')
        .attr('dy', '-.5em')
        .style('font-size', '0.55em')
        .style('text-anchor', 'start')
        .text(function (d) {
            return d[options.valueKey];
        })
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) + labels.rangeBand() / 2;
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]);
        });

    chartSVG.append('g').attr('class', 'x axis').call(labelAxis)
        .attr('transform', 'translate(0, ' + barHeight + ')')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });
    chartSVG.append('g').attr('class', 'y axis').call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 7)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-size', '0.7em')
        .text(options.valueKey);
};


OGDSM.chartVisualization.prototype.kMap = function (rootDiv, serverAddr, geodata, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        mapOptions = {
            center_lat : 34.0,
            center_lon : 131.0,
            map_scale : 3500,
            top : 0,
            right : 0,
            bottom : 0,
            left : 0
        };
    mapOptions = OGDSM.applyOptions(mapOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        contentWidth = rootDivObj.width() + mapOptions.left + mapOptions.right,
        contentHeight = rootDivObj.height() + mapOptions.top + mapOptions.bottom,
        barWidth = rootDivObj.width() - mapOptions.left - mapOptions.right,
        barHeight = rootDivObj.height() - mapOptions.top - mapOptions.bottom,
        objNames = [
            { geoName : 'SIDO', objName : 'All_TL_SCCO_CTPRVN_4326', propEnName : 'CTP_ENG_NM'},
            { geoName : 'GU', objName : 'All_TL_SCCO_SIG_4326', propEnName : 'SIG_ENG_NM'},
            { geoName : 'DONG', objName : 'All_TL_SCCO_EMD_4326', propEnName : 'EMD_ENG_NM'}
        ],
        paramData = {};
    paramData.jsonName = geodata;
    rootDivObj.empty();
    var svg = d3.select('#' + rootDiv)
                .append('svg')
                .attr("width", contentWidth)
                .attr("height", contentHeight);
    var projection = d3.geo.mercator()
                .center([mapOptions.center_lon, mapOptions.center_lat])
                .scale(mapOptions.map_scale)
                .rotate([2, 2.5])
                .translate([barWidth / 2, barHeight / 2]);
    var path = d3.geo.path().projection(projection);
    var curObj = null, curPropEn = null;
    $.each(objNames, function (i, d) {
        if (d.geoName === geodata) {
            curObj = d.objName;
            curPropEn = d.propEnName;
        }
    });
    if (curObj === null) {
        console.log('Not support Map');
        return -1;
    }
    $.ajax({
        type : 'POST',
        url : serverAddr,
        data : JSON.stringify(paramData),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var topology = JSON.parse(msg.data);
            var objs = topology.objects;
            svg.selectAll("path")
                .data(topojson.feature(topology, objs[curObj]).features)
                .enter().append("path")
                .attr('data-prop', function (d) {
                    return JSON.stringify(d.properties);
                })
                .style("fill", function (d) { return "#" + Math.random().toString(16).slice(2, 8); })
                .style('fill-opacity', 0.5)
                .attr("d", path);
        },
        error : function (e) {
            console.log(e);
            $('#result').text(e);
        }
    });
};

/**
 * 파이 차트 시각화
 * @method areaChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {fill : ['#4AAEEA'], circleSize : 3, circleColor : ['#AAAAAA']}<br>
 */
/*
OGDSM.chartVisualization.prototype.pieChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            fill : ['#4AAEEA'],
            circleSize : 3,
            circleColor : ['#AAAAAA']
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 0, right : 0, bottom : 0, left : 0},
        barWidth = rootDivObj.width() - margin.left - margin.right,
        barHeight = rootDivObj.height() - margin.top - margin.bottom;
    $('#' + rootDiv).empty();
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom)
        .attr('transform', 'translate(' + barWidth / 2 + ',' + barHeight / 2 + ')');

    var radius = Math.min(barWidth, barHeight) / 2;
    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d[options.valueKey];
        });

    var group = chartSVG.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    group.append('path')
        .attr('d', arc)
        .style('fill', function (d) {
            return '#AAAAAA';
        });
    group.append('text')
        .attr('transform', function (d) {
            return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .text(function (d) {
            return d[options.labelKey];
        });
};
*/
