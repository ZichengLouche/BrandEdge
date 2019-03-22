define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str)
{	
	/**
	 * Document usage of directive
	 */
	
	app.directive("beFilter", function( $window, $timeout, ChartService, CommonUtilityFactory ) {
        'use strict';
        _.str = underscore_str;
        var utils = CommonUtilityFactory;

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'partials/filter.html',
            scope: {
                beData: '=',
            	beWidth: '=',
    	    	beHeight: '='

            },
            controller: function ($scope) {

            },
            //
            link: function(scope, element, attrs, ctrl) {
              
            	var width = scope.beWidth || element[0].offsetWidth;
                var height = scope.beHeight || element[0].offsetHeight;
                if (height === 0 || width === 0) {
//                    console.log('Please set height and width for the filter element');
                }

                function init(){

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