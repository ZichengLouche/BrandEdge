define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) 
{
	app.controller('DevelopersController', function($scope, $state, $loading, AlertService, DashboardFactory, BroadcastConstants, DataUtility){
		_.str = underscore_str;
		

	});
});