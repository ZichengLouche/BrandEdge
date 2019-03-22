define(['BrandEdge/app', 'lib/d3/d3'], function(app) 
{
	/**
	 *  Specify this directive as an attribute anywhere you want to display an alert message.  Any message set in the AlertService will appear. 
	 */
	app.filter('scoring', function() 
	{
	  function scoringFilter(beScoring) 
	  {
		  //console.log("Rating =", beRating);
          var myImage = "grey";
          var score = '';
          var trendingImage = '';
          var trending = '';
		  if (beScoring != null)
		  {
			  if (beScoring.rating != null && typeof beScoring.rating !== 'undefined')
			  {
				  if (beScoring.rating == 1)
				  {
					  myImage = "green";
				  }
				  else if (beScoring.rating == 2)
				  {
					  myImage = "yellow";
				  }
				  else if (beScoring.rating == 3)
				  {
					  myImage = "red";
				  }
				  else if (beScoring.rating == 0 || beScoring.rating == 'grey')
				  {
					  myImage = "grey";
				  }
				  else if (beScoring.rating == 'dark green')
				  {
					  myImage = "darkGreen";
				  }
				  else if(beScoring.rating == 'green')
				  {
					  myImage = "Egreen";
				  }
				  else if (beScoring.rating == 'light green')
				  {
					  myImage = "lightGreen";
				  }
				  else if(beScoring.rating == 'yellow'){
					  myImage = "Eyellow";
				  }
				  else if (beScoring.rating == 'pink')
				  {
					  myImage = "pink";
				  }
				  else if(beScoring.rating == 'red'){
					  myImage = "Ered";
				  }
				  
				  if(beScoring.rating != null && beScoring.rating != '' && beScoring.rating != 0){
				  if (beScoring.preRating == 1)
				  {
					  if(beScoring.preRating < beScoring.rating){
						  trendingImage = 'DownGreen';
					  }
				  }
				  else if (beScoring.preRating == 2)
				  {
					  if(beScoring.preRating < beScoring.rating){
						  trendingImage = 'DownYellow';
					  }else if(beScoring.preRating > beScoring.rating){
						  trendingImage = 'UpYellow';
					  }
				  }
				  else if (beScoring.preRating == 3)
				  {
					  if(beScoring.preRating > beScoring.rating){
						  trendingImage = 'UpRed';
					  }
				  }
				  
				  
				  if (beScoring.rating == 'dark green')
				  {
					   trendingImage = 'Checkplusplus';
				  }
				  else if (beScoring.rating == 'green')
				  {
					   trendingImage = 'Checkplus';
				  }
				  else if (beScoring.rating == 'light green')
				  {
					   trendingImage = 'Check';
				  }
				  else if (beScoring.rating == 'pink')
				  {
					   trendingImage = 'Exclamation';
				  }
				  else if (beScoring.rating == 'red')
				  {
					   trendingImage = 'Exclamationminus';
				  }
			  	  }
				  
				  if(trendingImage != ''){
					  trending = '<img src ="images/icons/' + trendingImage + '@1x.png"/>';
				  }
			  }else if(beScoring.score != null){
				  if (beScoring.score >= 1.5)
				  {
					  myImage = "green";
				  }
				  else if (beScoring.score > -1.5 && beScoring.score < 1.5)
				  {
					  myImage = "yellow";
				  }
				  else if (beScoring.score <= -1.5)
				  {
					  myImage = "red";
				  }
				  else if (beScoring.score == 'grey')
				  {
					  myImage = "grey";
				  }
				  else if (beScoring.score == 'dark green')
				  {
					  myImage = "darkGreen";
				  }
				  else if(beScoring.score == 'green')
				  {
					  myImage = "Egreen";
				  }
				  else if (beScoring.score == 'light green')
				  {
					  myImage = "lightGreen";
				  }
				  else if(beScoring.score == 'yellow'){
					  myImage = "Eyellow";
				  }
				  else if (beScoring.score == 'pink')
				  {
					  myImage = "pink";
				  }
				  else if(beScoring.score == 'red'){
					  myImage = "Ered";
				  }
				  
				  if (beScoring.preScore >= 1.5 && beScoring.score < 1.5)
				  {
					  if(beScoring.preScore > beScoring.score){
						  trendingImage = 'DownGreen';
					  }
				  }
				  else if (beScoring.preScore > -1.5 && beScoring.preScore < 1.5 && (beScoring.score >= 1.5 || beScoring.score <= -1.5))
				  {
					  if(beScoring.preScore > beScoring.score){
						  trendingImage = 'DownYellow';
					  }else if(beScoring.preScore < beScoring.score){
						  trendingImage = 'UpYellow';
					  }
				  }
				  else if (beScoring.preScore <= -1.5 && beScoring.score > -1.5)
				  {
					  if(beScoring.preScore < beScoring.score){
						  trendingImage = 'UpRed';
					  }
				  }
				  else if (beScoring.score == 'dark green')
				  {
					   trendingImage = 'Checkplusplus';
				  }
				  else if (beScoring.score == 'green')
				  {
					   trendingImage = 'Checkplus';
				  }
				  else if (beScoring.score == 'light green')
				  {
					   trendingImage = 'Check';
				  }
				  else if (beScoring.score == 'pink')
				  {
					   trendingImage = 'Exclamation';
				  }
				  else if (beScoring.score == 'red')
				  {
					   trendingImage = 'Exclamationminus';
				  }
				  
				  if(trendingImage != ''){
					  trending = '<img src ="images/icons/' + trendingImage + '@1x.png"/>';
				  }
				  
				  score = typeof beScoring.displayName === 'undefined' 
					  		&& typeof beScoring.score !== 'string'?beScoring.score:'';
			  }else{
				  myImage = "grey";
			  }
		  }else{
			  myImage = "grey";
		  }
          return "<span class=\"" + myImage + "icon\">"+ score + trending + "</span>";
	  }
	  
	  return scoringFilter;
	});
});