define(['BrandEdge/app'], function(app) 
{
	app.service('CredentialsAdapterService', function($q, WLAdapterFactory) 
	{
		var svc = this;
		
		svc.getGroups = function()
		{
			return svc._invokeAdapterService('getGroups');
		};
		
		svc.getDisplayName = function()
		{
			return svc._invokeAdapterService('getDisplayName');
		};
		
		//xmt 2015.4.29 10:21
		svc.getProfile = function() {
			return svc._invokeAdapterService('getProfile');
		};
		
		svc._invokeAdapterService = function(procedure, parameters, returnKey)
		{
			if (returnKey == null) returnKey = "result";
			
			var deferred = $q.defer();
			
			WLAdapterFactory.invokeAdapter("Credentials", procedure, parameters, returnKey).then(function(success)
			{
				deferred.resolve(success);
			},function(failure)
			{
				deferred.reject(failure);
			});
			
			return deferred.promise;
		}
	});
});