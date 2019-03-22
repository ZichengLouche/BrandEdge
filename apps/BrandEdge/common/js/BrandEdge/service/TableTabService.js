define(['BrandEdge/app'], function(app) {
	app.service('TableTabService', function() {
		var ids = -1;
		var ctrl = this;
		var menu = [];
		var lastChange = 0;

		ctrl.getInstance = function() {
			ids += 1;
			return ids;
		};
		
		// change menu to handle clicks
		ctrl.changeActive = function(id, menuItem, callback, dropDownItem) {
		  var fire = true;
		  // prevent excess firings
		  var dt = new Date().getTime();
		  if (dt - lastChange < 100) fire = false;
		  lastChange = dt;
		  
		  //reset menu heading when new heading selected
		  if ((menu[id].activeID != -1) && (menu[id].activeID != menuItem)) {
		    if (menu[id][menu[id].activeID].default != null) {
		      menu[id][menu[id].activeID].text = menu[id][menu[id].activeID].default;
		    }
		  }
		  
		  // set new item as active
		  menu[id].activeID = menuItem;
		  
		  // close dropdown if open and header clicked
		  if (ctrl.hasDropDown(id, menuItem) && typeof menuItem !== 'string') {
		    menu[id][menuItem].dropdown.active = !menu[id][menuItem].dropdown.active;
		  }
		  
		  // close if dropdown item clicked and change text
		  if (dropDownItem != null) {
		    menu[id][menuItem].text = menu[id][menuItem].dropdown[dropDownItem].name;
		    menu[id][menuItem].dropdown.active = !menu[id][menuItem].dropdown.active;
		  }
		  
		  // call callback function is provided
		  // arguments are:
		  //      1 - Text of Item Clicked
		  //      2 - menu ID for reference
		  //      3 - menu object
		  if (angular.isFunction(callback)) {
		    if (dropDownItem != null) {
		      callback(menu[id][menuItem].dropdown[dropDownItem].name, id, menu);
		    } else {
		      callback(menu[id][menuItem].text, id, menu);
		    }
		  }
		}
		
		ctrl.getCurrentClass = function(id, menuItem)
		{
		  var returnValue = "";
		  
		  if (menu[id].activeID == menuItem) 
		  {
		    returnValue = "active";
		    
		    if (menu[id][menuItem].dropdown != null)
  		  {
  		    if (menu[id][menuItem].dropdown.active == false) returnValue = "active2";
  		  }
		  }

		  return returnValue;
		}
		
		ctrl.getMenuItemCount = function(id, dropDownID) {
		  // must compare to != null, otherwise 0 is treated as false value and incorrect result returned.
		  if (dropDownID != null) {
		    return menu[id][dropDownID].itemCount;
		  }
		  
		  return menu[id].itemCount;
		};
		
		ctrl.buildMenu = function(items, subItems, initItemText) {
		  var id = ctrl.getInstance();
		  menu[id] = {};
		  
		  menu[id].activeID = (initItemText != null)?-1:0;
		  menu[id].itemCount = items.length;
		  
		  var subText = null;
		  var drops = [];
		  
		  if (subItems != null) {
		     subText = JSON.parse(subItems);
	    		
	    	 drops = Object.keys(subText);
		  }
		  
		  for (var x in items) {
		    menu[id][x] = {};
		    menu[id][x].text = items[x];
		    if (items[x] == initItemText) {
		    	menu[id].activeID = x;
		    }
		    
		    if (drops.indexOf(items[x]) > -1) {
		       var ddown = subText[items[x]];
		       menu[id][x].dropdown = {};
		       menu[id][x].dropdown.active = false;
		       menu[id][x].default = items[x];
		       menu[id][x].itemCount = ddown.length;
		       for (var y in ddown) {
		         menu[id][x].dropdown[y] = { name: ddown[y].name, icon: ddown[y].icon, };
		         
		         if (ddown[y].name == initItemText) {
			    	menu[id].activeID = x;
			    	menu[id][x].text = ddown[y].name;
			    }
		       }
		    }
		  }
		  
		  return id;
		}
		
		ctrl.getMenuText = function(id, item, dropdownItem) {
		  // must compare to != null, otherwise 0 is treated as false value and incorrect result returned.
		  if (dropdownItem != null) {
		    return menu[id][item].dropdown[dropdownItem].name;
		  }
		  
		  return menu[id][item].text;
		}
		
		ctrl.hasDropDown = function(id, menuItem) {
		  return (menu[id][menuItem].dropdown != null);
		};
		
		ctrl.getMenuIconName = function(id, menuItem, dropDownItem)
		{
		   return menu[id][menuItem].dropdown[dropDownItem].icon;
		};
		
		ctrl.init = function(preDefinedMenu)
		{
		  var id = ctrl.getInstance();
		  menu[id] = JSON.parse(preDefinedMenu);
		  
		  return id;
		}
		
		ctrl.setActiveItem = function(id, text)
		{
			for (var x in menu[id])
			{
				if (menu[id][x].text == text) 
				{
					ctrl.changeActive(id, x);
				}
				else if (menu[id][x].dropdown)
				{
					for (var y in menu[id][x].dropdown)
					{
						if (menu[id][x].dropdown[y].name == text)
						{
							ctrl.changeActive(id, x, null, y);
						}
					}
				}
			}
		}
	});
});