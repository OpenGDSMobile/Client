goog.provide('openGDSMobile.AttributeManager');
goog.require('openGDSMobile.util.applyOptions');


openGDSMobile.AttributeManager = function () {

};


openGDSMobile.AttributeManager.prototype.editEnable = function () {

};




goog.provide('openGDSMobile.AttributeVis');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.ui.LabelInput');


openGDSMobile.Attribute = {};

openGDSMobile.Attribute.PANEL_STYLE = 'openGDSMobile-attr-panel';

openGDSMobile.Attribute.PANEL_INPUT_STYLE = 'openGDSMobile-attr-textInput';


openGDSMobile.attrListStatus = {
    length : 0,
    objs : []
};

openGDSMobile.AttributeVis = function (_addr, _mapObj, _options) {
    _mapObj = (typeof (_mapObj) !== 'undefined') ? _mapObj : null;
    _options = (typeof (_options) !== 'undefined') ? _options : {};

    var defaultOptions = {
        attrKey : null,
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        strokeWidth : 1,
        radius : 5,
        opt : 1.0
    };

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    this.options = options;
    this.addr = _addr;

    if (_mapObj === null) {
        console.log("Only attribute visualization. Not linked map.");
    } else {
        var attrPanelDOM = goog.dom.createDom('div',{
            'id' : 'openGDSMobileAttr',
            'class' : openGDSMobile.Attribute.PANEL_STYLE
        });
        document.body.appendChild(attrPanelDOM);
        this.mapObj = _mapObj.mapObj;

        this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            element : attrPanelDOM,
            autoPan : true,
            autoPanAnimation: {
                duration: 250
            }
        }));
        this.mapObj.addOverlay(this.overlay);
    }
};


openGDSMobile.AttributeVis.textStyleFunction = function (feature, resolution, attrKey) {
    return new ol.style.Text({
        text : resolution < 76 ? feature.get(attrKey) : ''
    });
};

openGDSMobile.AttributeVis.styleFunction = function (feature, resolution, options) {
    var type = feature.getGeometry().getType();
    if (type === 'MultiPolygon') {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: options.strokeColor,
                width: options.strokeWidth
            }),
            fill: new ol.style.Fill({
                color: options.fillColor
            }),
            text: openGDSMobile.AttributeVis.textStyleFunction(feature, resolution, options.attrKey)
        });
    } else if (type === 'line') {

    } else if (type === 'point') {
        return new ol.style.Style({
            image : new ol.style.Circle({
                radius : options.radius,
                stroke : new ol.style.Stroke({
                    color: options.strokeColor,
                    width: options.strokeWidth
                }),
                fill : new ol.style.Fill({
                    color : options.fillColor
                }),
                text: openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
            })
        })
    }
}

openGDSMobile.AttributeVis.prototype.addAttr = function (_layerName) {
    var addr = this.addr;
    var mapObj = this.mapObj;
    var options = this.options;
    var overlay = this.overlay;
    var layer = openGDSMobile.util.getOlLayer(mapObj, _layerName);
    console.log(layer);
    options.attrKey = layer.get('attrKey');
    /***
     * 모든 객체...
     */
    var obj = {
        layerName : _layerName
    };
    /*
     ++openGDSMobile.attrListStatus;
     console.log(openGDSMobile.attrListStatus);
     openGDSMobile.attrListStatus.objs.push({
     layerName : _layerName
     });
     */

    var select = new ol.interaction.Select({
        condition: ol.events.condition.click,
        style : (function (feature, resolution) {
            return openGDSMobile.AttributeVis.styleFunction(feature, resolution, options);
        })
    });

    mapObj.addInteraction(select);
    select.on('select', function(e) {
        // 여기에다가 ......
        if (e.selected.length !== 0) {
            overlay.setPosition(e.mapBrowserEvent.coordinate);
            //console.log(e.selected[0]);
            var obj = e.selected[0].getProperties();
            var keys = [];
            for (var k in obj) {
                if (k !== 'geometry') {
                    keys.push(k);
                }
            }
            var attrDOM = goog.dom.getElement('openGDSMobileAttr');
            attrDOM.innerHTML = null;
            var titleDOM = goog.dom.createDom('h4', {
                'style' : 'text-align:center; margin:0px;'
            }, obj[options.attrKey]);

            attrDOM.appendChild(titleDOM);
            var tableDOM = goog.dom.createDom('table', {
                //style 적용

            });
            var theadDOM = goog.dom.createDom('thead', {
                //style 적용

            });
            var tbodyDOM = goog.dom.createDom('tbody', {
                //style 적용

            });
            tableDOM.appendChild(theadDOM);
            tableDOM.appendChild(tbodyDOM);
            attrDOM.appendChild(tableDOM);
            var theadTrDOM = goog.dom.createDom('tr', {
                //style 적용
            });
            var tbodyTrDOM = goog.dom.createDom('tr', {
                //style 적용
            });
            theadDOM.appendChild(theadTrDOM);
            tbodyDOM.appendChild(tbodyTrDOM);
            for (var j = 0; j < keys.length; j++){
                var thDOM = goog.dom.createDom('th', {
                    //style 적용
                }, keys[j]);
                var tdDOM = goog.dom.createDom('td', {
                    //style 적용
                });
                var inputDOM = new goog.ui.LabelInput('');
                inputDOM.render(tdDOM);
                inputDOM.setValue(obj[keys[j]]);
                goog.dom.classlist.add(inputDOM.getElement(), openGDSMobile.Attribute.PANEL_INPUT_STYLE);
                inputDOM.setEnabled(false);

                theadTrDOM.appendChild(thDOM);
                tbodyTrDOM.appendChild(tdDOM);
            }
            //모든 객체 저장..??
        } else {
            overlay.setPosition(undefined);
        }
    });
};
/*
 openGDSMobile.AttributeVis.prototype.addAttr = function (_tableName, _layerName) {
 var addr = this.addr;
 var mapObj = this.mapObj;
 var options = this.options;
 var overlay = this.overlay;
 var data = {
 tableName : _tableName
 }
 var layer = openGDSMobile.util.getOlLayer(mapObj, _layerName);
 options.attrKey = layer.get('attrKey');
 console.log(openGDSMobile.attrListStatus.objs);
 var statusObj = openGDSMobile.attrListStatus.objs;
 $.ajax({
 type : 'POST',
 url : addr,
 data : JSON.stringify(data),
 contentType : "application/json;charset=UTF-8",
 dataType : 'json',
 success : function (msg) {
 console.log(msg);
 ++openGDSMobile.attrListStatus;
 var obj = {
 attrObj : msg.data,
 tableName : _tableName,
 layerName : _layerName
 }

 statusObj.push(obj);
 var select = new ol.interaction.Select({
 condition: ol.events.condition.click,
 style : (function (feature, resolution) {
 return openGDSMobile.AttributeVis.styleFunction(feature, resolution, options);
 })
 });
 mapObj.addInteraction(select);
 select.on('select', function(e) {
 // 여기에다가 ......
 console.log(e.selected);
 if (e.selected.length !== 0) {
 overlay.setPosition(e.mapBrowserEvent.coordinate);
 console.log(e.selected[0].getProperties());
 console.log(openGDSMobile.attrListStatus.objs);

 } else {
 overlay.setPosition(undefined);
 }
 });

 },
 error : function (error) {
 console.log(error);
 }
 });
 };
 */
