define(['BrandEdge/app'], function(app) 
{
	/**
	 *  Specify this directive as an attribute anywhere you want to display an alert message.  Any message set in the AlertService will appear. 
	 */
	app.filter('rating', function() 
	{
	  function ratingFilter(beRating) 
	  {
		  //console.log("Rating =", beRating);
          var myImage = "transparent";
          var returnValue = '';
		  if (beRating != null)
		  {
			  if (beRating.greenStart != null)
			  {
				  if (beRating.IBM > beRating.greenStart)
				  {
					  myImage = "green";
				  }
				  else if (beRating.IBM > beRating.yellowStart)
				  {
					  myImage = "yellow";
				  }
				  else
				  {
					  myImage = "red";
				  }
				  returnValue = '<img src ="images/icons/' + myImage + '@1x.png"/>';
			  }else if(beRating.rating != null){
				  var trendingImage = '';
		          var trending = '';
				  if (beRating.rating == 1)
				  {
					  myImage = "lightgreen";
				  }
				  else if (beRating.rating == 2)
				  {
					  myImage = "lightyellow";
				  }
				  else if (beRating.rating == 3)
				  {
					  myImage = "lightred";
				  }else{
					  myImage = "lightgrey";
				  }
				  
				  if(beRating.rating != null && beRating.rating != '' && beRating.rating != 0){
				  if (beRating.preRating == 1)
				  {
					  if(beRating.preRating < beRating.rating){
						  trendingImage = 'DownGreen';
					  }
				  }
				  else if (beRating.preRating == 2)
				  {
					  if(beRating.preRating < beRating.rating){
						  trendingImage = 'DownYellow';
					  }else if(beRating.preRating > beRating.rating){
						  trendingImage = 'UpYellow';
					  }
				  }
				  else if (beRating.preRating == 3)
				  {
					  if(beRating.preRating > beRating.rating){
						  trendingImage = 'UpRed';
					  }
				  }
				  }
				  if(trendingImage != ''){
					  trending = '<img src ="images/icons/' + trendingImage + '@1x.png"/>';
				  }
				  
				  returnValue = "<span class=\"" + myImage + "icon\">"+ trending +"</span>";
			  }else if((beRating.displayName != null && beRating.rating == null) || beRating.rating == 0){
				  returnValue = "<span class=\"lightgreyicon\"></span>";
			  }
			  else
			  {
				  if ((beRating == 1) || (beRating == 'G'))
				  {
					  myImage = "green";
				  }
				  else if ((beRating == 2) || (beRating == 'Y'))
				  {
					  myImage = "yellow";
				  }
				  else if ((beRating == 3) || (beRating == 'R'))
				  {
					  myImage = "red";
				  }
				  else if ((beRating == 0) || (beRating == 'Grey'))
				  {
					  myImage = "grey";
				  }
				  returnValue = '<img src ="images/icons/' + myImage + '@1x.png"/>';
			  }
		  }else{
			  returnValue = '<img src ="images/icons/' + myImage + '@1x.png"/>';
		  }
          return returnValue;
	  }
	  
	  return ratingFilter;
	});
});