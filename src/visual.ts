/*
 *  Sparkline by OKViz
 *  v1.0.1
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

module powerbi.extensibility.visual {
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
        axis: any[];
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
            fill: Fill;
            autoSize: boolean;
        };
        value : {
            show: boolean;
            aggregate: string;
            fontSize: number;
            fill: Fill;
            unit?: number;
            precision?: number; 
        };
        line: {
            axis: string,
            kind: string;
            fill: Fill;
            weight: number;
            minHeight?: number; 
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
               fill: {solid: { color: "#777" } },
               autoSize: true
           },
           value: {
               show: false,
               aggregate: 'cur',
               fontSize: 9,
               fill: {solid: { color: "#777" } },
               unit: 0
           },
           line: {
               axis: 'ignore',
               kind: 'monotone',
               fill: {solid: { color: "#333" } },
               weight: 2
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
        var dataViews = options.dataViews;
        var hasDataViews = (dataViews && dataViews[0]);
        var hasCategoricalData = (hasDataViews && dataViews[0].categorical && dataViews[0].categorical.values);
        var hasSettings = (hasDataViews && dataViews[0].metadata && dataViews[0].metadata.objects);

        //Get Settings
        var settings: VisualSettings = defaultSettings();
        if (hasSettings) {
            var objects = dataViews[0].metadata.objects;
            settings = {
                label: {
                    show: getValue<boolean>(objects, "label", "show", settings.label.show),
                    text: getValue<string>(objects, "label", "text", settings.label.text),
                    fontSize: getValue<number>(objects, "label", "fontSize", settings.label.fontSize),
                    fill: getValue<Fill>(objects, "label", "fill", settings.label.fill),
                    autoSize: getValue<boolean>(objects, "label", "autoSize", settings.label.autoSize)
                },
                value: {
                    show: getValue<boolean>(objects, "value", "show", settings.value.show),
                    aggregate: getValue<string>(objects, "value", "aggregate", settings.value.aggregate),
                    fontSize: getValue<number>(objects, "value", "fontSize", settings.value.fontSize),
                    fill: getValue<Fill>(objects, "value", "fill", settings.value.fill),
                    unit: getValue<number>(objects, "value", "unit", settings.value.unit),
                    precision: getValue<number>(objects, "value", "precision", settings.value.precision)
                },
                line: {
                    axis: getValue<string>(objects, "line", "axis", settings.line.axis),
                    kind: getValue<string>(objects, "line", "kind", settings.line.kind),
                    fill: getValue<Fill>(objects, "line", "fill", settings.line.fill),
                    weight: getValue<number>(objects, "line", "weight", settings.line.weight),
                    minHeight: getValue<number>(objects, "line", "minHeight", settings.line.minHeight)
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

            //Limit some properties
            if (settings.line.weight < 1) settings.line.weight = 1;
            if (settings.line.minHeight < 1) settings.line.minHeight = 1;
            if (settings.value.precision < 0) settings.value.precision = 0;
            if (settings.value.precision > 5) settings.value.precision = 5;
        }

        //Get DataPoints
        var dataPoints: VisualDataPoint[] = [];
        if (hasCategoricalData) {
            var dataCategorical = dataViews[0].categorical;

            var hasCategoryFilled = (dataCategorical.categories && dataCategorical.categories[0]);
            var hasMultipleMeasuresWithSameRole = false;

            var categories = [];
            if (hasCategoryFilled) {
                var category = dataCategorical.categories[0];
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
                let axis = [];
                let format = null;
                let target: VisualDataPointTarget = {value: null, min: null, max:null };
                for (let ii = 0; ii < dataCategorical.values.length; ii++) {

                    let dataValue = dataCategorical.values[ii];
                    let value:any = dataValue.values[(hasMultipleMeasuresWithSameRole ? 0 : i)];
                    if (value !== null || settings.line.axis === 'setToZero') { //This condition remove null values, but made comparison between sparklines inefficient
                        if (dataValue.source.roles['measure']) {
                            if (!hasMultipleMeasuresWithSameRole || dataValue.source.displayName == categoryValue) {
                                format = dataValue.source.format;
                                displayName = dataValue.source.displayName;

                                values.push(value);
                                axis.push(OKVizUtility.makeMeasureReadable(dataValue.source.groupName));

                                if (value && !isNaN(value) && (settings.value.aggregate == 'sum' || settings.value.aggregate == 'avg')) {
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
                    for (let v = values.length - 1; v > 0; v--) {
                        if (values[v] && !isNaN(values[v])) {
                            displayValue = values[v];
                            break;
                        }
                    }
                } else if (settings.value.aggregate == 'avg') {
                    displayValue = displayValue / dataCategorical.values.length;
                }

                dataPoints.push({
                    values: values,
                    axis: axis,
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
        private host: IVisualHost;
        private selectionManager: ISelectionManager;
        private tooltipServiceWrapper: ITooltipServiceWrapper;
        private model: VisualViewModel;

        private element: d3.Selection<HTMLElement>;

        constructor(options: VisualConstructorOptions) {         

            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            this.tooltipServiceWrapper = createTooltipServiceWrapper(options.host.tooltipService, options.element);
            this.model = { dataPoints: [], settings: <VisualSettings>{} };

            this.element = d3.select(options.element);
             
        }
        
        public update(options: VisualUpdateOptions) {

            this.model = visualTransform(options, this.host);
            if (this.model.dataPoints.length == 0) return;

            //Formatter
            let formatter = OKVizUtility.Formatter.getFormatter({
                format: this.model.dataPoints[0].format,
                formatSingleValues: (this.model.settings.value.unit == 0),
                value: this.model.settings.value.unit,
                precision: this.model.settings.value.precision,
                displayUnitSystemType: 2,
                allowFormatBeautification: false
            });

            let pointRay = (this.model.settings.hiLoPoints.curShow || this.model.settings.hiLoPoints.hiShow || this.model.settings.hiLoPoints.loShow ? this.model.settings.line.weight * 2 : 0);
            let margin = {top: 6, left: 6, bottom: 0, right: 0};
            let slotPadding = {x: 3 + pointRay, y: 2 + pointRay };
            let scrollbarMargin = 10;
            

            this.element.selectAll('div, svg').remove();
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
                        let props = { text: dataPoint.category, fontFamily: 'sans-serif', fontSize: fontSize };

                        let currentLabelWidth = TextUtility.measureTextWidth(props);
                        maxLabelWidth = Math.max(maxLabelWidth, currentLabelWidth);
                    }

                    if (this.model.settings.value.show) {
                        let value = dataPoint.displayValue;

                        let formattedValue = formatter.format(value); 
                        let fontSize = PixelConverter.fromPoint(this.model.settings.value.fontSize);
                        let props = { text: formattedValue, fontFamily:  "'wf_standard-font',helvetica,arial,sans-serif", fontSize: fontSize };
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
                    let dataPoint = this.model.dataPoints[i];

                    let topValue = {index: 0, value:0};
                    let bottomValue = {index: 0, value:Infinity};
                    for (let ii = 0; ii < dataPoint.values.length; ii++){
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

                    let x = d3.scale.linear()
                        .domain([0, dataPoint.values.length - 1])
                        .range([labelWidth + slotPadding.x, sparklineSize.width + labelWidth + slotPadding.x]);

                    let y = d3.scale.linear()
                        .domain([topValue.value, bottomValue.value]) 
                        .range([(i * slotSize.height) + slotPadding.y, (i * slotSize.height) + slotPadding.y + sparklineSize.height]);   
                                
                    if (dataPoint.target.min && dataPoint.target.max) {
                        svgContainer.append('rect')
                            .classed('target', true)
                            .attr('x', labelWidth + slotPadding.x)
                            .attr('width', sparklineSize.width)
                            .attr('y', y(dataPoint.target.min))
                            .attr('height', y(dataPoint.target.max))
                            .attr('fill', this.model.settings.target.rangeFill.solid.color);
                    }

                    if (dataPoint.target.value) {
                        svgContainer.append('line')
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
                            .interpolate(this.model.settings.line.kind);

                        let chartArea =  svgContainer.append("path").data([dataPoint.values]).classed('sparklineArea', true);
                        chartArea.attr("d", area(dataPoint.values))
                            .attr('fill', this.model.settings.area.fill.solid.color)
                            .attr('fill-opacity', this.model.settings.area.transparency / 100);
                    }

                    let chart = svgContainer.append("path").data([dataPoint.values]).classed('sparkline', true);
                    chart.attr("d", line(dataPoint.values))
                        .attr('stroke-linecap', 'round')
                        .attr('stroke-width', this.model.settings.line.weight)
                        .attr('stroke', this.model.settings.line.fill.solid.color)
                        .attr('fill', 'none');

     

                    if (this.model.settings.hiLoPoints.curShow) {
                        let color = this.model.settings.hiLoPoints.curFill.solid.color;
                        svgContainer.append('circle')
                            .classed('point', true)
                            .data([[<VisualTooltipDataItem>{
                                    header: dataPoint.axis[dataPoint.values.length - 1],
                                    displayName: dataPoint.displayName,
                                    value: formatter.format(dataPoint.values[dataPoint.values.length - 1]),
                                    color: (color.substr(1, 3) == '333' ? '#000' : color)
                                }]])
                            .attr('cx', x(dataPoint.values.length - 1))
                            .attr('cy', y(dataPoint.values[dataPoint.values.length - 1]))
                            .attr('r', pointRay)
                            .attr('fill', color);  
                    }

                    if (this.model.settings.hiLoPoints.hiShow) {
                        let color = this.model.settings.hiLoPoints.hiFill.solid.color;
                        svgContainer.append('circle')
                            .classed('point', true)
                                .data([[<VisualTooltipDataItem>{
                                    header: dataPoint.axis[topValue.index],
                                    displayName: dataPoint.displayName,
                                    value: formatter.format(dataPoint.values[topValue.index]),
                                    color: (color.substr(1, 3) == '333' ? '#000' : color)
                                }]])
                            .attr('cx', x(topValue.index))
                            .attr('cy', y(topValue.value))
                            .attr('r', pointRay)
                            .attr('fill', color);  
                    }


                    if (this.model.settings.hiLoPoints.loShow) {
                        let color = this.model.settings.hiLoPoints.loFill.solid.color;
                        svgContainer.append('circle')
                            .classed('point', true)
                                .data([[<VisualTooltipDataItem>{
                                    header: dataPoint.axis[topValue.index],
                                    displayName: dataPoint.displayName,
                                    value: formatter.format(dataPoint.values[bottomValue.index]),
                                    color: (color.substr(1, 3) == '333' ? '#000' : color)
                                }]])
                            .attr('cx', x(bottomValue.index))
                            .attr('cy', y(bottomValue.value))
                            .attr('r', pointRay)
                            .attr('fill', color);  
                    }
                    

                    if (this.model.settings.label.show) {

                        let g = svgContainer.append('g');
                        g.append('title').text(dataPoint.category);

                        let label = g.append('text')
                            .classed('label', true);

                            let fontSize = PixelConverter.fromPoint(this.model.settings.label.fontSize);
                            let props = { text: dataPoint.category, fontFamily: 'sans-serif', fontSize: fontSize };


                            label.text(TextUtility.getTailoredTextOrDefault(props, labelWidth))
                            .attr('x', labelWidth)
                            .attr('y', (i * slotSize.height) + (slotSize.height / 2))
                            .style('font-size', fontSize)
                            .attr('text-anchor', 'end')
                            .attr('fill', this.model.settings.label.fill.solid.color);
                            
                    }

                    if (this.model.settings.value.show) {
                        let label = svgContainer.append('text')
                            .classed('value', true);
    
                        //Formatter
                        let value = dataPoint.displayValue;
                        let fontSize = PixelConverter.fromPoint(this.model.settings.value.fontSize);

                        label.text(formatter.format(value))
                            .attr('x', labelWidth + sparklineSize.width + (slotPadding.x * 2))
                            .attr('y', (i * slotSize.height) + (slotSize.height / 2))
                            .style({
                                'font-size': fontSize,
                                'font-family': "'wf_standard-font',helvetica,arial,sans-serif"
                            })
                            .attr('fill', this.model.settings.value.fill.solid.color);
                    }
                }

                //Tooltips
                this.tooltipServiceWrapper.addTooltip(svgContainer.selectAll('.point'), 
                    function(tooltipEvent: TooltipEventArgs<number>){
                        return <any>tooltipEvent.data;
                    }, 
                    (tooltipEvent: TooltipEventArgs<number>) => null
                );
            }

            OKVizUtility.t(['Sparkline', '1.0.1'], this.element, options, this.host, {
                'cd1': this.model.settings.colorBlind.vision,
                'cd5': (this.model.dataPoints[0].target !== null),
                'cd6': false, //TODO Change when Legend will be available
            });

            //Color Blind module
            OKVizUtility.applyColorBlindVision(this.model.settings.colorBlind.vision, this.element);
        }

        public destroy(): void {
           
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var objectName = options.objectName;
            var objectEnumeration: VisualObjectInstance[] = [];

            switch(objectName) {
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
                            "minHeight": this.model.settings.line.minHeight,
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
                
                case 'colorBlind':
                    
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "vision": this.model.settings.colorBlind.vision
                        },
                        selector: null
                    });

                    break;
                
            };

            return objectEnumeration;
        }
    }
}