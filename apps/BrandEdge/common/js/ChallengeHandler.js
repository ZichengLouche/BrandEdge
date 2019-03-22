
	var BEAppRealmChallengeHandler = WL.Client.createChallengeHandler("BEAppRealm");
	
	var busyInd = null;
	window.appVer = "1.0";

	if (typeof WL != "undefined") {
		busyInd = new WL.BusyIndicator('content', {text : 'Logging In'});
	}

	BEAppRealmChallengeHandler.isCustomResponse = function(response) {  
		if (!response || !response.responseJSON	|| response.responseText === null) {
			return false;
		}
		
		if (typeof(response.responseJSON.authRequired) !== 'undefined') {
			return true;
			//return response.responseJSON.authRequired;
		} else {
			return false;
		}
	};

	BEAppRealmChallengeHandler.handleChallenge = function(response) {  
		
		if (response.responseJSON.authRequired == true) {
			var injector = angular.element(document).injector();
			var service = injector.get('StateService');
			service.gotoState('logon');
			
			if (response.responseJSON.errorMessage) {
				BEAppRealmChallengeHandler.writeError(response.responseJSON.errorMessage);
			}
			
			BEAppRealmChallengeHandler.setBusy(false);
			BEAppRealmChallengeHandler.submitFailure();
			
		} else if (response.responseJSON.authRequired == false) {
			BEAppRealmChallengeHandler.submitSuccess();
		}
		
	};
		
	BEAppRealmChallengeHandler.onLoginSuccess = function(event)	{
//		console.log("BEAppRealmChallengeHandler onLoginSuccess");
//		console.log(event);
        try {
            angular.element(document.body).scope().$root.$broadcast("onLoginSuccess", event);
        } catch(err) {
            //err
        }

	};

    BEAppRealmChallengeHandler.onLoginFailure = function(event, userid) {
        //angular.element(document.body).scope().$root.$broadcast("onLoginFailure", event, userid);
    };

	BEAppRealmChallengeHandler.onSuccess = function(event) {
//		console.log("BEAppRealmChallengeHandler onSuccess");
//		console.log(event);
	};
	
	BEAppRealmChallengeHandler.onFailure = function(event) {
//		console.log("BEAppRealmChallengeHandler onFailure");
//		console.log(event);
	};
	
	BEAppRealmChallengeHandler.loginUser = function (userid, password) {
		BEAppRealmChallengeHandler.writeMessage("Authenticating with w3...");
		
		var options = {
			onSuccess: function(e) {    
				var invocationData = {
						adapter : "AuthenticationAdapter",
						procedure : "performAuthentication",
						parameters : [ userid, password ]
					};
				
				BEAppRealmChallengeHandler.submitAdapterAuthentication(invocationData, {
					onSuccess: function(e) {
						BEAppRealmChallengeHandler.writeMessage("Successfully authenticated with w3");
						//JSON.stringify(e);
						BEAppRealmChallengeHandler.setBusy(false);
						BEAppRealmChallengeHandler.onLoginSuccess(e);
						
						var injector = angular.element(document).injector();
						
						// xmt 2014.4.29 16:10
						var credentialsAdapterService = injector.get('CredentialsAdapterService');   
						credentialsAdapterService.getProfile().then(
							function(response) {
								localStorage.setItem('userProfile', response[0]);
								
								// 2014.5.19 10:02 
								var bHDataAdapterService = injector.get('BHDataAdapterService');
								bHDataAdapterService.setProfile(response[0]);
							}, 
							function(response) {
								AlertService.setAlert(response, "danger");
							}
						);
						
						var currentDate = new Date();
						var year = currentDate.getUTCFullYear().toString();
						var month = (currentDate.getUTCMonth() + 1).toString();
	            		var selectedDate = {'startDate': {'year' : year, 'month' : month},
											'endDate': {'year' : year, 'month' : month},
					 					    'current': true};
	                    localStorage.setItem('brand.edge.selectedDate',JSON.stringify(selectedDate));

						var service = injector.get('StateService');
						service.gotoState('landing.dashboard');
					},
						
					onFailure: function(e) {
                        //BEAppRealmChallengeHandler.onLoginFailure(e, userid);
						BEAppRealmChallengeHandler.writeError("AuthenticationAdapter failed to perform authentication. Please try again later");
						BEAppRealmChallengeHandler.setBusy(false);
					}
				});
			},
			
			onFailure: function(e) {
                //BEAppRealmChallengeHandler.onLoginFailure(e, userid);
				BEAppRealmChallengeHandler.writeError("Connect failed to authenticate. Please try again later");
				BEAppRealmChallengeHandler.setBusy(false);
			}
		};
		
		WL.Client.connect(options);
	};
	
	BEAppRealmChallengeHandler.setBusy = function(isBusy) {
		if (isBusy) {
			$("#loginButton").attr("disabled", "disabled").blur();
			if (busyInd) {
				busyInd.show();
			} 
		} else {
			$("#loginButton").removeAttr("disabled");
			if (busyInd) {
				busyInd.hide();
			} 
		}
	};

	BEAppRealmChallengeHandler.writeMessage = function(msg) {
		BEAppRealmChallengeHandler.displayMessage(msg, "info");
	};

	BEAppRealmChallengeHandler.writeError = function(msg) {
		BEAppRealmChallengeHandler.displayMessage(msg, "danger");
	};

	BEAppRealmChallengeHandler.clearMessage = function() {
		BEAppRealmChallengeHandler.displayMessage("", "info");
	};
	
	BEAppRealmChallengeHandler.displayMessage = function(msg, errFlag) {
		var injector = angular.element(document).injector();
		var service = injector.get('AlertService');
		service.setAlert(msg, errFlag, "login");
	};
//	return BEAppRealmChallengeHandler;