openGDSMobile.AttributeVis.prototype.removeAttr = function (_tableName, _layerName) {

};

openGDSMobile.AttributeVis.prototype.allDisplay = function (_layerName) {


};
goog.provide('openGDSMobile.ChartVis');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');
goog.require('goog.array');


/**
 *
 * @param _data
 * @param _options
 * @returns {number}
 * @constructor
 */
openGDSMobile.ChartVis = function (_data, _options) {
    function isInt(n) {
        return n % 1 === 0;
    }
    _data = JSON.parse(_data);
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        rootKey : null,
        labelKey : null,
        valueKey : null,
        max : null,
        min : null
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    if (typeof (_data) !== 'undefined') {
        if (typeof (options.rootKey) === 'undefined' ||
            typeof (options.labelKey) === 'undefined' ||
            typeof (options.valueKey) === 'undefined') {
            console.error('Please input option values : rootKey, label, value');
            return -1;
        }
        var data = _data[options.rootKey];

        var d = null;
        if (options.max === null) {
            options.max = data[0][options.valueKey];
            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    options.max = Math.max(data[d][options.valueKey], options.max);
                    if (!isInt(Number(data[d][options.valueKey]))) {
                        data[d][options.valueKey] = Number(data[d][options.valueKey]).toFixed(3);
                    }
                }
            }
        }
        if (options.min === null) {
            options.min = data[0][options.valueKey];
            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    options.min = Math.min(data[d][options.valueKey], options.min);
                    if (!isInt(Number(data[d][options.valueKey]))) {
                        data[d][options.valueKey] = Number(data[d][options.valueKey]).toFixed(3);
                    }
                }
            }
        }

        this.options = options;
        this.data = _data[options.rootKey];
    } else {
        console.log('kMap function Mode');
    }

};

/**
 *
 * @param _chartDIV
 * @param _options
 */
openGDSMobile.ChartVis.prototype.vBarChart = function (_chartDIV, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        range : null,
        color : ['#4AAEEA'],
        top : 20,
        right : 25,
        bottom : 70,
        left : 45,
        tick : 10
    };

    var data = this.data;
    var options = this.options;

    var chartOptions = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var rootDivObj = $('#' + _chartDIV),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    //   $('#' + rootDiv).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.05);
    var values = d3.scale.linear().range([barHeight, 0]);
    var labelAxis = d3.svg.axis().scale(labels).orient('bottom');
    var valueAxis = d3.svg.axis().scale(values).orient('left').ticks(chartOptions.tick);
    var chartSVG = d3.select('#' + _chartDIV).append('svg').attr('id', _chartDIV + 'Bar')
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
 *
 * @param _chartDIV
 * @param _options
 */
openGDSMobile.ChartVis.prototype.hBarChart = function (_chartDIV, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        range : null,
        color : ['#4AAEEA'],
        top : 20,
        right : 60,
        bottom : 20,
        left : 80,
        tick : 10
    };

    var data = this.data;
    var options = this.options;

    var chartOptions = openGDSMobile.util.applyOptions(defaultOptions, _options);


    var rootDivObj = $('#' + _chartDIV),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + _chartDIV).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barHeight], 0.02);
    var values = d3.scale.linear().range([0, barWidth]);
    var chartSVG = d3.select('#' + _chartDIV).append('svg').attr('id', _chartDIV + 'Bar')
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
}


/**
 *
 * @param _chartDIV
 * @param _options
 */
openGDSMobile.ChartVis.prototype.lineChart = function (_chartDIV, _options) {

    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
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

    var data = this.data;
    var options = this.options;

    var chartOptions = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var rootDivObj = $('#' + _chartDIV),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + _chartDIV).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.05);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + _chartDIV).append('svg').attr('id', _chartDIV + 'line')
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

}

/**
 *
 * @param _chartDIV
 * @param _options
 */
openGDSMobile.ChartVis.prototype.areaChart = function (_chartDIV, _options) {

    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        fill : ['#4AAEEA'],
        circleSize : 3,
        circleColor : ['#AAAAAA'],
        top : 20,
        right : 0,
        bottom : 100,
        left : 45
    };

    var data = this.data;
    var options = this.options;

    var chartOptions = openGDSMobile.util.applyOptions(defaultOptions, _options);


    var rootDivObj = $('#' + _chartDIV),
        contentWidth = rootDivObj.width() + chartOptions.left + chartOptions.right,
        contentHeight = rootDivObj.height() + chartOptions.top + chartOptions.bottom,
        barWidth = rootDivObj.width() - chartOptions.left - chartOptions.right,
        barHeight = rootDivObj.height() - chartOptions.top - chartOptions.bottom;
    $('#' + _chartDIV).empty();
    var labels = d3.scale.ordinal().rangeRoundBands([0, barWidth], 0.1);
    var values = d3.scale.linear().range([barHeight, 0]);
    var chartSVG = d3.select('#' + _chartDIV).append('svg').attr('id', _chartDIV + 'Bar')
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

}


