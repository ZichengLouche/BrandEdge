define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	// xmt 2015.7.16 16:23
	app.factory('WWIotDashboardFactory', function($q, BHDataAdapterService, DonutFactory, EmployeeFactory, CommonUtilityFactory){
		_.str = underscore_str;
        var utils = CommonUtilityFactory;

        return {
            getData: function(permissions, date) {
            			var facObj = this;
                        return $q.all([BHDataAdapterService.getWWIotDashboardListsReport(permissions, date),
                                       BHDataAdapterService.getSecurityProfile(),
                                       BHDataAdapterService.getMetricModel()]).then(
                        	function (result) {  
                        		var metricModel = result[2].map(function (v, k) {
                        			return {
                        				metricCode: _.str.clean(v["METRIC_CODE"]),
	                                    constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()),
	                                    column: _.str.clean(v["COLUMN"]),
	                                    sequence: _.str.clean(v["SEQUENCE"]),
	                                    displayName: _.str.clean(v["DISPLAY_NAME"]),
	                                    camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
	                                    shortName: _.str.clean(v["SHORT_NAME"]),
	                                    camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
	                                }
	                            });
                        		
                        		var countryData = result[0].map(function (v, k) {
                        			return {
	                                	iotName: _.str.clean(v["IOT_NAME"]),
	                                	countryName: _.str.clean(v["COUNTRY_NAME"]),
	                                	constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]),
	                                    constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()),
	                                    column: _.str.clean(v["COLUMN"]),
	                                    sequence: _.str.clean(v["SEQUENCE"]),
	                                    metricCode: _.str.clean(v["METRIC_CODE"]),
	                                    colorScore: _.str.clean(v["COLOR_SCORE"]),
	                                    preColorScore: _.str.clean(v["P_COLOR_SCORE"]),
	                                    displayName: _.str.clean(v["DISPLAY_NAME"]),
	                                    camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
	                                    shortName: _.str.clean(v["SHORT_NAME"]),
	                                    camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
	                                    rating: _.str.clean(v["RATING"]),
	                                    preRating: _.str.clean(v["P_RATING"]),
//	                                    Grey out Employee Information
//	                                    empRating: _.str.clean(v["EMP_RATING"]),
	                                    empRating: null,
	                                    year: _.str.clean(v["YEAR"]),
	                                    month: _.str.clean(v["MONTH"]),
	                                    quarter: _.str.clean(v["QUARTER"]),
	                                    week: _.str.clean(v["WEEK"]),
	                                    datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
	                                    topCompany: _.str.clean(v["TOP_COMPANY_NAME"]),
	                                    ibmRanking: _.str.clean(v["IBM_RANKING"]),
	                                    iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
	                                    wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
	                                    devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
	                                    devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
	                                    iotINT16Score: _.str.clean(v["IOT_RATING"]),
	                                    wwINT16Score: _.str.clean(v["WW_IOT_RATING"]),
	                                    preIotINT16Score: _.str.clean(v["IOT_P_RATING"]),
	                                    preWwINT16Score: _.str.clean(v["WW_IOT_P_RATING"])
	                                }
	                            });
                        		
                        		var countryCognitiveData = result[0].filter(function(item){
            							return _.str.clean(item["CONSTITUENTS_ORDER"]) == 1 || _.str.clean(item["CONSTITUENTS_ORDER"]) == 11;	
                        		}).map(function (v, k) {
                    				return {
                    					iotName: _.str.clean(v["IOT_NAME"]),
                    					countryName: _.str.clean(v["COUNTRY_NAME"]),
                    					constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]) == 1?3:13,
                    					constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()) + ' - Cognitive',
                    					column: _.str.clean(v["COLUMN"]),
                    					sequence: _.str.clean(v["SEQUENCE"]),
                    					metricCode: _.str.clean(v["METRIC_CODE"]),
                    					displayName: _.str.clean(v["DISPLAY_NAME"]),
                    					camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
                    					shortName: _.str.clean(v["SHORT_NAME"]),
                    					camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
                    					rating: _.str.clean(v["COGNITIVE_RATING"]),
                    					preRating: _.str.clean(v["COGNITIVE_P_RATING"]),
                    					colorScore: _.str.clean(v["COGNITIVE_COLOR_SCORE"]),
                    					preColorScore: _.str.clean(v["COGNITIVE_P_COLOR_SCORE"]),
                    					topCompany: _.str.clean(v["COGNITIVE_TOP_COMPANY_NAME"]),
                    					ibmRanking: _.str.clean(v["COGNITIVE_IBM_RANKING"]),
//                    					Grey out Employee Information
//                    					empRating: _.str.clean(v["EMP_RATING"]),
                    					empRating: null,
                    					year: _.str.clean(v["YEAR"]),
                    					year: _.str.clean(v["YEAR"]),
                    					month: _.str.clean(v["MONTH"]),
                    					quarter: _.str.clean(v["QUARTER"]),
                    					week: _.str.clean(v["WEEK"]),
                    					datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
                    					iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
                    					wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
                    					devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
                    					devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
                    					iotINT16Score: null,
	                                    wwINT16Score: null,
	                                    preIotINT16Score: null,
	                                    preWwINT16Score: null
                    					}
                        		});
                        		
                        		var countryCloudData = result[0].filter(function(item){
                						return _.str.clean(item["CONSTITUENTS_ORDER"]) == 1 || _.str.clean(item["CONSTITUENTS_ORDER"]) == 11;	
	                            }).map(function (v, k) {
                        				return {
                        					iotName: _.str.clean(v["IOT_NAME"]),
                        					countryName: _.str.clean(v["COUNTRY_NAME"]),
                        					constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]) == 1?3:13,
                        					constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()) + ' - Cloud',
                        					column: _.str.clean(v["COLUMN"]),
                        					sequence: _.str.clean(v["SEQUENCE"]),
                        					metricCode: _.str.clean(v["METRIC_CODE"]),
                        					displayName: _.str.clean(v["DISPLAY_NAME"]),
                        					camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
                        					shortName: _.str.clean(v["SHORT_NAME"]),
                        					camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
                        					rating: _.str.clean(v["CLOUD_RATING"]),
                        					preRating: _.str.clean(v["CLOUD_P_RATING"]),
                        					colorScore: _.str.clean(v["CLOUD_COLOR_SCORE"]),
                        					preColorScore: _.str.clean(v["CLOUD_P_COLOR_SCORE"]),
                        					topCompany: _.str.clean(v["CLOUD_TOP_COMPANY_NAME"]),
                        					ibmRanking: _.str.clean(v["CLOUD_IBM_RANKING"]),
