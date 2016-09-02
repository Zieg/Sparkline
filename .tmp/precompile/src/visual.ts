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

module powerbi.extensibility.visual.PBI_CV_25997FEB_F466_44FA_B562_AC4063283C4C  {
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
        target: VisualDataPointTarget;
        category: string;
        displayValue: number;
        selectionId: ISelectionId;
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
            unit?: any; //TODO
            precision?: number; 
        };
        line: {
            axis: string,
            kind: string;
            fill: Fill;
            weight: number;
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
    }

    function defaultSettings(): VisualSettings {

        return {
           label: {
               show: true,
               text: '',
               fontSize: 14,
               fill: {solid: { color: "#333" } },
               autoSize: true
           },
           value: {
               show: false,
               aggregate: 'cur',
               fontSize: 14,
               fill: {solid: { color: "#333" } }
           },
           line: {
               axis: 'ignore',
               kind: "linear",
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
               hiFill: {solid: { color: "#7DC172" } },
               loShow: true,
               loFill: {solid: { color: "#FD625E" } },
               curShow: false,
               curFill: {solid: { color: "#333" } }
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
                    unit: getValue<any>(objects, "value", "unit", settings.value.unit), //TODO
                    precision: getValue<number>(objects, "value", "precision", settings.value.precision)
                },
                line: {
                    axis: getValue<string>(objects, "line", "axis", settings.line.axis),
                    kind: getValue<string>(objects, "line", "kind", settings.line.kind),
                    fill: getValue<Fill>(objects, "line", "fill", settings.line.fill),
                    weight: getValue<number>(objects, "line", "weight", settings.line.weight)
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
                }
            }

            //Limit some properties
            if (settings.line.weight < 1) settings.line.weight = 1;
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
                
                let displayValue = 0;
                let values = [];
                let target: VisualDataPointTarget = {value: null, min: null, max:null };
                for (let ii = 0; ii < dataCategorical.values.length; ii++) {

                    //TODO add to tooltips
                    //var dataGroupName = dataCategorical.values[ii].source.groupName; 
     
                    let dataValue = dataCategorical.values[ii];
                    let value = dataValue.values[(hasMultipleMeasuresWithSameRole ? 0 : i)];
                    if (value || settings.line.axis === 'setToZero') { //This condition remove null values, but made comparison between sparklines inefficient
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
                } else if (settings.value.aggregate == 'avg') {
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

    export class Visual implements IVisual {
        private host: IVisualHost;
        private selectionManager: ISelectionManager;
        private model: VisualViewModel;

        private element: HTMLElement;
        private svg: d3.Selection<SVGElement>;

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.selectionManager = options.host.createSelectionManager();
            this.model = { dataPoints: [], settings: <VisualSettings>{} };

            this.element = options.element;

            var svg = this.svg = d3.select(this.element)
                        .append('svg')
                        .classed('chart', true);

        }
        
        public update(options: VisualUpdateOptions) {

            this.model = visualTransform(options, this.host);

            var width = options.viewport.width;
            var height = options.viewport.height;

            this.svg.attr({
                width: width,
                height: height
            })
            .style('padding', (this.model.settings.line.weight + 2) + 'px')

            
            var margin = {top: 10, left: 10, bottom:10, right: 10};
            var slotHeight = height / this.model.dataPoints.length;
            var chartHeight = slotHeight - margin.top - margin.bottom;
            
            var labelWidth = 0;
            var valueWidth = 0;
            if (this.model.settings.label.show || this.model.settings.value.show) {
                for (let i = 0; i < this.model.dataPoints.length; i++) {
                    let dataPoint = this.model.dataPoints[i];
                    
                    if (this.model.settings.label.show) {
                        let labelText = dataPoint.category;

                        let props = { text: labelText, fontFamily: 'sans-serif', fontSize: this.model.settings.label.fontSize + 'px' };

                        if (this.model.settings.label.autoSize) {
                            let currentLabelWidth = TextUtility.measureTextWidth(props);
                            labelWidth = Math.max(labelWidth, currentLabelWidth);
                        } else {
                            labelWidth = 100;
                            dataPoint.category = TextUtility.getTailoredTextOrDefault(props, labelWidth);
                        }
                    }

                    if (this.model.settings.value.show) {
                        let value = dataPoint.displayValue;

                        //TODO Format value

                        let props = { text: String(value), fontFamily: 'sans-serif', fontSize: this.model.settings.value.fontSize + 'px' };
                        let currentValueWidth = TextUtility.measureTextWidth(props);
                        valueWidth = Math.max(valueWidth, currentValueWidth);
                    }

                }
               
            }

            this.svg.selectAll('.sparkline, .sparklineArea, .label, .value, .point, .target').remove();

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
                    .range([labelWidth + margin.left, width - margin.right - valueWidth]);

                let y = d3.scale.linear()
                    .domain([topValue.value, bottomValue.value]) 
                    .range([(i * slotHeight), (i * slotHeight) + margin.top + chartHeight]);   
                               
                 if (dataPoint.target.min && dataPoint.target.max) {
                    this.svg.append('rect')
                        .classed('target', true)
                        .attr('x', labelWidth + margin.left)
                        .attr('width', width - valueWidth)
                        .attr('y', y(dataPoint.target.min))
                        .attr('height', y(dataPoint.target.max))
                        .attr('fill', this.model.settings.target.rangeFill.solid.color);
                }

                if (dataPoint.target.value) {
                    this.svg.append('line')
                        .classed('target', true)
                        .attr('x1', labelWidth + margin.left)
                        .attr('x2', width - valueWidth)
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
                        .y0(((i + 1) * slotHeight) - margin.bottom + this.model.settings.line.weight)
                        .y1(function(d: any) { 
                            return y(d); 
                        })
			            .interpolate(this.model.settings.line.kind);

                    let chartArea =  this.svg.append("path").data([dataPoint.values]).classed('sparklineArea', true);
                    chartArea.attr("d", area(dataPoint.values))
                        .attr('fill', this.model.settings.area.fill.solid.color)
                        .attr('fill-opacity', this.model.settings.area.transparency / 100);
                }

			    let chart = this.svg.append("path").data([dataPoint.values]).classed('sparkline', true);
                chart.attr("d", line(dataPoint.values))
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', this.model.settings.line.weight)
                    .attr('stroke', this.model.settings.line.fill.solid.color)
                    .attr('fill', 'none');

                let pointRay = this.model.settings.line.weight * 2;
                if (this.model.settings.hiLoPoints.curShow) {
                     this.svg.append('circle')
                        .classed('point', true)
                        .attr('cx', x(dataPoint.values.length - 1))
                        .attr('cy', y(dataPoint.values[dataPoint.values.length - 1]))
                        .attr('r', pointRay)
                        .attr('fill', this.model.settings.hiLoPoints.curFill.solid.color);  
                }
                if (this.model.settings.hiLoPoints.hiShow) {
                     this.svg.append('circle')
                        .classed('point', true)
                        .attr('cx', x(topValue.index))
                        .attr('cy', y(topValue.value))
                        .attr('r', pointRay)
                        .attr('fill', this.model.settings.hiLoPoints.hiFill.solid.color);  
                }
                if (this.model.settings.hiLoPoints.loShow) {
                     this.svg.append('circle')
                        .classed('point', true)
                        .attr('cx', x(bottomValue.index))
                        .attr('cy', y(bottomValue.value))
                        .attr('r', pointRay)
                        .attr('fill', this.model.settings.hiLoPoints.loFill.solid.color);  
                }
                

                if (this.model.settings.label.show) {
                    let label = this.svg.append('text')
                        .classed('label', true);

                        label.text(dataPoint.category)
                        .attr('x', 0)
                        .attr('y', (i * slotHeight) + (slotHeight / 2))
                        .style('font-size', this.model.settings.label.fontSize + 'px')
                        .attr('fill', this.model.settings.label.fill.solid.color);
                        
                }

                 if (this.model.settings.value.show) {
                    let label = this.svg.append('text')
                        .classed('value', true);

                    label.text(dataPoint.displayValue)
                    .attr('x', width - valueWidth)
                    .attr('y', (i * slotHeight) + (slotHeight / 2))
                    .style('font-size', this.model.settings.value.fontSize + 'px')
                    .style('font-weight', 'bold')
                    .attr('fill', this.model.settings.value.fill.solid.color);
                        
                }

                //TODO Add tooltips
            }

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
            };

            return objectEnumeration;
        }
    }
}