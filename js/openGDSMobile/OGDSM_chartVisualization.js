/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3*/

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
        options = (typeof (options) !== 'undefined') ? options : {};
        if (typeof (options.rootKey) === 'undefined' ||
                typeof (options.labelKey) === 'undefined' ||
                typeof (options.valueKey) === 'undefined') {
            console.error('Please input option values : rootKey, label, value');
            return null;
        }
        this.defaults = {
            rootKey : null,
            labelKey : null,
            valueKey : null,
            max : null,
            min : null
        };
        this.jsonData = jsonData;
        this.data = jsonData[options.rootKey];
        this.defaults = OGDSM.applyOptions(this.defaults, options);
        var d = null;
        this.defaults.max = this.defaults.min = this.data[0][options.valueKey];
        for (d in this.data) {
            if (this.data.hasOwnProperty(d)) {
                this.defaults.max = Math.max(this.data[d][options.valueKey], this.defaults.max);
                this.defaults.min = Math.min(this.data[d][options.valueKey], this.defaults.max);
            }
        }
        this.defaults.max = (typeof (options.max) !== 'undefined') ? options.max : this.defaults.max;
        this.defaults.min = (typeof (options.min) !== 'undefined') ? options.min : this.defaults.min;
        console.log(this.defaults);
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
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {range : [], color : ['#4AAEEA']}<br>
 */
