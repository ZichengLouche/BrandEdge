define(['BrandEdge/app', 'lib/d3/d3'/*, 'lib/underscore/underscore', 'lib/underscore/underscore.string'*/], function(app/*, underscore, underscore_str*/) 
{	
	/**
	 *   Pie Chart Directive
	 *   
	 *   	This directive makes pie charts using d3.
	 *    
	 *   inputs
	 *   
	 *   	beData - pie chart data in the following json format
     *      [ 
	 *	      { "label": "One",  "value": 100, "color": "#98abc5"}, 
	 *	      { "label": "Two", "value": 400, "color": "#7b6888" }
	 *	    ]
	 *   	
	 *   	beConfig - defines override config object. Please see config variable definition bellow for details. optional
	 *   
	 *   	beWidth - chart width. optional
	 *   
	 *   	beHeight - chart height. optional
	 *   
	 *   	beId - string pie id. optional
	 */
	
	app.directive('bePie', function($rootScope, $window, $timeout, CommonUtilityFactory) {
        'use strict';
        //_.str = underscore_str;
        var utils = CommonUtilityFactory;
        
        return {
            restrict: 'EA',
            
            scope: {
                beData: '=',
                beConfig: '=',
                beWidth: '=',
                beHeight: '=',
                beId: '@'
            },      
            
            link: function(scope, element, attrs, ctrl) {

                var config = {

                    labels: true,
                   
                    mouseover: function () {},
                    
                    mouseout: function () {},
                    
                    click: function () {},
                    
                    animationDelay: 2000,
                    
                    //outerRadius:
                    //innerRadius:
                    //centerRadius: 
                };

                var width = scope.beWidth || element[0].offsetWidth;
                var height = scope.beHeight || element[0].offsetHeight;
                var pieSize = Math.min(width, height);   
                if (height === 0 || width === 0) {
                    throw new Error('Please set height and width for the chart element');
                }
                
                var data = {};
                var id = null;

                function init() {
                	prepareData();
                	if (data == null || data.length == 0){
                		_displayNoData(element[0], config);
                		return;
                	};
                	
                		
                	d3.select(element[0]).select('svg').remove();
                	
                    var outerRadius = (config.outerRadius) ? config.outerRadius : (pieSize * 0.92 / 2);
                    var innerRadius = (config.innerRadius) ? config.innerRadius : 0;
                    var total= d3.sum(data, function(d){return d.value;});
                    var toPercent = d3.format("0.1%");

                    var arc = d3.svg.arc()
						.outerRadius(outerRadius)
						.innerRadius(innerRadius);

                    var tweenPie = function (b) {
                        b.innerRadius = 0;
                        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
                        return function(t) {
                          return arc(i(t));
                        };
                      }
                  
					var pie = d3.layout.pie()
						.sort(null)
						.value(function(d) { 
							return d.value; 
					});
          						
					var svg = d3.select(element[0])
                        .append('svg')
                        .attr('class', "svg-pie")
                        .attr('width', width)
                        .attr('height', height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

					var g = svg.selectAll(".arc")
						.data(pie(data))
						.enter().append("g")
						.attr("class", "arc")
						.on('mouseover', function(d, i) {
							config.mouseover(d3.event, d, i);
			            })
			            .on('mouseout', function(d, i) {
			            	config.mouseout(d3.event, d, i);
			            })
			            .on('click', function(d, i) {
			            	config.click(d3.event, d, i);
			            });
					
					g.append("path")
						.attr("d", arc)
						.style("fill", function(d) { 
							return d.data.color;
							})
						.transition()
                        //.ease("bounce")
                        .duration(config.animationDelay)
                        //.delay(function(d, i) { return i * 500; })
                        .attrTween("d", tweenPie);

                    /*
                    if(total > 0){
                        var g = svg.selectAll(".pie-labels")
                            .data(pie(data))
                            .enter()
                            .append("g")
                            .attr("class", "pie-labels")
                            .append("text")
                            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                            .attr("dy", ".35em")
                            .attr("font-family", "HelvNeueLightCondforIBM")
                            .attr("font-size", "1rem")
                            .style("text-anchor", "middle")
                            .text(function(d) { return d.data.label + "  (" + utils.numberWithCommas(d.data.value) + ")  " + toPercent(d.data.value/total); });
                    }
                    */

                    if(total > 0){
                        var l = svg.selectAll(".pie-labels")
                            .data(pie(data))
                            .enter()
                            .append("g")
                            .attr("class", "pie-labels");

                            l.append("text")
                            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                            .attr("dy", ".35em")
                            .attr("font-family", "HelvNeueLightCondforIBM")
                            .attr("font-size", "1rem")
                            .style("text-anchor", "middle")
                            .text(function(d) { return d.data.label; });

                            l.append("text")
                            .attr("transform", function(d) {
                                var ct = arc.centroid(d);
                                ct[1] = ct[1] + outerRadius*0.12;
                                return "translate(" + ct + ")"; })
                            .attr("dy", ".35em")
                            .attr("font-family", "HelvNeueLightCondforIBM")
                            .attr("font-size", "1rem")
                            .style("text-anchor", "middle")
                            .text(function(d) { return utils.numberWithCommas(d.data.value); });

                            l.append("text")
                            .attr("transform", function(d) {
                                    var ct = arc.centroid(d);
                                    ct[1] = ct[1] + outerRadius*0.24;
                                    return "translate(" + ct + ")"; })
                            .attr("dy", ".35em")
                            .attr("font-family", "HelvNeueLightCondforIBM")
                            .attr("font-size", "1rem")
                            .style("text-anchor", "middle")
                            .text(function(d) { return toPercent(d.data.value/total); });
                    }
                }

                function prepareData() {
                    data = scope.beData.filter(function(e){
                    	return e.value != null;
                    }) || [];
                    if (scope.beConfig) angular.extend(config, scope.beConfig);
                }
                
                function _displayNoData(domId, myConfig) {
        			var container = d3.select(domId)
        				.append('svg')
        				.attr('width', width)
        				.attr('height', height);
        			
        			container.append('text')
        				.text('No Data to Display.')
        				.attr("font-family", "HelvNeueLightCondforIBM")
        			    .attr("font-size", (pieSize/10).toString() + 'px')
        			    .attr("fill", "#2F8CCD")
        			    .attr("text-anchor", "middle")
        				.attr("x", width / 2)
        				.attr("y", height / 2);
        			
        		}

                var w = angular.element($window);
                var resizePromise = null;
                w.bind('resize', function (ev) {
                    resizePromise && $timeout.cancel(resizePromise);
                    resizePromise = $timeout(function () {
                        width = element[0].clientWidth;
                        height = element[0].clientHeight;
                        init();
                    }, 100);
                });

                scope.$watch('[beData, beConfig, beWidth, beHeight]', init, true);
            }
        }
    });
});