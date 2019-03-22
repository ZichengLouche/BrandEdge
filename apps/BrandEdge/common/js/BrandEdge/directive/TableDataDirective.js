define(['BrandEdge/app'], function(app) {
	/**
	 *  This directive builds tables as specified.
	 *  
	 *   beData: JSON object containing the data elements for the table as follows:
	 *   
	 *   		{
	 *   			titles: [ array of titles ],
	 *   			data: [ array of JSON format rows of data ],  =>  [ { col1: data, col2: data }, { col1: data, col2: data }, .... ],
	 *   			totals: [ array of data for totals row (last row of table) ]
	 *   		}
	 *   
	 *   beAlternateRows: alternating background of table rows (any value other than null indicates true)
	 *   
	 *   beWidth: width in pixels (if not provided, element.offsetWidth is used to determine width)
	 *   
	 *   beHeight: height in pixels (if not provided, element.offsetHeight is used to determine height)
	 *   
	 *   beFontSize: fontSize in pixels (if not provided, fontSize is calculated as a percentage of the margin)
	 */
	app.directive('beTable', function($compile, Utility, $window, $timeout) {
		return {
			restrict : 'E',
			transclude: true,
			scope : {
				beData: '=',
				beChartValueKey: '=',
				beMargin: '=',
				beCem: '=',
				beAlternateRows: '=',
				beWidth: '=',
				beHeight: '=',
				beFontSize: '='
			},
			link : function(scope, element, attr) {
				element.css('display','block');
				var width = (scope.beWidth == null) ? element[0].offsetWidth + "px" : scope.beWidth + "px";
				var height = (scope.beHeight == null) ? element[0].offsetHeight + "px" : scope.beHeight + "px";
				
				function update() {	
					// xmt 2015.6.25 16:14
					if((typeof scope.beData !== 'undefined' && scope.beChartValueKey != '') || (typeof scope.beData !== 'undefined' && scope.beData == null)) {
						scope.beData.bshow = false;
					}
					
					if (scope.beData) {
						//console.log("Not Null!!", element[0].offsetWidth, element[0].offsetHeight);
						//width = (scope.beWidth == null) ? element[0].offsetWidth + "px" : scope.beWidth + "px";
						//height = (scope.beHeight == null) ? element[0].offsetHeight + "px" : scope.beHeight + "px";

						var margin = (scope.beMargin == null)?"0.05":scope.beMargin;
						margin = Utility.getMarginPixels(margin, width, height);

                        var fontBase = (element[0].offsetWidth + element[0].offsetHeight)/2;
						var fontSize = ((scope.beFontSize == null)?parseInt(fontBase*0.035):scope.beFontSize) + "px";
						
						var retString = "<div style=\"width: " + width + "; height: " + height + "; ";
						
						retString += "padding-top: " + margin.top + "px; "
									+ "padding-right: " + margin.right + "px; "
									+ "padding-bottom: " + margin.bottom + "px; "
									+ "padding-left: " + margin.left + "px;"
						
						retString += "\" class=\"be-table";
		
						if (scope.beAlternateRows != null) {
							retString += " be-alt";
						}
						
						if (scope.beCem != null) {
							retString += " be-cem";
						}
						
						retString += "\">";
		
						var titles = scope.beData.titles;
		
						retString += "<div>";
						for ( var x in titles) {
							retString += "<div><div><div style=\"font-size: " + fontSize + ";\">" + titles[x] + "</div></div></div>";
						}
						retString += "</div>";
		
						var data = scope.beData.data;
		
						for ( var x in data) {
							retString += "<div>";
							for ( var y in data[x]) {
								if (y == (data[x].length - 1))
								{
									// show negatives red
									//retString += "<div" + ((y>0)?" style=\"text-align: right;\"":"") + "><div><div style=\"" + ((parseFloat(data[x][y]) < 0)?"color: red; ":"") + "font-size: " + fontSize + ";\">" + ((y>0)?Utility.commaFormatNumber(data[x][y]):data[x][y]) + "</div></div></div>";
									retString += "<div" + ((y>0)?" style=\"text-align: right;\"":"") + "><div><div style=\"font-size: " + fontSize + ";\">" + ((y>0 && scope.beData.metricCode != 'INT16')?Utility.commaFormatNumber(data[x][y]):data[x][y]) + "</div></div></div>";
								}
								else
								{
									retString += "<div" + ((y>0)?" style=\"text-align: right;\"":"") + "><div><div style=\"font-size: " + fontSize + ";\">" + ((y>0 && scope.beData.metricCode != 'INT16')?Utility.commaFormatNumber(data[x][y]):data[x][y]) + "</div></div></div>";
								}
							}
							retString += "</div>";
						}
		
						var totals = scope.beData.totals;
						retString += "<div>";
						for ( var x in totals) {
							if (x > 0)
							{
								// show negatives red
								retString += "<div" + ((x>0)?" style=\"text-align: right;\"":"") + "><div><div style=\"" + ((parseFloat(totals[x]) < 0 && scope.beData.metricCode != 'INT5')?"color: red; ":"") + "font-size: " + fontSize + ";\">" + ((x>0)?Utility.commaFormatNumber(totals[x]):totals[x]) + "</div></div></div>";
//								retString += "<div" + ((x>0)?" style=\"text-align: right;\"":"") + "><div><div style=\"font-size: " + fontSize + ";\">" + ((x>0)?Utility.commaFormatNumber(totals[x]):totals[x]) + "</div></div></div>";
							}
							else
							{
								retString += "<div" + ((x>0)?" style=\"text-align: right;\"":"") + "><div><div style=\"font-size: " + fontSize + ";\">" + ((x>0)?Utility.commaFormatNumber(totals[x]):totals[x]) + "</div></div></div>";
							}
						}
						retString += "</div>";
						retString += "</div><div style=\"width: " + width + ";height: 7px;\"> &nbsp; </div>";
						
//						if (scope.beData.caption != null)
//						{
//							retString += "<div style=\"position: absolute; bottom: 3px; left: 6px; font-size: " + parseInt((margin.bottom)*0.45) + "px;\">" + scope.beData.caption + "</div>";
//						}
		
						//element.replaceWith($compile(retString)(scope));
						element.html(retString);
						$compile(element.contents())(scope);
					}
				}
				
				var w = angular.element($window);
                var resizePromise = null;
                w.bind('resize', function (ev) {
                    resizePromise && $timeout.cancel(resizePromise);
                    resizePromise = $timeout(function () {
                        width = element[0].offsetWidth  + "px";
                        height = element[0].offsetHeight  + "px";
                        update();
                    }, 100);
                });
                
				scope.$watch('[beData, beChartValueKey]', update, true);
			}
		}
	});
});