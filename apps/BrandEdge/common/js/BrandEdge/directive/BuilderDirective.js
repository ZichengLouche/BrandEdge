define(['BrandEdge/app'], function(app) {
	app.directive('beBuild', function($compile, $window, $timeout, Utility) {
	  return {
	    restrict: 'A',
	    priority: 20,
	    link: function(scope, el, at) {
	    	
	    	if (scope._captions == null) scope._captions = {};
	    	var width = el[0].offsetWidth;
	    	var height = el[0].offsetHeight;
	    	
	    	function update() {
	    		if (el.hasClass('be-hidden')) {
	    			el.removeClass('be-hidden');
	    		}
	    		if (!el.hasClass('col-lg-4')) {
		    		el.addClass('col-lg-4');	    		
		    	}
	    		
	    		var fontBase = (width+height)*0.5;
	    		if ((width > 700) || (height > 700)) {
	    			fontBase = (width>700)?width * .3:height * .3;
	    		}

	            var headerFontSize = (Math.round(fontBase*0.034));
	            var typeFontSize = (Math.round(fontBase*0.03));
	            var dateBottomSize = Math.round(typeFontSize*(-1.5));
	            
	    		var retVal = "";
				
	    		if (typeof scope.chartData != "undefined" && scope.chartData != null && typeof scope.chartData[at.beBuild] != "undefined" && scope.chartData[at.beBuild] != null) {
	    			if (scope.chartData[at.beBuild].chartType == "stackedBar" || scope.chartData[at.beBuild].chartType == "bar") {
		    			retVal = "<div class=\"cp-outer-cell\">" +
		    					 	"<div class=\"cp-graph-block\">" +
		    					 		"<div style=\"text-overflow: ellipsis; overflow: hidden; \">" +
		    					 			"<div>" +
		    					 				"<div>" +
		    					 					"<div style=\"font-size: " + headerFontSize + "px;width:100%;\">" +
		    					 						"<div style='float:left;width:6%;margin: 0 0.5rem;' data-ng-bind-html=\"chartData." + at.beBuild + "['displayRating' + chartValueKey] | rating\"> </div>" +
		    					 						"<div style='float:left;width:85%' data-be-title-tooltip data-be-description='(([\"Cognitive\",\"Cloud\",\"Analytics\",\"Mobile\",\"Social\",\"Security\"].indexOf(chartValueKey)>-1) && (chartData." + at.beBuild + ".camssDisplay != null))?chartData." + at.beBuild + ".camssIcon:chartData." + at.beBuild + ".icon'>{{ ((['Cognitive','Cloud','Analytics','Mobile','Social','Security'].indexOf(chartValueKey)>-1) && (chartData." + at.beBuild + ".camssDisplay != null))?chartData." + at.beBuild + ".camssDisplay:chartData." + at.beBuild + ".title }} {{ parensWrap(chartData." + at.beBuild + "['displayRank' + chartValueKey]) }}</div>" +
		    					 					"</div>" +
		    					 				"</div>" +

												"<div ng-if=\"chartData."+at.beBuild+"['pdisplayShow' + chartValueKey]\" class=\"previous\" style=\"font-size: " + typeFontSize + "px;\">" +
													"<div style='float:left'>(previously</div>" +
													"<div class=\"prating\" data-ng-bind-html=\"chartData." + at.beBuild + "['pdisplayRating' + chartValueKey] | rating\"></div>" +
													"<div style='float:left'>{{ getAbbrvOrd(chartData." + at.beBuild + "['pdisplayRank' + chartValueKey]) }})</div>" +
												"</div>" +

		    					 				"<div class=\"period\" style=\"font-size: " + typeFontSize + "px;\">{{ chartData." + at.beBuild + ".period }}</div>" +
		    					 			"</div>" +
		    					 		"</div>" +
		    					 		"<div>" +
		    					 			"<div style=\"font-size: " + dateBottomSize + "px;\"> {{ chartData." + at.beBuild + ".range }} </div>" +
		    					 		"</div>" +
		    					 		"<div>" +
		    					 			"<div ng-click=\"sortClick('" + at.beBuild + "')\">" +
		    					 				"<img src=\"images/icons/options" + ((scope._sortFlag == true)?"-ranking":"") + "@1x.png\"/>" +
		    					 			"</div>" +
		    					 		"</div>";
		    			
		    			if ((scope.chartData != null) && (scope.chartData[at.beBuild] != null)) {	
		    				retVal +=   "<div ng-if=\"chartData."+at.beBuild+".szshow && chartData." + at.beBuild + ".caption['sampleSize' + currentFilter] != null\" style=\"font-family: HelvNeueLightforIBM; position: absolute; bottom: 19px; left: 10px; font-size: 10px; color: #979797; background-color: #ffffff; z-index: 5\"> " +
		    								"{{ chartData." + at.beBuild + ".caption['sampleSize' + currentFilter] }} " +
		    							"</div>";
						}
		    			
		    			// xmt 2015.6.17 18:00
		    			retVal     += 	"<div ng-if=\"chartData."+at.beBuild+".bshow\" style=\"font-family: HelvNeueLightforIBM; position: absolute; bottom: 2px; left:10px; font-size: 12px; z-index: 5\">" +
		    								"<img src=\"images/icons/LinkOuticon@1x.png\">" +
		    								"<a data-be-tooltip=\"" + at.beBuild+ "\" current-chart-data='chartData."+at.beBuild+"' target = \"_blank\" href=\" {{chartData."+at.beBuild+".detailurl}}\">" +
		    									"<span ng-if=\"chartData."+at.beBuild+".urlType == 'BERT'\">Access real time</span>" +
		    									"<span ng-if=\"chartData."+at.beBuild+".urlType == 'CRIT'\">Access MDI research</span>" +
		    								"</a>" +
		    							"</div>";
		    			
						retVal 	   +=   "<div style=\"width:100%; height: 80%;\" " +
											" data-be-bar-chart=\"" + scope.chartData[at.beBuild].chartType + "\"" +
											" data-be-chart-data=\"{series: chartData." + at.beBuild + ".data, margin: margin}\"" +
											" data-be-chart-percent-visible=\"chartData." + at.beBuild + ".percentage\" " +
											" data-be-caption=\"chartData." + at.beBuild + ".caption\" " +
											" data-be-outbound-caption=\"_captions." + at.beBuild + "\" " +
											" data-be-chart-value-key=\"chartValueKey\" " +
											" data-be-chart-rating=\"chartData." + at.beBuild + "['displayRating' + chartValueKey]\">";
						
						retVal += "</div></div></div>";
						
						if (scope.chartData[at.beBuild].data == null) {
							retVal="";
							el.removeClass('col-lg-4');
							el.addClass('be-hidden');
						}
	    			} else {
						retVal="";
						el.removeClass('col-lg-4');
						el.addClass('be-hidden');
	    			}
	    			
	    		} else if (typeof scope.listData != "undefined" && scope.listData != null && typeof scope.listData[at.beBuild] != "undefined" && scope.listData[at.beBuild] != null) {
	    			if (scope.listData[at.beBuild].chartType == "table") {
		    			retVal = "<div class=\"cp-outer-cell\">" +
		    					 	"<div class=\"cp-graph-block\">" +
		    					 		"<div style=\"text-overflow: ellipsis; overflow: hidden; \">" +
			    					 		"<div>" +
			    					 			"<div>" +
			    					 				"<div style=\"font-size: " + headerFontSize + "px;width:100%;\">" +
			    					 					"<div style='float:left;width:6%;margin: 0 0.5rem;' data-ng-bind-html=\"listData." + at.beBuild + "['ratingColor' + chartValueKey] | rating\"> </div>" +
			    					 					"<div style='float:left;width:85%' data-be-title-tooltip data-be-description='listData." + at.beBuild + ".icon'> {{ listData." + at.beBuild + ".tableTitle }} </div>" +
			    					 				"</div>" +
			    					 			"</div>" +
			    					 			
												"<div ng-if=\"listData."+at.beBuild+"['pdisplayShow' + chartValueKey]\" class=\"previous\" style=\"font-size: " + typeFontSize + "px;\">" +
													"<div style='float:left'>(previously</div>" +
													"<div class=\"prating\" data-ng-bind-html=\"listData." + at.beBuild + "['pratingColor' + chartValueKey] | rating\"></div>" +
													"<div style='float:left'>)</div>" +
												"</div>" +
			    					 			
			    					 			"<div class=\"period\" style=\"font-size: " + typeFontSize + "px;\">{{ listData." + at.beBuild + ".period }}</div>" +
			    					 		"</div>" +
		    					 		"</div>" +
		    					 		"<div>" +
		    					 			"<div style=\"font-size: " + dateBottomSize + "px;\">{{ listData." + at.beBuild + ".range }}</div>" +
		    					 		"</div>";
		    			
		    			if ((scope.listData != null) && (scope.listData[at.beBuild] != null) && (scope.listData[at.beBuild].caption != null)) {
		    				retVal +=   "<div ng-if=\"chartValueKey == '' && listData." + at.beBuild + ".caption['sampleSize' + currentFilter] != null\" style=\"font-family: HelvNeueLightforIBM; position: absolute; bottom: 19px; left: 10px; font-size: 10px; color: #979797; background-color: #ffffff; z-index: 5\"> " +
		    								"{{ listData." + at.beBuild + ".caption['sampleSize' + currentFilter] }} " +
		    							"</div>";
						}
		    			
		    			// xmt 2015.6.18 22:07
		    			retVal     += 	"<div ng-if=\"listData."+at.beBuild+".bshow\" style=\"font-family: HelvNeueLightforIBM; position: absolute; bottom: 2px; left:10px; font-size: 12px; z-index: 5\">" +
		    								"<img src=\"images/icons/LinkOuticon@1x.png\">" +
		    								"<a data-be-tooltip=\"" + at.beBuild+ "\" current-chart-data='listData."+at.beBuild+"' target = \"_blank\" href=\" {{listData."+at.beBuild+".detailurl}}\">" +
		    									"<span ng-if=\"listData."+at.beBuild+".urlType == 'BERT'\">Access real time</span>" +
		    									"<span ng-if=\"listData."+at.beBuild+".urlType == 'CRIT'\">Access MDI research</span>" +
		    								"</a>" +
		    							"</div>";
		    			
	    				retVal     +=   "<div ng-if=\"chartValueKey != ''\" style=\"width: 100%; height: 80%; position: absolute;\">" +
	    									"<div style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: 'HelvNeueLightforIBM'; color: #2F8CCD; font-size: " + (typeFontSize * 2) + "px;\">" +
	    										"No Data to Display." +
	    									"</div>" +
	    								"</div>";
	    				
	    				retVal     +=   "<data-be-table ng-if=\"chartValueKey == ''\" style=\"width: 100%; height: 80%;\" data-be-data=\"listData." + at.beBuild + "\" data-be-chart-value-key=\"chartValueKey\" " ;
			    		
			    		if (at.beMargin != null) {
			    			retVal +=   	" data-be-margin=\"" + at.beMargin + "\"";
				    	}
			    		
			    		if (at.beCem != null) {
			    			retVal += 		" data-be-cem=\"" + at.beCem + "\"";
				    	}
				    	
				    	if (at.beAlternateRows != null) {
				    		retVal += 		" data-be-alternate-rows=\"" + at.beAlternateRows + "\"";
				    	}
				    	
				    	retVal += 		"></data-be-table>" +
				    				"</div>" +
				    			"</div>";
		    		} else {
						retVal="";
						el.removeClass('col-lg-4');
						el.addClass('be-hidden');
    				}
	    		}
	    		else if (typeof scope.lineData != "undefined" && scope.lineData != null && typeof scope.lineData[at.beBuild] != "undefined" && scope.lineData[at.beBuild] != null) {
    				if (scope.lineData[at.beBuild].chartType == "line") {
    					
    	    			retVal = "<div class=\"cp-outer-cell\">" +
									"<div class=\"cp-graph-block\">" +
										"<div style=\"text-overflow: ellipsis; overflow: hidden; \">" +
											"<div>" +
												"<div>" +
													"<div style=\"font-size: " + headerFontSize + "px;width:100%\">" +
														"<div style='float:left;width:6%;margin: 0 0.5rem;' data-ng-bind-html=\"lineData." + at.beBuild + "['displayRating' + chartValueKey] | rating\"></div>" +
														"<div style='float:left;width:85%' data-be-title-tooltip data-be-description='(([\"Cognitive\",\"Cloud\",\"Analytics\",\"Mobile\",\"Social\",\"Security\"].indexOf(chartValueKey)>-1) && (lineData." + at.beBuild + ".camssDisplay != null))?lineData." + at.beBuild + ".camssIcon:lineData." + at.beBuild + ".icon'>{{ ((['Cognitive', 'Cloud','Analytics','Mobile','Social','Security'].indexOf(chartValueKey)>-1) && (lineData." + at.beBuild + ".camssDisplay != null))?lineData." + at.beBuild + ".camssDisplay:lineData." + at.beBuild + ".title }} {{ parensWrap(lineData." + at.beBuild + "['displayRank' + chartValueKey]) }}</div>" +
													"</div>" +
												"</div>" +
												"<div ng-if=\"lineData."+at.beBuild+"['pdisplayShow' + chartValueKey]\" class=\"previous\" style=\"font-size: " + typeFontSize + "px;\">" +
													"<div style='float:left'>(previously</div>" +
													"<div class=\"prating\" data-ng-bind-html=\"lineData." + at.beBuild + "['pdisplayRating' + chartValueKey] | rating\"></div>" +
													"<div style='float:left'>{{ getAbbrvOrd(lineData." + at.beBuild + "['pdisplayRank' + chartValueKey]) }})</div>" +
												"</div>" +
												"<div class=\"period\" style=\"font-size: " + typeFontSize + "px;\">{{ lineData." + at.beBuild + ".period }}" +
												"</div>" +
											"</div>" +
										"</div>" +
										"<div>" +
											"<div style=\"font-size: " + dateBottomSize + "px;\">{{ lineData." + at.beBuild + ".periodRange }}" +
											"</div>" +
										"</div>" +
										"<div></div>";

		    			retVal += "<div ng-if=\"lineData."+at.beBuild+".bshow\" style=\"font-family: HelvNeueLightforIBM; position: absolute; bottom: 2px; left:10px; font-size: 12px; z-index: 5\">" +
		    							"<img src=\"images/icons/LinkOuticon@1x.png\">" +
			    						"<a data-be-tooltip=\"" + at.beBuild+ "\" current-chart-data='lineData."+at.beBuild+"' target = \"_blank\" href=\" {{lineData."+at.beBuild+".detailurl}}\">" +
	    									"<span ng-if=\"lineData."+at.beBuild+".urlType == 'BERT'\">Access real time</span>" +
	    									"<span ng-if=\"lineData."+at.beBuild+".urlType == 'CRIT'\">Access MDI research</span>" +
										"</a>" +
									"</div>";

    					retVal += "<div style=\"width:100%; height: 80%;\" " +
									" data-line-chart" +
									" data-be-data=\"lineData." + at.beBuild + "\"" +
									" data-be-chart-value-key=\"chartValueKey\" " +
									" data-be-margin=\"'0.1 0.08 0.24 0.14'\" " +
									" data-be-chart-percent-visible=\"lineData." + at.beBuild + ".percentage\" " +
									" data-be-caption=\"lineData." + at.beBuild + ".caption\"> ";

    					retVal += "</div></div></div>";
    					
    					if (scope.lineData[at.beBuild].data == null)
    					{
    						retVal="";
    						el.removeClass('col-lg-4');
    						el.addClass('be-hidden');
    					}
    				}
	    			else {
						retVal="";
						el.removeClass('col-lg-4');
						el.addClass('be-hidden');
	    			}
	    		}
	    		else {
					retVal="";
					el.removeClass('col-lg-4');
					el.addClass('be-hidden');
	    		}
		    	
		    	el.html(retVal);
				$compile(el.contents())(scope);
		    	//return retVal;
		    	//el.replaceWith($compile(retVal)(scope));
	    	}
			
	    	var w = angular.element($window);
            var resizePromise = null;
            w.bind('resize', function (ev) {
                resizePromise && $timeout.cancel(resizePromise);
                resizePromise = $timeout(function () {
                    width = el[0].offsetWidth;
                    height = el[0].offsetHeight;
                    update();
                }, 100);
            });
            
            scope.$watch('[chartData.' + at.beBuild + ',listData.' + at.beBuild + ', lineData.' + at.beBuild + ']', update, true);
			
			scope.parensWrap = function(num) { return Utility.parensWrap(Utility.getAbbrvOrdinal(num)); }
			scope.getAbbrvOrd = function(num) { return Utility.getAbbrvOrdinal(num); }
	    }
	  };
	});
});