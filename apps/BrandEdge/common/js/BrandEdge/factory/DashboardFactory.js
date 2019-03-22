define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('DashboardFactory', function($q, BHDataAdapterService, DonutFactory, EmployeeFactory, CommonUtilityFactory){
		_.str = underscore_str;

        var utils = CommonUtilityFactory;

        return {
            getData: function(country, date) {

                if (country && date) {
                    return $q.all([
                        BHDataAdapterService.getDashboardListsReport(country, date),
                        BHDataAdapterService.getDashboardBarChartData(country, date),
                        EmployeeFactory.getData(country, date),
                        BHDataAdapterService.getCPDashboardTable(country,date)
//                        BHDataAdapterService.getEmployee(country, date)
                    ]).then(function (data) {

                        var chartData = _.chain(data[1])
                            .map(function (v, k) {
                                return {
                                    column: _.str.clean(v["COLUMN"]),
                                    company: _.str.clean(v["COMPANY"]),
                                    constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()),
                                    measure: _.str.clean(v["MEASURE"]),
                                    code: _.str.clean(v["METRIC_CODE"]),
                                    ranking: _.str.clean(v["RANKING"]),
                                    sequence: _.str.clean(v["SEQUENCE"]),
                                    value: _.str.clean(v["VALUE"]),
                                    format: _.str.clean(v["NUMERIC_FORMAT"])
                                }
                            })//transform data to proper json
                            .groupBy(function (e, i) {
                                return e.constituents
                            })//group by constituents
                            .value();
                    
                        var data = _.chain(data[0])
                            .map(function (v, k) {
                                return {
                                    color: _.str.clean(v["METRIC_CODE"]) == 'INT16' ? data[3].growthGapToMarket.ratingColor:_.str.clean(v["COLOR_CODE"]),
                                    column: _.str.clean(v["COLUMN"]),
                                    company: _.str.clean(v["COMPANY"]),
                                    constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()),
                                    name: _.str.clean(v["DISPLAY_NAME"]),
                                    value: _.str.clean(v["DISPLAY_VALUE"]),
                                    icon: _.str.clean(v["ICON_TEXT"]),
                                    code: _.str.clean(v["METRIC_CODE"]),
                                    sequence: _.str.clean(v["SEQUENCE"])
                                }
                            })//transform data to proper json
                            .reject(function (v) {
                                return v.constituents == "Employees";
//                            	  return null;
                            })
                            .groupBy(function (e, i) {
                                return e.constituents
                            })//group by constituents
                            .map(function (v, k) {
                                var first = _.chain(v).filter(function (v) {
                                    return v.sequence == 1;
                                });

                                var center = DonutFactory.getCenterValueAndColor(first.value());

                                var details = v;
                                var chart = chartData[k];
                                var constituent = k;
                                return {
                                    label: DonutFactory.getLabels(k).label,
                                    constituents: constituent,

                                    center: {
                                        textColor: DonutFactory.getColor("W"),
                                        color: center.color,
                                        value: center.value
                                    },
                                    segments: _.chain(DonutFactory.getSegments())
                                        .map(function (v, k) {
                                            var o = first.find(function (item) {
                                                return v.column === item.column
                                            }).value();

                                            var c = _.chain(chart)
                                            .filter(function (item) {
                                                return item.column === v.column;
                                            });

                                            var format = (c.first().value())?c.first().value().format:"%";

                                            var series = c.map(function (v, k) {
                                                return { name: v.company, value: utils.parseFloat(v.value, null), rank: utils.parseFloat(v.ranking, null)};
                                            })
                                            .sortBy(function (item) {
                                                return item.value*(-1);
                                            })
                                            .sortBy(function (item) {
                                                return (item.name == "IBM") ? 0 : 1;
                                            }).value();

                                            if(format == "#"){
                                                series = utils.convertUnitsToPercent( series );
                                            }

                                            var d = _.chain(details).filter(function (item) {
                                                return item.column === v.column;
                                            }).value();

                                            var chartTitle = _.chain(d).find(function (item) {
                                                return item.sequence == 1;
                                            }).value() || {};

                                            return {
                                                urlState: DonutFactory.getState(constituent, v.name),
                                                column: v.column,
                                                outerColor: (o) ? DonutFactory.getColor(o.color) : v.outerColor,
                                                value: 30,
                                                name: v.name,
                                                color: v.color,
                                                chartTitle: chartTitle,
                                                details: _.chain(d).filter(function (item) {
                                                    return item.sequence != 1;
                                                }).value(),
                                                chart: {
                                                	margin: "",
                                                    series: series,
                                                    //values: _.pluck(series, "value")
                                                    rating: chartTitle.color == "Grey"?"0":"1"
                                                },
                                                table: v.name == 'Action' && constituent == 'Clients & Prospects'?data[3]:null
                                            };
                                        })
                                        .value()
                                };
                            })//end of map
//                            Grey out Employee Information
//                            .union([data[2].details.length===0?[]:data[2]])
                            .union([data[1].length != 0 ? data[2] : []])
                            .sortBy(function (item) {
                                return DonutFactory.getLabels(item.constituents).sortOrder;
                            })//sort by custom order
                            .each(function (v, i) {
                                v.index = i;
                            })
                            .value();
                        return data;
                        
                    }, function (error) {
                        throw error;
                    });
                } else {
                    var data = [];
                    for (i = 0; i < 4; i++) {
                        data.push({
                        	label: _.chain(DonutFactory.getLabels()).find(function (item) {
                                return item.sortOrder === i;
                            }).value().label,
                            center: DonutFactory.getCenter(),
                            segments: DonutFactory.getSegments(),
                            index: i
                        });
                    }
                    return $q(function(resolve, reject) {
                        setTimeout(function() {
                            return resolve(data);
                        }, 1000);
                    });
                }
            }
        };
	});
});