define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	app.controller('WwiotController', function($scope, $rootScope, $state, AlertService, BHDataAdapterService, PermissionFactory, BroadcastConstants) {
		_.str = underscore_str;
		
		$scope.allOutcomes = false;
		$scope.geographoes = false;
		$scope.additional = false;
		$scope.enabledAdditional = false;
		$scope.segmentationTrigger = false;
		$scope.enableSegmentation = false;
		$scope.navStyle = {
				position: 'relative',
				width: '90%',
				display: 'inline-block'
		};
		
		$scope.setting = {
							stages: {
									  all: true, 
									  belief: false, 
									  action: false, 
									  advocacy: false
									},
							constituents: {
											all: true, 
											cp: false, 
											influencers: false, 
											developers: false, 
											employees: false
							  			  },
							segmentation: 'allover'
						 };
		
		$scope.toggle = function(key, toOpen, enabled){
			switch(key){
			case 'allOutcomes':
				$scope.allOutcomes = toOpen;
				$scope.enabledAdditional = enabled;
				$scope.additional = false;
				$scope.$broadcast(key, toOpen);
				break;
			case 'geographoes':
				$scope.geographoes = toOpen;
				$scope.$broadcast(key, toOpen);
				break;
			case 'additional':
				$scope.additional = toOpen;
				break;
			default:
				$scope.allOutcomes = false;
				$scope.geographoes = false;
				$scope.additional = false;
				$scope.enabledAdditional = false;
			}
		};
		
		$scope.openSegmentation = function(){
			if(!$scope.enableSegmentation) return;
			$scope.segmentationTrigger = !$scope.segmentationTrigger;
			$scope.navStyle = $scope.segmentationTrigger?{
					position: 'relative',
					'background-color': '#CAE1FF',
					width: '90%',
					display: 'inline-block'
					}:{
						position: 'relative',
						width: '90%',
						display: 'inline-block'
					};
		}
		
		// xmt 2014.7.9 14:46
		BHDataAdapterService.getWWIOTList().then(
			function(response) {
				PermissionFactory.setIotCountries(response);
				$scope.iotCountries = response;
			},
			function(response) {
				AlertService.setAlert(response, "danger");
			}
		);
		
		$scope.$watch('additional',function(newVal, oldVal){
			if(oldVal && !newVal){
				$scope.geographoes = false;
				$scope.$broadcast('geographoes', false);
			}
		});
		
		$scope.$watch('setting.stages.all',function(){
			if($scope.setting.stages.all){
				$scope.setting.stages = {all: true, belief: true, action: true, advocacy: true};
			}else{
				if($scope.setting.stages.belief && $scope.setting.stages.action && $scope.setting.stages.advocacy)
					$scope.setting.stages = {all: false, belief: false, action: false, advocacy: false};
			}
		}, true);
		
		$scope.$watch('setting.constituents.all',function(){
			
			if($scope.setting.constituents.all){
				$scope.setting.constituents = {all: true, cp: true, influencers: true, developers: true, employees: true};
			}else{
				if($scope.setting.constituents.cp && $scope.setting.constituents.influencers && $scope.setting.constituents.developers && $scope.setting.constituents.employees)
					$scope.setting.constituents = {all: false, cp: false, influencers: false, developers: false, employees: false};
			}
		}, true);
		
		$scope.$watch('setting.stages',function(){
			if($scope.setting.stages.belief && $scope.setting.stages.action && $scope.setting.stages.advocacy){
				$scope.setting.stages.all = true;
			}else{
				$scope.setting.stages.all = false;
			}
		}, true);
		
		$scope.$watch('setting.constituents',function(){
			if($scope.setting.constituents.cp && $scope.setting.constituents.influencers && $scope.setting.constituents.developers && $scope.setting.constituents.employees){
				$scope.setting.constituents.all = true;
			}else{
				$scope.setting.constituents.all = false;
			}
		}, true);
		
		$scope.$watch('setting.segmentation',function(newVal, oldVal){
			var segmentationObj = {
									newVal: newVal,
									oldVal: oldVal
								  };
			$scope.$broadcast('segmentation', segmentationObj);
		}, true);
		
		$scope.$on(BroadcastConstants.DateChange, function(event, date){
			$scope.allOutcomes = false;
			$scope.geographoes = false;
			$scope.additional = false;
			$scope.enabledAdditional = false;
        });
		
		$scope.$on('enableSegmentation', function(event, bool){
			$scope.enableSegmentation = bool;
		});
	});
});