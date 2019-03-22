define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	app.controller('DashboardController', function($scope, $rootScope, $state, $loading, GlobalizationService, MessageFactory, DashboardFactory, BroadcastConstants, DataUtility) {
		_.str = underscore_str;

		$rootScope.showExport = false;
        var localDate = DataUtility.getSelectedDate();
        var displayDate;
        if (localDate != null) {
        	displayDate = moment(localDate.endDate.year.toString() + (localDate.endDate.month).toString(), "YYYYMM");
        } else {
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
		
		$scope.onClickDetails = function(url){
            $state.go(url.state, url.params);
        };
		
        function load(countryObject, dateObject) {
            $scope.alert = null;
        	if ( !(countryObject) || !(countryObject.country)){
                $scope.alert = MessageFactory.getMessage("country");
			} else if ( !(dateObject) || !(dateObject.endDate.year) || !(dateObject.endDate.month)) {
				$scope.alert = MessageFactory.getMessage("date");
			}

        	$loading.start('loading');

            DashboardFactory.getData((countryObject)?countryObject.country:null, (dateObject)?dateObject:null).then(
            	function(data) {
	                if ( _.isEmpty(data) || data[0].length === 0){
	                    $scope.alert = MessageFactory.getMessage("no-data");
	                    $scope.data = [];
	                    setConfig();
	                }else{
	                    $scope.data = _.chain(data)
			                        .groupBy(function (element, index) { 
			                        	return Math.floor(index / 2);   //broke down in chunks of two
			                         })
			                        .toArray()							//Added this to convert the returned object to an array.
			                        .value();
	                    setConfig();
	                }
	                $loading.finish('loading');
	            }, 
	            function(error){
	            	$loading.finish('loading');
	                $scope.alert = MessageFactory.getMessage(error, "danger");
	            }
	        );
            
        };

        function setConfig(){
        	$scope.alertDetails = null;
            $scope.borderLeft = null;
            $scope.borderLine = null;
            if(!_.isEmpty($scope.data)){
            	$scope.config = {
            		click: function (event, d, options) {
            			$scope.donutDetailsShow = true;

            			$scope.alertDetails = null;
            			$scope.barChart = d.data.chart.series.length > 0;
            			$scope.detailsValue = options.id !== "donut_3";

            			$scope.borderLeft = options.id == "donut_0" || options.id == "donut_2";
            			$scope.borderLine = options.id == "donut_0"?"donut-details-line-top-left":options.id == "donut_1"?"donut-details-line-top-right":options.id == "donut_2"?"donut-details-line-bottom-left":"donut-details-line-bottom-right";
                    
            			$scope.url = (d && d.data) ? d.data.urlState : {state: "landing.dashboard", params: {}};
            			$scope.details = (d && d.data) ? d.data.details : [];
            			$scope.chartTitle = (d && d.data) ? d.data.chartTitle : "";
            			$scope.chart = (d && d.data) ? d.data.chart : {};
            			$scope.table = (d && d.data) ? d.data.table : {};
           				$scope.chartConfig = {showPercent: true, standardDeviation:true};
            			if ( !($scope.barChart) && $scope.details.length == 0){
            				$scope.alertDetails = MessageFactory.getMessage("no-data");
            			}
           				if (!$scope.$$phase) $scope.$apply();
           			}
            	};
            } else {
            	 $scope.config = {};
            }
        }
        
        load(DataUtility.getCountry(),DataUtility.getSelectedDate());
        
        $scope.$on(BroadcastConstants.CountryChange, function(event, country){
        	load(country, DataUtility.getSelectedDate());
        });
        
        $scope.$on(BroadcastConstants.DateChange, function(event, date){
        	load(DataUtility.getCountry(), date);
        });
    });
});