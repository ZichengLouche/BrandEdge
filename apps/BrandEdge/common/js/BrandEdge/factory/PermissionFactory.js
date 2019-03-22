define([ 'BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string' ], function(app, underscore, underscore_str) {
	// xmt 2014.7.9 10:32
	app.factory('PermissionFactory', function($rootScope) {
		_.str = underscore_str;
		
		var permissions = [];
		var userCountries;
		var iotCountries;

		return {
			setUserCountries : function(countries) {
				userCountries = countries;
			},
			
			setIotCountries : function(countries) {
				iotCountries = countries;
			},

			setPermissions : function(permissionList) {
				permissions = permissionList;
			},
			
			getPermissions : function() {
				var userIotGroup = [];
				var iotStandardGroup = _.chain(iotCountries)
		                .groupBy(function (e, i) {
		                    return e.BLUEGROUP;
		                })
		                .value();
				
				// IOT level
				Object.keys(iotStandardGroup).map(function(current) {
					var result = iotStandardGroup[current].every(function(item){
						for (var index in userCountries) {
							if(userCountries[index].code == item.COUNTRY) {
								return true;
							}
						}
						return false;
					});
					
					if(result == true){
						userIotGroup.push(current);
					}
		    	});
				
				var userIotCountries = [];
				if(userIotGroup.length > 0){
					// xmt 2015.7.24 17:53 Calculate separate country 
					userIotGroup.forEach(function(current){
						userIotCountries = userIotCountries.concat(iotStandardGroup[current]);
					});
					
					if(userIotCountries.length > 0){
						userCountries.map(function(current){
							var result = userIotCountries.every(function(item){
								return current.code != item.COUNTRY;
							});
							
							if(result == true){
								permissions.push(current.country);
							}
						});
					}
					
					permissions = permissions.concat(userIotGroup.map(function(current){ 
										return current.split(".").slice(-1)[0]; 
									}));
					
				} else {
					permissions = permissions.concat(userCountries.map(function(current){ return current.country; }));
				}
				
				return permissions;
			},
			
			hasPermission : function() {
				return permissions.length > 0;
			}
		};
	});
});