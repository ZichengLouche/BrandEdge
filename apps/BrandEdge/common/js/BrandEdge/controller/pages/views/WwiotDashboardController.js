define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	app.controller('WwiotDashboardController', function($scope, $timeout, $window, $rootScope, $state, $loading, MessageFactory, AlertService, BroadcastConstants, DataUtility, PermissionFactory, WWIotDashboardFactory) {
		_.str = underscore_str;
		
		$rootScope.showExport = true;
		
		$scope.isActive = false;
		
		$scope.enableSegmentation = false;
		
		$scope.openLegend = function(){
			$scope.isActive = !$scope.isActive;
		}
		
		function childToggle(isConstituent, name, toOpen, country){
			if(isConstituent){
				for(var i in $scope.data){
					if($scope.data[i].constituent == name) $scope.data[i].isOpen = toOpen;
				}
			}else{
				for(var i in $scope.data){
					if(!$scope.$parent.additional || $scope.data[i].constituent == name){
						for( var j in $scope.data[i].rows){
							if($scope.data[i].rows[j].countryName == country) $scope.data[i].rows[j].isOpen = toOpen;
						}
					}
				}
			}
		};
		
		
		$rootScope.opt = {
                format: 'YYYY-MM',
                startDate: moment(),
                endDate: moment(),
                minDate: moment().subtract("years", 3),
                maxDate: moment(),
                dateLimit: { years: 3 },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                singleDatePicker : true,
                maxDateEqualCurrentDate : true,
                showCalendar : false,
                ranges: {
                    'Most Recent': [true]
                },
                opens: 'left',
                buttonClasses: ['btn', 'btn-sm'],
                applyClass: 'btn-primary',
                cancelClass: 'btn-default',
                separator: '',
                locale: {
                    applyLabel: 'Submit',
                    cancelLabel: 'Cancel',
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                }
        };
		
		$scope.data = [];
		
		function setConfig(){
            if(!_.isEmpty($scope.data)){
            	$scope.config = {
            		click: function () {
           				if (!$scope.$$phase) $scope.$apply();
           			}
            	};
            } else {
            	 $scope.config = {};
            }
        }
		
		// xmt 2015.7.28 17:09
		function loadViewData(dateObject){
			$scope.alert = null;
			if( !(dateObject) || !(dateObject.endDate.year) || !(dateObject.endDate.month)) {
				$scope.alert = MessageFactory.getMessage("date");
			}
			$loading.start('loading');
			
    		WWIotDashboardFactory.getData($scope.wwIotPermissions, dateObject?dateObject:null).then(
	    		function(result) {
	    			if (_.isEmpty(result)){
	    				$scope.enableSegmentation = false;
	                    $scope.alert = MessageFactory.getMessage("no-data");
	                    $scope.data = [];
	                    setConfig();
	                }else{
	                	$scope.enableSegmentation = true;
	                    $scope.data = result;
	                    setConfig();
	                }
	    			$scope.$emit('enableSegmentation', $scope.enableSegmentation);
	    			$loading.finish('loading');
				}, 
				function(error) {
					$loading.finish('loading');
					$scope.alert = MessageFactory.getMessage(error, "danger");
				}
			).finally(function(e){
				$loading.finish('loading');
			});
    	}
    	
		// xmt 2015.7.29 15:34
		function hasPermission(){
			if($scope.iotCountries == null || $scope.userCountries == null) return ;
    		
			$scope.wwIotPermissions = PermissionFactory.getPermissions();
    		
    		loadViewData(DataUtility.getSelectedDate());
		}
		
		$scope.$watch('[iotCountries,userCountries]', hasPermission, true);
		
//		$scope.$watch('$parent.setting.segmentation', loadViewData(DataUtility.getSelectedDate()), true);
		
    	$scope.$on(BroadcastConstants.DateChange, function(event, date){
        	loadViewData(date);
        });
    	
		$scope.$on('allOutcomes', (function(event, toOpen){
			for(var i in $scope.data){
				$scope.data[i].isOpen = toOpen;
			}
        }).bind(this));
		
		$scope.$on('partialExpand', (function(event, expandObj){
			childToggle(expandObj.isConstituent, expandObj.name, expandObj.toOpen, expandObj.country);
        }).bind(this));
		
		$scope.$on('geographoes', (function(event, toOpen){
			for(var i in $scope.data){
				for(var j in $scope.data[i].rows){
					$scope.data[i].rows[j].isOpen = toOpen;
				}
			}
        }).bind(this));
		
		$scope.$on('titleFix', (function toFixed(event, value){
			
			var l = $('#'+value).find('.content').offset().top + $('#'+value).find('.content').height();
			var m = $('#'+value).find('.content').offset().top + 40;
			var win = angular.element($window);
			$('#'+value).find('.title-content').css({
              	top: 0
          	});
			
			win.on('resize', function() {
				if($('#'+value).find('.content').length != 0){
					l = $('#'+value).find('.content').offset().top + $('#'+value).find('.content').height();
					m = $('#'+value).find('.content').offset().top + 40;
				}
				win = angular.element($window);
			});
			
			win.on('scroll', function() {
				if($('#'+value).find('.content').length != 0){
					l = $('#'+value).find('.content').offset().top + $('#'+value).find('.content').height();
					m = $('#'+value).find('.content').offset().top + 40;
					var n = win.scrollTop();
//				if (n > 0) {
//					$('#'+value).find('.title-content').css("position",
//					"fixed");
//				}
					if (n > m) {
						if(n > l){
							$('#'+value).find('.title-content').hide();
						}else{
							$('#'+value).find('.title-content').css("display",
							"block");
						}
					} else {
						$('#'+value).find('.title-content').hide();
					}
				}
			});
		}).bind(this));
		
		
		
		$scope.$on('segmentation', (function(event, segmentationObj){
			if($scope.data.length==0) return;
			var CPOldStatus, influencerOldStatus;
        	switch(segmentationObj.oldVal){
        	case 'allover':
        		CPOldStatus = $scope.data[0].isOpen;
        		influencerOldStatus = $scope.data[6].isOpen;
        		break;
        	case 'Cognitive':
        		CPOldStatus = $scope.data[1].isOpen;
        		influencerOldStatus = $scope.data[7].isOpen;
        		break;
        	case 'Cloud':
        		CPOldStatus = $scope.data[1].isOpen;
        		influencerOldStatus = $scope.data[7].isOpen;
        		break;
        	case 'Analytics':
        		CPOldStatus = $scope.data[2].isOpen;
        		influencerOldStatus = $scope.data[8].isOpen;
        		break;
        	case 'Mobile':
        		CPOldStatus = $scope.data[3].isOpen;
        		influencerOldStatus = $scope.data[9].isOpen;
        		break;
        	case 'Social':
        		CPOldStatus = $scope.data[4].isOpen;
        		influencerOldStatus = $scope.data[10].isOpen;
        		break;
        	case 'Security':
        		CPOldStatus = $scope.data[5].isOpen;
        		influencerOldStatus = $scope.data[11].isOpen;
        		break;
        	default:
        		CPOldStatus = false;
    			influencerOldStatus = false;
        	}
        	
        	switch(segmentationObj.newVal){
        	case 'allover':
        		$scope.data[0].isOpen = CPOldStatus;
        		$scope.data[6].isOpen= influencerOldStatus;
        		break;
        	case 'Cognitive':
        		$scope.data[1].isOpen = CPOldStatus;
        		$scope.data[7].isOpen= influencerOldStatus;
        		break;
        	case 'Cloud':
        		$scope.data[1].isOpen = CPOldStatus;
        		$scope.data[7].isOpen= influencerOldStatus;
        		break;
        	case 'Analytics':
        		$scope.data[2].isOpen = CPOldStatus;
        		$scope.data[8].isOpen= influencerOldStatus;
        		break;
        	case 'Mobile':
        		$scope.data[3].isOpen = CPOldStatus;
        		$scope.data[9].isOpen= influencerOldStatus;
        		break;
        	case 'Social':
        		$scope.data[4].isOpen = CPOldStatus;
        		$scope.data[10].isOpen= influencerOldStatus;
        		break;
        	case 'Security':
        		$scope.data[5].isOpen = CPOldStatus;
        		$scope.data[11].isOpen= influencerOldStatus;
        		break;
        	}
        }).bind(this));
		
		

	});
});