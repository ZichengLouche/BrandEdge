define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) 
{
	app.controller('InfluencersDashboardDetailsController', function($scope, $rootScope, $state, $stateParams, $loading, MessageFactory, InfluencersFactory, BroadcastConstants, DataUtility, filter){
		_.str = underscore_str;
						
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
		
		var donutDetailsTemplate = {
    			data: [],
    			chart: 	{},
    			chartConfig: {}
    	};
		
		var donutDetails = {};

        $scope.$emit('influencer-tab', $stateParams);

		$scope.show = function(key){
			return donutDetails[key] || false;
		};
		
		$scope.details = function(key){
			return donutDetails[key] || donutDetailsTemplate;
		};
		
		$scope.click = function(index, donut, data){
			data = data || {};
			data.name = data.name || "belief";
				
			var filter =  _.str.clean(donut.label).toLowerCase();			
			
			$state.go("landing.influencers.chart.details", angular.extend({}, {
				id: data.name.toLowerCase(), 
				filter: (filter === "influencer")?"market-view":filter
			}));
		};
		
		function load(countryObject, dateObject) {
            $scope.alert = null;
            if ( !(countryObject) || !(countryObject.country)){
                $scope.alert = MessageFactory.getMessage("country");
            }
            
            if ( !(dateObject) || !(dateObject.endDate.year) || !(dateObject.endDate.month)){
                $scope.alert = MessageFactory.getMessage("date");
            }

            $scope.config = {
                click: function (event, d, options) {
//                    console.log("d.data.chartTitle", d.data.chartTitle);
                	if(options.pop){
                		donutDetails[options.id] = {
                			name: (d && d.data) ? d.data.name : null,
                			data: (d && d.data) ? d.data.details : [],
                			chart: 	(d && d.data) ? d.data.chart : {},
                            alert: 	(d && d.data && !_.isEmpty(d.data.chart.series))?false:MessageFactory.getMessage("no-data"),
                            chartTitle: 	(d && d.data) ? d.data.chartTitle : {},
                			chartConfig: {
                                            showPercent: true,
                                            standardDeviation:true
                                         }
                		}
                	}else{
                		delete donutDetails[options.id];
                	}
                    if (!$scope.$$phase) $scope.$apply();
                }
            };

//            if(filter == "ibmer-external"){
//                $scope.alert = MessageFactory.getMessage("no-data");
//                $scope.data = [];
//            }else{
                $loading.start('loading');
                InfluencersFactory.getData((countryObject)?countryObject.country:null, (dateObject)?dateObject:null, filter).then(function(data) {
                    if ( _.isEmpty(data) ){
                        $scope.alert = MessageFactory.getMessage("no-data");
                        $scope.data = [];
                    }else{
                        if(filter === "ccamss"){
                            $scope.data = data.slice(0, 7);
                        }else if(filter === "ibmer-external"){
                        	$scope.data = data.slice(0, 1).concat(data.slice(7, 9));
                        }else{
                            $scope.data = data.slice(0, 1);
                        }
                    }
                    $loading.finish('loading');
                }, function(error){
                    $loading.finish('loading');
                    $scope.alert = MessageFactory.getMessage(error, "danger");
                });
//            }


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