/**
 *
 * @param rootDiv
 * @param serverAddr
 * @param geodata
 * @param _options
 * @returns {number}
 */
openGDSMobile.ChartVis.prototype.kMap = function (rootDiv, serverAddr, geodata, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        center_lat : 34.0,
        center_lon : 131.0,
        map_scale : 3500,
        top : 0,
        right : 0,
        bottom : 0,
        left : 0
    };

    var data = this.data;
    var options = this.options;

    var mapOptions = openGDSMobile.util.applyOptions(defaultOptions, _options);

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
 * Created by Administrator on 2016-07-02.
 */

goog.provide('openGDSMobile.MapManager');

goog.require('openGDSMobile.util.applyOptions');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.events');
goog.require('goog.events.EventType');



/**
 * CSS / ID Values..
 */
openGDSMobile.Manager = {};

openGDSMobile.Manager.SORTABLE_STYLE = 'drag-handle';

openGDSMobile.Manager.MANAGER_ID = 'openGDSMobileManager';

openGDSMobile.Manager.MANAGER_STYLE = 'openGDSMobile-manager';

openGDSMobile.Manager.MANAGER_LIST_STYLE = 'openGDSMobile-manager-list';

openGDSMobile.Manager.MANAGER_ITEM_TYPE_STYLE = 'openGDSMobile-manager-type';

openGDSMobile.Manager.MANAGER_ITEM_TYPE_CANVAS_STYLE = 'openGDSMobile-manager-canvas';

openGDSMobile.Manager.MANAGER_ITEM_TITLE_STYLE = 'openGDSMobile-manager-title';

openGDSMobile.Manager.MANAGER_ITEM_SETTING_STYLE = 'openGDSMobile-manager-setting';

openGDSMobile.Manager.MANAGER_SETTING_BTN_STYLE = 'openGDSMobile-manager-setting-btn'

openGDSMobile.Manager.MANAGER_SETTING_PANEL = 'openGDSMobile-manager-setting-panel'

openGDSMobile.Manager.MANAGER_SETTING_PANEL_TITLE = 'openGDSMobile-manager-setting-panel-title';

openGDSMobile.Manager.MANAGER_SETTING_PANEL_CLOSE = 'openGDSMobile-manager-setting-panel-close';


/**
 * 리스트 현황 JSON 객체
 * @type {{length: number, objs: [{title: string, obj : object}, ...]}
     */
openGDSMobile.listStatus = {
    length : 0,
    objs : []
};

/**
 * @constructor
 * @param {String} _mapDIV - 지도 DIV 객체
 * @param {Object} _options - 지도 관련 옵션 (JSON 객체)
 * {
 *
 * }
 */
openGDSMobile.MapManager = function (_layerDIV, _visObj, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        width : '100%',
        height : '100%',
        fillColor : 'rgba(255, 255, 255, 0.5)'
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
    this.rootDOM = goog.dom.getElement(_layerDIV);
    this.listDOM = goog.dom.createDom('ul', {
        'id' : openGDSMobile.Manager.MANAGER_ID,
        'class' : openGDSMobile.Manager.MANAGER_STYLE,
        'style' : 'background-color:' + options.fillColor
    });
    this.visObj = _visObj;
    goog.dom.append(this.rootDOM, this.listDOM);
    options.width = this.rootDOM.style.width;
    options.height = this.rootDOM.style.width;


    this.sortObj = Sortable.create(document.getElementById('openGDSMobileManager'), {
        animation: 150,
        handle: '.' + openGDSMobile.SORTABLE_STYLE,
        onUpdate : function (evt) {
            var length = openGDSMobile.listStatus.length - 1;
            var targetObj = openGDSMobile.listStatus.objs[length - evt.oldIndex];
            var layers = _visObj.mapObj.getLayers().getArray();

            if (evt.oldIndex > evt.newIndex) {  // up
                for (var i = length - evt.oldIndex; i < length - evt.newIndex; i++) {
                    openGDSMobile.listStatus.objs[i] = openGDSMobile.listStatus.objs[i + 1];
                    openGDSMobile.listStatus.objs[i].obj.setZIndex(i + 1);
                }
            } else {  // down
                for (var i = length - evt.oldIndex; i > length - evt.newIndex; i--) {
                    openGDSMobile.listStatus.objs[i] = openGDSMobile.listStatus.objs[i - 1];
                    openGDSMobile.listStatus.objs[i].obj.setZIndex(i + 1);
                }
            }
            openGDSMobile.listStatus.objs[length - evt.newIndex] = targetObj;
            openGDSMobile.listStatus.objs[length - evt.newIndex].obj.setZIndex( (length - evt.newIndex) + 1);


        }
    });
};

/**
 *
 * @param _canvasID
 * @param _type
 * @param _fillColor
 * @param _x
 * @param _y
 */
openGDSMobile.MapManager.drawCanvas = function (_canvasID, _type, _fillColor, _x, _y) { var padding = 20;
    var startX = 0 + padding;
    var startY = 0 + padding;
    _x = _x - (padding*2);
    _y = _y - (padding*2);

    var labelCanvas = document.getElementById(_canvasID).getContext('2d');
    if (_type === 'polygon') {
        labelCanvas.fillStyle = _fillColor;
        labelCanvas.fillRect(startX, startY, _x, _y);
        labelCanvas.lineWidth = 5;
        labelCanvas.strokeStyle = 'rgb(0, 0, 0)';
        labelCanvas.strokeRect(startX, startY, _x, _y);
    } else if (_type === 'point') {
        labelCanvas.beginPath();
        labelCanvas.arc(15, 15, 12, 0, 2 * Math.PI);
        labelCanvas.fillStyle = _fillColor;
        labelCanvas.fill();
        labelCanvas.stroke();
    } else if (_type === 'line') {
        labelCanvas.moveTo(startX, startY);
        labelCanvas.lineTo(_x, _y);
        labelCanvas.strokeStyle = _fillColor;
        labelCanvas.lineWidth = 10;
        labelCanvas.stroke();
    } else {
        labelCanvas.fillStyle = 'rgb(0, 0, 0)';
        labelCanvas.fillRect(startX, startY, _x, _y);
        labelCanvas.strokeRect(startX, startY, _x, _y);
    }

    /***
        향후 리사이즈 되었을 때... 같이 줄어드는 내용.. 추가 예정
     */

};

