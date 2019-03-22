define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('DeveloperFactory', function($q, BHDataAdapterService, DonutFactory, CommonUtilityFactory){
		_.str = underscore_str;

        var utils = CommonUtilityFactory;

        var createItem = function (text, color, rating) {
            return {
            	label: text,
            	color: color,
            	rating: rating,
            	center: DonutFactory.getCenter(),
            	segments: DonutFactory.getSegments()
            };
        };
        
        var defaultData = [];
        defaultData.push(createItem("Developers", "color", "value"));

        return {

            getData: function(country, date) {

                if (country&&date) {
                    return $q.all([
                        BHDataAdapterService.getDeveloperDashboard(country, date),
                        BHDataAdapterService.getDeveloperDashboardChartData(country, date)
                    ]).then(function (data) {

                        var chartData = _.chain(data[1])
                            .map(function (v, k) {
                                return {
                                    column: _.str.clean(v["COLUMN"]),
                                    company: _.str.clean(v["COMPANY"]),
                                    measure: _.str.clean(v["MEASURE"]),
                                    code: _.str.clean(v["METRIC_CODE"]),
                                    ranking: _.str.clean(v["RANKING"]),
                                    sequence: _.str.clean(v["SEQUENCE"]),
                                    value: _.str.clean(v["VALUE"]),
                                    
                                    cognitiveRating: _.str.clean(v["COGNITIVE"]),
                                    analyticsRating: _.str.clean(v["ANALYTICS"]),
                                    cloudRating: _.str.clean(v["CLOUD"]),
                                    mobileRating: _.str.clean(v["MOBILE"]),
                                    socialRating: _.str.clean(v["SOCIAL"]),
                                    securityRating: _.str.clean(v["SECURITY"]),

                                    format: _.str.clean(v["NUMERIC_FORMAT"])
                                }
                            })//transform data to proper json
                            .value();

                        var data = _.chain(data[0])
                            .map(function (v, k) {
                                return {
                                    color: _.str.clean(v["COLOR_CODE"]),
                                    column: _.str.clean(v["COLUMN"]),
                                    company: _.str.clean(v["COMPANY"]),
                                    name: _.str.clean(v["DISPLAY_NAME"]),
                                    value: _.str.clean(v["DISPLAY_VALUE"]),
                                    icon: _.str.clean(v["ICON_TEXT"]),
                                    code: _.str.clean(v["METRIC_CODE"]),
                                    sequence: _.str.clean(v["SEQUENCE"])
                                }
                            })//transform data to proper json                            
                            .value();
                        
                        var first = _.chain(data).filter(function (v) {
                            return v.sequence == 1;
                        }).value();
                        
                        var donuts = _.chain(defaultData)
                        .map(function (v, k) {
                        	var outerColor = v.color;
                        	var rating = v.rating;
                            var center = DonutFactory.getCenterValueAndColor(first);

                        	return {
                        		label: v.label,
                                center: {
                                    textColor: DonutFactory.getColor("W"),
                                    color: center.color,
                                    value: center.value
                                },
                                segments: _.chain(v.segments)
			                                .map(function (v, k) {
			                                	var o = _.chain(first).find(function (item) {
	                                                return v.column === item.column
	                                            }).value();

                                                var chart = _.chain(chartData)
                                                .filter(function (item) {
                                                    return item.column === v.column;
                                                });

                                                var format = (chart.first().value())?chart.first().value().format:"%";

			                                	var series = chart
	                                            .map(function (v, k) {
	                                                return { name: v.company, value: utils.parseFloat(v[rating], null), rank: utils.parseFloat(v['ranking'], null) };
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

                                                var details =  _.chain(data).filter(function (item) {
                                                    return item.column === v.column;
                                                }).value();

                                                var chartTitle =  _.chain(details).find(function (item) {
                                                    return item.sequence == 1;
                                                }).value() || {};

	                                            return {
	                                                column: v.column,
	                                                outerColor: (o) ? DonutFactory.getColor(o[outerColor]) : v.outerColor,
	                                                value: 30,
	                                                name: v.name,
	                                                color: v.color,
                                                    chartTitle: chartTitle,
	                                                details: _.chain(details).filter(function (item) {
	                                                    return item.sequence != 1;
	                                                })
	                                                .map(function (v, k) {
	                                                	return {
	                                                		name: v.name,
	                                                		value: v[rating],
	                                                		color: v[outerColor],
	                                                		icon: v.icon
	                                                	};
	                                                })
	                                                .value(),
	                                                chart: {
	                                                	margin: "",
	                                                    series: series,
	                                                    //values: _.pluck(series, "value")
                                                        rating: chartTitle.color == "Grey"?"0":"1"
	                                                }
	                                            };
			                                })
			                                .value()
                        	};
                        	
                            	
                        })
                        .value();
                        return donuts;

                    }, function (error) {
                        throw error;
                    });
                } else {
                    return $q(function(resolve, reject) {
                        setTimeout(function() {
                            return resolve(defaultData);
                        }, 1000);
                    });
                }
            }
        };
	});
});