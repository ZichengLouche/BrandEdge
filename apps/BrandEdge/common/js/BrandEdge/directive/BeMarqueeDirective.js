define(['BrandEdge/app'], function(app) {
	/**
	 *  Specify this directive as an attribute anywhere you want to display an alert message.  Any message set in the AlertService will appear. 
	 */
	app.directive('beMarquee', function($compile) {
		return {
            restrict: 'EA',
            replace: true,
//            transclude: true,
//            template: "<span " +
//            		  "style='color: #000;float: left;font-weight: 900;" +
//            		  "padding-right: 6px; width: 80%;'>{{beContent}}</span>",
//            scope: {
//                beContent: '='
//
//            },
//            controller: function ($scope) {
//            },
//            //
            link: function(scope, element, attrs, ctrl) {
            	var htmlStr = "";
            	function update(){
            		htmlStr = "<ul class='marquee' " +
          		  			  "style='background-color:transparent;border:0;" +
          		  			  "color: #000;float: left;font-weight: 900;" +
          		  			  "padding-right: 6px; width: 80%;margin:1.5%;'><li>" +
          		  			  scope.announcement.content+
          		  			  "<li></ul>";
            		element.html(htmlStr);
            		$(element[0].children).marquee({scrollSpeed: 10,
            										showSpeed: 500, 
            										pauseOnHover: true,
            										pauseSpeed: 2000});
            		$compile(element.contents())(scope);
            	}
            	scope.$watch("announcement.content", function(){
            		update();
            	}, true);
            }
        };
	  
	});
});