/**
 *
 * @param _layerName
 * @returns {number}
 */
openGDSMobile.MapManager.prototype.addItem = function (_layerName) {
    if (typeof (_layerName) === 'undefined') {
        console.error('Please input layer name. If you want all the layers that have not been added, Use the addLayers function');
        return -1;
    }
    for(var i = 0; i < openGDSMobile.listStatus.length; i++) {
        if (openGDSMobile.listStatus.objs[i].title === _layerName) {
            console.log('exist layer in list. Therefore not is added');
            return -1;
        }
    }

    var layerObj = openGDSMobile.util.getOlLayer(this.visObj.mapObj, _layerName);

    var type = layerObj.get('type');
    var title = layerObj.get('title');
    var fillColor = layerObj.get('fillColor');

    var itemDOM = goog.dom.createDom('li',{
        'class' : openGDSMobile.Manager.MANAGER_LIST_STYLE
    });
    if (openGDSMobile.listStatus.length === 0) {
        this.listDOM.appendChild(itemDOM);
    } else {
        this.listDOM.insertBefore(itemDOM, this.listDOM.firstChild);
    }

    /*Type Root**/
    var typeDOM = goog.dom.createDom('div',{
        'class' : openGDSMobile.Manager.MANAGER_ITEM_TYPE_STYLE
    });
    itemDOM.appendChild(typeDOM);
    /*Title Root**/
    var titleRootDOM = goog.dom.createDom('div', {
        'id' : 'openGDSMobileWrapper'
    });
    var titleCellDOM = goog.dom.createDom('div', {
        'id' : 'openGDSMobileCell'
    });
    titleRootDOM.appendChild(titleCellDOM);
    itemDOM.appendChild(titleRootDOM);
    /*Setting Root**/
    var settingDOM = goog.dom.createDom('div', {
        'class' : openGDSMobile.Manager.MANAGER_ITEM_SETTING_STYLE
    });
    itemDOM.appendChild(settingDOM);


    /*Type Content**/
    var canvasDOM = goog.dom.createDom('canvas', {
        'id' : 'canvas-' + title,
        'class' : ' '+ openGDSMobile.Manager.MANAGER_ITEM_TYPE_CANVAS_STYLE +' ' + openGDSMobile.SORTABLE_STYLE
    });
    typeDOM.appendChild(canvasDOM);
    //type = 'line';
    openGDSMobile.MapManager.drawCanvas('canvas-' + title, type, fillColor, canvasDOM.width, canvasDOM.height);
    /*Title Content**/
    var titleDOM = goog.dom.createDom('div', {
        'class' : openGDSMobile.Manager.MANAGER_ITEM_TITLE_STYLE
    }, title);
    titleCellDOM.appendChild(titleDOM);

    /*Setting Content**/
    var setBtnDOM = new goog.ui.Button('Setting');
    setBtnDOM.render(settingDOM);
    setBtnDOM.addClassName(openGDSMobile.Manager.MANAGER_SETTING_BTN_STYLE);
    setBtnDOM.setTooltip(title + ' setting Button');
    setBtnDOM.setValue(title);
    goog.events.listen(setBtnDOM,
        goog.ui.Component.EventType.ACTION,
        function (e) {
            //console.log(e.target.getValue());
            var settingBtns = goog.dom.getElementsByTagNameAndClass('button', openGDSMobile.Manager.MANAGER_SETTING_BTN_STYLE);
            goog.array.forEach(settingBtns, function (obj){
                var tmpBtn = new goog.ui.Button();
                tmpBtn.decorate(obj);
                tmpBtn.setEnabled(false);
            });
            var title =  e.target.getValue();
            //중앙 DIV 패널
            var panelDOM = goog.dom.createDom('div', {
                'id' : 'settingPanel',
                'class' : openGDSMobile.Manager.MANAGER_SETTING_PANEL
            });
            document.body.appendChild(panelDOM);
            //Title
            var titleDOM = goog.dom.createDom('h2', {
                'class' : openGDSMobile.Manager.MANAGER_SETTING_PANEL_TITLE
            }, title);
            panelDOM.appendChild(titleDOM);
            //투명도 슬라이드..
            //색상 변경
            //두깨 변경
            //글자 크기 변경
            //종료 버튼
            var closeBtnDOM = new goog.ui.Button('Close');
            closeBtnDOM.render(panelDOM);
            closeBtnDOM.addClassName(openGDSMobile.Manager.MANAGER_SETTING_PANEL_CLOSE);
            goog.events.listen(closeBtnDOM,
                goog.ui.Component.EventType.ACTION,
                function (e) {
                    document.body.removeChild(panelDOM);
                    goog.array.forEach(settingBtns, function (obj){
                        var tmpBtn = new goog.ui.Button();
                        tmpBtn.decorate(obj);
                        tmpBtn.setEnabled(true);
                    });
                });
        }
    );

    

    /*********************/
    openGDSMobile.listStatus.objs.push({
       title : title,
       obj : layerObj
    });
    layerObj.setZIndex(++openGDSMobile.listStatus.length);
};

/**
 *
 */
openGDSMobile.MapManager.prototype.addItems = function () {
    var allLayers = this.visObj.mapObj.getLayers().getArray();

    for(var i = 1; i < allLayers.length; i++) {
        this.addLayer(allLayers[i].get('title'));
    }
};

/**
 *
 * @param _layerName
 * @returns {number}
 */
