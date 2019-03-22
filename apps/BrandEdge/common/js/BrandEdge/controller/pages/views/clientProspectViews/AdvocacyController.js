define(['BrandEdge/app'], function(app) 
{
	app.controller('AdvocacyController', function($scope, $rootScope, $state, $loading, $q, BroadcastConstants, ViewConstants, ChartService, AlertService, BHDataAdapterService, DataUtility, Utility, TrendFactory) 
	{
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
				'column' : 3,
				'columnForList' : 2
				};
		var _pageInit = false;
		$scope._sortFlag = true;
		
		$scope.testListValue = function(key) {
			
			if (($scope.listData) && ($scope.listData[key]) && ($scope.listData[key].data) && ($scope.listData[key].data.length > 0)) return true;
			
			return false;
		}
		
		$scope.chartData = {};
		$scope.listData = null;
		$scope.margin = '0.15 0.05 0.25 0.13';
		$scope.margin2 = '0.1';
		
		$scope.sortClick = function(key)
		{
			Utility.beSort($scope, key);
		}
		
		$scope._pageInit = function()
		{
			$scope.visible = [];
			$scope.rating = [];
			
			AlertService.reset();
			$scope.loadData(_params);
			//$scope.loadCharts(_params);
			
			$scope.$on(BroadcastConstants.CountryChange, function(event, data) 
			{
				//this prevents double firing of this $on function
				if (_pageInit)
				{
					_params.country = data;
					$scope.lineData = [];
					$scope.chartData = [];
					$scope.listData = [];
					$scope.loadData(_params);
				}
			});
			
			$scope.$on(BroadcastConstants.DateChange, function(event, data)
			{
				//this prevents double firing of this $on function
				if (_pageInit)
				{
					_params.date = data;
					$scope.lineData = [];
					$scope.chartData = [];
					$scope.listData = [];
					$scope.loadData(_params);
				}
			});
		};
		
		$scope.loadData = function(params)
		{
			AlertService.reset();
			$loading.start('charts');
			if ((params == null) || (params.country == null))
			{
				AlertService.setAlert("Please select your country.", "warning");
				$loading.finish('charts');
			} else if ((params.date.endDate == null) || (params.date.endDate.year == null) || (params.date.endDate.month == null)) {
				AlertService.setAlert("Please select your date.", "warning", "cpDashboard");
				$loading.finish('charts');
			}
			else
			{
				if (params.date.current || (params.date.startDate.year == params.date.endDate.year && params.date.startDate.month == params.date.endDate.month)) {
					var promises = [];
					promises.push(BHDataAdapterService.getCpCurrent(params));
					promises.push(BHDataAdapterService.getCpListCurrent(params));
					
					$q.all(promises).then(function(results)
					{
						
						$scope.listData = results[1];
						$scope.chartData = results[0];
						
						if ((Object.keys($scope.listData).length + Object.keys($scope.chartData).length) == 0)
						{
							AlertService.setAlert(ViewConstants.noData, "info");
						}
						
					}, function(failure)
					{
						WL.Logger.error(failure);
						AlertService.setAlert(failure, "danger");
					})
					.finally(function(duh)
					{
						$loading.finish('charts');
					});
				}
				else {
					var promises = [];
					var tp = [params.country.country, 'CLIENTS & PROSPECTS', 3, params.date.startDate.year + '-' + params.date.startDate.month + '-' + '1', params.date.endDate.year + '-' + params.date.endDate.month + '-' + '1', ''];
					promises.push(BHDataAdapterService.getTrendData(tp));
					promises.push(BHDataAdapterService.getCpCurrent(params));
					promises.push(BHDataAdapterService.getCpListCurrent(params));
					
					$q.all(promises).then(function(results)
					{
						TrendFactory._processTrendResult(results[0]);
						var data = {
			    				"recommended": results[0]["1"],
			    				"socialsentiment": results[0]["7"],
			    				"traditionalmedia": results[0]["3"],
			    				"likelihood": results[0]["4"],
			    				"socialshare": results[0]["8"],
			    				"mediashare": results[0]["6"],
							};
						var metric = ['recommended', 'socialsentiment', 'traditionalmedia', 'likelihood', 'socialshare', 'mediashare'];
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
	    					if (typeof results[1][m] != 'undefined') {
	    						if (linedelete) {
	    							chartdata[m] = results[1][m];
	    						}
	    					}
	    				});
	    				
						$scope.lineData = linedata;
						$scope.chartData = chartdata;
						$scope.listData = results[2];
						
						if ((Object.keys($scope.listData).length + Object.keys($scope.chartData).length + Object.keys($scope.lineData).length) == 0)
						{
							AlertService.setAlert(ViewConstants.noData, "info");
						}
						
					}, function(failure)
					{
						WL.Logger.error(failure);
						AlertService.setAlert(failure, "danger");
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