define(['BrandEdge/app'], function(app) {
	/**
	 *   Bar Chart Directive  This directive makes bar charts using d3 an the ChartService.
	 *    
	 *  inputs
	 *  
	 *    beBarChart* - indicates whether or not the chart will be a bar graph or a stacked bar chart.  This is also the directive that must be specified to trigger this directive
	 *    
	 *    		valid values:
	 *    
	 *    				bar - Bar chart to be generated with data elements as follows:
	 *    
	 *    							series [ { name: company name, value: value, yLabel: labels } ]
	 *    
	 *    				stackedBar - Brand Edge specific stacked bar chart for 3 values.  each data element pased in the series should be structured as:
	 *    
	 *    							series [ { name: company name, positiveValue: value, neutralValue: value, negativeValue } ]
	 *    
	 * 	  beChartWidth* - specifies the width of the chart in pixels.  If this directive is applied to a block level element like a div, then this will be take from the dimensions of the div.
	 * 
	 * 	  beChartHeight* - specifies the height of the chart in pixels.  If this directive is applied to a block level element like a div, then this will be take from the dimensions of the div.
	 * 
	 *    beChartData* - chart data element formatted as shown with series as described above 
	 *    
	 *    			{
	 *    				series: array as shown above, 
	 *    				
	 *    				margin: margin (HTML style margin percentage)
	 *    
	 *    			}
	 *    
	 *     beChartValues* - array of data points for standard deviation & rating determinations
	 *      
	 *     beChartPercentVisible - true/false flag to indicate whether or not y-axis values should display % behind the values ( default: false )
	 *     
	 *     beChartXlabelsVisible - true/false flag to indicate whether or not company names should be displayed on the x-axis ( default: true )
	 *   
	 *     beChartYlabelsVisible - true/false flag to indicate whether or not value should be displayed on the y-axis ( default: true )
	 *   
	 *     beChartYticksVisible - true/false flag to indicate whether or no tick marks should be shown on the y-axis ( default: true ) 
	 *   
	 *     beChartDisableTooltips - true/false flag to allow disabling of hover tooltips ( default: false ) 
	 *     
	 *     beOptionFlags - JSON format objects allowing the setting of the true false options as follows:
	 *     
	 *     			{
	 *     				chartPercentVisible: value,
	 *     				chartXlabelsVisible: value,
	 *     				chartYlabelsVisible: value,
	 *     				chartYticksVisible: value,
	 *     				chartDisableTooltips: value
	 *     			}
	 *  
	 *  returns
	 *   
	 *     beChartRating - rating object to be returned when chart rendering is complete, structured as follows:
	 *     
	 *      		{
	 *      			IBM: value,
	 *      			yellowStart: value,
	 *      			greenStart: value
	 *      		}
	 *      
	 *      	** In the future, this may be changed to a 1,2,3 rating, but the current definition is
	 *      
	 *      			if IBM value < yellowStart = Red
	 *      			if IBM value > greenStart = Green
	 *      			else = Yellow
	 *      
	 */
	app.directive('beBarChart', function(ChartService, $timeout, $window) {
	  'use strict';
	  
	  return {
	    restrict: 'A',
	    scope: {
	    	beBarChart: '@',
	    	beChartWidth: '=',
	    	beChartHeight: '=',
	    	beChartData: '=',
	    	beChartValues: '=',
	    	beChartPercentVisible: '=',
	    	beChartRating: '=',
	    	beChartXlabelsVisible: '=',
	    	beChartYlabelsVisible: '=',
	    	beChartYticksVisible: '=',
	    	beChartDisableTooltips: '=',
	    	beChartValueKey: '=',
	    	beCaption: '=',
	    	beOutboundCaption: '=',
	    	beOptionFlags: '='
	    },
	    link: function(scope, element, attrs) {
	    	var width = (scope.beChartWidth != null)?scope.beChartWidth:(element[0].offsetWidth + "");
	    	var height = (scope.beChartHeight != null)?scope.beChartHeight:(element[0].offsetHeight + "");
	    	
	    	function update() {
		    	if ((scope.beChartData == null) || (scope.beChartData.series == null)) return;
		    	
		    	var backgrounColor = element.css('background-color');
		    	
		    	var flags = {
		    			chartPercentVisible: scope.beChartPercentVisible?true:false,
		    			chartXlabelsVisible: (scope.beChartXlabelsVisible == false)?false:true,
		    			chartYlabelsVisible: (scope.beChartYlabelsVisible == false)?false:true,
		    			chartYticksVisible: (scope.beChartYticksVisible == false)?false:true, 
		    			chartDisableTooltips: scope.beChartDisableTooltips?true:false
		    	};
		    	
		    	if (scope.beOptionFlags != null) angular.extend(flags, scope.beOptionFlags);
		    	var overrideConfig = {
		    			caption: scope.beCaption,
		    			valueKey: (scope.beChartValueKey)?scope.beChartValueKey:"",
		    			rating: scope.beChartRating
		    	};
		    	
		    	var outBound = null;
		    	
		    	ChartService.remove(element[0]);
	    		
		    	var noshow = typeof attrs.beCaption !== 'undefined';
		    	var chartCaption = null;
		    	var bshow = null;
		    	if(noshow){
		    		chartCaption = attrs.beCaption.split('.')[1];
		    		bshow = scope.$parent.chartData[chartCaption].detailurl != null && scope.$parent.chartData[chartCaption].detailurl != '';
		    	}
		    	
		    	if (scope.beBarChart == 'bar') {
		    		outBound = ChartService.simpleBarChart(element[0], width, height, scope.beChartData, scope.beChartValues, flags, null, backgrounColor, overrideConfig);		    		
		    		if(noshow){
		    			scope.$parent.chartData[chartCaption].bshow = typeof outBound.rating === 'undefined' ? bshow : (outBound.rating == null ? false : bshow);
		    			scope.$parent.chartData[chartCaption].szshow = typeof outBound.rating === 'undefined' ? true : (outBound.rating == null ? false : true);
		    		}
		    		
		    	} else if (scope.beBarChart == 'stackedBar') {
		    		outBound = ChartService.stackedBarChart(element[0], width, height, scope.beChartData, scope.beChartValues, flags, backgrounColor, overrideConfig);
		    		if(noshow){
		    			scope.$parent.chartData[chartCaption].bshow = typeof outBound.rating === 'undefined' ? bshow : (outBound.rating == null ? false : bshow);
		    			scope.$parent.chartData[chartCaption].szshow = typeof outBound.rating === 'undefined' ? true : (outBound.rating == null ? false : true);
		    		}
		    		
		    	} else {
		    		throw new Error("Unknown chart type specified: " + scope.beBarChart);
		    	}
		    	
//		    	if (attrs.beChartRating != null) 
//		    	{
//		    		scope.beChartRating = outBound.rating;
//		    	}
		    	
		    	if ((attrs.beOutboundCaption != null) && (outBound.caption != null)) {
		    		scope.beOutboundCaption = (scope.beCaption != null)?scope.beCaption + " (" + outBound.caption + ")":outBound.caption;
	    		}
		    	
	    	}
	    	
            var w = angular.element($window);
            var resizePromise = null;
            w.bind('resize', function (ev) {
                resizePromise && $timeout.cancel(resizePromise);
                resizePromise = $timeout(function () {
                    width = element[0].offsetWidth;
                    height = element[0].offsetHeight;
                    update();
                }, 100);
            });
            
	    	scope.$watch('[beChartData, beChartValueKey]', update, true);
	    } 
	  };
	});
});