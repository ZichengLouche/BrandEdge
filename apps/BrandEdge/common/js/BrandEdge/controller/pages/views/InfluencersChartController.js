define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) 
{
	app.controller('InfluencersChartController', function($scope, $state, $stateParams, $loading, AlertService, InfluencersChartFactory, BroadcastConstants, DataUtility){
		_.str = underscore_str;
		
		$scope.tableClick = function(text){
			$state.go($state.$current.name, angular.extend({}, $state.params, { id: _.str.clean(text).toLowerCase().replace(/ /g,"-") }));
		};
		
		$scope.topTableClick = function(text){		
			$state.go($state.$current.name, angular.extend({}, $state.params, { filter: _.str.clean(text).toLowerCase().replace(/ /g,"-") }));
		};

		$scope.topRightTableClick = function(text){		
			$state.go($state.$current.name, angular.extend({}, $state.params, { source: _.str.clean(text).toLowerCase().replace(/ /g,"-") }));
		};
		
        var map = {
            "market-view": "Market View",
            "ibmer": "IBMer"
        }
        
        var sourceMap = {
        		"marketplace-&-ibm": 'total'
        };

        $scope.$on("influencer-tab", function(event, data){
            $scope.$emit('influencer-menu', _.str.capitalize(data.id));
            $scope.$emit('influencer-menu-top', map[data.filter] || _.str.capitalize(data.filter));
            $scope.$emit('influencer-menu-top-right', sourceMap[data.source] || _.str.capitalize(data.source));
        });
	});
});