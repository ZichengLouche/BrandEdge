define(['BrandEdge/app'], function(app) {
	app.controller('ClientProspectController', function($scope, $state, $loading, $location, AlertService, AnalyticsAdapterFactory, BHDataAdapterService, BroadcastConstants, DataUtility, DonutFactory) {	
		$scope.initItem = function() {
			var retVal =
				($state.current.name == "landing.clientProspect.belief")?"Belief":
				($state.current.name == "landing.clientProspect.action")?"Action":
				($state.current.name == "landing.clientProspect.advocacy")?"Advocacy":"";
			
			return retVal;
		};
		
		$scope.currentFilter = 'Message';
		$scope.chartValueKey = "";
		$scope.chartFilter = "Market View";
		$scope.showCamss = "Market View";
		$scope.currentFilter = 'Message';
		
		$scope._pages = {
				"Belief" : "landing.clientProspect.belief",
				"Action" : "landing.clientProspect.action",
				"Advocacy" : "landing.clientProspect.advocacy"
		}
		
		$scope.cpMenuTableClick = function(text) {
//			$scope.$broadcast("ChartRefresh", "duh");
			$scope.showCamss = text;
			AnalyticsAdapterFactory.page({ page: $location.path() + " (segment: " + text + ")"});
		}
		
		$scope.topTableClick = function(text) {
			$scope.currentFilter = (text == "Market View"?'Message':text);
			$scope.chartValueKey = (text == "Market View"?"":text);
			$scope.chartFilter = text;
			AnalyticsAdapterFactory.page({ page: $location.path() + " (segment: " + text + ")"});
			$scope.dashboardVisible = false;
		};
		
		$scope.tableClick = function(text) {
			$state.go($scope._pages[text]);
		};
		
		$scope.showHeaderText = function(text) {
			return (text == 'all')?"Clients & Prospects":text;
		}
		
		$scope.stateCheck = function() {
			if ($state.current.name == "landing.clientProspect.dashboard") return true;
			
			return false;
		};
		
		$scope.$on("CPFilterMenu", function(event, data) {
			$scope.chartValueKey = (data == "all"?"":data);
			$scope.chartFilter = (data == "all"?"Market View":data);
		});
	});
});