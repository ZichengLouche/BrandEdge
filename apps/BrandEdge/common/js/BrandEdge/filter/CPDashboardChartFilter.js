define(['BrandEdge/app'], function(app) 
{
	/**
	 *  Specify this directive as an attribute anywhere you want to display an alert message.  Any message set in the AlertService will appear. 
	 */
	app.filter('cpDashChart', function() 
	{
	  function filter(array, showCamss) 
	  {	
		  if (array == null) return;
		  return array.filter(function(item){
			  
			  	var cmpVal = "";
			  	
				switch (item.key)
				{
					case "all":
						cmpVal = "Market View";
						break;
					case "Cognitive": 
					case "Cloud": 
					case "Analytics": 
					case "Mobile": 
					case "Social": 
					case "Security":
						cmpVal = "CCAMSS";
						break;
					case "IT": 
					case "LOB":
						cmpVal = "IT/LOB";
						break;
					case "Clients": 
					case "Prospects":
						cmpVal = "Clients/Prospects";
						break;
				}
				
				return ((item.key == 'all') || (showCamss == cmpVal))?true:false;
		  });
	  }
	  
	  return filter;
	});
});