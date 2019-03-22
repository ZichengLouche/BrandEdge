define(['BrandEdge/app'], function(app) 
{
	app.factory('Utility', function() 
	{
		var f = {};
		
		//using a percentage return margin pixels
		f.getMarginPixels = function(margin, exWidth, exHeight)
		{
			var width = parseInt(exWidth);
			var height = parseInt(exHeight);
			var myMargin = { };
			
			if (!isNaN(parseFloat(margin)) && isFinite(margin))
			{
				myMargin = {
						top: height * margin, 
						right: width * margin, 
						bottom: height * margin, 
						left: width * margin
				};
			}
			else
			{
				var tmpMargin = margin.split(' ');
				
				if (tmpMargin.length == 2)
				{
					myMargin = {
							top: height * parseFloat(tmpMargin[0]), 
							right: width * parseFloat(tmpMargin[1]),
							bottom: height * parseFloat(tmpMargin[0]),
							left: width * parseFloat(tmpMargin[1])
					};
				}
				else if (tmpMargin.length == 3)
				{
					myMargin = {
							top: height * parseFloat(tmpMargin[0]), 
							right: width * parseFloat(tmpMargin[1]),
							bottom: height * parseFloat(tmpMargin[2]),
							left: width * parseFloat(tmpMargin[1])
					};
				}
				else if (tmpMargin.length == 4)
				{
					myMargin = {
							top: height * parseFloat(tmpMargin[0]), 
							right: width * parseFloat(tmpMargin[1]),
							bottom: height * parseFloat(tmpMargin[2]),
							left: width * parseFloat(tmpMargin[3])
					};
				}
				else
				{
					WL.Logger.error("Error Processing margins");
					
					//set defaults
					myMargin = {
							top: height * 0.05, 
							right: width * 0.05, 
							bottom: height * 0.05, 
							left: width * 0.05
					};
				}
			}
			//WL.Logger.info(myMargin);
			return myMargin;
		};
		
		f.beSort = function($scope, key) {
//			console.log("sortKey:", $scope.chartData.sortKey, "sortFlag:", $scope._sortFlag, "key:", key);
			
			var type = "rank";
			//sortFlag = true - sort by rank, false sort by alpha
//			if ($scope._sortFlag == true) {
//				if ($scope.chartData.sortKey == key) {
//					type = "alpha";
//				} else {
//					$scope._sortFlag = !$scope._sortFlag;
//				}
//			} else {	
//				type = "rank";
//			}
//			console.log("type:", type);
//			if ($scope._sortFlag) {
//				if ($scope.chartData.sortKey !== key){
//					$scope._sortFlag = !$scope._sortFlag;
//				}
//				type = "alpha";
//			}
			
			if($scope.chartData.sortKey === key){
				if ($scope._sortFlag) type = "alpha"; else type = "rank";
			}else{
				if($scope._sortFlag) {
					$scope._sortFlag= false; 
					type = "rank";
				}else{
					$scope._sortFlag= true; 
					type = "alpha";
				}
				
//				if ($scope._sortFlag) type = "alpha"; else type = "rank";
			}
			
			$scope._sortFlag = !$scope._sortFlag;
			$scope.chartData.sortKey = key;
			var data = $scope.chartData;
			var rankKey = ($scope.chartValueKey != null)?$scope.chartValueKey:"value"
				
			if (type == "alpha") {
//				Object.keys(data).map(function(current) { 
//					if (current == "sortKey") return; 
					data[key].data.sort(function(a,b) { 
						return (a.name == "IBM") ? -1 : (b.name == "IBM") ? 1 : (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1; 
					}); 
//				});
			} else {
				
				var arrayData = data[key].data.map(function(a, key){
					if (a.positiveValue) {
						return a['yPositiveValue' + rankKey] + a['yNeutralValue' + rankKey];
					} else {
						return a['value' + rankKey];
					}
				});
				arrayData.sort(function(a, b){
					if(a > b) return -1;
					else return 1;
				});
				data[key].data.sort(function(a,b) { 
					return (a.name == "IBM") ? -1 : (b.name == "IBM") ? 1 : f.compareValue(a, b, rankKey); 
				});
				  
//				var names = data[key].data.map(function(item) { return item.name; });
//				
//				var chartKeys = Object.keys(data).filter(function(item) { return (item == "sortKey")?false:true; });
//				
//				//add any extra names to end
//				var subKeys = chartKeys.filter(function (item) { return item != key; });
//				subKeys.map(function(currentKey){
//				  data[currentKey].data.reduce(function(prev, current) { 
//				    if (prev.indexOf(current.name) == -1) prev.push(current.name);
//				    return prev;
//				  }, names)
//				});
//				
//				chartKeys.map(function(currentKey) {
//					var currentLength = data[currentKey].data.length; 
//					data[currentKey].data = names.map(function(item) { 
//				       var x = data[currentKey].data.filter(function(newkey) { return newkey.name == item; });
//				       
//				       if (x.length > 0) 
//				       {
//				    	   return x[0];
//				       }
//				       else
//				       {
//				    	  var newItem = {};
//				    	  Object.keys(data[currentKey].data[0]).map(function (myKey) {
//				    		 if (myKey == "name") 
//				    		 {
//				    			 newItem.name = item;
//				    		 }
//				    		 else if (myKey == "rank")
//				    	   {
//				    			 currentLength++;
//				    			 newItem.rank = currentLength;
//				    	   }
//				    		 else
//				    	   {
//				    			 newItem[myKey] = 0;
//				    	   }
//				    	  });
//				    	  return newItem;
//				       }
//				    });
//				});
			}
			
		}
		
		f.compareValue = function(a, b, key) {
			// xmt 2015.5.21 15:46 Defect 912011:Toggle button order by number is wrong in Positive/Neutral charts at Clients & Prospects
			if (a.positiveValue || a.positiveValue === 0) {
				if ((a['yPositiveValue' + key] + a['yNeutralValue' + key]) > (b['yPositiveValue' + key] + b['yNeutralValue' + key])) {
					return -1;
					
				} else if ((a['yPositiveValue' + key] + a['yNeutralValue' + key]) < (b['yPositiveValue' + key] + b['yNeutralValue' + key])) {
					return 1;
					
				} else {
					return (a.name < b.name)?-1:1;
				}
				
			} else {
				if (a['value' + key] > b['value' + key]) {
					return -1;
					
				} else if (a['value' + key] < b['value' + key]) {
					return 1;
					
				} else {
					return (a.name < b.name)?-1:1;
				}
			}
		}
		
		f.commaFormatNumber = function(num)
		{
			return (num != null)?num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"):null;
		}
		
		f.getAbbrvOrdinal = function(num)
		{
			return (num != null)?parseInt(num)+([,'st','nd','rd'][~~(parseInt(num)/10%10)-1?parseInt(num)%10:0]||'th'):"";
		}
		
		f.parensWrap = function(txt)
		{
			if ((txt == null) || (txt == "")) return;
			return "(" + txt.toString().trim() + ")";
		}
		return f;
	});
});