OGDSM.chartVisualization.prototype.vBarChart = function (rootDiv, subOptions) {
    'use strict';
    subOptions = (typeof (subOptions) !== 'undefined') ? subOptions : {};
    var data = this.data,
        options = this.defaults,
        chartOptions = {
            range : null,
            color : ['#4AAEEA']
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 20, right : 25, bottom : 130, left : 45},
        barWidth = rootDivObj.width() - margin.left - margin.right,
        barHeight = rootDivObj.height() - margin.top - margin.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom);

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var bar = chartSVG.selectAll('g').data(data).enter()
        .append('g')
        .attr('transform', function (d, i) {
            return 'translate(' + labels(d[options.labelKey]) + ', ' + margin.top + ')';
        });

    var barRect = bar.append('rect')
        .attr('y', function (d) {
            return values(d[options.valueKey]);
        })
        .attr('x', function (d, i) {
            return labels.rangeBand() + (margin.left / 3); //+(margin.left/4)
      //      return (labels(d[options.labelKey]) / data.length) + margin.left;
        })
        .attr('height', function (d) {
            return barHeight - values(d[options.valueKey]);
        })
        .attr('width', labels.rangeBand())
        .attr('fill', function (d) {
            if ($.isArray(chartOptions.range) === true) {
                var z = 0;
                for (z = 0; z < chartOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= chartOptions.range.range[z]) {
                        return chartOptions.color[z];
                    }
                }
            } else {
                return chartOptions.color;
            }
        });/*
    barRect.transition()
        .duration(2000)
        .attr('height', function (d) {
            return barHeight - values(d[options.valueKey]);
        });*/

    bar.append('text')
        .attr('x', labels.rangeBand() + margin.left)
        .attr('y', function (d) {
            return values(d[options.valueKey]) - 10;
        })
        .attr('dy', '.75em')
        .attr('text-anchor', 'end')
        .text(function (d) {
            return d[options.valueKey];
        });

    chartSVG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ', ' + (barHeight + margin.top) + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });

    chartSVG.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .call(valueAxis)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('shape-rendering', 'crispEdges')
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(options.valueKey);
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
            color : ['#4AAEEA']
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 0, right : 60, bottom : 20, left : 80},
        barWidth = rootDivObj.width() - margin.left - margin.right,
        barHeight = rootDivObj.height() - margin.top - margin.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barHeight], 0.1);
    var values = d3.scale.linear().range([barWidth, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom);

    var labelAxis = d3.svg.axis().scale(labels).orient('left');
    var valueAxis = d3.svg.axis().scale(values).orient('bottom');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);
    console.log(options.min + ' ' + options.max);
    var bar = chartSVG.selectAll('g').data(data).enter()
        .append('g')
        .attr('transform', function (d, i) {
            return 'translate(' + margin.left + ', ' + labels(d[options.labelKey]) + ')';
        });
    bar.append('rect')
        .attr('y', function (d) {
            return labels.rangeBand() + (margin.top / 3); //+(margin.left/4)
        })
        .attr('x', function (d, i) {
            return margin.left;
        })
        .attr('height', labels.rangeBand())
        .attr('width', function (d) {
            //return barWidth - values(d[options.valueKey]);
            return barWidth - values(d[options.valueKey]);
        })
        .attr('fill', function (d) {
            if ($.isArray(chartOptions.range) === true) {
                var z = 0;
                for (z = 0; z < chartOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= chartOptions.range.range[z]) {
                        return chartOptions.color[z];
                    }
                }
            } else {
                return chartOptions.color;
            }
        });
    bar.append('text')
        .attr('x', function (d) {
            return barWidth + (margin.left) - values(d[options.valueKey]);
        })
        .attr('y', labels.rangeBand())
        .attr('dy', '.75em')
        .attr('text-anchor', 'end')
        .text(function (d) {
            return d[options.valueKey];
        });

    chartSVG.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(' + (margin.left) * 2 + ', ' + labels.rangeBand() + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');
    //Bug ......
    chartSVG.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(' + (margin.left) * 2 + ', ' + barHeight + ')')
            .call(valueAxis)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('shape-rendering', 'crispEdges')
            .append('text')
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(options.valueKey);
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
            circleColor : ['#AAAAAA']
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 20, right : 25, bottom : 130, left : 45},
        barWidth = rootDivObj.width() - margin.left - margin.right,
        barHeight = rootDivObj.height() - margin.top - margin.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom);

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var lineXY = d3.svg.line()
        .x(function (d, i) {
            return labels(d[options.labelKey]);
        })
        .y(function (d, i) {
            return values(d[options.valueKey]);
        });
    //var bar = chartSVG.append('path').attr('d', lineFunc(

    chartSVG.append('path').attr('d', lineXY(data))
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('stroke', chartOptions.stroke)
        .attr('stroke-width', options.stroke)
        .attr('fill', 'none');
    var circleText = chartSVG.selectAll('g').data(data).enter()
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    circleText.append('circle')
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor);
    circleText.append('text')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) - 15;
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]) - 20;
        })
        .attr('dy', '.75em')
        .attr('text-anchor', 'end')
        .text(function (d) {
            return d[options.valueKey];
        });
    chartSVG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ', ' + (barHeight + margin.top) + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });
    chartSVG.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 5)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(options.valueKey);
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
            circleColor : ['#AAAAAA']
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 20, right : 25, bottom : 130, left : 45},
        barWidth = rootDivObj.width() - margin.left - margin.right,
        barHeight = rootDivObj.height() - margin.top - margin.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom);

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var areaXY = d3.svg.area()
        .x(function (d, i) {
            return labels(d[options.labelKey]);
        })
        .y0(barHeight)
        .y1(function (d, i) {
            return values(d[options.valueKey]);
        });
    chartSVG.append('path').attr('d', areaXY(data))
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('class', 'area')
        .attr('fill', chartOptions.fill);


    var circleText = chartSVG.selectAll('g').data(data).enter()
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    circleText.append('circle')
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor);
    circleText.append('text')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) - 15;
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]) - 20;
        })
        .attr('dy', '.75em')
        .attr('text-anchor', 'end')
        .text(function (d) {
            return d[options.valueKey];
        });

    chartSVG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ', ' + (barHeight + margin.top) + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });

    chartSVG.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .call(valueAxis)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('shape-rendering', 'crispEdges')
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(options.valueKey);
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
            circleColor : ['#AAAAAA']
        };
    chartOptions = OGDSM.applyOptions(chartOptions, subOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 20, right : 25, bottom : 130, left : 45},
        barWidth = rootDivObj.width() - margin.left - margin.right,
        barHeight = rootDivObj.height() - margin.top - margin.bottom;
    $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + rootDiv).append('svg').attr('id', rootDiv + 'Bar')
        .attr('width', barWidth + margin.left + margin.right)
        .attr('height', barHeight + margin.top + margin.bottom);

    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left');
    labels.domain(data.map(function (d) {
        return d[options.labelKey];
    }));
    values.domain([options.min, options.max]);

    var lineXY = d3.svg.line()
        .x(function (d, i) {
            return labels(d[options.labelKey]);
        })
        .y(function (d, i) {
            return values(d[options.valueKey]);
        });
    //var bar = chartSVG.append('path').attr('d', lineFunc(

    chartSVG.append('path').attr('d', lineXY(data))
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('stroke', chartOptions.stroke)
        .attr('stroke-width', options.stroke)
        .attr('fill', 'none');
    var circleText = chartSVG.selectAll('g').data(data).enter()
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    circleText.append('circle')
        .attr('cy', function (d, i) {
            return values(d[options.valueKey]);
        })
        .attr('cx', function (d, i) {
            return labels(d[options.labelKey]);
        })
        .attr('r', chartOptions.circleSize)
        .attr('fill', chartOptions.circleColor);
    circleText.append('text')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr('x', function (d, i) {
            return labels(d[options.labelKey]) - 15;
        })
        .attr('y', function (d, i) {
            return values(d[options.valueKey]) - 20;
        })
        .attr('dy', '.75em')
        .attr('text-anchor', 'end')
        .text(function (d) {
            return d[options.valueKey];
        });
    chartSVG.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ', ' + (barHeight + margin.top) + ')')
        .call(labelAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-65)';
        });
    chartSVG.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .call(valueAxis)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('shape-rendering', 'crispEdges')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 5)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(options.valueKey);
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
