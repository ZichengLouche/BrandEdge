define(['BrandEdge/app'], function(app) {
	app.directive('alertTooltip', function() { 
		return {
		    restrict: 'A',
		    replace: true,
		   
		    link: function(scope, elem, attrs) {
		    	var alterTemplate = '';
		    	switch(attrs.alertTooltip){
		    		case 'export':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu">' +
						    				'Click here to export metrics.' +
						    			'</div>';
		    			break;
		    		case 'calendar':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu">' +
						    				'Click here to choose a different time period.' +
						    			'</div>';
		    			break;
		    		case 'help':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu">' +
						    				'Click here to learn more about BrandEdge.' +
						    			'</div>';
		    			break;
		    		case 'Marketplace':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu">' +
						    				'Influencers identified by MD&I' +
						    			'</div>';
		    			break;
		    		case ' IBM-Provided':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu">' +
						    				'Influencers provided by IBM local teams' +
						    			'</div>';
		    			break;
		    		case ' Marketplace & IBM':
		    			alterTemplate = '<div class="daterangepicker dropdown-menu">' +
						    				'Unduplicated total including influencers identified by MD&I and influencers provided by IBM teams' +
						    			'</div>';
		    			break;
		    		default:
		    			alterTemplate = null;
		    	}
		    	
		    	if(alterTemplate){
		    		var alterContainer;
        	  
		    		elem.bind('mouseover', function() {
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
		    		});
		      
		    		elem.bind('mouseleave', function() {
		    			alterContainer.remove();
		    		});
		    	  
		    		elem.bind('click', function() {
		    			alterContainer.hide();
		    		});
		    	}
		    }
		  };
	});
});
