define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){

	app.factory('DeveloperChartFactory', function($q, BHDataAdapterService, CustomMath, CommonUtilityFactory){
		_.str = underscore_str;

        var utils = CommonUtilityFactory;

		var sortSequence = {
				"1": "1",
                "2": "2",
				"3": "3",
				"6": "4",
				"4": "5",
				"5": "6",
				"7": "7"
		};

        var columns = {
            "belief": 1,
            "action": 2,
            "advocacy": 3
        };

        return {
			getData: function(country,date, column, filter) {
                column = column || "belief";
                column = _.str.clean(column).toLowerCase();
                column = columns[column] || columns["belief"];

                //console.log("country %s, column %i , filter %s", country, column, filter);

                return $q.all([
                    BHDataAdapterService.getDeveloperCurrent(country, date, column),
                    BHDataAdapterService.getDeveloperTableChart(country, date, column)
                ]).then((function (data) {
                    var charts = this._processChartData(data[0], filter);
                    var tableCharts = this._processTableData(data[1]);
                    return _.chain(charts.concat(tableCharts))
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
                        column: _.str.clean(v["COLUMN"]),
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

                        // xmt 2015.6.19 15:58
                        detailurl : _.str.clean(v["URL"]),
                        user_name : _.str.clean(v["USER"]),
                        password : _.str.clean(v["PW"]),
                        urlType : _.str.clean(v["URL_TYPE"]),
                        
                        filter: filter,
                        
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
                        
                        // xmt 2015.6.19 15:58
                        el.detailurl = o.detailurl;
                        el.user_name = o.user_name;
                        el.password = o.password;
                        el.urlType = o.urlType;
                        
                        el.filter = o.filter;
                        el.sampleSizeMessage = sampleSizeMessage;

                        el.sequence = o.sequence;
                        el.sortSequence = o.sortSequence;

                        el.rating = ibm.rating;
                        
                        el.pRating = ibm.pRating;
                        el.pRanking = ibm.pRanking;
                        el.pShow = ibm.pShow;

                        if(el.chartType === "bar"){
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
                                	if(!!!el.sampleSizeMessage) el.sampleSizeMessage = v.sampleSizeMessage;
                                } 
                            }).value();

                            if(el.format == "#"){
                                el.series = utils.convertUnitsToPercent(el.series);
                            }

                        } else {
                            el.series = _.chain(v)
                            .sortBy(function (item) {
                                return (item.company == "IBM") ? 0 : 1;
                            })//make IBM first element
                            .groupBy(function (e, i) {
                                return e.company;
                            })
                            .map(function (v, k) {
                            		var positiveNeutralValue = _.find(v, function(item){ return _.str.startsWith(item.type, el.format + " positive/neutral"); });
                            		if(!!!el.sampleSizeMessage) el.sampleSizeMessage = v.sampleSizeMessage;
                            		if(k == 'IBM' && positiveNeutralValue){
                                    	el.rating = positiveNeutralValue['rating'];
                                        el.pRating = positiveNeutralValue['pRating'];
                                        el.pRanking = positiveNeutralValue['pRanking'];
                                        el.pShow = el.pRating != "" || el.pRanking != "";
                            		}
                            	
                                    var positiveValue = _.find(v, function(item){ return _.str.startsWith(item.type, el.format + " positive"); });
                                    positiveValue = (positiveValue)?utils.parseFloat(positiveValue.overallSum, null):null;

                                    var neutralValue = _.find(v, function(item){ return _.str.startsWith(item.type, el.format + " neutral"); });
                                    neutralValue = (neutralValue)?utils.parseFloat(neutralValue.overallSum, null):null;

                                    var negativeValue = _.find(v, function(item){ return _.str.startsWith(item.type, el.format + " negative"); });
                                    negativeValue = (negativeValue)?utils.parseFloat(negativeValue.overallSum, null):null;

                                    var total = utils.parseFloat(utils.sum(positiveValue, neutralValue, negativeValue), null);
                                    
                                    var arraySplitValue = [positiveValue, neutralValue, negativeValue];

                                    var arraySplitPercent = utils.computePercentToAccurte(arraySplitValue, total);
                                    return {
                                        name: k,
//                                        positiveValue: (el.format == "#")?utils.computePercent(positiveValue, total):positiveValue,
//                                        neutralValue: (el.format == "#")?utils.computePercent(neutralValue, total):neutralValue,
//                                        negativeValue: (el.format == "#")?utils.computePercent(negativeValue, total):negativeValue,
                                        positiveValue: (el.format == "#")?arraySplitPercent[0]:positiveValue,
                                        neutralValue: (el.format == "#")?arraySplitPercent[1]:neutralValue,
                                        negativeValue: (el.format == "#")?arraySplitPercent[2]:negativeValue,
                                        yPositiveValue: (el.format == "#")?utils.numberWithCommas(positiveValue): null,
                                        yNeutralValue: (el.format == "#")?utils.numberWithCommas(neutralValue): null,
                                        yNegativeValue: (el.format == "#")?utils.numberWithCommas(negativeValue): null,
                                        value: utils.parseFloat(utils.sum(neutralValue, positiveValue), null),
                                        rankSortValue: utils.parseFloat(utils.sum(neutralValue, positiveValue), null)
                                        //origData: v[0]
                                    };
                                })
                            .value();
                        }

                        //var values = _.chain(el.series).reject(function(v){ return !_.isFinite(v.value); }).pluck("value").value();
                        //el.rating = CustomMath.getRating(values[0], values);
                        return el;
                })
                .value();
            },

            _processTableData: function(data){
                return _.chain(data).map(function (v, k) {
                        return {
                            column: _.str.clean(v["COLUMN"]),
                            chartType: "table",
                            sequence: _.str.clean(v["SEQUENCE"]),
                            sortSequence: sortSequence[_.str.clean(v["SEQUENCE"])],
                            code: _.str.clean(v["METRIC_CODE"]),
                            company: _.str.clean(v["COMPANY"]),
                            rankingDisplay: _.str.clean(v["RANKING_DISPLAY"]),

                            rating: _.str.clean(v["DISPLAY_COLOR"]),

                            title: _.str.clean(v["DISPLAY_NAME"]),
                            icon: _.str.clean(v["ICON_TEXT"]),
                            dataPeriodType: _.str.titleize(_.str.clean(v["DATA_PERIOD_TYPE"]).toLowerCase()),
                            sampleSizeMessage: _.str.clean(v["SAMPLE_SIZE_MESSAGE"]),

                            year: _.str.clean(v["YEAR"]),
                            month: _.str.clean(v["MONTH"]),
                            quarter: _.str.clean(v["QUARTER"]),
                            type: _.str.clean(v["TYPE"]),

                            totalLabel: _.str.clean(v["TOTAL_LABEL"]) || "Y2Y Growth",
                            startDate: _.str.clean(v["START_DATE"]),
                            startDateP: _.str.clean(v["PY_START_DATE"]),

                            value: _.str.clean(v["VALUE"]),
                            valueP: _.str.clean(v["PY_VALUE"]),
                            valueDiff: _.str.clean(v["VALUE_DIFF"]),
                            valuePct: _.str.clean(v["VALUE_PCT"]),

                            valueNumericFormat: _.str.clean(v["VALUE_NUMERIC_FORMAT"]),
                            valueNumericFormatP: _.str.clean(v["PY_VALUE_NUMERIC_FORMAT"]),
                            valuePercentFormat: _.str.clean(v["VALUE_PCT_NUMERIC_FORMAT"]),
                            
                            pRating : _.str.clean(v["P_RATING"]),
                            pRanking : _.str.clean(v["P_RANKING"]),
                            pShow : v["P_RATING"] != null || v["P_RANKING"] != null,

                        }
                    })//transform data to proper json
                    .groupBy(function (e, i) {
                        return e.sequence
                    })//group by sequence
                    .map(function (v, k) {
                        var key = "value";
                        var o = _.first(v) || {};

                        var sampleSizeMessage =  (_.chain(v).find(function (item) {
                            return (item.sampleSizeMessage != null && item.sampleSizeMessage.length > 0);
                        }).value() || { /*sampleSizeMessage: "dummy sample size message"*/ }).sampleSizeMessage;

                        var el = { margin: "" };
                        el.title = o.title;
                        el.icon = o.icon;
                        el.type = o.dataPeriodType;
                        el.chartType = o.chartType;

                        el.year = o.year;
                        el.month = o.month;
                        el.quarter = o.quarter;
                        el.code = o.code;
                        el.totalLabel = o.totalLabel;

                        el.sequence = o.sequence;
                        el.sortSequence = o.sortSequence;

                        el.sampleSizeMessage = sampleSizeMessage;
                        
                        //Modify by Fx begin add AccessUrl
                        el.detailurl = null;
                        el.user_name = null;
                        el.password = null;
                        //Modify by Fx end

                        var label = "";
                        if(el.type == "Quarterly"){
                            label = el.quarter + "Q ";
                        }else if(el.type == "Monthly"){
                            label = utils.getMonth(parseInt(el.month) - 1) + " ";
                        }

                        el.tableData = {
                            titles: ["", "Total"],
                            data:[
                                [label + (new Date(Date.parse(o.startDate))).getFullYear(), parseFloat(o[key])],
                                [label + (new Date(Date.parse(o.startDateP))).getFullYear(), parseFloat(o[key + "P"])]
                            ],
                            totals:[el.totalLabel, o[key + "Pct"] + "%"]
                        };

                        el.ranking = o["rankingDisplay"];
                        el.rating = o["rating"];
                        
                        el.pRating = o["pRating"];
                        el.pRanking = o["pRanking"];
                        el.pShow = o["pShow"];
                        return el;
                    })
                    .toArray()
                    .value();
            }
        };
	});
});