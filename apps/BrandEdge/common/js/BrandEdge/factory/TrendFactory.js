define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('TrendFactory', function(CommonUtilityFactory){
		_.str = underscore_str;
		var utils = CommonUtilityFactory;

        return {

        	_processTrendResult: function(result) {
    			var valueKeys = ['', 'Cognitive', 'Cloud', 'Analytics', 'Mobile', 'Social', 'Security', 'IT', 'LOB', 'Clients', 'Prospects', 'IBMer', 'External'];
    			_.each(result, function(item){
    				item.data = _.chain(item.data)
	                    .sortBy(function (d) {
	                        return d.company.toLowerCase();
	                    })
	                    .sortBy(function (d) {
	                        return (d.company == "IBM") ? 0 : 1;
	                    })//make IBM first element
	                    .value();
    				
    				var periods = [];
    				_.each(item.data, function(inner){
    					_.each(inner.data, function(period){
    						if(typeof _.find(periods, function(p){
    							return p.name == period.name;
    						}) == 'undefined')
    						{
    							periods.push({name: period['name'], startdate: new Date(Date.parse(period['startdate']))});
    						}
    					});
    				});
    				
    				periods = _.sortBy(periods, 'startdate');
    				var periodPoints = [];
    				_.each(periods, function(item){
    					periodPoints.push(item.name);
    				});
    				item['periodPoints'] = periodPoints;
    				var startpoint = periodPoints[0];
    				var endpoint = periodPoints[periodPoints.length -1];
    				var periodRange = startpoint + " - " + endpoint;
    				item["periodRange"] = periodRange;
    				
    				_.each(valueKeys, function(valueKey){
    					item['value' + valueKey] = {};

    					if (item.percentage == false){
        					var totalMap = {};
        					for (var x in periodPoints)
        					{
        						var name = periodPoints[x];
        						var total = 0;
        						for (var y in item.data)
        						{
        							for (var z in item.data[y].data)
        							{
        								if (item.data[y].data[z].name === name) {   									
        									if (item.data[y].data[z]['value' + valueKey] != null)
        									{
        										total = total + parseInt(item.data[y].data[z]['value' + valueKey]);
        									}
        									break;
        								}
        							}
        						}
    							totalMap[name] = total;
        					}
    						if (item.percentage == false){
    		    				_.each(item.data, function(inner){
    		    					_.each(inner.data, function(pd){
    		    						if (pd['value' + valueKey] == null) {
    		    							pd['value' + valueKey] = 0;
    		    						}
    		    						pd['yLabel' + valueKey] = pd['value' + valueKey];
    		    						if (totalMap[pd.name] != 0) {
    		    							pd['value' + valueKey] = parseInt(pd['value' + valueKey] / totalMap[pd.name] * 10000) / 100.0;
    		    						}
    		    					});
    		    				});
    						}
    					}

    					var valueArrayMap = {};
    					for (var x in periodPoints)
    					{
    						var name = periodPoints[x];
    						var valueArray = [];
    						for (var y in item.data)
    						{
    							for (var z in item.data[y].data)
    							{
    								if (item.data[y].data[z].name === name) {
    									if (item.data[y].data[z]['value' + valueKey] == null) {
    										item.data[y].data[z]['value' + valueKey] = 0;
    									}
										valueArray.push(item.data[y].data[z]['value' + valueKey]);
    									break;
    								}
    							}
    						}
    						if (valueArray.length > 0) {
    							valueArrayMap[name] = valueArray;
    						}
    					}
    					
    					item['value' + valueKey].valueArrayMap = valueArrayMap;
    					
    					var in_periodPoints = _.filter(periodPoints, function(d){
    						return typeof valueArrayMap[d] != "undefined";
    					});
    					item['value' + valueKey].periodPoints = in_periodPoints;

    					var in_data = [];
    					_.each(item.data, function(it){
    						var fdata = _.filter(it.data, function(d){
    							return _.find(in_periodPoints, function(period){
    								return period == d.name; }) && d['value' + valueKey] != null;
    						})
    						fdata = _.sortBy(fdata, 'startdate');
    						in_data.push({'company':it.company, 'data':fdata});
    					});
    					item['value' + valueKey].data = in_data;
    				});
    				item.percentage = true;
    			});
            },

            _refactorData: function(data, constituent, column, filter) {
                var columns = {
        				"belief": 1,
        				"action": 2,
        				"advocacy": 3,
        				"strategy": 4
        				};
                var filters;
                switch (constituent) {
                	case "INFLUENCERS": {
                		filters = {
                				"market-view": {value: "value", ranking: "displayRank", rating: "displayRating"},
                				"cognitive": {value: "valueCognitive", ranking: "displayRankCognitive", rating: "displayRatingCognitive"},
                				"cloud": {value: "valueCloud", ranking: "displayRankCloud", rating: "displayRatingCloud"},
                				"analytics": {value: "valueAnalytics", ranking: "displayRankAnalytics", rating: "displayRatingAnalytics"},
                				"mobile": {value: "valueMobile", ranking: "displayRankMobile", rating: "displayRatingMobile"},
                				"social": {value: "valueSocial", ranking: "displayRankSocial", rating: "displayRatingSocial"},
                				"security": {value: "valueSecurity", ranking: "displayRankSecurity", rating: "displayRatingSecurity"},
                				"ibmer": {value: "value", ranking: "displayRank", rating: "displayRating"},
                				"external": {value: "value", ranking: "displayRank", rating: "displayRating"}
                		};
                		break;
                	};
                	case "CLIENTS & PROSPECTS":
                	case "DEVELOPERS": {
                		filters = {
                    			"market-view": {value: "value", ranking: "displayRank", rating: "displayRating"}
                    	};
                		break;
                	}
                };
                
        		column = column || "belief";
        		column = _.str.clean(column).toLowerCase();
        		column = columns[column] || columns["belief"];
        		
        		var currentfilter = filter;
        		filter = filter || "market-view";
        		filter = _.str.clean(filter).toLowerCase();
        		filter = filters[filter] || filters["market-view"];
        		
        		var lineData = _.chain(data)
        		.toArray()
                .map(function (v, k) {
                	var el = {};
                	el.code = v['code'];
                	el.filter = currentfilter;
                	el.column = column == 4 ? 4:null;
                	el.caption = v['caption'];
                	el.chartType = v['chartType'];
                	el.title = v['title'] + " " + utils.getDisplayRating(v[filter.ranking]);
                	el.icon = v['icon']
                	el.rating = v[filter.rating];
                	el.year = v['year'];
                	el.quarter = v['quarter'];
                	el.month = v['month'];
                	el.percentage = v['percentage'];
                	el.type = v['period'];
                	el.detailurl = _.str.clean(v["detailurl"]);
                	el.user_name = _.str.clean(v["user_name"]);
                	el.password = _.str.clean(v["password"]);
                	el.urlType = _.str.clean(v["urlType"]);
                	el.pRating = v['p' + filter.rating];
                	el.pRanking = v['p' + filter.ranking];
                	el.pShow = el.pRating != null || el.pRanking != null;
                	el.value = {
            			periodPoints : v[filter.value].periodPoints,
            			valueArrayMap : v[filter.value].valueArrayMap,
            			data :
            				_.chain(v[filter.value].data)
            				.map(function(v, k){
            					return {
            						company : v['company'],
            						data: 
            							_.chain(v['data'])
            							.map(function(v, k){
            								var suffix = filter.value.substring(5);
            								return {
            									name : v['name'],
            									startdate : v['startdate'],
            									value : v[filter.value],
            									yLabel : v['yLabel' + suffix]
            								}
            							}).value()
            					}
            				}).value()
                	};
                	return el;
                }).value();
                return lineData;
            }
        };
	});
});