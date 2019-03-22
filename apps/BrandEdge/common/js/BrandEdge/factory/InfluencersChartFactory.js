define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('InfluencersChartFactory', function($q, BHDataAdapterService, CustomMath, CommonUtilityFactory){
		_.str = underscore_str;
        var utils = CommonUtilityFactory;

        var columns = {
        				"belief": 1,
        				"action": 2,
        				"advocacy": 3
        				};
        
        var filters = {
        				"market-view": {value: "overall", ranking: "rankingDisplay", rating: "rating"},
        				"cognitive": {value: "cognitive", ranking: "cognitiveRanking", rating: "cognitiveRating"},
        				"cloud": {value: "cloud", ranking: "cloudRanking", rating: "cloudRating"},
        				"analytics": {value: "analytics", ranking: "analyticsRanking", rating: "analyticsRating"},
        				"mobile": {value: "mobile", ranking: "mobileRanking", rating: "mobileRating"},
        				"social": {value: "social", ranking: "socialRanking", rating: "socialRating"},
        				"security": {value: "security", ranking: "securityRanking", rating: "securityRating"},
        				"ibmer": {value: "IBMer", ranking: "rankingDisplay", rating: "rating"},
        				"external": {value: "Non-IBMer", ranking: "rankingDisplay", rating: "rating"}
        };
        
        var sources = {
        				"marketplace": 1,
        				"ibm-provided": 2,
        				"marketplace-&-ibm": 3
        			 };
        
        var currentFilter = null;
        
        return {
        	getData: function(country, date, column, filter, source) {
        		currentFilter = filter;
        		column = column || "belief";
        		column = _.str.clean(column).toLowerCase();
        		column = columns[column] || columns["belief"];
        		
        		filter = filter || "market-view";
        		filter = _.str.clean(filter).toLowerCase();
        		filter = filters[filter] || filters["market-view"];
        		
        		source = sources[_.str.clean(source).toLowerCase()];
        		if (country && date) {
        			if(filter.value === "IBMer" || filter.value === "Non-IBMer"){
        				return $q.all([
        	                            BHDataAdapterService.getInfluencerChartClassData(country, date, column, filter.value)
        	                        ]).then((function (data) {
                                        return this._processChartData(data[0], angular.extend({}, filter, {value: "overall"}), source);
        	                        }).bind(this), function (error) {
                                        throw error;
                                    });
        			}else{
        				return $q.all([
        	                            BHDataAdapterService.getInfluencerChartData(country, date, column),
        	                            BHDataAdapterService.getInfluencerTableChartData(country, date, column)
        	                        ]).then((function (data) {
        	                        	var tableCharts = this._processTableData(data[1], filter);
        	                        	var charts = this._processChartData(data[0], filter, source);
        	                        	return charts.concat(tableCharts);
        	                        }).bind(this), function (error) {
                                        throw error;
                                    });
        			}
        			
        		}
        	},

            _processChartData: function(data, filter, source){
                 var rawData = _.chain(data)
                    .map(function (v, k) {
                        return {
                            column: _.str.clean(v["COLUMN"]),
                            chartType: _.str.clean(v["PAGE_CHART_TYPE"]),
                            format: _.str.clean(v["NUMERIC_FORMAT"]),
                            sequence: _.str.clean(v["SEQUENCE"]),
                            code: _.str.clean(v["METRIC_CODE"]),
                            company: _.str.clean(v["COMPANY"]),

                            pieLabel: _.str.clean(v["PIE_LABEL"]),

                            type: _.str.clean(v["TYPE"]),
                            value: _.str.clean(v["VALUE"]),

                            year: _.str.clean(v["YEAR"]),
                            month: _.str.clean(v["MONTH"]),
                            quarter: _.str.clean(v["QUARTER"]),

                            title: _.str.clean(v["DISPLAY_NAME"]),
                            icon: _.str.clean(v["ICON_TEXT"]),
                            dataPeriodType: _.str.titleize(_.str.clean(v["DATA_PERIOD_TYPE"]).toLowerCase()),

                            sampleSizeMessage: _.str.clean(v["SAMPLE_SIZE_MESSAGE"]),
                            sampleSizeCognitive: _.str.clean(v["SAMPLE_SIZE_COGNITIVE"]),
                            sampleSizeAnalytics: _.str.clean(v["SAMPLE_SIZE_ANALYTICS"]),
                            sampleSizeCloud: _.str.clean(v["SAMPLE_SIZE_CLOUD"]),
                            sampleSizeMobile: _.str.clean(v["SAMPLE_SIZE_MOBILE"]),
                            sampleSizeSocial: _.str.clean(v["SAMPLE_SIZE_SOCIAL"]),
                            sampleSizeSecurity: _.str.clean(v["SAMPLE_SIZE_SECURITY"]),

                            overallSum: _.str.clean(v["OVERALL_SUM"]),
                            ranking: _.str.clean(v["RANKING"]),
                            rankingDisplay: _.str.clean(v["RANKING_DISPLAY"]),
                            rating: utils.clean(v["RATING"]),
                            
                            cognitiveSum: _.str.clean(v["COGNITIVE_SUM"]),
                            cognitiveRating: utils.clean(v["COGNITIVE_RATING"]),
                            cognitiveRanking: _.str.clean(v["COGNITIVE_RANKING"]),

                            analyticsSum: _.str.clean(v["ANALYTICS_SUM"]),
                            analyticsRating: utils.clean(v["ANALYTICS_RATING"]),
                            analyticsRanking: _.str.clean(v["ANALYTICS_RANKING"]),

                            cloudSum: _.str.clean(v["CLOUD_SUM"]),
                            cloudRating: utils.clean(v["CLOUD_RATING"]),
                            cloudRanking: _.str.clean(v["CLOUD_RANKING"]),

                            mobileSum: _.str.clean(v["MOBILE_SUM"]),
                            mobileRating: utils.clean(v["MOBILE_RATING"]),
                            mobileRanking: _.str.clean(v["MOBILE_RANKING"]),

                            socialSum: _.str.clean(v["SOCIAL_SUM"]),
                            socialRating: utils.clean(v["SOCIAL_RATING"]),
                            socialRanking: _.str.clean(v["SOCIAL_RANKING"]),

                            securitySum: _.str.clean(v["SECURITY_SUM"]),
                            securityRating: utils.clean(v["SECURITY_RATING"]),
                            securityRanking: _.str.clean(v["SECURITY_RANKING"]),
                            
                            prating: _.str.clean(v["P_RATING"]),
                            prankingDisplay: _.str.clean(v["P_RANKING"]),

                            pcognitiveRating: _.str.clean(v["P_COGNITIVE_RATING"]),
                            pcognitiveRanking: _.str.clean(v["P_COGNITIVE_RANKING"]),
                            
                            panalyticsRating: _.str.clean(v["P_ANALYTICS_RATING"]),
                            panalyticsRanking: _.str.clean(v["P_ANALYTICS_RANKING"]),

                            pcloudRating: _.str.clean(v["P_CLOUD_RATING"]),
                            pcloudRanking: _.str.clean(v["P_CLOUD_RANKING"]),

                            pmobileRating: _.str.clean(v["P_MOBILE_RATING"]),
                            pmobileRanking: _.str.clean(v["P_MOBILE_RANKING"]),

                            psocialRating: _.str.clean(v["P_SOCIAL_RATING"]),
                            psocialRanking: _.str.clean(v["P_SOCIAL_RANKING"]),

                            psecurityRating: _.str.clean(v["P_SECURITY_RATING"]),
                            psecurityRanking: _.str.clean(v["P_SECURITY_RANKING"]),
                            
                            // xmt 2015.6.25 16:58
                            detailurl : _.str.clean(v["URL"]),
                            user_name : _.str.clean(v["USER"]),
                            password : _.str.clean(v["PW"]),
                            urlType : _.str.clean(v["URL_TYPE"]),
                            
                            //sample size
                            filter : currentFilter
                            //sample size
                        }
                    })//transform data to proper json
                    .groupBy(function(e, i){
                    	if(e.type.indexOf('by vendor') > -1) return 1;
                    	else if(e.type.indexOf('from IBM') > -1) return 2;
                    	else return 3;
                    }).value();//group by identification
                 
                    var chartData = _.chain(rawData[source]).groupBy(function (e, i) {
                        return e.sequence
                    })//group by sequence
                    .map(function (v, k) {
                        //console.log(k, v);
                        var o = _.first(v) || {};
                        var ibm = _.chain(v).find(function (item) {
                            return item.company == "IBM";
                        }).value() || {};

                        var sampleSizeMessage =  (_.chain(v).find(function (item) {
                            return (item.sampleSizeMessage != null && item.sampleSizeMessage.length > 0);
                        }).value() || { /*sampleSizeMessage: "dummy sample size message"*/ }).sampleSizeMessage;

                        var el = { margin: "" };
                        el.title = o.title + " " + utils.getDisplayRating(ibm[filter.ranking]);
                        el.icon = o.icon;
                        el.type = o.dataPeriodType;
                        el.chartType = o.chartType;
                        el.format = o.format || "%";

                        el.code = o.code;
//                        el.sampleSizeMessage = ibm.sampleSizeMessage;
                        
                        // xmt 2015.6.25 16:58
                        el.detailurl = o.detailurl;
                        el.user_name = o.user_name;
                        el.password = o.password;
                        el.urlType = o.urlType;
                        
                        //sample size
                        el.filter = o.filter;
                        el.sampleSizeMessage = o.sampleSizeMessage;
                        el.sampleSizeCognitive = o.sampleSizeCognitive;
                        el.sampleSizeAnalytics = o.sampleSizeAnalytics;
                        el.sampleSizeCloud = o.sampleSizeCloud;
                        el.sampleSizeMobile = o.sampleSizeMobile;
                        el.sampleSizeSocial = o.sampleSizeSocial;
                        el.sampleSizeSecurity = o.sampleSizeSecurity;
                        //sample size
                        el.year = o.year;
                        el.month = o.month;
                        el.quarter = o.quarter;
                        el.rating = ibm[filter.rating];
                        el.pRating = ibm['p' + filter.rating];
                        el.pRanking = ibm['p' + filter.ranking];
                        el.pShow = el.pRating != "" || el.pRanking != "";
//                        console.log("ARIK", el.code, el.rating);
                        var key = filter.value + "Sum";
                        var rankKey = filter.value + "Ranking";

                        if(el.chartType === "bar"){
                            el.series = _.chain(v)
                                .sortBy(function (item) {
                                    return (item.company == "IBM") ? 0 : 1;
                                })//make IBM first element
                                .map(function (v, k) {
                                	var value = utils.parseFloat(v[key], null);
                                	var rank = 0;
                                	if(filter.value == "overall"){
                                		rank = utils.parseFloat(v['ranking'], null);
                                	}else{
                                		rank = utils.parseFloat(v[rankKey], null);
                                	}
                                	if(!!!el.sampleSizeMessage) el.sampleSizeMessage = v.sampleSizeMessage;
                                	if(!!!el.sampleSizeCognitive) el.sampleSizeCognitive = v.sampleSizeCognitive;
                                	if(!!!el.sampleSizeAnalytics) el.sampleSizeAnalytics = v.sampleSizeAnalytics;
                                	if(!!!el.sampleSizeCloud) el.sampleSizeCloud = v.sampleSizeCloud;
                                	if(!!!el.sampleSizeMobile) el.sampleSizeMobile = v.sampleSizeMobile;
                                	if(!!!el.sampleSizeSocial) el.sampleSizeSocial = v.sampleSizeSocial;
                                	if(!!!el.sampleSizeSecurity) el.sampleSizeSecurity = v.sampleSizeSecurity;
                                	return { name: v.company, value: value, rankSortValue: value, rank: rank };
                                }).value();

                            if(el.format == "#"){
                                el.series = utils.convertUnitsToPercent(el.series );
                            }
                        } else if(el.chartType === "pie"){
                            //console.log(v);
                            el.series = _.chain(v).map(function (v, k) {
                            	if(!!!el.sampleSizeMessage) el.sampleSizeMessage = v.sampleSizeMessage;
                            	if(!!!el.sampleSizeCognitive) el.sampleSizeCognitive = v.sampleSizeCognitive;
                            	if(!!!el.sampleSizeAnalytics) el.sampleSizeAnalytics = v.sampleSizeAnalytics;
                            	if(!!!el.sampleSizeCloud) el.sampleSizeCloud = v.sampleSizeCloud;
                            	if(!!!el.sampleSizeMobile) el.sampleSizeMobile = v.sampleSizeMobile;
                            	if(!!!el.sampleSizeSocial) el.sampleSizeSocial = v.sampleSizeSocial;
                            	if(!!!el.sampleSizeSecurity) el.sampleSizeSecurity = v.sampleSizeSecurity;
                                return {
                                            label: v.pieLabel,
                                            value: parseFloat(v[key]) || null,
                                            color: utils.getPieColor(v.pieLabel)
                                };
                            }).value();

                        } else if(el.chartType === "split"){
                            
                            el.series = _.chain(v)
                                .sortBy(function (item) {
                                    return (item.company == "IBM") ? 0 : 1;
                                })//make IBM first element
                                .groupBy(function (e, i) {
                                    return e.company;
                                })
                                .map(function (v, k) {
                                    
                                	var positiveNeutralValue = _.find(v, function(item){ 
                                		return _.str.startsWith(item.type, el.format + " positive/neutral"); 
                                	}) || _.find(v, function(item){ 
                                		return _.str.startsWith(item.type, el.format + " positive"); 
                                	});
                                	
                                	if(!!!el.sampleSizeMessage) el.sampleSizeMessage = positiveNeutralValue.sampleSizeMessage;
                                	if(!!!el.sampleSizeCognitive) el.sampleSizeCognitive = positiveNeutralValue.sampleSizeCognitive;
                                	if(!!!el.sampleSizeAnalytics) el.sampleSizeAnalytics = positiveNeutralValue.sampleSizeAnalytics;
                                	if(!!!el.sampleSizeCloud) el.sampleSizeCloud = positiveNeutralValue.sampleSizeCloud;
                                	if(!!!el.sampleSizeMobile) el.sampleSizeMobile = positiveNeutralValue.sampleSizeMobile;
                                	if(!!!el.sampleSizeSocial) el.sampleSizeSocial = positiveNeutralValue.sampleSizeSocial;
                                	if(!!!el.sampleSizeSecurity) el.sampleSizeSecurity = positiveNeutralValue.sampleSizeSecurity;
                                		
                                    var positiveValue = _.find(v, function(item){ 
                                    		return _.str.startsWith(item.type, el.format + " positive") && !_.str.startsWith(item.type, el.format + " positive/neutral"); 
                                    });
                                    
                                    if(k == 'IBM'){
                                    	el.rating = positiveNeutralValue[filter.rating];
                                        el.pRating = positiveNeutralValue['p' + filter.rating];
                                        el.pRanking = positiveNeutralValue['p' + filter.ranking];
                                        el.pShow = el.pRating != "" || el.pRanking != "";
                                    }  
                                    positiveValue = (positiveValue)?utils.parseFloat(positiveValue[key], null):null;

                                    var neutralValue = _.find(v, function(item){ return _.str.startsWith(item.type, el.format + " neutral"); });
                                    neutralValue = (neutralValue)?utils.parseFloat(neutralValue[key], null):null;

                                    var negativeValue = _.find(v, function(item){ return _.str.startsWith(item.type, el.format + " negative"); });
                                    negativeValue = (negativeValue)?utils.parseFloat(negativeValue[key], null):null;

                                    var total = utils.parseFloat(utils.sum(positiveValue, neutralValue, negativeValue), null);

                                    var arraySplitValue = [positiveValue, neutralValue, negativeValue];

                                    var arraySplitPercent = utils.computePercentToAccurte(arraySplitValue, total);
                                    
                                    return {
                                        name: k,
                                        positiveValue: (el.format == "#")?arraySplitPercent[0]:positiveValue,
                                        neutralValue: (el.format == "#")?arraySplitPercent[1]:neutralValue,
                                        negativeValue: (el.format == "#")?arraySplitPercent[2]:negativeValue,    
//                                        positiveValue: (el.format == "#")?utils.computePercent(positiveValue, total):positiveValue,
//                                        neutralValue: (el.format == "#")?utils.computePercent(neutralValue, total):neutralValue,
//                                        negativeValue: (el.format == "#")?utils.computePercent(negativeValue, total):negativeValue,
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
                    //.toArray()
                    .value();
                return chartData;
            },

            _processTableData: function(data, filter){
                return _.chain(data)
                    .map(function (v, k) {
                        return {
                            column: _.str.clean(v["COLUMN"]),
                            chartType: "table",
                            sequence: _.str.clean(v["SEQUENCE"]),
                            code: _.str.clean(v["METRIC_CODE"]),
                            company: _.str.clean(v["COMPANY"]),

                            title: _.str.clean(v["DISPLAY_NAME"]),
                            icon: _.str.clean(v["ICON_TEXT"]),
                            dataPeriodType: _.str.titleize(_.str.clean(v["DATA_PERIOD_TYPE"]).toLowerCase()),

                            type: _.str.clean(v["TYPE"]),
                            value: _.str.clean(v["VALUE"]),

                            rating: _.str.clean(v["RATING"]),
                            ranking: _.str.clean(v["RANKING"]),
                            rankingDisplay: _.str.clean(v["RANKING_DISPLAY"]),

                            startDate: _.str.clean(v["START_DATE"]),
                            startDateP: _.str.clean(v["PY_START_DATE"]),

                            overallSum: _.str.clean(v["OVERALL_SUM"]),
                            overallSumP: _.str.clean(v["PY_OVERALL_SUM"]),
                            overallPct: _.str.clean(v["OVERALL_PCT"]),
                            overallRating: _.str.clean(v["RATING"]),
                            
                            cognitiveSum: _.str.clean(v["COGNITIVE_SUM"]),
                            cognitiveSumP: _.str.clean(v["PY_COGNITIVE_SUM"]),
                            cognitivePct: _.str.clean(v["COGNITIVE_PCT"]),
                            cognitiveRating: _.str.clean(v["COGNITIVE_RATING"]),
                            cognitiveRanking: _.str.clean(v["COGNITIVE_RANKING"]),
                            
                            analyticsSum: _.str.clean(v["ANALYTICS_SUM"]),
                            analyticsSumP: _.str.clean(v["PY_ANALYTICS_SUM"]),
                            analyticsPct: _.str.clean(v["ANALYTICS_PCT"]),
                            analyticsRating: _.str.clean(v["ANALYTICS_RATING"]),
                            analyticsRanking: _.str.clean(v["ANALYTICS_RANKING"]),

                            cloudSum: _.str.clean(v["CLOUD_SUM"]),
                            cloudSumP: _.str.clean(v["PY_CLOUD_SUM"]),
                            cloudPct: _.str.clean(v["CLOUD_PCT"]),
                            cloudRating: _.str.clean(v["CLOUD_RATING"]),
                            cloudRanking: _.str.clean(v["CLOUD_RANKING"]),

                            mobileSum: _.str.clean(v["MOBILE_SUM"]),
                            mobileSumP: _.str.clean(v["PY_MOBILE_SUM"]),
                            mobilePct: _.str.clean(v["MOBILE_PCT"]),
                            mobileRating: _.str.clean(v["MOBILE_RATING"]),
                            mobileRanking: _.str.clean(v["MOBILE_RANKING"]),

                            socialSum: _.str.clean(v["SOCIAL_SUM"]),
                            socialSumP: _.str.clean(v["PY_SOCIAL_SUM"]),
                            socialPct: _.str.clean(v["SOCIAL_PCT"]),
                            socialRating: _.str.clean(v["SOCIAL_RATING"]),
                            socialRanking: _.str.clean(v["SOCIAL_RANKING"]),

                            securitySum: _.str.clean(v["SECURITY_SUM"]),
                            securitySumP: _.str.clean(v["PY_SECURITY_SUM"]),
                            securityPct: _.str.clean(v["SECURITY_PCT"]),
                            securityRating: _.str.clean(v["SECURITY_RATING"]),
                            securityRanking: _.str.clean(v["SECURITY_RANKING"]),
                            
                            prating: _.str.clean(v["P_RATING"]),
                            prankingDisplay: _.str.clean(v["P_RANKING"]),
                            
                            pcognitiveRating: _.str.clean(v["P_COGNITIVE_RATING"]),
                            pcognitiveRanking: _.str.clean(v["P_COGNITIVE_RANKING"]),

                            panalyticsRating: _.str.clean(v["P_ANALYTICS_RATING"]),
                            panalyticsRanking: _.str.clean(v["P_ANALYTICS_RANKING"]),

                            pcloudRating: _.str.clean(v["P_CLOUD_RATING"]),
                            pcloudRanking: _.str.clean(v["P_CLOUD_RANKING"]),

                            pmobileRating: _.str.clean(v["P_MOBILE_RATING"]),
                            pmobileRanking: _.str.clean(v["P_MOBILE_RANKING"]),

                            psocialRating: _.str.clean(v["P_SOCIAL_RATING"]),
                            psocialRanking: _.str.clean(v["P_SOCIAL_RANKING"]),

                            psecurityRating: _.str.clean(v["P_SECURITY_RATING"]),
                            psecurityRanking: _.str.clean(v["P_SECURITY_RANKING"]),
                        }
                    })//transform data to proper json
                    .groupBy(function (e, i) {
                        return e.sequence
                    })//group by sequence
                    .map(function (v, k) {
                    	var key = filter.value + "Sum";
                        var data = _.first(v) || {};

                        var ibm = _.chain(v).find(function (item) {
                            return item.company == "IBM";
                        }).value() || {};

                        var sampleSizeMessage =  (_.chain(v).find(function (item) {
                            return (item.sampleSizeMessage != null && item.sampleSizeMessage.length > 0);
                        }).value() || { /*sampleSizeMessage: "dummy sample size message"*/ }).sampleSizeMessage;

                        var el = { margin: "" };
                        el.title = data.title + " " + utils.getDisplayRating(ibm[filter.ranking]);
                        el.icon = data.icon;
                        el.type = data.dataPeriodType;
                        el.chartType = data.chartType;

                        el.year = o.year;
                        el.month = o.month;
                        el.quarter = o.quarter;
                        el.code = o.code;

                        el.rating = ibm[filter.rating];
                        el.pRating = ibm['p' + filter.rating];
                        el.pRanking = ibm['p' + filter.ranking];
                        el.pShow = el.pRating != "" || el.pRanking != "";

                        el.sampleSizeMessage = sampleSizeMessage;

						el.detailurl = null;
						el.user_name = null;
						el.password = null;
						
						//sample size
                        el.filter = null;
                        el.sampleSizeMessage = null;
                        el.sampleSizeCognitive = null;
                        el.sampleSizeAnalytics = null;
                        el.sampleSizeCloud = null;
                        el.sampleSizeMobile = null;
                        el.sampleSizeSocial = null;
                        el.sampleSizeSecurity = null;
                        //sample size
						
                        el.tableData = {
                            titles: ["", "Total"],
                            data:[
                                ["4Q " + (new Date(Date.parse(data.startDate))).getFullYear(), parseFloat(data[key])],
                                ["4Q " + (new Date(Date.parse(data.startDateP))).getFullYear(), parseFloat(data[key + "P"])]
                            ],
                            totals:["Y2Y Growth", data[filter.value + "Pct"] + "%"]
                        };

                        el.rating = data[filter.value + "Rating"];
                        return el;
                    })
                    .toArray()
                    .value();
            }
        };
	});
});