openGDSMobile.MapManager.prototype.removeItem = function (_layerName) {
    if (typeof (_layerName) === 'undefined') {
        console.error('Please input layer name. ' +
            'If you want all the layers that have not been removed, ' +
            'Use the removeLayers function');
        return -1;
    }
    var layerObj = openGDSMobile.util.getOlLayer(this.visObj.mapObj, _layerName);
    //console.log(layerObj);
    if (layerObj === false) {
        console.error('Not exist layer in list. Therefore not is removed');
        return -1;
    }
    this.visObj.mapObj.removeLayer(layerObj);

    var ulDOM = goog.dom.getElement(openGDSMobile.Manager.MANAGER_ID);
    var items = ulDOM.getElementsByTagName('li');
    goog.array.forEach(items, function (obj, index, arr) {
        var el = goog.dom.getElementsByTagNameAndClass(
            'div',
            openGDSMobile.Manager.MANAGER_ITEM_TITLE_STYLE,
            obj);
        if (el[0].innerHTML === _layerName) {
            obj.parentNode.removeChild(obj);
            openGDSMobile.listStatus.objs.splice(openGDSMobile.listStatus.length - index, 1);
        }
    });
}


/**
 * 
 */
openGDSMobile.MapManager.prototype.removeItems = function () {
    var allLayers = this.visObj.mapObj.getLayers().getArray();
    for(var i = 1; i < allLayers.length; i++) {
        this.removeLayer(allLayers[i].get('title'));
    }
}
goog.provide('openGDSMobile.MapVis');
goog.require('openGDSMobile.util.applyOptions');


//이벤트
/**
 * @constructor
 * @param {String} _mapDIV - 지도 DIV 객체
 * @param {Object} _options - 지도 관련 옵션 (JSON 객체)
 */
openGDSMobile.MapVis = function (_mapDIV, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        lat: 37.582200,
        long: 127.010031,
        mapType: 'OSM',
        baseProj: 'EPSG:3857',
        zoom: 12,
        maxZoom : 18,
        minZoom : 5,
        list : null,
        attribute : null,
        indexedDB : true
    };

    /**
     * @type {boolean}
     * @private
     */
    this.geoLocation = false;

    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);
/*
    if (options.attribute !== null) {
        //this.attrObj =
    }
    if (options.list !== null) {
        //this.listObj =
    }
*/
    if (typeof (ol) === 'undefined') {
        console.error("Not Import OpenLayers 3 Library....");
        return -1;
    }

    var baseView = new ol.View({
        projection : ol.proj.get(options.baseProj),
        center : ol.proj.transform([options.long, options.lat], 'EPSG:4326', options.baseProj),
        zoom : options.zoom,
        maxZoom : options.maxZoom,
        minZoom : options.minZoom
    });
    var baseLayer = new ol.layer.Tile({
            title : 'backgroundMap',
            source : new ol.source.OSM(),
    });
    baseLayer.setZIndex(0);

    /**
     * @private
     * @type {ol.Map}
     */
    this.mapObj = new ol.Map({
        target : _mapDIV,
        layers : [baseLayer],
        view : baseView
    });

    /****Click EVENT ****/
}

/**
 * 지도 객체 받기 함수
 * @returns {ol.Map} OpenLayers 3 지도 객체
 */
openGDSMobile.MapVis.prototype.getMapObj = function () {
    return this.mapObj;
}

/**
 * 텍스트 스타일 적용 함수
 * @private
 * @param {ol.Feature} feature  Vector 단위 객체
 * @param {Number} resolution 지도 해상도
 * @param {String }attrKey 속성정보 키값
 * @returns {ol.style.Text} OpenLayers 3 텍스트 스타일 객체
 */
openGDSMobile.MapVis.textStyleFunction = function (feature, resolution, attrKey) {
    console.log(resolution);
    return new ol.style.Text({
        text : resolution < 76 ? feature.get(attrKey) : ''
    });
};

/**
 * 스타일 적용 함수
 * @param {ol.Feature} feature  Vector 단위 객체
 * @param {Number} resolution 지도 해상도
 * @param {String} type 지도 타입(Polygon, Line, Point)
 * @param {Object} options 스타일 선 및 채우기 색상, 선 굵기, 속성 키 값 투명도  
 * @returns {ol.style.Style} OpenLayers 3 스타일 객체
 */
openGDSMobile.MapVis.styleFunction = function (feature, resolution, type, options) {
    if (type === 'polygon') {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: options.strokeColor,
                width: options.strokeWidth
            }),
            fill: new ol.style.Fill({
                color: options.fillColor
            }),
            text: openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
        });
    } else if (type === 'line') {

    } else if (type === 'point') {
        return new ol.style.Style({
            image : new ol.style.Circle({
                radius : options.radius,
                stroke : new ol.style.Stroke({
                    color: options.strokeColor,
                    width: options.strokeWidth
                }),
                fill : new ol.style.Fill({
                    color : options.fillColor
                }),
                text: openGDSMobile.MapVis.textStyleFunction(feature, resolution, options.attrKey)
            })
        })
    }
}


/**
 * 배경지도 변경
 * @param {String} _mapType - 지도 스타일 이름 (OSM | VWorld)
 */
openGDSMobile.MapVis.prototype.changeBgMap = function (_mapType) {
    if (typeof (_mapType) === 'undefined' ) {
        console.error('Input map type parameter');
        return -1;
    }
    var bgMapLayers = this.mapObj.getLayers();
    var center = this.mapObj.getView().getCenter();
    var zoom = this.mapObj.getView().getZoom();
    var proj = this.mapObj.getView().getProjection();
    var bgMapLayer = null;
    bgMapLayers.forEach(function(_obj, _i){
        var title = _obj.get('title');
        if (title === 'backgroundMap') {
            bgMapLayer = _obj;
        }
    });
    var view = new ol.View({
        projection : proj,
        center : center,
        zoom : zoom,
        maxZoom : 18,
        minZoom : 5
    });
    this.mapObj.setView(view);
    if (_mapType === 'OSM') {
        bgMapLayer.setSource(new ol.source.OSM());
    } else if (_mapType === 'VWorld') {
        bgMapLayer.setSource(
            new ol.source.XYZ(({
                url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
            }))
        );
    }
};

