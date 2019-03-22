define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) {
	app.controller('StrategicCharacteristicsChartDetailController', function($scope, $rootScope, $controller, $state, $stateParams, $loading, MessageFactory, StrategicCharacteristicsChartFactory, BroadcastConstants, DataUtility, filter, $q, BHDataAdapterService, TrendFactory){
		_.str = underscore_str;

		angular.extend(this, $controller('BaseController as base', {$scope: $scope, MessageFactory: MessageFactory}));

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
        
        this.load = function(countryObject, dateObject) {
            $scope.alert = null;
            if(!this.checkCountry(countryObject)) return;
            if(!this.checkDate(dateObject)) return;
            
            if (dateObject.current || (dateObject.startDate.year == dateObject.endDate.year && dateObject.startDate.month == dateObject.endDate.month)) {
            	$loading.start('loading');
            	StrategicCharacteristicsChartFactory.getData((countryObject)?countryObject.country:null, (dateObject)?dateObject:null, filter).then((function(data) {
                    this.processResult(data);
                    $loading.finish('loading');
                }).bind(this), (function(error){
                    $loading.finish('loading');
                    $scope.alert = MessageFactory.getMessage(error, "danger");
                }).bind(this));
            }
            else {
            	$loading.start('loading');
            	var promises = [];
		        var tp = [countryObject.country, filter.toUpperCase(), 4, dateObject.startDate.year + '-' + dateObject.startDate.month + '-' + '1', dateObject.endDate.year + '-' + dateObject.endDate.month + '-' + '1', ''];
		        promises.push(BHDataAdapterService.getTrendData(tp));
		        promises.push(StrategicCharacteristicsChartFactory.getData((countryObject)?countryObject.country:null, (dateObject)?dateObject:null, filter));
				$q.all(promises).then(
						(function(result)
						{
							$scope.data = [];
							var data = [];
							if(_.isEmpty(result)){
								data = [];
							}else{
								var res = [];
								if (!_.isEmpty(result[1])){
									data = this.processResultWithTrend(result[1]);
								}
								if(!_.isEmpty(result[0])){
									TrendFactory._processTrendResult(result[0]);
									var lineData = TrendFactory._refactorData(result[0], filter.toUpperCase(), 'strategy');
									_.each(lineData, function(d){
										if (typeof d.value.periodPoints != 'undefined' && d.value.periodPoints.length > 1) {
											res.push(d);
										}
									});
								}
								_.each(data, function(d){
									var ld = _.find(res, function(l){
										return l.code == d.code;
									});
									if (typeof ld == 'undefined') {
										res.push(d);
									}
								});
							
								if (res.length == 0) {
									$scope.alert = MessageFactory.getMessage("no-data");
								}
								else {
									res = _.chain(res)
									.groupBy(function (element, index) {
										return Math.floor(index / (element.column&&element.column == 4?2:3));
									})
									.toArray()
									.value();
								}
								$scope.data = res;
								this.sortFunc(true, _.chain($scope.data).flatten(true).find(function(v){
									return v.sort != null;
								}).value());
							
								$loading.finish('loading');
							}
						}).bind(this),
						function(error)
						{
	                		$loading.finish('loading');
	                		$scope.alert = MessageFactory.getMessage(error, "danger");
						});
            }
        };

        $scope.$on(BroadcastConstants.CountryChange, (function(event, country){
            this.load(country, DataUtility.getSelectedDate());
        }).bind(this));
        
        $scope.$on(BroadcastConstants.DateChange, (function(event, date){
        	this.load(DataUtility.getCountry(), date);
        }).bind(this));


        this.load(DataUtility.getCountry(), DataUtility.getSelectedDate());
	});
});