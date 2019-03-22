define(['BrandEdge/app'], function(app) 
{
	/**
	 *   beText - main menu items (comma separated list) ~ possibly will turn into an array later
	 *   beSubText - main menu items associated with dropdowns
	 *   		{ 
	 *   			item : [{
	 *   						icon: iconName
	 *   						name: menuItem
	 *   					}]
	 *   		}
	 *   beClickHandler - method to handle clicks (will be passed name of icon clicked on)
	 *   beActiveHandler - handler to be called to determine which item should have the active class
	 */
	app.directive('beTableTab', function() 
	{
	  return {
	    restrict: 'E',
	    template: function(element, attrs) {
	    	
	    	var tag = element[0].nodeName;
	    	
	    	if (attrs.beText == null)
	    	{
	    		return "<div>be-text not specified</div>";
	    	}
	    	
	    	var items = attrs.beText.split(',');
	    	
	    	var tmplString = "<div class=\"beTableTab\">";
	    	for (x in items)
	    	{
	    		tmplString += "<span";
	    		if (attrs.beClick != null)
	    		{
	    			tmplString += " data-ng-click=\"" + attrs.beClick + "('" + items[x] + "')\"";
	    		}
	    		tmplString += " data-ng-class=\"{active:isActiveClass('" + items[x] + "')}\"";
	    		tmplString += ">" + items[x] + "</span>";
	    		
	    	}
	    	tmplString += "</div>";
	    	return tmplString;
	    } 
	  };
	});
});