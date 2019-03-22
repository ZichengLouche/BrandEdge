define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('EmployeeFactory', function($q, BHDataAdapterService, DonutFactory){
		_.str = underscore_str;

        return {

            getData: function(country, date) {
//            	Grey out Employee Information
            	var data = [];
            	return {
                    label: "Employees",
                    subLabel: "(Please consult with HR regarding IBMer metrics)",
                    constituents: "Employees",
                    center: angular.extend({}, DonutFactory.getCenter(), {
                        image: DonutFactory.getImage("")
                    }),

                    segments: _.chain(DonutFactory.getSegments())
                    	.map(function (v, k) {
                    		return angular.extend({}, v, {
                    			urlState: DonutFactory.getState("Employees", "Belief"),
                    			outerColor: v.outerColor,
                    			details: []
                    		});
                    	})
                    	.value(),

                    details: []
                };
                
//                if (country) {
//                    return $q.all([
//                        BHDataAdapterService.getEmployee(country, date)
//                    ]).then(function (data) {
//                        var data = _.chain(data[0])
//                            .map(function (v, k) {
//                                return {
//                                    color: _.str.clean(v["COLOR_CODE"]),
//                                    column: _.str.clean(v["COLUMN"]),
//                                    constituents: _.str.titleize(_.str.clean(v["CONSTITUENTS"]).toLowerCase()),
//                                    name: _.str.clean(v["DISPLAY_NAME"]),
//                                    value: _.str.clean(v["DISPLAY_VALUE"]),
//                                    code: _.str.clean(v["METRIC_CODE"]),
//                                    year: _.str.clean(v["YEAR"]),
//                                    icon: _.str.clean(v["ICON_TEXT"]),
//                                    sequence: _.str.clean(v["SEQUENCE"])
//                                }
//                            })//transform data to proper json
//                            .value();
//                        var first = _.chain(data).filter(function (v) {
//                            return v.sequence == 1;
//                        }).value();
//
//                        var center = _.chain(data).find(function(v){
//                            return v.sequence == 0;
//                        }).value();
//
//                        return {
//                            label: "Employees",
//                            subLabel: "(Please consult with HR regarding IBMer metrics)",
//                            constituents: "Employees",
//                            center: angular.extend({}, DonutFactory.getCenter(), {
//                                image: DonutFactory.getImage( (center)?center.color:"" )
//                            }),
//
//                            segments: _.chain(DonutFactory.getSegments())
//                                .map(function (v, k) {
//                                    var o = _.chain(first).find(function (item) {
//                                        return v.column === item.column;
//                                    }).value();
//                                    return angular.extend({}, v, {
//                                        urlState: DonutFactory.getState("Employees", "Belief"),
//                                        outerColor: (o) ? DonutFactory.getColor(o.color) : v.outerColor,
//                                        details: data
//                                    });
//                                })
//                                .value(),
//
//                            details: data
//                        };
//
//                    }, function (error) {
//                        throw error;
//                    });
//                } else {
//                    return $q(function(resolve, reject) {
//                        setTimeout(function() {
//                            return resolve(DonutFactory.getDonut("Employee"));
//                        }, 1000);
//                    });
//                }
            }
        };
	});
});