/**
 * GeoJSON 레이어 추가
 * @param {Object} _geoJSON 벡터 GeoJSON 객체
 * @param {String} _type 벡터 타입 (Point | Line | Polygon)
 * @param {String} _title 레이어 제목
 * @param {Object} _options 속성 값, 색상 채우기, 선 색상, 선 너비, 투명도 값 설정
 */
openGDSMobile.MapVis.prototype.addGeoJSONLayer = function (_geoJSON, _type, _title, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        attrKey : null,
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        strokeWidth : 1,
        radius : 5,
        opt : 0.7
    };
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var geoJSONLayer;
    geoJSONLayer = new ol.layer.Vector({
        title: _title,
        source : new ol.source.Vector({
            features : (new ol.format.GeoJSON()).readFeatures(_geoJSON)
        }),
        style : (function (feature, resolution) {
            return openGDSMobile.MapVis.styleFunction(feature, resolution, _type , options);
        })
    });
    geoJSONLayer.set('type', _type);
    geoJSONLayer.set('attrKey', options.attrKey);
    geoJSONLayer.set('fillColor', options.fillColor);
    geoJSONLayer.set('strokeColor', options.strokeColor);
    geoJSONLayer.set('strokeWidth', options.strokeWidth);
    geoJSONLayer.set('opt', options.opt);
    if (typeof (openGDSMobile.util.getOlLayer(this.mapObj, geoJSONLayer.get(_title))) === false) {
        console.error('Layer is not existence');
        return -1;
    }
    geoJSONLayer.setOpacity(options.opt);
    this.mapObj.addLayer(geoJSONLayer);
};

/**
 * 벡터 스타일 변경
 * @param {String} _layerName - 시각화 된 레이어 제목
 * @param {Object} options - 옵션 JSON 객체 키 값 <br>
 *     {type:'polygon', opt : '0.5', attr: null, range: null, xyData: null}<br>
 <ul>
 <li>type(String) : 객체 타입 (polygon, point)</li>
 <li>opt(Number) : 레이어 투명도 </li>
 <li>attr(String) : 속성 이름</li>
 <li>range(Array) : 색상 범위</li>
 <li>xyData(Array) : 색상 데이터</li>
 </ul>
 */
openGDSMobile.MapVis.prototype.changeVectorStyle = function (_layerName, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        fillColor : '#FFFFFF',
        strokeColor : '#000000',
        radius : 5,
        strokeWidth : 1,
        opt : 0.7,
        attrKey : null,
        range : null,
        labelKey : null,
        valueKey : null,
        data : null
    }
    var styleCache = {};
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is existence');
        return -1;
    }
    defaultOptions.attrKey = layerObj.get('attrKey');
    defaultOptions.fillColor = layerObj.get('fillColor');
    defaultOptions.strokeColor = layerObj.get('strokeColor');
    defaultOptions.strokeWidth = layerObj.get('strokeWidth');
    defaultOptions.opt = layerObj.get('opt');
    var type = layerObj.get('type');
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    layerObj.set('attrKey', options.attrKey);
    layerObj.set('fillColor', options.fillColor);
    layerObj.set('strokeColor', options.strokeColor);
    layerObj.set('strokeWidth', options.strokeWidth);
    
    layerObj.setStyle(function(feature, resolution){
        if (options.data === null) {
            return openGDSMobile.MapVis.styleFunction(feature, resolution, type, options);
        } else {
            var i, j;
            var tmpColor = '#FFFFFF';
            var text = resolution < 76 ? feature.get(options.attrKey) : '';
            if (!styleCache[text]){
                if (Array.isArray(options.fillColor)) {
                    for (i = 0; i < data.length; i += 1) {
                        if (text == data[i][options.labelKey]) {
                            for (j = 0; j < options.range.length; j += 1) {
                                if (data[i][options.valueKey] <= options.range[j]){
                                    tmpColor = options.fillColor[j];
                                }
                            }
                        }
                    }
                } else {
                    console.error('Color is not array.')
                }
                styleCache[text] = [openGDSMobile.MapVis.styleFunction(feature, resolution, type, options)];
            }
            return styleCache[text];
        }
    });
    layerObj.setOpacity(options.opt);
};

/**
 * 맵 레이어 삭제
 * @param {String} _layerName 레이어 제목
 */
openGDSMobile.MapVis.prototype.removeLayer = function (_layerName) {
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is not existence');
        return -1;
    }
    this.mapObj.removeLayer(layerObj);
    /*
     if (typeof (this.layerListObj) !== 'undefined') {
        this.layerListObj.removeList(layerName);
     }
     */
}



/**
 * 맵 레이어 시각화 여부
 * @param {String} _layerName - 레이어 이름
 * @param {Boolean} _flag - 시각화 값 설정 [true | false}
 */
openGDSMobile.MapVis.prototype.setVisible = function (_layerName, _flag) {
    var layerObj = openGDSMobile.util.getOlLayer(this.mapObj, _layerName);
    if (typeof (layerObj) === false) {
        console.error('Layer is not existence');
        return -1;
    }
    layerObj.setVisible(_flag);

};


/**
 * 이미지 레이어 시각화
 * @param {String} _imgURL 이미지 주소
 * @param {String} _imgTitle - 이미지 타이틀
 * @param {Object} _options - 옵션
 *
 *
 */
//@param {Array} imgSize - 이미지 사이즈 [width, height]
//@param {Array} imgExtent - 이미지 위치 [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top]
openGDSMobile.MapVis.prototype.addImageLayer = function (_imgUrl, _imgTitle, _options) {
    _options = (typeof (_options) !== 'undefined') ? _options : {};
    var defaultOptions = {
        opt : 0.7,
        extent : [],
        size: 256
    }
    var options = openGDSMobile.util.applyOptions(defaultOptions, _options);

    var imgLayer = new ol.layer.Image({
        opacity : options.opt,
        title : _imgTitle,
        source : new ol.source.ImageStatic({
            url : _imgUrl + '?' + Math.random(),
            imageSize : options.size,
            projection : this.mapObj.getView().getProjection(),
            imageExtent : options.extent
        })
    });

    this.mapObj.addLayer(imgLayer);
}
/**
 * 지도 GPS 트래킹
 * @param {Boolean} sw - Geolocation 설정
 **/
