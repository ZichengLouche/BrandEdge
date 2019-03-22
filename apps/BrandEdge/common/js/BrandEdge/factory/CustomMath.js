define(['BrandEdge/app'], function(app) 
{
	app.factory('CustomMath', function() 
	{
		var f = {};
		
		f.mean = function(array)
		{
			var num = 0;
			
			for (var x in array)
			{
				num += array[x];
			}
			
			return num/array.length;
		};
		
		f.squareSum = function(array)
		{
			var mean = f.mean(array);			
			var num = 0;
			
			for (var x in array)
			{
				num += Math.pow(array[x] - mean, 2);
			}
			
			return num;
		};
		
		f.variance = function(array)
		{
			return f.squareSum(array) / array.length;
		};
		
		f.stdDev = function(array)
		{
			// original version expansion of compressed map function below.
			//return Math.sqrt(f.variance(array));
			
			var mean = f.mean(array);
            return Math.sqrt(f.mean(
                array.map(function(value){
                    return Math.pow((value - mean),2);
                })
            ));
		};
		
		/**
		  *  Calculate the rating of an item where the rating is 1 standard deviation above
		  *  or below the mean.
		  *  
		  *  inputs
		  *  
		  *  	value - value to determine rating of
		  *  
		  *  	array - array of values to calculate rating aginst
		  *  
		  *  returns
		  *  	1 = Green
		  *  	2 = Yellow
		  *  	3 = Red
		  *  	null = invalid data and/or unable to determine rating for provided inputs
		  */
		f.getRating = function(value, array)
		{
			if ((array == null) || (array.length == 0) || (value == null)) return null;
			
			var stdDev = f.stdDev(array);
			var mean = f.mean(array);
			
			var points = f.getPoints(array);
			if (points == null) return null;
			
			return (value >= points.point2)?1:(value <= points.point1)?3:2; 
		};
//	The old functionality to get points	by using the sdt dev
//		f.getPoints = function(array)
//		{
//			if ((array == null) || (array.length == 0)) return null;
//			
//			var stdDev = f.stdDev(array);
//			var mean = f.mean(array);
//			
//			return { point1: Math.ceil(mean - stdDev), point2: Math.floor(mean + stdDev) }; 
//		};
		
//		by Sookie get points by using mean/average/norm and value in second place
		f.getPoints = function(array)
		{
			if ((array == null) || (array.length == 0)) return null;
			var second = f.second(array);
			var mean = f.mean(array);
			return { point1: mean, point2: second };
		}; 
		function sortNumber(a,b)
		{
			return b - a
		}
		f.second = function(array)
		{
			if ((array == null) || (array.length == 0)) return null;
			arraySorted = array.sort(sortNumber);	
			max = arraySorted[0];
			
			for (var x in arraySorted)
			{	
					if(arraySorted[x] < max)
					{
						return x > 1 ? max : arraySorted[x];
					}
			}
			return 0;
			
		};
		return f;
	});
});