//                        					Grey out Employee Information
//                        					empRating: _.str.clean(v["EMP_RATING"]),
                        					empRating: null,
                        					year: _.str.clean(v["YEAR"]),
                        					month: _.str.clean(v["MONTH"]),
                        					quarter: _.str.clean(v["QUARTER"]),
                        					week: _.str.clean(v["WEEK"]),
                        					datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
                        					iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
                        					wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
                        					devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
                        					devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
                        					iotINT16Score: null,
    	                                    wwINT16Score: null,
    	                                    preIotINT16Score: null,
    	                                    preWwINT16Score: null
                        				}
	                            });
                        		
                        		var countryAnalyticsData = result[0].filter(function(item){
                						return _.str.clean(item["CONSTITUENTS_ORDER"]) == 1 || _.str.clean(item["CONSTITUENTS_ORDER"]) == 11;	
	                            }).map(function (v, k) {
                        				return {
                        					iotName: _.str.clean(v["IOT_NAME"]),
                        					countryName: _.str.clean(v["COUNTRY_NAME"]),
                        					constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]) == 1?3:13,
                        					constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()) + ' - Analytics',
                        					column: _.str.clean(v["COLUMN"]),
                        					sequence: _.str.clean(v["SEQUENCE"]),
	                                    	metricCode: _.str.clean(v["METRIC_CODE"]),
	                                    	displayName: _.str.clean(v["DISPLAY_NAME"]),
                        					camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
	                                    	shortName: _.str.clean(v["SHORT_NAME"]),
	                                    	camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
	                                    	rating: _.str.clean(v["ANALYTICS_RATING"]),
	                                    	preRating: _.str.clean(v["ANALYTICS_P_RATING"]),
	                                    	colorScore: _.str.clean(v["ANALYTICS_COLOR_SCORE"]),
	                                    	preColorScore: _.str.clean(v["ANALYTICS_P_COLOR_SCORE"]),
	                                    	topCompany: _.str.clean(v["ANALYTICS_TOP_COMPANY_NAME"]),
	                                    	ibmRanking: _.str.clean(v["ANALYTICS_IBM_RANKING"]),
//	                                    	Grey out Employee Information
//	                                    	empRating: _.str.clean(v["EMP_RATING"]),
	                                    	empRating: null,
	                                    	year: _.str.clean(v["YEAR"]),
	                                    	month: _.str.clean(v["MONTH"]),
	                                    	quarter: _.str.clean(v["QUARTER"]),
	                                    	week: _.str.clean(v["WEEK"]),
	                                    	datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
	                                    	iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
	                                    	devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
	                                    	iotINT16Score: null,
		                                    wwINT16Score: null,
		                                    preIotINT16Score: null,
		                                    preWwINT16Score: null
	                                	}
	                            });
                        		
                        		var countryMobileData = result[0].filter(function(item){
                						return _.str.clean(item["CONSTITUENTS_ORDER"]) == 1 || _.str.clean(item["CONSTITUENTS_ORDER"]) == 11;	
	                            }).map(function (v, k) {
                        				return {
                        					iotName: _.str.clean(v["IOT_NAME"]),
                        					countryName: _.str.clean(v["COUNTRY_NAME"]),
                        					constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]) == 1?4:14,
                                        	constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()) + ' - Mobile',
                        					column: _.str.clean(v["COLUMN"]),
                        					sequence: _.str.clean(v["SEQUENCE"]),
	                                    	metricCode: _.str.clean(v["METRIC_CODE"]),
	                                    	displayName: _.str.clean(v["DISPLAY_NAME"]),
                        					camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
	                                    	shortName: _.str.clean(v["SHORT_NAME"]),
	                                    	camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
	                                    	rating: _.str.clean(v["MOBILE_RATING"]),
	                                    	preRating: _.str.clean(v["MOBILE_P_RATING"]),
	                                    	colorScore: _.str.clean(v["MOBILE_COLOR_SCORE"]),
	                                    	preColorScore: _.str.clean(v["MOBILE_P_COLOR_SCORE"]),
	                                    	topCompany: _.str.clean(v["MOBILE_TOP_COMPANY_NAME"]),
	                                    	ibmRanking: _.str.clean(v["MOBILE_IBM_RANKING"]),
//	                                    	Grey out Employee Information
//	                                    	empRating: _.str.clean(v["EMP_RATING"]),
	                                    	empRating: null,
	                                    	year: _.str.clean(v["YEAR"]),
	                                    	month: _.str.clean(v["MONTH"]),
	                                    	quarter: _.str.clean(v["QUARTER"]),
	                                    	week: _.str.clean(v["WEEK"]),
	                                    	datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
	                                    	iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
	                                    	devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
	                                    	iotINT16Score: null,
		                                    wwINT16Score: null,
		                                    preIotINT16Score: null,
		                                    preWwINT16Score: null
                        				}
	                            });
                        		
                        		var countrySocialData = result[0].filter(function(item){
                						return _.str.clean(item["CONSTITUENTS_ORDER"]) == 1 || _.str.clean(item["CONSTITUENTS_ORDER"]) == 11;	
	                            }).map(function (v, k) {
                        				return {
                        					iotName: _.str.clean(v["IOT_NAME"]),
                        					countryName: _.str.clean(v["COUNTRY_NAME"]),
                        					constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]) == 1?5:15,
                                			constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()) + ' - Social',
                        					column: _.str.clean(v["COLUMN"]),
                        					sequence: _.str.clean(v["SEQUENCE"]),
	                                    	metricCode: _.str.clean(v["METRIC_CODE"]),
	                                    	displayName: _.str.clean(v["DISPLAY_NAME"]),
                        					camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
	                                    	shortName: _.str.clean(v["SHORT_NAME"]),
	                                    	camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
	                                    	rating: _.str.clean(v["SOCIAL_RATING"]),
	                                    	preRating: _.str.clean(v["SOCIAL_P_RATING"]),
	                                    	colorScore: _.str.clean(v["SOCIAL_COLOR_SCORE"]),
	                                    	preColorScore: _.str.clean(v["SOCIAL_P_COLOR_SCORE"]),
	                                    	topCompany: _.str.clean(v["SOCIAL_TOP_COMPANY_NAME"]),
	                                    	ibmRanking: _.str.clean(v["SOCIAL_IBM_RANKING"]),
