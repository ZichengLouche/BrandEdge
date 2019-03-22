define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an tooltip anywhere you want to display on realTime.  Any username and password set in the message will appear. 
	 */
	app.directive('beBoxesTable', function($compile) { 
		
		
		return {
		    restrict: 'EA',
		    transclude: true,
		    scope: {
		    	beConstituent : '=',
		    	isAdditional : '=',
		    	beDataSetting: '='
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
//		    		Grey out Employee Information
		    		htmlValue += "<caption class='title'><span>{{beConstituent.constituent}}</span><br><span style='font-weight: normal;font-size: 1rem;' ng-if=\"beConstituent.constituent == 'Employees'\">(Please consult with HR regarding IBMer metrics)</span></caption> "; 
		    		htmlValue += "<thead> ";
		    		htmlValue += "<tr> ";
//		    		htmlValue += (attrs.beBoxesTable == '0' || scope.isAdditional)?"<th class='country'></th> ":"";
//		    		htmlValue += (false)?"<th class='country'></th> ":"";
		    		htmlValue += !scope.beConstituent.isOpen?"<th class='extendDetail'>Brand Health Score &nbsp<a class='icon-open' data-ng-click='childToggle(true, beConstituent.constituent, true)'></a></th> ":"";
		    		htmlValue += scope.beConstituent.isOpen?"<th class='boldDetail'>BHS &nbsp<a class=" +
		    					"'icon-close' data-ng-click='childToggle(true, beConstituent." +
		    							"constituent, false)'></a></th> ":"";
		    		
		    		// xmt 2015.9.15 10:57
		    		if(typeof scope.beConstituent.rows[0].children[0] !== 'undefined'){
		    			for(var x in scope.beConstituent.rows[0].children[0].segments){
		    				if(scope.beConstituent.isOpen && scope.beDataSetting.stages[scope.beConstituent.rows[0].children[0].segments[x].metrics[0].displayName.split(' ')[0].toLowerCase()]){
		    					htmlValue += "<th class='boldDetail'> ";
		    					htmlValue += "<table class='subtable'> ";
		    					htmlValue += "<tr> ";
		    					for(var y in scope.beConstituent.rows[0].children[0].segments[x].metrics){
		    							htmlValue += (y == 0)?"<th class='boldDetail'>{{beConstituent.rows[0].children[0].segments[" + x + "].metrics[" + y + 
		    									"].displayName.split(' ')[0]}}</th> ":scope.isAdditional?"<th class='boldDetail'></th> " : "";
		    					}
		    					htmlValue += "</tr> ";
		    					htmlValue += "</table> ";
		    					htmlValue += "</th> ";
		    				}
		    			}
		    		}else{
		    			for(var x in scope.beConstituent.rows[1].children[0].segments){
		    				if(scope.beConstituent.isOpen && scope.beDataSetting.stages[scope.beConstituent.rows[1].children[0].segments[x].metrics[0].displayName.split(' ')[0].toLowerCase()]){
		    					htmlValue += "<th class='boldDetail'> ";
		    					htmlValue += "<table class='subtable'> ";
		    					htmlValue += "<tr> ";
		    					for(var y in scope.beConstituent.rows[1].children[0].segments[x].metrics){
		    							htmlValue += (y == 0)?"<th class='boldDetail'>{{beConstituent.rows[1].children[0].segments[" + x + "].metrics[" + y + 
		    									"].displayName.split(' ')[0]}}</th> ":scope.isAdditional?"<th class='boldDetail'></th> " : "";
		    					}
		    					htmlValue += "</tr> ";
		    					htmlValue += "</table> ";
		    					htmlValue += "</th> ";
		    				}
		    			}
		    		}
		    		
		    		htmlValue += "</tr> ";
		    		htmlValue += "</thead> ";
		    		htmlValue += scope.beConstituent.isOpen ? "<tr border='0'> " : "";
//		    		htmlValue += (attrs.beBoxesTable == '0' || scope.isAdditional) ? "<th class='country'></th> " : "";
//		    		htmlValue += (false) ? "<th class='country'></th> " : "";
		    		if(typeof scope.beConstituent.rows[0].children[0] !== 'undefined'){
		    			htmlValue += (scope.beConstituent.constituent == 'Employees') ? "<th class='detail'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[0].children[0].scores.shortName : beConstituent.rows[0].children[0].scores.camsShortName}}</th> "
		    						:  "<th class='detail'></th> ";
		    		}else{
		    			htmlValue += (scope.beConstituent.constituent == 'Employees') ? "<th class='detail'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[1].children[0].scores.shortName : beConstituent.rows[1].children[0].scores.camsShortName}}</th> "
	    						:  "<th class='detail'></th> ";
		    		}
		    		if(scope.beConstituent.isOpen){
		    			if(typeof scope.beConstituent.rows[0].children[0] !== 'undefined'){
		    				for(var x in scope.beConstituent.rows[0].children[0].segments){
		    					if(scope.beDataSetting.stages[scope.beConstituent.rows[0].children[0].segments[x].metrics[0].displayName.split(' ')[0].toLowerCase()]){
		    						htmlValue += "<th class='detail'> ";
		    						htmlValue += "<table class='subtable'> ";
		    						htmlValue += "<tr> ";
		    						for(var y in scope.beConstituent.rows[0].children[0].segments[x].metrics){
		    							htmlValue += (y==0)?"<td class='boldDetail'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[0].children[0].segments[" + x + "].metrics[" + y + 
		    									"].shortName : beConstituent.rows[0].children[0].segments[" + x + "].metrics[" + y + 
		    									"].camsShortName}}</td> ":scope.isAdditional?"<td class='detail'>" +
		    									"{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[0].children[0].segments[" + x + 
		    									"].metrics[" + y + "].shortName : beConstituent.rows[0].children[0].segments[" + x + 
		    									"].metrics[" + y + "].camsShortName}}</td> ":"";
		    						}
		    						htmlValue += "</tr> ";
		    						htmlValue += "</table> ";
		    						htmlValue += "</th> ";
		    					}
		    				}
		    			}else{
		    				for(var x in scope.beConstituent.rows[1].children[0].segments){
		    					if(scope.beDataSetting.stages[scope.beConstituent.rows[1].children[0].segments[x].metrics[0].displayName.split(' ')[0].toLowerCase()]){
		    						htmlValue += "<th class='detail'> ";
		    						htmlValue += "<table class='subtable'> ";
		    						htmlValue += "<tr> ";
		    						for(var y in scope.beConstituent.rows[1].children[0].segments[x].metrics){
		    							htmlValue += (y==0)?"<td class='boldDetail'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[1].children[0].segments[" + x + "].metrics[" + y + 
		    										"].shortName : beConstituent.rows[1].children[0].segments[" + x + "].metrics[" + y + 
		    										"].camsShortName}}</td> ":scope.isAdditional?"<td class='detail'>" +
		    										"{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[1].children[0].segments[" + x + 
		    										"].metrics[" + y + "].shortName : beConstituent.rows[1].children[0].segments[" + x + 
		    										"].metrics[" + y + "].camsShortName}}</td> ":"";
		    						}
		    						htmlValue += "</tr> ";
		    						htmlValue += "</table> ";
		    						htmlValue += "</th> ";
		    					}
		    				}
		    			}
		    		}
		    		
		    		htmlValue += "</tr> ";
		    		for(var x in scope.beConstituent.rows){
		    			htmlValue += "<tbody> ";
		    			if(scope.beConstituent.rows[x].segments.length > 0){
		    				htmlValue += "<tr> ";
//		    				if(attrs.beBoxesTable == '0' || scope.isAdditional){
		    				if(false){
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
		    				}
				    		
				    		htmlValue += (!scope.beConstituent.isOpen)?"<td class='boldImageDetail border-bottom' " + 
				    					"data-ng-bind-html='beConstituent.rows[" + x + "].scores | extending' " + 
				    					"rectrangle-tooltip " + 
				    					"current-cell='beConstituent.rows[" + x + "].scores' " +
				    					"row-contituent='beConstituent.constituent' " + 
				    					"row-country='beConstituent.rows[" + x + "].countryName' " + 
				    					"cell-stage='beConstituent.rows[" + x + "].scores' " +
				    					"camss-type='beDataSetting.segmentation'> " +
				    					"</td> ":"<td class='boldImageDetail border-bottom'  " + 
				    					"data-ng-bind-html='beConstituent.rows[" + x + "].scores | scoring' " +
				    					"rectrangle-tooltip " +
				    					"current-cell='beConstituent.rows[" + x + "].scores' " +
				    					"row-contituent='beConstituent.constituent' " +
				    					"row-country='beConstituent.rows[" + x + "].countryName' " +
				    					"cell-stage='beConstituent.rows[" + x + "].scores' " +
				    					"camss-type='beDataSetting.segmentation'> " +
				    					"</td> ";
				    		if(scope.beConstituent.isOpen){
				    			for(var y in scope.beConstituent.rows[x].segments){
				    				if(scope.beDataSetting.stages[scope.beConstituent.rows[x].segments[y].metrics[0].displayName.split(' ')[0].toLowerCase()]){
				    					htmlValue += "<td> ";
				    					htmlValue += "<table class='subtable'> ";
				    					htmlValue += "<tr> ";
				    					for(var z in scope.beConstituent.rows[x].segments[y].metrics){
				    						htmlValue += (z==0)?"<td class='imageDetail border-bottom'  " +
				    								"data-ng-bind-html='beConstituent.rows[" + x + "].segments[" + y + "].metrics[" + z + "] | scoring'  " +
				    								"rectrangle-tooltip " +
				    								"current-cell='beConstituent.rows[" + x + "].segments[" + y + "].metrics[" + z + "]' " +
				    								"row-contituent='beConstituent.constituent' " +
				    								"row-country='beConstituent.rows[" + x + "].countryName' " +
				    								"cell-stage='beConstituent.rows[" + x + "].segments[" + y + "].metrics[0]' " +
				    								"camss-type='beDataSetting.segmentation'> " +
				    								"</td> ":scope.isAdditional?"<td class='imageDetail border-bottom' " +
				    								"data-ng-bind-html='beConstituent.rows[" + x + "].segments[" + y + "].metrics[" + z + "] | rating' " +
				    								"rectrangle-tooltip " +
				    								"current-cell='beConstituent.rows[" + x + "].segments[" + y + "].metrics[" + z + "]' " +
				    								"row-contituent='beConstituent.constituent' " +
				    								"row-country='beConstituent.rows[" + x + "].countryName' " +
				    								"cell-stage='beConstituent.rows[" + x + "].segments[" + y + "].metrics[0]' " +
				    								"camss-type='beDataSetting.segmentation'> " +
				    								"</td> " : "";
				    					}
				    					htmlValue += "<tr> ";
				    					htmlValue += "</table> ";
				    					htmlValue += "</td> ";
				    				}
					    		}
				    		}
				    		htmlValue += "</tr> ";
		    			}
			    		
		    			if(scope.beConstituent.rows[x].segments.length == 0 || scope.beConstituent.rows[x].isOpen){
		    				for(var y in scope.beConstituent.rows[x].children){
		    					htmlValue += "<tr> ";
//					    		htmlValue += (attrs.beBoxesTable == '0' || scope.isAdditional)?"<td class='subcountry'>{{beConstituent.rows[" + x + "].children[" + y + "].countryName}}</td> ":"";
		    					htmlValue += (false)?"<td class='subcountry'>{{beConstituent.rows[" + x + "].children[" + y + "].countryName}}</td> ":"";
		    					htmlValue += !scope.beConstituent.isOpen?"<td class='boldImageDetail'  " +
					    					 "data-ng-bind-html='beConstituent.rows[" + x + "].children[" + y + "].scores | extending' " +
					    					 "data-rectrangle-tooltip " +
					    					 "data-current-cell='beConstituent.rows[" + x + "].children[" + y + "].scores' " +
					    					 "data-row-contituent='beConstituent.constituent' " +
					    					 "data-row-country='beConstituent.rows[" + x + "].children[" + y + "].countryName' " +
					    					 "data-cell-stage='beConstituent.rows[" + x + "].children[" + y + "].scores' " +
					    					 "data-camss-type='beDataSetting.segmentation'> " +
					    					 "</td>" : "<td class='boldImageDetail'  " +
					    					 "data-ng-bind-html='beConstituent.rows[" + x + "].children[" + y + "].scores | scoring' " +
					    					 "data-rectrangle-tooltip " +
					    					 "data-current-cell='beConstituent.rows[" + x + "].children[" + y + "].scores' " +
					    					 "data-row-contituent='beConstituent.constituent' " +
					    					 "data-row-country='beConstituent.rows[" + x + "].children[" + y + "].countryName' " +
					    					 "data-cell-stage='beConstituent.rows[" + x + "].children[" + y + "].scores' " +
					    					 "data-camss-type='beDataSetting.segmentation'> " +
					    					 "</td> ";
					    		if(scope.beConstituent.isOpen){
					    			for(var z in scope.beConstituent.rows[x].children[y].segments){
					    				if(scope.beDataSetting.stages[scope.beConstituent.rows[x].children[y].segments[z].metrics[0].displayName.split(' ')[0].toLowerCase()]){
					    					htmlValue += "<td> ";
					    					htmlValue += "<table class='subtable'> ";
					    					htmlValue += "<tr> ";
					    					for(var i in scope.beConstituent.rows[x].children[y].segments[z].metrics){
					    						htmlValue += (i==0)?"<td class='imageDetail' " +
					    								"data-ng-bind-html='beConstituent.rows[" + x + "].children[" + y + "].segments[" + z + "].metrics[" + i + "] | scoring'  " +
								    		 			"data-rectrangle-tooltip " +
								    		 			"data-current-cell='beConstituent.rows[" + x + "].children[" + y + "].segments[" + z + "].metrics[" + i + "]' " +
								    		 			"data-row-contituent='beConstituent.constituent' " +
								    		 			"data-row-country='beConstituent.rows[" + x + "].children[" + y + "].countryName' " +
								    		 			"data-cell-stage='beConstituent.rows[" + x + "].children[" + y + "].segments[" + z + "].metrics[0]' " +
								    		 			"data-camss-type='beDataSetting.segmentation'> " +
								    		 			"</td> " : scope.isAdditional ? "<td class='imageDetail'  " +
								    		 			"data-ng-bind-html='beConstituent.rows[" + x + "].children[" + y + "].segments[" + z + "].metrics[" + i + "] | rating'  " +
								    		 			"data-rectrangle-tooltip " +
								    		 			"data-current-cell='beConstituent.rows[" + x + "].children[" + y + "].segments[" + z + "].metrics[" + i + "]' " +
								    		 			"data-row-contituent='beConstituent.constituent' " +
								    		 			"data-row-country='beConstituent.rows[" + x + "].children[" + y + "].countryName' " +
								    		 			"data-cell-stage='beConstituent.rows[" + x + "].children[" + y + "].segments[" + z + "].metrics[0]' " +
								    		 			"data-camss-type='beDataSetting.segmentation'> " +
								    		 			"</td> ":"";
					    					}
					    					htmlValue += "<tr> ";
					    					htmlValue += "</table> ";
					    					htmlValue += "</td> ";
					    				}
					    			}
					    		}
					    		htmlValue += "</tr> ";
		    				}
		    			}
			    		
			    		htmlValue += "</tbody> ";
		    		}
		    		
		    		htmlValue += "</table> ";
		    		
		    		elem.html(htmlValue);
					$compile(elem.contents())(scope);
		    	}
		    	
		    	scope.$watch('[beConstituent,isAdditional,beDataSetting]', update, true);
		    }
		  };
	});
});
