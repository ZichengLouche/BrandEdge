define(['BrandEdge/app'], function(app) 
{
	/**
	 * 	 CatalizeFilter
	 * 
	 *   Capitalize first letter. 
	 *   For now it has just two options: capitalize all the words in a sentence or 
	 *   capitalizes just the first word of a sentence. It is controlled by parameter all
	 *   
	 *   specify the filter as:  {{ input | capitalize:true/false }}
	 *   
	 */
	app.filter('capitalize', function() {
	    return function(input, all) {
	        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	    }
	});

    /**
     * 	 SuffixFilter
     */
    app.filter('suffix', function(CommonUtilityFactory) {
        return function(input) {
            return input + CommonUtilityFactory.getSuffix(input);
        }
    });

    app.filter('ranking', function(CommonUtilityFactory) {
    	// xmt 2015.6.2 17:45 CEM index metrics only showing their index values
        return function(input, code, parentheses) {
        	if(code && (code == 'CEM1' || code == 'CEM5')) {
        		return "(" + input + ")";
        	}
        	
        	return CommonUtilityFactory.getDisplayRating(input, parentheses);
        }
    });

    app.filter('iconcheck', function() {
        return function(color, x2) {
            x2 = (x2)?"2x":"";
            color = (color == "R")?"red":color;
            color = (color == "Y")?"yellow":color;
            color = (color == "G")?"green":color;

            switch (color) {
                case "light green":
                    return "icon-light-green" + x2;
                    break;
                case "green":
                    return "icon-green" + x2;
                    break;
                case "dark green":
                    return "icon-dark-green" + x2;
                    break;
                case "pink":
                    return "icon-pink" + x2;
                    break;
                case "red":
                    return "icon-red" + x2;
                    break;
                case "yellow":
                    return "icon-yellow" + x2;
                    break;
                default:
                    return "icon-grey" + x2;
                    break;
            }
        }
    });
});