define(['BrandEdge/app'], function(app) {
	app.directive('formVerify', function() { 
		return {
		    restrict: 'A',
		    replace: true,
		    scope: {
		    	beValid: '='
		    },
		   
		    link: function(scope, elem, attrs) {
		    	var alterTemplate = '';
		    	switch(attrs.formVerify){
		    		case 'banner':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu alertVerification">' +
						    				'Length shall not exceed 1000 characters.' +
						    			'</div>';
		    			break;
		    		
		    		default:
		    			alterTemplate = null;
		    	}
		    	
		    	function showAlert(){
		    		if(alterTemplate){
		    			alterContainer = $(alterTemplate).appendTo('body');
			    		alterContainer.show();
			    		alterContainer.removeClass('opensleft opensright').addClass('opensleft');
			          	var parentOffset = { top: 0, left: 0 };
			            var parentRightEdge = $(window).width();
			            alterContainer.css({
			              top: elem.offset().top + elem.outerHeight() - parentOffset.top,
			              right: parentRightEdge - elem.offset().left - elem.outerWidth(),
			              left: 'auto'
			          	});
		    		}
		    	}
		    	
		    	function hideAlert(){
		    		if(alterTemplate){
		    			alterContainer.remove();
		    		}
		    	}
		    	  
//		    	elem.bind(['click', 'change'], function() {
//		    		alterContainer.hide();
//		    	});
		    	
		    	scope.$watch('beValid', function(oldVal, newVal){
		    		if(!newVal) {
		    			if(oldVal !== newVal) showAlert();
		    		}else {
		    			hideAlert();
		    		}
		    	}, true);
		    }
		  };
	});
});
