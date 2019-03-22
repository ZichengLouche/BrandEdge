define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) 
{
	app.controller('InfluencersDashboardController', function($scope, $state, $loading, AlertService, InfluencersFactory, BroadcastConstants, DataUtility){
		_.str = underscore_str;
				
		$scope.tableClick = function(text){
			var page = text.toLowerCase().trim();
            if(page == "ibmer/external"){
                page = "ibmer-external"
            }else if(page === "ccamss") {
                page = "ccamss"
            }else{
                page = "market-view";
            }
			$state.go("landing.influencers.dashboard.details", { id: page });
		};


        var map = {
            "market-view": "Market View",
            "camss": "CCAMSS",
            "ibmer-external": "IBMer/External"
        }

        $scope.$on("influencer-tab", function(event, data){
            $scope.$emit('influencer-menu', map[data.id] || _.str.capitalize(data.id));
        });
	});
});