define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) 
{
	app.controller('StrategicCharacteristicsChartController', function($scope, $state, $stateParams, $loading, AlertService, InfluencersChartFactory, BroadcastConstants, DataUtility){
		_.str = underscore_str;
		
		$scope.tableClick = function(text){
			$state.go($state.current.name, angular.extend({}, $state.params, { filter: _.str.clean(text) }));
		};

        $scope.$on("strategic-tab", function(event, data){
            $scope.$emit('strategic-menu', _.str.clean(data.filter) || 'Clients & Prospects');
        });
	});
});