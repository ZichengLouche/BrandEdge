define(['BrandEdge/app'], function(app) 
{
	app.controller('EmployeeController', function($scope, $rootScope, $loading, MessageFactory, EmployeeFactory, BroadcastConstants, DataUtility) {

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
		
		function load(countryObject, dateObject) {
            $scope.alert = null;
            if ( !(countryObject) || !(countryObject.country)){
                $scope.alert = MessageFactory.getMessage("country");
            } else if ( !(dateObject) || !(dateObject.endDate.year) || !(dateObject.endDate.month)) {
            	$scope.alert = MessageFactory.getMessage("date");
            }
//            Grey out Employee Information
//            $loading.start('loading');
            
//            EmployeeFactory.getData((countryObject)?countryObject.country:null, (dateObject)?dateObject:null).then(function(data) {
            $scope.donut = EmployeeFactory.getData((countryObject)?countryObject.country:null, (dateObject)?dateObject:null);
//                $scope.donut = data;
//                $loading.finish('loading');
//            }, function(error){
//            	$loading.finish('loading');
//                $scope.alert = MessageFactory.getMessage(error, "danger");
//            });

        };
        
        load(DataUtility.getCountry(), DataUtility.getSelectedDate());
        
        $scope.$on(BroadcastConstants.CountryChange, function(event, country){
        	load(country, DataUtility.getSelectedDate());
        });
        
        $scope.$on(BroadcastConstants.DateChange, function(event, date){
        	load(DataUtility.getCountry(), date);
        });
		
	});
});