define(['BrandEdge/app'], function(app) {
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
	 *   beInitItem - set to text of which item should have the active class
	 *   beId - any broadcast to this id will change the active menu item to the payload
	 *   beInit - JSON Object to be used to generate menu.  Sample shown below
	 *   
	 *   	{
    
		      "0":{
		            "text":"Market View"
		          },
		      "1":{
		            "text":"Category",
		            "dropdown":
		                {
		                  "0": { "name":"Cognitive" },
		                  "1": { "name":"Cloud" },
		                  "2": {"name":"Analytics"},
		                  "3": {"name":"Mobile"},
		                  "4": {"name":"Social"},
		                  "5":  {"name":"Security"},
		                  "active":true
		                  
		                },
		            "default": "Category",
		            "itemCount":5
		          },
		      "2":
		          {
		            "text":"Buyer Type",
		            "dropdown":
		                { 
		                  "0": {"name":"IT"},
		                  "1":{"name":"LOB"},
		                  "active":false
		                },
		            "default":"Buyer Type",
		            "itemCount":2
		            
		          },
		      "3":
		          {
		            "text":"Running"
		          },
		      "4":
		          {
		            "text":"Sleeping"
		          },
		      "activeID":1,
		      "itemCount":5
		  };
	 */
	app.directive('beTableTab', function($compile) {
	  return {
	    restrict: 'E',
	    bindToController: true,
	  	controller: "TableTabController as myCtrl",
	    link: function(scope, element, attrs, ctrl) {
	    	
	    	if ((attrs.beText == null) && (attrs.beInit == null)) {
	    	  element.replaceWith($compile("<div>be-text not specified</div>")(scope));
	    		return;
	    	}
	    	
	    	// generate menu object
	    	var newMenuID = null;
	    	if (attrs.beInit != null) {
	    	  newMenuID = ctrl.svc.init(attrs.beInit);
	    	  
	    	} else {
	    	  var items = attrs.beText.split(',');
  	    	  newMenuID = ctrl.svc.buildMenu(items, attrs.beSubText, attrs.beInitItem);
	    	}
	    	
	    	//generate html markup for menu
	    	var tmplString = "<div class=\"beTableTab\">";
	    	
	    	for (var x = 0; x < ctrl.svc.getMenuItemCount(newMenuID); x++) {
	    		if (ctrl.svc.hasDropDown(newMenuID, x)) {
	    			tmplString += "<div class=\"dropdown\" data-ng-click=\"myCtrl.svc.changeActive(" + newMenuID + "," + x + ")\" data-ng-class=\"myCtrl.svc.getCurrentClass(" + newMenuID + "," + x + ")\">" +
	    							"<div class=\"dropdown-toggle\" data-toggle=\"dropdown\">" +
		    							"{{ myCtrl.svc.getMenuText(" + newMenuID + "," + x + ") }}" +
		    							"<ul class=\"dropdown-menu\" role=\"menu\">";
		    		
		    		for (var y = 0; y < ctrl.svc.getMenuItemCount(newMenuID, x); y++) {
		    			//console.log("y = ", y);
		    			tmplString +=   	"<li class=\"dropdown-toggle\" data-toggle=\"dropdown\" data-ng-click=\"myCtrl.svc.changeActive(" + newMenuID + "," + x + "," + ((attrs.beClick != null)?attrs.beClick:null) + ", " + y + ")\">" +
		    									"<a href=\"#\">" + 
		    										(((ctrl.svc.getMenuIconName(newMenuID, x, y) != null) && (ctrl.svc.getMenuIconName(newMenuID, x, y) != "")) ? 
		    										("<img src=\"images/icons/menus/{{ myCtrl.svc.getMenuIconName(" + newMenuID + "," + x + "," +  y + ") }}@1x.png\"/> &nbsp;") : "") +
		    										"{{ myCtrl.svc.getMenuText(" + newMenuID + "," + x + "," + y + ") }}" +
		    									"</a>" +
		    								"</li>";
		    		}
		    		
		    		tmplString += 		"</ul>" +
		    		 				"</div>" +
		    		 			  "</div>";
	    		} else {
	    			tmplString += "<div data-ng-click=\"myCtrl.svc.changeActive(" + newMenuID + "," + x + "," + ((attrs.beClick != null)?attrs.beClick:null) + ")\"" +
		    			 			  " data-ng-class=\"myCtrl.svc.getCurrentClass(" + newMenuID + "," + x + ")\">" +
		    			 			  "<div data-alert-tooltip='{{ myCtrl.svc.getMenuText(" + newMenuID + "," + x + ") }}'>{{ myCtrl.svc.getMenuText(" + newMenuID + "," + x + ") }}</div>" +
		    			 		  "</div>";
	    		}
	    		
	    	}
	    	
	    	tmplString += "</div>";
	    	
	    	//compile and place content
	    	element.replaceWith($compile(tmplString)(scope));
	    	
	    	if (attrs.beId != null) {
	    		scope.$on(attrs.beId, function(event, data) {
					ctrl.svc.setActiveItem(newMenuID, data);
				});
		    }
	    } 
	  }
	});
});