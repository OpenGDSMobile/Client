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
 * 가로 막대 차트 시각화 http://codepen.io/anon/pen/mJKyNR
 * @method vBarChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값<br>
      {range : [], color : ['#000000']}<br>
 */
OGDSM.chartVisualization.prototype.vBarChart = function (rootDiv, barChartOptions) {
    'use strict';
    barChartOptions = (typeof (barChartOptions) !== 'undefined') ? barChartOptions : {};
    var data = this.data,
        options = this.defaults,
        barOptions = {
            range : null,
            color : ['#4AAEEA']
        };
    barOptions = OGDSM.applyOptions(barOptions, barChartOptions);
    var rootDivObj = $('#' + rootDiv),
        margin = {top : 20, right : 25, bottom : 60, left : 35},
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
            return 'translate(' + labels(d[options.labelKey]) + ', 0)';
        });

    bar.append('rect')
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
            if ($.isArray(barOptions.range) === true) {
                var z = 0;
                for (z = 0; z < barOptions.range.length; z += 1) {
                    if (d[options.valueKey] <= barOptions.range.range[z]) {
                        return barOptions.color[z];
                    }
                }
            } else {
                return barOptions.color;
            }
        });

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
            .attr('transform', 'translate(' + margin.left + ', ' + barHeight + ')')
            //.attr('transform', 'translate(0, ' + rootDivObj.height() + ')')
            .call(labelAxis)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('shape-rendering', 'crispEdges');

    chartSVG.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + margin.left + ', 0)')
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
 * 가로 막대 차트 시각화
 * @method barChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Array} data - 데이터 값 2차원 배열 (0 : x, 1 : y)
 * @param {Array} range - 데이터 범위 1차원 배열
 * @param {Array} color - 데이터 색 범위 1차원 배열 [default=#000000 (range와 배열 길이 같아야함)]
 */
/*
OGDSM.chartVisualization.prototype.barChart = function (divId, data, range, color) {
    'use strict';
    range = (typeof (range) !== 'undefined') ? range : [];
    color = (typeof (color) !== 'undefined') ? color : ['#000000'];
    var barHeight = 18,
        minusWidth = 0,
        rootDiv = $('#' + divId),
        maxData = d3.max(data[0]),
        barChartDiv = null,
        x = null,
        y = null,
        z = null;
    rootDiv.empty();
    barChartDiv = d3.select("#" + divId).append('svg')
        .attr('id', 'barchart')
        .attr('width', rootDiv.width())
        .attr('height', barHeight * data[0].length);
    x = d3.scale.linear().domain([0, maxData]).range([0, rootDiv.width() - 50]);
    barChartDiv.selectAll("rect").data(data[0]).enter()
        .append("rect")
        .attr("x", 0)
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
			return x(d) - minusWidth;
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
*/
