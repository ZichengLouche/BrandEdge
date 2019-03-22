define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an tooltip anywhere you want to display on realTime.  Any username and password set in the message will appear. 
	 */
	app.directive('beCountryName', function($compile) { 
		
		
		return {
		    restrict: 'EA',
		    transclude: true,
		    scope: {
		    	beConstituent : '=',
		    	isAdditional : '='
//		    	beDataSetting: '='
		    },
		   
		    link: function(scope, elem, attrs) {
		    	
		    	
		    	scope.childToggle = function(isConstituent, name, toOpen, country){
		    		expandObj = {
		    						isConstituent : isConstituent,
		    						name : name,
		    						toOpen : toOpen,
		    						country : country
		    					};
		    		scope.$emit('partialExpand', expandObj);
		    	}
								
		    	function update(){
		    		if (typeof scope.beConstituent === 'undefined' || scope.beConstituent == null) return;
		    		
		    		var htmlValue = ""
		    		htmlValue += "<table class='layout'> ";
		    		htmlValue += "<caption class='title'></caption> ";
		    		htmlValue += "<thead> ";
		    		htmlValue += "<tr> ";
		    		htmlValue += "<th class='country'></th> ";
		    		
		    		htmlValue += "</tr> ";
		    		htmlValue += "</thead> ";
		    		htmlValue += "<tr border='0'> ";
		    		htmlValue += (true) ? "<th class='country'></th> " : "";
		    		
		    		htmlValue += "</tr> ";
		    		for(var x in scope.beConstituent.rows){
		    			htmlValue += "<tbody> ";
		    			if(scope.beConstituent.rows[x].segments.length > 0){
		    				htmlValue += "<tr> ";
		    					htmlValue += "<td " +
			    					"class='country border-bottom'><div style='float: left;display:inline-block'>" +
			    					"{{beConstituent.rows[" + x + "].countryName}}</div> ";
		    					if((scope.beConstituent.rows[x].countryName != 'WW')){
		    						htmlValue += "<div style='float: right;display:inline-block'> ";
		    						htmlValue += (!scope.beConstituent.rows[x].isOpen)?"<a class='icon-open' " +
		    								"data-ng-click='childToggle(false, beConstituent.constituent, true, " +
		    								"beConstituent.rows[" + x + "].countryName)'>" +
		    								"</a> ":"<a class='icon-close' data-ng-click='" +
		    								"childToggle(false, beConstituent.constituent, false, " +
		    								"beConstituent.rows[" + x + "].countryName)'></a> ";
		    						htmlValue += "</div> ";
		    						
		    					}
		    					htmlValue += "</td> ";
		    				
				    		htmlValue += "</tr> ";
		    			}
			    		
		    			if(scope.beConstituent.rows[x].segments.length == 0 || scope.beConstituent.rows[x].isOpen){
		    				for(var y in scope.beConstituent.rows[x].children){
		    					htmlValue += "<tr> ";
		    					htmlValue += (true)?"<td class='subcountry'>{{beConstituent.rows[" + x + "].children[" + y + "].countryName}}</td> ":"";
					    		htmlValue += "</tr> ";
		    				}
		    			}
			    		
			    		htmlValue += "</tbody> ";
		    		}
		    		
		    		htmlValue += "</table> ";
		    		
		    		elem.html(htmlValue);
					$compile(elem.contents())(scope);
		    	}
		    	
		    	scope.$watch('[beConstituent,isAdditional]', update, true);
		    }
		  };
	});
});