//	                                    	Grey out Employee Information
//	                                    	empRating: _.str.clean(v["EMP_RATING"]),
	                                    	empRating: null,
	                                    	year: _.str.clean(v["YEAR"]),
	                                    	month: _.str.clean(v["MONTH"]),
	                                    	quarter: _.str.clean(v["QUARTER"]),
	                                    	week: _.str.clean(v["WEEK"]),
	                                    	datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
	                                    	iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
	                                    	devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
	                                    	iotINT16Score: null,
		                                    wwINT16Score: null,
		                                    preIotINT16Score: null,
		                                    preWwINT16Score: null
                        				}
	                            });
                        		
                        		var countrySecurityData = result[0].filter(function(item){
                						return _.str.clean(item["CONSTITUENTS_ORDER"]) == 1 || _.str.clean(item["CONSTITUENTS_ORDER"]) == 11;	
	                            }).map(function (v, k) {
                        				return {
                        					iotName: _.str.clean(v["IOT_NAME"]),
                        					countryName: _.str.clean(v["COUNTRY_NAME"]),
                        					constituentsOrder: _.str.clean(v["CONSTITUENTS_ORDER"]) == 1?6:16,
                        					constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()) + ' - Security',
                        					column: _.str.clean(v["COLUMN"]),
                        					sequence: _.str.clean(v["SEQUENCE"]),
	                                    	metricCode: _.str.clean(v["METRIC_CODE"]),
	                                    	displayName: _.str.clean(v["DISPLAY_NAME"]),
                        					camsDisplayName: _.str.clean(v["CAMS_DISPLAY_NAME"]),
	                                    	shortName: _.str.clean(v["SHORT_NAME"]),
	                                    	camsShortName: _.str.clean(v["CAMSS_SHORT_NAME"]),
	                                    	rating: _.str.clean(v["SECURITY_RATING"]),
	                                    	preRating: _.str.clean(v["SECURITY_P_RATING"]),
	                                    	colorScore: _.str.clean(v["SECURITY_COLOR_SCORE"]),
	                                    	preColorScore: _.str.clean(v["SECURITY_P_COLOR_SCORE"]),
	                                    	topCompany: _.str.clean(v["SECURITY_TOP_COMPANY_NAME"]),
	                                    	ibmRanking: _.str.clean(v["SECURITY_IBM_RANKING"]),
//	                                    	Grey out Employee Information
//	                                    	empRating: _.str.clean(v["EMP_RATING"]),
	                                    	empRating: null,
	                                    	year: _.str.clean(v["YEAR"]),
	                                    	month: _.str.clean(v["MONTH"]),
	                                    	quarter: _.str.clean(v["QUARTER"]),
	                                    	week: _.str.clean(v["WEEK"]),
	                                    	datePeriodType: _.str.titleize(_.str.clean(v["DATE_PERIOD_TYPE"])),
	                                    	iotWeighting: _.str.clean(v["IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	wwWeighting: _.str.clean(v["WW_WEIGHTINGS"]).slice(0,-1),
	                                    	devIotWeighting: _.str.clean(v["DEV_IOT_WEIGHTINGS"]).slice(0,-1),
	                                    	devWWWeighting: _.str.clean(v["DEV_WW_WEIGHTINGS"]).slice(0,-1),
	                                    	iotINT16Score: null,
		                                    wwINT16Score: null,
		                                    preIotINT16Score: null,
		                                    preWwINT16Score: null
                        				}
	                            });
	                            
	                            // 1,calculate IOT level data 
                        		var iotData = _.chain(countryData)
			                            .groupBy(function (e, i) {
			                                return e.iotName
			                            })
			                            .map(function(iotValue, iot) {
			                            	return facObj.getEachIotData(countryData, date, facObj, iotValue, 'IOT', iot);
			                            })
			                            .value();
                        		
                        		var iotCognitiveData = _.chain(countryCognitiveData)
	                            .groupBy(function (e, i) {
	                                return e.iotName
	                            })
	                            .map(function(iotValue, iot) {
	                            	return facObj.getEachIotData(countryCognitiveData, date, facObj, iotValue, 'IOT', iot);
	                            })
	                            .value();
                        		
                        		var iotCloudData = _.chain(countryCloudData)
	                            .groupBy(function (e, i) {
	                                return e.iotName
	                            })
	                            .map(function(iotValue, iot) {
	                            	return facObj.getEachIotData(countryCloudData, date, facObj, iotValue, 'IOT', iot);
	                            })
	                            .value();
                        		
                        		var iotAnalyticsData = _.chain(countryAnalyticsData)
	                            .groupBy(function (e, i) {
	                                return e.iotName
	                            })
	                            .map(function(iotValue, iot) {
	                            	return facObj.getEachIotData(countryAnalyticsData, date, facObj, iotValue, 'IOT', iot);
	                            })
	                            .value();
                        		
                        		var iotMobileData = _.chain(countryMobileData)
	                            .groupBy(function (e, i) {
	                                return e.iotName
	                            })
	                            .map(function(iotValue, iot) {
	                            	return facObj.getEachIotData(countryMobileData, date, facObj, iotValue, 'IOT', iot);
	                            })
	                            .value();
                        		
                        		var iotSocialData = _.chain(countrySocialData)
	                            .groupBy(function (e, i) {
	                                return e.iotName
	                            })
	                            .map(function(iotValue, iot) {
	                            	return facObj.getEachIotData(countrySocialData, date, facObj, iotValue, 'IOT', iot);
	                            })
	                            .value();
                        		
                        		var iotSecurityData = _.chain(countrySecurityData)
	                            .groupBy(function (e, i) {
	                                return e.iotName
	                            })
	                            .map(function(iotValue, iot) {
	                            	return facObj.getEachIotData(countrySecurityData, date, facObj, iotValue, 'IOT', iot);
	                            })
	                            .value();
                        		
                        		// 1,calculate WW level data 
                        		var wwData = facObj.getEachIotData(countryData, date, facObj, countryData, 'WW');
                        		var wwCognitiveData = facObj.getEachIotData(countryCognitiveData, date, facObj, countryCognitiveData, 'WW');
                        		var wwCloudData = facObj.getEachIotData(countryCloudData, date, facObj, countryCloudData, 'WW');
                        		var wwAnalyticsData = facObj.getEachIotData(countryAnalyticsData, date, facObj, countryAnalyticsData, 'WW');
                        		var wwMobileData = facObj.getEachIotData(countryMobileData, date, facObj, countryMobileData, 'WW');
                        		var wwSocialData = facObj.getEachIotData(countrySocialData, date, facObj, countrySocialData, 'WW');
                        		var wwSecurityData = facObj.getEachIotData(countrySecurityData, date, facObj, countrySecurityData, 'WW');
                        		
                        		// 2,add a new function to retrieve the security profile for a user to control the authorization in the program xmt 2015.8.20 17:15 
                        		var wwIotData = _.chain(iotData.concat(wwData)).flatten().value();
                        		var wwIotCognitiveData = _.chain(iotCognitiveData.concat(wwCognitiveData)).flatten().value();
                        		var wwIotCloudData = _.chain(iotCloudData.concat(wwCloudData)).flatten().value();
                        		var wwIotAnalyticsData = _.chain(iotAnalyticsData.concat(wwAnalyticsData)).flatten().value();
                        		var wwIotMobileData = _.chain(iotMobileData.concat(wwMobileData)).flatten().value();
                        		var wwIotSocialData = _.chain(iotSocialData.concat(wwSocialData)).flatten().value();
                        		var wwIotSecurityData = _.chain(iotSecurityData.concat(wwSecurityData)).flatten().value();
                        		
                        		var data = countryData.concat(wwIotData)
			                        		.filter(function(item){
			                        			return result[1].some(function(elem){	
			                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
				                        				});
			                        		})
		                        			.filter(function(item){
			                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
			                        		});
                        		
                        		var cognitiveData = countryCognitiveData.concat(wwIotCognitiveData)
                        		.filter(function(item){
                        			return result[1].some(function(elem){	
                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
	                        				});
                        		})
                    			.filter(function(item){
                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
                        		});
                        		
                        		var cloudData = countryCloudData.concat(wwIotCloudData)
                        		.filter(function(item){
                        			return result[1].some(function(elem){	
                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
	                        				});
                        		})
                    			.filter(function(item){
                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
                        		});
                        		
                        		var analyticsData = countryAnalyticsData.concat(wwIotAnalyticsData)
                        		.filter(function(item){
                        			return result[1].some(function(elem){	
                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
	                        				});
                        		})
                    			.filter(function(item){
                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
                        		});
                        		
                        		var mobileData = countryMobileData.concat(wwIotMobileData)
                        		.filter(function(item){
                        			return result[1].some(function(elem){	
                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
	                        				});
                        		})
                    			.filter(function(item){
                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
                        		});
                        		
                        		var socialData = countrySocialData.concat(wwIotSocialData)
                        		.filter(function(item){
                        			return result[1].some(function(elem){	
                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
	                        				});
                        		})
                    			.filter(function(item){
                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
                        		});
                        		
                        		var securityData = countrySecurityData.concat(wwIotSecurityData)
                        		.filter(function(item){
                        			return result[1].some(function(elem){	
                        						return item.metricCode == _.str.clean(elem.METRIC_CODE);	
	                        				});
                        		})
                    			.filter(function(item){
                        			  return (permissions.indexOf(item.countryName) > -1 || permissions.indexOf(item.iotName) > -1);
                        		});
	                            
                        		// xmt 2015.9.21 16:15 
                        		var countryModel = _.chain(data)
			    			                .groupBy(function (e, i) {
			    			                    return e.countryName;
			    			                })
			    			                .keys()
			    			                .value();
                        		
	                            // 3,build SJON data
		                        var constiGroupData = facObj.getConstiGroupData(data, countryModel, metricModel, facObj);
		                        var constiGroupCognitiveData = facObj.getConstiGroupData(cognitiveData, countryModel, metricModel, facObj);
		                        var constiGroupCloudData = facObj.getConstiGroupData(cloudData, countryModel, metricModel, facObj);
		                        var constiGroupAnalyticsData = facObj.getConstiGroupData(analyticsData, countryModel, metricModel, facObj);
		                        var constiGroupMobileData = facObj.getConstiGroupData(mobileData, countryModel, metricModel, facObj);
		                        var constiGroupSocialData = facObj.getConstiGroupData(socialData, countryModel, metricModel, facObj);
		                        var constiGroupSecurityData = facObj.getConstiGroupData(securityData, countryModel, metricModel, facObj);
		                        
		                        var constiGroupData = constiGroupData.concat(constiGroupCognitiveData, constiGroupCloudData, constiGroupAnalyticsData, constiGroupMobileData, constiGroupSocialData, constiGroupSecurityData);
		                        // xmt 2015.9.22 17:54 
		                        var sortOrder = {
		                                "Clients & Prospects":  0,
		                                "Clients & Prospects - Cognitive":  1,
		                                "Clients & Prospects - Cloud":  2,
		                                "Clients & Prospects - Analytics":  3,
		                                "Clients & Prospects - Mobile":  4,
		                                "Clients & Prospects - Social":  5,
		                                "Clients & Prospects - Security":  6,
		                                "Influencers": 11,
		                                "Influencers - Cognitive": 12,
		                                "Influencers - Cloud": 13,
		                                "Influencers - Analytics": 14,
		                                "Influencers - Mobile": 15,
		                                "Influencers - Social": 16,
		                                "Influencers - Security": 17,
		                                "Developers": 20,
		                                "Employees": 21
		                        };
		                        
		                        constiGroupData.sort(function (a,b){ 
			            			return (sortOrder[a.constituent] < sortOrder[b.constituent]) ? -1 : 1;
			            		});
		                        
		                        return constiGroupData;
		                    }, 
		                    function (error) {
		                        throw error;
		                    }
		                );
            },
            
            getEachIotData: function(countryData, date, facObj, iotValue, level, iotName){
            	var weighting = "iotWeighting";
		    	if(level == 'WW') {
		    		weighting = "wwWeighting";
		    		iotName = 'WW';
		    	}
		    	
            	var eachIotMetric = {
            			iotName: null,
                    	countryName: iotName,
                        constituents: null,
                        column: null,
                        sequence: null,
                        metricCode: null,
                        score: null,
                        preScore: null,
                        displayName: null,
                        camsDisplayName: null,
                        shortName: null,
                        camsShortName: null,
                        rating: null,
                        preRating: null,
                        year: null,
                        month: null,
                        quarter: null,
                        datePeriodType: null
					  };
            	
            	var eachIotData = _.chain(iotValue)
					    .groupBy(function (e, i) {
					        return e.constituents;
					    })
					    .map(function (constiValue, consti) {
					    	// xmt 2015.9.15 13:56
					    	if(consti == 'Developers'){
					    		if(level == 'WW') {
					    			weighting = "devWWWeighting";
					    		} else {
					    			weighting = "devIotWeighting";
					    		}
					    	}
					    	
//					    	var iotBHS = null;
//					    	var iotPreBHS = null;
					    	
					    	if(consti != "Employees") {
						    	var eachCountryBHSGroup = _.chain(constiValue)
								    	.filter(function (e) {
		                                    return e.sequence == 1;
		                                })
									    .groupBy(function (e, i) {
									        return e.countryName;
									    })
									    .map(function (countryValue, country) {
									    	var eachCountryBHS = countryValue[0].score;
									    	var eachCountryPreBHS = countryValue[0].preScore;
									    	
									    	if(level == 'IOT') {
									    		eachCountryBHS = countryValue.reduce(function(prev, curr) {
//									    			if(isNaN(parseInt(curr.colorScore))){
//									    				return prev;
//									    			} else {
//									    				return prev + Number(curr.colorScore);
//									    			}
									    			var newObj = {
									    							obj:curr,
									    							value:null
									    						 };
									    			if(isNaN(parseInt(curr.colorScore))){
									    				return prev?prev:newObj;
									    			} else {
									    				if(prev && prev.obj.column == curr.column && prev.obj.countryName == curr.countryName){
									    					return prev?prev:newObj;
									    				}else{
										    				newObj.value = Number(prev&&prev.value!==''?prev.value:0) + Number(curr.colorScore);
										    				return newObj;
									    				}
									    			}
									    		}, null).value;
									    		
									    		eachCountryPreBHS = countryValue.reduce(function(prev, curr) {
//									    			if(isNaN(parseInt(curr.preColorScore))){
//									    				return prev;
//									    			} else {
//									    				return prev + Number(curr.preColorScore);
//									    			}
									    			var newObj = {
									    							obj:curr,
									    							value:null
									    						 };
									    			if(isNaN(parseInt(curr.preColorScore))){
									    				return prev?prev:newObj;
									    			} else {
									    				if(prev && prev.obj.column == curr.column && prev.obj.countryName == curr.countryName){
									    					return prev?prev:newObj;
									    				}else{
									    					newObj.value = Number(prev&&prev.value!==''?prev.value:0) + Number(curr.preColorScore);
									    					return newObj;
									    				}
									    			}
									    		}, null).value;
									    		
									    		// xmt 2015.8.21 18:47
									    		countryData.forEach(function(item) {
									    			if(item.countryName == country && item.constituents == consti) {
									    				item.score = eachCountryBHS;
									    				item.preScore = eachCountryPreBHS;
									    			}
									    		});
									    	}
									    	
//									    	if(eachCountryBHS != null) {
//									    		iotBHS = (iotBHS || 0) + eachCountryBHS * Number(countryValue[0][weighting]) / 100;
//									    	}
//									    	if(eachCountryPreBHS != null) {
//									    		iotPreBHS = (iotPreBHS || 0) + eachCountryPreBHS * Number(countryValue[0][weighting]) / 100;
//									    	}
									    })
									    .value();
					    	}	    
							eachIotMetric.constituents = consti;
							eachIotMetric.score = null;
							eachIotMetric.preScore = null 
							
							var iotEachConstiMetrics = _.chain(constiValue)
			    			        .groupBy(function (e, i) {
			    			            return e.column;
			    			        })
			    			        .map(function (columnValue, column) {
			    			        	eachIotMetric.column = column;
			    			        	
			    			        	var iotEachColumnMetrics = _.chain(columnValue)
											    .groupBy(function (e, i) {
											        return e.sequence;
											    }).map(function (sequenceValue, sequence) {
											    	var currIotMetric = angular.extend({}, eachIotMetric);
											    	var iotColorScore = null;
											    	var iotPreColorScore = null;
											    	var weightDenominator  = 100;
											    	
											    	if(consti != "Employees") {
											    		var arrayValue = [];
//											    		
											    		var isTakenOut = sequenceValue.every(function(item){
											    			return (item.rating != null && item.rating != "" && item.rating != 0) || (item.colorScore != null && item.colorScore != "");
											    		});
											    		if(!isTakenOut){
											    			arrayValue = sequenceValue.filter(function(item){
												    			return (item.rating != null && item.rating != "" && item.rating != 0) || (item.colorScore != null && item.colorScore != "");
												    		});
											    			if(arrayValue.length != 0) sequenceValue = arrayValue;
											    			weightDenominator = arrayValue.reduce(function(pre, cur){
												    			return Number(pre) + Number(cur[weighting]);
												    		}, 0);
											    		}else if(sequenceValue.length == 1 || 
												    			  (sequenceValue.length == 2 && 
												    			sequenceValue[0].metricCode == sequenceValue[1].metricCode &&
												    			sequenceValue[0].countryName == sequenceValue[1].countryName)){
												    			weightDenominator = sequenceValue[0][weighting];
												    	} 
//											    		if(['INT2', 'INT3', 'INT4', 'INT5'].indexOf(sequenceValue[0].metricCode) > -1){
//											    		if(arrayValue.length == 1 || 
//											    			  (arrayValue.length == 2 && 
//											    			   arrayValue[0].metricCode == arrayValue[1].metricCode &&
//											    			   arrayValue[0].countryName == arrayValue[1].countryName)){
//											    			sequenceValue = arrayValue;
//											    			sequenceValue[0][weighting] = '100';
//											    		} 
//											    		}
											    		
												    	iotColorScore = sequenceValue[0].metricCode == 'INT16'? facObj.getColorScoreByRating(level == 'WW' ? sequenceValue[0].wwINT16Score : sequenceValue[0].iotINT16Score) : sequenceValue.reduce(function(prev, curr) {
															    		var newObj = {
												    							obj:curr,
												    							value:null
												    						 };
															    		if(isNaN(parseInt(curr.colorScore))){
															    			return prev?prev:newObj;
															    		} else {
															    			if(prev && prev.obj.countryName == curr.countryName){
															    				return prev?prev:newObj;
															    			}else{
															    				newObj.value = Number(prev&&prev.value!==''?prev.value:0) + Number(curr.colorScore)* Number(curr[weighting]) / weightDenominator;
															    				return newObj;
															    			}
															    		}
														    		}, null).value;
												    	
												    	iotPreColorScore = sequenceValue[0].metricCode == 'INT16'? facObj.getColorScoreByRating(level == 'WW' ? sequenceValue[0].preWwINT16Score : sequenceValue[0].preIotINT16Score) : sequenceValue.reduce(function(prev, curr) {
															    		var newObj = {
												    							obj:curr,
												    							value:null
												    						 };
															    		if(isNaN(parseInt(curr.preColorScore))){
															    			return prev?prev:newObj;
															    		} else {
															    			if(prev && prev.obj.countryName == curr.countryName){
															    				return prev?prev:newObj;
															    			}else{
															    				newObj.value = Number(prev&&prev.value!==''?prev.value:0) + Number(curr.preColorScore)* Number(curr[weighting]) / weightDenominator;
															    				return newObj;
															    			}
															    		}
															    	}, null).value;
												    	
												    		currIotMetric.colorScore = (iotColorScore == null ? null : Math.round(iotColorScore));
												    		currIotMetric.preColorScore = (iotPreColorScore == null ? null : Math.round(iotPreColorScore));
												    		currIotMetric.unRoundColorScore = (iotColorScore == null ? null : iotColorScore);
												    		currIotMetric.unRoundPreColorScore = (iotPreColorScore == null ? null : iotPreColorScore);
												    		currIotMetric.rating = facObj.getRatingByColorScore(currIotMetric.colorScore);
												    		currIotMetric.preRating = facObj.getRatingByColorScore(currIotMetric.preColorScore);
							        					// xmt 2015.9.17 12:11
//												    	var specailMetrics = ["INT2", "INT3", "INT4", "INT5", "INT6"];
//									                    if(specailMetrics.indexOf(sequenceValue[0].metricCode) == -1) {
//								        					var result = sequenceValue.every(function(item){
//																return (item.rating == null || item.rating == "" || item.rating == 0) && (item.colorScore == null || item.colorScore == "" || item.colorScore == 0);
//															});
//								        					if(result) {
//								        						currIotMetric.rating = null;
//								        						currIotMetric.preRating = null;
//								        					}
//									                    }
//									                    var specailMetrics_1 = ["CEM1", "CEM5", "INT2", "INT3", "INT4", "INT5", "INT6"];
//							        					if(specailMetrics_1.indexOf(sequenceValue[0].metricCode) != -1) {
//										                    if(specailMetrics.indexOf(sequenceValue[0].metricCode) > -1)
//										                    	currIotMetric.rating = (currIotMetric.rating == 2 ? 0 : currIotMetric.rating);
//										                    	currIotMetric.preRating = (currIotMetric.preRating == 2 ? 0 : currIotMetric.preRating);
////										                    currIotMetric.preRating = null;
//							        					}
//									                    else {
									                    	var result = sequenceValue.every(function(item){
																return (item.rating == null || item.rating === "" || item.rating === 0) && (item.colorScore == null || item.colorScore === "");
															});
									                    	if(result) {
									                    		currIotMetric.rating = null;
									                    		currIotMetric.preRating = null;
									                    	}
//									                    }
							        					
											    	}
											    	
											    	currIotMetric.sequence = sequence;
											    	currIotMetric.metricCode = sequenceValue[0].metricCode;
											    	currIotMetric.displayName = sequenceValue[0].displayName;
											    	currIotMetric.camsDisplayName = sequenceValue[0].camsDisplayName;
											    	currIotMetric.shortName = sequenceValue[0].shortName;
											    	currIotMetric.camsShortName = sequenceValue[0].camsShortName;
											    	currIotMetric.datePeriodType = sequenceValue[0].datePeriodType;
											    	currIotMetric.year = date.endDate.year;
											    	currIotMetric.month = date.endDate.month;
											    	
											    	return currIotMetric;
											    })
											    .value();
											    
										return iotEachColumnMetrics;
			    			        })
			    			        .value();
			    			        
			    			return iotEachConstiMetrics;
					    })
					    .value();
            	
//            	// xmt 2015.9.22 14:53
//            	if(eachIotData.length != 4 && eachIotData[0][0][0].countryName != 'Japan') {
//            		if(!(eachIotData.length == 1 && eachIotData[0].constituent != "Clients & Prospects")){
//            			var constituentModel = ["Clients & Prospects", "Influencers", "Developers", "Employees"];
//            			var currIotConstituentData = eachIotData.map(function(item) {
//							            			return item[0][0].constituents ;
//							            		})
//							            		
//					    constituentModel.forEach(function (elem,index) {
//					    	if(currIotConstituentData.indexOf(elem) == -1) {
//					    		eachIotData.push([[{"iotName":null, "countryName":iotName, "constituents":elem, "metricCode":"BHM1"}]]);
//					    	}
//					    })
//            		}
//            	}
            	
            	return eachIotData;
            },
            
            getRatingByColorScore: function(colorScore){
            	var iotRating = null;
            	if(colorScore !== '' && colorScore == 1) {
		    		iotRating = 1;
		    	} else if(colorScore !== '' && colorScore != null && colorScore == 0) {
		    		iotRating = 2;
		    	} else if(colorScore !== '' && colorScore == -1) {
		    		iotRating = 3;
		    	} 
            	
            	return iotRating;
            },
            
            getColorScoreByRating: function(rating){
            	var colorScore = null;
            	if(rating !== '' && rating == 1) {
            		colorScore = 1;
		    	} else if(rating !== '' && rating == 2) {
		    		colorScore = 0;
		    	} else if(rating !== '' && rating == 3) {
		    		colorScore = -1;
		    	} 
            	
            	return colorScore;
            },
            
        	getChildren: function(eachIot, currIotCountryData, metricModel, facObj){
            	var countryGroupData = _.chain(currIotCountryData)
			                .groupBy(function (e, i) {
			                    return e.countryName;
			                })
			                .map(function (countryValue, country) {
						    		var eachCountry = {
														"countryName":country,											
														"scores": {
															"score": null,
													        "preScore":null,
													        "range":null
												        },
														"segments":[],																													
													  };
						    		facObj.getSegments(eachCountry, countryValue, metricModel, facObj);
					                
			                		return eachCountry;																				
							})
			                .value();
                
            	eachIot.children = countryGroupData;
            	eachIot.children.sort(function (a,b){ 
        			return a.countryName < b.countryName ? -1 : 1;
        		});
            },
            
            getSegments: function(eachGeogaphy, geogaphyValue, metricModel, facObj){		
            	var columnMetrics = _.chain(metricModel)
            			.filter(function(elem){
                  			  	return elem.constituents.split(' ')[0] == geogaphyValue[0].constituents.split(' ')[0];
                    	})
                    	.groupBy(function (e, i) {
    			            return e.column;
    			        })
    			        .map(function (columnValue, column) {
    			        	var currColumnMetric = geogaphyValue.filter(function(elem){
                  			  	return column == elem.column;
                    		})
                    		
                    		var eachColumnMetrics = [];
    			        	columnValue.forEach(function (elem,index) {
    			        		var eachMetricResult = [];
    			        		currColumnMetric.forEach(function(item) {
    			        			if(elem.metricCode == item.metricCode && elem.displayName == item.displayName) {
	    			        			var eachMetric = {"displayName":facObj.getDisplayName(item), "camsDisplayName": facObj.getCamsDisplayName(item), "shortName":item.shortName, "camsShortName":item.camsShortName, "rating":item.rating, "preRating":item.preRating, "range":null};
				        				if(item.iotName != null) {
				        					eachMetric.range = utils.getPeriodRange(item.datePeriodType, item.year, item.month, item.quarter, item.week);
				        					
				        					eachMetric.topCompany = item.topCompany;
				        					eachMetric.ibmRanking = item.ibmRanking;
				        					
				        					// xmt 2015.8.18 16:10
				        					if(item.constituents == "Employees" ) {
				        						eachMetric.rating = item.empRating;
				        					}
				        					
				        					if(item.constituents == "Employees" && item.sequence == 0){
				        						eachGeogaphy.scores.score = item.empRating;
				        						eachGeogaphy.scores.preScore = null;
				        						eachGeogaphy.scores.displayName = item.displayName;
				        						eachGeogaphy.scores.camsDisplayName = item.camsDisplayName;
				        						eachGeogaphy.scores.shortName = item.shortName;
				        						eachGeogaphy.scores.camsShortName = item.camsShortName;
				        						eachGeogaphy.scores.range = eachMetric.range;
				        					}
				        					
				        					// xmt 2015.9.2 18:02
				        					var specailMetrics = ["CEM1", "CEM5", "INT2", "INT3", "INT4", "INT5", "INT6", "INT12"];
				        					if(specailMetrics.indexOf(item.metricCode) != -1) {
				        						eachMetric.rating = facObj.getRatingByColorScore(item.colorScore);
				        						eachMetric.preRating = facObj.getRatingByColorScore(item.preColorScore);
//				        						var specailMetrics = ["INT2", "INT3", "INT4", "INT5", "INT6"];
//							                    if(specailMetrics.indexOf(item.metricCode) > -1)
//				        							eachMetric.rating = (eachMetric.rating == 2 ? 0 : eachMetric.rating);
//				        						
//				        							eachMetric.preRating = (eachMetric.preRating == 2 ? 0 : eachMetric.preRating);
				        					}
				        					
				        				}
				        				
				        				if(item.constituents == "Employees" && item.sequence == 0){
				        					eachMetric.constituents = item.constituents;
				        					eachMetric.sequence = item.sequence;
				        				}
				        				
				        				eachMetricResult.push(eachMetric);
    			        			} 
    			        		});
    			        		
    			        		if(eachMetricResult.length > 0){
    			        			if(!(eachMetricResult[0].constituents == "Employees" && eachMetricResult[0].sequence == 0))
    			        				eachColumnMetrics.push(eachMetricResult[0]);
    			        		} else {
    			        			eachColumnMetrics.push({"displayName":facObj.getDisplayName(elem), "camsDisplayName": facObj.getCamsDisplayName(elem), "shortName":elem.shortName, "camsShortName":elem.camsShortName, "rating":null, "preRating":null, "range":null});
			        			}
    			        		
                    		});
    			        	
    			        	return {"metrics":eachColumnMetrics};
    			        })
    			        .value();
        		
        		eachGeogaphy.segments = columnMetrics;        
        		if(geogaphyValue[0].constituents != "Employees") {
        			var isAvailableBHS = false;
        			var isAvailablePreBHS = false;
        			
        			geogaphyValue.forEach(function(elem){
        				if(elem.sequence == '1' && elem.rating != null && elem.rating != 0) isAvailableBHS = true;
        				if(elem.sequence == '1' && elem.preRating != null && elem.preRating != 0) isAvailablePreBHS = true;
        			});
        			
        			var outComeArray = geogaphyValue.filter(function(elem){
        				return elem.sequence == '1' && elem.iotName == null && elem.rating != null && elem.rating != 0;
        			});
        			
        			eachGeogaphy.scores.score = outComeArray.length > 0 ? Math.round(outComeArray.reduce(function(pre, cur){
        				if(isNaN(pre)) return cur.unRoundColorScore||0;
        				if(cur && !isNaN(cur.unRoundColorScore)){
        					return pre + (cur.unRoundColorScore||0);
        				}else{
        					return pre;
        				}
        			}, null)*10)/10 : (isAvailableBHS ? geogaphyValue[0].score : null);
        			eachGeogaphy.scores.preScore = outComeArray.length > 0 ? Math.round(outComeArray.reduce(function(pre, cur){
        				if(isNaN(pre)) return cur.unRoundPreColorScore||0;
        				if(cur && !isNaN(cur.unRoundPreColorScore)){
        					return pre + (cur.unRoundPreColorScore||0);
        				}else{
        					return pre;
        				}
        			}, null)*10)/10 : (isAvailablePreBHS ? geogaphyValue[0].preScore : null);
        		}
            },
            
            getDisplayName: function(item){
            	var displayName = item.displayName;
            	// xmt 2015.8.5 11:58
    			if(item.sequence == 1) {
        			if(item.column == 1) { 
        				displayName = "Belief " + item.displayName;
        			} else if(item.column == 2) {
        				displayName = "Action " + item.displayName;
        			} else {
        				displayName = "Advocacy " + item.displayName;
        			}
    			}
    			
    			return displayName;
            },
            
            getCamsDisplayName: function(item){
            	var displayName = item.camsDisplayName;
            	// xmt 2015.8.5 11:58
    			if(item.sequence == 1) {
        			if(item.column == 1) { 
        				displayName = "Belief " + item.camsDisplayName;
        			} else if(item.column == 2) {
        				displayName = "Action " + item.camsDisplayName;
        			} else {
        				displayName = "Advocacy " + item.camsDisplayName;
        			}
    			}
    			
    			return displayName;
            },
            
            getConstiGroupData: function(data, countryModel, metricModel, facObj){
//            	var facObj = this;
            	return _.chain(data)
                .groupBy(function (e, i) {
                    return e.constituents
                })
                .map(function(v,k) {
                	// xmt 2015.9.21 16:15
                	var currConstiCountryData = _.chain(v)
			                .groupBy(function (e, i) {
			                    return e.countryName;
			                })
			                .keys()
			                .value();
                	
                	countryModel.forEach(function (elem,index) {
                		if(currConstiCountryData.indexOf(elem) == -1) {
                			var currCountryOtherData = data.filter(function(item) { 
                				return item.countryName == elem; 
                				});
                			v.push({"iotName":currCountryOtherData[0].iotName, "countryName":elem, "constituents":k});
                		}
                	})
                	
//                	v.sort(function (a,b){ 
//            			return (a.countryName == "WW") ? -1 : (b.countryName == "WW") ? 1 : (a.countryName < b.countryName) ? -1 : 1;
//            		});
                	
                	var eachConstituent = {
							constituent:k,					
							isOpen:false,						
							rows: []
						}
						
					var currConstiIotData = v.filter(function(item) { return item.iotName == null; });
					var currConstiCountryData = v.filter(function(item) { return item.iotName != null; });
					
					// complete IOT level
					var iotGroupData = _.chain(currConstiIotData)
						    .groupBy(function (e, i) {
						        return e.countryName;
						    })
						    .map(function (iotValue, iot) {
					    		var eachIot = {
												"countryName":iot,		
												"isOpen":false,	
												"scores": {
										          "score": null,
										          "preScore": null,
										          "range":null
										        },																													
												"segments":[],
												"children": []
											  };
					    		facObj.getSegments(eachIot, iotValue, metricModel, facObj);								    										    		
					        
						        var currIotCountryData = currConstiCountryData.filter(function(item) { return item.iotName == iot; });
						        facObj.getChildren(eachIot, currIotCountryData, metricModel, facObj);
						        
								return eachIot;
						    })    		
						    .value();
		
					// xmt 2015.7.27 10:12 separate country 
					var separateCountryData = currConstiCountryData.filter(function(item) { 
								var result = currConstiIotData.every(function(current){
									return item.iotName != current.countryName; 
								});
								
								return result;
					});	
					
					var iotGroupDataForSeparateCountry = _.chain(separateCountryData)
						    .groupBy(function (e, i) {
						        return e.iotName;
						    })
						    .map(function (iotValue, iot) {
					    		var eachIot = {
												"countryName":iot,		
												"isOpen":false,	
												"scores": {
										          "score": null,
										          "preScore": null,
										          "range": null
										        },																													
												"segments":[],
												"children": []
											  };
					    		
					    		facObj.getChildren(eachIot, iotValue, metricModel, facObj);
					    		
					    		var segments = angular.copy(eachIot.children[0].segments);
					    		segments.forEach(function (item) {
					    			item.metrics.forEach(function (current) {
					    				current.rating = null;
					    				delete current.preRating;
					    				delete current.range;
					    				delete current.topCompany;
					    				delete current.ibmRanking;
					    			});
					    		});
					    		eachIot.segments = segments;
					    		
					    		if(k == "Employees") eachIot.scores.displayName = eachIot.children[0].scores.displayName;
					    		
					    		return eachIot;
						    })    		
						    .value();	
					
            		eachConstituent.rows = iotGroupData;
            		eachConstituent.rows = eachConstituent.rows.concat(iotGroupDataForSeparateCountry);
            		eachConstituent.rows.sort(function (a,b){ 
            			return (a.countryName == "WW") ? -1 : (b.countryName == "WW") ? 1 : (a.countryName < b.countryName) ? -1 : 1;
            		});
            		return eachConstituent;									
				})
				.value(); 
            }
        }
        
	});
});