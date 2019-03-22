define(['BrandEdge/app'], function(app) {
	app.controller('LandingController', function($scope, $state, $loading, $location, AnalyticsAdapterFactory, BroadcastConstants, GlobalizationService, BHDataAdapterService, 
			CredentialsAdapterService, AlertService, ngDialog, ExportService, PermissionFactory, ngDailogService) {
		
		$scope.keyFile = "messages";
		$scope.country = JSON.parse(localStorage.getItem('brand.edge.country'));
		$scope.editable = false;
		var permissionList = JSON.parse(localStorage.getItem('brand.edge.bluePage'));
		$scope.announcement = {content: ''};
		var getAnnouncement = function(country){
        	BHDataAdapterService.getBannerContent(country, permissionList[1]).then(
                    function(success){
                    	$scope.announcement.content = !!success[0]['BANNER_CONTENT']?success[0]['BANNER_CONTENT']:'[Please edit banner for announcements to BE users.]';
                    	if (!$scope.$$phase) $scope.$apply();
                    },
                    function(error){
                    	$scope.groups = ["No groups"];
                    	$scope.announcement = {content: ''};
        				AlertService.setAlert(response, "danger");
                    }
            );
        }
		
//		getAnnouncement($scope.country);
		
        if ($scope.country != null) {
            GlobalizationService.setLanguage($scope.country.code);
        } else {
            GlobalizationService.setLanguage("EN");
        }

		var localDate = JSON.parse(localStorage.getItem('brand.edge.selectedDate'));
        if (localDate == null){
        	// xmt 2014.7.13 11:49
	        $scope.date = {
        		startDate: new Date(new Date().getFullYear(),new Date().getMonth()),
				endDate: new Date(new Date().getFullYear(),new Date().getMonth()),
				isCurrent : true
			};
        	
        }
        else {
    		$scope.date = {
				endDate: new Date(localDate.endDate.year, localDate.endDate.month-1, 1),
				startDate: new Date(localDate.startDate.year, localDate.startDate.month-1, 1),
				isCurrent : localDate.current
    		};
        }        
         
		$scope.tabs = [
		    {
	        	title: 'WW/IOT Beta',
	        	url: 'landing.wwiot.dashboard',
	        	state: 'landing.wwiot'
			}, 
			{
		        title: 'Dashboard',
		        url: 'landing.dashboard',
                state: 'landing.dashboard'
		    }, {
		        title: 'Clients & Prospects',
		        url: 'landing.clientProspect.dashboard',
		        state: 'landing.clientProspect'
		    }, {
		        title: 'Influencers',
		        url: 'landing.influencers.dashboard.details({ id: "belief", filter: "market-view" })',
                state: 'landing.influencers'
		    },{
		        title: 'Developers',
		        url: 'landing.developers.dashboard.details({ id: "belief", filter: "market-view" })',
                state: 'landing.developers'
			},{
		        title: 'Employees',
		        url: 'landing.employees',
                state: 'landing.employees'
			},{
		        title: 'Strategic Brand Attributes',
		        url: 'landing.strategicCharacteristics.chart.detail({ filter: "Clients & Prospects" })',
                state: 'landing.strategicCharacteristics'
			}
		];
		
		$scope.currentTab = $state.current.name;
		
		$scope.onClickTab = function (tab) {
		    $scope.currentTab = tab.url;
		};
		
		$scope.doSignOut = function(){
			ngDailogService.simpleComfirmDailog("Do you really want to sign out?", "logon");
		};
		
		$scope.isActiveTab = function(tab) {
		    //return tabUrl == $scope.currentTab;
            return $state.includes(tab.state);
		};
        
		CredentialsAdapterService.getDisplayName().then(
			function(response) {
				$scope.name = response;
				if(!$scope.$$phase) $scope.$apply();
			},
			function(response) {
				$scope.name = "no name user";
				AlertService.setAlert(response, "danger");
			}
		);
		
		

		BHDataAdapterService.getViewableCountries().then(
			function(response) {
				$scope.languages = response;
				if(response.length==1){
					$scope.country = response[0];
				}
				// xmt 2014.7.9 14:46
				PermissionFactory.setUserCountries(response);
				$scope.userCountries = response;
				if(!$scope.$$phase) $scope.$apply();
			},
			function(response) {
				$scope.groups = ["No groups"];
				AlertService.setAlert(response, "danger");
			}
		);
		
		$scope.showExportPdfPopup = function() {
			var isIE = "ActiveXObject" in window;
			if (isIE) {
				alert("IE does not support Export!");
				return;
			}
			ngDialog.open({
				template: "views/exportPdfSelect.html",
				controller: 'ExportPdfPopupController',
				className: 'ngdialog-theme-export',
				showClose: false,
			});
		};
		
        $scope.$watch('country', function(newVal, oldVal) {
            if (newVal != null) {
            	// xmt 2014.7.10 18:39
            	getAnnouncement(newVal);
            	if(newVal == oldVal) {
            		return ;
            	}
            	AnalyticsAdapterFactory.page({ page: $location.path(), custom1: "Country Changed from: " + angular.isUndefined(oldVal)?"n/a":oldVal.country + " to: " + newVal.country});
            	$scope.$broadcast(BroadcastConstants.CountryChange, newVal);
                localStorage.setItem('brand.edge.country',JSON.stringify(newVal));
                GlobalizationService.setLanguage(newVal.code);
                
                
            }
        });
        
        $scope.isAdmin = function(){
        	return permissionList.some(function(e){
        		return e == "IBM.Brand.Health.Admin";
        	});
        }
        
        $scope.$watch('date', function(newVal, oldVal) {
             if (newVal != null) {
            	if(localStorage.getItem('brand.edge.selectedDate') && newVal.startDate.getTime() == oldVal.startDate.getTime() && newVal.endDate.getTime() == oldVal.endDate.getTime() && newVal.isCurrent == oldVal.isCurrent){
            		return;
            	}
            	var selectedDate = {};
            	$scope.date.isCurrent = newVal.isCurrent;
            	if (typeof newVal.endDate === 'string'){
            		var startDateUnits = newVal.startDate.split('-');
            		var endDateUnits = newVal.endDate.split('-');
            		selectedDate = {'startDate': {'year' : startDateUnits[0],
						  						  'month' : startDateUnits[1].substring(0,1) === '0' ? startDateUnits[1].substring(1,2) : startDateUnits[1]
					 							 }, 
					 				'endDate': {'year' : endDateUnits[0],
            									'month' : endDateUnits[1].substring(0,1) === '0' ? endDateUnits[1].substring(1,2) : endDateUnits[1]
            								   }, 
            						'current' : $scope.date.isCurrent};
            	} else {
            		selectedDate = {'startDate': {'year' : newVal.startDate.getFullYear().toString(),
						  						  'month' : (newVal.startDate.getMonth()+1).toString()
					 							 },
					 				'endDate': {'year' : newVal.endDate.getFullYear().toString(),
							  					'month' : (newVal.endDate.getMonth()+1).toString()
						 					   },
            						'current': $scope.date.isCurrent};
            	}
                $scope.$broadcast(BroadcastConstants.DateChange, selectedDate);
                localStorage.setItem('brand.edge.selectedDate',JSON.stringify(selectedDate));
             }
        });
        
        $scope.showEdit = function(){
        	$scope.editable = !$scope.editable;
        }
        
        $scope.updateAnnouncement = function(event, invalid){
        	if(invalid) return;
        	if(event.type==='click'||(event.type==='keypress'&&event.keyCode==13)){
        		$loading.start('loading');
        		BHDataAdapterService.setBannerContent($scope.announcement.content, $scope.country, permissionList[1]).then(
        				function(success){
//        					getAnnouncement($scope.country);
        					$scope.editable = !$scope.editable;
        					$loading.finish('loading');
        				},
        				function(error){
        					AlertService.setAlert(error, "danger");
        				}
        		);
        	}
        }
	});
});