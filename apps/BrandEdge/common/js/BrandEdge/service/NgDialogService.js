define(['BrandEdge/app'], function (app) {
	
	app.service('ngDailogService', function ($state, ngDialog) {
		
		return {
			
			simpleDailog: function(message){
				ngDialog.open({
	                template: '<h2>'+message+'</h2>',
	                className: 'ngdialog-theme-default',
	                plain: true,
	                overlay: false
	            });
			},
			
			simpleButtonlDailog: function(message){
				var dialog = ngDialog.open({
                    template:
                        '<p>'+message+'</p>' +
                        '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(1)">OK</button></div>',
                    plain: true
                });
                dialog.closePromise.then(function (data) {
                    console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
                });
			},
			
			simpleComfirmDailog: function(message, page){
				ngDialog.openConfirm({
                    template:
                            '<p>'+message+'</p>' +
                            '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Cancel' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Confirm' +
                            '</button></div>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                })
                .then(function(value){
                    console.log('resolved:' + value);
                    if(page=="logon"){
                    	BEAppRealmChallengeHandler.logout();
                    	BEAppRealmChallengeHandler.timeOutValue = 0;
                    	window.clearInterval(BEAppRealmChallengeHandler.triId);
                    	BEAppRealmChallengeHandler.unBindClickEventOnBody();
                    }else{
                    	$state.go(page);
                    }
                }, function(value){
                    console.log('rejected:' + value);
                });
			},
			
		};
		
    });
	
});