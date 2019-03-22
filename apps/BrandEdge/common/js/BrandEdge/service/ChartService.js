define(['BrandEdge/app', 'lib/d3/d3', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) {
	app.service('ChartService', function($state, CustomMath, Utility, ViewConstants) {
		 _.str = underscore_str;
		var baseConfig = {
			tooltipPosition: 'absolute',
			tooltipPadding: '0 10px',
			tooltipBorderRadius: '10px',
			tooltipBackgroundColor: '#4E92DF',
			tooltipTextColor: '#ffffff',
			tooltipOpacity: 0,
			chartBackgroundColor: '#ffffff',
			chartBarSpacing: 0.1,
			animationDuration: 1000,
			animationDelay: 15,
			barChartStrokeColor: '#dddddd', 
			barChartStrokeWidth: 0.5,
			xAxisFontFamily: 'HelvNeueLightforIBM',
			yAxisFontFamily: 'HelvNeueLightforIBM',
			chartLabelFontFamily: 'HelvNeueLightforIBM',
			xAxisFontSize: null,
			yAxisFontSize: null,
			chartLabelFontSize: null,
			xAxisTextRotation: "-20",
			caption: null,
			valueKey: "",
            stdDev: true,
            background: false
		};
		
		var svc = this;
		
		var defaultFlags = {
			chartPercentVisible: false,
			chartXlabelsVisible: true,
			chartYlabelsVisible: true,
			chartYticksVisible: true, 
			chartDisableTooltips: false
		}
		
		function _populateConfigs(overrideConfig, bgColor, width, height, dataMargin) {
			var myConfig = angular.extend({}, baseConfig);
			
			myConfig.chartBackgroundColor = bgColor;
			
			angular.extend(myConfig, overrideConfig);
			
			var margin = Utility.getMarginPixels(dataMargin, width, height);
			
			if (myConfig.chartLabelFontSize == null) {
                myConfig.chartLabelFontSize = parseInt((margin.bottom)*0.18) + "px";
			}
			
			if (myConfig.xAxisFontSize == null) {
                myConfig.xAxisFontSize = parseInt((margin.bottom)*0.17) + "px";
			}
			
			if (myConfig.yAxisFontSize == null) {
                myConfig.yAxisFontSize = parseInt((margin.left)*0.2) + "px";
			}
			
			myConfig.internal = {
					width: width,
					height: height,
					margin: margin
			};
			
			myConfig.internal.colors = {
					"positive": "#8ED02D",
					"neutral": "#DDDDDD",
					"negative": "#D5421C",
					"IBM": "#2F8CCD",
					"other": "#565958",
					"muteRed": "#F4CFC2",
					"muteYellow": "#FEF4CB",
					"muteGreen": "#E2F3C5",
                    "grey": "#D8D8D8"
			}
			
			return myConfig
		}
		
		function _displayNoData(domId, myConfig) {
			var container = d3.select(domId)
				.append('svg')
				.attr('width', myConfig.internal.width)
				.attr('height', myConfig.internal.height)
				.style('background', myConfig.chartBackgroundColor);
			
			container.append('text')
				.text('No Data to Display.')
				.attr("font-family", myConfig.chartLabelFontFamily)
			    .attr("font-size", (parseInt(myConfig.chartLabelFontSize) *2).toString() + "px")
			    .attr("fill", myConfig.internal.colors.IBM)
			    .attr("text-anchor", "middle")
				.attr("x", myConfig.internal.width / 2)
				.attr("y", myConfig.internal.height / 2);
			
		}
		
		svc.remove = function(domId) {
			d3.select(domId).select('svg').remove();
		}
		
		
		/**
		 * 	
		 * 	inputs	
		 * 
		 * 		width - width in pixels of svg charting region to be created
		 * 
		 * 		height - height in pixels of the svg charting region to be created
		 * 
		 *  	data
		 *  		{
		 *  			series - array of bar heights
		 *  			margins - html style margin
		 *  		}
		 *  
		 *  	valueArray - array of datapoints for standard deviation & rating determinations
		 *  
		 *  	flags
		 *  		{
		 *  			chartPercentVisible - true/false (default false)
		 *  			chartXlabelsVisible - true/false (default true)
		 *  			chartYlabelsVisible - true/false (default true)
		 *  			chartYticksVisible - true/false (default true)
		 *  			chartDisableTooltips - true/false (default false)
		 *  		}
		 *  
		 *  returns
		 *  
		 *  	rating - ratings of 1, 2, or 3 to indicate green, red, or blue
		 */
		svc.stackedBarChart = function(domId, width, height, data, valueArray, newFlags, bgColor, overrideConfig)
		{
			var outBound = {};
			var myConfig = _populateConfigs(overrideConfig, bgColor, width, height, data.margin);
			
			flags = defaultFlags;
			if (newFlags) flags = angular.extend({},flags, newFlags);
			
			if (valueArray == null) valueArray = data.series.reduce(function(prev, item) { 
				if ((item['positiveValue' + myConfig.valueKey] == null) && (item['neutralValue' + myConfig.valueKey] == null))
				{
					return prev;
				}
				return prev.concat(item['positiveValue' + myConfig.valueKey] + item['neutralValue' + myConfig.valueKey]); 
			}, []);
			if (valueArray.length == 0||valueArray.every(function(e){
				return isNaN(e);
			}))
			{
				outBound.rating = null;
				_displayNoData(domId, myConfig);
				return outBound;
			}
			
			var margin = Utility.getMarginPixels(data.margin, width, height);
			
			var chartWidth = width - margin.left - margin.right;
			var chartHeight = height - margin.top - margin.bottom;
			
			var yScale = d3.scale.linear()
					.domain([0, 100])
					.range([0, chartHeight]);
			
			var xScale = d3.scale.ordinal()
					.domain(d3.range(0,data.series.length))
					.rangeBands([0, chartWidth], myConfig.chartBarSpacing);
				
			//create and size the drawing area
			var myChart = d3.select(domId)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.style('background', myConfig.chartBackgroundColor);
			//console.log("containar", myChart);
			var points = svc._getStdDevData(valueArray);
			
			var chartb = d3.select(domId).select('svg')
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('rect').data(data.series)
				.enter().append('rect')
				.each(function(d,i) {
					//console.log(d);
					if ((points != null) && (d.name == "IBM")) points.IBM = d['positiveValue' + myConfig.valueKey];
					var chart = d3.select(this);
					svc._drawRect(chart, i, "positive", xScale, yScale, chartHeight, domId, flags, myConfig);
				});
				
			var chartc = d3.select(domId).select('svg')
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('rect').data(data.series)
				.enter().append('rect')
				.each(function(d,i) {
					//console.log(d);
					var chart = d3.select(this);
					svc._drawRect(chart, i, "neutral", xScale, yScale, chartHeight, domId, flags, myConfig);
				});
				
			var chartd = d3.select(domId).select('svg')
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('rect').data(data.series)
				.enter().append('rect')
				.each(function(d,i) {
					//console.log(d);
					var chart = d3.select(this);
					svc._drawRect(chart, i, "negative", xScale, yScale, chartHeight, domId, flags, myConfig);
				});
				
			
			
			svc._drawVAxis(domId, data, chartHeight, margin, 100, null, flags, myConfig);
			
			svc._drawHAxis(domId, data, height, margin, xScale, flags.chartXlabelsVisible, myConfig);
			
			svc._add3TextLabels(domId, data, xScale, yScale, margin, chartHeight, flags.chartPercentVisible, myConfig);
			
//			if (myConfig.caption != null) svc.displayCaption(domId, myConfig);
			
			//outBound.rating = points;
			//if (valueArray.length < 5) outBound.rating = 0;
			//console.log("valueArray length: ", valueArray.length);
			return outBound;
		};
		
		svc.simpleBarChart = function(domId, width, height, data, valueArray, newFlags, vAxisMaxTicks, bgColor, overrideConfig) {
			var outBound = {};
			var myConfig = _populateConfigs(overrideConfig, bgColor, width, height, data.margin);
			var rankArray = {};
			
			flags = defaultFlags;
			if (newFlags) flags = angular.extend({},flags, newFlags);
			
			if (valueArray == null) valueArray = data.series.reduce(function(prev, item) { 
				if (item['value' + myConfig.valueKey] == null) {
					return prev;
				}
				return prev.concat(item['value' + myConfig.valueKey]); 
			}, []);
			
			rankArray = data.series.reduce(function(prev, item) { 
				if (item['value' + myConfig.valueKey] == null) {
					return prev;
				}
				return prev.concat(item['rank' + myConfig.valueKey]); 
			}, []);
			
			if (valueArray.length == 0||valueArray.every(function(e){
				return isNaN(e);
			})) {
				outBound.rating = null;
				_displayNoData(domId, myConfig);
				return outBound;
			}
			
			vAxisMaxTicks = (!isNaN(parseFloat(vAxisMaxTicks)) && isFinite(vAxisMaxTicks))?vAxisMaxTicks:10;
			
			var margin = Utility.getMarginPixels(data.margin, width, height);
			
			var chartWidth = width - margin.left - margin.right;
			var chartHeight = height - margin.top - margin.bottom;
			
			var yScale = d3.scale.linear()
					.domain([0, d3.max(data.series, function(d) {
						return d['value' + myConfig.valueKey];
					})])
					.range([0, chartHeight]);
			
			var xScale = d3.scale.ordinal()
					.domain(d3.range(0,data.series.length))
					.rangeBands([0, chartWidth], myConfig.chartBarSpacing);

			var tempColor;
			
			//create and size the drawing area
			var myChart = d3.select(domId)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.style('background', myConfig.chartBackgroundColor);
			var availValueArray = [];
			for(var i = 0 ; i < valueArray.length ; i ++){
					availValueArray.push(valueArray[i]);
			}
			var points = svc._drawStdDevRects(domId, chartWidth, chartHeight, availValueArray, yScale, margin, myConfig);
			
			var chartb = d3.select(domId).select('svg')
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')		
				.selectAll('rect').data(data.series)
				.enter().append('rect')	
					.style('stroke', myConfig.barChartStrokeColor)
					.style("stroke-width", myConfig.barChartStrokeWidth)
					.style('fill', function(d,i){
						if ((points != null) && (d.name == "IBM")) points.IBM = d['value' + myConfig.valueKey];
						return (d.name == "IBM"?myConfig.internal.colors.IBM:myConfig.internal.colors.other);
					})
					.attr('width', xScale.rangeBand())
					.attr('height', 0)
					.attr('x', function(d, i){
						return xScale(i);
					})
					.attr('y', chartHeight)
				.each(function(d){
					if (!flags.chartDisableTooltips)
					{
						var text = "<div style=\"text-align: center;\">" + d.name + "<br/>" + d['value' + myConfig.valueKey] + (flags.chartPercentVisible?"%":"") + "</div>"
						svc._events(d3.select(this), myConfig, text);
					}
				});
				
			
			
			chartb.transition()
				.attr('height', function(d){
						return yScale(d['value' + myConfig.valueKey]);
					})
				.attr('y', function(d) {
						return chartHeight - yScale(d['value' + myConfig.valueKey]);
					})				
				.delay(function(d,i){
					return (i * myConfig.animationDelay);
				})
				.duration(myConfig.animationDuration)
				.ease('elastic');
				
			svc._addTextLabels(domId, data, xScale, yScale, margin, chartHeight, flags.chartPercentVisible, myConfig, outBound);
			
			var max = d3.max(data.series, function(d) {
				return d['value' + myConfig.valueKey];
			});
			
			svc._drawVAxis(domId, data, chartHeight, margin, max, vAxisMaxTicks, flags, myConfig);
			
			svc._drawHAxis(domId, data, height, margin, xScale, flags.chartXlabelsVisible, myConfig);
			
//			if (myConfig.caption != null) svc.displayCaption(domId, myConfig);
			
			//outBound.rating = points;
			//if (valueArray.length < 5) outBound.rating = 0;
			//console.log("valueArray length: ", valueArray.length);
			return outBound;
		};
		
		svc._events = function(ref, myConfig, text)
		{
			var tooltip;
			ref
				.on('mouseover', function(d){
					tooltip = d3.select('body').append('div')
						.style('position', myConfig.tooltipPosition)
						.style('padding', myConfig.tooltipPadding)
						.style('border-radius', myConfig.tooltipBorderRadius)
						.style('background', myConfig.tooltipBackgroundColor)
						.style('color', myConfig.tooltipTextColor)
						.style('opacity', myConfig.tooltipOpacity);
					
					tempColor = this.style.fill;
					tooltip.transition()
						.style('opacity', 0.9);
					
					tooltip.html(text)
						.style('left', (d3.event.pageX + 3) + 'px')
						.style('top', (d3.event.pageY - 20) + 'px');
						
					d3.select(this)
						.style('opacity', 0.5)
						.style('fill', 'yellow');
				})
				.on({'mouseout' : function(d){
						tooltip.transition().delay(500)
						.style('opacity', 0.0);
						tooltip.remove();
						d3.select(this)
						.style('opacity', 1)
						.style('fill', tempColor);
					}, 'click' : function(d){
					tooltip.transition().delay(500)
						.style('opacity', 0.0);
					tooltip.remove();
					d3.select(this)
						.style('opacity', 1)
						.style('fill', tempColor);
				}});
		};
		
		svc.displayCaption = function(domId, myConfig)
		{
			d3.select(domId).select('svg')
				.append("text")
				.text(myConfig.caption)
				.attr("font-family", myConfig.chartLabelFontFamily)
			    .attr("font-size", myConfig.chartLabelFontSize)
			    .attr("fill", "#979797")
			    .attr("text-anchor", "start")
				.attr("x", 6)
				.attr("y", myConfig.internal.height - 4)
		};
		
		svc._add3TextLabels = function(domId, data, xScale, yScale, margin, chartHeight, showPercent, myConfig)
		{
			d3.select(domId).select('svg')
				.append("g")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('text').data(data.series)
				.enter().append('text')
				.text(function(d) {
//					if((d['yPositiveValue' + myConfig.valueKey] == 0 && d['yNegativeValue' + myConfig.valueKey] == 0 && d['yNeutralValue' + myConfig.valueKey] == 0) || (d['yPositiveValue' + myConfig.valueKey] == null && d['yNegativeValue' + myConfig.valueKey] == null && d['yNeutralValue' + myConfig.valueKey] == null)){
//						return '*';
//					}else 
					if (d['negativeValue' + myConfig.valueKey] > 95) {
						return '';
					}else{
						return (d['yPositiveValue' + myConfig.valueKey] != null)?d['yPositiveValue' + myConfig.valueKey]:(d['positiveValue' + myConfig.valueKey] != null)?parseInt(d['positiveValue' + myConfig.valueKey]) + (showPercent?"%":""):"";
					}
				   })
				.attr("font-family", myConfig.chartLabelFontFamily)
				.attr("font-size", myConfig.chartLabelFontSize)
			    .attr("fill", "#000000")
//			    .attr("font-size", function(d) {
//					return ((d['yPositiveValue' + myConfig.valueKey] == 0 && d['yNegativeValue' + myConfig.valueKey] == 0 && d['yNeutralValue' + myConfig.valueKey] == 0) || (d['yPositiveValue' + myConfig.valueKey] == null && d['yNegativeValue' + myConfig.valueKey] == null && d['yNeutralValue' + myConfig.valueKey] == null)?myConfig.chartLabelFontSize*2:myConfig.chartLabelFontSize);
//			    })
//			    .attr("fill", function(d) {
//					return ((d['yPositiveValue' + myConfig.valueKey] == 0 && d['yNegativeValue' + myConfig.valueKey] == 0 && d['yNeutralValue' + myConfig.valueKey] == 0) || (d['yPositiveValue' + myConfig.valueKey] == null && d['yNegativeValue' + myConfig.valueKey] == null && d['yNeutralValue' + myConfig.valueKey] == null)?myConfig.internal.colors.negative:"#000000");
//			    })
			    .attr("text-anchor", "middle")
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand()/2;
				})
				.attr("y", chartHeight)
				.each(function(d, i){
					var chartNorHeight = (d['positiveValue' + myConfig.valueKey]+d['negativeValue' + myConfig.valueKey]>80) ? (chartHeight - yScale(d['positiveValue' + myConfig.valueKey]) + 8) : (chartHeight - yScale(d['positiveValue' + myConfig.valueKey]) - 1);
					svc._animateLabels(d3.select(this),d['positiveValue' + myConfig.valueKey] == 100 ? (chartHeight - yScale(d['positiveValue' + myConfig.valueKey]/2)) : chartNorHeight);
				});
			
			d3.select(domId).select('svg')
				.append("g")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('text').data(data.series)
				.enter().append('text')
				.text(function(d) {
					if((d['yPositiveValue' + myConfig.valueKey] == 0 && d['yNegativeValue' + myConfig.valueKey] == 0 && d['yNeutralValue' + myConfig.valueKey] == 0) || (d['yPositiveValue' + myConfig.valueKey] == null && d['yNegativeValue' + myConfig.valueKey] == null && d['yNeutralValue' + myConfig.valueKey] == null)){
						return '';
					}else if (d['positiveValue' + myConfig.valueKey] > 95) {
						return '';
					}else{
						return (d['yNegativeValue' + myConfig.valueKey] != null)?d['yNegativeValue' + myConfig.valueKey]:(d['negativeValue' + myConfig.valueKey] != null)?d['negativeValue' + myConfig.valueKey] + (showPercent?"%":""):"";
					}
				})
				.attr("font-family", myConfig.chartLabelFontFamily)
			    .attr("font-size", myConfig.chartLabelFontSize)
			    .attr("fill", "#000000")
			    .attr("text-anchor", "middle")
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand()/2;
				})
				.attr("y", chartHeight)
				.each(function(d, i){
					var chartNorHeight = (d['positiveValue' + myConfig.valueKey]+d['negativeValue' + myConfig.valueKey]>80) ? (chartHeight - yScale(d['neutralValue' + myConfig.valueKey]) - yScale(d['positiveValue' + myConfig.valueKey])) : (chartHeight - yScale(d['neutralValue' + myConfig.valueKey]) - yScale(d['positiveValue' + myConfig.valueKey]) + 8);
					svc._animateLabels(d3.select(this), d['negativeValue' + myConfig.valueKey] == 100 ? (chartHeight/2) : chartNorHeight);
				});
			
			d3.select(domId).select('svg')
				.append("g")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('text').data(data.series)
				.enter().append('text')
				.text(function(d) {
					if((d['yPositiveValue' + myConfig.valueKey] == 0 && d['yNegativeValue' + myConfig.valueKey] == 0 && d['yNeutralValue' + myConfig.valueKey] == 0) || (d['yPositiveValue' + myConfig.valueKey] == null && d['yNegativeValue' + myConfig.valueKey] == null && d['yNeutralValue' + myConfig.valueKey] == null)){
						return '';
					}else if(d['positiveValue' + myConfig.valueKey]+d['negativeValue' + myConfig.valueKey]>90 && d['positiveValue' + myConfig.valueKey] < 95 && d['negativeValue' + myConfig.valueKey] < 95){
						return '';
					}else{
						return (d['yNeutralValue' + myConfig.valueKey] != null)?d['yNeutralValue' + myConfig.valueKey]:(d['neutralValue' + myConfig.valueKey] != null)?d['neutralValue' + myConfig.valueKey] + (showPercent?"%":""):"";
					}
				})
				.attr("font-family", myConfig.chartLabelFontFamily)
			    .attr("font-size", myConfig.chartLabelFontSize)
			    .attr("fill", "#000000")
			    .attr("text-anchor", "middle")
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand()/2;
				})
				.attr("y", chartHeight)
				.each(function(d, i){
					svc._animateLabels(d3.select(this), chartHeight - yScale(d['neutralValue' + myConfig.valueKey])/2  - yScale(d['positiveValue' + myConfig.valueKey]));
				});
		};
		
		svc._animateLabels = function(chart, height)
		{
			chart.transition()
				.attr('y', height)				
				.delay(function(d,i){
					return (i * 15);
				})
				.duration(1000)
				.ease('elastic');
		};
		
		svc._addTextLabels = function(domId, data, xScale, yScale, margin, chartHeight, showPercent, myConfig, outBound)
		{
			d3.select(domId).select('svg')
				.append("g")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('text').data(data.series)
				.enter().append('text')
				.text(function(d) {
						return (d['yLabel' + myConfig.valueKey] != null)?Utility.commaFormatNumber(d['yLabel' + myConfig.valueKey]):(d['value' + myConfig.valueKey] != null)?(Utility.commaFormatNumber(parseInt(Math.round(d['value' + myConfig.valueKey]))) + (showPercent?"%":"")):"*";
				   })
				.attr("font-family", myConfig.chartLabelFontFamily)
			    .attr("font-size", function(d) {
					return (d['value' + myConfig.valueKey] != null)?myConfig.chartLabelFontSize:(myConfig.chartLabelFontSize*2)
			    })
			    .attr("fill", function(d) {
					return (d['value' + myConfig.valueKey] != null)?"#000000":myConfig.internal.colors.negative;
			    })
			    .attr("text-anchor", "middle")
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand()/2;
				})
				.attr("y", chartHeight)
				.each(function(d, i){
					svc._animateLabels(d3.select(this), chartHeight - yScale(d['value' + myConfig.valueKey]) - 2);
					if (d['value' + myConfig.valueKey] == null)
					{
						outBound.caption = "* No data available";
						//svc.displayCaption(domId, myConfig);
					}
				});
		};

		svc._drawVAxis = function(domId, data, chartHeight, margin, max, vAxisMaxTicks, flags, myConfig)
		{

			var vGuideScale = d3.scale.linear()
				.domain([0, max])
				.range([chartHeight, 0]);

			var vAxis = d3.svg.axis()
				.scale(vGuideScale)
				.orient("left")
				.tickSize(flags.chartYticksVisible?6:0)
				.ticks(vAxisMaxTicks)
				.tickFormat(function(d){
					return flags.chartYlabelsVisible?(Utility.commaFormatNumber(d) + ((flags.chartPercentVisible)?"%":"")):"";
				});
				
			var vGuide = d3.select(domId).select('svg')
				.append('g');
			
			vAxis(vGuide);
			
			vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
			vGuide.selectAll('path')
				.style({fill: 'none', stroke: "#000000"});
			vGuide.selectAll('line')
				.style({fill: 'none', stroke: "#000000"});
			vGuide.selectAll('text')
				.style('font-size', myConfig.yAxisFontSize)
				.style('font-family', myConfig.yAxisFontFamily);
		};
		
		svc._drawHAxis = function(domId, data, height, margin, xScale, xLabelsVisible, myConfig)
		{
			var hAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom')
				.tickSize(0)
				.tickFormat(function(d){
					var fullName = data.series[d].name;
					var short_name = fullName;
					if (fullName.length > 17) {
						var short_name = fullName.substr(0, 14);
						short_name = short_name + '...';
					}
					return xLabelsVisible?short_name:"";
				});
			
	
			var hGuide = d3.select(domId).select('svg')
				.append('g');
				
			hAxis(hGuide);
			hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height - margin.bottom) + ')');
			hGuide.selectAll('path')
				.style({fill: 'none', stroke: "#000000"});
			hGuide.selectAll('line')
				.style({fill: 'none', stroke: "#000000"});
			
			var tooltip;
			var texts = hGuide.selectAll('text')
				.style("text-anchor", "end")
				.style('font-size', myConfig.xAxisFontSize)
				.style('interval', "auto")
				.style('font-family', myConfig.xAxisFontFamily)
				.attr("transform", "translate(0,2),rotate(" + myConfig.xAxisTextRotation + ")")
				.on('mouseover', function(d){	
					tooltip = d3.select('body').append('div')
						.style('position', myConfig.tooltipPosition)
//						.style('transform', "rotate(" + myConfig.xAxisTextRotation + "deg)")
						.style('padding', myConfig.tooltipPadding)
						.style('border-radius', myConfig.tooltipBorderRadius)
						.style('background', myConfig.tooltipBackgroundColor)
						.style('color', myConfig.tooltipTextColor)
						.style('opacity', myConfig.tooltipOpacity);
				
					tooltip.transition()
						.style('opacity', 0.9);
				
					tooltip.html(data.series[d].name)
						.style('left', (d3.event.pageX + 3) + 'px')
						.style('top', (d3.event.pageY - 20) + 'px');
				})
				.on('mouseout', function(d){
					tooltip.transition().delay(500)
					.style('opacity', 0.0);
					tooltip.remove();
				});
		};
		
		svc._getStdDevData = function(array)
		{
			//by Sookie a business rule that if count of competiors < 5 , the background color and rating should be gray, then set the yellowStart and greenStart to both 0
//			if (array.length < 5){
//				return { yellowStart: 0, greenStart: 0 };
//			}
			var points = CustomMath.getPoints(array);
			
			if (points == null) return null;
			
			return { yellowStart: points.point1, greenStart: points.point2 };
		}

        svc.isBoolean = function(obj) {
            return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        };

		//Green = > 1 standard deviation above average,
		//yellow is withing 1 standard deviation from average, 
		//red is more than 1 standard deviation below average 
		svc._drawStdDevRects = function(domId, width, height, data, yScale, margin, myConfig)
		{
			var points = svc._getStdDevData(data);
			if (points == null) return null;
			
			var max = d3.max(data);
			var point1 = points.yellowStart;
			var point2 = points.greenStart;
			
			if (point2 > max) point2 = max;
			if (point1 < 0) point1 = 0;

            var rectangle = d3.select(domId).select('svg').append('g');
            //console.log("rating inbound = ", myConfig.rating, myConfig.background);
            //Modified by Sookie add both point1 and point2 ==0, then background color is gray
            if((myConfig.background) || (myConfig.rating == 0) || (data.length < 5)){
                rectangle
                    .append("rect")
                    .attr({
                        'x': 0,
                        'y': 0,
                        'width': width,
                        'height': height,
                        'transform': 'translate(' + margin.left + ', ' + margin.top + ')'
                    })
                    .style('fill', svc.isBoolean(myConfig.background)?myConfig.internal.colors.grey:myConfig.background);
            }
          //Modified by Sookie add both point1 and point2 ==0, then background color is gray
            if (myConfig.rating == 0 || (data.length < 5)) return;
            if(myConfig.stdDev && !myConfig.background){

                //red
                rectangle
                    .append("rect")
                    .attr({
                        'x': 0,
                        'y': height - yScale(point1),
                        'width': width,
                        'height': yScale(point1),
                        'transform': 'translate(' + margin.left + ', ' + margin.top + ')'
                    })
                    .style('fill', myConfig.internal.colors.muteRed);

                //yellow
                rectangle
                    .append("rect")
                    .attr({
                        'x': 0,
                        'y': height - yScale(point2),
                        'width': width,
                        'height': yScale(point2) - yScale(point1),
                        'transform': 'translate(' + margin.left + ', ' + margin.top + ')'
                    })
                    .style('fill', myConfig.internal.colors.muteYellow);

                //green
                rectangle
                    .append("rect")
                    .attr({
                        'x': 0,
                        'y': 0,
                        'width': width,
                        'height': height - yScale(point2),
                        'transform': 'translate(' + margin.left + ', ' + margin.top + ')'
                    })
                    .style('fill', myConfig.internal.colors.muteGreen);
            }
			return points;
		}
		
		svc._drawRect = function(chart, index, item, xScale, yScale, chartHeight, domId, flags, myConfig)
		{
			chart	
				.style({'stroke': myConfig.barChartStrokeColor,
						'stroke-width': myConfig.barChartStrokeWidth,
						'fill': ((item != null)?myConfig.internal.colors[item]:myConfig.internal.colors.other)
				})
				.attr({	'width': xScale.rangeBand(),
						'height': 0,
						'x': xScale(index),
						'y': chartHeight
				})
				.each(function(d){
					if (!flags.chartDisableTooltips)
					{
						var text = "<div style=\"text-align: center;\">" + Math.round((item == "positive")?d['positiveValue' + myConfig.valueKey]:(item == "neutral")?d['neutralValue' + myConfig.valueKey]:d['negativeValue' + myConfig.valueKey]) + (flags.chartPercentVisible?"%":"") + "</div>";
						svc._events(d3.select(this), myConfig, text);
					};
				});
		
			chart.transition()
				.attr('height', function(d){
						return (item == "negative")?yScale(d['negativeValue' + myConfig.valueKey]):(item == "neutral")?yScale(d['neutralValue' + myConfig.valueKey]):yScale(d['positiveValue' + myConfig.valueKey]);
					})
				.attr('y', function(d) {
					return (item == "negative")?0:(item == "neutral")?yScale(d['negativeValue' + myConfig.valueKey]):yScale(d['negativeValue' + myConfig.valueKey] + d['neutralValue' + myConfig.valueKey]);
				})
				.delay(index * myConfig.animationDelay)
				.duration(myConfig.animationDuration)
				.ease('elastic');
		};
		
		svc._drawVAxisForLine = function(domId, data, chartHeight, margin, min, max, vAxisMaxTicks, flags, myConfig)
		{

			var vGuideScale = d3.scale.linear()
				.domain([min, max])
				.range([chartHeight, 0]);

			var vAxis = d3.svg.axis()
				.scale(vGuideScale)
				.orient("left")
				.tickSize(flags.chartYticksVisible?6:0)
				.ticks(vAxisMaxTicks)
				.tickFormat(function(d){
					return flags.chartYlabelsVisible?(Utility.commaFormatNumber(d) + ((flags.chartPercentVisible)?"%":"")):"";
				});
				
			var vGuide = d3.select(domId).select('svg')
				.append('g');
			
			vAxis(vGuide);
			
			vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
			vGuide.selectAll('path')
				.style({fill: 'none', stroke: "#000000"});
			vGuide.selectAll('line')
				.style({fill: 'none', stroke: "#000000"});
			vGuide.selectAll('text')
				.style('font-size', myConfig.yAxisFontSize)
				.style('font-family', myConfig.yAxisFontFamily);
		};
		
		svc._drawHAxisForLine = function(domId, data, height, margin, xScale, xLabelsVisible, myConfig)
		{
			var hAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom')
				.tickSize(6)
				.ticks(data.length==1?1:data.length - 1)
				.tickFormat(function(d){
					if (typeof data[d] != "undefined") {
						return xLabelsVisible?data[d]:"";
					}
				});
			
	
			var hGuide = d3.select(domId).select('svg')
				.append('g');
				
			hAxis(hGuide);
			hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height - margin.bottom) + ')');
			hGuide.selectAll('path')
				.style({fill: 'none', stroke: "#000000"});
			hGuide.selectAll('line')
				.style({fill: 'none', stroke: "#000000"});
			hGuide.selectAll('text')
				.style("text-anchor", "end")
				.style('font-size', myConfig.xAxisFontSize)
				.style('font-family', myConfig.xAxisFontFamily)
				.attr("transform", "translate(0,2),rotate(" + myConfig.xAxisTextRotation + ")");
		};
		
		svc._drawStdDevRectsForLine = function(domId, width, height, valueMap, yScale, margin, myConfig, divided)
		{
			var pointsArray = [];
			
			d3.select(domId).select('svg').append('g')
	            .append("rect")
	            .attr({
	                'x': 0,
	                'y': 0,
	                'width': width,
	                'height': height,
	                'transform': 'translate(' + margin.left + ', ' + margin.top + ')'
	            })
	            .style('fill', myConfig.internal.colors.grey);
            
			Object.keys(valueMap).map(function(current) {
				var points = svc._getStdDevData(valueMap[current]);
				var max = d3.max(valueMap[current]);
				var point1 = points.yellowStart;
				var point2 = points.greenStart;
				if (point2 > max) point2 = max;
				if (point1 < 0) point1 = 0;
				pointsArray.push({point1:point1, point2:point2});
			});

			var line = d3.svg.line()
	        	.x(function(d) { return d.x; })
	        	.y(function(d) { return d.y; })
	        	.interpolate("linear");
			
			var greens = [];
			var yellows = [];
			var reds = [];
			for (var x in pointsArray) {
				greens.push({"x": x*divided, "y": 0});
				yellows.push({"x": x*divided, "y": height - yScale(pointsArray[x].point2)});
				reds.push({"x": x*divided, "y": height - yScale(pointsArray[x].point1)});
			}
			for ( var i = pointsArray.length-1; i >= 0; i-- ){
				greens.push({"x": i*divided, "y": height - yScale(pointsArray[i].point2)});
				yellows.push({"x": i*divided, "y": height - yScale(pointsArray[i].point1)});
				reds.push({"x": i*divided, "y": height});
			}
			
			d3.select(domId).select('svg').append("path")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
	        	.attr("d", line(greens))
	        	.attr("stroke", "green")
	        	.attr("stroke-width", 0)
				.attr("opacity", 1)
	        	.attr("fill", myConfig.internal.colors.muteGreen);
			d3.select(domId).select('svg').append("path")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
	        	.attr("d", line(yellows))
	        	.attr("stroke", "yellow")
	        	.attr("stroke-width", 0)
				.attr("opacity", 1)
	        	.attr("fill", myConfig.internal.colors.muteYellow);
			d3.select(domId).select('svg').append("path")
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
	        	.attr("d", line(reds))
	        	.attr("stroke", "red")
	        	.attr("stroke-width", 0)
				.attr("opacity", 1)
	        	.attr("fill", myConfig.internal.colors.muteRed);
		}
		
		svc._eventsForLine = function(ref, myConfig, text)
		{
			var tooltip;
			ref
				.on('mouseover', function(d){
					tooltip = d3.select('body').append('div')
						.style('position', myConfig.tooltipPosition)
						.style('padding', myConfig.tooltipPadding)
						.style('border-radius', myConfig.tooltipBorderRadius)
						.style('background', myConfig.tooltipBackgroundColor)
						.style('color', myConfig.tooltipTextColor)
						.style('opacity', myConfig.tooltipOpacity);
					
					tempColor = this.style.fill;
					tooltip.transition()
						.style('opacity', 0.9);
					
					tooltip.html(text)
						.style('left', (d3.event.pageX + 5) + 'px')
						.style('top', (d3.event.pageY - 20) + 'px');
				})
				.on('mouseout', function(d){
					tooltip.transition().delay(500)
						.style('opacity', 0.0);
					tooltip.remove();
				});
		};
		
		svc.lineChart = function(domId, width, height, data, overrideConfig, newFlags) {
			var myConfig = _populateConfigs(overrideConfig, overrideConfig.chartBackgroundColor, width, height, overrideConfig.margin);
			var flags = defaultFlags;
			var opac = 0.4;
			if (newFlags) flags = angular.extend({},flags, newFlags);
			
			var margin = Utility.getMarginPixels(myConfig.margin, width, height);
			var xFontSize = parseInt((margin.bottom)*0.2);
			if (xFontSize < 10 || xFontSize > 11) {
				xFontSize = 10;
			}
            myConfig.chartLabelFontSize = xFontSize + "px";
            myConfig.xAxisFontSize = (xFontSize-1) + "px";

			var line_count = 3;
			var inner_data = data['value' + myConfig.valueKey].data;

			var periodPoints = data['value' + myConfig.valueKey].periodPoints;
			if (periodPoints.length == 0) {
				_displayNoData(domId, myConfig);
				return;
			}
			var valueArrayMap = data['value' + myConfig.valueKey].valueArrayMap;
			
			if (inner_data.length > line_count) {
				var inc = Math.floor(inner_data.length/line_count); 
				margin.bottom = margin.bottom + 10 + 17*(inc);
			}
			var max;
			var min;
			_.each(valueArrayMap, function(item){
				var i_max = d3.max(item);
				var i_min = d3.min(item);
				if (typeof max == 'undefined') {
					max = i_max;
					min = i_min;
				}
				else {
					if (i_max > max) {
						max = i_max;
					}
					if (i_min < min) {
						min = i_min;
					}
				}
			});

			var chartWidth = width - margin.left - margin.right;
			var chartHeight = height - margin.top - margin.bottom;

			var yScale = d3.scale.linear()
				.domain([min, max])
				.range([0, chartHeight]);

			var xScale = d3.scale.linear()
				.domain([0, periodPoints.length==1?1:periodPoints.length-1])
				.range([0, chartWidth]);
	
			var IBMcolor = "#2F8CCD";
			var otherColor = "#565958";
			var myChart = d3.select(domId)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.style('background', myConfig.chartBackgroundColor)
				.on("click", function(){
//					a_paths.forEach(function (d, i) {
//						if (i == 0) {
//							d.attr("stroke", IBMcolor);
//						}
//						else {
//							d.attr("stroke", otherColor);
//						}
//						d.transition().style('opacity', 1);
//					});
//					a_points.forEach(function (d, i) {
//						d.forEach(function (r) {
//							if (i == 0) {
//								r.style('fill', IBMcolor);
//								r.style('stroke', IBMcolor);
//							}
//							else {
//								r.style('fill', otherColor);
//								r.style('stroke', otherColor);
//							}
//							r.transition().style('opacity', 1);
//						});
//					});
//					a_texts.forEach(function (d, i) {
//						if (i == 0) {
//							d.style('fill', IBMcolor);
//						}
//						else {
//							d.style('fill', otherColor);
//							d.attr("font-weight", "");
//						}
//						d.transition().style('opacity', 1);
//					});
//					highlighted.IBM = -1;
//					highlighted.purple = -1;
//					highlighted.orange = -1;
				});

			var divided = chartWidth/(periodPoints.length - 1);
			svc._drawStdDevRectsForLine(domId, chartWidth, chartHeight, valueArrayMap, yScale, margin, myConfig, divided);
			svc._drawVAxisForLine(domId, inner_data, chartHeight, margin, min, max, 6, flags, myConfig);
			svc._drawHAxisForLine(domId, periodPoints, height, margin, xScale, flags.chartXlabelsVisible, myConfig);
			
			var line = d3.svg.line()
			  .x(function(d, i){
					return periodPoints.indexOf(d['name']) * divided;
				})
			  .y(function(d) {
					return chartHeight - yScale(d['value' + myConfig.valueKey]);
				})
			  .interpolate(myConfig.lineCurveType);
			
			var tipLineFunction = d3.svg.line()
            	.x(function(d) { return d.x; })
            	.y(function(d) { return d.y; })
            	.interpolate("linear");

			var a_paths = [];
			var a_points = [];
			var a_texts = [];
			var highlighted = {'IBM':-1, 'purple':-1, 'orange':-1};

			for (var x in inner_data)
			{
				var c_n = inner_data[x].company;
				var color = c_n == "IBM"?"#2F8CCD":"#565958";
				var path = myChart.append('path')
					.attr('class', 'line')
					.attr('d', line(inner_data[x].data))
					.attr("stroke", color)
					.attr("opacity", 1)
				  	.attr('stroke-width', '2').attr('fill', 'none')
				  	.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
					.on('mouseover', function(d){							
						d3.select(this)
							.style('cursor', 'pointer');
					})
					.on('mouseout', function(d){
						d3.select(this)
							.style('cursor', 'default');
					})
					.on('click', (function(p){
						return function(d){
							var index = p;
							var ibm_hightlighted = highlighted.IBM;
							var purple_idx = highlighted.purple;
							var orange_idx = highlighted.orange;
							
							var executeCase = 0; // -1: dehighlighted all; 1: highlight all; 2: highlight purple; 3:delighlight selected; 4:highlight orange; 5; highlight selected 
							if (index == 0) {
								if (purple_idx == -1 && orange_idx == -1) {
									if (ibm_hightlighted == -1) {
										executeCase = -1;
										highlighted.IBM = 1;
									}
									else {
										executeCase = 1;
										highlighted.IBM = -1;
									}
								}
								else {
									if (ibm_hightlighted == -1) {
										executeCase = 5;
										highlighted.IBM = 1;
									}
									else {
										executeCase = 3;
										highlighted.IBM = -1;
									}
								}
							}
							else {
								if (purple_idx == -1 && orange_idx == -1) {
									executeCase = 2;
									highlighted.purple = index;
								}
								else {
									if (purple_idx != -1 && orange_idx != -1) {
										if (index != purple_idx && index != orange_idx) {
											executeCase = 0;
										}
										else {
											if (index == purple_idx) {
												highlighted.purple = -1;
												executeCase = 3
											}
											else if (index == orange_idx) {
												highlighted.orange = -1;
												executeCase = 3;
											}
										}
									}
									else {
										if (index != purple_idx && index != orange_idx) {
											if (purple_idx != -1) {
												executeCase = 4;
												highlighted.orange = index;
											}
											else if (orange_idx != -1){
												executeCase = 2;
												highlighted.purple = index;
											} 
										}
										else {
											if (ibm_hightlighted == -1) {
												executeCase = 1;
											}
											else {
												executeCase = 3;
											}
											highlighted.purple = -1;
											highlighted.orange = -1;
										}
									}
								}
							}
							
							if (executeCase == 0) {
								//do nothing
							}
							else if (executeCase == -1){
								a_paths.forEach(function (d, i) {
									if (i != 0) {
										d.attr("stroke", color);
										d.transition().style('opacity', opac);
									}
								});
								a_points.forEach(function (d, i) {
									d.forEach(function (r) {
										if (i != 0) {
											r.style('fill', color);
											r.style('stroke', color);
											r.transition().style('opacity', opac);
										}
									});
								});
								a_texts.forEach(function (d, i) {
									if (i != 0) {
										d.style('fill', color);
										d.transition().style('opacity', opac);
										d.attr("font-weight", "");
									}
									else {
										d.attr("font-weight", "bold");
									}
								});
							} 
							else if (executeCase == 1){
								a_paths.forEach(function (d, i) {
									if (i != 0) {
										d.attr("stroke", color);
										d.transition().style('opacity', 1);
									}
								});
								a_points.forEach(function (d, i) {
									d.forEach(function (r) {
										if (i != 0) {
											r.style('fill', color);
											r.style('stroke', color);
											r.transition().style('opacity', 1);
										}
									});
								});
								a_texts.forEach(function (d, i) {
									if (i != 0) {
										d.style('fill', color);
										d.transition().style('opacity', 1);
										d.attr("font-weight", "");
									}
									else {
										d.attr("font-weight", "");
									}
								});
							}
							else if (executeCase == 2){
								a_paths.forEach(function (d, i) {
									if (i != 0) {
										if (i == index) {
											d.attr("stroke", "purple");
											d.transition().style('opacity', 1);
										}
										else if (i != orange_idx) {
											d.attr("stroke", color);
											d.transition().style('opacity', opac);
										}
									}
								});
								a_points.forEach(function (d, i) {
									d.forEach(function (r) {
										if (i != 0) {
											if (i == index) {
												r.style('fill', "purple");
												r.style('stroke', "purple");
												r.transition().style('opacity', 1);
											}
											else if (i != orange_idx) {
												r.style('fill', color);
												r.style('stroke', color);
												r.transition().style('opacity', opac);
											}
										}
									});
								});
								a_texts.forEach(function (d, i) {
									if (i != 0) {
										if (i == index) {
											d.style('fill', "purple");
											d.transition().style('opacity', 1);
											d.attr("font-weight", "bold");
										}
										else if (i != orange_idx) {
											d.style('fill', color);
											d.transition().style('opacity', opac);
											d.attr("font-weight", "");
										}
									}
								});
							}
							else if (executeCase == 3){
								if (index == 0) {
									a_texts[0].attr("font-weight", "");
								}
								else {
									a_paths[index].attr("stroke", color);
									a_paths[index].transition().style('opacity', opac);
									
									a_points[index].forEach(function (r) {
										r.style('fill', color);
										r.style('stroke', color);
										r.transition().style('opacity', opac);
									});
									
									a_texts[index].style('fill', color);
									a_texts[index].transition().style('opacity', opac);
									a_texts[index].attr("font-weight", "");
								}
							}
							else if (executeCase == 4){
								a_paths[index].attr("stroke", 'orange');
								a_paths[index].transition().style('opacity', 1);
								
								a_points[index].forEach(function (r) {
									r.style('fill', 'orange');
									r.style('stroke', 'orange');
									r.transition().style('opacity', 1);
								});
								
								a_texts[index].style('fill', 'orange');
								a_texts[index].transition().style('opacity', 1);
								a_texts[index].attr("font-weight", "bold");
							}
							else if (executeCase == 5) {
								a_texts[0].attr("font-weight", "bold");
							}
							d3.event.stopPropagation();
						};
					})(x));
					
					var len = periodPoints.length;
					var totalLength = path.node().getTotalLength();
					path.attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength).transition().duration(myConfig.animationDuration).ease('linear').attr('stroke-dashoffset', 0)
						.attr('d', function (b) {
							return line(inner_data[x].data);
			            });
					a_paths[x] = path;
	
					var points = myChart.selectAll('.circle').data(inner_data[x].data).enter();
					a_points[x] = [];
					points.append('circle')
						.attr('cx', function (d, i) {
							return periodPoints.indexOf(d['name']) * divided;
						})
						.attr('cy', function (d) {
							return chartHeight - yScale(d['value' + myConfig.valueKey]);
						})
						.attr('r', 1.5)
						.style('fill', color)
						.style('stroke', color)
						.attr("opacity", 0)
						.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
						.each(function(d, i){
							a_points[x][i] = d3.select(this);
							if (!flags.chartDisableTooltips)
							{
								var text_value = (d['yLabel' + myConfig.valueKey] != null)?Utility.commaFormatNumber(d['yLabel' + myConfig.valueKey]):(d['value' + myConfig.valueKey] != null)?(Utility.commaFormatNumber(parseInt(d['value' + myConfig.valueKey])) + (flags.chartPercentVisible?"%":"")):"*"
								var text = "<div style=\"text-align: center;\">" + c_n + "<br/>" + text_value + "</div>"
								svc._eventsForLine(d3.select(this), myConfig, text);
							}
						})
						.transition().delay(myConfig.animationDuration).duration(myConfig.animationDelay).attr("opacity", 1);

					var tooltip;
					var full_name = inner_data[x].company;
					var short_name = full_name;
					if (full_name.length > 17) {
						short_name =  full_name.substr(0, 14);
						short_name = short_name + '...';
					}
					
					var text = myChart.append("g").attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
						.append('text')
						.text(short_name)
						.attr("font-family", myConfig.chartLabelFontFamily)
						.attr("fill", color)
						.attr("x", (chartWidth/line_count)*(x%line_count)+17)
						.attr("y", chartHeight + margin.top + 25 + 17*Math.floor(x/line_count))
					    .attr("font-size",myConfig.chartLabelFontSize)
						.on('mouseover', (function(d){
							return function(p) {
								d3.select(this)
									.style('cursor', 'pointer');
								
								var index = d; 
								tooltip = d3.select('body').append('div')
								.style('position', myConfig.tooltipPosition)
								.style('padding', myConfig.tooltipPadding)
								.style('border-radius', myConfig.tooltipBorderRadius)
								.style('background', myConfig.tooltipBackgroundColor)
								.style('color', myConfig.tooltipTextColor)
								.style('opacity', myConfig.tooltipOpacity);
					
								tooltip.transition()
									.style('opacity', 0.9);
							
								tooltip.html(inner_data[index].company)
									.style('left', (d3.event.pageX + 3) + 'px')
									.style('top', (d3.event.pageY - 20) + 'px');
							}
						})(x))
						.on('mouseout', function(d){
							d3.select(this)
								.style('cursor', 'default');
							
							tooltip.transition().delay(500)
								.style('opacity', 0.0);
							tooltip.remove();
						})
						.on('click', (function(p){
							return function(d){
								var index = p;

								var ibm_hightlighted = highlighted.IBM;
								var purple_idx = highlighted.purple;
								var orange_idx = highlighted.orange;
								
								var executeCase = 0; // -1: dehighlighted all; 1: highlight all; 2: highlight purple; 3:delighlight selected; 4:highlight orange; 5; highlight selected 
								if (index == 0) {
									if (purple_idx == -1 && orange_idx == -1) {
										if (ibm_hightlighted == -1) {
											executeCase = -1;
											highlighted.IBM = 1;
										}
										else {
											executeCase = 1;
											highlighted.IBM = -1;
										}
									}
									else {
										if (ibm_hightlighted == -1) {
											executeCase = 5;
											highlighted.IBM = 1;
										}
										else {
											executeCase = 3;
											highlighted.IBM = -1;
										}
									}
								}
								else {
									if (purple_idx == -1 && orange_idx == -1) {
										executeCase = 2;
										highlighted.purple = index;
									}
									else {
										if (purple_idx != -1 && orange_idx != -1) {
											if (index != purple_idx && index != orange_idx) {
												executeCase = 0;
											}
											else {
												if (index == purple_idx) {
													highlighted.purple = -1;
													executeCase = 3
												}
												else if (index == orange_idx) {
													highlighted.orange = -1;
													executeCase = 3;
												}
											}
										}
										else {
											if (index != purple_idx && index != orange_idx) {
												if (purple_idx != -1) {
													executeCase = 4;
													highlighted.orange = index;
												}
												else if (orange_idx != -1){
													executeCase = 2;
													highlighted.purple = index;
												} 
											}
											else {
												if (ibm_hightlighted == -1) {
													executeCase = 1;
												}
												else {
													executeCase = 3;
												}
												highlighted.purple = -1;
												highlighted.orange = -1;
											}
										}
									}
								}
								
								if (executeCase == 0) {
									//do nothing
								}
								else if (executeCase == -1){
									a_paths.forEach(function (d, i) {
										if (i != 0) {
											d.attr("stroke", color);
											d.transition().style('opacity', opac);
										}
									});
									a_points.forEach(function (d, i) {
										d.forEach(function (r) {
											if (i != 0) {
												r.style('fill', color);
												r.style('stroke', color);
												r.transition().style('opacity', opac);
											}
										});
									});
									a_texts.forEach(function (d, i) {
										if (i != 0) {
											d.style('fill', color);
											d.transition().style('opacity', opac);
											d.attr("font-weight", "");
										}
										else {
											d.attr("font-weight", "bold");
										}
									});
								} 
								else if (executeCase == 1){
									a_paths.forEach(function (d, i) {
										if (i != 0) {
											d.attr("stroke", color);
											d.transition().style('opacity', 1);
										}
									});
									a_points.forEach(function (d, i) {
										d.forEach(function (r) {
											if (i != 0) {
												r.style('fill', color);
												r.style('stroke', color);
												r.transition().style('opacity', 1);
											}
										});
									});
									a_texts.forEach(function (d, i) {
										if (i != 0) {
											d.style('fill', color);
											d.transition().style('opacity', 1);
											d.attr("font-weight", "");
										}
										else {
											d.attr("font-weight", "");
										}
									});
								}
								else if (executeCase == 2){
									a_paths.forEach(function (d, i) {
										if (i != 0) {
											if (i == index) {
												d.attr("stroke", "purple");
												d.transition().style('opacity', 1);
											}
											else if (i != orange_idx) {
												d.attr("stroke", color);
												d.transition().style('opacity', opac);
											}
										}
									});
									a_points.forEach(function (d, i) {
										d.forEach(function (r) {
											if (i != 0) {
												if (i == index) {
													r.style('fill', "purple");
													r.style('stroke', "purple");
													r.transition().style('opacity', 1);
												}
												else if (i != orange_idx) {
													r.style('fill', color);
													r.style('stroke', color);
													r.transition().style('opacity', opac);
												}
											}
										});
									});
									a_texts.forEach(function (d, i) {
										if (i != 0) {
											if (i == index) {
												d.style('fill', "purple");
												d.transition().style('opacity', 1);
												d.attr("font-weight", "bold");
											}
											else if (i != orange_idx) {
												d.style('fill', color);
												d.transition().style('opacity', opac);
												d.attr("font-weight", "");
											}
										}
									});
								}
								else if (executeCase == 3){
									if (index == 0) {
										a_texts[0].attr("font-weight", "");
									}
									else {
										a_paths[index].attr("stroke", color);
										a_paths[index].transition().style('opacity', opac);
										
										a_points[index].forEach(function (r) {
											r.style('fill', color);
											r.style('stroke', color);
											r.transition().style('opacity', opac);
										});
										
										a_texts[index].style('fill', color);
										a_texts[index].transition().style('opacity', opac);
										a_texts[index].attr("font-weight", "");
									}
								}
								else if (executeCase == 4){
									a_paths[index].attr("stroke", 'orange');
									a_paths[index].transition().style('opacity', 1);
									
									a_points[index].forEach(function (r) {
										r.style('fill', 'orange');
										r.style('stroke', 'orange');
										r.transition().style('opacity', 1);
									});
									
									a_texts[index].style('fill', 'orange');
									a_texts[index].transition().style('opacity', 1);
									a_texts[index].attr("font-weight", "bold");
								}
								else if (executeCase == 5) {
									a_texts[0].attr("font-weight", "bold");
								}
								d3.event.stopPropagation();
							};
						})(x));
					a_texts[x] = text;
			 }
		};
		
	});
});