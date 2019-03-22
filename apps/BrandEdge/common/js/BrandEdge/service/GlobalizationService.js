define(['BrandEdge/app'], function(app) 
{
	/**
	 * 	 GlobalizationService
	 * 
	 *   This service implements a basic i18n globalization of resource files.
	 *   
	 *   getBundle(file) - loads the specified resource file
	 *   
	 *   i18n(item, file) - loads the specified resource file and returns the item specified from that file or null if not found
	 *   
	 *   i18n2(item) - returns the specified item from an already loaded resource file, or returns provided key if 
	 *   			   no file is loaded
	 *   
	 *   setLanguage(language) - specifies the language globally in the application.  This is independent of the browser's 
	 *   						 language setting and independent of AngularJS's own rudimentary internationalization 
	 *   						 features.
	 *   
	 *   json file format is:
	 *   
	 *   	{
	 *   		"key": "value",
	 *   		"key2": "value"
	 *   	}
	 *   
	 *   language files are specified as:
	 *   
	 *   		i18n/messages.json
	 *   		i18n/messages-EN.json
	 *   		i18n/messages-FR.json
	 *   
	 *   	or
	 *   
	 *   		i18n/messages.json
	 *   		i18n/EN/messages.json
	 *   		i18n/FR/messages.json
	 *   
	 *   language is set using the GlobalizationService.setLanguage
	 *   
	 *   ** Note ** This is a stateful filter, so language changes take effect immediately
	 *   
	 */
	app.service('GlobalizationService', function($q, $http, $rootScope, $timeout) 
	{
		var svc = this;
        
        svc.bundles = {};
        
        svc.defaultFile = "messages";
		svc.i18nBase = "i18n/";
		svc.jsonExtension = ".json";
        
        svc._isGettingBundle = false;        
        svc._deferreds = {};
        
        svc.getBundle = function(file)
        {
            if (!svc._isGettingBundle)
            {
                return svc._getBundle(file);
            }
            else
            {
                $timeout(function()
                {
                    return svc.getBundle(file);
                }, 500);
            }
        };
        
		svc._getBundle = function(file)
		{
            svc._isGettingBundle = true;
            var tmp = file;
            
            if (file == null) 
            {
                tmp = svc.defaultFile;
            }
            
            if (svc._deferreds[tmp] != null)
            {
                svc._isGettingBundle = false;
                return svc._deferreds[tmp];
            }
            
            svc._deferreds[tmp] = $q.defer();
                        
			// handle the case where the file is already loaded
			if (svc.bundles[tmp] != null)
			{
				svc._deferreds[tmp].resolve(svc.bundles[tmp]);
                svc._isGettingBundle = false;
				return svc._deferreds[tmp].promise;
			}	
			
			if ($rootScope.appLanguage == null)
			{
				$rootScope.appLanguage = "EN";
			}
			
			svc._getMyBundle(tmp)
                .then(function(data)
                {
                    svc.bundles[tmp] = data;
                    svc._isGettingBundle = false;
                    svc._deferreds[tmp].resolve(data);
                },function(failure)
                {
                    svc._isGettingBundle = false;
                    svc._deferreds[tmp].reject(failure);
                });
			
			return svc._deferreds[tmp].promise;
		};
        
        svc._getMyBundle = function(file)
        {
            var deferred = $q.defer();
            
            //start with base file
			var path = svc.i18nBase + file + svc.jsonExtension;
			
            //AngularJS
			$http.get(path, {timeout: 2000 })
            	.success(function(data) {
            		
            		//base file loaded, not look for language overlay
            		//console.log(data);
            		path = svc.i18nBase + file + "-" + $rootScope.appLanguage + svc.jsonExtension;
            		$http.get(path, {timeout: 2000 })
            			.success(function(newData){
            				//language specific file found, overlay base now, then resolve
            				deferred.resolve(svc._overlay(data,newData));
            			})
            			.error(function(err){
            				//language specific file not found check to see if in folder instead
            				path = svc.i18nBase + $rootScope.appLanguage + "/" + file + svc.jsonExtension;
            				
            				$http.get(path, {timeout: 2000 })
	                			.success(function(newData){
	                				//language specific file found, overlay base now, then resolve
	                				deferred.resolve(svc._overlay(data,newData));
	                			})
	                			.error(function(err){
	                				//language specific file not found use base
	                				deferred.resolve(data);
	                			});
            			});
            	})
            	.error(function(failure) {
            		console.log(failure);
            		deferred.reject(failure);
            	});
            
            //JQuery
            /*
            $.get(path)
            	.done(function(data) {
                    data = JSON.parse(data);
            		console.log(data);
            		//base file loaded, not look for language overlay
            		//console.log(data);
            		path = svc.i18nBase + file + "-" + $rootScope.appLanguage + svc.jsonExtension;
            		$.get(path)
            			.done(function(newData){
                            newData = JSON.parse(newData);
            				//language specific file found, overlay base now, then resolve
            				deferred.resolve(svc._overlay(data,newData));
            			})
            			.fail(function(err){
            				//language specific file not found check to see if in folder instead
            				path = svc.i18nBase + $rootScope.appLanguage + "/" + file + svc.jsonExtension;
            				
            				$.get(path)
	                			.done(function(newData){
                                newData = JSON.parse(newData);
	                				//language specific file found, overlay base now, then resolve
	                				deferred.resolve(svc._overlay(data,newData));
	                			})
	                			.fail(function(err){
	                				//language specific file not found use base
	                				deferred.resolve(data);
	                			});
            			});
            	})
            	.fail(function(failure) {
            		console.log(failure);
            		deferred.reject(failure);
            	});
            */
            
            return deferred.promise;
        };
        
		svc.i18n2 = function(item, file)
		{   
			if (svc.bundles[((file == null)?svc.defaultFile:file)] != null)
            {
                return svc.bundles[file][item];
            }
			
			return item; 
		};
		
		svc.i18n = function(item, file)
		{
			var deferred = $q.defer();
			
			//console.log("language = " + $rootScope.appLanguage);
			svc.getBundle(file).then(function(data){
				//console.log(data[item]);
				deferred.resolve(data[item]);
			},function(failure){
				//console.log(failure);
				deferred.resolve(item);
			});
			
			//return item;
			
			return deferred.promise;
		};
		
		svc.setLanguage = function(language)
		{
            if (!svc._isGettingBundle)
            {
                $rootScope.appLanguage = language;
                
                //forceLanguage change
                svc.bundles = {};
                svc._deferreds = {};
            }
            else
            {
                $timeout(function()
                {
                    svc.setLanguage(language);
                }, 500);
            }
			
		};
		
		svc._overlay = function(origData, newData)
		{
			for (x in newData)
			{
				origData[x] = newData[x];
			}
			
			return origData;
		}
	});
});