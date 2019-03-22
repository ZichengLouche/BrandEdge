define(['BrandEdge/app', 'lib/d3/d3'/*, 'lib/underscore/underscore', 'lib/underscore/underscore.string'*/], function(app/*, underscore, underscore_str*/) 
{	
	/**
	 *   Donut Chart Directive
	 *   
	 *   	This directive makes donut charts using d3.
	 *    
	 *   inputs
	 *   
	 *   	beData - donut chart data in the following json format
     *      {
     *            "center":{
     *                "textColor":"#ffffff",
     *                "color":"#fdd600",
     *                "value":0
     *            },
     *            "segments":[
     *                {
     *                   "outerColor":"#fdd600",
     *                   "value":30,
     *                   "name":"Belief",
     *                   "color":"#4178be",
     *                   "chart":[]
     *               }
     *           ]
     *       }
	 *   	
	 *   	beConfig - defines override config object. Please see config variable definition bellow for details
	 *   
	 *   	beBroadcast - is boolean. by default its false. if its true chart will broadcast click even from the rootScope
	 *   
	 *   	beSlice - is object that defines what slice of the donut should be auto selected on load
	 *   		{ donut: 'donut-id', slice: 'slice-0' }
	 *   
	 *   	beId - string donut id
	 */
	
	app.directive('beDonut', function($rootScope, $window, $timeout) {
        'use strict';
        //_.str = underscore_str;
        
        return {
            restrict: 'EA',
            
            scope: {
                beData: '=',
                beConfig: '=',
                beBroadcast: '=',
                beSlice: '=',
                beId: '@'
            },

            link: function(scope, element, attrs, ctrl) {

                var config = {
                    title: '',
                    tooltips: false,
                    labels: true,
                    
                    mouseover: function () {},
                    
                    mouseout: function () {},
                    
                    click: function () {}
                    
                    //outerRadius:
                    //innerRadius:
                    //centerRadius: 
                };

                var width = element[0].offsetWidth;
                var height = element[0].offsetHeight;
                if (height === 0 || width === 0) {
                    throw new Error('Please set height and width for the chart element');
                }
                
                var data = {};
                var id = null;
                var click = null;

                function init() {
                	prepareData();
                	if (data.segments.length == 0) return;
                	
                	var donutSize = Math.min(width, height);
                	
                	d3.select(element[0]).select('svg').remove();
                	
                    var outerRadius = (config.outerRadius) ? config.outerRadius : (donutSize * 0.92 / 2);
                    var innerRadius = (config.innerRadius) ? config.innerRadius : (0.92 * outerRadius);
                    var centerRadius = (config.centerRadius) ? config.centerRadius : (0.4 * outerRadius);

                    var svg = d3.select(element[0])
                        .append('svg')
                        .attr('class', "svg-donut-" + id)
                        .attr('width', width)
                        .attr('height', height);

                    var arcHover = d3.svg.arc()
                        .innerRadius(0)
                        .outerRadius(outerRadius * 0.1);

                    var arcOuter = d3.svg.arc()
                        .innerRadius(centerRadius)
                        .outerRadius(outerRadius);

                    var arcInner = d3.svg.arc()
                        .innerRadius(centerRadius)
                        .outerRadius(innerRadius);

                    var arcPhantom = d3.svg.arc()
                        .innerRadius(centerRadius)
                        .outerRadius(outerRadius);

                    var pie = d3.layout.pie()
                        .value(function (d) {
                            return d.value;
                        })
                        .sort(null);

                    var slices = {};

                    angular.forEach(data.segments, function (segment, i) {

                        var slice = "slice-" + i;
                        var g = svg.append('g').attr("class", slice).attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

                        var pathOuter = g.selectAll('path.o-path')
                            .data(pie(data.segments))
                            .enter();

                        var path = pathOuter[0].filter(function (e, index) {
                            return index == i;
                        });
                        var startAngle = path[0].__data__.startAngle;
                        var endAngle = path[0].__data__.endAngle;


                        g.append('path')
                            .attr('class', 'o-path')
                            .attr('d', arcOuter.startAngle(startAngle).endAngle(endAngle))
                            .attr('fill', function (d, i) {
                                return segment.outerColor;
                            });

                        g.append('path')
                            .attr('class', 'i-path')
                            .attr('d', arcInner.startAngle(startAngle).endAngle(endAngle))
                            .attr('fill', function (d, i) {
                                return segment.color;
                            });

                        g.append('text')
                            .attr("transform", function (d) {
                                d = {
                                    innerRadius: centerRadius,
                                    outerRadius: innerRadius,
                                    startAngle: startAngle,
                                    endAngle: endAngle
                                }
                                return "translate(" + arcInner.centroid(d) + ")rotate(" + angle(d) + ")";
                            })
                            .attr("dy", ".35em")
                            .attr("text-anchor", "middle")
                            .style("fill", "White")
                            .style("font", "bold " + centerRadius * 0.3 + "px Arial")
                            .text(function (d, i) {
                                return segment.name;
                            });

                        var phantomPath = g.append('path')
                            .attr('class', 'p-path')
                            .attr('d', arcPhantom.startAngle(startAngle).endAngle(endAngle))
                            .style("fill-opacity", 0)
                            .attr('fill', function (d, i) {
                                return "red";
                            });

                        phantomPath.datum(path[0].__data__);

                        phantomPath.on("click", function (d, i) {
                            var parent = d3.select(this.parentNode);
                            var slice = parent.attr("class");

                            var c = arcHover.centroid(d);

                            var pop = true;
                            if (scope.activeSlice && scope.activeSlice.attr("class") === slice) {
                                scope.activeSlice.transition().duration(50).attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                                scope.activeSlice = null;
                                pop = false;
                            } else {
                                if (scope.activeSlice) {
                                    scope.activeSlice.transition().duration(50).attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                                }
                                parent.transition().duration(50).attr('transform', 'translate(' + ((width / 2) + c[0]) + ',' + ((height / 2) + c[1]) + ')');
                                scope.activeSlice = parent;
                            }

                            if (scope.beBroadcast === true) {
                                $rootScope.$broadcast("be-donut-slice-click", {
                                    id: id
                                });
                            }

                            config.click(d3.event, d, {id: id, pop: pop});
                        });

                        phantomPath.on("mouseover", function (d, i) {
                            d3.select(this)
                                .attr('stroke-width', outerRadius * 0.03)
                                .attr("stroke", "#ccccdd");
                        });

                        phantomPath.on("mouseout", function (d, i) {
                            d3.select(this)
                                .attr('stroke-width', "0")
                                .attr("stroke", "#ccccdd");
                        });


                        slices[slice] = phantomPath;

                    });

                    var circleSvg = svg.append('g')
                        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

                    circleSvg.append("circle")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", centerRadius * 0.8)
                        //.attr("stroke", "green")
                        .attr("fill", data.center.image ? data.center.color:(data.center.color == '#ffffff'?'#ccccdd':data.center.color));
                    
                    if (data.center.image){
                        var r = centerRadius*0.6
                        var imageSvg = svg.append('g')
                          .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                      
                        imageSvg.append("circle")
                          .attr("cx", 0)
                          .attr("cy", 0)
                          .attr("r", r)
                          //.attr("stroke", "red")
                          //.style("stroke-width", 2.5)
                          .attr("fill", data.center.color);
                          
                        var defs = svg.append("defs").attr("id", "center-image-defs");
                        
                        var image = defs.append("pattern")
                              .attr("id", "center-image")
                              .attr("height", 1)
                              .attr("width", 1)
                              .attr("x", "0")
                              .attr("y", "0");
                              
                        image.append("image")
                                   .attr("height", r*2)
                                   .attr("width", r*2)
                                   .attr("xlink:href", data.center.image);
                              
                        imageSvg.append("circle")
                        .attr("r", r)
                        .attr("cy", 0)
                        .attr("cx", 0)
                        .attr("fill", "url(#center-image)");
                    }else{
                    	circleSvg.append("text")
                        .attr("dy", (data.center.value === "--")?"0.25em":"0.35em")
                        .style("text-anchor", "middle")
                        .style("fill", data.center.textColor)
                        .style("font", "normal " + centerRadius + "px Arial")
                        .text(function (d) {
                            return (data.center.value === null) ? "" : data.center.value;
                        });
                    	
                    }
                    

                    if(scope.beBroadcast === true){
                        scope.$on('be-donut-slice-click', function (event, data) {
                            if(data.id != scope.beId && scope.activeSlice){
                                scope.activeSlice.transition().duration(50).attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
                                scope.activeSlice = null;
                            }
                        });
                    }

                    if(scope.beSlice && scope.beSlice.slice){
                    	if( scope.beSlice.donut ){
                    		if(scope.beSlice.donut === scope.beId && slices[scope.beSlice.slice]){
                    			var event = document.createEvent('Event');
                    			event.initEvent('click', true, true);
                    			slices[scope.beSlice.slice].node().dispatchEvent(event);  
                    		}
                    	}else{
                    		if(slices[scope.beSlice.slice]){
                    			var event = document.createEvent('Event');
                    			event.initEvent('click', true, true);
                    			slices[scope.beSlice.slice].node().dispatchEvent(event);
                    		}
                    	}
                    }
                }

                // Computes the angle of an arc, converting from radians to degrees.
                function angle(d) {
                    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
                    return a == 90 ? a - 90 : a + 90;
                }

                function prepareData() {
                    data = scope.beData || {};
                    data.segments = data.segments || [];
                    data.center = data.center || {};
                    id = scope.beId;
                    if (scope.beConfig) angular.extend(config, scope.beConfig);
                    scope.activeSlice = null;
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

                scope.$watch('[beData, beConfig]', init, true);
            }
        }
    });
});