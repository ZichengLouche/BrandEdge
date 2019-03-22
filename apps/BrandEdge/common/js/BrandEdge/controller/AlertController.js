define(['BrandEdge/app'], function(app) 
{
	app.controller('AlertController', function(AlertService) 
	{
		this.AlertService = AlertService;
	});
});