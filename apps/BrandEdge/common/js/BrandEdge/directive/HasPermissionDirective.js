define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str) {	
	// xmt 2014.7.9 10:32
	app.directive("hasPermission", function(PermissionFactory) {
		_.str = underscore_str;
		
        return {
            restrict: 'EA',
            
            link: function(scope, element, attrs) {
            	
            	function update() {
            		if(scope.iotCountries == null || scope.userCountries == null) return ;
            		
            		var hasPermission = PermissionFactory.hasPermission();
            		
            		if(hasPermission) {
            			element.show();
            		} else {
            			element.hide();
            		}
            	}
            	
            	scope.$watch('[iotCountries,userCountries]', update, true);
            }
        }
	});
});