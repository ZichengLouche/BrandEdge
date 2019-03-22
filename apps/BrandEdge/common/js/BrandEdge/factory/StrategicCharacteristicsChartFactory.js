define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('StrategicCharacteristicsChartFactory', function($q, BHDataAdapterService, CustomMath, CommonUtilityFactory){
		_.str = underscore_str;
        var utils = CommonUtilityFactory;

		var sortSequence = {
				"1": "1",
                "2": "2",
				"3": "3",
				"4": "4"
		};

        var filters = {
        		"Clients & Prospects": 4,
				"Developers": 5
        };

        return {
			getData: function(country,date,filter) {
				filter = filter || "Clients & Prospects";
				filter = _.str.clean(filter);
				filter = filters[filter] || filters["Clients & Prospects"];

                return $q.all([
                    BHDataAdapterService.getStrategicCharacteristicsCurrent(country, date, filter)
                ]).then((function (data) {
                    var charts = this._processChartData(data[0], filter);
                    return _.chain(charts)
                            .sortBy(function (e, i) {
                                return e.sortSequence;
                            })
                            .each(function(el, i, l){
                                l[i].index = i;
                            })
                            .value();
                }).bind(this), function (error) {
                    throw error;
                });
            },

            _processChartData: function(data, filter){

                return _.chain(data).map(function (v, k) {
                    return {
                        company: _.str.clean(v["COMPANY"]),
                        title: _.str.clean(v["DISPLAY_NAME"]),
                        icon: _.str.clean(v["ICON_TEXT"]),
                        dataPeriodType: _.str.titleize(_.str.clean(v["DATA_PERIOD_TYPE"]).toLowerCase()),
                        code: _.str.clean(v["METRIC_CODE"]),
                        overallSum: _.str.clean(v["OVERALL_SUM"]),
                        rating: _.str.clean(v["RATING"]),
                        ranking: _.str.clean(v["RANKING"]),
                        rankingDisplay: _.str.clean(v["RANKING_DISPLAY"]),
                        sortSequence: sortSequence[_.str.clean(v["SEQUENCE"])],
                        sequence: _.str.clean(v["SEQUENCE"]),
                        type: _.str.clean(v["TYPE"]) || "",
                        year: _.str.clean(v["YEAR"]),
                        month: _.str.clean(v["MONTH"]),
                        quarter: _.str.clean(v["QUARTER"]),
                        chartType: _.str.clean(v["PAGE_CHART_TYPE"]),
                        sampleSizeMessage: _.str.clean(v["SAMPLE_SIZE_MESSAGE"]),
                        format: _.str.clean(v["NUMERIC_FORMAT"]),

                        detailurl : _.str.clean(v["URL"]),
                        user_name : _.str.clean(v["USER"]),
                        password : _.str.clean(v["PW"]),
                        urlType : _.str.clean(v["URL_TYPE"]),
                        
                        pRating : _.str.clean(v["P_RATING"]),
                        pRanking : _.str.clean(v["P_RANKING"]),
                        pShow : v["P_RATING"] != null || v["P_RANKING"] != null,
                    };
                })//transform data to proper json
                .groupBy(function (e, i) {
                    return e.sortSequence;
                })//group by sortSequence
                .map(function (v, k) {
                        var o = _.first(v) || {};
                        var ibm = _.chain(v).find(function (item) {
                            return item.company == "IBM";
                        }).value() || {};

                        var sampleSizeMessage =  (_.chain(v).find(function (item) {
                            return (item.sampleSizeMessage != null && item.sampleSizeMessage.length > 0);
                        }).value() || { /*sampleSizeMessage: "dummy sample size message"*/ }).sampleSizeMessage;

                        var el = { margin: "" };
                        el.title = o.title + " " + utils.getDisplayRating(ibm.rankingDisplay);
                        el.icon = o.icon;
                        el.type = o.dataPeriodType;
                        el.chartType = o.chartType;
                        el.format = o.format || "%";
                        el.year = o.year;
                        el.month = o.month;
                        el.quarter = o.quarter;
                        el.code = o.code;
                        
                        el.bshow = false;
                        
                        el.filter = o.filter;
                        el.sampleSizeMessage = sampleSizeMessage;
                        el.column = 4;
                        el.sequence = o.sequence;
                        el.sortSequence = o.sortSequence;
                        
                        el.detailurl = ibm.detailurl;
                        el.user_name = ibm.user_name;
                        el.password = ibm.password;
                        el.urlType = ibm.urlType;
                        
                        el.pRating = ibm.pRating;
                        el.pRanking = ibm.pRanking;
                        el.pShow = ibm.pShow;

                        el.rating = ibm.rating;
                            el.series = [];
                            _.chain(v)
                            .sortBy(function (item) {
                                return (item.company == "IBM") ? 0 : 1;
                            })//make IBM first element
                            .map(function (v, k) {
                                var value = utils.parseFloat(v.overallSum, null);
                                var rank = utils.parseFloat(v.ranking, null);
                                // xmt 2015.6.17 12:02 optimize for fixing that display repeatitive data on developer chart
                                var hasExist = el.series.some(function(item){return item.name == v.company ;})
                                if(!hasExist) {
                                	el.series.push({ name: v.company, value: value, rankSortValue: value, rank: rank });
                                } 
                            }).value();

                            if(el.format == "#"){
                                el.series = utils.convertUnitsToPercent(el.series);
                            }
                        return el;
                })
                .value();
            },
        };
	});
});