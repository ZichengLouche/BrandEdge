define(['BrandEdge/app'], function(app) {
	/**
	 * 
	 * adapter - Worklight adapter to be called
	 * procedure - name of the procedure to call in the adapter
	 * parameters - parameters to be passed to the adapter
	 * returnKey - the key indicating what is to be returned from the adapter
	 * cacheKey - key indicate which parameter to modification triggers a cache flush
	 *  
	 */
	app.factory('WLAdapterFactory', function($q) {
		var factory = {};
		var localCache = {};
		
		factory.invokeAdapter = function(adapter, procedure, parameters, returnKey, cacheKey, retryFlag) {
			//set default return key
			if (returnKey == null) returnKey = "result";
			var deferred = $q.defer();
			
			if ((cacheKey != null) && (localCache[procedure]) && (localCache[procedure].key == parameters[cacheKey]) && (localCache[procedure].data) && (localCache[procedure].data[JSON.stringify(parameters)])) {
				//if ((cacheFlag) && (localCache[procedure]) && (factory._compareEquality(localCache[procedure].params,parameters)))
			
				//console.log("returning data from cache");
				if (returnKey instanceof Function) {
					deferred.resolve(returnKey(localCache[procedure].data[JSON.stringify(parameters)]));
				} else {
					deferred.resolve(localCache[procedure].data[JSON.stringify(parameters)]);
				}
				
				return deferred.promise;
			}
			
			if ((cacheKey != null) && (localCache[procedure]) && (localCache[procedure].key != parameters[cacheKey])) {
				localCache[procedure].data = {};
			}
			
			var p = (parameters)?(Array.isArray( parameters )?parameters:[parameters]):[]

			var invocationData = 
			{
				adapter : adapter,
				procedure : procedure,
				parameters : p,
				compressResponse : true
			};
			
			WL.Client.invokeProcedure(invocationData, {timeout: 600000}).then(
				function(success){
					if (cacheKey != null) {
						if (!localCache[procedure]) {
							localCache[procedure] = { data: {} };
						}
						localCache[procedure].key = parameters[cacheKey];
						localCache[procedure].data[JSON.stringify(parameters)] = (returnKey == "*")?success.invocationResult:success.invocationResult[returnKey];
					}
					
					if (returnKey instanceof Function) {
						deferred.resolve(returnKey(success));
					} else {
						(returnKey == "*")?deferred.resolve(success.invocationResult):deferred.resolve(success.invocationResult[returnKey]);
					}
				},
				function(failure){
					console.log(invocationData);
					console.log(failure);
					if (!retryFlag) {
						console.log("Retrying one time");
						factory.invokeAdapter(adapter, procedure, parameters, returnKey, cacheKey, true).then(function(success){
							deferred.resolve(success);
						},function(failure){
							deferred.reject(failure);
						})
					} else {
						deferred.reject(failure.errorMsg);
					}
				});
				
				return deferred.promise;
		};
		
		factory._compareEquality = function(value1, value2) {
			if (JSON.stringify(value1) == JSON.stringify(value2)) return true;
			
			return false;
		}
		
		return factory;
	});
});