define(['BrandEdge/app'], function(app) 
{
	app.controller('CPDashboardController', function($scope, $rootScope, $state, $loading, $q, BroadcastConstants, ViewConstants, ChartService, AlertService, BHDataAdapterService, DataUtility, DonutFactory, Utility) 
	{
		$rootScope.showExport = false;
        var localDate = DataUtility.getSelectedDate();
        var displayDate;
        if (localDate != null) {
        	displayDate = moment(localDate.endDate.year.toString() + (localDate.endDate.month).toString(), "YYYYMM");
        }
        else {
        	displayDate = moment();
        }
		$rootScope.opt = {
                format: 'YYYY-MM',
                startDate: displayDate,
                endDate: displayDate,
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
		
		var _params = {
				'country' : DataUtility.getCountry(),
				'date' : DataUtility.getSelectedDate()
				};
		
		var _pageInit = false;
		
		var rawData = [];
		
		$scope.donuts = null;
		$scope.donutTextArray = {};
		$scope.graphHeadings = {};
		$scope.stage = {};
		
		var states = {
				"Belief": "landing.clientProspect.belief",
				"Action": "landing.clientProspect.action",
				"Advocacy": "landing.clientProspect.advocacy"
		};
	
		$scope.margin = '0.1 0.1 0.25 0.2';
		
		$scope.chartData = [];
	
		function _buildChartData(area, key, data)
		{
			var myData = [];
			var myValues = [];
			var myRank = [];
			if (data[area])
			{
				for (var x in data[area].data)
				{	
					var tmp = data[area].data[x]
					myData.push({"name": tmp.Company, "value": tmp[(key=="all"?"Value":key)], "rank": tmp[(key=="all"?"Rank":"Rank" + key)]});
					myValues.push(tmp[(key=="all"?"Value":key)]);
				}
				var sum = myValues.reduce(function(pv, cv) { return pv + cv; }, 0);
				
				// xmt 2015.9.18 18:23
//				if (sum == 0)
//				{
//					myData = null;
//					myValues = null;
//				}
			}
			else
			{
				myData = null;
				myRank = null;
				myValues = null;
			}
			
			return { 
					"data": {"series": myData, "margin": $scope.margin },
					"values": myValues,
					"title": (data[area])?data[area].DisplayName:"",
					"icon": (data[area])?data[area].Icon:"",
					"rating": (data[area])?data[area]['displayRating' + (key=="all"?"":key)]:null,
					"state": area
				};
		}

		function _buildDonutData(key, index, data)
		{
			return {"key": key, "data": DonutFactory.getDonutRep(data["Belief_" + index]?data["Belief_" + index][(key == "all")?"Color":key]:null,data["Action_" + index]?data["Action_" + index][(key == "all")?"Color":key]:null,data["Advocacy_" + index]?data["Advocacy_" + index][(key == "all")?"Color":key]:null)};
		}

		$scope.navNext = function(state,slice) {
//			console.log("Slice",slice);
			$scope.$emit("CPFilterMenu", slice);
			$scope.$emit("BAAMenu", state);
			
			$state.go(states[state]);
		};
		
		$scope.config = {
				click: function(event, d, j)
				{	
					var tmpArray = [];
					for (var x in rawData.nuts)
					{
						if ((x.indexOf(d.data.name) > -1))
						{
							if (x != (d.data.name + "_1"))
							{
								var tmpVal = ((j.id == 'all')?rawData.nuts[x].Color:rawData.nuts[x][j.id]);
								var tmpRnk = ((j.id == 'all')?rawData.nuts[x].DisplayValue:rawData.nuts[x][('rank' + j.id)]);
								if (
										//(tmpVal != 'Grey') && 
										//(tmpVal != 'Gray') && 
										//(tmpVal != 'grey') && 
										//(tmpVal != 'gray') &&
										tmpVal != null
//										&& (tmpRnk != null)
									)
								{
									
									tmpArray.push({ name: ((['Cognitive', 'Cloud','Analytics','Mobile','Social','Security'].indexOf(j.id)>-1) && (rawData.nuts[x].camssDisplay != null))?rawData.nuts[x].camssDisplay:rawData.nuts[x].DisplayName, color: ((j.id == 'all')?rawData.nuts[x].Color:rawData.nuts[x][j.id]), value: Utility.parensWrap(((j.id == 'all')?rawData.nuts[x].DisplayValue:Utility.getAbbrvOrdinal(rawData.nuts[x][('rank' + j.id)]))), icon: ((['Cognitive', 'Cloud','Analytics','Mobile','Social','Security'].indexOf(j.id)>-1) && (rawData.nuts[x].camssIcon != null))?rawData.nuts[x].camssIcon : rawData.nuts[x].Icon });
								}else if (tmpVal != null && tmpRnk != null){
									tmpArray.push({ name: ((['Cognitive', 'Cloud','Analytics','Mobile','Social','Security'].indexOf(j.id)>-1) && (rawData.nuts[x].camssDisplay != null))?rawData.nuts[x].camssDisplay:rawData.nuts[x].DisplayName, color: ((j.id == 'all')?rawData.nuts[x].Color:rawData.nuts[x][j.id]), value: Utility.parensWrap(((j.id == 'all')?rawData.nuts[x].DisplayValue.trim():Utility.getAbbrvOrdinal(rawData.nuts[x][('rank' + j.id)]))), icon: ((['Cognitive','Cloud','Analytics','Mobile','Social','Security'].indexOf(j.id)>-1) && (rawData.nuts[x].camssIcon != null))?rawData.nuts[x].camssIcon : rawData.nuts[x].Icon });
								}
							}
							else
							{
//								console.log(j.id);
								$scope.graphHeadings[j.id] = { title: rawData.nuts[x].DisplayName, rank: Utility.parensWrap(((j.id == 'all')?(rawData.nuts[x].DisplayValue ? rawData.nuts[x].DisplayValue.trim():null):Utility.getAbbrvOrdinal(rawData.nuts[x][('rank' + j.id)]))), color: ((j.id == 'all')?rawData.nuts[x].Color:rawData.nuts[x][j.id]) };
							}
						}
					}
					$scope.donutTextArray[j.id] = tmpArray;
					$scope.stage[j.id] = d.data.name;
					
					$scope.chartData[j.id] = _buildChartData(d.data.name, j.id, rawData.charts);
//					$scope.$broadcast("ChartRefresh", "hola");
					if(!$scope.$$phase) $scope.$apply();
				}
		};
		
		$scope._pageInit = function()
		{	
			AlertService.reset();
			$scope.loadData(_params);
			//$scope.loadCharts(_params);
			
			$scope.$on(BroadcastConstants.CountryChange, function(event, data) 
			{
				//this prevents double firing of this $on function
				if (_pageInit)
				{
					_params.country = data;
					$scope.loadData(_params);
				}
			});
			
			$scope.$on(BroadcastConstants.DateChange, function(event, data)
			{
				//this prevents double firing of this $on function
				if (_pageInit)
				{
					_params.date = data;
					$scope.loadData(_params);
				}
	        });
		};
		
		$scope.loadData = function(params)
		{
			AlertService.reset();
			$loading.start('charts');
			if ((params == null) || (params.country == null)||(params.country.country == null))
			{
				AlertService.setAlert("Please select your country.", "warning", "cpDashboard");
				$loading.finish('charts');
			} else if ((params.date.endDate == null) || (params.date.endDate.year == null) || (params.date.endDate.month == null)) {
				AlertService.setAlert("Please select your date.", "warning", "cpDashboard");
				$loading.finish('charts');
			} else {
				var promises = [];
				
				promises.push(BHDataAdapterService.getCPDashboard(params));
				promises.push(BHDataAdapterService.getCPDashboardCharts(params));
				promises.push(BHDataAdapterService.getCPDashboardTable(params.country.country, params.date));
				
				$q.all(promises).then(function(result)
				{
					rawData = {"nuts": result[0], "charts": result[1], "table": result[2]};
					
					var keys = ["all", "Cognitive", "Cloud", "Analytics", "Mobile", "Social", "Security", "IT", "LOB", "Clients", "Prospects"];
					
					keys.map(function(current) {
						if(current=='all' && typeof rawData.table.growthGapToMarket !== 'undefined'){
							rawData.nuts.Action_1['Color'] = rawData.table.growthGapToMarket.ratingColor;
						}else{
							if(typeof rawData.nuts.Action_1 !== 'undefined'){
								rawData.nuts.Action_1[current] = 0;
							}else{
								rawData.nuts['Action_1'] = {};
								rawData.nuts.Action_1[current]=0;
							}
								
						}
//						  current=='all'?rawData.nuts.Action_1['Color']=:rawData.nuts.Action_1[current];
					});
					
					$scope.listData = rawData.table;
					
					$scope.donuts = keys.map(function(current) {
						  return _buildDonutData(current, 1, rawData.nuts);
						});
					
					$scope.chartData = keys.reduce(function(prev, current) {
						  prev[current] = _buildChartData("Belief", current, rawData.charts);
						  return prev;
						}, []);
					
					if(!$scope.$$phase) $scope.$apply();
					$loading.finish('charts');
				}, function(failure)
				{
					WL.Logger.error(failure);
					AlertService.setAlert(failure, "danger", "cpDashboard");
					$loading.finish('charts');
				})
				.finally(function(duh)
				{
					$loading.finish('charts');
					
				});
			}
			_pageInit = true;
		};
		
		$scope._pageInit();
	});
});