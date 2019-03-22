define(['BrandEdge/app'], function(app) 
{
	app.factory('AnalyticsAdapterFactory', function($location, DataUtility) {

		return {
            page: function(params){
                var o = angular.extend({}, {
                    page: $location.path(),
                    host: $location.host(),
                    href: $location.absUrl(),
                    country: (DataUtility.getCountry() || {country: null}).country
                }, params);
                return invokeAdapterService("pageTracker", [JSON.stringify(o)]);
            },

            event: function(params){
                var o = angular.extend({}, {
                    page: $location.path(),
                    host: $location.host(),
                    href: $location.absUrl(),
                    country: (DataUtility.getCountry() || {country: null}).country
                }, params);
                return invokeAdapterService("eventTracker", [JSON.stringify(o)]);
            }
        };

		function invokeAdapterService(procedure, parameters){
            var invocationData =
            {
                adapter : "AnalyticsAdapter",
                procedure : procedure,
                parameters : parameters,
                compressResponse : true
            };
            return WL.Client.invokeProcedure(invocationData);

		}
	});
});