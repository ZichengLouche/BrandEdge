define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) {	
	
	app.directive("beChartContainer", function( $window, $timeout, ChartService, CommonUtilityFactory ) {
        'use strict';
        _.str = underscore_str;
        var utils = CommonUtilityFactory;

        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: 'partials/chart-container.html',
            scope: {
                beData: '=',
            	beWidth: '=',
    	    	beHeight: '=',
                beOrder: '=',
                beSort: '&'

            },
            controller: function ($scope) {
                //false=alpha true=rank
                if(!_.isBoolean($scope.beOrder)) $scope.beOrder = false;
                $scope.sort = function () {
                    $scope.beSort()( !$scope.beOrder, $scope.beData || {});
                };
            },
            //
            link: function(scope, element, attrs, ctrl) {
              
            	var width = scope.beWidth || element[0].offsetWidth;
                var height = scope.beHeight || element[0].offsetHeight;
                if (height === 0 || width === 0) {
                    throw new Error('Please set height and width for the chart container element');
                }

                function init(){
                	var data = scope.beData || {};
                    var base = (width+height)*0.5;//_.min(width, height);

                    if(typeof data.column !== 'undefined' && data.column && data.column == 4)
                    {
                    	scope.column = 4;
                    }
                    scope.sortShow = angular.isFunction(scope.beSort());
                    //console.log("scope.sort=", scope.sort);
                    scope.rating = data.rating;
                    scope.chartType = data.chartType;
                    scope.title = data.title;
                    scope.type = data.type;
                    scope.code = data.code;
                    scope.caption = data.sampleSizeMessage;
                    scope.headerFontSize = (Math.round(base*0.037));
	                scope.pRating = data.pRating;
	                scope.pRanking = utils.getDisplayRating(data.pRanking, false);
	                scope.pShow = data.pShow;
//                    if (scope.chartType == 'line') {
//                    	scope.headerFontSize = scope.headerFontSize - 3;
//                        scope.pRating = data.pRating;
//                        scope.pRanking = utils.getDisplayRating(data.pRanking, false);
//                        scope.pShow = data.pShow;
//                    }
                    
                    
                    scope.typeFontSize = (Math.round(base*0.03));
                    scope.dateBottomSize = Math.round(scope.typeFontSize*(-1.5));
                    scope.sortSize = base*0.05;
                    scope.sortPosition = base*0.05*0.3;
                    
                    scope.szshow = true;
                    // xmt 2015.6.19 15:48
                    scope.detailurl = data.detailurl;
                    scope.user_name = data.user_name;
                    scope.password = data.password;
                    scope.urlType = data.urlType;
                    scope.bshow = (scope.detailurl==null || scope.detailurl=="") ? false : true;

                    if(data.filter && typeof data.filter === 'string'){
	                    switch(data.filter.toLowerCase()){
	                    case 'mobile': 
	                    	scope.caption = data.sampleSizeMobile;
	                    	break;
	                    case 'market-view':
	                    	scope.caption = data.sampleSizeMessage;
	                    	break;
	                    case 'cognitive':
	                    	scope.caption = data.sampleSizeCognitive;
	                    	break;
	                    case 'cloud':
	                    	scope.caption = data.sampleSizeCloud;
	                    	break;
	                    case 'analytics':
	                    	scope.caption = data.sampleSizeAnalytics;
	                    	break;
	                    case 'social':
	                    	scope.caption = data.sampleSizeSocial;
	                    	break;
	                    case 'security':
	                    	scope.caption = data.sampleSizeSecurity;
	                    	break;
	                    default:
	                    	scope.caption = data.sampleSizeMessage;
	                    }
                    };
                    scope.captionFontSize = (Math.round(base*0.03));
                    scope.captionBottomSize = Math.round(scope.captionFontSize*(0.3));

                    if (data.chartType == "line") {
                    	var periods = data.value.periodPoints;
                    	var start = periods[0];
                    	var end = periods[periods.length -1];
                    	scope.date = start + " - " + end;
                    }
                    else {
                    	// xmt 2015.7.24 9:46
                    	scope.date = utils.getPeriodRange(data.type, data.year, data.month, data.quarter);
                    }
                }


                var w = angular.element($window);
                var resizePromise = null;
                w.bind('resize', function (ev) {
                    resizePromise && $timeout.cancel(resizePromise);
                    resizePromise = $timeout(function () {
                        width = element[0].offsetWidth;
                        height = element[0].offsetHeight;
                        init();
                    }, 100);
                });

                scope.$watch('[beData, beWidth, beHeight]', init, true);
            }
        }
    });
});