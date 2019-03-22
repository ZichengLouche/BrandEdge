define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('InfluencersFactory', function($q, BHDataAdapterService, DonutFactory, CommonUtilityFactory){
		_.str = underscore_str;

        var utils = CommonUtilityFactory;

        var createItem = function (text, color, rating, ranking) {
            return {
            	label: text,
            	color: color,
            	rating: rating,
                ranking: ranking,
            	center: DonutFactory.getCenter(),
            	segments: DonutFactory.getSegments()
            };
        };
        
        var defaultData = [];
        defaultData.push(createItem("Influencers", "color", "value", "ranking"));
        defaultData.push(createItem("Cognitive", "cognitiveColor", "cognitiveRating", "cognitiveRanking" ));
        defaultData.push(createItem("Cloud", "cloudColor", "cloudRating", "cloudRanking" ));
        defaultData.push(createItem("Analytics", "analyticsColor", "analyticsRating", "analyticsRanking"));
        defaultData.push(createItem("Mobile", "mobileColor", "mobileRating", "mobileRanking"));
        defaultData.push(createItem("Social", "socialColor", "socialRating", "socialRanking"));
        defaultData.push(createItem("Security", "securityColor", "securityRating", "securityRanking"));
        
//        var IBMData = [];
//        IBMData.push(createItem("Influencers", "color", "value", "ranking"));
        defaultData.push(createItem("IBMer", "ibmerColor", "ibmerRating", "ibmerRanking"));
        defaultData.push(createItem("External", "externalColor", "externalRating", "externalRanking"));
        
        return {

            getData: function(country, date, filter) {

                if (country&&date) {
                    return $q.all([
                        BHDataAdapterService.getInfluencerDashboard(country, date),
                        BHDataAdapterService.getInfluencerBarChartData(country, date)
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
                                    icon: _.str.clean(v["ICON_TEXT"]),
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
                            .groupBy(function(elem, index){
                            	return elem.column + '-' + elem.sequence + '-' + elem.company;
                            })
                            .map(function(v, k){
                            	return {
                                    column: v[0].column,
                                    company: v[0].company,
                                    measure: v[0].measure,
                                    code: v[0].code,
                                    ranking: v[0].ranking,
                                    sequence: v[0].sequence,
                                    icon: v[0].icon,
                                    value: v[0].value,
                                    
                                    cognitiveRating: v[0].cognitiveRating,
                                    analyticsRating: v[0].analyticsRating,
                                    cloudRating: v[0].cloudRating,
                                    mobileRating: v[0].mobileRating,
                                    socialRating: v[0].socialRating,
                                    securityRating: v[0].securityRating,
                                    ibmerRating: v[1]?v[1].value:'',
                                    externalRating:v[2]?v[2].value:'',

                                    format: v[0].format
                                }
                            }).value();

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
                                    sequence: _.str.clean(v["SEQUENCE"]),
                                    ranking: _.str.clean(v["DISPLAY_VALUE"]),
                                    rating: _.str.clean(v["RATING"]),

                                    cognitive: _.str.clean(v["COGNITIVE"]),
                                    cognitiveRating: _.str.clean(v["COGNITIVE_RATING"]),
                                    cognitiveColor: _.str.clean(v["COGNITIVE_COLOR"]),
                                    cognitiveRanking: _.str.clean(v["COGNITIVE_RANKING"]),
                                    
                                    analytics: _.str.clean(v["ANALYTICS"]),
                                    analyticsRating: _.str.clean(v["ANALYTICS_RATING"]),
                                    analyticsColor: _.str.clean(v["ANALYTICS_COLOR"]),
                                    analyticsRanking: _.str.clean(v["ANALYTICS_RANKING"]),

                                    cloud: _.str.clean(v["CLOUD"]),
                                    cloudRating: _.str.clean(v["CLOUD_RATING"]),
                                    cloudColor: _.str.clean(v["CLOUD_COLOR"]),
                                    cloudRanking: _.str.clean(v["CLOUD_RANKING"]),
                                    
                                    mobile: _.str.clean(v["MOBILE"]),
                                    mobileRating: _.str.clean(v["MOBILE_RATING"]),
                                    mobileColor: _.str.clean(v["MOBILE_COLOR"]),
                                    mobileRanking: _.str.clean(v["MOBILE_RANKING"]),
                                    
                                    social: _.str.clean(v["SOCIAL"]),
                                    socialRating: _.str.clean(v["SOCIAL_RATING"]),
                                    socialColor: _.str.clean(v["SOCIAL_COLOR"]),
                                    socialRanking: _.str.clean(v["SOCIAL_RANKING"]),
                                    
                                    security: _.str.clean(v["SECURITY"]),
                                    securityRating: _.str.clean(v["SECURITY_RATING"]),
                                    securityColor: _.str.clean(v["SECURITY_COLOR"]),
                                    securityRanking: _.str.clean(v["SECURITY_RANKING"])
                                }
                            })//transform data to proper json                            
                            .groupBy(function(elem, index){
                            	return elem.column + '-' + elem.sequence;
                            }).map(function(v, k){
                            	return {
                                    color: v[0].color,
                                    column: v[0].column,
                                    company: v[0].company,
                                    name: v[0].name,
                                    value: v[0].value,
                                    icon: v[0].icon,
                                    code: v[0].code,
                                    sequence: v[0].sequence,
                                    ranking: v[0].ranking,
                                    rating: v[0].rating,

                                    cognitive: v[0].cognitive,
                                    cognitiveRating: v[0].cognitiveRating,
                                    cognitiveColor: v[0].cognitiveColor,
                                    cognitiveRanking: v[0].cognitiveRanking,
                                    
                                    analytics: v[0].analytics,
                                    analyticsRating: v[0].analyticsRating,
                                    analyticsColor: v[0].analyticsColor,
                                    analyticsRanking: v[0].analyticsRanking,

                                    cloud: v[0].cloud,
                                    cloudRating: v[0].cloudRating,
                                    cloudColor: v[0].cloudColor,
                                    cloudRanking: v[0].cloudRanking,
                                    
                                    mobile: v[0].mobile,
                                    mobileRating: v[0].mobileRating,
                                    mobileColor: v[0].mobileColor,
                                    mobileRanking: v[0].mobileRanking,
                                    
                                    social: v[0].social,
                                    socialRating: v[0].socialRating,
                                    socialColor: v[0].socialColor,
                                    socialRanking: v[0].socialRanking,
                                    
                                    security: v[0].security,
                                    securityRating: v[0].securityRating,
                                    securityColor: v[0].securityColor,
                                    securityRanking: v[0].securityRanking,
                                    
                                    ibmer: v[1]?v[1].value:'',
                                    ibmerRating: v[1]?v[1].rating:'',
                                    ibmerColor: v[1]?v[1].color:'',
                                    ibmerRanking: v[1]?v[1].ranking:'',
                                    
                                    external: v[2]?v[2].value:'',
                                    externalRating: v[2]?v[2].rating:'',
                                    externalColor: v[2]?v[2].color:'',
                                    externalRanking: v[2]?v[2].ranking:''
                            	}
                            }).value();
                        
                        var first = _.chain(data).filter(function (v) {
                            return v.sequence == 1;
                        }).value();
                        
                        var donuts = _.chain(defaultData)
                        .map(function (v, k) {
                        	var label = v.label;
                        	var outerColor = v.color;
                        	var rating = v.rating;
                        	var ranking = v.ranking;
                        	var camsFirst = _.chain(first).map(function (v, k) {
                        		return {
                                    column: v.column,
                                    color: v[label.toLowerCase() == 'influencers'?'color' : label.toLowerCase() + 'Color']
                                   };
//                        		}
                            }).value();
                        	var centerValue = DonutFactory.getCenterValueAndColor(camsFirst);
                        	
//                        	var tripleGrey = false;
//                    		
//                        	v.segments.forEach(function(item){
//                        		tripleGrey = (item.outerColor == '#ccccdd');
//                        	});

                            //var center = DonutFactory.getCenterValueAndColor(first);
                        	return {
                        		label: v.label,
                                segments: _.chain(v.segments)
			                                .map(function (v, k) {
			                                	var o = _.chain(first).find(function (item) {
	                                                return v.column === item.column;
	                                            }).value();

                                                var chart = _.chain(chartData).filter(function (item) {
                                                    return item.column === v.column;
                                                });

                                                var format = (chart.first().value())?chart.first().value().format:"%";

			                                	var series = chart.map(function (v, k) {
	                                                return { name: v.company, value: utils.parseFloat(v[rating], null), rank: utils.parseFloat(v[ranking], null)};
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
                                                })
                                                .map(function (v, k) {
                                                    return {
                                                        sequence: v.sequence,
                                                        name: v.name,
                                                        value: v[ranking],
                                                        color: v[outerColor],
                                                        icon: v.icon
                                                    };
                                                }).value();

                                                var chartTitle = _.chain(details).find(function (item) {
                                                    return item.sequence == 1;
                                                }).value() || {};
                                                
                                                //Get center value
//                                                centerValue += DonutFactory.getColorWeight((o) ? DonutFactory.getColor(o[outerColor]) : "Y");

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
	                                                .value(),
	                                                chart: {
	                                                	margin: "",
	                                                    series: series,
	                                                    //values: _.pluck(series, "value")
                                                        rating: chartTitle.color == "Grey"?"0":"1"
	                                                }
	                                            };
			                                })
			                                .value(),
	                        	 center: {
	                                 textColor: DonutFactory.getColor("W"),
//	                                 color: DonutFactory.getWeightColor(tripleGrey ? '--' : centerValue),
//	                                 value: tripleGrey ? '--' : centerValue
	                                 color: centerValue.color,
	                                 value: centerValue.value
	                             }
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