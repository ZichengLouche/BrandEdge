define(['BrandEdge/app'], function(app) 
{
	app.factory('DataUtility', function() 
	{
		var f = {};
		
		f._data = {};
		
		f.getCountry = function()
		{
			return JSON.parse(localStorage.getItem('brand.edge.country'));
		};
		
		f.hasData = function(key)
		{
			return (f._data[key] != null);
		};
		
		f.getData = function(key)
		{
			return f._data[key];
		};
		
		f.setData = function(key, data)
		{
			f._data[key] = data;
		};
		
		f.getSelectedDate = function()
		{
			return JSON.parse(localStorage.getItem('brand.edge.selectedDate'));
		};
		
		return f;
	});
});