define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an attribute anywhere you want to display an alert message.  Any message set in the AlertService will appear. 
	 */
	app.directive('beAlert', function() {
	  return {
	    restrict: 'A',
	    bindToController: true,
	  	controller: "AlertController as alertCtrl",
	    template: function(element, attrs) {
	    	var tag = element[0].nodeName;
	    	var realm = (attrs.beRealm != null)?attrs.beRealm:"defaultRealm";
	    	var scope = element.scope();
	    	var baseDisplay = element.css('display');
	    	
	    	function setVisibility() {
	    		if (scope.alertCtrl.AlertService.showAlert[realm]) {
	    			element.css('display', baseDisplay);
	    		} else {
	    			{
		    			element.css('display', 'none');
		    		}
	    		}
	    	}
	    	
	    	scope.$watch('alertCtrl.AlertService.showAlert.' + realm, setVisibility, true);
	    	
	    	return '<' + tag + ' class="alert alert-{{ alertCtrl.AlertService.alertType.' + realm + ' }}" data-role="alert" data-ng-if="alertCtrl.AlertService.showAlert.' + realm + '" data-ng-bind-html="alertCtrl.AlertService.alertMessage.' + realm + '"></' + tag + '>';
	    } 
	  };
	  
	});
});