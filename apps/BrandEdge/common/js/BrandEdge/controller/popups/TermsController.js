define(['BrandEdge/app'], function(app) 
{
	app.controller('TermsController', function($scope, $window, ngDialog) 
	{
		$scope.closePopup = function()
		{
			$scope.$parent.termsCheck = true;
			$scope.closeThisDialog();
		}
		
		$scope.closePopupLaunchSupport = function()
		{
			$window.open('https://w3-connections.ibm.com/communities/service/html/communitystart?communityUuid=c814322f-6fad-4c55-9bf5-743d50014ebe');
			$scope.closeThisDialog();
		}
	});
});