define(['BrandEdge/app',
        
        //constants
        'BrandEdge/constants/BroadcastConstants',
        'BrandEdge/constants/ViewConstants',
        
        //services
        'BrandEdge/service/GlobalizationService',
        'BrandEdge/service/StateService',
        'BrandEdge/service/AlertService',
        'BrandEdge/service/TableTabService',
        'BrandEdge/service/ChartService',
        'BrandEdge/service/ExportService',
        'BrandEdge/service/NgDialogService',
        //adapter specific services
        'BrandEdge/service/adapters/BHDataAdapterService',
        'BrandEdge/service/adapters/CredentialsAdapterService',
        
     	//factories
     	//'BrandEdge/factory/BhdFactory',
        'BrandEdge/factory/WLAdapterFactory',
        'BrandEdge/factory/CustomMath',
        'BrandEdge/factory/DataUtility',
        'BrandEdge/factory/Utility',
        'BrandEdge/factory/DashboardFactory',
        'BrandEdge/factory/DeveloperFactory',
        'BrandEdge/factory/DeveloperChartFactory',
        'BrandEdge/factory/InfluencersFactory',
        'BrandEdge/factory/InfluencersChartFactory', 
        'BrandEdge/factory/EmployeeFactory',
        'BrandEdge/factory/DonutFactory',
        'BrandEdge/factory/MessageFactory',
        'BrandEdge/factory/CommonUtilityFactory',
        'BrandEdge/factory/AnalyticsAdapterFactory',
        'BrandEdge/factory/TrendFactory',
        'BrandEdge/factory/PermissionFactory',
        'BrandEdge/factory/WWIotDashboardFactory',
        'BrandEdge/factory/StrategicCharacteristicsChartFactory',

        //directives
        'BrandEdge/directive/AlertDirective',
        'BrandEdge/directive/DonutDirective',
        'BrandEdge/directive/TableTabDirective',
        'BrandEdge/directive/TableDataDirective',
        'BrandEdge/directive/BarChartDirective',
        'BrandEdge/directive/ChickletDirective',
        'BrandEdge/directive/ChartDirective',
        'BrandEdge/directive/ChartContainerDirective',
        'BrandEdge/directive/PieDirective',
        'BrandEdge/directive/BuilderDirective',
        'BrandEdge/directive/FilterDirective',
        'BrandEdge/directive/LineChartDirective',
        'BrandEdge/directive/ToolTipDirective',
        'BrandEdge/directive/AlertToolTipDirective',
        'BrandEdge/directive/HasPermissionDirective',
        'BrandEdge/directive/RectrangleToolTipDirective',
        'BrandEdge/directive/TitleTooltipDirective',
        'BrandEdge/directive/BoxesTableDirective',
        'BrandEdge/directive/BoxesTableTitleDirective',
        'BrandEdge/directive/CountryNameDirective',
        'BrandEdge/directive/FormVerifyDirective',
        'BrandEdge/directive/BeMarqueeDirective',
        
     	//filters
     	'BrandEdge/filter/GlobalizationFilter',
     	'BrandEdge/filter/RatingFilter',
     	'BrandEdge/filter/ScoringFilter',
     	'BrandEdge/filter/CustomFilters',
     	'BrandEdge/filter/CPDashboardChartFilter',
     	'BrandEdge/filter/ExtendScoring',
     	
     	//controllers
        'BrandEdge/controller/BaseController',
     	'BrandEdge/controller/AlertController',
     	'BrandEdge/controller/TableTabController',
     	//page/view controllers
     	'BrandEdge/controller/pages/LogonController',
     	'BrandEdge/controller/pages/LandingController',
     	'BrandEdge/controller/pages/views/DashboardController',
     	'BrandEdge/controller/pages/views/EmployeeController',
     	'BrandEdge/controller/pages/views/InfluencersController',
     	'BrandEdge/controller/pages/views/InfluencersDashboardController',
     	'BrandEdge/controller/pages/views/InfluencersDashboardDetailsController',
     	'BrandEdge/controller/pages/views/InfluencersChartController',
     	'BrandEdge/controller/pages/views/InfluencersChartDetailsController',
     	'BrandEdge/controller/pages/views/DevelopersController',
        'BrandEdge/controller/pages/views/DevelopersDashboardController',
        'BrandEdge/controller/pages/views/DevelopersDashboardDetailsController',
        'BrandEdge/controller/pages/views/DevelopersChartController',
        'BrandEdge/controller/pages/views/DevelopersChartDetailsController',
     	'BrandEdge/controller/pages/views/ClientProspectController',
     	'BrandEdge/controller/pages/views/StrategicCharacteristicsController',
        'BrandEdge/controller/pages/views/StrategicCharacteristicsChartController',
        'BrandEdge/controller/pages/views/StrategicCharacteristicsChartDetailController',
     	
     	//subview controllers
     	'BrandEdge/controller/pages/views/clientProspectViews/BeliefController',
     	'BrandEdge/controller/pages/views/clientProspectViews/ActionController',
     	'BrandEdge/controller/pages/views/clientProspectViews/AdvocacyController',
     	'BrandEdge/controller/pages/views/clientProspectViews/CPDashboardController',
     	
     	//popup controllers
     	'BrandEdge/controller/popups/TermsController',
     	'BrandEdge/controller/popups/ExportPdfPopupController',
	     	//page/view controllers
	     	'BrandEdge/controller/pages/LogonController',
	     	'BrandEdge/controller/pages/LandingController',
	     	'BrandEdge/controller/pages/views/DashboardController',
	     	'BrandEdge/controller/pages/views/EmployeeController',
	     	'BrandEdge/controller/pages/views/InfluencersController',
	     	'BrandEdge/controller/pages/views/InfluencersDashboardController',
	     	'BrandEdge/controller/pages/views/InfluencersDashboardDetailsController',
	     	'BrandEdge/controller/pages/views/InfluencersChartController',
	     	'BrandEdge/controller/pages/views/InfluencersChartDetailsController',
	     	'BrandEdge/controller/pages/views/DevelopersController',
            'BrandEdge/controller/pages/views/DevelopersDashboardController',
            'BrandEdge/controller/pages/views/DevelopersDashboardDetailsController',
            'BrandEdge/controller/pages/views/DevelopersChartController',
            'BrandEdge/controller/pages/views/DevelopersChartDetailsController',
	     	'BrandEdge/controller/pages/views/ClientProspectController',
	     	'BrandEdge/controller/pages/views/WwiotController',
	     	'BrandEdge/controller/pages/views/WwiotDashboardController',
	     	
	     	//subview controllers
	     	'BrandEdge/controller/pages/views/clientProspectViews/BeliefController',
	     	'BrandEdge/controller/pages/views/clientProspectViews/ActionController',
	     	'BrandEdge/controller/pages/views/clientProspectViews/AdvocacyController',
	     	'BrandEdge/controller/pages/views/clientProspectViews/CPDashboardController',
	     	

	     	
	     	
	     	//popup controllers
	     	'BrandEdge/controller/popups/TermsController',
	     	'BrandEdge/controller/popups/ExportPdfPopupController'
        
     	], function(app){
			
			app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

			//$urlRouterProvider.otherwise("/landing/dashboard");
			$urlRouterProvider.otherwise("/logon");
			//$urlRouterProvider.when('/landing/influencers', '/landing/influencers/dashboard/market-view');
			
			$stateProvider
				.state('landing', {
					      	url: "/landing",
					      	controller: 'LandingController',
					      	templateUrl: 'landingPage.html'
			    })
			    
			    .state('logon', {
					      	url: "/logon",
					      	controller: 'LogonController',
					      	templateUrl: 'logon.html'
			    })
			    
			    .state('landing.wwiot', {
			      	url: "/wwiot",
                    controller: "WwiotController",
			      	templateUrl: 'views/wwiot.html'
			    })
			    
			    .state('landing.wwiot.dashboard', {
			      	url: "/dashboard",
			      	controller: "WwiotDashboardController",
			      	templateUrl: 'views/wwiot.dashboard.html'
			    })
			    
				.state('landing.dashboard', {
			      	url: "/dashboard",
                    controller: "DashboardController",
			      	templateUrl: 'views/dashboard.html'
			    })
			    
				.state('landing.clientProspect', {
			      	url: "/clientProspect",
			      	controller: "ClientProspectController",
			      	templateUrl: 'views/clientProspect.html'
			    })
			    
			    .state('landing.clientProspect.dashboard', {
			      	url: "/dashboard",
			      	controller: "CPDashboardController",
			      	templateUrl: 'views/clientProspectViews/cpdashboard.html'
			    })
			    
			    .state('landing.clientProspect.belief', {
			      	url: "/belief",
			      	controller: "BeliefController",
			      	templateUrl: 'views/clientProspectViews/belief.html'
			    })
			    
			    .state('landing.clientProspect.action', {
			      	url: "/action",
			      	controller: "ActionController",
			      	templateUrl: 'views/clientProspectViews/action.html'
			    })
			    
			    .state('landing.clientProspect.advocacy', {
			      	url: "/advocacy",
			      	controller: "AdvocacyController",
			      	templateUrl: 'views/clientProspectViews/advocacy.html'
			    })
			    
				.state('landing.influencers', {
			      	url: "/influencers",
			      	controller: "InfluencersController",
			      	templateUrl: 'views/influencers.html'
				})
				
				.state('landing.influencers.dashboard', {
			      	url: "/dashboard",
			      	controller: "InfluencersDashboardController",
			      	templateUrl: 'views/influencers.dashboard.html'
				})
				
				.state('landing.influencers.dashboard.details', {
		            url: '/:id',
		            templateUrl: 'views/influencers.dashboard.details.html',
		            controller: "InfluencersDashboardDetailsController",
		            resolve:{
		            	filter: function($stateParams){
			      			return $stateParams.id || "market-view";
			      		}
			      	}
		        })
		        
		        .state('landing.influencers.chart', {
			      	url: "/chart",
			      	controller: "InfluencersChartController",
			      	templateUrl: 'views/influencers.chart.html'
				})
				
				.state('landing.influencers.chart.details', {
		            url: '/:id/:filter/:source',
		            templateUrl: 'views/influencers.chart.details.html',
		            controller: "InfluencersChartDetailsController",
		            resolve:{
		            	column: function($stateParams){
			      			return $stateParams.id || "belief";
			      		},
			      		
			      		filter: function($stateParams){
			      			return $stateParams.filter || "market-view";
			      		},
			      		source: function($stateParams){
			      			return $stateParams.source || "marketplace";
			      		}
			      	}
		        })

				.state('landing.developers', {
			      	url: "/developers",
			      	controller: "DevelopersController",
			      	templateUrl: 'views/developers.html'
			    })

                .state('landing.developers.dashboard', {
                    url: "/dashboard",
                    controller: "DevelopersDashboardController",
                    templateUrl: 'views/developers.dashboard.html'
                })

                .state('landing.developers.dashboard.details', {
                    url: '/:id',
                    templateUrl: 'views/developers.dashboard.details.html',
                    controller: "DevelopersDashboardDetailsController",
                    resolve:{
                        filter: function($stateParams){
                            return $stateParams.id || "market-view";
                        }
                    }
                })

                .state('landing.developers.chart', {
                    url: "/chart",
                    controller: "DevelopersChartController",
                    templateUrl: 'views/developers.chart.html'
                })

	      		.state('landing.developers.chart.details', {
			      	url: "/:id/:filter",
			      	controller:  "DevelopersChartDetailsController", //function($scope){},
			      	templateUrl: 'views/developers.chart.details.html',
			      	resolve:{
                        column: function($stateParams){
                            return $stateParams.id || "belief";
                        },

                        filter: function($stateParams){
                            return $stateParams.filter || "market-view";
                        }
			      	}
			    })
			    
				.state('landing.employees', {
			      	url: "/employees",
			      	controller: "EmployeeController",
			      	templateUrl: 'views/employees.html'
			    })
			
			    //Strategic Characteristics (Brand Attributes)
				.state('landing.strategicCharacteristics', {
			      	url: "/strategicCharacteristics",
			      	controller: "StrategicCharacteristicsController",
			      	templateUrl: 'views/strategic.characteristics.html'
			    })
			
				.state('landing.strategicCharacteristics.chart', {
			      	url: "/chart",
			      	controller: "StrategicCharacteristicsChartController",
			      	templateUrl: 'views/strategic.characteristics.chart.html'
			    })
			    
			    .state('landing.strategicCharacteristics.chart.detail', {
			      	url: "/:filter",
			      	controller: "StrategicCharacteristicsChartDetailController",
			      	templateUrl: 'views/strategic.characteristics.chart.detail.html',
			      	resolve:{
			      		filter: function($stateParams){
			      			return $stateParams.filter || "Clients & Prospects";
			      		}
			      	}
			    });
		}]);
});