define([],function() 
{
	var app = null;
	
	var helper = {
		getApp: function()
		{
			if (app == null) 
			{
				app = angular.module('BrandEdgeApp', ['ui.router', 'ngSanitize', 'ngAnimate', 'angularCharts', 'ngDialog', 'darthwade.loading', 'ui.bootstrap', 'daterangepicker']);
			}
			app.run(function($rootScope, $loading, $location, AnalyticsAdapterFactory) {
				$loading.setDefaultOptions({
					text: "Loading Charts....Please Wait.", 
		        	spinnerOptions: {
					    lines: 15, // The number of lines to draw
					    width: 4, // The line thickness
					    radius: 15, // The radius of the inner circle
					    color: '#68B4FF',
					    left: '50%',
					    top: '50%'
				  }
		        });
				
				$rootScope.minHeight = $(window).height();
				
				$rootScope.spinnerOptions = 
				{
				  text: "Loading Charts....Please Wait.", 
				  spinnerOptions: {
				    lines: 15, // The number of lines to draw
				    //length: 10, // The length of each line
				    width: 4, // The line thickness
				    radius: 15, // The radius of the inner circle
				    color: '#68B4FF',
				    left: '50%',
				    top: '50%'
				  }
				};

                $rootScope.$on('$stateChangeSuccess',
                    function(event){
                        AnalyticsAdapterFactory.page({ "page": $location.path()});
                    });

                $rootScope.$on('onLoginSuccess',
                    function(event){
                        AnalyticsAdapterFactory.event({ "page": $location.path(), category: "user-login", action: "success"});
                    });

                /*
                $rootScope.$on('onLoginFailure',
                    function(event, userid){
                        AnalyticsAdapterFactory.event({ "page": $location.path(), category: "user-login", action: "failure", label: userid});
                    });*/
			});
			
			app.directive('setFocus', function(){
		  		return function(scope, element){
		  			if(!element[0].autofocus) element[0].focus();
		  		};
			});
			
			return app;
		}
	};
	
	return helper.getApp();
});