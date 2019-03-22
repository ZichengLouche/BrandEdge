define(['BrandEdge/app'], function(app) 
{
	/**
	 * 	 GlobalizationFilter
	 * 
	 *   Implementation of this filter is fairly straightforward.  Provide as input, the key you wish to receive from a
	 *   language specific json format message file. and specify the name of the file.  If no file name is provided,
	 *   messages.json is used as a default.
	 *   
	 *   specify the filter as:  {{ key | i18n:file }}
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
	app.filter('i18n', function(GlobalizationService) 
	{   
		function globalizationFilter(item, file)
        {
            var value = item;
            var tmp = ((file == null)?GlobalizationService.defaultFile:file);
            
            if (GlobalizationService.bundles[tmp] == null)
			{
				GlobalizationService.getBundle(tmp);
			}
            else
            {
                value = GlobalizationService.bundles[tmp][item];
            }
            
            return value;
        };
        
        globalizationFilter.$stateful = true;

        return globalizationFilter;
	});
});