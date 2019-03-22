define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	app.controller('BaseController', function($scope, MessageFactory){
        _.str = underscore_str;
        var _this = this;
        $scope.chartConfig = {
            margin: '0.1 0.04 0.25 0.12',
            vAxisMaxTicks: 10,
            showPercent: true,
            standardDeviation: true
        };

        $scope.tableMargin = "0.1 0.1 0.1 0.1";

        this.findIndex = function (arr, func) {
            var index = 1000;
            _.each(arr, function (v, i, l) {
                if (func.call(null, v)) {
                    index = i;
                }
            });
            return index;
        };

        this.sortFunc = function (order, chart) {
            if (chart == null || !_.isObject(chart)) return;
            chart.order = order;
            chart.series = _.chain(chart.series)
                .sortBy(function (item) {
                    return (order) ? item.rankSortValue * (-1) : item.name.toLowerCase();
                })
                .sortBy(function (item) {
                    return (item.name == "IBM") ? 0 : 1;
                })//make IBM first element
                .value();

            _.chain($scope.data).flatten(true)
                .without(chart)
                .filter(function (v) {
                    return v.sort;
                })
                .each(function (v, k, l) {
                    l[k].order = false;
                    l[k].series = _.chain(v.series)
                        .sortBy(function (item) {
                            return _this.findIndex(chart.series, function (v) {
                                return item.name == v.name;
                            })
                        })
                        .sortBy(function (item) {
                            return (item.name == "IBM") ? 0 : 1;
                        })//make IBM first element
                        .value()
                })
        };

        this.checkCountry = function(countryObject){
            if ( !(countryObject) || !(countryObject.country)){
                $scope.alert = MessageFactory.getMessage("country");
                return false;
            }

            return true;
        }

        this.checkDate = function(DateObject){
            if ( !(DateObject) || !(DateObject.endDate.year) || !(DateObject.endDate.month)){
                $scope.alert = MessageFactory.getMessage("date");
                return false;
            }
            return true;
        }
        
        this.processResult = function (data) {
            if ( _.isEmpty(data)){
                $scope.alert = MessageFactory.getMessage("no-data");
                $scope.data = [];
            }else {
                $scope.data = _.chain(data)
                    .each((function (v,k,l){
                        if (v.chartType === "bar" || v.chartType === "split"){
                            l[k].sort = this.sortFunc;
                            l[k].order = false;
                        }
                    }).bind(this))
                    .groupBy(function (element, index) {
                        return Math.floor(index / (typeof element.column !== 'undefined' && element.column == 4 ? 2 : 3));
                    })//broke down in chunks of 3
                    .toArray()//Added this to convert the returned object to an array.
                    .value();
                
                this.sortFunc(true, _.chain($scope.data).flatten(true).find(function(v){
                    return v.sort != null;
                }).value());
            }
        };

		this.processResultWithTrend = function(data) {
            return _.chain(data)
                .each((function (v,k,l){
                    if (v.chartType === "bar" || v.chartType === "split"){
                        l[k].sort = this.sortFunc;
                        l[k].order = false;
                    }
                }).bind(this))
                .value();
        }
	});
});