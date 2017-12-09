/*
 *  Sparkline by OKViz
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
import tooltip = powerbi.extensibility.utils.tooltip;
import TooltipEnabledDataPoint = powerbi.extensibility.utils.tooltip.TooltipEnabledDataPoint;
import TooltipEventArgs = powerbi.extensibility.utils.tooltip.TooltipEventArgs;

module powerbi.extensibility.visual {

    interface VisualMeta {
        name: string;
        version: string;
        dev: boolean;
    }

     interface VisualViewModel {
        dataPoints: VisualDataPoint[];
        settings: VisualSettings;
    }

    interface VisualDataPointTarget {
        value: number;
        min: number;
        max:number;
    }

    interface VisualDataPoint {
        values: any[];
        identities: any[];
        axis: any[];
        tooltips: any[];
        format?: string;
        target: VisualDataPointTarget;
        category?: string;
        displayName: string;
        displayValue: number;
        selectionId: any;
    }

    interface VisualSettings {
        label: {
            show: boolean;
            text: string;
            fontSize: number;
            fontFamily: string;
            fill: Fill;
            autoSize: boolean;
        };
        value : {
            show: boolean;
            aggregate: string;
            fontSize: number;
            fontFamily: string;
            fill: Fill;
            unit?: number;
            precision?: number; 
            locale?: string;
        };
        line: {
            axis: string,
            kind: string;
            fill: Fill;
            weight: number;
            minHeight?: number; 
            start?: number;
            end?: number;
            baseline: boolean;
        };
        area: {
            show: boolean;
            fill: Fill;
            transparency: number;
        };
        target: {
            fill: Fill;
            rangeFill: Fill;
        };
        hiLoPoints: {
            showAllPoints: boolean;
            hiShow: boolean;
            hiFill: Fill;
            loShow: boolean;
            loFill: Fill;
            curShow: boolean;
            curFill: Fill;
        };
        colorBlind?: {
            vision?: string;
        };
    }

    function defaultSettings(): VisualSettings {

        return {
            label: {
               show: true,
               text: '',
               fontSize: 9,
               fontFamily: '"Segoe UI", wf_segoe-ui_normal, helvetica, arial, sans-serif',
               fill: {solid: { color: "#777" } },
               autoSize: true
            },
            value: {
               show: false,
               aggregate: 'cur',
               fontSize: 9,
               fontFamily: 'wf_standard-font,helvetica,arial,sans-serif',
               fill: {solid: { color: "#777" } },
               unit: 0,
               locale: ""
            },
            line: {
               axis: 'ignore',
               kind: 'monotone',
               fill: {solid: { color: "#333" } },
               weight: 2,
               baseline: false
            },
            area: {
               show: false,
               fill: { solid: { color: "#CCC" } },
               transparency: 50
            },
            target: {
                fill: {solid: { color: "#F2C811" } },
                rangeFill: {solid: { color: "#EEE" } }
            },
            hiLoPoints: {
               showAllPoints: false,
               hiShow: true,
               hiFill: {solid: { color: "#399599" } },
               loShow: true,
               loFill: {solid: { color: "#FD625E" } },
               curShow: false,
               curFill: {solid: { color: "#333" } }
            },
            colorBlind: {
                vision: "Normal"
            }
        };
    }

    function visualTransform(options: VisualUpdateOptions, host: IVisualHost): VisualViewModel {

        //Get DataViews
        let dataViews = options.dataViews;
        let hasDataViews = (dataViews && dataViews[0]);
        let hasCategoricalData = (hasDataViews && dataViews[0].categorical && dataViews[0].categorical.values);
        let hasSettings = (hasDataViews && dataViews[0].metadata && dataViews[0].metadata.objects);

        //Get Settings
        let settings: VisualSettings = defaultSettings();
        if (hasSettings) {
            let objects = dataViews[0].metadata.objects;
            settings = {
                label: {
                    show: getValue<boolean>(objects, "label", "show", settings.label.show),
                    text: getValue<string>(objects, "label", "text", settings.label.text),
                    fontSize: getValue<number>(objects, "label", "fontSize", settings.label.fontSize),
                    fontFamily: getValue<string>(objects, "label", "fontFamily", settings.label.fontFamily),
                    fill: getValue<Fill>(objects, "label", "fill", settings.label.fill),
                    autoSize: getValue<boolean>(objects, "label", "autoSize", settings.label.autoSize)
                },
                value: {
                    show: getValue<boolean>(objects, "value", "show", settings.value.show),
                    aggregate: getValue<string>(objects, "value", "aggregate", settings.value.aggregate),
                    fontSize: getValue<number>(objects, "value", "fontSize", settings.value.fontSize),
                    fontFamily: getValue<string>(objects, "value", "fontFamily", settings.value.fontFamily),
                    fill: getValue<Fill>(objects, "value", "fill", settings.value.fill),
                    unit: getValue<number>(objects, "value", "unit", settings.value.unit),
                    precision: getValue<number>(objects, "value", "precision", settings.value.precision),
                    locale: getValue<string>(objects, "value", "locale", settings.value.locale),
                },
                line: {
                    axis: getValue<string>(objects, "line", "axis", settings.line.axis),
                    kind: getValue<string>(objects, "line", "kind", settings.line.kind),
                    fill: getValue<Fill>(objects, "line", "fill", settings.line.fill),
                    weight: getValue<number>(objects, "line", "weight", settings.line.weight),
                    minHeight: getValue<number>(objects, "line", "minHeight", settings.line.minHeight),
                    start: getValue<number>(objects, "line", "start", settings.line.start),
                    end: getValue<number>(objects, "line", "end", settings.line.end),
                    baseline: getValue<boolean>(objects, "line", "baseline", settings.line.baseline),
                },
                area: {
                    show: getValue<boolean>(objects, "area", "show", settings.area.show),
                    fill: getValue<Fill>(objects, "area", "fill", settings.area.fill),
                    transparency: getValue<number>(objects, "area", "transparency", settings.area.transparency)
                },
                target: {
                    fill: getValue<Fill>(objects, "target", "fill", settings.target.fill),
                    rangeFill: getValue<Fill>(objects, "target", "rangeFill", settings.target.rangeFill),
                },
                hiLoPoints: {
                    showAllPoints: getValue<boolean>(objects, "hiLoPoints", "showAllPoints", settings.hiLoPoints.showAllPoints),
                    hiShow: getValue<boolean>(objects, "hiLoPoints", "hiShow", settings.hiLoPoints.hiShow),
                    hiFill: getValue<Fill>(objects, "hiLoPoints", "hiFill", settings.hiLoPoints.hiFill),
                    loShow: getValue<boolean>(objects, "hiLoPoints", "loShow", settings.hiLoPoints.loShow),
                    loFill: getValue<Fill>(objects, "hiLoPoints", "loFill", settings.hiLoPoints.loFill),
                    curShow: getValue<boolean>(objects, "hiLoPoints", "curShow", settings.hiLoPoints.curShow),
                    curFill: getValue<Fill>(objects, "hiLoPoints", "curFill", settings.hiLoPoints.curFill)
                },
                colorBlind: {
                     vision: getValue<string>(objects, "colorBlind", "vision", settings.colorBlind.vision),
                }
            }

            if (settings.value.locale == '') settings.value.locale = host.locale;
        }

        //Get DataPoints
        let dataPoints: VisualDataPoint[] = [];
        if (hasCategoricalData) {
            let dataCategorical = dataViews[0].categorical;

            let hasCategoryFilled = (dataCategorical.categories && dataCategorical.categories[0]);
            let hasMultipleMeasuresWithSameRole = false;

            let categories = [];
            if (hasCategoryFilled) {
                let category = dataCategorical.categories[0];
                for (let i = 0; i < category.values.length; i++) {
                    categories.push(category.values[i]);
                }
            } else {
                
                for (let i = 0; i < dataCategorical.values.length; i++) {
                    if (dataCategorical.values[i].source.roles['measure']){
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

            for (let i = 0; i < categories.length; i++) {
                
                let categoryValue = OKVizUtility.makeMeasureReadable(categories[i]);
                let displayName;
                let displayValue = 0;
                let values = [];
                let identities = []
                let axis = [];
                let format = null;
                let tooltips = [];
                let tooltipsItems: VisualTooltipDataItem[] = [];
                let tooltipsWalker = null;
                let target: VisualDataPointTarget = {value: null, min: null, max:null };
                for (let ii = 0; ii < dataCategorical.values.length; ii++) {

                    let dataValue = dataCategorical.values[ii];
                    
                    let value:any = dataValue.values[(hasMultipleMeasuresWithSameRole ? 0 : i)];
                    if (value !== null || settings.line.axis !== 'ignore') { 
                        if (dataValue.source.roles['measure']) {
                            if (!hasMultipleMeasuresWithSameRole || dataValue.source.displayName == categoryValue) {
                                format = dataValue.source.format;
                                displayName = dataValue.source.displayName;
                                if (settings.line.axis == 'setToZero' && value == null) value = 0;
                                values.push(value);
                                identities.push(hasCategoryFilled ?
                                    host.createSelectionIdBuilder()
                                    .withCategory(dataCategorical.categories[0], i)
                                    .withSeries(dataCategorical.values, dataValue)
                                    .createSelectionId():
                                    host.createSelectionIdBuilder()
                                    .withSeries(dataCategorical.values, dataValue)
                                    .createSelectionId());
                                axis.push(OKVizUtility.makeMeasureReadable(dataValue.source.groupName));

                                if (value !== null && !isNaN(value) && (settings.value.aggregate == 'sum' || settings.value.aggregate == 'avg')) {
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

                        if (dataValue.source.roles['tooltips']) {

                            if (!tooltipsWalker) {
                                tooltipsWalker = dataValue.source.displayName;
                            } else if (dataValue.source.displayName == tooltipsWalker) {
                                tooltips.push(tooltipsItems);
                                tooltipsItems = [];
                            }
                            
                            tooltipsItems.push(<VisualTooltipDataItem>{
                                displayName: dataValue.source.displayName,
                                value : OKVizUtility.Formatter.format(value, {
                                    format: dataValue.source.format,
                                    formatSingleValues: (settings.value.unit == 0),
                                    value: String(settings.value.unit),
                                    precision: settings.value.precision,
                                    displayUnitSystemType: 2,
                                    allowFormatBeautification: false,
                                    cultureSelector: settings.value.locale
                                }),
                                color: '#000',
                                markerShape: 'circle'
                            });     
                        }
                    }

                }

                tooltips.push(tooltipsItems);

                if (settings.value.aggregate == 'cur') {
                    for (let v = values.length - 1; v >= 0; v--) {
                        if (values[v] !== null && !isNaN(values[v])) {
                            displayValue = values[v];
                            break;
                        }
                    }
                } else if (settings.value.aggregate == 'avg') {
                    displayValue = displayValue / dataCategorical.values.length;
                }

                dataPoints.push({
                    values: values,
                    identities: identities, 
                    axis: axis,
                    tooltips: tooltips,
                    format: format,
                    target: target,
                    category: categoryValue,
                    displayName: displayName,
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

    export class Visual implements IVisual {
        private meta: VisualMeta;
        private host: IVisualHost;
        private selectionManager: ISelectionManager;
        private tooltipServiceWrapper: tooltip.ITooltipServiceWrapper;
        private model: VisualViewModel;
        private licced: boolean;

        private element: d3.Selection<HTMLElement>;

        constructor(options: VisualConstructorOptions) {   

            this.meta = {
                name: 'Sparkline',
                version: '1.1.2',
                dev: false
            };

            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            this.tooltipServiceWrapper = tooltip.createTooltipServiceWrapper(options.host.tooltipService, options.element);
            this.model = { dataPoints: [], settings: <VisualSettings>{} };

            this.element = d3.select(options.element);
        }
        
        //@logErrors() //TODO Don't use in production
        public update(options: VisualUpdateOptions) {

            this.model = visualTransform(options, this.host);

            this.element.selectAll('div, svg').remove();
            if (this.model.dataPoints.length == 0) return;

            let pointRay = (this.model.settings.line.weight * 2); //(this.model.settings.hiLoPoints.showAllPoints || this.model.settings.hiLoPoints.curShow || this.model.settings.hiLoPoints.hiShow || this.model.settings.hiLoPoints.loShow ? this.model.settings.line.weight * 2 : 0);
            let margin = {top: 6, left: 6, bottom: 0, right: 0};
            let slotPadding = {x: 3 + pointRay, y: 2 + pointRay };
            let scrollbarMargin = 10;
            
            let containerSize = {
                width: options.viewport.width - margin.left - margin.right,
                height: options.viewport.height - margin.top - margin.bottom
            };

            let container =  this.element
                .append('div')
                .classed('chart', true)
                .style({
                    'width' :  containerSize.width + 'px',
                    'height':  containerSize.height + 'px',
                    'overflow': (this.model.dataPoints.length > 1 ? 'auto' : 'hidden'),
                    'margin-top': margin.top + 'px',
                    'margin-left': margin.left + 'px'
                });

            let minSlotHeight = this.model.settings.line.minHeight;
            if (!minSlotHeight) minSlotHeight = 16;

            let useMinLimit = this.model.settings.line.minHeight;
            if (!useMinLimit) useMinLimit = 16;
            let minSlotSize = { width: 16, height: useMinLimit };

            let slotSize = {
                width: Math.max(minSlotSize.width, containerSize.width),
                height: Math.max(minSlotSize.height, ((containerSize.height - (this.model.dataPoints.length > 1 ? 5 : 0)) / this.model.dataPoints.length))
            };

            //Calculate label size
            let labelWidth = 0;
            let maxLabelWidth = 0;
            let valueWidth = 0;
            if (this.model.settings.label.show || this.model.settings.value.show) {
                for (let i = 0; i < this.model.dataPoints.length; i++) {
                    let dataPoint = this.model.dataPoints[i];
                    
                    if (this.model.settings.label.show) {
     
                        let fontSize = PixelConverter.fromPoint(this.model.settings.label.fontSize);
                        let props = { text: dataPoint.category, fontFamily: this.model.settings.label.fontFamily, fontSize: fontSize };

                        let currentLabelWidth = TextUtility.measureTextWidth(props);
                        maxLabelWidth = Math.max(maxLabelWidth, currentLabelWidth);
                    }

                    if (this.model.settings.value.show) {
                        let value = dataPoint.displayValue;

                        let formatter = OKVizUtility.Formatter.getFormatter({
                            format: dataPoint.format,
                            formatSingleValues: (this.model.settings.value.unit === 0),
                            value: (this.model.settings.value.unit == 0 ? value : this.model.settings.value.unit),
                            precision: this.model.settings.value.precision,
                            displayUnitSystemType: 3,
                            allowFormatBeautification: false,
                            cultureSelector: this.model.settings.value.locale
                        });

                        let formattedValue = (formatter ? formatter.format(value) : value); 
                        let fontSize = PixelConverter.fromPoint(this.model.settings.value.fontSize);
                        let props = { text: formattedValue, fontFamily:  this.model.settings.value.fontFamily, fontSize: fontSize };
                        let currentValueWidth = TextUtility.measureTextWidth(props) + 5;
                        valueWidth = Math.max(valueWidth, currentValueWidth);
                    }
                }
            }

            if (this.model.settings.label.show) {
                maxLabelWidth += 2;

                if (this.model.settings.label.autoSize) {
                    labelWidth = maxLabelWidth;
                } else {
                    labelWidth = Math.min(maxLabelWidth, slotSize.width * 0.25);
                }
            }

            let sparklineSize = {
                width: slotSize.width - labelWidth - valueWidth - (slotPadding.x * 2) - scrollbarMargin,
                height: slotSize.height - (slotPadding.y * 2)
            };

            if (this.model.dataPoints.length > 0) {

                let svgContainer = container
                    .append('svg')
                    .attr({
                        'width':  '100%',
                        'height': (this.model.dataPoints.length * slotSize.height)
                    });

                for (let i = 0; i < this.model.dataPoints.length; i++) {
                    
                    let dataPointContainer = svgContainer.append('g')
                                                .style('pointer-events', 'all');

                    let dataPoint = this.model.dataPoints[i];

                    let formatter = OKVizUtility.Formatter.getFormatter({
                        format: this.model.dataPoints[0].format,
                        formatSingleValues: (this.model.settings.value.unit === 0),
                        value: (this.model.settings.value.unit == 0 ? this.model.dataPoints[0].displayValue : this.model.settings.value.unit),
                        precision: this.model.settings.value.precision,
                        displayUnitSystemType: 3,
                        allowFormatBeautification: false,
                        cultureSelector: this.model.settings.value.locale
                    });

                    let topValue = {indexes: [], value:0};
                    let bottomValue = {indexes: [], value:Infinity};
                    for (let ii = 0; ii < dataPoint.values.length; ii++){
                        if (dataPoint.values[ii] != null) {
                            if (dataPoint.values[ii] > topValue.value) {
                                topValue.indexes = [ii];
                                topValue.value = dataPoint.values[ii];
                            } else if (dataPoint.values[ii] == topValue.value) {
                                topValue.indexes.push(ii);
                            }
                            if (dataPoint.values[ii] < bottomValue.value) {
                                bottomValue.indexes = [ii];
                                bottomValue.value = dataPoint.values[ii];
                            } else if (dataPoint.values[ii] == bottomValue.value) {
                                bottomValue.indexes.push(ii);
                            }
                        }
                    }
  
                    //Clip path
                    svgContainer
                        .append('clipPath')
                        .attr('id', 'clip' + i)
                        .append('rect')
                        .attr('x', 0)
                        .attr('width', slotSize.width)
                        .attr('y', (i * slotSize.height))
                        .attr('height', slotSize.height);
                    
                    dataPointContainer.attr('clip-path', 'url(#clip' + i + ')');
                    
                    //We didn't use the following function because we need Min/Max/Index in the array
                    //Math.max.apply(null, dataPoint.values);
                    let x = d3.scale.linear()
                        .domain([0, dataPoint.values.length - 1])
                        .range([labelWidth + slotPadding.x, sparklineSize.width + labelWidth + slotPadding.x]);

                    let yStart = bottomValue.value;
                    if (dataPoint.target.value != null) yStart = Math.min(dataPoint.target.value, yStart);
                    if (dataPoint.target.min != null) yStart = Math.min(dataPoint.target.min, yStart);
                    if (typeof this.model.settings.line.start !== 'undefined' && this.model.settings.line.start != null) yStart = this.model.settings.line.start;

                    let yEnd = topValue.value;
                    if (dataPoint.target.value != null) yEnd = Math.max(dataPoint.target.value, yEnd);
                    if (dataPoint.target.max != null) yEnd = Math.max(dataPoint.target.max, yEnd);
                    if (typeof this.model.settings.line.end !== 'undefined' && this.model.settings.line.end != null) yEnd = this.model.settings.line.end;

                    let y = d3.scale.linear()
                        .domain([yEnd, yStart]) 
                        .range([(i * slotSize.height) + slotPadding.y, (i * slotSize.height) + slotPadding.y + sparklineSize.height]);   
                    
                    if (this.model.settings.line.baseline && yStart == 0) {
                            
                        dataPointContainer.append('line')
                            .classed('border', true)
                            .attr('x1', labelWidth + slotPadding.x)
                            .attr('x2', sparklineSize.width + slotPadding.x + labelWidth)
                            .attr('y1', y(yStart))
                            .attr('y2', y(yStart))
                            .attr('stroke-width', 1)
                            .attr('stroke', '#ddd');
                    }

                    if (dataPoint.target.min != null && dataPoint.target.max != null) {
                        dataPointContainer.append('rect')
                            .classed('target', true)
                            .attr('x', labelWidth + slotPadding.x)
                            .attr('width', sparklineSize.width)
                            .attr('y', y(dataPoint.target.min))
                            .attr('height', y(dataPoint.target.max))
                            .attr('fill', this.model.settings.target.rangeFill.solid.color);
                    }
          
                    if (dataPoint.target.value != null) {
                        dataPointContainer.append('line')
                            .classed('target', true)
                            .attr('x1', labelWidth + slotPadding.x)
                            .attr('x2', sparklineSize.width + slotPadding.x + labelWidth)
                            .attr('y1', y(dataPoint.target.value))
                            .attr('y2', y(dataPoint.target.value))
                            .attr('stroke-width', this.model.settings.line.weight)
                            .attr('stroke', this.model.settings.target.fill.solid.color);

                    }
                    
                    let line = d3.svg.line()
                        .x(function(d: any,j: any) { 
                            return x(j); 
                        })
                        .y(function(d: any) { 
                            return y(d); 
                        })
                        .defined(function(d) {
                            return (d !== null);
                        })
                        .interpolate(this.model.settings.line.kind);
                    
                    if (this.model.settings.area.show) {
                        let area = d3.svg.area()
                            .x(function(d: any,j: any) { 
                                return x(j); 
                            })
                            .y0(((i + 1) * slotSize.height) - slotPadding.y)
                            .y1(function(d: any) { 
                                return y(d); 
                            })
                            .defined(function(d) {
                                return (d !== null);
                            })
                            .interpolate(this.model.settings.line.kind);

                        let chartArea =  dataPointContainer.append("path").data([dataPoint.values]).classed('sparklineArea', true);
                        chartArea.attr("d", area(dataPoint.values))
                            .attr('fill', this.model.settings.area.fill.solid.color)
                            .attr('fill-opacity', this.model.settings.area.transparency / 100);
                    }

                    let chart = dataPointContainer.append("path").data([dataPoint.values]).classed('sparkline', true);
                    chart.attr("d", line(dataPoint.values))
                        .attr('stroke-linecap', 'round')
                        .attr('stroke-width', this.model.settings.line.weight)
                        .attr('stroke', this.model.settings.line.fill.solid.color)
                        .attr('fill', 'none');
                    
                    let self = this;
                    if (this.model.settings.hiLoPoints.showAllPoints) {
                        
                        for (let ii = 0; ii < dataPoint.values.length; ii++) {
                            let val = dataPoint.values[ii];
                            if (val == null) continue;

                            let color = this.model.settings.hiLoPoints.curFill.solid.color;
                            if (this.model.settings.hiLoPoints.hiShow && topValue.value == val)
                                color = this.model.settings.hiLoPoints.hiFill.solid.color;
                            else if  (this.model.settings.hiLoPoints.loShow && bottomValue.value == val)
                                color = this.model.settings.hiLoPoints.loFill.solid.color;

                            let existingTooltips = (dataPoint.tooltips[ii] || []);
                            dataPointContainer.append('circle')
                                .classed('point', true)
                                .data([[<VisualTooltipDataItem>{
                                        header: dataPoint.axis[ii] + (dataPoint.category != dataPoint.displayName ? ' (' + dataPoint.category + ')' : ''),
                                        displayName: dataPoint.displayName,
                                        value: String(formatter ? formatter.format(dataPoint.values[ii]) : dataPoint.values[ii]),
                                        color: (color.substr(1, 3) == '333' ? '#000' : color),
                                        markerShape: 'circle'
                                    }].concat(existingTooltips)])
                                .attr('cx', x(ii))
                                .attr('cy', y(dataPoint.values[ii]))
                                .attr('r', pointRay)
                                .attr('fill', color)
                                .on('click', function(d) {
                                    self.selectionManager.select(dataPoint.identities[ii]).then((ids: ISelectionId[]) => {
                                        if (ids.length == 0) {
                                            d3.selectAll('.point').attr({ 'fill-opacity': 1});
                                            d3.selectAll('.sparkline').attr({ 'stroke-opacity': 1 });
                                        } else {
                                            d3.selectAll('.point').attr({ 'fill-opacity': 0.3 });
                                            d3.selectAll('.sparkline').attr({ 'stroke-opacity': 0.3 });
                                            d3.select(this).attr({ 'fill-opacity': 1 });
                                        }
                                    });

                                    (<Event>d3.event).stopPropagation();
                                });

                        }
       
                        this.tooltipServiceWrapper.addTooltip(svgContainer.selectAll('.point'), 
                            function(tooltipEvent: TooltipEventArgs<number>){
                                if (tooltipEvent)
                                    return <any>tooltipEvent.data; 
                                return null;
                            }, 
                            (tooltipEvent: TooltipEventArgs<number>) => null
                        );
                    

                    } else {

                        if (this.model.settings.hiLoPoints.curShow) {
                            let color = this.model.settings.hiLoPoints.curFill.solid.color;
                            dataPointContainer.append('circle')
                                .classed('point fixed', true)
                                .attr('cx', x(dataPoint.values.length - 1))
                                .attr('cy', y(dataPoint.values[dataPoint.values.length - 1]))
                                .attr('r', pointRay)
                                .attr('fill', color);

                        }

                        if (this.model.settings.hiLoPoints.hiShow) {
                            let color = this.model.settings.hiLoPoints.hiFill.solid.color;
                            for (let xx = 0; xx < topValue.indexes.length; xx++) {
                            
                                dataPointContainer.append('circle')
                                    .classed('point fixed', true)
                                    .attr('cx', x(topValue.indexes[xx]))
                                    .attr('cy', y(topValue.value))
                                    .attr('r', pointRay)
                                    .attr('fill', color);
                            }
                        }


                        if (this.model.settings.hiLoPoints.loShow) {
                            let color = this.model.settings.hiLoPoints.loFill.solid.color;
                            for (let xx = 0; xx < bottomValue.indexes.length; xx++) {
                                dataPointContainer.append('circle')
                                    .classed('point fixed', true)
                                    .attr('cx', x(bottomValue.indexes[xx]))
                                    .attr('cy', y(bottomValue.value))
                                    .attr('r', pointRay)
                                    .attr('fill', color);
                            }
                        }
                    

                        //Tooltips
                        
                        let hidePointTimeout;
                        dataPointContainer.on('mousemove', function(){

                            clearTimeout(hidePointTimeout);

                            let coord = [0, 0];
                            coord = d3.mouse(this);

                            let foundIndex = -1;
                            for (let ii = 0; ii < dataPoint.values.length; ii++) {
                                if (coord[0] == x(ii)) {
                                    foundIndex = ii;
                                    break;
                                } else if (coord[0] > x(ii) - ((x(ii) - x(ii-1))/2)) {
                                    foundIndex = ii;
                                } else {
                                    break;
                                }
                            }

                            let circle = dataPointContainer.select('.point:not(.fixed):not(.keep)');
                            if (foundIndex == -1) {
                                circle.remove();
                            } else {
                                if (circle.empty())
                                    circle = dataPointContainer.append('circle').classed('point', true);
                                
                                let val = dataPoint.values[foundIndex];
                                let color = self.model.settings.hiLoPoints.curFill.solid.color
                                if (self.model.settings.hiLoPoints.hiShow && topValue.value == val) {
                                    color = self.model.settings.hiLoPoints.hiFill.solid.color;
                                } else if  (self.model.settings.hiLoPoints.loShow && bottomValue.value == val) {
                                    color = self.model.settings.hiLoPoints.loFill.solid.color;
                                }

                                circle
                                    .attr('cx', x(foundIndex))
                                    .attr('cy', y(val))
                                    .attr('r', pointRay)
                                    .attr('fill', color)
                                    .on('click', function(d) {
                                        self.selectionManager.select(dataPoint.identities[foundIndex]).then((ids: ISelectionId[]) => {

                                            let selection = (ids.length > 0);
                                            d3.selectAll('.point.fixed').attr({ 'fill-opacity': (selection ? 0.3 : 1) });
                                            d3.selectAll('.sparkline').attr({ 'stroke-opacity': (selection ? 0.3 : 1) });
                                            d3.selectAll('.point.keep').classed('keep', false);

                                            if (selection) 
                                                d3.select(this).classed('keep', true).attr({ 'fill-opacity': 1 });

                                            d3.selectAll('.point:not(.fixed):not(.keep)').remove();
                                        });

                                        (<Event>d3.event).stopPropagation();
                                    });  
                             
                                let existingTooltips = (dataPoint.tooltips[foundIndex] || []);
                                self.tooltipServiceWrapper.addTooltip(circle, 
                                    function(tooltipEvent: TooltipEventArgs<TooltipEnabledDataPoint>){
                                        return [<VisualTooltipDataItem>{
                                            header: dataPoint.axis[foundIndex] + (dataPoint.category != dataPoint.displayName ? ' (' + dataPoint.category + ')' : ''),
                                            displayName: dataPoint.displayName,
                                            value: String(formatter ? formatter.format(val) : val),
                                            color: (color.substr(1, 3) == '333' ? '#000' : color),
                                            markerShape: 'circle'
                                        }].concat(existingTooltips); 
                                    }, null, true  
                                );
                            }
 
                        });
                        dataPointContainer.on('mouseenter', function(){ 
                            clearTimeout(hidePointTimeout);
                        });
                       dataPointContainer.on('mouseleave', function(){ 
                            hidePointTimeout = setTimeout(function(){
                                svgContainer.selectAll('.point:not(.fixed):not(.keep)').remove();
                            }, 500);
                        });
                    }

                    container.on('click', function(){ 
                        self.selectionManager.clear();

                        d3.selectAll('.sparkline').attr({ 'stroke-opacity':  1 });
                        if (self.model.settings.hiLoPoints.showAllPoints) {
                            d3.selectAll('.point').attr({ 'fill-opacity': 1});

                        } else {
                            d3.selectAll('.point.fixed').attr({ 'fill-opacity': 1 });
                            d3.selectAll('.point.keep').classed('keep', false);
                            d3.selectAll('.point:not(.fixed):not(.keep)').remove();
                        }
                        (<Event>d3.event).stopPropagation();
                    });

                    if (this.model.settings.label.show) {

                        let g = dataPointContainer.append('g');
                        g.append('title').text(dataPoint.category);

                        let label = g.append('text')
                            .classed('label', true);

                            let fontSize = PixelConverter.fromPoint(this.model.settings.label.fontSize);
                            let props = { text: dataPoint.category, fontFamily: this.model.settings.label.fontFamily, fontSize: fontSize };


                            label.text(TextUtility.getTailoredTextOrDefault(props, labelWidth))
                            .attr('x', labelWidth)
                            .attr('y', (i * slotSize.height) + (slotSize.height / 2))
                            .style({
                                'font-size': fontSize,
                                'font-family': this.model.settings.label.fontFamily
                            })
                            .attr('text-anchor', 'end')
                            .attr('fill', this.model.settings.label.fill.solid.color);
                            
                    }  

                    if (this.model.settings.value.show) {
                        let label = dataPointContainer.append('text')
                            .classed('value', true);
    
                        //Formatter
                        let value = dataPoint.displayValue;
                        let fontSize = PixelConverter.fromPoint(this.model.settings.value.fontSize);

                        label.text(formatter ? formatter.format(value) : value)
                            .attr('x', labelWidth + sparklineSize.width + (slotPadding.x * 2))
                            .attr('y', (i * slotSize.height) + (slotSize.height / 2))
                            .style({
                                'font-size': fontSize,
                                'font-family': this.model.settings.value.fontFamily
                            })
                            .attr('fill', this.model.settings.value.fill.solid.color);
                    }


                }

            }

            OKVizUtility.t([this.meta.name, this.meta.version], this.element, options, this.host, {
                'cd1': this.model.settings.colorBlind.vision,
                'cd5': (this.model.dataPoints[0].target !== null),
                'cd15': this.meta.dev
            });

            if (!this.licced) {
                this.licced = true;
                OKVizUtility.lic_log(this.meta, options, this.host);
            }

            //Color Blind module
            OKVizUtility.applyColorBlindVision(this.model.settings.colorBlind.vision, this.element);
        }

        public destroy(): void {
           
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            switch(objectName) {
                case 'label':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "show": this.model.settings.label.show,
                            "text": this.model.settings.label.text,
                            "fontSize": this.model.settings.label.fontSize,
                            "fontFamily": this.model.settings.label.fontFamily,
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
                            "fontFamily": this.model.settings.value.fontFamily,
                            "fill": this.model.settings.value.fill,
                            "unit": this.model.settings.value.unit,
                            "precision": this.model.settings.value.precision,
                            "locale": this.model.settings.value.locale
                        },
                        validValues: {
                            "precision": {
                                numberRange: {
                                    min: 0,
                                    max: 15
                                }
                            }
                        },
                        selector: null
                    });

                    break;

                case 'line':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "axis": this.model.settings.line.axis,
                            "start": this.model.settings.line.start,
                            "end": this.model.settings.line.end,
                            "baseline": this.model.settings.line.baseline,
                            "kind": this.model.settings.line.kind,
                            "weight": this.model.settings.line.weight,
                            "minHeight": this.model.settings.line.minHeight,
                            "fill": this.model.settings.line.fill
                        },
                        validValues: {
                            "weight": {
                                numberRange: {
                                    min: 1,
                                    max: 20
                                }
                            },
                            "minHeight": {
                                numberRange: {
                                    min: 1
                                }
                            }
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
                            "showAllPoints": this.model.settings.hiLoPoints.showAllPoints,
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

                case 'colorBlind':
                    
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "vision": this.model.settings.colorBlind.vision
                        },
                        selector: null
                    });

                    break;
                
                case 'about':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "version": this.meta.version + (this.meta.dev ? ' BETA' : '')
                        },
                        selector: null
                    });
                    break;
                
            };

            return objectEnumeration;
        }
    }
}