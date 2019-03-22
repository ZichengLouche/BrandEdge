define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an tooltip anywhere you want to display on realTime.  Any username and password set in the message will appear. 
	 */
	app.directive('beTitleTooltip', function() { 
		return {
		    restrict: 'A',
		    replace: true,
		    scope: {
		    	beDescription: '='
		    },
		   
		    link: function(scope, elem, attrs) {
		    	var tmpDescription = null;
		    	var toolTipContainer = null;
		    	var toolTipTemplate = null;
		    	function update(){ 
		    		if(scope.beDescription){
//		    		if(false){
		    			tmpDescription = scope.beDescription;
		    	
		    			toolTipTemplate = "<div class='rectrangletooltip openarrow' style='max-width: 120rem'>" +
		    								  "<div style='font-size: 1.1rem;'>" + tmpDescription + "</div>" +
		    								  "</div>";
         
		    			toolTipContainer = $(toolTipTemplate).appendTo('body');
		    			toolTipContainer.toggle(false);
		    		}
		    	}
		    	
		    	
    			elem.bind('mouseover', function() {
    				if(toolTipContainer){
    					toolTipContainer.toggle(200);
    					var parentOffset = { top: 0, left: 0 };
    					var parentTopEdge = $(window).height();
    					toolTipContainer.css({
    						top: 'auto',
    						bottom: parentTopEdge - elem.offset().top - elem.outerHeight() + 20,
    						left: elem.offset().left - 20,
    						right: 'auto'
    					});
    				}
    			});
      
    			elem.bind('mouseleave', function() {
    				if(toolTipContainer){
    	    			toolTipContainer.bind('mouseover',function() {
    	    				toolTipContainer.toggle(true);
    	    				return;
    	    			});
    	    	  
    	    			toolTipContainer.bind('mouseleave',function() {
    	    				toolTipContainer.toggle(false);
    	    				return;
    	    			});
    	    		}
    				if(toolTipContainer) toolTipContainer.toggle(false);
    			}).bind('click', function() {
    				if(toolTipContainer) toolTipContainer.toggle(false);
    			});
    	  
    		
		    	
		    	scope.$watch('beDescription', update, true);
		    }
		    };
	});
});
