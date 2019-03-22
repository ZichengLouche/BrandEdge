define(['BrandEdge/app', 'lib/d3/d3'], function(app) 
{
	app.controller('ExportPdfPopupController', function($scope, $window, ngDialog, ExportService) 
	{
		$scope.curConstituent = $("#constituentId li.ng-scope.active a").text();
		
		$scope.closePopup = function()
		{
			$scope.closeThisDialog();
		};
		
		$scope.closePopupLaunchSupport = function()
		{
		
			$scope.closeThisDialog();
		};
		
		$scope.selectAllChart = function()
		{
			var bCheckAll = $("#selectAllChartId").is(':checked');
			var checklist=$(".metric .checkbox input");
			for(var i=0;i<checklist.length;i++)
			{
				checklist[i].checked = bCheckAll;
			}
		};
		
		$scope.exportSelectPdf = function() {
			var cf = $("[name='columnFormat']").filter(":checked");
			ExportService.setColumn(cf.length==0?'1':cf[0].value);
			
			var cf = $("[name='orientation']").filter(":checked");
			ExportService.setIsLandScape(cf[0].value);
			
			var checkedlist = $(".metric .checkbox input:checked");
			if(checkedlist.length == 0 && $scope.curConstituent == 'WW/IOT Beta'){
				ExportService.exportAllCharts();
				$scope.closeThisDialog();
			}
			if(checkedlist.length>0) {
				var checkedNamelist = new Array();
				for(var i=0;i<checkedlist.length;i++) {
					checkedNamelist.push(checkedlist[i].value);
				}
				ExportService.setCurExportChartNamelist(checkedNamelist);
				ExportService.exportAllCharts();
				$scope.closeThisDialog();
			}
		};

		$scope.getCurChartsName= function()
		{
			$scope.charts = new Array();
			ExportService.setConstituent($scope.curConstituent);
			var curSegment;
			var curEngagement;
			switch ($scope.curConstituent) {
			case "Clients & Prospects": {
				var items = $(".col-lg-4");
				for (var i=0;i<items.length;i++) {
					var item = items[i];
					var chartTitle = item.children[0].children[0].children[0].children[0].children[0].textContent;
					var imageRating ;
					var rating = null;
					if(typeof item.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0]!=='undefined'){
						imageRating = item.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].src;
						if (imageRating.indexOf("green") != -1) {
							rating = 'G';
						}
						else if (imageRating.indexOf("yellow") != -1) {
							rating = 'Y';
						}
						else if (imageRating.indexOf("red") != -1) {
							rating = 'R';
						}
						else if (imageRating.indexOf("grey") != -1) {
							rating = 'Grey';
						}
				}
					
					var chart = {"title":chartTitle,"rating":rating};
					$scope.charts.push(chart);
				}
				break;
			}
			case "Influencers": 
			case 'Strategic Brand Attributes':
			case "Developers":
			{
				var items = $(".col-lg-4");
				for (var i=0;i<items.length;i++) {
					var item = items[i];
					var chartTitle = item.children[0].children[0].children[0].children[0].children[1].innerHTML;
					var imageRating;
					var rating = null;
					if(typeof item.children[0].children[0].children[0].children[0].children[0].children[0]!=='undefined'){
						imageRating = item.children[0].children[0].children[0].children[0].children[0].children[0].src;
						if (imageRating.indexOf("green") != -1) {
							rating = 'G';
						}
						else if (imageRating.indexOf("yellow") != -1) {
							rating = 'Y';
						}
						else if (imageRating.indexOf("red") != -1) {
							rating = 'R';
						}
						else if (imageRating.indexOf("grey") != -1) {
							rating = 'Grey';
						}
					}
					
					var chart = {"title":chartTitle,"rating":rating};
					$scope.charts.push(chart);
				}
				break;
			}
			case "Employees":
				break;

			}
		};
		$scope.getCurChartsName();
	});
});