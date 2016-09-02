var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C;
            (function (PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C) {
                /**
                 * Singleton reference of ColorPalette.
                 *
                 * @instance
                 */
                var colorManager;
                /**
                 * Factory method for creating a ColorPalette.
                 *
                 * @function
                 * @param {IColorInfo[]} colors - Array of ColorInfo objects that contain
                 *                                hex values for colors.
                 */
                function createColorPalette(colors) {
                    if (!colorManager)
                        colorManager = new ColorPalette(colors);
                    return colorManager;
                }
                PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.createColorPalette = createColorPalette;
                var ColorPalette = (function () {
                    function ColorPalette(colors) {
                        this.colorPalette = {};
                        this.colorIndex = 0;
                        this.colors = colors;
                    }
                    /**
                     * Gets color from colorPalette and returns an IColorInfo
                     *
                     * @function
                     * @param {string} key - Key of assign color in colorPalette.
                     */
                    ColorPalette.prototype.getColor = function (key) {
                        var color = this.colorPalette[key];
                        if (color) {
                            return color;
                        }
                        var colors = this.colors;
                        color = this.colorPalette[key] = colors[this.colorIndex++];
                        if (this.colorIndex >= colors.length) {
                            this.colorIndex = 0;
                        }
                        return color;
                    };
                    /**
                     * resets colorIndex to 0
                     *
                     * @function
                     */
                    ColorPalette.prototype.reset = function () {
                        this.colorIndex = 0;
                        return this;
                    };
                    /**
                     * Clears colorPalette of cached keys and colors
                     *
                     * @function
                     */
                    ColorPalette.prototype.clear = function () {
                        this.colorPalette = {};
                    };
                    return ColorPalette;
                }());
            })(PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C || (visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C;
            (function (PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C) {
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue = getValue;
                /**
                 * Gets property value for a particular object in a category.
                 *
                 * @function
                 * @param {DataViewCategoryColumn} category - List of category objects.
                 * @param {number} index                    - Index of category object.
                 * @param {string} objectName               - Name of desired object.
                 * @param {string} propertyName             - Name of desired property.
                 * @param {T} defaultValue                  - Default value of desired property.
                 */
                function getCategoricalObjectValue(category, index, objectName, propertyName, defaultValue) {
                    var categoryObjects = category.objects;
                    if (categoryObjects) {
                        var categoryObject = categoryObjects[index];
                        if (categoryObject) {
                            var object = categoryObject[objectName];
                            if (object) {
                                var property = object[propertyName];
                                if (property !== undefined) {
                                    return property;
                                }
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getCategoricalObjectValue = getCategoricalObjectValue;
            })(PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C || (visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C;
            (function (PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C) {
                var TextUtility;
                (function (TextUtility) {
                    var canvasCtx;
                    var ellipsis = '…';
                    function ensureCanvas() {
                        if (canvasCtx)
                            return;
                        var canvas = document.createElement('canvas');
                        canvasCtx = canvas.getContext("2d");
                    }
                    /**
                     * Measures text width at a high speed using a canvas element
                     * @param textProperties The text properties (including text content) to use for text measurement.
                     */
                    function measureTextWidth(textProperties) {
                        ensureCanvas();
                        canvasCtx.font =
                            (textProperties.fontStyle || "") + " " +
                                (textProperties.fontVariant || "") + " " +
                                (textProperties.fontWeight || "") + " " +
                                textProperties.fontSize + " " +
                                (textProperties.fontFamily);
                        return canvasCtx.measureText(textProperties.text).width;
                    }
                    TextUtility.measureTextWidth = measureTextWidth;
                    TextUtility.measureTextWidth = measureTextWidth;
                    /**
                     * Compares labels text size to the available size and renders ellipses when the available size is smaller.
                     * @param textProperties The text properties (including text content) to use for text measurement.
                     * @param maxWidth The maximum width available for rendering the text.
                     */
                    function getTailoredTextOrDefault(textProperties, maxWidth) {
                        ensureCanvas();
                        var strLength = textProperties.text.length;
                        if (strLength === 0)
                            return textProperties.text;
                        var width = measureTextWidth(textProperties);
                        if (width < maxWidth)
                            return textProperties.text;
                        // Create a copy of the textProperties so we don't modify the one that's passed in.
                        var copiedTextProperties = Object.create(textProperties);
                        // Take the properties and apply them to svgTextElement
                        // Then, do the binary search to figure out the substring we want
                        // Set the substring on textElement argument
                        var text = copiedTextProperties.text = ellipsis + copiedTextProperties.text;
                        var min = 1;
                        var max = text.length;
                        var i = ellipsis.length;
                        while (min <= max) {
                            // num | 0 prefered to Math.floor(num) for performance benefits
                            i = (min + max) / 2 | 0;
                            copiedTextProperties.text = text.substr(0, i);
                            width = measureTextWidth(copiedTextProperties);
                            if (maxWidth > width)
                                min = i + 1;
                            else if (maxWidth < width)
                                max = i - 1;
                            else
                                break;
                        }
                        // Since the search algorithm almost never finds an exact match,
                        // it will pick one of the closest two, which could result in a
                        // value bigger with than 'maxWidth' thus we need to go back by 
                        // one to guarantee a smaller width than 'maxWidth'.
                        copiedTextProperties.text = text.substr(0, i);
                        width = measureTextWidth(copiedTextProperties);
                        if (width > maxWidth)
                            i--;
                        return text.substr(ellipsis.length, i - ellipsis.length) + ellipsis;
                    }
                    TextUtility.getTailoredTextOrDefault = getTailoredTextOrDefault;
                })(TextUtility = PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.TextUtility || (PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.TextUtility = {}));
            })(PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C || (visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Sparkline by OKViz
 *  v1.0.0
 *
 *  Copyright (c) SQLBI. OKViz is a trademark of SQLBI Corp.
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C;
            (function (PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C) {
                function defaultSettings() {
                    return {
                        label: {
                            show: true,
                            text: '',
                            fontSize: 14,
                            fill: { solid: { color: "#333" } },
                            autoSize: true
                        },
                        value: {
                            show: false,
                            aggregate: 'cur',
                            fontSize: 14,
                            fill: { solid: { color: "#333" } }
                        },
                        line: {
                            axis: 'ignore',
                            kind: "linear",
                            fill: { solid: { color: "#333" } },
                            weight: 2
                        },
                        area: {
                            show: false,
                            fill: { solid: { color: "#CCC" } },
                            transparency: 50
                        },
                        target: {
                            fill: { solid: { color: "#F2C811" } },
                            rangeFill: { solid: { color: "#EEE" } }
                        },
                        hiLoPoints: {
                            hiShow: true,
                            hiFill: { solid: { color: "#7DC172" } },
                            loShow: true,
                            loFill: { solid: { color: "#FD625E" } },
                            curShow: false,
                            curFill: { solid: { color: "#333" } }
                        }
                    };
                }
                function visualTransform(options, host) {
                    //Get DataViews
                    var dataViews = options.dataViews;
                    var hasDataViews = (dataViews && dataViews[0]);
                    var hasCategoricalData = (hasDataViews && dataViews[0].categorical && dataViews[0].categorical.values);
                    var hasSettings = (hasDataViews && dataViews[0].metadata && dataViews[0].metadata.objects);
                    //Get Settings
                    var settings = defaultSettings();
                    if (hasSettings) {
                        var objects = dataViews[0].metadata.objects;
                        settings = {
                            label: {
                                show: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "label", "show", settings.label.show),
                                text: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "label", "text", settings.label.text),
                                fontSize: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "label", "fontSize", settings.label.fontSize),
                                fill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "label", "fill", settings.label.fill),
                                autoSize: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "label", "autoSize", settings.label.autoSize)
                            },
                            value: {
                                show: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "value", "show", settings.value.show),
                                aggregate: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "value", "aggregate", settings.value.aggregate),
                                fontSize: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "value", "fontSize", settings.value.fontSize),
                                fill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "value", "fill", settings.value.fill),
                                unit: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "value", "unit", settings.value.unit),
                                precision: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "value", "precision", settings.value.precision)
                            },
                            line: {
                                axis: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "line", "axis", settings.line.axis),
                                kind: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "line", "kind", settings.line.kind),
                                fill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "line", "fill", settings.line.fill),
                                weight: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "line", "weight", settings.line.weight)
                            },
                            area: {
                                show: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "area", "show", settings.area.show),
                                fill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "area", "fill", settings.area.fill),
                                transparency: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "area", "transparency", settings.area.transparency)
                            },
                            target: {
                                fill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "target", "fill", settings.target.fill),
                                rangeFill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "target", "rangeFill", settings.target.rangeFill),
                            },
                            hiLoPoints: {
                                hiShow: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "hiLoPoints", "hiShow", settings.hiLoPoints.hiShow),
                                hiFill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "hiLoPoints", "hiFill", settings.hiLoPoints.hiFill),
                                loShow: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "hiLoPoints", "loShow", settings.hiLoPoints.loShow),
                                loFill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "hiLoPoints", "loFill", settings.hiLoPoints.loFill),
                                curShow: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "hiLoPoints", "curShow", settings.hiLoPoints.curShow),
                                curFill: PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.getValue(objects, "hiLoPoints", "curFill", settings.hiLoPoints.curFill)
                            }
                        };
                        //Limit some properties
                        if (settings.line.weight < 1)
                            settings.line.weight = 1;
                        if (settings.value.precision < 0)
                            settings.value.precision = 0;
                        if (settings.value.precision > 5)
                            settings.value.precision = 5;
                    }
                    //Get DataPoints
                    var dataPoints = [];
                    if (hasCategoricalData) {
                        var dataCategorical = dataViews[0].categorical;
                        var hasCategoryFilled = (dataCategorical.categories && dataCategorical.categories[0]);
                        var hasMultipleMeasuresWithSameRole = false;
                        var categories = [];
                        if (hasCategoryFilled) {
                            var category = dataCategorical.categories[0];
                            for (var i = 0; i < category.values.length; i++) {
                                categories.push(category.values[i]);
                            }
                        }
                        else {
                            for (var i = 0; i < dataCategorical.values.length; i++) {
                                if (dataCategorical.values[i].source.roles['measure']) {
                                    if (categories.indexOf(dataCategorical.values[i].source.displayName) == -1) {
                                        categories.push(dataCategorical.values[i].source.displayName);
                                        if (categories.length > 1)
                                            hasMultipleMeasuresWithSameRole = true;
                                    }
                                }
                            }
                            if (settings.label.text && !hasMultipleMeasuresWithSameRole)
                                categories[0] = settings.label.text;
                        }
                        for (var i = 0; i < categories.length; i++) {
                            var displayValue = 0;
                            var values = [];
                            var target = { value: null, min: null, max: null };
                            for (var ii = 0; ii < dataCategorical.values.length; ii++) {
                                //TODO add to tooltips
                                //var dataGroupName = dataCategorical.values[ii].source.groupName; 
                                var dataValue = dataCategorical.values[ii];
                                var value = dataValue.values[(hasMultipleMeasuresWithSameRole ? 0 : i)];
                                if (value || settings.line.axis === 'setToZero') {
                                    if (dataValue.source.roles['measure']) {
                                        if (!hasMultipleMeasuresWithSameRole || dataValue.source.displayName == categories[i]) {
                                            values.push(value);
                                            if (settings.value.aggregate == 'sum' || settings.value.aggregate == 'avg') {
                                                displayValue += value;
                                            }
                                        }
                                    }
                                    if (dataValue.source.roles['target'] && !target.value) {
                                        target.value = value;
                                    }
                                    if (dataValue.source.roles['targetRangeMin'] && !target.min) {
                                        target.min = value;
                                    }
                                    if (dataValue.source.roles['targetRangeMax'] && !target.max) {
                                        target.max = value;
                                    }
                                }
                            }
                            if (settings.value.aggregate == 'cur') {
                                displayValue = values[values.length - 1];
                            }
                            else if (settings.value.aggregate == 'avg') {
                                displayValue = displayValue / dataCategorical.values.length;
                            }
                            dataPoints.push({
                                values: values,
                                target: target,
                                category: categories[i],
                                displayValue: displayValue,
                                selectionId: (hasCategoryFilled ?
                                    host.createSelectionIdBuilder()
                                        .withCategory(dataCategorical.categories[0], i).createSelectionId() : null)
                            });
                        }
                    }
                    return {
                        dataPoints: dataPoints,
                        settings: settings,
                    };
                }
                var Visual = (function () {
                    function Visual(options) {
                        this.host = options.host;
                        this.selectionManager = options.host.createSelectionManager();
                        this.model = { dataPoints: [], settings: {} };
                        this.element = options.element;
                        var svg = this.svg = d3.select(this.element)
                            .append('svg')
                            .classed('chart', true);
                    }
                    Visual.prototype.update = function (options) {
                        this.model = visualTransform(options, this.host);
                        var width = options.viewport.width;
                        var height = options.viewport.height;
                        this.svg.attr({
                            width: width,
                            height: height
                        })
                            .style('padding', (this.model.settings.line.weight + 2) + 'px');
                        var margin = { top: 10, left: 10, bottom: 10, right: 10 };
                        var slotHeight = height / this.model.dataPoints.length;
                        var chartHeight = slotHeight - margin.top - margin.bottom;
                        var labelWidth = 0;
                        var valueWidth = 0;
                        if (this.model.settings.label.show || this.model.settings.value.show) {
                            for (var i = 0; i < this.model.dataPoints.length; i++) {
                                var dataPoint = this.model.dataPoints[i];
                                if (this.model.settings.label.show) {
                                    var labelText = dataPoint.category;
                                    var props = { text: labelText, fontFamily: 'sans-serif', fontSize: this.model.settings.label.fontSize + 'px' };
                                    if (this.model.settings.label.autoSize) {
                                        var currentLabelWidth = PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.TextUtility.measureTextWidth(props);
                                        labelWidth = Math.max(labelWidth, currentLabelWidth);
                                    }
                                    else {
                                        labelWidth = 100;
                                        dataPoint.category = PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.TextUtility.getTailoredTextOrDefault(props, labelWidth);
                                    }
                                }
                                if (this.model.settings.value.show) {
                                    var value = dataPoint.displayValue;
                                    //TODO Format value
                                    var props = { text: String(value), fontFamily: 'sans-serif', fontSize: this.model.settings.value.fontSize + 'px' };
                                    var currentValueWidth = PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.TextUtility.measureTextWidth(props);
                                    valueWidth = Math.max(valueWidth, currentValueWidth);
                                }
                            }
                        }
                        this.svg.selectAll('.sparkline, .sparklineArea, .label, .value, .point, .target').remove();
                        var _loop_1 = function(i) {
                            var dataPoint = this_1.model.dataPoints[i];
                            var topValue = { index: 0, value: 0 };
                            var bottomValue = { index: 0, value: Infinity };
                            for (var ii = 0; ii < dataPoint.values.length; ii++) {
                                if (dataPoint.values[ii] > topValue.value) {
                                    topValue.index = ii;
                                    topValue.value = dataPoint.values[ii];
                                }
                                if (dataPoint.values[ii] < bottomValue.value) {
                                    bottomValue.index = ii;
                                    bottomValue.value = dataPoint.values[ii];
                                }
                            }
                            //We didn't use the following function because we need Min/Max/Index in the array
                            //Math.max.apply(null, dataPoint.values);
                            var x = d3.scale.linear()
                                .domain([0, dataPoint.values.length - 1])
                                .range([labelWidth + margin.left, width - margin.right - valueWidth]);
                            var y = d3.scale.linear()
                                .domain([topValue.value, bottomValue.value])
                                .range([(i * slotHeight), (i * slotHeight) + margin.top + chartHeight]);
                            if (dataPoint.target.min && dataPoint.target.max) {
                                this_1.svg.append('rect')
                                    .classed('target', true)
                                    .attr('x', labelWidth + margin.left)
                                    .attr('width', width - valueWidth)
                                    .attr('y', y(dataPoint.target.min))
                                    .attr('height', y(dataPoint.target.max))
                                    .attr('fill', this_1.model.settings.target.rangeFill.solid.color);
                            }
                            if (dataPoint.target.value) {
                                this_1.svg.append('line')
                                    .classed('target', true)
                                    .attr('x1', labelWidth + margin.left)
                                    .attr('x2', width - valueWidth)
                                    .attr('y1', y(dataPoint.target.value))
                                    .attr('y2', y(dataPoint.target.value))
                                    .attr('stroke-width', this_1.model.settings.line.weight)
                                    .attr('stroke', this_1.model.settings.target.fill.solid.color);
                            }
                            var line = d3.svg.line()
                                .x(function (d, j) {
                                return x(j);
                            })
                                .y(function (d) {
                                return y(d);
                            })
                                .interpolate(this_1.model.settings.line.kind);
                            if (this_1.model.settings.area.show) {
                                var area = d3.svg.area()
                                    .x(function (d, j) {
                                    return x(j);
                                })
                                    .y0(((i + 1) * slotHeight) - margin.bottom + this_1.model.settings.line.weight)
                                    .y1(function (d) {
                                    return y(d);
                                })
                                    .interpolate(this_1.model.settings.line.kind);
                                var chartArea = this_1.svg.append("path").data([dataPoint.values]).classed('sparklineArea', true);
                                chartArea.attr("d", area(dataPoint.values))
                                    .attr('fill', this_1.model.settings.area.fill.solid.color)
                                    .attr('fill-opacity', this_1.model.settings.area.transparency / 100);
                            }
                            var chart = this_1.svg.append("path").data([dataPoint.values]).classed('sparkline', true);
                            chart.attr("d", line(dataPoint.values))
                                .attr('stroke-linecap', 'round')
                                .attr('stroke-width', this_1.model.settings.line.weight)
                                .attr('stroke', this_1.model.settings.line.fill.solid.color)
                                .attr('fill', 'none');
                            var pointRay = this_1.model.settings.line.weight * 2;
                            if (this_1.model.settings.hiLoPoints.curShow) {
                                this_1.svg.append('circle')
                                    .classed('point', true)
                                    .attr('cx', x(dataPoint.values.length - 1))
                                    .attr('cy', y(dataPoint.values[dataPoint.values.length - 1]))
                                    .attr('r', pointRay)
                                    .attr('fill', this_1.model.settings.hiLoPoints.curFill.solid.color);
                            }
                            if (this_1.model.settings.hiLoPoints.hiShow) {
                                this_1.svg.append('circle')
                                    .classed('point', true)
                                    .attr('cx', x(topValue.index))
                                    .attr('cy', y(topValue.value))
                                    .attr('r', pointRay)
                                    .attr('fill', this_1.model.settings.hiLoPoints.hiFill.solid.color);
                            }
                            if (this_1.model.settings.hiLoPoints.loShow) {
                                this_1.svg.append('circle')
                                    .classed('point', true)
                                    .attr('cx', x(bottomValue.index))
                                    .attr('cy', y(bottomValue.value))
                                    .attr('r', pointRay)
                                    .attr('fill', this_1.model.settings.hiLoPoints.loFill.solid.color);
                            }
                            if (this_1.model.settings.label.show) {
                                var label = this_1.svg.append('text')
                                    .classed('label', true);
                                label.text(dataPoint.category)
                                    .attr('x', 0)
                                    .attr('y', (i * slotHeight) + (slotHeight / 2))
                                    .style('font-size', this_1.model.settings.label.fontSize + 'px')
                                    .attr('fill', this_1.model.settings.label.fill.solid.color);
                            }
                            if (this_1.model.settings.value.show) {
                                var label = this_1.svg.append('text')
                                    .classed('value', true);
                                label.text(dataPoint.displayValue)
                                    .attr('x', width - valueWidth)
                                    .attr('y', (i * slotHeight) + (slotHeight / 2))
                                    .style('font-size', this_1.model.settings.value.fontSize + 'px')
                                    .style('font-weight', 'bold')
                                    .attr('fill', this_1.model.settings.value.fill.solid.color);
                            }
                        };
                        var this_1 = this;
                        for (var i = 0; i < this.model.dataPoints.length; i++) {
                            _loop_1(i);
                        }
                    };
                    Visual.prototype.destroy = function () {
                    };
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'label':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        "show": this.model.settings.label.show,
                                        "text": this.model.settings.label.text,
                                        "fontSize": this.model.settings.label.fontSize,
                                        "autoSize": this.model.settings.label.autoSize,
                                        "fill": this.model.settings.label.fill
                                    },
                                    selector: null
                                });
                                break;
                            case 'value':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        "show": this.model.settings.value.show,
                                        "aggregate": this.model.settings.value.aggregate,
                                        "fontSize": this.model.settings.value.fontSize,
                                        "unit": this.model.settings.value.unit,
                                        "precision": this.model.settings.value.precision,
                                        "fill": this.model.settings.value.fill
                                    },
                                    selector: null
                                });
                                break;
                            case 'line':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        "axis": this.model.settings.line.axis,
                                        "kind": this.model.settings.line.kind,
                                        "weight": this.model.settings.line.weight,
                                        "fill": this.model.settings.line.fill
                                    },
                                    selector: null
                                });
                                break;
                            case 'area':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        "show": this.model.settings.area.show,
                                        "fill": this.model.settings.area.fill,
                                        "transparency": this.model.settings.area.transparency
                                    },
                                    selector: null
                                });
                                break;
                            case 'target':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        "fill": this.model.settings.target.fill,
                                        "rangeFill": this.model.settings.target.rangeFill
                                    },
                                    selector: null
                                });
                                break;
                            case 'hiLoPoints':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        "hiShow": this.model.settings.hiLoPoints.hiShow,
                                        "hiFill": this.model.settings.hiLoPoints.hiFill,
                                        "loShow": this.model.settings.hiLoPoints.loShow,
                                        "loFill": this.model.settings.hiLoPoints.loFill,
                                        "curShow": this.model.settings.hiLoPoints.curShow,
                                        "curFill": this.model.settings.hiLoPoints.curFill
                                    },
                                    selector: null
                                });
                                break;
                        }
                        ;
                        return objectEnumeration;
                    };
                    return Visual;
                }());
                PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.Visual = Visual;
            })(PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C || (visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C = {
                name: 'PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C',
                displayName: 'Sparkline by OKViz - v1.0.0',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.1.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map