define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('MessageFactory', function(){
        _.str = underscore_str;

        var types = ["success", "info", "warning", "danger"];

        var messages = {
            "country": {msg: "Please select your country.", type: "warning"},
            "date": {msg: "Please select your date.", type: "warning"},
            "no-data": {msg: "No data are available for the selected time period, please select another time period.", type: "info"},
            "default": {msg: "Please specify your message", type: "warning"}
        };

        return {

            getMessage: function(message, type, close){
                var o = messages[message] || (message || messages["default"]);
                return {
                    msg: (_.isObject(o)? o.msg:o),
                    type:  (type || (_.isObject(o)? o.type:type)),
                    close: close
                }
            }


        };
	});
});