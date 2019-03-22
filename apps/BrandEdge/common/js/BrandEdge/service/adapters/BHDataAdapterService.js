define(['BrandEdge/app'], function(app) {
	app.service('BHDataAdapterService', function($q, WLAdapterFactory) {
		var svc = this;
		var profile = localStorage.getItem('userProfile');
		
		// xmt 2015.5.19 10:02
		svc.setProfile = function(userProfile) {
			profile = userProfile;
		}
		
		// xmt 2015.7.21 12:15
		svc.getWWIotDashboardListsReport = function(permissions, date) {
			return date.current?svc._invokeAdapterService("getWWIotDashboardListsReport", [], null, true):svc._invokeAdapterService("getWWIotDashboardListsReportByMonth", [[date.endDate.year, date.endDate.month]], null, true);
		}	
		
		svc.getDashboardListsReport = function(country, date) {
			return date.current?svc._invokeAdapterService("getDashboardListsReport", [[country, profile]], null, true):svc._invokeAdapterService("getDashboardListsReportByMonth", [country, date.endDate.year, date.endDate.month, profile], null, true);
		}			
		
		svc.getDashboardBarChartData = function(country, date) {
			return date.current?svc._invokeAdapterService("getDashboardBarChartData", [[country, profile]], null, true):svc._invokeAdapterService("getDashboardBarChartDataByMonth", [country, date.endDate.year, date.endDate.month, profile], null, true);
		}
		
		svc.getCpCurrent = function(parms) {
			return parms.date.current ? svc._invokeAdapterService('getCpCurrent',[parms.country.country, parms.column, profile],"chartValues", 0) : svc._invokeAdapterService('getCpByMonth',[parms.country.country, parms.column, parms.date.endDate.year, parms.date.endDate.month, profile],"chartValues", 0);
		};
		
		svc.getCpListCurrent = function(parms) {
			return parms.date.current ? svc._invokeAdapterService('getCpListCurrent',[parms.country.country, parms.columnForList, profile],"listValues", true) : svc._invokeAdapterService('getCpListByMonth',[parms.country.country, parms.columnForList, parms.date.endDate.year, parms.date.endDate.month, profile],"listValues", true);
		};
		
		// no invoking
		svc.getCpActionCurrent = function(parms)
		{
			return svc._invokeAdapterService('getCpActionCurrent',parms,"chartValues", true);
		};
		
		// no invoking
		svc.getCpActionListCurrent = function(parms)
		{
			return svc._invokeAdapterService('getCpActionListCurrent',parms,"listValues", true);
		};
		
		// deprecate
		svc.getCpAdvocacyCurrent = function(parms)
		{
			return svc._invokeAdapterService('getCpAdvocacyCurrent',parms,"chartValues", true);
		};
		
		svc.getCPDashboard = function(params)
		{			
			return params.date.current ? svc._invokeAdapterService('getCPDashboardCurrent',[params.country.country, profile],"pieValues", true) : svc._invokeAdapterService('getCPDashboardByMonth',[params.country.country, params.date.endDate.year, params.date.endDate.month, profile],"pieValues", true);
		};
		
		svc.getCPDashboardCharts = function(params)
		{
			return params.date.current ? svc._invokeAdapterService('getCPDashboardChartsCurrent',[params.country.country, profile],"chartValues", true) : svc._invokeAdapterService('getCPDashboardChartsByMonth',[params.country.country, params.date.endDate.year, params.date.endDate.month, profile],"chartValues", true);
		};
		
		svc.getCPDashboardTable = function(country, date)
		{
			return date.current ? svc._invokeAdapterService('getCPDashboardTableCurrent',[country, profile],"listValues", true) : svc._invokeAdapterService('getCPDashboardTableByMonth',[country, date.endDate.year, date.endDate.month, profile],"listValues", true);
		};

        svc.getDeveloperDashboard = function(country, date)
        {
        	return date.current?svc._invokeAdapterService('getDeveloperDashboardListsReport', [[country, profile]], null, true):svc._invokeAdapterService('getDeveloperDashboardListsReportByMonth', [country, date.endDate.year, date.endDate.month, profile], null, true);
        };

        svc.getDeveloperDashboardChartData = function(country, date)
        {            
        	return date.current?svc._invokeAdapterService('getDeveloperDashboardBarChartData', [[country, profile]], null, true):svc._invokeAdapterService('getDeveloperDashboardBarChartDataByMonth', [country, date.endDate.year, date.endDate.month, profile], null, true);
        };

		svc.getDeveloperCurrent = function(country, date, column) {
			return date.current?svc._invokeAdapterService('getDeveloperCurrent', [country, column, profile], null, true):svc._invokeAdapterService('getDeveloperByMonth', [country, column, date.endDate.year, date.endDate.month, profile], null, true);
		};

        svc.getDeveloperTableChart = function(country, date, column)
        {
        	return date.current?svc._invokeAdapterService('getDeveloperTableChart', [country, column, profile], null, true):svc._invokeAdapterService('getDeveloperTableChartByMonth', [country, column, date.endDate.year, date.endDate.month, profile], null, true);
        };

		svc.getInfluencerDashboard = function(country, date)
		{			
			return date.current?svc._invokeAdapterService('getInfluencerDashboard', [[country, profile]], null, true):svc._invokeAdapterService('getInfluencerDashboardByMonth', [country, date.endDate.year, date.endDate.month, profile], null, true);
		};
		
		svc.getInfluencerBarChartData = function(country, date)
		{			
			return date.current?svc._invokeAdapterService('getInfluencerBarChartData', [[country, profile]], null, true):svc._invokeAdapterService('getInfluencerBarChartDataByMonth', [country, date.endDate.year, date.endDate.month, profile], null, true);
		};
		
		svc.getInfluencerChartData = function(country, date, column)
		{   
			return date.current?svc._invokeAdapterService('getInfluencerChartData', [country, column, profile], null, true):svc._invokeAdapterService('getInfluencerChartDataByMonth', [country, column, date.endDate.year, date.endDate.month, profile], null, true);
		};
		
		svc.getInfluencerTableChartData = function(country, date, column)
		{
			return date.current?svc._invokeAdapterService('getInfluencerTableChartData', [country, column, profile], null, true):svc._invokeAdapterService('getInfluencerTableChartDataByMonth', [country, column, date.endDate.year, date.endDate.month, profile], null, true);
		};
		
		svc.getInfluencerChartClassData = function(country, date, column, ibmer)
		{
			return date.current?svc._invokeAdapterService('getInfluencerChartClassData', [country, column, ibmer, profile], null, true):svc._invokeAdapterService('getInfluencerChartClassDataByMonth', [country, column, ibmer, date.endDate.year, date.endDate.month, profile], null, true);
		};
		
		svc.getEmployee = function(country, date)
		{
			return date.current ? svc._invokeAdapterService('getEmployeeCurrent', [[country, profile]], null, true):svc._invokeAdapterService('getEmployeeByYear', [country, date.endDate.year, profile], null, true);
		};
		
		svc.getStrategicCharacteristicsCurrent = function(country, date, filter)
		{
			if(filter == 4){
				return date.current ? svc._invokeAdapterService('getCPStrategicCharacteristicsCurrent', [country, profile], null, true):svc._invokeAdapterService('getCPStrategicCharacteristicsByMonth', [date.endDate.year, date.endDate.month, country, profile], null, true);
			}else{
				return date.current ? svc._invokeAdapterService('getDevelopersStrategicCharacteristicsCurrent', [country, profile], null, true):svc._invokeAdapterService('getDevelopersStrategicCharacteristicsByMonth', [date.endDate.year, date.endDate.month, country, profile], null, true);
			}
		};
		
		svc.getSCChartDate = function(country, date, column){
			return date.current?svc._invokeAdapterService('getSCChartDate', [country, column, profile], null, true): svc._invokeAdapterService('SCChartDateByMonthStatement', [country, column, date.endDate.year, date.endDate.month, profile], null, true);
		};

		svc.getTrendData = function(parms) {
			parms.push(profile);
			return svc._invokeAdapterService('getTrendData',parms,"chartValues", 0);
		};
		
		svc.getCountries = function(parameters) {
			return svc._invokeAdapterService("getCountryList", parameters);
		},
		
		svc.getViewableCountries = function() {
			return svc._invokeAdapterService('getViewableCountries',null,"countries");
		};
		
		// xmt 2014.7.9 10:43
		svc.getWWIOTList = function() {
			return svc._invokeAdapterService('getWWIOTList', [], null, true);
		};
		
		// xmt 2015.8.20 16:56
		svc.getSecurityProfile = function() {
			return svc._invokeAdapterService('getSecurityProfile', [profile], null, true);
		};
		
		svc.getMetricModel = function() {
			return svc._invokeAdapterService('getMetricModel', [], null, true);
		};
		
		svc.setBannerContent = function(content, country, bluePage) {
			return svc._invokeAdapterService('setBannerContent', ['US', content, 'IBM.Brand.Health.Admin'], null, true);
		}
		
		svc.getBannerContent = function(country, bluePage) {
			return svc._invokeAdapterService('getBannerContent', ['US', 'IBM.Brand.Health.Admin'], null, null);
		}
		
		svc._invokeAdapterService = function(procedure, parameters, returnKey, cacheFlag) {
			if (returnKey == null) returnKey = "resultSet";
			
			var deferred = $q.defer();
			
			WLAdapterFactory.invokeAdapter("BHDSqlAdapter", procedure, parameters, returnKey, cacheFlag).then(
				function(success) {
					deferred.resolve(success);
				},
				function(failure) {
					deferred.reject(failure);
				}
			);
			
			return deferred.promise;
		}
	});
});