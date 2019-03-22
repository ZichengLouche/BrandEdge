define(['BrandEdge/app'], function(app)
{
	app.directive('lineChart', function(ChartService, $timeout, $window) {
		'use strict';
		  
		return {
			restrict: 'EA',
            scope: {
                beData: '=',
                beConfig: '=',
                beWidth: '=',
    	    	beHeight: '=',
    	    	beChartValueKey: '=',
    	    	beChartPercentVisible: '=',
    	    	beMargin: '=',
            },
            
			link: function link(scope, element, attrs) {
                var width = scope.beWidth || element[0].offsetWidth;
                var height = scope.beHeight || element[0].offsetHeight;
                if (height === 0 || width === 0) {
//                    console.log('Please set height and width for the chart element');
                    return;
                }

                var w = angular.element($window);
                var resizePromise = null;
                w.bind('resize', function (ev) {
                  resizePromise && $timeout.cancel(resizePromise);
                  resizePromise = $timeout(function () {
                	  width = element[0].clientWidth;
                	  height = element[0].clientHeight;
                	  update();
                  }, 100);
                });

                function update() {
                	if ((scope.beData == null)) return;
    				var flags = {
    						"chartYticksVisible":true,
    						"chartYlabelsVisible":true,
    						"chartXlabelsVisible":true,
    						"chartDisableTooltips":false,
    						"chartPercentVisible": true,
    				};
    				var config = {
    						"lineCurveType":"linear",
    						"animationDelay":2000,
    						"valueKey": (scope.beChartValueKey)?scope.beChartValueKey:"",
    						"margin" :(scope.beMargin)?scope.beMargin:"0.1 0.1 0.15 0.1",
    				};
    				var data = scope.beData || {}; 
                	
                    ChartService.remove(element[0]);
                    ChartService.lineChart(element[0], width, height, data, config, flags);
                }
                
                scope.$watch('[beData, beChartValueKey]', update, true);
			}
		}
	});
});