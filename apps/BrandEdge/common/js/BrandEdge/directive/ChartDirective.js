define(['BrandEdge/app'/*, 'lib/d3/d3', 'lib/underscore/underscore', 'lib/underscore/underscore.string'*/], function(app/*, underscore, underscore_str*/) {	
	app.directive("beChart", function( $window, $timeout, ChartService ) {
        'use strict';
        //_.str = underscore_str;
        
        return {
            restrict: 'EA',
            
            scope: {
                beData: '=',
                beConfig: '=',
                beWidth: '=',
    	    	beHeight: '=',
                beType: '@'
            },
            
            link: function(scope, element, attrs, ctrl) {

                var config = {
                	showPercent: false,
                	margin: "0.1 0.1 0.35 0.1",
                	vAxisMaxTicks: 0,
                	standardDeviation: false
                };

                var width = scope.beWidth || element[0].offsetWidth;
                var height = scope.beHeight || element[0].offsetHeight;
                //console.log(width, height);
                if (height === 0 || width === 0) {
                    //throw new Error('Please set height and width for the chart element');
//                    console.log('Please set height and width for the chart element');
                    return;
                }
                
                var data, series, values, type;
                
                prepareData();
   
                function init() {
                    prepareData();
                    ChartService.remove(element[0]);
                    var flags = {
                			chartPercentVisible: config.showPercent,
                			//chartXlabelsVisible: true,
                			//chartYticksVisible: true, 
                			//chartDisableTooltips: false,
            		};

                    var base = (width+height)*0.5;
                    var fontSize = (Math.round(base*0.035)) + "px";
                    //console.log("background", (data.rating && data.rating < 1));
                    var configBar = {
                        chartBarSpacing: 0.1,
                        chartLabelFontSize: fontSize,
                        xAxisFontSize: fontSize,
                        yAxisFontSize: fontSize,
                        //stdDev: true,
                        background: (data.rating && data.rating < 1)
                    };
                    
                    var outBound = null;
                    var noshow = typeof scope.$parent.$parent !== 'undefined' && scope.$parent.$parent !== null;
                    var bshow = null;
                    if (noshow){
                    	bshow = scope.$parent.$parent.$parent.detailurl != null && scope.$parent.$parent.$parent.detailurl != "";
                    }
                    if (type === 'bar'){	
                    	outBound = ChartService.simpleBarChart(element[0], width, height, series, /*config.standardDeviation?values:[]*/values, flags, config.vAxisMaxTicks, null, configBar);
                    	if (noshow){
                        	scope.$parent.$parent.$parent.bshow = typeof outBound.rating === 'undefined' ? bshow : (outBound.rating == null ? false : bshow);
                        	scope.$parent.$parent.$parent.szshow = typeof outBound.rating === 'undefined' ? true : (outBound.rating == null ? false : true);
                    	}
                    }else{
                    	outBound = ChartService.stackedBarChart(element[0], width, height, series, /*config.standardDeviation?values:[]*/values, flags, null, configBar);
                    	if (noshow){
                        	scope.$parent.$parent.$parent.bshow = typeof outBound.rating === 'undefined' ? bshow : (outBound.rating == null ? false : bshow);
                        	scope.$parent.$parent.$parent.szshow = typeof outBound.rating === 'undefined' ? true : (outBound.rating == null ? false : true);
                    	}
    				}
                }
                
                function prepareData() {
                    data = scope.beData || {};
                    series = { series: data.series || []};   
                    type = scope.beType || "bar";
                    if (scope.beConfig) angular.extend(config, scope.beConfig);
                    series.margin = config.margin;
                    values = data.values || null;
                }
                
                var w = angular.element($window);
                var resizePromise = null;
                w.bind('resize', function (ev) {
                  resizePromise && $timeout.cancel(resizePromise);
                  resizePromise = $timeout(function () {
                	  width = element[0].clientWidth;
                	  height = element[0].clientHeight;
                	  init();
                  }, 100);
                });
                
                scope.$watch('[beChart, beData, beConfig]', init, true);
            }
        }
    });
});