define(['BrandEdge/app'], function(app) {
	app.controller('BeliefController', function($q, $scope, $rootScope, $state, $loading, BroadcastConstants, ViewConstants, ChartService, AlertService, BHDataAdapterService, DataUtility, Utility, TrendFactory) {
		$rootScope.showExport = true;
        var localDate = DataUtility.getSelectedDate();
        var startDate;
        var endDate;
        if (localDate != null) {
        	startDate = moment(localDate.startDate.year.toString() + (localDate.startDate.month).toString(), "YYYYMM");
        	endDate = moment(localDate.endDate.year.toString() + (localDate.endDate.month).toString(), "YYYYMM");
        }
        else {
        	startDate = moment();
        	endDate = moment();
        }
		$rootScope.opt = {
        		format: 'YYYY-MM',
                startDate: startDate,
                endDate: endDate,
                minDate: moment().subtract("years", 3),
                maxDate: moment(),
                dateLimit: { years: 3 },
                showDropdowns: true,
                showWeekNumbers: true,
                timePicker: false,
                timePickerIncrement: 1,
                timePicker12Hour: true,
                singleDatePicker : false,
                maxDateEqualCurrentDate : true,
                showCalendar : true,
                customAvailable : false,
                ranges: {
                	'Most Recent': [true],
                    'Prior Month': [moment().subtract(1, 'months'), moment()],
                    'Prior 3 Months': [moment().subtract(2, 'months'), moment()],
                    'Prior 6 Months': [moment().subtract(5, 'months'), moment()],
                    'Prior 12 Months': [moment().subtract(12, 'months'), moment()],
                },
                opens: 'left',
                buttonClasses: ['btn', 'btn-sm'],
                applyClass: 'btn-primary',
                cancelClass: 'btn-default',
                separator: ' to ',
                locale: {
                    applyLabel: 'Submit',
                    cancelLabel: 'Cancel',
                    fromLabel: 'From',
                    toLabel: 'To',
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 1
                }
        };
		
		var _params = {
				'country' : DataUtility.getCountry(),
				'date' : DataUtility.getSelectedDate(),
				'column' : 1
			};
		var _pageInit = false;
		$scope._sortFlag = true;
		
		$scope.chartData = {};
		$scope.margin = '0.15 0.05 0.25 0.13';
		
		$scope.sortClick = function(key) {
			Utility.beSort($scope, key);
		}
		
		$scope._pageInit = function() {
			$scope.visible = [];
			$scope.rating = {};
			
			AlertService.reset();
			$scope.loadData(_params);
			//$scope.loadCharts(_params);
			
			$scope.$on(BroadcastConstants.CountryChange, function(event, data) {
				//this prevents double firing of this $on function
				if (_pageInit) {
					_params.country = data;
					$scope.chartData = {};
					$scope.lineData = {};
					$scope.loadData(_params);
				}
			});
			
			$scope.$on(BroadcastConstants.DateChange, function(event, data) {
				//this prevents double firing of this $on function
				if (_pageInit) {
					_params.date = data;
					$scope.chartData = {};
					$scope.lineData = {};
					$scope.loadData(_params);
				}
			});
		};
		
		$scope.loadData = function(params) {
			AlertService.reset();
			$loading.start('charts');
			if (params == null || params.country == null) {
				AlertService.setAlert("Please select your country.", "warning");
				$loading.finish('charts');
			} else if ((params.date.endDate == null) || (params.date.endDate.year == null) || (params.date.endDate.month == null)) {
				AlertService.setAlert("Please select your date.", "warning", "cpDashboard");
				$loading.finish('charts');
			} else {
				$scope.visible = [];
				$scope.rating = {};

				if (params.date.current || (params.date.startDate.year == params.date.endDate.year && params.date.startDate.month == params.date.endDate.month)) {
					BHDataAdapterService.getCpCurrent(params).then(
						function(result) {	
							$scope.chartData = result;
							
							if (Object.keys($scope.chartData).length == 0) {
								AlertService.setAlert(ViewConstants.noData, "info");
							}
							$loading.finish('charts');
						}, 
						function(failure) {
							WL.Logger.error(failure);
							AlertService.setAlert(failure, "danger");
							$loading.finish('charts');
						}
					).finally(function(duh) {
						$loading.finish('charts');
					});
					
				} else {
					var promises = [];
					var tp = [params.country.country, 'CLIENTS & PROSPECTS', 1, params.date.startDate.year + '-' + params.date.startDate.month + '-' + '1', params.date.endDate.year + '-' + params.date.endDate.month + '-' + '1', ''];
					promises.push(BHDataAdapterService.getTrendData(tp));
					promises.push(BHDataAdapterService.getCpCurrent(params));
					$q.all(promises).then(function(result) {
						TrendFactory._processTrendResult(result[0]);
						var data = {
		    				"brand": result[0]["1"],
		    				"mentions": result[0]["2"],
		    				"provider": result[0]["3"],
		    				"sentiment": result[0]["4"],
		    				"relevance": result[0]["5"],
		    				"optimize": result[0]["6"],
						};

						var metric = ['brand', 'mentions', 'provider', 'sentiment', 'relevance', 'optimize'];
						var linedata = {};
						var chartdata = {};
	    				_.each(metric, function(m){
	    					var linedelete = true;
	    					if (typeof data[m] != 'undefined') {
		    					var linedelete = typeof data[m].periodPoints === 'undefined' || data[m].periodPoints == null || data[m].periodPoints.length < 2;
		    					if (!linedelete) {
		    						linedata[m] = data[m];
		    					}
	    					}
	    					if (typeof result[1][m] != 'undefined') {
	    						if (linedelete) {
	    							chartdata[m] = result[1][m];
	    						}
	    					}
	    				});
						$scope.lineData = linedata;
						$scope.chartData = chartdata;
	
						if ((Object.keys($scope.lineData).length + Object.keys($scope.chartData).length) == 0)
						{
							AlertService.setAlert(ViewConstants.noData, "info");
						}
					}, function(failure)
					{
						WL.Logger.error(failure);
						AlertService.setAlert(failure, "danger");
						$loading.finish('charts');
					})
					.finally(function(duh)
					{
						$loading.finish('charts');
						
					});
				}
			}
			_pageInit = true;
		};
		
		$scope._pageInit();
	});
});