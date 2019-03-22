define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an tooltip anywhere you want to display on realTime.  Any username and password set in the message will appear. 
	 */
	app.directive('rectrangleTooltip', function($timeout) { 
		return {
		    restrict: 'A',
		    replace: true,
		    scope: {
		    	currentCell: '=',
		    	rowContituent: '=',
		    	rowCountry: '=',
		    	cellStage: '=', 
		    	camssType: '='
		    },
		   
		    link: function(scope, elem, attrs) {
		    	var toolTipTemplate;
		    	var toolTipContainer;
		    	function update(){
		    		var country = scope.rowCountry;
			    	  var constituent = scope.rowContituent;
			    	  var stage;
			    	  if(typeof scope.cellStage.displayName !== 'undefined'){
			    		  stage = scope.cellStage.displayName.split(' ')[0];
			    	  }else{
			    		  stage = 'BHS';
			    	  }
			    	  
			    	  var description;
			    	  
			    	  if(typeof scope.currentCell.displayName !== 'undefined'){
			    		var displayName = scope.camssType == 'allover' ? scope.currentCell.displayName:scope.currentCell.camsDisplayName;
			    	  	if(
			    	  		displayName.indexOf('Belief') > -1 || 
			    	  		displayName.indexOf('Action') > -1 || 
			    	  		displayName.indexOf('Advocacy') > -1
			    	  	  ){
			    	  		description = displayName.split(' ').slice(1).join(' ');
			    	  	}else{
			    	  		description = displayName;
			    	  	}
			    	  }else if(constituent == 'Employees'){
			    	  		description = 'Employee Engagement Index[IBM]';
			    	  }else{
			    		  description = 'Brand Health Score: ' + (scope.currentCell.score || 0);
			    	  }
			    	  
			    	  var rankingRow = '';
			    	  var rangeRow = '';
			    	  if(typeof scope.currentCell.ibmRanking !== 'undefined' &&
			    			  scope.currentCell.ibmRanking != null && 
			    			  scope.currentCell.ibmRanking != '' &&
			    			  constituent != 'Employees'){
			    		  var rankList = ['1st', '2nd', '3rd', 'th'];
			    		  var IBMRanking = 'IBM-' + (scope.currentCell.ibmRanking.length>1?scope.currentCell.ibmRanking:(Number(scope.currentCell.ibmRanking)<4?rankList[Number(scope.currentCell.ibmRanking)-1]:(scope.currentCell.ibmRanking + rankList[3])));
			    		  var topCompanyRanking = scope.currentCell.ibmRanking != '1st' && scope.currentCell.ibmRanking != '1' ?(scope.currentCell.topCompany?'1st-' + scope.currentCell.topCompany : ''):'1st-IBM';
			    		  rankingRow = '<tr>' +
			    		  					'<td class="leftcell" style="font-size: 1.1rem">' + IBMRanking + '</td>' +
			    		  					'<td  class="middlecell"></td>' +
			    		  					'<td class="rightcell" style="font-size: 1.1rem">' + topCompanyRanking + '</td>' +
			    		  				'</tr>';
			    	  }

			    	  if(!(scope.currentCell.rating || scope.currentCell.score) 
			    			  && (scope.currentCell.rating || scope.currentCell.score) != 0){
			    		  rankingRow = '<tr>' +
		  									'<td  class="middlecell" colspan = "3" style="font-size: 1.1rem">No data to display.</td>' +
		  								'</tr>';
			    	  }else if(scope.currentCell.range){
			    		  rangeRow = '<tr>' +
										'<td class="middlecell" colspan = "3" style="font-size: 1.1rem">' + scope.currentCell.range + '</td>' +
									 '</tr>';
			    	  } 
			    	  
			    	  
			    	  
			    	  toolTipTemplate = '<div class="rectrangletooltip openarrow">' +
			    	  							'<table border="1" frame="void" rules="rows">' + 
			    	  								'<tr>' +
			    	  									'<td class="leftcell" style="font-size: 1.1rem">' + country + '</td>' +
			    	  									'<td class="middlecell" style="font-size: 1.5rem; font-weight: bold">' + constituent + '</td>' +
			    	  									'<td class="rightcell" style="font-size: 1.1rem">' + stage + '</td>' +
			    	  								'</tr>' +
			    	  								'<tr>' +
		    	  										'<td class="middlecell" colspan = "3" style="font-size: 1.1rem">' + description + '</td>' +
		    	  									'</tr>' +
		    	  										rankingRow + rangeRow +
	    	  									'</table>' +
			    	  						'</div>';
		    	}
		    	var timer = null;
		    	
		    	elem.hover(function(){
		    		  timer = $timeout(function() {
			    		  update();
			    		  toolTipContainer = $(toolTipTemplate).appendTo('body');
			    		  toolTipContainer.toggle(false);
				    	  toolTipContainer.toggle(200);
			    		  var parentOffset = { top: 0, left: 0 };
			    		  var parentTopEdge = $(window).height();
			    		  toolTipContainer.css({
			    			  top: 'auto',
			    			  bottom: parentTopEdge - elem.offset().top - elem.outerHeight() + 37,
			    			  left: elem.offset().left,
			    			  right: 'auto'
			    		  });
			    	  }, 2000);
		    	  }
		    	  ,function() {
		    		  $timeout.cancel(timer);
		    		  if(toolTipContainer) toolTipContainer.hide(200);
		    	  	}
		    	);
		    	  
		    	scope.$on("$destroy", function( event ) {
		    		if(timer) $timeout.cancel( timer );
		    	});
		    }
		  };
	});
});