openGDSMobile.MapVis.prototype.trackingGeoLocation = function (_sw) {
    'use strict';
    var location = this.geoLocation
    if (location === null) {
        location = new ol.Geolocation({
            projection:	this.mapObj.getView().getProjection(),
            tracking : true
        });
    }
    if (sw === true) {
        location.once('change:position', function () {
            this.mapObj.getView().setCenter(location.getPosition());
        });
    } else {
        location.un('change:position');
    }
};
goog.provide('openGDSMobile');
 

/**
 * @constructor
 *
 */
openGDSMobile = function () {

};

/**
 * Created by Administrator on 2016-07-02.
 */

/*
 * OGDSM Layer list sorting open source
 * Sortable
 * author	RubaXa   <trash@rubaxa.org>
 * license MIT
 */
(function (factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else if (typeof Package !== "undefined") {
		//noinspection JSUnresolvedVariable
		Sortable = factory();  // export for Meteor.js
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function () {
	"use strict";

	var dragEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,

		scrollEl,
		scrollParentEl,

		lastEl,
		lastCSS,

		oldIndex,
		newIndex,

		activeGroup,
		autoScroll = {},

		tapEvt,
		touchEvt,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,

		supportDraggable = !!('draggable' in document.createElement('div')),


		_silent = false,

		_dispatchEvent = function (rootEl, name, targetEl, fromEl, startIndex, newIndex) {
			var evt = document.createEvent('Event');

			evt.initEvent(name, true, true);

			evt.item = targetEl || rootEl;
			evt.from = fromEl || rootEl;
			evt.clone = cloneEl;

			evt.oldIndex = startIndex;
			evt.newIndex = newIndex;

			rootEl.dispatchEvent(evt);
		},

		_customEvents = 'onAdd onUpdate onRemove onStart onEnd onFilter onSort'.split(' '),

		noop = function () {},

		abs = Math.abs,
		slice = [].slice,

		touchDragOverListeners = [],

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy
				;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							if (el === win) {
								win.scrollTo(win.scrollX + vx * speed, win.scrollY + vy * speed);
							} else {
								vy && (el.scrollTop += vy * speed);
								vx && (el.scrollLeft += vx * speed);
							}
						}, 24);
					}
				}
			}
		}, 30)
	;



	/**
	 * class  Sortable
	 * param  {HTMLElement}  el
	 * param  {Object}       [options]
	 */
	function Sortable(el, options) {
		this.el = el; // root element
		this.options = options = (options || {});

		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			ignore: 'a, img',
			filter: null,
			animation: 0,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}


		var group = options.group;

		if (!group || typeof group != 'object') {
			group = options.group = { name: group };
		}


		['pull', 'put'].forEach(function (key) {
			if (!(key in group)) {
				group[key] = true;
			}
		});


		// Define events
		_customEvents.forEach(function (name) {
			options[name] = _bind(this, options[name] || noop);
			_on(el, name.substr(2).toLowerCase(), options[name]);
		}, this);


		// Export options
		options.groups = ' ' + group.name + (group.put.join ? ' ' + group.put.join(' ') : '') + ' ';
		el[expando] = options;


		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_') {
				this[fn] = _bind(this, this[fn]);
			}
		}


		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);

		_on(el, 'dragover', this);
		_on(el, 'dragenter', this);

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,


		_dragStarted: function () {
			if (rootEl && dragEl) {
				// Apply effect
				_toggleClass(dragEl, this.options.ghostClass, true);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(rootEl, 'start', dragEl, rootEl, oldIndex);
			}
		},


		_onTapStart: function (/**Event|TouchEvent*/evt) {
			var type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = target,
				options =  this.options,
				el = this.el,
				filter = options.filter;

			if (type === 'mousedown' && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			// get the index of the dragged element within its parent
			oldIndex = _index(target);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(originalTarget, 'filter', target, el, oldIndex);
					evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(criteria, 'filter', target, el, oldIndex);
						return true;
					}
				});

				if (filter) {
					evt.preventDefault();
					return; // cancel dnd
				}
			}


			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}


			// Prepare `dragstart`
			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = this.el;
				dragEl = target;
				nextEl = dragEl.nextSibling;
				activeGroup = this.options.group;

				dragEl.draggable = true;

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(target, criteria.trim(), _disableDraggable);
				});

				if (touch) {
					// Touch device support
					tapEvt = {
						target: target,
						clientX: touch.clientX,
						clientY: touch.clientY
					};

					this._onDragStart(tapEvt, 'touch');
					evt.preventDefault();
				}

				_on(document, 'mouseup', this._onDrop);
				_on(document, 'touchend', this._onDrop);
				_on(document, 'touchcancel', this._onDrop);

				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);

				if (!supportDraggable) {
					this._onDragStart(tapEvt, true);
				}

				try {
					if (document.selection) {
						document.selection.empty();
					} else {
						window.getSelection().removeAllRanges();
					}
				} catch (err) {
				}
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				_css(ghostEl, 'display', 'none');

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					parent = target,
					groupName = ' ' + this.options.group.name + '',
					i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando] && parent[expando].groups.indexOf(groupName) > -1) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				_css(ghostEl, 'display', '');
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				var touch = evt.touches ? evt.touches[0] : evt,
					dx = touch.clientX - tapEvt.clientX,
					dy = touch.clientY - tapEvt.clientY,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},


		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
				options = this.options;

			this._offUpEvents();

			if (activeGroup.pull == 'clone') {
				cloneEl = dragEl.cloneNode(true);
				_css(cloneEl, 'display', 'none');
				rootEl.insertBefore(cloneEl, dragEl);
			}

			if (useFallback) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');

				rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);

				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 150);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
			}

			setTimeout(this._dragStarted, 0);
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				revert,
				options = this.options,
				group = options.group,
				groupPut = group.put,
				isOwner = (activeGroup === group),
				canSort = options.sort;

			if (!dragEl) {
				return;
			}

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (activeGroup && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl))
					: activeGroup.pull && groupPut && (
						(activeGroup.name === group.name) || // by Name
						(groupPut.indexOf && ~groupPut.indexOf(activeGroup.name)) // by Array
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el)
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();


				if (revert) {
					_cloneHide(true);

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (target = _ghostInBottom(el, evt))
				) {
					if (target) {
						if (target.animated) {
							return;
						}
						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(isOwner);

					el.appendChild(dragEl);
					this._animate(dragRect, dragEl);
					target && this._animate(targetRect, target);
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
					}


					var targetRect = target.getBoundingClientRect(),
						width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						after
					;

					_silent = true;
					setTimeout(_unsilent, 30);

					_cloneHide(isOwner);

					if (floating) {
						after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
					} else {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}

					if (after && !nextSibling) {
						el.appendChild(dragEl);
					} else {
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
					}

					this._animate(dragRect, dragEl);
					this._animate(targetRect, target);
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			_off(document, 'mouseup', this._onDrop);
			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'touchend', this._onDrop);
			_off(document, 'touchcancel', this._onDrop);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);

			// Unbind events
			_off(document, 'drop', this);
			_off(document, 'mousemove', this._onTouchMove);
			_off(el, 'dragstart', this._onDragStart);

			this._offUpEvents();

			if (evt) {
				evt.preventDefault();
				!options.dropBubble && evt.stopPropagation();

				ghostEl && ghostEl.parentNode.removeChild(ghostEl);

				if (dragEl) {
					_off(dragEl, 'dragend', this);

					_disableDraggable(dragEl);
					_toggleClass(dragEl, this.options.ghostClass, false);

					if (rootEl !== dragEl.parentNode) {
						newIndex = _index(dragEl);

						// drag from one list and drop into another
						_dispatchEvent(dragEl.parentNode, 'sort', dragEl, rootEl, oldIndex, newIndex);
						_dispatchEvent(rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);

						// Add event
						_dispatchEvent(dragEl, 'add', dragEl, rootEl, oldIndex, newIndex);

						// Remove event
						_dispatchEvent(rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);
					}
					else {
						// Remove clone
						cloneEl && cloneEl.parentNode.removeChild(cloneEl);

						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl);

							// drag & drop within the same list
							_dispatchEvent(rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
						}
					}

					// Drag end event
					Sortable.active && _dispatchEvent(rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);
				}

				// Nulling
				rootEl =
				dragEl =
				ghostEl =
				nextEl =
				cloneEl =

				scrollEl =
				scrollParentEl =

				tapEvt =
				touchEvt =

				lastEl =
				lastCSS =

				activeGroup =
				Sortable.active = null;

				// Save sorting
				this.save();
			}
		},


		handleEvent: function (/**Event*/evt) {
			var type = evt.type;

			if (type === 'dragover' || type === 'dragenter') {
				this._onDragOver(evt);
				_globalDragOver(evt);
			}
			else if (type === 'drop' || type === 'dragend') {
				this._onDrop(evt);
			}
		},


		/*
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, this.options.draggable, this.el)) {
					order.push(el.getAttribute('data-id') || _generateId(el));
				}
			}

			return order;
		},


		/*
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/*
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/*
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/*
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;
			}
		},


		/*
		 * Destroy
		 */
		destroy: function () {
			var el = this.el, options = this.options;

			_customEvents.forEach(function (name) {
				_off(el, name.substr(2).toLowerCase(), options[name]);
			});

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);

			_off(el, 'dragover', this);
			_off(el, 'dragenter', this);

			//remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = null;
		}
	};


	function _cloneHide(state) {
		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');
			!state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);
			cloneEl.state = state;
		}
	}


	function _bind(ctx, fn) {
		var args = slice.call(arguments, 2);
		return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function () {
			return fn.apply(ctx, args.concat(slice.call(arguments)));
		};
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')\\s', 'g');

			do {
				if (
					(tag === '>*' && el.parentNode === ctx) || (
						(tag === '' || el.nodeName.toUpperCase() == tag) &&
						(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
					)
				) {
					return el;
				}
			}
			while (el !== ctx && (el = el.parentNode));
		}

		return null;
	}


	function _globalDragOver(/**Event*/evt) {
		evt.dataTransfer.dropEffect = 'move';
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(/\s+/g, ' ').replace(' ' + name + ' ', '');
				el.className = className + (state ? ' ' + name : '');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/* @returns {HTMLElement|false} */
	function _ghostInBottom(el, evt) {
		var lastEl = el.lastElementChild, rect = lastEl.getBoundingClientRect();
		return (evt.clientY - (rect.top + rect.height) > 5) && lastEl; // min delta
	}


	/*
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/*
	 * Returns the index of an element within its parent
	 * @param el
	 * @returns {number}
	 * @private
	 */
	function _index(/**HTMLElement*/el) {
		var index = 0;
		while (el && (el = el.previousElementSibling)) {
			if (el.nodeName.toUpperCase() !== 'TEMPLATE') {
				index++;
			}
		}
		return index;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}


	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		bind: _bind,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		dispatchEvent: _dispatchEvent,
		index: _index
	};


	Sortable.version = '1.1.1';


	/*
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};

	// Export
	return Sortable;
});

goog.provide('openGDSMobile.util.jsonToArray');
goog.provide('openGDSMobile.util.applyOptions');
goog.provide('openGDSMobile.util.getOlLayer');
goog.require('goog.array');


openGDSMobile.util.jsonToArray = function (obj, x, y) {
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
    xyAxis[1] = [];
    goog.array.forEach(row, function (position, index, arr) {
        xyAxis[0].push(row[index][x]);
        xyAxis[1].push(row[index][y]);
    });
    return xyAxis;
}
openGDSMobile.util.applyOptions = function (defaults, options) {
    var name = null;
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    return defaults;
}

openGDSMobile.util.getOlLayer = function (_olObj, _name) {
    var mapArray = _olObj.getLayers().getArray();
    var result = false;
    goog.array.forEach(mapArray, function (obj, index, arr) {
        if (obj.get('title') === _name) {
            result = obj;
        }
    });
    return result;
}




/**
 * Created by Administrator on 2016-07-06.
 */

/**
 * Created by Administrator on 2016-07-02.
 */
