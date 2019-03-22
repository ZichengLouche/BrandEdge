define(['BrandEdge/app'], function(app) 
{
	app.service('StateService', function($state) 
	{
		var keyStore = {};
		
		this.gotoState = function(destination)
		{
			$state.go(destination);
		};
		
		this.setItemState = function(item, value)
		{
			keystore[item] = value;
		}
		
		this.getItemState = function(item)
		{
			return keystore[item];
		}
	});
});