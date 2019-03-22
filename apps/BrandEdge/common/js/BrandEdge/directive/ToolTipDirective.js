define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an tooltip anywhere you want to display on realTime.  Any username and password set in the message will appear. 
	 */
	app.directive('beTooltip', function() { 
		return {
		    restrict: 'A',
		    replace: true,
		    scope: {
		    	currentChartData: '='
		    },
		   
		    link: function(scope, elem, attrs) {
		    	// xmt 2015.6.19 15:26 
		    	var username = scope.currentChartData.user_name ;
		    	var password = scope.currentChartData.password ;
		    	
		    	if(username && password){
		    	   
//		    	  var chartKeys = Object.keys(scope.$parent.chartData).filter(function(item) { return (item == "sortKey")?false:true; });
//		    	  alert("chartKeys:" + chartKeys.length + ",div:" + $("div:contains('To log into')").length + " chartKeyName:" + scope.$parent.chartData[attrs.beTooltip].camssDisplay);
//		    	  console.log(scope.$parent.chartData[attrs.beTooltip].camssDisplay);
//		    	  if($("div:contains('To log into')").length == chartKeys.length) {
//		    		  $("div:contains('To log into')").remove();
//		    	  }
		    	  
		    	  // xmt 2015.6.18 10:13
		    	  var linkName = '';
		    	  if(scope.currentChartData.urlType == 'BERT') {
		    		  linkName = "BrandEdge real time";
		    		  
		    	  } else if(scope.currentChartData.urlType == 'CRIT') {
		    		  linkName = "MDI research";
		    	  }
		    	  
		    	  var toolTipTemplate = '<div class="daterangepicker dropdown-menu">' +
		    	  							'To log into ' + linkName + ' use these credentials:<br>' +
		    	  							'<B>User Name:</B> ' + username + '  <br>' +
		    	  							'<B>Password:</B> ' + password + 
		    	  						'</div>';
         
		    	  var toolTipContainer = $(toolTipTemplate).appendTo('body');
        	  
		    	  elem.bind('mouseover', function() {
		    		  toolTipContainer.toggle(200);
		    		  var parentOffset = { top: 0, left: 0 };
		    		  var parentTopEdge = $(window).height();
		    		  toolTipContainer.css({
		    			  top: 'auto',
		    			  bottom: parentTopEdge - elem.offset().top - elem.outerHeight() -15,
		    			  left: elem.offset().left + 80,
		    			  right: 'auto'
		    		  });
		    	  });
		      
		    	  elem.bind('mouseleave', function() {
		    		  toolTipContainer.toggle(false);
		    	  });
		    	  
		    	  toolTipContainer.bind('mouseover',function() {
		    		  toolTipContainer.toggle(true);
	    		  });
		    	  
		    	  toolTipContainer.bind('mouseleave',function() {
		    		  toolTipContainer.toggle(false);
	    		  });
		    	}
		    }
		  };
	});
});
