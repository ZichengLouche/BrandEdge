define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('DonutFactory', function(){
		_.str = underscore_str;

        return {
            _colorWeight: {
                "G": 1,
                "#8cd211" : 1,
                "Y": 0,
                "#fdd627" : 0,
                "R": -1,
                "#d74108" : -1,
                "Grey": 0,
                "#ccccdd" : 0
            },
            
            _weightColor: {
            	0: "#fdd627",
            	1: "#fdd627",
            	2: "#8cd211",
            	3: "#8cd211",
            	4: "#d74108",
            },
            
            _colors: {
                "G": "#8cd211",
                "green": "#8cd211",
                "light green": "#b4e051",
                "dark green": "#5aa700",
                "Y": "#fdd627",
                "yellow": "#fdd627",
                "R": "#d74108",
                "red": "#d74108",
                "Grey": "#ccccdd",
                "P": "#FF7D87",
                "pink": "#FF7D87",
                "W": "#ffffff",
                "B1": "#4178be",
                "B2": "#5596e6",
                "B3": "#5aaafa"
            },

            _segments: [
                {
                    color: "Grey",
                    column: "1"
                },
                {
                    color: "Grey",
                    column: "2"
                },
                {
                    color: "Grey",
                    column: "3"
                }
            ],

            _states: {
                "Clients & Prospects": {
                    "Belief": {state: "landing.clientProspect.belief", params: {}},
                    "Action": {state: "landing.clientProspect.action", params: {}},
                    "Advocacy": {state: "landing.clientProspect.advocacy", params: {}}
                },
                "Influencers": {
                    "Belief": {state: "landing.influencers.chart.details", params: { id: 'belief', filter: 'market-view' }},
                    "Action": {state: "landing.influencers.chart.details", params: { id: 'action', filter: 'market-view' }},
                    "Advocacy": {state: "landing.influencers.chart.details", params: { id: 'advocacy', filter: 'market-view' }}
                },
                "Developers": {
                    "Belief": {state: "landing.developers.chart.details", params: { id: 'belief', filter: 'market-view' }},
                    "Action": {state: "landing.developers.chart.details", params: { id: 'action', filter: 'market-view' }},
                    "Advocacy": {state: "landing.developers.chart.details", params: { id: 'advocacy', filter: 'market-view' }}
                },
                "Employees": {
                    "Belief": {state: "landing.employees", params: {}},
                    "Action": {state: "landing.employees", params: {}},
                    "Advocacy": {state: "landing.employees", params: {}}
                }
            },
            
            getState: function(constituent, segment){
                if(constituent == null || segment == null || this._states[constituent] == null || this._states[constituent][segment] == null){
                    return {state: "landing.dashboard", params: {}};
                }

                return this._states[constituent][segment];
            },

            getSegments: function(){
                return [
                    {
                        column: "1",
                        name: "Belief",
                        color: "#4178be",
                        value: "30",
                        outerColor: "#ccccdd",
                        details: {},
                        chart: {
                            margin: "",
                            series: [],
                            values: []
                        }
                    },
                    {
                        column: "2",
                        name: "Action",
                        color: "#5aaafa",
                        value: "30",
                        outerColor: "#ccccdd",
                        details: {},
                        chart: {
                            margin: "",
                            series: [],
                            values: []
                        }
                    },
                    {
                        column: "3",
                        name: "Advocacy",
                        color: "#5596e6",
                        value: "30",
                        outerColor: "#ccccdd",
                        details: {},
                        chart: {
                            margin: "",
                            series: [],
                            values: []
                        }
                    }
                ];
            },

            getCenter: function(){
                return {
                    textColor: "#ffffff",
                    color: "#ffffff",
                    value: null
                };
            },

            getCenterValueAndColor: function (colors) {
                 var value =_.chain(colors)
                        .union(this._segments)
                        .uniq(false, function(v){
                            return v.column;
                        })
                        .reduce((function (total, v) {
                            if(total == null && v.color === "Grey"){
                                return total;
                            }else{
                                return ((total || 0) + this.getColorWeight(v.color));
                            }
                        }).bind(this), null).value();

                if(value == null){
                    return {
                        color: this.getColor("Grey"),
                        value: "--"
                    };
                }else if(value < -1){
                    return {
                        color: this.getColor("R"),
                        value: value
                    };
                }else if(value > 1){
                    return {
                        color: this.getColor("G"),
                        value: value
                    };
                }else{
                    return {
                        color: this.getColor("Y"),
                        value: value
                    };
                }
            },

            getColorWeight: function (code) {
                return this._colorWeight[code] || this._colorWeight["Grey"];
            },

            getColor: function (code) {
                return this._colors[code] || this._colors["Grey"];
            },
            
            //Get color by number
            getWeightColor: function(val){
            		return val >= 0 ? this._weightColor[val] : val == -1 ? this._weightColor[0] : this._weightColor[4];
            },
            
            //Get number by color
            getColorWeight: function(color){
            	return this._colorWeight[color];
            },

            getLabels: function(label) {
                var labels = {
                    "Clients & Prospects": {label: "Clients & Prospects", sortOrder: 0},
                    "Influencers": {label: "Influencers", sortOrder: 1},
                    "Developers": {label: "Developers", sortOrder: 2},
                    "Employees": {label: "Employees", sortOrder: 3}
                };
                return (label)?labels[label]||labels["Clients & Prospects"]:labels;
            },

            getImage: function(color){
                var path = "images/icons/empl/";
                switch (color) {
                    case "light green":
                        return path + "green1@2x.png";
                        break;
                    case "green":
                        return path + "green2@2x.png";
                        break;
                    case "dark green":
                        return path + "green3@2x.png";
                        break;
                    case "red":
                        return path + "red2@2x.png";
                        break;
                    case "dark red":
                        return path + "red2@2x.png";
                        break;
                    case "pink":
                        return path + "red1@2x.png";
                        break;
                    case "yellow":
                        return path + "yellow@2x.png";
                        break;
                    default:
                        return null;
                        break;
                }
            },

            getDonut: function (label, color, rating) {
                return {
                    label: label || "",
                    color: color || this.getColor("W"),
                    rating: rating || 0,
                    center: this.getCenter(),
                    segments: this.getSegments()
                };
            },
            
            getDonutRep: function(belief, action, advocacy)
    		{
    			//var centerValue = ((belief?this.getColorWeight(belief):0) + (action?this.getColorWeight(action):0) + (advocacy?this.getColorWeight(advocacy):0));
    			var centerValue = this.getCenterValueAndColor([{ color: (!belief || belief == 0) ? 'Grey' : belief, column: 1 }, { color: (!action || action == 0) ? 'Grey' : action, column: 2 }, { color: (!advocacy || advocacy == 0) ? 'Grey' : advocacy, column: 3 }]);
    			var returnValue =
    				{
    					"center":{
    						"textColor":"#ffffff",
    						"color": centerValue.color,
    						"value": centerValue.value
    						//"color": this.getColor((centerValue>0)?'G':(centerValue<0)?'R':'Y'),
    						//"value": centerValue
    					},
    					"segments":
    						  [
    					            {
    					            	"outerColor": (belief?this.getColor(belief):this.getColor('Grey')),
    					            	"value":30,
    					            	"name":"Belief",
    					            	"color":"#4178BE",
    					            	"chart":[]
    					            },
    					            {
    					            	"outerColor": (action?this.getColor(action):this.getColor('Grey')),
    					            	"value":30,
    					            	"name":"Action",
    					            	"color":"#5AAAFA",
    					            	"chart":[]
    					            },
    					            {
    					            	"outerColor": (advocacy?this.getColor(advocacy):this.getColor('Grey')),
    					            	"value":30,
    					            	"name":"Advocacy",
    					            	"color":"#5596E6",
    					            	"chart":[]
    					            }
    				           ]
    				};
    			return returnValue;
    		}
        };
	});
});