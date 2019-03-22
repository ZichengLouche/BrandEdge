define(['BrandEdge/app', 'lib/underscore/underscore', 'lib/underscore/underscore.string'], function(app, underscore, underscore_str){
	
	app.factory('CommonUtilityFactory', function(){
        _.str = underscore_str;

        var suffixes = ["th", "st", "nd", "rd"];
        var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

        var pieColors = {
            "Active": "#8CD225",
            "Amplified Active": "#8CD225",
            "Inactive":"#D8D8D8",
            "Amplified Inactive":"#D8D8D8"
        };

        return {

            clean: function(str){
                return (str == null)?null:_.str.clean(str);
            },

            divide: function(x,y){
                if(!isFinite(x) || !isFinite(y)) return NaN;
                return x/y;
            },

            sum: function(){
                if(this.sum.arguments == null || this.sum.arguments.length == 0) return NaN;
                var total = 0;
                for (var x in this.sum.arguments){
                    total = total + parseFloat(this.sum.arguments[x]);
                }
                return total;
            },

            parseFloat: function(x,d){
                return _.isFinite(x)?parseFloat(x):((typeof d != 'undefined')?d:NaN);
            },

            isInteger: function (x) {
                return parseInt(x, 10) == x;
            },

            getPieColor: function(i){
                return pieColors[i] || pieColors["Active"];
            },

            getMonth: function(i){
                return months[i] || months[0];
            },

            numberWithCommas: function(x) {
                return (x)?x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):x;
            },

            computePercent: function(v, t){
                if(!isFinite(v) || !isFinite(t) || !(t > 0)) return v;
                return Math.round((v/t)*10000)/100;
            },
            
            computePercentToAccurte: function(v, t){
            	var array = [];
            	for(var x in v){
            		if(!isFinite(v[x]) || !isFinite(t) || !(t > 0)) array.push(t);
            		array.push(Math.round((v[x]/t)*100));
            	}
            	var amount = array.reduce(function(pre, cur){
            		if(!isFinite(pre) || !isFinite(cur)) return cur;
            		return pre + cur;
            	},0);
            	if(isFinite(amount) && amount != 100 && amount != 0) array[1] = array[1] + (100 - amount);
            	
            	return array;
            },

            convertUnitsToPercent: function(series, func){
                var total = _.reduce(series, function(sum, v){return sum + v.value;}, 0);
                return _.map(series, (function (v, k) {
                    if(angular.isFunction(func)){
                        return func.call(this, v, k);
                    }else{
                        var value = v.value;
                        v.value = this.computePercent(value, total);
                        v.yLabel = this.numberWithCommas(value);
                        return v;

                        //return { name: v.name, value: this.computePercent(v.value, total), yLabel: this.numberWithCommas(v.value), origData: v.origData};
                    }

                }).bind(this));
            },

            getSuffix: function(str){
                if(!this.isInteger(str)) return "";
                var i = parseInt(str, 10);
                return (i <= 3) ? (suffixes[i] || "") : suffixes[0];
            },

            getDisplayRating: function(str, parentheses){
                if(typeof parentheses === "undefined" || parentheses == null ) parentheses = true;
                str = _.str.clean(str);
                if(_.isEmpty(str)) return "";

                if (parentheses){
                    return "(" + str + this.getSuffix(str) + ")";
                }else{
                    return str + this.getSuffix(str);
                }
            },
            
            // xmt 2015.7.24 9:46
            getPeriodRange: function(periodType, year, month, quarter, week){
            	var periodRange = "";
            	if(periodType == "Quarterly"){
            		if(quarter) {
            			periodRange = quarter + "Q " + year;
            		} else {
            			var tmp = Math.floor((month - 1)/3) + 1
            			
            			if ((tmp < 1) || (tmp > 4)) {
            				periodRange = "Invalid Month";
            			} else {
            				periodRange = tmp + "Q " + year;
            			}
            		}
                    
                } else if(periodType == "Monthly" && month && year){
                    periodRange = this.getMonth(parseInt(month) - 1) + " " + year;
                    
                } else if (periodType == "Semi_annual") {
            		if ((parseInt(month) >= 1) && (parseInt(month) < 7)) {
            			periodRange = "1H " + year;
            		} else if ((parseInt(month) >= 7) && (parseInt(month) <= 12)) {
            			periodRange = "2H " + year;
            		} else {
            			periodRange = "Invalid Half";
            		}
            	} else if (periodType == "Annual") {
            		periodRange = year;
            	} else if (periodType == "Weekly") {
            		if(!week) {
            			week = this.getYearWeek(year, month, 1);
            		}
            		
            		periodRange = "Week " + week + ", " + year;
            	}
            	
            	return periodRange;
            },
            
            // xmt 2015.9.1 17:09
            getYearWeek: function (year, month, day) {
            	var myDate = new Date(year, month - 1, day), startDate = new Date(year, 0, 1),
            	d = Math.round((myDate.valueOf() - startDate.valueOf()) / 86400000);
            	return Math.ceil((d + startDate.getDay()) / 7);
            }

        };
	});
});