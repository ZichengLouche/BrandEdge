define(['BrandEdge/app'], function(app) 
{
	app.controller('LogonController', function($scope, $state, ngDialog, AnalyticsAdapterFactory) 
	{
		$scope.termsCheck = (localStorage.getItem('brand.edge.terms') == "true");
		
		$scope.doLogin = function() 
		{
			localStorage.setItem('brand.edge.terms', $scope.termsCheck);
			
			if (!$scope.termsCheck)
			{
				BEAppRealmChallengeHandler.writeError("Acceptance of the Terms and Conditions is a requirement to use this application.");
				return false;
			}
			BEAppRealmChallengeHandler.clearMessage();

			// do we have name and password?
			
			// $root.$digest();
			
			
			
			if ($scope.userid == null || $scope.password == null || $scope.userid == "" || $scope.password == "") 
			{
				if($("#psd").val()!=null && $("#psd").val() != "" && $("#userid").val()!=null && $("#userid").val() !="")
				{
					$scope.password=$("#psd").val();
					$scope.userid=$("#userid").val();
				}
				else
				{
					BEAppRealmChallengeHandler.writeError("Please enter your user ID and password");
					return false;
				}
			}
			
			// store userid for later
			//localStorageHelper.set(localStorageHelper.USERID_KEY, userid);
			//CENAppRealmChallengeHandler.setBusy(true);
			BEAppRealmChallengeHandler.loginUser($scope.userid, $scope.password);
		};
		
		$scope.showTerms = function()
		{
			ngDialog.open({
				template: "terms.html",
				controller: 'TermsController',
				className: 'ngdialog-theme-terms',
				showClose: false,
				closeByEscape: false,
				closeByDocument: false,
				scope: $scope
			});
		};
		
	});
});