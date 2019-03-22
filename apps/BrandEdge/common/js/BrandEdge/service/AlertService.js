define(['BrandEdge/app'], function(app) {
	/**
	 *  setAlert(message, type, realm) - set a message to be displayed
	 *
	 *  	message = text to display.  text may contain html
	 *  
	 *  	type = one of the Bootstrap alert types to control the background coloring of the message:
	 *  			info - blue
	 *  			danger - red
	 *  			warning - yellow
	 *  			success - green
	 *  
	 *  	realm = isolate message to a specific area
	 *  
	 *  reset - clear any alert message that may be currently displayed.  it is good to call this method upon initialization of page
	 *
	 */
	app.service('AlertService', function($sce) {
		var svc = this;
		
		svc.alertMessage = { defaultRealm : "" };
		
		//info warning danger success
		svc.alertType = { defaultRealm: "info" };
		
		svc.showAlert = { defaultRealm: false };
		
		svc.isAlertSet = function(realm) {
			if (realm) {
				if ((svc.alertMessage[realm] != null) && (svc.alertMessage[realm] != "") && (svc.alertType[realm] != "info")) {
					return true;
				}
			} else {
				if ((svc.alertMessage.defaultRealm != null) && (svc.alertMessage.defaultRealm != "") && (svc.alertType.defaultRealm != "info")) {
					return true;
				}
			}
			return false;
		};
		
		svc.setAlert = function(message, type, realm) {
			if ((typeof message) == "object") message = message.toString();
			if (realm) {	
				svc.alertMessage[realm] = $sce.trustAsHtml(message);
				svc.alertType[realm] = type;
				svc.showAlert[realm] = true;
			} else {
				svc.alertMessage.defaultRealm = $sce.trustAsHtml(message);
				svc.alertType.defaultRealm = type;
				svc.showAlert.defaultRealm = true;
			}
		};
		
		svc.reset = function(realm) {
			if (realm) {
				svc.showAlert[realm] = false;
				svc.alertMessage[realm] = "";
				svc.alertType[realm] = "info";
			} else {
				svc.showAlert.defaultRealm = false;
				svc.alertMessage.defaultRealm = "";
				svc.alertType.defaultRealm = "info";
			}
		};
	});
});