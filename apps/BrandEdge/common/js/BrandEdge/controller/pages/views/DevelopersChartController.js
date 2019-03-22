define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) 
{
	app.controller('DevelopersChartController', function($scope, $state, $stateParams, $loading, AlertService, InfluencersChartFactory, BroadcastConstants, DataUtility){
		_.str = underscore_str;

        $scope.topTableClick = function(text){
            $state.go($state.$current.name, angular.extend({}, $state.params, { filter: _.str.clean(text).toLowerCase().replace(/ /g,"-") }));
        };

        $scope.tableClick = function(text){
            $state.go($state.$current.name, angular.extend({}, $state.params, { id: _.str.clean(text).toLowerCase().replace(/ /g,"-") }));
        };

        var map = {
            "market-view": "Market View"
        }

        $scope.$on("developer-tab", function(event, data){
            $scope.$emit('developer-menu', _.str.capitalize(data.id));
            $scope.$emit('developer-menu-top', map[data.filter] || _.str.capitalize(data.filter));
        });
	});
});